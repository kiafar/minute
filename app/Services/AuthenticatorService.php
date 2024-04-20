<?php

namespace App\Services;

use App\Models\User;
use Cose\Algorithm\Manager;
use Cose\Algorithm\Signature\ECDSA\ES256;
use Cose\Algorithm\Signature\ECDSA\ES256K;
use Cose\Algorithm\Signature\ECDSA\ES384;
use Cose\Algorithm\Signature\ECDSA\ES512;
use Cose\Algorithm\Signature\EdDSA\Ed256;
use Cose\Algorithm\Signature\EdDSA\Ed512;
use Cose\Algorithm\Signature\RSA\PS256;
use Cose\Algorithm\Signature\RSA\PS384;
use Cose\Algorithm\Signature\RSA\PS512;
use Cose\Algorithm\Signature\RSA\RS256;
use Cose\Algorithm\Signature\RSA\RS384;
use Cose\Algorithm\Signature\RSA\RS512;
use GrantHolle\UsernameGenerator\Username;
use GuzzleHttp\Psr7\ServerRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Webauthn\AttestationStatement\AttestationObjectLoader;
use Webauthn\AttestationStatement\AttestationStatementSupportManager;
use Webauthn\AttestationStatement\NoneAttestationStatementSupport;
use Webauthn\AuthenticationExtensions\ExtensionOutputCheckerHandler;
use Webauthn\AuthenticatorAssertionResponse;
use Webauthn\AuthenticatorAssertionResponseValidator;
use Webauthn\AuthenticatorAttestationResponse;
use Webauthn\AuthenticatorAttestationResponseValidator;
use Webauthn\AuthenticatorSelectionCriteria;
use Webauthn\PublicKeyCredentialCreationOptions;
use Webauthn\PublicKeyCredentialLoader;
use Webauthn\PublicKeyCredentialRequestOptions;
use Webauthn\PublicKeyCredentialRpEntity;
use Webauthn\PublicKeyCredentialUserEntity;
use Webauthn\TokenBinding\IgnoreTokenBindingHandler;

class AuthenticatorService
{
    const CRED_CREATION_OPTS_SESSION_KEY = 'pkCredentialCreationOptions';
    const CRED_REQUEST_OPTS_SESSION_KEY = 'pkCredentialRequestOptions';

    /**
     * Get the public key credential creation options
     *
     * @return \Webauthn\PublicKeyCredentialCreationOptions
     */
    public function getPublicKeyCredentialCreationOptions(): array
    {
        $serializedOptions = PublicKeyCredentialCreationOptions::create(
            rp: $this->getRpEntity(),
            user: $this->getUserEntity(),
            challenge: $this->getChallenge(),
            authenticatorSelection: $this->getAuthenticatorSelectionCriteria(),
            attestation: PublicKeyCredentialCreationOptions::ATTESTATION_CONVEYANCE_PREFERENCE_NONE,
            timeout: config('webauthn.timeout'),
        )->jsonSerialize();

        $serializedOptions = $this->prepareSerializedCreationOptions($serializedOptions);

        return $serializedOptions;
    }

    public function getPublicKeyCredentialRequestOptions(): array
    {
        $serializedOptions = PublicKeyCredentialRequestOptions::create(
            challenge: $this->getChallenge(),
            rpId: config('webauthn.rp.id'),
            timeout: config('webauthn.timeout'),
            userVerification: PublicKeyCredentialRequestOptions::USER_VERIFICATION_REQUIREMENT_REQUIRED,
        )->jsonSerialize();

        return $serializedOptions;
    }

    private function prepareSerializedCreationOptions(array $options): array
    {
        $options['excludeCredentials'] = $options['excludeCredentials'] ?? [];
        $options['rp'] = $options['rp']->jsonSerialize();
        $options['user'] = $options['user']->jsonSerialize();
        $options['authenticatorSelection'] = $options['authenticatorSelection']
            ->jsonSerialize();
        return $options;
    }

