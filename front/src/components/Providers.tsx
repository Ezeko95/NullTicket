"use client";

import { TicketProvider } from "@/context/TicketContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return <TicketProvider>{children}</TicketProvider>;
}
