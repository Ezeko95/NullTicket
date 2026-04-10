'use client';

import { AuthProvider } from '@/context/AuthContext';
import { TicketProvider } from '@/context/TicketContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TicketProvider>{children}</TicketProvider>
    </AuthProvider>
  );
}
