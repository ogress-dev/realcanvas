'use client';

import { ReactNode } from 'react';
import { ConvexProvider } from 'convex/react';
import { ConvexReactClient } from 'convex/react';

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "https://benevolent-quail-764.convex.cloud";

const convex = new ConvexReactClient(CONVEX_URL);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
}
