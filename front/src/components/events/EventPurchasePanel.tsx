"use client";

import type { EventSector, EventSectorName, Ticket } from "@repo/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { purchaseTicketAction } from "@/actions/tickets";

const sectorLabels: Record<EventSectorName, string> = {
    vip: "VIP",
    campo: "Campo",
    platea: "Platea",
    general: "General"
};

function formatPrice(price: number) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0
    }).format(price);
}

function translateError(message: string) {
    const translations: Record<string, string> = {
        "Event not found.": "El evento no existe.",
        "Invalid sector.": "Sector inválido.",
        "Event sold out.": "Entradas agotadas para este evento.",
        "Sector sold out.": "Este sector está agotado.",
        "Unauthorized.": "Tenés que iniciar sesión para comprar."
    };

    return translations[message] ?? message;
}

type EventPurchasePanelProps = {
    eventId: number;
    sectors: EventSector[];
    availableTickets: number;
};

export function EventPurchasePanel({
    eventId,
    sectors,
    availableTickets
}: EventPurchasePanelProps) {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const soldOut = availableTickets === 0;

    const firstAvailableSector = useMemo(
        () => sectors.find((sector) => sector.capacity > 0)?.name ?? null,
        [sectors]
    );

    const [selectedSector, setSelectedSector] =
        useState<EventSectorName | null>(firstAvailableSector);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [purchasedTicket, setPurchasedTicket] = useState<Ticket | null>(null);

    const selected = sectors.find((sector) => sector.name === selectedSector);

    const handlePurchase = async () => {
        if (!selectedSector || !selected) return;

        if (!user) {
            router.push(`/login?redirect=/events/${eventId}`);
            return;
        }

        setIsPurchasing(true);
        setError(null);

        try {
            const result = await purchaseTicketAction(eventId, selectedSector);
            if ("error" in result) {
                throw new Error(result.error);
            }
            setPurchasedTicket(result.ticket);
        } catch (err) {
            setError(
                translateError(
                    err instanceof Error
                        ? err.message
                        : "No se pudo completar la compra."
                )
            );
        } finally {
            setIsPurchasing(false);
        }
    };

    if (purchasedTicket) {
        return (
            <div className="rounded-xl border border-primary/20 bg-primary-fixed/30 px-6 py-5 space-y-4">
                <p className="font-headline font-bold text-primary text-lg">
                    ¡Compra confirmada!
                </p>
                <p className="font-body text-sm text-on-surface-variant">
                    Tu entrada para{" "}
                    <span className="font-bold text-primary">
                        {sectorLabels[purchasedTicket.sector]}
                    </span>{" "}
                    quedó registrada. Podés verla en tu historial.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                        href="/history"
                        className="editorial-gradient text-on-primary text-center px-6 py-3 rounded-xl font-headline font-bold text-sm tracking-tight transition-transform active:scale-95 hover:opacity-90"
                    >
                        Ver historial
                    </Link>
                    <Link
                        href="/discover"
                        className="text-center px-6 py-3 rounded-xl font-headline font-bold text-sm tracking-tight text-primary border border-outline-variant/30 hover:bg-surface-container-low transition-colors"
                    >
                        Seguir explorando
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {sectors.length > 0 && (
                <section>
                    <h2 className="font-headline font-black text-xl text-primary mb-4">
                        Elegí tu sector
                    </h2>
                    <ul className="space-y-3">
                        {sectors.map((sector) => {
                            const sectorSoldOut =
                                soldOut || sector.capacity === 0;
                            const isSelected = selectedSector === sector.name;

                            return (
                                <li key={sector.name}>
                                    <button
                                        type="button"
                                        disabled={sectorSoldOut}
                                        onClick={() =>
                                            setSelectedSector(sector.name)
                                        }
                                        className={`w-full flex items-center justify-between gap-4 px-5 py-4 rounded-xl border text-left transition-colors ${
                                            sectorSoldOut
                                                ? "border-outline-variant/20 bg-surface-container opacity-50 cursor-not-allowed"
                                                : isSelected
                                                  ? "border-primary bg-primary-fixed/20"
                                                  : "border-outline-variant/20 bg-surface-container-lowest hover:border-primary/40"
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span
                                                className={`size-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                                                    isSelected
                                                        ? "border-primary"
                                                        : "border-outline-variant"
                                                }`}
                                            >
                                                {isSelected && (
                                                    <span className="size-2.5 rounded-full bg-primary" />
                                                )}
                                            </span>
                                            <div>
                                                <p className="font-headline font-bold text-primary">
                                                    {sectorLabels[sector.name]}
                                                </p>
                                                <p className="font-body text-xs text-on-surface-variant">
                                                    {sectorSoldOut
                                                        ? "Agotado"
                                                        : `${sector.capacity} disponibles`}
                                                </p>
                                            </div>
                                        </div>
                                        <p
                                            className={`font-headline font-extrabold text-lg shrink-0 ${
                                                sectorSoldOut
                                                    ? "text-on-surface-variant"
                                                    : "text-primary"
                                            }`}
                                        >
                                            {formatPrice(sector.price)}
                                        </p>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </section>
            )}

            {selected && !soldOut && (
                <p className="font-body text-sm text-on-surface-variant">
                    Total:{" "}
                    <span className="font-headline font-extrabold text-primary text-lg">
                        {formatPrice(selected.price)}
                    </span>
                </p>
            )}

            {error && (
                <div className="bg-error-container text-on-error-container border border-error/20 rounded-xl px-4 py-3 text-sm font-body">
                    {error}
                </div>
            )}

            {soldOut ? (
                <span className="inline-block w-full text-center bg-surface-container text-on-surface-variant px-6 py-3 rounded-xl font-headline font-bold text-sm tracking-tight opacity-50 cursor-not-allowed">
                    Entradas agotadas
                </span>
            ) : authLoading ? (
                <span className="inline-block w-full text-center bg-surface-container text-on-surface-variant px-6 py-3 rounded-xl font-headline font-bold text-sm tracking-tight opacity-70">
                    Cargando...
                </span>
            ) : !user ? (
                <Link
                    href={`/login?redirect=/events/${eventId}`}
                    className="inline-block w-full text-center editorial-gradient text-on-primary px-6 py-3.5 rounded-xl font-headline font-bold text-sm tracking-tight transition-transform active:scale-95 hover:opacity-90"
                >
                    Iniciá sesión para comprar
                </Link>
            ) : (
                <button
                    type="button"
                    onClick={handlePurchase}
                    disabled={
                        !selectedSector ||
                        !selected ||
                        selected.capacity === 0 ||
                        isPurchasing
                    }
                    className="editorial-gradient text-on-primary w-full px-6 py-3.5 rounded-xl font-headline font-bold text-sm tracking-tight transition-transform active:scale-95 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                    {isPurchasing
                        ? "Comprando..."
                        : selected
                          ? `Comprar · ${formatPrice(selected.price)}`
                          : "Elegí un sector"}
                </button>
            )}
        </div>
    );
}
