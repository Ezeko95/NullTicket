import type { Event } from "@repo/types";
import Image from "next/image";
import Link from "next/link";
import { EventPurchasePanel } from "./EventPurchasePanel";

function parseDate(iso: string) {
    const date = new Date(iso);
    return {
        weekday: date.toLocaleString("es-AR", {
            weekday: "long",
            timeZone: "UTC"
        }),
        day: date.getUTCDate(),
        month: date.toLocaleString("es-AR", { month: "long", timeZone: "UTC" }),
        year: date.getUTCFullYear(),
        time: date.toLocaleString("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "UTC"
        })
    };
}

export function EventDetail(event: Event) {
    const { id, name, location, availableTickets } = event;
    const { weekday, day, month, year, time } = parseDate(event.date);
    const soldOut = availableTickets === 0;

    return (
        <div className="max-w-screen-2xl mx-auto px-8 pb-24">
            <Link
                href="/discover"
                className="inline-flex items-center gap-2 font-headline font-bold text-sm text-on-surface-variant hover:text-primary transition-colors mb-10 pt-8"
            >
                <span className="material-symbols-outlined text-[18px]">
                    arrow_back
                </span>
                Volver a Descubrí
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                <div className="lg:col-span-7">
                    <div className="relative aspect-4/5 lg:aspect-3/4 overflow-hidden rounded-2xl bg-surface-container">
                        {event.image ? (
                            <Image
                                src={event.image}
                                alt={name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 58vw"
                                priority
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="font-headline font-extrabold text-8xl text-on-surface-variant/20 select-none">
                                    {name[0]}
                                </span>
                            </div>
                        )}
                        {soldOut && (
                            <div className="absolute inset-0 bg-surface-container/80 backdrop-blur-sm flex items-center justify-center">
                                <span className="font-headline font-bold text-sm tracking-widest uppercase text-on-surface-variant border border-on-surface-variant/30 px-6 py-3 rounded-lg">
                                    Agotado
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-5 flex flex-col justify-center">
                    <p className="font-headline font-bold text-on-surface-variant tracking-widest uppercase text-xs mb-4">
                        Experiencia Curada
                    </p>
                    <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tighter text-primary leading-[0.95] mb-6">
                        {name}
                    </h1>

                    <div className="border-l-4 border-primary-fixed pl-5 mb-8 space-y-1">
                        <p className="font-headline font-bold text-primary text-lg capitalize">
                            {weekday} {day} de {month}, {year}
                        </p>
                        <p className="font-body text-on-surface-variant">
                            {time} hs · {location}
                        </p>
                    </div>

                    <p
                        className={`font-body text-sm mb-10 ${soldOut ? "text-on-surface-variant" : "text-primary"}`}
                    >
                        {soldOut
                            ? "Sin entradas disponibles en este momento."
                            : `${availableTickets} entradas disponibles`}
                    </p>

                    <EventPurchasePanel
                        eventId={id}
                        sectors={event.sectors}
                        availableTickets={availableTickets}
                    />
                </div>
            </div>
        </div>
    );
}
