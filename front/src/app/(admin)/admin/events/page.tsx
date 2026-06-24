import Link from "next/link";
import { redirect } from "next/navigation";
import type { Event } from "@repo/types";
import { AdminEventsTable } from "@/components/admin/AdminEventsTable";
import { getAdminEvents } from "@/lib/admin-events";
import { getAdminSession } from "@/lib/admin-session";

interface AdminEventsPageProps {
    searchParams: Promise<{ updated?: string }>;
}

export default async function AdminEventsPage({
    searchParams
}: AdminEventsPageProps) {
    const { updated: updatedEventName } = await searchParams;
    const adminSession = await getAdminSession();

    if (!adminSession) {
        redirect("/admin/login?redirect=/admin/events");
    }

    let events: Event[] = [];
    let loadError: string | null = null;

    try {
        events = await getAdminEvents();
    } catch (error) {
        loadError =
            error instanceof Error
                ? error.message
                : "No se pudieron cargar los eventos.";
    }

    return (
        <section className="pb-12">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="text-xs font-black uppercase tracking-widest text-primary font-label">
                        Backoffice editorial
                    </p>
                    <h1 className="mt-3 text-3xl font-black tracking-tighter text-on-surface font-headline">
                        Eventos
                    </h1>
                    <p className="mt-2 text-sm text-on-surface-variant font-body">
                        Listado completo de eventos publicados en NullTicket.
                    </p>
                </div>

                <Link
                    href="/admin/events/new"
                    className="inline-flex editorial-gradient text-on-primary px-5 py-3 rounded-xl font-black font-headline tracking-tight hover:opacity-90 transition-all"
                >
                    Nuevo evento
                </Link>
            </div>

            {updatedEventName ? (
                <div className="mb-6 rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-on-surface font-body">
                    Evento actualizado: <strong>{updatedEventName}</strong>
                </div>
            ) : null}

            {loadError ? (
                <div className="mb-6 rounded-2xl border border-error/20 bg-error-container px-4 py-3 text-sm text-on-error-container font-body">
                    {loadError}
                </div>
            ) : null}

            <AdminEventsTable events={events} />
        </section>
    );
}
