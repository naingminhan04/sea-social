"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { Toaster } from "react-hot-toast";
import BackendActivator from "./BackendActivator";
import NextTopLoader from "nextjs-toploader";

export function Provider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <NextTopLoader color="white" height={2} showSpinner={false} />
      <BackendActivator />
      {children}
      <Toaster position="top-center" reverseOrder={false} />
    </QueryClientProvider>
  );
}