    public function validateRegistrationPublicKeyCredential(array $input): User
    {
        $pkSourceService = new CredentialSourceService();
        $attestationManager = AttestationStatementSupportManager::create();
        $attestationManager->add(NoneAttestationStatementSupport::create());
        $responseValidator = AuthenticatorAttestationResponseValidator::create(
            $attestationManager,
            $pkSourceService,
            IgnoreTokenBindingHandler::create(),
            ExtensionOutputCheckerHandler::create(),
        );

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

        $creationOptions = session(self::CRED_CREATION_OPTS_SESSION_KEY);
        session()->forget(self::CRED_CREATION_OPTS_SESSION_KEY);
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
                'message' => 'Credentials cannot be verified',
            ]);
        }

        $user = User::create([
            'name' => $creationOptions['user']['displayName'],
            'username' => $publicKeyCredentialSource->userHandle,
        ]);
        $pkSourceService->saveCredentialSource($publicKeyCredentialSource);
        return $user;
    }

    public function validateLoginAttestationResponse(array $input): User
    {
        $pkSourceRepo = new CredentialSourceService();
        $algorithmManager = $this->getAlgorithmManager();
        $responseValidator = AuthenticatorAssertionResponseValidator::create(
            publicKeyCredentialSourceRepository: $pkSourceRepo,
            algorithmManager: $algorithmManager,
        );

        $attestationManager = AttestationStatementSupportManager::create();
        $attestationManager->add(NoneAttestationStatementSupport::create());
        $pkCredentialLoader = PublicKeyCredentialLoader::create(
            AttestationObjectLoader::create($attestationManager)
        );

        $publicKeyCredential = $pkCredentialLoader->load(json_encode($input));
        $authenticatorAssertionResponse = $publicKeyCredential->response;

        if (!$authenticatorAssertionResponse instanceof AuthenticatorAssertionResponse) {
            throw ValidationException::withMessages([
                'message' => 'Invalid response type',
            ]);
        }

        $requestOptions = session(self::CRED_REQUEST_OPTS_SESSION_KEY);
        session()->forget(self::CRED_REQUEST_OPTS_SESSION_KEY);
        try {
            $publicKeyCredentialSource = $responseValidator->check(
                $publicKeyCredential->rawId,
                $authenticatorAssertionResponse,
                PublicKeyCredentialRequestOptions::createFromArray(
                    $requestOptions
                ),
                ServerRequest::fromGlobals(),
                $authenticatorAssertionResponse->userHandle,
            );
        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                'message' => 'Credentials cannot be verified',
            ]);
        }

        $user = User::where('username', $publicKeyCredentialSource->userHandle)->firstOrFail();
        auth()->login($user);
        return $user;
    }

    private function getRpEntity(): PublicKeyCredentialRpEntity
    {
        return PublicKeyCredentialRpEntity::create(
            name: config('webauthn.rp.name'),
            id: config('webauthn.rp.id'),
        );
    }

    private function getUserEntity(): PublicKeyCredentialUserEntity
    {
        $username = self::generateDisplayName();
        return PublicKeyCredentialUserEntity::create(
            name: $username,
            id: $this->getUserId(),
            displayName: $username
        );
    }

    public static function generateDisplayName(): string
    {
        return (new Username)
            ->withAdjectiveCount(1)
            ->withNounCount(1)
            ->withDigitCount(2)
            ->withCasing('studly')
            ->generate();
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

    private function getAuthenticatorSelectionCriteria(): AuthenticatorSelectionCriteria
    {
        return AuthenticatorSelectionCriteria::create(
            authenticatorAttachment: AuthenticatorSelectionCriteria::AUTHENTICATOR_ATTACHMENT_NO_PREFERENCE,
            requireResidentKey: true,
            residentKey: AuthenticatorSelectionCriteria::RESIDENT_KEY_REQUIREMENT_REQUIRED,
            userVerification: AuthenticatorSelectionCriteria::USER_VERIFICATION_REQUIREMENT_PREFERRED
        );
    }

    private function getAlgorithmManager()
    {
        return Manager::create()->add(
            ES256::create(),
            ES256K::create(),
            ES384::create(),
            ES512::create(),
            RS256::create(),
            RS384::create(),
            RS512::create(),
            PS256::create(),
            PS384::create(),
            PS512::create(),
            Ed256::create(),
            Ed512::create(),
        );
    }
}
