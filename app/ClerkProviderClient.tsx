"use client";

import { ClerkProvider } from "@clerk/nextjs";
import React from "react";

// wrapping ClerkProvider in a client component prevents the server
// from calling `headers()` during render, which is what triggers the
// synchronous dynamic API warning shown in development.
//
// If you upgrade @clerk/nextjs to a newer release you may no longer
// need this wrapper, but it is a safe workaround for the existing
// 5.x version that ships with the warning.

interface Props {
  children: React.ReactNode;
}

export default function ClerkProviderClient({ children }: Props) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
