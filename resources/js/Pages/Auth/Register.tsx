import { Head } from '@inertiajs/react';
import React, { useMemo, useRef, useState } from 'react';
import { Slide, ToastContainer, toast } from 'react-toastify';

import { detectWebauthn } from '@/Utils';
import { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/types';

import RegisterPasswordless from './RegisterPasswordless';
import RegisterWithPassword from './RegisterWithPassword';

type RegisterProps = {
  responseData?: PublicKeyCredentialCreationOptionsJSON;
};

export type registedMethod = 'passwordless' | 'withPassword';

export default function Register({ responseData }: RegisterProps) {
  const webauthenAvailable = useRef<boolean>(true);
  const [currentMethod, setCurrentMethod] = useState<registedMethod | 'unset'>(
    'unset',
  );
  useMemo(() => {
    detectWebauthn().then(result => {
      webauthenAvailable.current = result;
      setCurrentMethod(result ? 'passwordless' : 'withPassword');
    });
  }, []);

  function changeRegisterMethod(method: registedMethod) {
    console.log('changeRegisterMethod', method);
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
          changeRegisterMethod={changeRegisterMethod}
        />
      )}

      {currentMethod === 'withPassword' && (
        <RegisterWithPassword changeRegisterMethod={changeRegisterMethod} />
      )}

      {currentMethod === 'unset' && (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 dark:bg-gray-900">
          <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
            <div role="status" className="max-w-sm animate-pulse">
              <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
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
