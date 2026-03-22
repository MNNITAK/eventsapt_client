// "use client";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { useState } from "react";
// export const TanstackProvider = ({ children }) => {
//   const [queryClient] = useState(() => new QueryClient());
//   return (
//     <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
//   );
// };

"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export const TanstackProvider = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,              // always refetch when component mounts
        gcTime: 5 * 60 * 1000,    // keep unused cache for 5 min before clearing
        retry: 1,                  // on failure, retry once only
        refetchOnWindowFocus: false, // don't surprise-refetch on alt+tab
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};