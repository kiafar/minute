import AuthenticationCard from '@/Components/AuthenticationCard';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import useRoute from '@/Hooks/useRoute';
import useTypedPage from '@/Hooks/useTypedPage';
import { Link, useForm } from '@inertiajs/react';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import { Slide, ToastContainer, toast } from 'react-toastify';
import type { registedMethod } from './Register';

import { startRegistration } from '@simplewebauthn/browser';
import type {
  PublicKeyCredentialCreationOptionsJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/types';

type RegisterProps = {
  changeRegisterMethod: (method: registedMethod) => void;
  responseData?: PublicKeyCredentialCreationOptionsJSON;
};

export default function RegisterPasswordless({
  changeRegisterMethod,
  responseData,
}: RegisterProps) {
  const submitCredential = (pkCredential: RegistrationResponseJSON) => {
    form.data.publicKeyCredential = pkCredential;
    const url = route('register.verifyPublickey');
    form.post(url);
  };

  useEffect(() => {
    if (responseData) {
      startRegistration(responseData)
        .then((pkCredential: RegistrationResponseJSON) => {
          submitCredential(pkCredential);
        })
        .catch(err => {
          const msg = err?.response?.data?.message || err;
          console.error('Error creating credential', msg);
          toast.error('Error creating credential');
        });
    }
  }, [responseData]);

  const page = useTypedPage();
  const route = useRoute();
  const form = useForm({
    publicKeyCredential: {},
    terms: false,
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // When the user submits the form for the first time, the subsequent
    // actions are taken care of by the Webauthn API, and useEffect will
    // submit the credential and redirect
    form.put(route('register.getPublicKeyCredentialOptions'));
  }

  return (
    <>
      <AuthenticationCard>
        <form onSubmit={onSubmit}>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
            This application registers users with secure, device-based
            authenticators.&nbsp;
          </p>
          <button
            className="mt-4 text-gray-500 dark:text-gray-400 text-sm leading-relaxed underline text-sm cursor-pointer"
            onClick={() => changeRegisterMethod('withPassword')}
          >
            Register with email and password.
          </button>
          {page.props.jetstream.hasTermsAndPrivacyPolicyFeature && (
            <div className="mt-4">
              <InputLabel htmlFor="terms-1324">
                <div className="flex items-center">
                  <Checkbox
                    name="terms"
                    id="terms-1324"
                    checked={form.data.terms}
                    onChange={e =>
                      form.setData('terms', e.currentTarget.checked)
                    }
                    required
                  />

                  <div className="ml-2">
                    I agree to the
                    <a
                      target="_blank"
                      href={route('terms.show')}
                      className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                    >
                      Terms of Service
                    </a>
                    and
                    <a
                      target="_blank"
                      href={route('policy.show')}
                      className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                    >
                      Privacy Policy
                    </a>
                  </div>
                </div>
                <InputError className="mt-2" message={form.errors.terms} />
              </InputLabel>
            </div>
          )}

          <div className="flex items-center justify-end mt-4">
            <Link
              href={route('login')}
              className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
            >
              Already registered?
            </Link>

            <PrimaryButton
              className={classNames('ml-4', {
                'opacity-25': form.processing,
              })}
              disabled={form.processing}
            >
              Register
            </PrimaryButton>
          </div>
        </form>
      </AuthenticationCard>

      <ToastContainer
        autoClose={3000}
        draggable
        hideProgressBar
        position="bottom-left"
        theme="dark"
        transition={Slide}
      />
    </>
  );
}
