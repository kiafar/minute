import './bootstrap';

import { RouteContext } from '@/Hooks/useRoute';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './ThemeProvider';

const appName =
  window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

createInertiaApp({
  title: title => `${title} - ${appName}`,
  progress: {
    color: '#4B5563',
  },
  resolve: name =>
    resolvePageComponent(
      `./Pages/${name}.tsx`,
      import.meta.glob('./Pages/**/*.tsx'),
    ),
  setup({ el, App, props }) {
    const root = createRoot(el);
    return root.render(
      <RouteContext.Provider value={(window as any).route}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <App {...props} />
        </ThemeProvider>
      </RouteContext.Provider>,
    );
  },
});
