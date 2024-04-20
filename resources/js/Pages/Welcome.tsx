import useRoute from '@/Hooks/useRoute';
import useTypedPage from '@/Hooks/useTypedPage';
import { Head, Link } from '@inertiajs/react';
import React from 'react';

interface Props {
  canLogin: boolean;
  canRegister: boolean;
  laravelVersion: string;
  phpVersion: string;
}

export default function Welcome({
  canLogin,
  canRegister,
  laravelVersion,
  phpVersion,
}: Props) {
  const route = useRoute();
  const page = useTypedPage();

  return (
    <>
      <Head title="Welcome" />

      <div className="bg-dots-darker dark:bg-dots-lighter relative min-h-screen bg-gray-100 bg-center selection:bg-red-500 selection:text-white dark:bg-gray-900 sm:flex sm:items-center sm:justify-center">
        {canLogin ? (
          <div className="p-6 text-right sm:fixed sm:right-0 sm:top-0">
            {page.props.auth.user ? (
              <>
                <Link
                  href={route('dashboard')}
                  className="font-semibold text-gray-600 hover:text-gray-900 focus:rounded-sm focus:outline focus:outline-2 focus:outline-red-500 dark:text-gray-400 dark:hover:text-white"
                >
                  Dashboard
                </Link>
                <Link
                  href={route('tags.manage')}
                  className="ml-4 font-semibold text-gray-600 hover:text-gray-900 focus:rounded-sm focus:outline focus:outline-2 focus:outline-red-500 dark:text-gray-400 dark:hover:text-white"
                >
                  Manage Tags
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={route('login')}
                  className="font-semibold text-gray-600 hover:text-gray-900 focus:rounded-sm focus:outline focus:outline-2 focus:outline-red-500 dark:text-gray-400 dark:hover:text-white"
                >
                  Log in
                </Link>

                {canRegister ? (
                  <Link
                    href={route('register')}
                    className="ml-4 font-semibold text-gray-600 hover:text-gray-900 focus:rounded-sm focus:outline focus:outline-2 focus:outline-red-500 dark:text-gray-400 dark:hover:text-white"
                  >
                    Register
                  </Link>
                ) : null}
              </>
            )}
          </div>
        ) : null}

        <div className="mx-auto max-w-7xl p-6 lg:p-8">
          <div className="flex justify-center">
            <svg
              className="h-16 w-auto bg-gray-100 dark:bg-gray-900"
              fill="#FF2D20"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect height="1" width="12" x="10" y="3" />
              <rect height="1" width="12" x="10" y="3" />
              <rect
                height="1"
                transform="translate(-10 23) rotate(-90)"
                width="19"
                x="-3"
                y="16"
              />
              <rect
                height="1"
                transform="translate(11 40) rotate(-90)"
                width="15"
                x="18"
                y="14"
              />
              <path d="M22,3V4h2a1,1,0,0,1,1,1V7h1V5a2,2,0,0,0-2-2Z" />
              <path d="M10,3V4H8A1,1,0,0,0,7,5V7H6V5A2,2,0,0,1,8,3Z" />
              <path d="M8,30V29H8a1,1,0,0,1-1-1V26H6v2a2,2,0,0,0,2,2Z" />
              <path d="M21.91,21.15c-.57-.32-.91-.72-.91-1.15a6.09,6.09,0,0,1-.21,1.59c-1,4.07-6,7.18-12.12,7.4H8v1h.72c8.86-.15,16.07-3.15,17.14-7A3.77,3.77,0,0,0,26,22,8.72,8.72,0,0,1,21.91,21.15Zm-5.78,7a10.5,10.5,0,0,0,5.54-6,8.94,8.94,0,0,0,3.15.79C24.07,25,20.91,27,16.13,28.13Z" />
              <path d="M17,7V8H16a1,1,0,0,1-1-1V5h1V7Z" />
              <path d="M16,7V8h1a1,1,0,0,0,1-1V5H17V7Z" />
              <path d="M17,3V2H16a1,1,0,0,0-1,1V4h1V3Z" />
              <path d="M16,3V2h1a1,1,0,0,1,1,1V5H17V3Z" />
            </svg>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
              <a
                href="https://laravel.com/docs"
                className="duration-250 flex scale-100 rounded-lg bg-white from-gray-700/50 via-transparent p-6 shadow-2xl shadow-gray-500/20 transition-all focus:outline focus:outline-2 focus:outline-red-500 motion-safe:hover:scale-[1.01] dark:bg-gray-800/50 dark:bg-gradient-to-bl dark:shadow-none dark:ring-1 dark:ring-inset dark:ring-white/5"
              >
                <div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-800/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      className="h-7 w-7 stroke-red-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                      />
                    </svg>
                  </div>

                  <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                    Documentation
                  </h2>

                  <p className="mt-4 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                    Laravel has wonderful documentation covering every aspect of
                    the framework. Whether you are a newcomer or have prior
                    experience with Laravel, we recommend reading our
                    documentation from beginning to end.
                  </p>
                </div>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  className="mx-6 h-6 w-6 shrink-0 self-center stroke-red-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                  />
                </svg>
              </a>

              <a
                href="https://laracasts.com"
                className="duration-250 flex scale-100 rounded-lg bg-white from-gray-700/50 via-transparent p-6 shadow-2xl shadow-gray-500/20 transition-all focus:outline focus:outline-2 focus:outline-red-500 motion-safe:hover:scale-[1.01] dark:bg-gray-800/50 dark:bg-gradient-to-bl dark:shadow-none dark:ring-1 dark:ring-inset dark:ring-white/5"
              >
                <div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-800/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      className="h-7 w-7 stroke-red-500"
                    >
                      <path
                        strokeLinecap="round"
                        d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                  </div>

                  <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                    Laracasts
                  </h2>

                  <p className="mt-4 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                    Laracasts offers thousands of video tutorials on Laravel,
                    PHP, and JavaScript development. Check them out, see for
                    yourself, and massively level up your development skills in
                    the process.
                  </p>
                </div>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  className="mx-6 h-6 w-6 shrink-0 self-center stroke-red-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                  />
                </svg>
              </a>

              <a
                href="https://laravel-news.com"
                className="duration-250 flex scale-100 rounded-lg bg-white from-gray-700/50 via-transparent p-6 shadow-2xl shadow-gray-500/20 transition-all focus:outline focus:outline-2 focus:outline-red-500 motion-safe:hover:scale-[1.01] dark:bg-gray-800/50 dark:bg-gradient-to-bl dark:shadow-none dark:ring-1 dark:ring-inset dark:ring-white/5"
              >
                <div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-800/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      className="h-7 w-7 stroke-red-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
                      />
                    </svg>
                  </div>

                  <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                    Laravel News
                  </h2>

                  <p className="mt-4 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                    Laravel News is a community driven portal and newsletter
                    aggregating all of the latest and most important news in the
                    Laravel ecosystem, including new package releases and
                    tutorials.
                  </p>
                </div>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  className="mx-6 h-6 w-6 shrink-0 self-center stroke-red-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                  />
                </svg>
              </a>

              <div className="duration-250 flex scale-100 rounded-lg bg-white from-gray-700/50 via-transparent p-6 shadow-2xl shadow-gray-500/20 transition-all focus:outline focus:outline-2 focus:outline-red-500 motion-safe:hover:scale-[1.01] dark:bg-gray-800/50 dark:bg-gradient-to-bl dark:shadow-none dark:ring-1 dark:ring-inset dark:ring-white/5">
                <div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-800/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      className="h-7 w-7 stroke-red-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 002.288-4.042 1.087 1.087 0 00-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 01-.98-.314l-.295-.295a1.125 1.125 0 010-1.591l.13-.132a1.125 1.125 0 011.3-.21l.603.302a.809.809 0 001.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 001.528-1.732l.146-.292M6.115 5.19A9 9 0 1017.18 4.64M6.115 5.19A8.965 8.965 0 0112 3c1.929 0 3.716.607 5.18 1.64"
                      />
                    </svg>
                  </div>

                  <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                    Vibrant Ecosystem
                  </h2>

                  <p className="mt-4 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                    Laravel's robust library of first-party tools and libraries,
                    such as{' '}
                    <a
                      href="https://forge.laravel.com"
                      className="underline hover:text-gray-700 focus:rounded-sm focus:outline focus:outline-2 focus:outline-red-500 dark:hover:text-white"
                    >
                      Forge
                    </a>
                    ,{' '}
                    <a
                      href="https://vapor.laravel.com"
                      className="underline hover:text-gray-700 focus:rounded-sm focus:outline focus:outline-2 focus:outline-red-500 dark:hover:text-white"
                    >
                      Vapor
                    </a>
                    ,{' '}
                    <a
                      href="https://nova.laravel.com"
                      className="underline hover:text-gray-700 focus:rounded-sm focus:outline focus:outline-2 focus:outline-red-500 dark:hover:text-white"
                    >
                      Nova
                    </a>
                    , and{' '}
                    <a
                      href="https://envoyer.io"
                      className="underline hover:text-gray-700 focus:rounded-sm focus:outline focus:outline-2 focus:outline-red-500 dark:hover:text-white"
                    >
                      Envoyer
                    </a>{' '}
                    help you take your projects to the next level. Pair them
                    with powerful open source libraries like{' '}
                    <a
                      href="https://laravel.com/docs/billing"
                      className="underline hover:text-gray-700 focus:rounded-sm focus:outline focus:outline-2 focus:outline-red-500 dark:hover:text-white"
                    >
                      Cashier
                    </a>
                    ,{' '}
                    <a
                      href="https://laravel.com/docs/dusk"
                      className="underline hover:text-gray-700 focus:rounded-sm focus:outline focus:outline-2 focus:outline-red-500 dark:hover:text-white"
                    >
                      Dusk
                    </a>
                    ,{' '}
                    <a
                      href="https://laravel.com/docs/broadcasting"
                      className="underline hover:text-gray-700 focus:rounded-sm focus:outline focus:outline-2 focus:outline-red-500 dark:hover:text-white"
                    >
                      Echo
                    </a>
                    ,{' '}
                    <a
                      href="https://laravel.com/docs/horizon"
                      className="underline hover:text-gray-700 focus:rounded-sm focus:outline focus:outline-2 focus:outline-red-500 dark:hover:text-white"
                    >
                      Horizon
                    </a>
                    ,{' '}
                    <a
                      href="https://laravel.com/docs/sanctum"
                      className="underline hover:text-gray-700 focus:rounded-sm focus:outline focus:outline-2 focus:outline-red-500 dark:hover:text-white"
                    >
                      Sanctum
                    </a>
                    ,{' '}
                    <a
                      href="https://laravel.com/docs/telescope"
                      className="underline hover:text-gray-700 focus:rounded-sm focus:outline focus:outline-2 focus:outline-red-500 dark:hover:text-white"
                    >
                      Telescope
                    </a>
                    , and more.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 flex justify-center px-6 sm:items-center sm:justify-between">
            <div className="text-center text-sm text-gray-500 dark:text-gray-400 sm:text-left">
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/sponsors/taylorotwell"
                  className="group inline-flex items-center hover:text-gray-700 focus:rounded-sm focus:outline focus:outline-2 focus:outline-red-500 dark:hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    className="-mt-px mr-1 h-5 w-5 stroke-gray-400 group-hover:stroke-gray-600 dark:stroke-gray-600 dark:group-hover:stroke-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                  Sponsor
                </a>
              </div>
            </div>

            <div className="ml-4 text-center text-sm text-gray-500 dark:text-gray-400 sm:ml-0 sm:text-right">
              Laravel v{laravelVersion} (PHP v{phpVersion})
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
