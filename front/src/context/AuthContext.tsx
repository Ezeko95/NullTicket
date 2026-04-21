"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { loginAction, registerAction, logoutAction } from "@/actions/auth";

interface User {
    id: number;
    name: string;
    email: string;
}

interface AuthContextValue {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
    children,
    initialUser = null
}: {
    children: React.ReactNode;
    initialUser?: User | null;
}) {
    const [user, setUser] = useState<User | null>(initialUser);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const login = useCallback(
        async (email: string, password: string) => {
            setIsLoading(true);
            try {
                const result = await loginAction(email, password);
                if ("error" in result) throw new Error(result.error);
                setUser(result.user);
                router.push("/");
            } finally {
                setIsLoading(false);
            }
        },
        [router]
    );

    const register = useCallback(
        async (name: string, email: string, password: string) => {
            setIsLoading(true);
            try {
                const result = await registerAction(name, email, password);
                if ("error" in result) throw new Error(result.error);
                setUser(result.user);
                router.push("/");
            } finally {
                setIsLoading(false);
            }
        },
        [router]
    );

    const logout = useCallback(async () => {
        setUser(null);
        await logoutAction();
    }, []);

    return (
        <AuthContext.Provider
            value={{ user, isLoading, login, register, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}
