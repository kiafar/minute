export default async function detectWebauthn(): Promise<boolean> {
  if (window.PublicKeyCredential) {
    try {
      const available =
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      return available;
    } catch (err) {
      console.log('Something went wrong.', err);
    }
  }
  return false;
}
