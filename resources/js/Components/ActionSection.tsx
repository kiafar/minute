import SectionTitle from '@/Components/SectionTitle';
import React, { PropsWithChildren } from 'react';

interface Props {
  title: string;
  description: string;
}

export default function ActionSection({
  title,
  description,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className="md:grid md:grid-cols-3 md:gap-6">
      <SectionTitle title={title} description={description} />

      <div className="mt-5 md:col-span-2 md:mt-0">
        <div className="bg-white px-4 py-5 shadow dark:bg-gray-800 sm:rounded-lg sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
