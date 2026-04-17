"use client";

import { AuthProvider } from "@/context/AuthContext";

interface User {
    id: number;
    name: string;
    email: string;
}

export function Providers({
    children,
    initialUser = null
}: {
    children: React.ReactNode;
    initialUser?: User | null;
}) {
    return <AuthProvider initialUser={initialUser}>{children}</AuthProvider>;
}
