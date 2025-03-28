import useTypedPage from '@/Hooks/useTypedPage';
import classNames from 'classnames';
import React, { useState } from 'react';

export default function Banner() {
  const [show, setShow] = useState(true);
  const { props } = useTypedPage();
  const style = props.jetstream.flash?.bannerStyle || 'success';
  const message = props.jetstream.flash?.banner || '';

  return (
    <div>
      {show && message ? (
        <div
          className={classNames({
            'bg-indigo-500': style == 'success',
            'bg-red-700': style == 'danger',
          })}
        >
          <div className="mx-auto max-w-screen-xl px-3 py-2 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex w-0 min-w-0 flex-1 items-center">
                <span
                  className={classNames('flex rounded-lg p-2', {
                    'bg-indigo-600': style == 'success',
                    'bg-red-600': style == 'danger',
                  })}
                >
                  {(() => {
                    switch (style) {
                      case 'success':
                        return (
                          <svg
                            className="h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        );
                      case 'danger':
                        return (
                          <svg
                            className="h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                        );
                      default:
                        return null;
                    }
                  })()}
                </span>

                <p className="ml-3 truncate text-sm font-medium text-white">
                  {message}
                </p>
              </div>

              <div className="flex-shrink-0 sm:ml-3">
                <button
                  type="button"
                  className={classNames(
                    '-mr-1 flex rounded-md p-2 transition focus:outline-none sm:-mr-2',
                    {
                      'hover:bg-indigo-600 focus:bg-indigo-600':
                        style == 'success',
                      'hover:bg-red-600 focus:bg-red-600': style == 'danger',
                    },
                  )}
                  aria-label="Dismiss"
                  onClick={e => {
                    e.preventDefault();
                    setShow(false);
                  }}
                >
                  <svg
                    className="h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
