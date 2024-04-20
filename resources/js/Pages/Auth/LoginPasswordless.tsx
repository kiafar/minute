import AuthenticationCard from '@/Components/AuthenticationCard';
import PrimaryButton from '@/Components/PrimaryButton';
import useRoute from '@/Hooks/useRoute';
import { Link, useForm } from '@inertiajs/react';
import { startAuthentication } from '@simplewebauthn/browser';
import type { AuthenticationResponseJSON } from '@simplewebauthn/types';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import { Slide, ToastContainer, toast } from 'react-toastify';
import type { LoginPasswordlessProps } from './types';

export default function LoginPasswordless({
  responseData,
  changeAuthMethod,
}: LoginPasswordlessProps) {
  const submitCredential = (attestation: AuthenticationResponseJSON) => {
    form.data.attestationResponse = attestation;
    const url = route('login.verifyAttestation');
    form.post(url);
  };

  useEffect(() => {
    if (responseData) {
      startAuthentication(responseData)
        .then((pkCredential: AuthenticationResponseJSON) => {
          submitCredential(pkCredential);
        })
        .catch(err => {
          const msg = err?.response?.data?.message || err;
          console.error('Error creating credential', msg);
          toast.error('Error creating credential');
        });
    }
  }, [responseData]);

  const route = useRoute();
  const form = useForm({
    attestationResponse: {},
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    form.put(route('login.getPublicKeyCredentialOptions'));
  }

  return (
    <>
      <AuthenticationCard>
        <form onSubmit={onSubmit}>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
            This application logins using saved credentials in registration
            step.&nbsp;
          </p>
          <button
            className="mt-4 text-gray-500 dark:text-gray-400 text-sm leading-relaxed underline text-sm cursor-pointer"
            onClick={() => changeAuthMethod('withPassword')}
          >
            Login with email and password.
          </button>

          <div className="flex items-center justify-end mt-4">
            <Link
              href={route('register')}
              className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
            >
              Need an account?
            </Link>

            <PrimaryButton
              className={classNames('ml-4', {
                'opacity-25': form.processing,
              })}
              disabled={form.processing}
            >
              Login
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
