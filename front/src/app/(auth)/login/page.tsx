import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
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
                        Experiencias
                        <br />
                        curadas para
                        <br />
                        el asistente
                        <br />
                        exigente.
                    </h1>
                </div>

                <p className="text-on-primary/40 text-sm font-body">
                    © 2025 NullTicket
                </p>
            </div>

            <div className="flex items-center justify-center px-8 py-16 bg-background">
                <Suspense
                    fallback={<p className="font-body text-sm">Cargando...</p>}
                >
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}
