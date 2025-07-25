"use client";
import { ClerkProvider } from '@clerk/nextjs';

export function Providers({ children }) {
  return (
    <ClerkProvider publishableKey="pk_test_Y29taWMtcGxhdHlwdXMtNDEuY2xlcmsuYWNjb3VudHMuZGV2JA">
      {children}
    </ClerkProvider>
  );
} 