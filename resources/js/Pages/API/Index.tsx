import AppLayout from '@/Layouts/AppLayout';
import APITokenManager from '@/Pages/API/Partials/APITokenManager';
import { ApiToken } from '@/types';
import React from 'react';

interface Props {
  tokens: ApiToken[];
  availablePermissions: string[];
  defaultPermissions: string[];
}

export default function ApiTokenIndex({
  tokens,
  availablePermissions,
  defaultPermissions,
}: Props) {
  return (
    <AppLayout
      title={'API Tokens'}
      renderHeader={() => (
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          API Tokens
        </h2>
      )}
    >
      <div>
        <div className="mx-auto max-w-7xl py-10 sm:px-6 lg:px-8">
          <APITokenManager
            tokens={tokens}
            availablePermissions={availablePermissions}
            defaultPermissions={defaultPermissions}
          />
        </div>
      </div>
    </AppLayout>
  );
}
