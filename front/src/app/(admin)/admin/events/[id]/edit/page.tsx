import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { EventForm } from "@/components/admin/EventForm";
import { getAdminEventById, getEventSoldCount } from "@/lib/admin-events";
import { getAdminSession } from "@/lib/admin-session";

interface EditAdminEventPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditAdminEventPage({
    params
}: EditAdminEventPageProps) {
    const adminSession = await getAdminSession();

    if (!adminSession) {
        redirect("/admin/login?redirect=/admin/events");
    }

    const { id } = await params;
    const eventId = Number(id);

    if (!Number.isInteger(eventId) || eventId <= 0) {
        notFound();
    }

    let event;

    try {
        event = await getAdminEventById(eventId);
    } catch (error) {
        if (
            error instanceof Error &&
            error.message.includes("No se encontró el evento")
        ) {
            notFound();
        }

        return (
            <section className="pb-12">
                <div className="rounded-2xl border border-error/20 bg-error-container px-4 py-3 text-sm text-on-error-container font-body">
                    {error instanceof Error
                        ? error.message
                        : "No se pudo cargar el evento."}
                </div>
            </section>
        );
    }

    if (getEventSoldCount(event) > 0) {
        return (
            <section className="pb-12">
                <div className="mb-8">
                    <p className="text-xs font-black uppercase tracking-widest text-primary font-label">
                        Backoffice editorial
                    </p>
                    <h1 className="mt-3 text-3xl font-black tracking-tighter text-on-surface font-headline">
                        Edición no disponible
                    </h1>
                </div>

                <div className="rounded-3xl border border-outline-variant bg-surface px-6 py-7 shadow-ambient">
                    <p className="text-sm text-on-surface-variant font-body">
                        Este evento ya tiene entradas vendidas y no puede
                        modificarse.
                    </p>
                    <Link
                        href="/admin/events"
                        className="mt-6 inline-flex rounded-xl border border-outline-variant px-5 py-3 text-sm font-black text-on-surface-variant font-headline hover:bg-surface-container-low transition"
                    >
                        Volver al listado
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="pb-12">
            <div className="mb-8">
                <p className="text-xs font-black uppercase tracking-widest text-primary font-label">
                    Backoffice editorial
                </p>
                <h1 className="mt-3 text-3xl font-black tracking-tighter text-on-surface font-headline">
                    Editar evento
                </h1>
            </div>

            <EventForm
                mode="edit"
                adminEmail={adminSession.email}
                event={event}
            />
        </section>
    );
}
