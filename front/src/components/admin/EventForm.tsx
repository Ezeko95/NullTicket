"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Event, EventSectorName } from "@repo/types";
import { createEventAction, updateEventAction } from "@/actions/admin-events";

type SectorFormState = Record<
    EventSectorName,
    { capacity: string; price: string }
>;

const defaultSectors: SectorFormState = {
    vip: { capacity: "50", price: "60000" },
    campo: { capacity: "300", price: "22000" },
    platea: { capacity: "120", price: "35000" },
    general: { capacity: "500", price: "15000" }
};

const sectorLabels: Record<EventSectorName, string> = {
    vip: "VIP",
    campo: "Campo",
    platea: "Platea",
    general: "General"
};

const sectorNames = Object.keys(defaultSectors) as EventSectorName[];

type EventFormMode = "create" | "edit";

interface EventFormProps {
    adminEmail: string;
    mode: EventFormMode;
    event?: Event;
}

function toPositiveInteger(value: string): number | null {
    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed < 0) {
        return null;
    }

    return parsed;
}

function toDatetimeLocalValue(iso: string): string {
    const date = new Date(iso);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const pad = (value: number) => String(value).padStart(2, "0");

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function sectorsFromEvent(event: Event): SectorFormState {
    const sectors = { ...defaultSectors };

    for (const sectorName of sectorNames) {
        const sector = event.sectors.find((item) => item.name === sectorName);

        sectors[sectorName] = sector
            ? {
                  capacity: String(sector.capacity),
                  price: String(sector.price)
              }
            : { capacity: "0", price: "0" };
    }

    return sectors;
}

export function EventForm({ adminEmail, mode, event }: EventFormProps) {
    const router = useRouter();
    const isEdit = mode === "edit";

    const [name, setName] = useState(isEdit && event ? event.name : "");
    const [location, setLocation] = useState(
        isEdit && event ? event.location : ""
    );
    const [date, setDate] = useState(
        isEdit && event ? toDatetimeLocalValue(event.date) : ""
    );
    const [image, setImage] = useState(
        isEdit && event ? (event.image ?? "") : ""
    );
    const [sectors, setSectors] = useState<SectorFormState>(
        isEdit && event ? sectorsFromEvent(event) : defaultSectors
    );
    const [error, setError] = useState<string | null>(null);
    const [createdEvent, setCreatedEvent] = useState<Event | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const activeSectorCount = useMemo(
        () =>
            Object.values(sectors).filter(
                ({ capacity }) => Number(capacity) > 0
            ).length,
        [sectors]
    );

    const updateSector = (
        sectorName: EventSectorName,
        field: "capacity" | "price",
        value: string
    ) => {
        setSectors((current) => ({
            ...current,
            [sectorName]: {
                ...current[sectorName],
                [field]: value
            }
        }));
    };

    const handleSubmit = async (
        formEvent: React.FormEvent<HTMLFormElement>
    ) => {
        formEvent.preventDefault();
        setError(null);
        setCreatedEvent(null);

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            setError("Ingresá una fecha válida.");
            return;
        }

        const parsedSectors = [];

        for (const [sectorName, values] of Object.entries(sectors)) {
            const capacity = toPositiveInteger(values.capacity);
            const price = toPositiveInteger(values.price);

            if (capacity === null || price === null) {
                setError(
                    `Revisá capacidad y precio para ${sectorLabels[sectorName as EventSectorName]}.`
                );
                return;
            }

            parsedSectors.push({
                name: sectorName as EventSectorName,
                capacity,
                price
            });
        }

        const activeSectors = parsedSectors.filter(
            (sector) => sector.capacity > 0
        );

        if (activeSectors.length === 0) {
            setError("Definí al menos un sector con capacidad mayor a cero.");
            return;
        }

        setIsSubmitting(true);

        try {
            const sectorsPayload = JSON.stringify(
                activeSectors.map((sector) => ({
                    name: sector.name,
                    capacity: sector.capacity,
                    price: sector.price
                }))
            );

            const result = isEdit
                ? await updateEventAction(
                      String(event?.id ?? ""),
                      name.trim(),
                      location.trim(),
                      parsedDate.toISOString(),
                      sectorsPayload,
                      image.trim()
                  )
                : await createEventAction(
                      name.trim(),
                      location.trim(),
                      parsedDate.toISOString(),
                      sectorsPayload,
                      image.trim()
                  );

            if ("error" in result) {
                setError(result.error);
                return;
            }

            if (isEdit) {
                const updatedEvent = result.event;
                router.push(
                    `/admin/events?updated=${encodeURIComponent(updatedEvent.name)}`
                );
                return;
            }

            setCreatedEvent(result.event);
            setName("");
            setLocation("");
            setDate("");
            setImage("");
            setSectors(defaultSectors);
        } catch (submitError) {
            setError(
                submitError instanceof Error
                    ? submitError.message
                    : isEdit
                      ? "No se pudo actualizar el evento."
                      : "No se pudo crear el evento."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <form
                onSubmit={handleSubmit}
                className="rounded-3xl border border-outline-variant bg-surface px-6 py-7 shadow-ambient md:px-8"
            >
                <div className="mb-8">
                    <p className="text-xs font-black uppercase tracking-widest text-primary font-label">
                        {isEdit ? "Editar evento" : "Nuevo evento"}
                    </p>
                    <h1 className="mt-3 text-3xl font-black tracking-tighter text-on-surface font-headline">
                        {isEdit
                            ? "Actualizá la experiencia"
                            : "Cargá la próxima experiencia"}
                    </h1>
                    <p className="mt-2 text-sm text-on-surface-variant font-body">
                        {isEdit
                            ? "El formulario envía PATCH /events/:id con Bearer JWT. Solo eventos sin entradas vendidas pueden editarse."
                            : "El formulario usa la cookie admin_token y envía POST /events con Bearer JWT."}
                    </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                    <div className="md:col-span-2">
                        <label className="mb-1.5 block text-xs font-black uppercase tracking-widest text-on-surface-variant font-label">
                            Nombre del evento
                        </label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(inputEvent) =>
                                setName(inputEvent.target.value)
                            }
                            placeholder="Festival Sideral"
                            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-on-surface outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition font-body text-sm"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-black uppercase tracking-widest text-on-surface-variant font-label">
                            Lugar
                        </label>
                        <input
                            type="text"
                            required
                            value={location}
                            onChange={(inputEvent) =>
                                setLocation(inputEvent.target.value)
                            }
                            placeholder="Movistar Arena"
                            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-on-surface outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition font-body text-sm"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-black uppercase tracking-widest text-on-surface-variant font-label">
                            Fecha y hora
                        </label>
                        <input
                            type="datetime-local"
                            required
                            value={date}
                            onChange={(inputEvent) =>
                                setDate(inputEvent.target.value)
                            }
                            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-on-surface outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition font-body text-sm"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-1.5 block text-xs font-black uppercase tracking-widest text-on-surface-variant font-label">
                            Imagen (opcional)
                        </label>
                        <input
                            type="url"
                            value={image}
                            onChange={(inputEvent) =>
                                setImage(inputEvent.target.value)
                            }
                            placeholder="https://..."
                            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-on-surface outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition font-body text-sm"
                        />
                    </div>
                </div>

                <div className="mt-8">
                    <div className="mb-4 flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-black tracking-tight text-on-surface font-headline">
                                Sectores
                            </h2>
                            <p className="text-sm text-on-surface-variant font-body">
                                Dejá capacidad en 0 para omitir un sector.
                            </p>
                        </div>
                        <span className="rounded-full bg-primary/8 px-3 py-1 text-xs font-black uppercase tracking-widest text-primary font-label">
                            {activeSectorCount} activos
                        </span>
                    </div>

                    <div className="space-y-3">
                        {sectorNames.map((sectorName) => (
                            <div
                                key={sectorName}
                                className="grid gap-3 rounded-2xl border border-outline-variant bg-surface-container-low p-4 md:grid-cols-[minmax(0,1fr)_140px_140px]"
                            >
                                <div>
                                    <p className="font-headline font-bold text-on-surface">
                                        {sectorLabels[sectorName]}
                                    </p>
                                    <p className="text-sm text-on-surface-variant font-body">
                                        Capacidad y precio base del sector.
                                    </p>
                                </div>

                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={sectors[sectorName].capacity}
                                    onChange={(inputEvent) =>
                                        updateSector(
                                            sectorName,
                                            "capacity",
                                            inputEvent.target.value
                                        )
                                    }
                                    placeholder="Capacidad"
                                    className="bg-background border border-outline-variant rounded-xl px-4 py-3 text-on-surface outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition font-body text-sm"
                                />

                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={sectors[sectorName].price}
                                    onChange={(inputEvent) =>
                                        updateSector(
                                            sectorName,
                                            "price",
                                            inputEvent.target.value
                                        )
                                    }
                                    placeholder="Precio"
                                    className="bg-background border border-outline-variant rounded-xl px-4 py-3 text-on-surface outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition font-body text-sm"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="mt-6 rounded-2xl border border-error/20 bg-error-container px-4 py-3 text-sm text-on-error-container font-body">
                        {error}
                    </div>
                )}

                {createdEvent && (
                    <div className="mt-6 rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-on-surface font-body">
                        Evento creado: <strong>{createdEvent.name}</strong> en{" "}
                        {createdEvent.location}.{" "}
                        <Link
                            href="/admin/events"
                            className="font-bold text-primary hover:underline underline-offset-4"
                        >
                            Ver listado
                        </Link>
                    </div>
                )}

                <div className="mt-8 flex flex-wrap items-center gap-3">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="editorial-gradient text-on-primary px-6 py-4 rounded-xl font-black font-headline tracking-tight hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isSubmitting
                            ? isEdit
                                ? "Guardando cambios..."
                                : "Creando evento..."
                            : isEdit
                              ? "Guardar cambios"
                              : "Crear evento"}
                    </button>

                    {isEdit ? (
                        <Link
                            href="/admin/events"
                            className="rounded-xl border border-outline-variant px-6 py-4 text-sm font-black text-on-surface-variant font-headline hover:bg-surface-container-low transition"
                        >
                            Cancelar
                        </Link>
                    ) : null}
                </div>
            </form>

            <aside className="rounded-3xl border border-outline-variant bg-surface-container-low px-6 py-7 h-fit">
                <p className="text-xs font-black uppercase tracking-widest text-primary font-label">
                    Sesión admin
                </p>
                <p className="mt-3 text-lg font-black tracking-tight text-on-surface font-headline">
                    {adminEmail}
                </p>
                <p className="mt-2 text-sm text-on-surface-variant font-body">
                    Esta sesión usa la cookie admin_token y convive con la
                    autenticación pública sin compartir estado.
                </p>

                <div className="mt-6 rounded-2xl border border-outline-variant bg-background px-4 py-4">
                    <p className="text-sm font-bold text-on-surface font-headline">
                        Contrato esperado
                    </p>
                    <p className="mt-2 text-sm text-on-surface-variant font-body">
                        {isEdit
                            ? "PATCH /events/:id con Authorization: Bearer admin_token y body:"
                            : "POST /events con Authorization: Bearer admin_token y body:"}
                    </p>
                    <code className="mt-3 block whitespace-pre-wrap text-xs text-on-surface-variant">
                        {`{ name, location, date, image?, availableTickets, sectors[] }`}
                    </code>
                </div>
            </aside>
        </div>
    );
}
