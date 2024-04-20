import { detectWebauthn } from '@/Utils';
import { Head } from '@inertiajs/react';
import React, { useMemo, useRef, useState } from 'react';
import { Slide, ToastContainer, toast } from 'react-toastify';
import RegisterPasswordless from './RegisterPasswordless';
import RegisterWithPassword from './RegisterWithPassword';
import type { AuthMethod, RegisterProps } from './types';

export default function Register({ responseData }: RegisterProps) {
  const webauthenAvailable = useRef<boolean>(true);
  const [currentMethod, setCurrentMethod] = useState<AuthMethod | 'unset'>(
    'unset',
  );

  useMemo(() => {
    detectWebauthn().then(result => {
      webauthenAvailable.current = result;
      setCurrentMethod(result ? 'passwordless' : 'withPassword');
    });
  }, []);

  function changeAuthMethod(method: AuthMethod) {
    if (method === 'passwordless' && webauthenAvailable.current) {
      setCurrentMethod('passwordless');
    } else if (method === 'passwordless' && !webauthenAvailable.current) {
      toast.info('Passwordless registration is not available on this device');
    } else {
      setCurrentMethod('withPassword');
    }
  }

  return (
    <>
      <Head title="Register" />
      {currentMethod === 'passwordless' && (
        <RegisterPasswordless
          responseData={responseData}
          changeAuthMethod={changeAuthMethod}
        />
      )}

      {currentMethod === 'withPassword' && (
        <RegisterWithPassword changeAuthMethod={changeAuthMethod} />
      )}

      {currentMethod === 'unset' && (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 dark:bg-gray-900 sm:justify-center sm:pt-0">
          <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md dark:bg-gray-800 sm:max-w-md sm:rounded-lg">
            <div role="status" className="max-w-sm animate-pulse">
              <div className="mb-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="mb-2.5 h-2 max-w-[360px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="mb-2.5 h-2 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="mb-2.5 h-2 max-w-[330px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="mb-2.5 h-2 max-w-[300px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-2 max-w-[360px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      )}

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
