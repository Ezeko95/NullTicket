import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { getAdminSession } from "@/lib/admin-session";

export default async function AdminLayout({
    children
}: Readonly<{ children: React.ReactNode }>) {
    const adminSession = await getAdminSession();

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto flex min-h-screen max-w-screen-2xl flex-col px-6 py-6 md:px-8">
                <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="text-2xl font-black text-primary tracking-tighter font-headline"
                        >
                            NullTicket
                        </Link>
                        <span className="rounded-full border border-outline-variant px-3 py-1 text-xs font-black uppercase tracking-widest text-on-surface-variant font-label">
                            Admin
                        </span>
                    </div>

                    {adminSession ? <AdminNav /> : null}
                </div>

                <div className="flex-1">{children}</div>
            </div>
        </div>
    );
}
