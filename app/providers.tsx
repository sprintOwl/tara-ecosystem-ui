"use client";

import * as React from "react";
import { MetaMaskProvider } from "metamask-react";
import { ThemeProvider } from "@/components/theme-provider";

export interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <MetaMaskProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </MetaMaskProvider>
  );
}
