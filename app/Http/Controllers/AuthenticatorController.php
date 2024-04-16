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
        $request->validate([
            'username' => ['required|string|min:3|max:64'],
        ]);

        $options = (new AuthenticatorService())
            ->getPublicKeyCredentialCreationOptions(
                username: $request->username
            );

        $request->session()->put(
            AuthenticatorService::CREDENTIAL_CREATION_OPTIONS_SESSION_KEY,
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
    public function validatePublicKey(
        Request $request,
    ): \Illuminate\Http\RedirectResponse {
        $request->validate([
            'publicKeyCredential' => 'required|array',
        ]);

        $service = new AuthenticatorService();

        $user = $service->validatePublicKeyCredential($request->publicKeyCredential);

        auth()->login($user);

        return redirect()->route('dashboard');
    }
}
