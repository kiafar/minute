<?php

namespace App\Services;

use App\Models\User;
use Cose\Algorithms;
use GuzzleHttp\Psr7\ServerRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Webauthn\AttestationStatement\AttestationObjectLoader;
use Webauthn\AttestationStatement\AttestationStatementSupportManager;
use Webauthn\AttestationStatement\NoneAttestationStatementSupport;
use Webauthn\AuthenticationExtensions\ExtensionOutputCheckerHandler;
use Webauthn\AuthenticatorAttestationResponse;
use Webauthn\AuthenticatorAttestationResponseValidator;
use Webauthn\AuthenticatorSelectionCriteria;
use Webauthn\PublicKeyCredentialCreationOptions;
use Webauthn\PublicKeyCredentialLoader;
use Webauthn\PublicKeyCredentialParameters;
use Webauthn\PublicKeyCredentialRpEntity;
use Webauthn\PublicKeyCredentialUserEntity;
use Webauthn\TokenBinding\IgnoreTokenBindingHandler;

class AuthenticatorService
{
    const CREDENTIAL_CREATION_OPTIONS_SESSION_KEY =
    'publicKeyCredentialCreationOptions';

    /**
     * Get the public key credential creation options
     *
     * @return \Webauthn\PublicKeyCredentialCreationOptions
     */
    public function getPublicKeyCredentialCreationOptions(string $username): array
    {
        $serializedOptions = PublicKeyCredentialCreationOptions::create(
            rp: $this->getRpEntity(),
            user: $this->getUserEntity($username),
            challenge: $this->getChallenge(),
            pubKeyCredParams: $this->getPublicKeyCredentialParametersList(),
            authenticatorSelection: $this->getAuthenticatorSelectionCriteria(),
            attestation: PublicKeyCredentialCreationOptions::ATTESTATION_CONVEYANCE_PREFERENCE_NONE,
            timeout: config('webauthn.timeout'),
        )->jsonSerialize();

        $serializedOptions = $this->prepareSerializedOptions($serializedOptions);

        return $serializedOptions;
    }

    private function prepareSerializedOptions(array $options): array
    {
        $options['excludeCredentials'] = $options['excludeCredentials'] ?? [];
        $options['rp'] = $options['rp']->jsonSerialize();
        $options['user'] = $options['user']->jsonSerialize();
        $options['authenticatorSelection'] = $options['authenticatorSelection']
            ->jsonSerialize();
        return $options;
    }

    public function validatePublicKeyCredential(array $input): User
    {
        // A repo of our public key credentials
        $pkSourceService = new CredentialSourceService();

        $attestationManager = AttestationStatementSupportManager::create();
        $attestationManager->add(NoneAttestationStatementSupport::create());

        // The validator that will check the response from the device
        $responseValidator = AuthenticatorAttestationResponseValidator::create(
            $attestationManager,
            $pkSourceService,
            IgnoreTokenBindingHandler::create(),
            ExtensionOutputCheckerHandler::create(),
        );

        // A loader that will load the response from the device
        $pkCredentialLoader = PublicKeyCredentialLoader::create(
            AttestationObjectLoader::create($attestationManager)
        );

        $publicKeyCredential = $pkCredentialLoader->load(json_encode($input));

        $authenticatorAttestationResponse = $publicKeyCredential->response;

        if (!$authenticatorAttestationResponse instanceof AuthenticatorAttestationResponse) {
            throw ValidationException::withMessages([
                'username' => 'Invalid response type',
            ]);
        }

        $creationOptions = session(self::CREDENTIAL_CREATION_OPTIONS_SESSION_KEY);
        session()->forget(self::CREDENTIAL_CREATION_OPTIONS_SESSION_KEY);
        try {
            $publicKeyCredentialSource = $responseValidator->check(
                $authenticatorAttestationResponse,
                PublicKeyCredentialCreationOptions::createFromArray(
                    $creationOptions
                ),
                ServerRequest::fromGlobals()
            );
        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                // username is the only field we have, use it to show the error
                'username' => 'Credentials cannot be verified',
            ]);
        }

        $user = User::create([
            'name' => $creationOptions['user']['displayName'],
            'username' => $creationOptions['user']['name'],
        ]);

        $pkSourceService->saveCredentialSource($publicKeyCredentialSource);

        return $user;
    }

    private function getRpEntity(): PublicKeyCredentialRpEntity
    {
        return PublicKeyCredentialRpEntity::create(
            name: config('webauthn.rp.name'),
            id: config('webauthn.rp.id'),
        );
    }

    private function getUserEntity(string $username): PublicKeyCredentialUserEntity
    {
        return PublicKeyCredentialUserEntity::create(
            name: $username,
            id: $this->getUserId(),
            displayName: $username
        );
    }

    private function getUserId(): string
    {
        $uuid = Str::uuid();
        return base64_encode($uuid->getBytes());
    }

    private function getChallenge($length = 32): string
    {
        $bytes = random_bytes($length);
        return base64_encode($bytes);
    }

    private function getPublicKeyCredentialParametersList(): array
    {
        // Priority, from strongest to weakest
        return [
            PublicKeyCredentialParameters::create('public-key', Algorithms::COSE_ALGORITHM_ES256K),
            PublicKeyCredentialParameters::create('public-key', Algorithms::COSE_ALGORITHM_ES256),
            PublicKeyCredentialParameters::create('public-key', Algorithms::COSE_ALGORITHM_RS256),
            PublicKeyCredentialParameters::create('public-key', Algorithms::COSE_ALGORITHM_PS256)
        ];
    }

    private function getAuthenticatorSelectionCriteria(): AuthenticatorSelectionCriteria
    {
        return AuthenticatorSelectionCriteria::create(
            authenticatorAttachment: AuthenticatorSelectionCriteria::AUTHENTICATOR_ATTACHMENT_NO_PREFERENCE,
            requireResidentKey: false,
            residentKey: AuthenticatorSelectionCriteria::RESIDENT_KEY_REQUIREMENT_PREFERRED,
            userVerification: AuthenticatorSelectionCriteria::USER_VERIFICATION_REQUIREMENT_PREFERRED
        );
    }
}
