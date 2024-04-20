import AuthenticationCardLogo from '@/Components/AuthenticationCardLogo';
import { Head } from '@inertiajs/react';
import React from 'react';

interface Props {
  policy: string;
}

export default function PrivacyPolicy({ policy }: Props) {
  return (
    <div>
      <Head title="Privacy Policy" />

      <div className="font-sans text-gray-900 antialiased dark:text-gray-100">
        <div className="bg-gray-100 pt-4 dark:bg-gray-900">
          <div className="flex min-h-screen flex-col items-center pt-6 sm:pt-0">
            <div>
              <AuthenticationCardLogo />
            </div>

            <div
              className="prose mt-6 w-full overflow-hidden bg-white p-6 shadow-md dark:prose-invert dark:bg-gray-800 sm:max-w-2xl sm:rounded-lg"
              dangerouslySetInnerHTML={{ __html: policy }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
