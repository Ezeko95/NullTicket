import type {
    CreateEventRequest,
    Event,
    EventSectorName,
    PatchEventRequest
} from "@repo/types";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-session";

export type EventAdminStatus = "proximo" | "pasado" | "agotado";

export const EVENT_SECTOR_LABELS: Record<EventSectorName, string> = {
    vip: "VIP",
    campo: "Campo",
    platea: "Platea",
    general: "General"
};

const API_URL =
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:3001";

export interface AdminEventSectorInput {
    name: EventSectorName;
    capacity: number;
    price: number;
}

export interface CreateAdminEventInput {
    name: string;
    location: string;
    date: string;
    image?: string;
    sectors: AdminEventSectorInput[];
}

function missingBackendMessage(): string {
    return "No se pudo contactar el backend de eventos. Verificá que la API esté corriendo en API_URL.";
}

function unexpectedResponseMessage(): string {
    return "El backend respondió, pero no devolvió un evento válido.";
}

function readBackendErrorMessage(errorBody: unknown, fallback: string): string {
    if (
        errorBody &&
        typeof errorBody === "object" &&
        "message" in errorBody &&
        typeof errorBody.message === "string"
    ) {
        return errorBody.message;
    }

    if (
        errorBody &&
        typeof errorBody === "object" &&
        "error" in errorBody &&
        typeof errorBody.error === "string"
    ) {
        return errorBody.error;
    }

    return fallback;
}

function isValidEvent(event: Partial<Event>): event is Event {
    return (
        typeof event.id === "number" &&
        typeof event.name === "string" &&
        typeof event.location === "string" &&
        typeof event.date === "string" &&
        typeof event.availableTickets === "number" &&
        Array.isArray(event.sectors)
    );
}

function parseEventResponse(event: Partial<Event>): Event {
    if (!isValidEvent(event)) {
        throw new Error(unexpectedResponseMessage());
    }

    return JSON.parse(JSON.stringify(event)) as Event;
}

function wrapAdminFetchError(error: unknown): never {
    if (error instanceof Error) {
        if (error.cause instanceof Error) {
            throw error.cause;
        }

        if (error.message.includes("fetch failed")) {
            throw new Error(missingBackendMessage());
        }

        throw error;
    }

    throw new Error(missingBackendMessage());
}

async function getAdminAuthToken(): Promise<string> {
    const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;

    if (!token) {
        throw new Error("La sesión de admin venció. Volvé a iniciar sesión.");
    }

    return token;
}

export function getEventCapacity(event: Event): number {
    return event.sectors.reduce((sum, sector) => sum + sector.capacity, 0);
}

export function getEventSoldCount(event: Event): number {
    return getEventCapacity(event) - event.availableTickets;
}

export function getEventMinPrice(event: Event): number | null {
    if (event.sectors.length === 0) {
        return null;
    }

    return Math.min(...event.sectors.map((sector) => sector.price));
}

export function getEventAdminStatus(event: Event): EventAdminStatus {
    const eventTime = new Date(event.date).getTime();

    if (eventTime < Date.now()) {
        return "pasado";
    }

    if (event.availableTickets === 0) {
        return "agotado";
    }

    return "proximo";
}

export function formatAdminEventDate(iso: string): string {
    return new Date(iso).toLocaleDateString("es-AR", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC"
    });
}

export function formatAdminPrice(price: number): string {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0
    }).format(price);
}

export async function getAdminEvents(): Promise<Event[]> {
    try {
        const response = await fetch(`${API_URL}/events`, {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(
                `No se pudieron cargar los eventos (${response.status}).`
            );
        }

        const events = (await response.json()) as Event[];

        if (!Array.isArray(events)) {
            throw new Error(unexpectedResponseMessage());
        }

        return events;
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("fetch failed")) {
                throw new Error(missingBackendMessage());
            }

            throw error;
        }

        throw new Error(missingBackendMessage());
    }
}

function toCreateEventRequest(
    payload: CreateAdminEventInput
): CreateEventRequest {
    const availableTickets = payload.sectors.reduce(
        (sum, sector) => sum + sector.capacity,
        0
    );

    return {
        name: payload.name,
        location: payload.location,
        date: payload.date,
        ...(payload.image ? { image: payload.image } : {}),
        sectors: payload.sectors,
        availableTickets
    };
}

function toPatchEventRequest(
    payload: CreateAdminEventInput
): PatchEventRequest {
    const availableTickets = payload.sectors.reduce(
        (sum, sector) => sum + sector.capacity,
        0
    );

    return {
        name: payload.name,
        location: payload.location,
        date: payload.date,
        image: payload.image,
        sectors: payload.sectors,
        availableTickets
    };
}

export async function getAdminEventById(id: number): Promise<Event> {
    try {
        const response = await fetch(`${API_URL}/events/${id}`, {
            cache: "no-store"
        });

        if (response.status === 404) {
            throw new Error("No se encontró el evento.");
        }

        if (!response.ok) {
            throw new Error(
                `No se pudo cargar el evento (${response.status}).`
            );
        }

        const event = (await response.json()) as Partial<Event>;
        return parseEventResponse(event);
    } catch (error) {
        wrapAdminFetchError(error);
    }
}

export async function createAdminEvent(
    payload: CreateAdminEventInput
): Promise<Event> {
    const token = await getAdminAuthToken();
    const body = toCreateEventRequest(payload);

    try {
        const response = await fetch(`${API_URL}/events`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body),
            cache: "no-store"
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => null);
            throw new Error(
                readBackendErrorMessage(
                    errorBody,
                    `No se pudo crear el evento (${response.status}).`
                )
            );
        }

        const event = (await response.json()) as Partial<Event>;
        return parseEventResponse(event);
    } catch (error) {
        wrapAdminFetchError(error);
    }
}

export async function patchAdminEvent(
    eventId: number,
    payload: CreateAdminEventInput
): Promise<Event> {
    const token = await getAdminAuthToken();
    const body = toPatchEventRequest(payload);

    try {
        const response = await fetch(`${API_URL}/events/${eventId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body),
            cache: "no-store"
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => null);
            throw new Error(
                readBackendErrorMessage(
                    errorBody,
                    `No se pudo actualizar el evento (${response.status}).`
                )
            );
        }

        const event = (await response.json()) as Partial<Event>;
        return parseEventResponse(event);
    } catch (error) {
        wrapAdminFetchError(error);
    }
}

export async function deleteAdminEvent(eventId: number): Promise<void> {
    const token = await getAdminAuthToken();

    try {
        const response = await fetch(`${API_URL}/events/${eventId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            },
            cache: "no-store"
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => null);
            throw new Error(
                readBackendErrorMessage(
                    errorBody,
                    `No se pudo eliminar el evento (${response.status}).`
                )
            );
        }
    } catch (error) {
        wrapAdminFetchError(error);
    }
}
