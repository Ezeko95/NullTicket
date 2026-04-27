import type { Ticket } from "@repo/types";
import { getMyTickets } from "@/lib/tickets";

const SECTOR_LABELS: Record<string, string> = {
    vip: "VIP",
    campo: "Campo",
    platea: "Platea",
    general: "General"
};

const STATUS_LABELS: Record<string, string> = {
    active: "CONFIRMADO",
    used: "UTILIZADO",
    cancelled: "CANCELADO"
};

function formatPrice(price: number) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0
    }).format(price);
}

function formatDate(iso: string) {
    const date = new Date(iso);
    return date.toLocaleDateString("es-AR", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC"
    });
}

function TicketInitial({ name }: { name: string }) {
    return (
        <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
            <span className="font-headline font-extrabold text-3xl text-on-surface-variant/30 select-none">
                {name[0]}
            </span>
        </div>
    );
}

function UpcomingTicketCard({ ticket }: { ticket: Ticket }) {
    const statusLabel = STATUS_LABELS[ticket.status] ?? ticket.status;

    return (
        <div className="bg-surface-container-lowest rounded-2xl overflow-hidden flex flex-col md:flex-row">
            <div className="relative w-full md:w-40 h-48 md:h-auto shrink-0">
                <TicketInitial name={ticket.eventName} />
            </div>
            <div className="p-8 flex flex-col justify-between flex-1">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <span className="bg-primary-fixed text-on-primary-fixed-variant text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full font-label">
                            {statusLabel}
                        </span>
                        <span className="text-on-surface-variant text-xs font-body">
                            #{ticket.id}
                        </span>
                    </div>
                    <h3 className="font-headline font-extrabold text-xl text-primary leading-tight mb-3">
                        {ticket.eventName}
                    </h3>
                    <p className="text-sm text-on-surface-variant font-body mb-1">
                        {formatDate(ticket.eventDate)}
                    </p>
                    <p className="text-sm text-on-surface-variant font-body">
                        {SECTOR_LABELS[ticket.sector] ?? ticket.sector} &mdash;{" "}
                        {formatPrice(ticket.price)}
                    </p>
                </div>
                <div className="flex items-center gap-3 mt-6">
                    <button className="editorial-gradient text-on-primary px-6 py-2.5 rounded-lg font-headline font-bold text-sm hover:opacity-90 transition-opacity cursor-not-allowed opacity-50">
                        Ver Pase
                    </button>
                </div>
            </div>
        </div>
    );
}

function PastTicketCard({ ticket }: { ticket: Ticket }) {
    return (
        <div className="bg-surface-container-lowest rounded-2xl p-5 flex items-center gap-5">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                <TicketInitial name={ticket.eventName} />
            </div>
            <div className="min-w-0">
                <p className="text-xs text-on-surface-variant font-bold font-label uppercase tracking-widest mb-1">
                    {formatDate(ticket.eventDate)}
                </p>
                <h3 className="font-headline font-bold text-primary text-sm leading-tight truncate">
                    {ticket.eventName}
                </h3>
                <p className="text-xs text-on-surface-variant mt-1 font-body">
                    {SECTOR_LABELS[ticket.sector] ?? ticket.sector}
                </p>
            </div>
        </div>
    );
}

export default async function HistoryPage() {
    const tickets = await getMyTickets();
    const now = new Date();

    const upcoming = tickets.filter(
        (t) => t.status === "active" && new Date(t.eventDate) > now
    );
    const past = tickets.filter(
        (t) => t.status !== "active" || new Date(t.eventDate) <= now
    );

    return (
        <div className="max-w-screen-2xl mx-auto px-8 pb-24 pt-8">
            <div className="mb-16">
                <p className="text-xs uppercase tracking-widest font-bold text-on-surface-variant font-label mb-3">
                    Tu Coleccion
                </p>
                <h1
                    className="font-headline font-black tracking-tighter text-primary leading-none"
                    style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}
                >
                    Historial
                </h1>
            </div>

            <section className="mb-20">
                <h2 className="font-headline font-black text-2xl text-primary mb-8">
                    Proximos
                </h2>
                {upcoming.length === 0 ? (
                    <p className="font-body text-on-surface-variant text-sm">
                        No tenes entradas proximas.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {upcoming.map((ticket) => (
                            <UpcomingTicketCard
                                key={ticket.id}
                                ticket={ticket}
                            />
                        ))}
                    </div>
                )}
            </section>

            <section>
                <h2 className="font-headline font-black text-2xl text-primary mb-8">
                    Experiencias Pasadas
                </h2>
                {past.length === 0 ? (
                    <p className="font-body text-on-surface-variant text-sm">
                        No hay experiencias pasadas todavia.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {past.map((ticket) => (
                            <PastTicketCard key={ticket.id} ticket={ticket} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
