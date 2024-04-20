<?php

namespace App\Http\Controllers;

use App\Services\AuthenticatorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AuthenticatorController extends Controller
{
    /**
     * Get the public key credential creation options
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */
    public function getPublicKeyCredentialCreationOptions(
        Request $request
    ): RedirectResponse|JsonResponse {
        $options = (new AuthenticatorService())
            ->getPublicKeyCredentialCreationOptions();

        $request->session()->put(
            AuthenticatorService::CRED_CREATION_OPTS_SESSION_KEY,
            $options
        );
        return $this->prepResponse($options);
    }

    /**
     * Validate the public key creation, create the user, and log them in
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function validateRegisterationPublicKey(
        Request $request,
    ): \Illuminate\Http\RedirectResponse {
        $request->validate([
            'publicKeyCredential' => ['required', 'array'],
        ]);

        $service = new AuthenticatorService();
        $user = $service->validateRegistrationPublicKeyCredential(
            $request->publicKeyCredential
        );

        auth()->login($user);

        return redirect()->route('dashboard');
    }

    public function getPublicKeyRequestOptions(
        Request $request
    ): RedirectResponse|JsonResponse {
        $options = (new AuthenticatorService())
            ->getPublicKeyCredentialRequestOptions();

        $request->session()->put(
            AuthenticatorService::CRED_REQUEST_OPTS_SESSION_KEY,
            $options
        );

        return $this->prepResponse($options);
    }

    public function validateLoginAttestationResponse(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'attestationResponse' => ['required', 'array'],
        ]);

        $service = new AuthenticatorService();

        $user = $service->validateLoginAttestationResponse(
            $request->attestationResponse
        );

        auth()->login($user);

        return redirect()->route('dashboard');
    }
}
