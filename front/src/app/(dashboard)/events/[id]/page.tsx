import Image from "next/image";
import Link from "next/link";
import { getEventById } from "@/lib/events";

function parseDate(iso: string) {
    const date = new Date(iso);
    return {
        day: date.getUTCDate().toString().padStart(2, "0"),
        month: date.toLocaleString("es-AR", {
            month: "long",
            timeZone: "UTC"
        }),
        year: date.getUTCFullYear().toString(),
        time: `${date.getUTCHours().toString().padStart(2, "0")}:${date.getUTCMinutes().toString().padStart(2, "0")}`
    };
}

function formatPrice(price: number) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0
    }).format(price);
}

const SECTOR_LABELS: Record<string, string> = {
    vip: "VIP",
    campo: "Campo",
    platea: "Platea",
    general: "General"
};

export default async function EventPage({
    params
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const event = await getEventById(Number(id));
    const { day, month, year, time } = parseDate(event.date);
    const soldOut = event.availableTickets === 0;

    return (
        <div className="max-w-screen-2xl mx-auto px-8 pb-24">
            <div className="pt-8 mb-8">
                <Link
                    href="/discover"
                    className="font-label text-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                    Volver al catalogo
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-5">
                    <div className="relative aspect-4/5 rounded-xl overflow-hidden bg-surface-container">
                        {event.image ? (
                            <Image
                                src={event.image}
                                alt={event.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 42vw"
                                priority
                            />
                        ) : (
                            <span className="absolute inset-0 flex items-center justify-center font-headline font-extrabold text-6xl text-on-surface-variant/20 select-none">
                                {event.name[0]}
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
                </div>

                <div className="lg:col-span-7 flex flex-col">
                    <div className="border-l-4 border-primary-fixed pl-6 mb-6">
                        <p className="font-headline font-bold text-primary text-2xl leading-tight capitalize">
                            {day} de {month}, {year}
                        </p>
                        <p className="font-label text-xs text-on-surface-variant uppercase tracking-widest mt-1">
                            {time} hs
                        </p>
                    </div>

                    <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tighter text-primary leading-tight mb-4">
                        {event.name}
                    </h1>

                    <p className="font-body text-on-surface-variant text-lg mb-2">
                        {event.location}
                    </p>

                    <p
                        className={`font-body text-sm mb-10 ${soldOut ? "text-on-surface-variant" : "text-primary"}`}
                    >
                        {soldOut
                            ? "Sin disponibilidad"
                            : `${event.availableTickets} entradas disponibles`}
                    </p>

                    <div>
                        <p className="font-headline font-bold text-on-surface-variant tracking-widest uppercase text-xs mb-4">
                            Sectores
                        </p>
                        <div className="flex flex-col gap-3">
                            {event.sectors.map((sector) => (
                                <div
                                    key={sector.name}
                                    className="flex items-center justify-between bg-surface-container rounded-xl px-6 py-4"
                                >
                                    <div>
                                        <p className="font-headline font-bold text-primary text-sm">
                                            {SECTOR_LABELS[sector.name] ??
                                                sector.name}
                                        </p>
                                        <p className="font-label text-xs text-on-surface-variant mt-0.5">
                                            {sector.capacity} lugares
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-headline font-extrabold text-xl text-primary">
                                            {formatPrice(sector.price)}
                                        </p>
                                        {!soldOut && (
                                            <button className="editorial-gradient text-on-primary px-4 py-1.5 rounded-lg font-headline font-bold text-xs tracking-tight mt-2 transition-transform active:scale-95 hover:opacity-90 cursor-not-allowed opacity-50">
                                                Comprar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
