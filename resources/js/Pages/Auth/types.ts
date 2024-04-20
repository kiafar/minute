import type {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/types';

export type AuthMethod = 'passwordless' | 'withPassword';

type ChangeAuthMethod = {
  changeAuthMethod: (method: AuthMethod) => void;
};

export type LoginPasswordlessProps = ChangeAuthMethod & {
  responseData?: PublicKeyCredentialRequestOptionsJSON;
};

export type LoginWithPasswordProps = ChangeAuthMethod & {
  canResetPassword: boolean;
  status: string;
};

export type LoginProps = LoginWithPasswordProps & LoginPasswordlessProps;

export type RegisterPasswordlessProps = ChangeAuthMethod & {
  responseData?: PublicKeyCredentialCreationOptionsJSON;
};

export type RegisterWithPasswordProps = ChangeAuthMethod;

export type RegisterProps = RegisterWithPasswordProps &
  RegisterPasswordlessProps;
