import AuthenticationCard from '@/Components/AuthenticationCard';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { Button } from '@/Components/ui/button';
import useRoute from '@/Hooks/useRoute';
import useTypedPage from '@/Hooks/useTypedPage';
import { Link, useForm } from '@inertiajs/react';
import { startRegistration } from '@simplewebauthn/browser';
import type { RegistrationResponseJSON } from '@simplewebauthn/types';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import { Slide, ToastContainer, toast } from 'react-toastify';
import { RegisterPasswordlessProps } from './types';

export default function RegisterPasswordless({
  changeAuthMethod,
  responseData,
}: RegisterPasswordlessProps) {
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
          <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            This application registers users with secure, device-based
            authenticators.&nbsp;
          </p>
          <button
            className="mt-4 cursor-pointer text-sm leading-relaxed text-gray-500 underline dark:text-gray-400"
            onClick={() => changeAuthMethod('withPassword')}
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
                      className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                    >
                      Terms of Service
                    </a>
                    and
                    <a
                      target="_blank"
                      href={route('policy.show')}
                      className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                    >
                      Privacy Policy
                    </a>
                  </div>
                </div>
                <InputError className="mt-2" message={form.errors.terms} />
              </InputLabel>
            </div>
          )}

          <div className="mt-4 flex items-center justify-end">
            <Link
              href={route('login')}
              className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
            >
              Already registered?
            </Link>

            <Button
              className={classNames('ml-4', {
                'opacity-25': form.processing,
              })}
              disabled={form.processing}
            >
              Register
            </Button>
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
