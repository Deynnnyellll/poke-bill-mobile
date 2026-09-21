import { ScrollViewStyleReset } from 'expo-router/html';

// This file is web-only and configures the root HTML for every page
// during static rendering. Runs in Node.js at build time only — no
// access to the DOM or browser APIs here.
export default function Root({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* Links the PWA manifest — this was the missing piece causing
            "cannot be installed" even with a registered service worker. */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2B3A6B" />

        {/* Registers the service worker directly in <head>, before React
            hydrates — more reliable than registering it from a useEffect
            in _layout.jsx, since this runs regardless of JS bundle timing. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').then((registration) => {
                    console.log('Service Worker registered with scope:', registration.scope);
                  }).catch((error) => {
                    console.error('Service Worker registration failed:', error);
                  });
                });
              }
            `,
          }}
        />

        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
