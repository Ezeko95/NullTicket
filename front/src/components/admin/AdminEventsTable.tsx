import type { Event } from "@repo/types";
import Link from "next/link";
import {
    EVENT_SECTOR_LABELS,
    formatAdminEventDate,
    formatAdminPrice,
    getEventAdminStatus,
    getEventCapacity,
    getEventMinPrice,
    getEventSoldCount,
    type EventAdminStatus
} from "@/lib/admin-events";

const STATUS_LABELS: Record<EventAdminStatus, string> = {
    proximo: "Próximo",
    pasado: "Pasado",
    agotado: "Agotado"
};

const STATUS_STYLES: Record<EventAdminStatus, string> = {
    proximo: "bg-primary/10 text-primary",
    pasado: "bg-surface-container-high text-on-surface-variant",
    agotado: "bg-error-container text-on-error-container"
};

interface AdminEventsTableProps {
    events: Event[];
}

export function AdminEventsTable({ events }: AdminEventsTableProps) {
    if (events.length === 0) {
        return (
            <div className="rounded-3xl border border-outline-variant bg-surface px-8 py-16 text-center shadow-ambient">
                <p className="text-xs font-black uppercase tracking-widest text-primary font-label">
                    Sin eventos
                </p>
                <h2 className="mt-3 text-2xl font-black tracking-tighter text-on-surface font-headline">
                    Todavía no hay eventos cargados
                </h2>
                <p className="mt-2 text-sm text-on-surface-variant font-body">
                    Creá el primero para empezar a publicar en NullTicket.
                </p>
                <Link
                    href="/admin/events/new"
                    className="mt-8 inline-flex editorial-gradient text-on-primary px-6 py-3 rounded-xl font-black font-headline tracking-tight hover:opacity-90 transition-all"
                >
                    Crear evento
                </Link>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-3xl border border-outline-variant bg-surface shadow-ambient">
            <table className="min-w-[960px] w-full border-collapse text-left">
                <thead>
                    <tr className="border-b border-outline-variant bg-surface-container-low">
                        {[
                            "ID",
                            "Evento",
                            "Fecha",
                            "Lugar",
                            "Capacidad",
                            "Disponibles",
                            "Vendidas",
                            "Desde",
                            "Sectores",
                            "Estado"
                        ].map((column) => (
                            <th
                                key={column}
                                className="px-4 py-4 text-xs font-black uppercase tracking-widest text-on-surface-variant font-label whitespace-nowrap"
                            >
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {events.map((event) => {
                        const capacity = getEventCapacity(event);
                        const sold = getEventSoldCount(event);
                        const minPrice = getEventMinPrice(event);
                        const status = getEventAdminStatus(event);

                        return (
                            <tr
                                key={event.id}
                                className="border-b border-outline-variant/70 last:border-b-0"
                            >
                                <td className="px-4 py-4 text-sm font-bold text-on-surface-variant font-body">
                                    {event.id}
                                </td>
                                <td className="px-4 py-4 text-sm font-bold text-on-surface font-headline">
                                    {event.name}
                                </td>
                                <td className="px-4 py-4 text-sm text-on-surface-variant font-body whitespace-nowrap">
                                    {formatAdminEventDate(event.date)}
                                </td>
                                <td className="px-4 py-4 text-sm text-on-surface-variant font-body">
                                    {event.location}
                                </td>
                                <td className="px-4 py-4 text-sm text-on-surface font-body">
                                    {capacity}
                                </td>
                                <td className="px-4 py-4 text-sm text-on-surface font-body">
                                    {event.availableTickets}
                                </td>
                                <td className="px-4 py-4 text-sm text-on-surface font-body">
                                    {sold}
                                </td>
                                <td className="px-4 py-4 text-sm text-on-surface font-body whitespace-nowrap">
                                    {minPrice !== null
                                        ? formatAdminPrice(minPrice)
                                        : "—"}
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex flex-wrap gap-1.5">
                                        {event.sectors.map((sector) => (
                                            <span
                                                key={`${event.id}-${sector.name}`}
                                                className="rounded-full border border-outline-variant bg-surface-container-low px-2.5 py-1 text-xs font-black uppercase tracking-widest text-on-surface-variant font-label"
                                            >
                                                {
                                                    EVENT_SECTOR_LABELS[
                                                        sector.name
                                                    ]
                                                }
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <span
                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-widest font-label ${STATUS_STYLES[status]}`}
                                    >
                                        {STATUS_LABELS[status]}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
