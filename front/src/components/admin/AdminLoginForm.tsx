"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { loginAdminAction } from "@/actions/admin-auth";

interface AdminLoginFormProps {
    mockEnabled: boolean;
}

export function AdminLoginForm({ mockEnabled }: AdminLoginFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const result = await loginAdminAction(email, password);

            if ("error" in result) {
                setError(result.error);
                return;
            }

            router.push(
                redirectTo?.startsWith("/admin/") ? redirectTo : "/admin/events"
            );
            router.refresh();
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

            <p className="text-xs font-black uppercase tracking-widest text-primary mb-4 font-label">
                Portal Admin
            </p>
            <h2 className="text-3xl font-black font-headline tracking-tighter text-on-surface mb-2">
                Ingreso editorial
            </h2>
            <p className="text-on-surface-variant text-sm font-body mb-8">
                Ingresá con una sesión separada de la cuenta de usuario.
            </p>

            {mockEnabled && (
                <div className="mb-6 rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-on-surface-variant font-body">
                    ADMIN_MOCK_AUTH activo. Usá las credenciales cargadas en
                    ADMIN_EMAIL y ADMIN_PASSWORD.
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="admin-email"
                        className="text-xs font-black uppercase tracking-widest text-on-surface-variant font-label"
                    >
                        Email admin
                    </label>
                    <input
                        id="admin-email"
                        type="email"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="admin@nullticket.local"
                        className="bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-on-surface outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition font-body text-sm"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="admin-password"
                        className="text-xs font-black uppercase tracking-widest text-on-surface-variant font-label"
                    >
                        Contraseña
                    </label>
                    <input
                        id="admin-password"
                        type="password"
                        required
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
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
                    {isLoading ? "Ingresando..." : "Ingresar al portal"}
                </button>
            </form>

            <p className="mt-8 text-sm text-on-surface-variant font-body">
                El acceso de admin usa su propia cookie admin_token y no
                comparte sesión con el login público.
            </p>
        </div>
    );
}
