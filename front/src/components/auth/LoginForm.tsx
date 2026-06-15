"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function LoginForm() {
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await login(email, password);
            router.push(redirectTo?.startsWith("/") ? redirectTo : "/");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error al iniciar sesión"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-sm">
            <Link
                href="/"
                className="lg:hidden text-2xl font-black text-primary tracking-tighter font-headline block mb-12"
            >
                NullTicket
            </Link>

            <h2 className="text-3xl font-black font-headline tracking-tighter text-on-surface mb-2">
                Bienvenido de vuelta
            </h2>
            <p className="text-on-surface-variant text-sm font-body mb-10">
                Ingresá tus credenciales para continuar.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="email"
                        className="text-xs font-black uppercase tracking-widest text-on-surface-variant font-label"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="usuario@ejemplo.com"
                        className="bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-on-surface outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition font-body text-sm"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="password"
                        className="text-xs font-black uppercase tracking-widest text-on-surface-variant font-label"
                    >
                        Contraseña
                    </label>
                    <input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-on-surface outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition font-body text-sm"
                    />
                </div>

                {error && (
                    <div className="bg-error-container text-on-error-container border border-error/20 rounded-xl px-4 py-3 text-sm font-body">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-2 editorial-gradient text-on-primary py-4 rounded-xl font-black font-headline tracking-tight hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {isLoading ? "Ingresando..." : "Ingresar"}
                </button>
            </form>

            <p className="mt-8 text-center text-sm text-on-surface-variant font-body">
                ¿No tenés cuenta?{" "}
                <Link
                    href="/register"
                    className="font-bold text-primary hover:underline font-headline"
                >
                    Registrate
                </Link>
            </p>
        </div>
    );
}
