"use client";

import { ConvexProvider } from "convex/react";
import { ReactNode } from "react";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "https://david-doro-12345.convex.cloud";

export function ConvexProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <ConvexProvider client={(window as any).__convex?.client}>
      {children}
    </ConvexProvider>
  );
}
