import { InertiaSharedProps } from '@/types';
import { usePage } from '@inertiajs/react';

export default function useTypedPage<T = {}>() {
  return usePage<InertiaSharedProps<T>>();
}
