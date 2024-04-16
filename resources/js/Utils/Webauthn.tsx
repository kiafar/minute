export type CredentialCreationOptions = {
  attestation: any;
  authenticatorSelection: {
    authenticatorAttachment?: AuthenticatorAttachment;
    residentKey?: ResidentKeyRequirement;
    requireResidentKey?: boolean;
    userVerification: UserVerificationRequirement;
  };
  challenge: string;
  pubKeyCredParams: PublicKeyCredentialParameters[];
  rp: {
    name: string;
    id: string;
  };
  timeout: number;
  user: {
    id: string;
    name: string;
    displayName: string;
  };
};

export const getCredential = async (
  credentialCreationOptions: PublicKeyCredentialCreationOptions,
) => {
  return await navigator.credentials.create({
    publicKey: credentialCreationOptions,
  });
};

export const getAssertion = async (
  credentialRequestOptions: PublicKeyCredentialRequestOptions,
) => {
  return await navigator.credentials.get({
    publicKey: credentialRequestOptions,
  });
};

export function transformCredentialCreationOptions(
  credentialCreationOptions: credentialCreationOptions,
): PublicKeyCredentialCreationOptions {
  const challengeStr = atob(credentialCreationOptions.challenge);
  const userId = atob(credentialCreationOptions.user.id);

  return {
    attestation: credentialCreationOptions.attestation,
    authenticatorSelection: credentialCreationOptions.authenticatorSelection,
    challenge: Uint8Array.from(challengeStr, c => c.charCodeAt(0)),
    pubKeyCredParams: credentialCreationOptions.pubKeyCredParams,
    rp: credentialCreationOptions.rp,
    timeout: credentialCreationOptions.timeout,
    user: {
      ...credentialCreationOptions.user,
      id: Uint8Array.from(userId, c => c.charCodeAt(0)),
    },
  };
}
