/**
 * providers/QueryProvider.js
 * --------------------------
 * Wraps the app with TanStack Query's QueryClientProvider.
 * Place this in _app.js (Pages Router) or layout.js (App Router).
 *
 * QueryClient config explained:
 *
 *   staleTime: 0
 *     Data is immediately considered stale after fetching.
 *     Override per-query via queryOptions.staleTime if you want caching.
 *
 *   gcTime: 5 * 60 * 1000  (5 minutes)
 *     Inactive queries are garbage collected after 5 min.
 *     Keeps memory sane on long sessions.
 *
 *   retry: 1
 *     On failure, retry once before showing the error state.
 *     Don't retry too many times — failed requests slow the UX.
 *
 *   refetchOnWindowFocus: false
 *     Prevents surprise refetches when user alt-tabs back.
 *     Enable per-query if real-time accuracy matters (e.g. notifications).
 */

"use client"; // Required for App Router

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function QueryProvider({ children }) {
  // useState ensures each user session gets its own QueryClient instance.
  // This is critical for SSR — avoids sharing cache between requests.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0,
            gcTime: 5 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools: only renders in development, tree-shaken in production */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

/**
 * USAGE — Pages Router (_app.js):
 *
 * import { QueryProvider } from '@/providers/QueryProvider';
 *
 * export default function App({ Component, pageProps }) {
 *   return (
 *     <QueryProvider>
 *       <Component {...pageProps} />
 *     </QueryProvider>
 *   );
 * }
 *
 * USAGE — App Router (app/layout.js):
 *
 * import { QueryProvider } from '@/providers/QueryProvider';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <QueryProvider>{children}</QueryProvider>
 *       </body>
 *     </html>
 *   );
 * }
 */
