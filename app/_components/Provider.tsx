"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";
import BackendActivator from "./BackendActivator";
import UserRefresher from "./Refresher";
import { ThemeProvider } from "next-themes";

export function Provider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange={true}
      >
        <NextTopLoader color="white" height={2} showSpinner={false} />
        <UserRefresher />
        <BackendActivator />
        {children}
        <Toaster position="top-center" reverseOrder={false} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
