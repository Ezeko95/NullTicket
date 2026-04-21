"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
    const { register } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        setIsLoading(true);
        try {
            await register(name, email, password);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error al registrarse"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Panel izquierdo — marca */}
            <div className="hidden lg:flex editorial-gradient flex-col justify-between p-16">
                <Link
                    href="/"
                    className="text-2xl font-black text-on-primary tracking-tighter font-headline"
                >
                    NullTicket
                </Link>

                <div>
                    <p className="text-primary-fixed text-xs font-black uppercase tracking-widest mb-6 font-label">
                        Plataforma Editorial de Entradas
                    </p>
                    <h1 className="text-on-primary text-5xl font-black leading-tight tracking-tighter font-headline">
                        Tu próximo
                        <br />
                        recuerdo,
                        <br />
                        curado
                        <br />
                        profesionalmente.
                    </h1>
                </div>

                <p className="text-on-primary/40 text-sm font-body">
                    © 2025 NullTicket
                </p>
            </div>

            {/* Panel derecho — formulario */}
            <div className="flex items-center justify-center px-8 py-16 bg-background">
                <div className="w-full max-w-sm">
                    <Link
                        href="/"
                        className="lg:hidden text-2xl font-black text-primary tracking-tighter font-headline block mb-12"
                    >
                        NullTicket
                    </Link>

                    <h2 className="text-3xl font-black font-headline tracking-tighter text-on-surface mb-2">
                        Creá tu cuenta
                    </h2>
                    <p className="text-on-surface-variant text-sm font-body mb-10">
                        Unite a más de 50.000 exploradores culturales.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-5"
                    >
                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="name"
                                className="text-xs font-black uppercase tracking-widest text-on-surface-variant font-label"
                            >
                                Nombre completo
                            </label>
                            <input
                                id="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Juan García"
                                className="bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-on-surface outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition font-body text-sm"
                            />
                        </div>

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

                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="confirmPassword"
                                className="text-xs font-black uppercase tracking-widest text-on-surface-variant font-label"
                            >
                                Confirmá la contraseña
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
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
                            {isLoading ? "Creando cuenta..." : "Crear cuenta"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-on-surface-variant font-body">
                        ¿Ya tenés cuenta?{" "}
                        <Link
                            href="/login"
                            className="font-bold text-primary hover:underline font-headline"
                        >
                            Ingresá
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
