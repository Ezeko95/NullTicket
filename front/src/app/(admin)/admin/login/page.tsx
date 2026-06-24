import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { getAdminSession, isAdminMockAuthEnabled } from "@/lib/admin-session";

export default async function AdminLoginPage() {
    const adminSession = await getAdminSession();

    if (adminSession) {
        redirect("/admin/events");
    }

    return (
        <div className="grid min-h-[calc(100vh-120px)] grid-cols-1 overflow-hidden rounded-4xl border border-outline-variant bg-surface shadow-ambient lg:grid-cols-2">
            <div className="hidden lg:flex editorial-gradient flex-col justify-between p-16">
                <div>
                    <p className="text-primary-fixed text-xs font-black uppercase tracking-widest mb-6 font-label">
                        Admin Portal
                    </p>
                    <h1 className="text-on-primary text-5xl font-black leading-tight tracking-tighter font-headline">
                        Curá,
                        <br />
                        publicá
                        <br />
                        y seguí
                        <br />
                        creando.
                    </h1>
                </div>

                <p className="text-on-primary/50 text-sm font-body">
                    Acceso interno separado de la sesión pública.
                </p>
            </div>

            <div className="flex items-center justify-center bg-background px-8 py-16">
                <Suspense
                    fallback={<p className="font-body text-sm">Cargando...</p>}
                >
                    <AdminLoginForm mockEnabled={isAdminMockAuthEnabled()} />
                </Suspense>
            </div>
        </div>
    );
}
