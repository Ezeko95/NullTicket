import type { Ticket } from "@repo/types";
import Image from "next/image";
import Link from "next/link";
import { FakeQrCode } from "./FakeQrCode";

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
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC"
    });
}

type TicketPassDetailProps = {
    ticket: Ticket;
    image?: string;
};

export function TicketPassDetail({ ticket, image }: TicketPassDetailProps) {
    const statusLabel = STATUS_LABELS[ticket.status] ?? ticket.status;

    return (
        <div className="max-w-screen-2xl mx-auto px-8 pb-24 pt-8">
            <Link
                href="/history"
                className="inline-flex items-center gap-2 font-headline font-bold text-sm text-on-surface-variant hover:text-primary transition-colors mb-10"
            >
                <span className="material-symbols-outlined text-[18px]">
                    arrow_back
                </span>
                Volver al historial
            </Link>

            <div className="mb-12">
                <p className="text-xs uppercase tracking-widest font-bold text-on-surface-variant font-label mb-3">
                    Tu Pase
                </p>
                <h1
                    className="font-headline font-black tracking-tighter text-primary leading-none"
                    style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
                >
                    {ticket.eventName}
                </h1>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="p-8 lg:p-12 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-outline-variant/20 bg-surface-container-low">
                        <div className="bg-white p-6 rounded-2xl shadow-ambient">
                            <FakeQrCode
                                value={`nullticket:${ticket.id}:${ticket.eventId}`}
                                className="w-56 h-56 text-primary"
                            />
                        </div>
                        <p className="mt-6 text-xs text-on-surface-variant font-body text-center max-w-xs">
                            Mostrá este código en la entrada. Es solo visual en
                            esta demo.
                        </p>
                        <p className="mt-2 font-mono text-sm text-on-surface-variant">
                            #{ticket.id}
                        </p>
                    </div>

                    <div className="p-8 lg:p-12 flex flex-col">
                        <div className="flex items-start gap-5 mb-8">
                            <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                                {image ? (
                                    <Image
                                        src={image}
                                        alt={ticket.eventName}
                                        fill
                                        className="object-cover"
                                        sizes="5rem"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                                        <span className="font-headline font-extrabold text-2xl text-on-surface-variant/30">
                                            {ticket.eventName[0]}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <span className="bg-primary-fixed text-on-primary-fixed-variant text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full font-label">
                                    {statusLabel}
                                </span>
                                <p className="mt-3 font-headline font-bold text-primary text-lg leading-tight">
                                    {ticket.eventName}
                                </p>
                            </div>
                        </div>

                        <dl className="space-y-5 flex-1">
                            <div>
                                <dt className="text-xs uppercase tracking-widest font-bold text-on-surface-variant font-label mb-1">
                                    Fecha del evento
                                </dt>
                                <dd className="font-body text-primary">
                                    {formatDate(ticket.eventDate)}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs uppercase tracking-widest font-bold text-on-surface-variant font-label mb-1">
                                    Sector
                                </dt>
                                <dd className="font-body text-primary">
                                    {SECTOR_LABELS[ticket.sector] ??
                                        ticket.sector}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs uppercase tracking-widest font-bold text-on-surface-variant font-label mb-1">
                                    Precio
                                </dt>
                                <dd className="font-headline font-extrabold text-primary text-xl">
                                    {formatPrice(ticket.price)}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs uppercase tracking-widest font-bold text-on-surface-variant font-label mb-1">
                                    Comprado el
                                </dt>
                                <dd className="font-body text-primary">
                                    {formatDate(ticket.purchasedAt)}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs uppercase tracking-widest font-bold text-on-surface-variant font-label mb-1">
                                    ID de entrada
                                </dt>
                                <dd className="font-mono text-sm text-on-surface-variant">
                                    #{ticket.id}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}
