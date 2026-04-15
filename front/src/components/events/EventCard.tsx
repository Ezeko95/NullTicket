import type { Event } from "@repo/types";
import Image from "next/image";
import Link from "next/link";

function parseDate(iso: string) {
    const date = new Date(iso);
    return {
        day: date.getUTCDate().toString().padStart(2, "0"),
        month: date
            .toLocaleString("es-AR", { month: "short", timeZone: "UTC" })
            .toUpperCase(),
        year: date.getUTCFullYear().toString()
    };
}

function minPrice(event: Event) {
    if (event.sectors.length === 0) return null;
    return Math.min(...event.sectors.map((s) => s.price));
}

function formatPrice(price: number) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0
    }).format(price);
}

export function EventCard(event: Event) {
    const { id, name, location, availableTickets } = event;
    const { day, month, year } = parseDate(event.date);
    const price = minPrice(event);
    const soldOut = availableTickets === 0;

    return (
        <div className="group flex flex-col space-y-4">
            <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-surface-container flex items-center justify-center">
                {event.image ? (
                    <Image
                        src={event.image}
                        alt={name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <span className="font-headline font-extrabold text-4xl text-on-surface-variant/20 select-none">
                        {name[0]}
                    </span>
                )}
                {soldOut && (
                    <div className="absolute inset-0 bg-surface-container/80 backdrop-blur-sm flex items-center justify-center">
                        <span className="font-headline font-bold text-sm tracking-widest uppercase text-on-surface-variant border border-on-surface-variant/30 px-4 py-2 rounded-lg">
                            Agotado
                        </span>
                    </div>
                )}
            </div>

            <div className="flex items-start gap-4">
                <div className="border-l-4 border-primary-fixed pl-4 shrink-0">
                    <p className="font-headline font-bold text-primary text-xl leading-tight">
                        {month} {day}
                    </p>
                    <p className="font-label text-xs text-on-surface-variant uppercase tracking-widest">
                        {year}
                    </p>
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-headline text-xl font-extrabold text-primary leading-tight tracking-tight mb-1">
                        {name}
                    </h3>
                    <p className="font-body text-sm text-on-surface-variant mb-1 truncate">
                        {location}
                    </p>
                    <p
                        className={`font-body text-xs mb-4 ${soldOut ? "text-on-surface-variant" : "text-primary"}`}
                    >
                        {soldOut
                            ? "Sin disponibilidad"
                            : `${availableTickets} entradas disponibles`}
                    </p>
                    <div className="flex justify-between items-center">
                        <span className="font-headline font-extrabold text-xl text-primary">
                            {price !== null
                                ? `desde ${formatPrice(price)}`
                                : ""}
                        </span>
                        {soldOut ? (
                            <span className="bg-surface-container text-on-surface-variant px-5 py-2 rounded-lg font-headline font-bold text-sm tracking-tight opacity-50 cursor-not-allowed">
                                Ver Entradas
                            </span>
                        ) : (
                            <Link
                                href={`/events/${id}`}
                                className="editorial-gradient text-on-primary px-5 py-2 rounded-lg font-headline font-bold text-sm tracking-tight transition-transform active:scale-95 hover:opacity-90"
                            >
                                Ver Entradas
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
