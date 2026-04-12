"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback
} from "react";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextValue {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const TOKEN_KEY = "token";

function setTokenCookie(token: string) {
    document.cookie = `${TOKEN_KEY}=${token}; path=/; SameSite=Lax`;
}

function clearTokenCookie() {
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY);

        const loadUser = token
            ? fetch(`${API_URL}/auth/me`, {
                  headers: { Authorization: `Bearer ${token}` }
              })
            : Promise.resolve(null);

        loadUser
            .then((res) => (res?.ok ? res.json() : null))
            .then((data: User | null) => setUser(data))
            .catch(() => {
                localStorage.removeItem(TOKEN_KEY);
                clearTokenCookie();
            })
            .finally(() => setIsLoading(false));
    }, []);

    const login = useCallback(
        async (email: string, password: string) => {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
                const { message } = await res
                    .json()
                    .catch(() => ({ message: "Error al iniciar sesión" }));
                throw new Error(message);
            }

            const { token, user: loggedUser }: { token: string; user: User } =
                await res.json();

            localStorage.setItem(TOKEN_KEY, token);
            setTokenCookie(token);
            setUser(loggedUser);
            router.push("/");
        },
        [router]
    );

    const logout = useCallback(async () => {
        localStorage.removeItem(TOKEN_KEY);
        clearTokenCookie();
        setUser(null);
        router.push("/login");
    }, [router]);

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}
