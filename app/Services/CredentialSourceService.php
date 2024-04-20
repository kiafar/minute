<?php

namespace App\Services;

use App\Models\Authenticator;
use App\Models\User;
use Webauthn\PublicKeyCredentialSource;
use Webauthn\PublicKeyCredentialSourceRepository;
use Webauthn\PublicKeyCredentialUserEntity;

/** A repository service to find and store user credentials in DB */
class CredentialSourceService implements PublicKeyCredentialSourceRepository
{
    public function findOneByCredentialId(string $publicKeyCredentialId): ?PublicKeyCredentialSource
    {
        $authenticator = Authenticator::where(
            'credential_id',
            base64_encode($publicKeyCredentialId)
        )->first();

        if (!$authenticator) {
            return null;
        }

        return PublicKeyCredentialSource::createFromArray($authenticator->public_key);
    }

    public function findAllForUserEntity(PublicKeyCredentialUserEntity $publicKeyCredentialUserEntity): array
    {
        return User::with('authenticators')
            ->where('id', $publicKeyCredentialUserEntity->id)
            ->first()
            ->authenticators
            ->toArray();
    }

    public function saveCredentialSource(PublicKeyCredentialSource $publicKeyCredentialSource): void
    {
        $user = User::where(
            'username',
            $publicKeyCredentialSource->userHandle
        )->firstOrFail();

        $user->authenticators()->save(new Authenticator([
            'credential_id' => $publicKeyCredentialSource->publicKeyCredentialId,
            'public_key'    => $publicKeyCredentialSource->jsonSerialize(),
        ]));
    }
}
