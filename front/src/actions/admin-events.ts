"use server";

import type { Event, EventSectorName } from "@repo/types";
import {
    createAdminEvent,
    deleteAdminEvent,
    patchAdminEvent,
    type CreateAdminEventInput
} from "@/lib/admin-events";

type EventSectorInput = {
    name: EventSectorName;
    capacity: number;
    price: number;
};

function toPlainJson<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
}

function parseSectorsJson(sectorsJson: string): EventSectorInput[] {
    let parsed: unknown;

    try {
        parsed = JSON.parse(sectorsJson);
    } catch {
        throw new Error("Los sectores no tienen un formato válido.");
    }

    if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error(
            "Definí al menos un sector con capacidad mayor a cero."
        );
    }

    return parsed.map((sector) => {
        if (!sector || typeof sector !== "object") {
            throw new Error("Cada sector debe ser un objeto válido.");
        }

        const { name, capacity, price } = sector as Record<string, unknown>;

        if (typeof name !== "string") {
            throw new Error("Cada sector debe tener un nombre válido.");
        }

        const parsedCapacity = Number(capacity);
        const parsedPrice = Number(price);

        if (!Number.isInteger(parsedCapacity) || parsedCapacity < 0) {
            throw new Error("Cada sector debe tener una capacidad válida.");
        }

        if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
            throw new Error("Cada sector debe tener un precio válido.");
        }

        return {
            name: name as EventSectorName,
            capacity: parsedCapacity,
            price: parsedPrice
        };
    });
}

function toCreateEventInput(
    name: string,
    location: string,
    date: string,
    sectorsJson: string,
    image: string
): CreateAdminEventInput {
    const trimmedImage = image.trim();
    const sectors = parseSectorsJson(sectorsJson).filter(
        (sector) => sector.capacity > 0
    );

    if (sectors.length === 0) {
        throw new Error(
            "Definí al menos un sector con capacidad mayor a cero."
        );
    }

    return {
        name: name.trim(),
        location: location.trim(),
        date,
        ...(trimmedImage ? { image: trimmedImage } : {}),
        sectors
    };
}

function toSerializableEvent(event: Event): Event {
    return toPlainJson({
        id: Number(event.id),
        name: String(event.name),
        location: String(event.location),
        date: String(event.date),
        availableTickets: Number(event.availableTickets),
        sectors: event.sectors.map((sector) => ({
            name: sector.name,
            capacity: Number(sector.capacity),
            price: Number(sector.price)
        })),
        ...(event.image ? { image: String(event.image) } : {})
    });
}

export async function createEventAction(
    name: string,
    location: string,
    date: string,
    sectorsJson: string,
    image = ""
): Promise<{ event: Event } | { error: string }> {
    try {
        const input = toCreateEventInput(
            name,
            location,
            date,
            sectorsJson,
            image
        );
        const event = await createAdminEvent(input);
        return { event: toSerializableEvent(event) };
    } catch (error) {
        return {
            error:
                error instanceof Error
                    ? error.message
                    : "No se pudo crear el evento."
        };
    }
}

function parseEventId(eventId: string): number {
    const parsed = Number(eventId);

    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new Error("El identificador del evento no es válido.");
    }

    return parsed;
}

export async function updateEventAction(
    eventId: string,
    name: string,
    location: string,
    date: string,
    sectorsJson: string,
    image = ""
): Promise<{ event: Event } | { error: string }> {
    try {
        const id = parseEventId(eventId);
        const input = toCreateEventInput(
            name,
            location,
            date,
            sectorsJson,
            image
        );
        const event = await patchAdminEvent(id, input);
        return { event: toSerializableEvent(event) };
    } catch (error) {
        return {
            error:
                error instanceof Error
                    ? error.message
                    : "No se pudo actualizar el evento."
        };
    }
}

export async function deleteEventAction(
    eventId: string
): Promise<{ success: true } | { error: string }> {
    try {
        const id = parseEventId(eventId);
        await deleteAdminEvent(id);
        return { success: true };
    } catch (error) {
        return {
            error:
                error instanceof Error
                    ? error.message
                    : "No se pudo eliminar el evento."
        };
    }
}
