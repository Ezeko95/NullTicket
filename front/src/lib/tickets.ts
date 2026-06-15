import type { EventSectorName, Ticket } from "@repo/types";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL ?? "http://localhost:3001";

export async function getMyTickets(): Promise<Ticket[]> {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
        throw new Error("Unauthorized");
    }

    const res = await fetch(`${API_URL}/me/tickets`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch tickets: ${res.status}`);
    }

    return res.json() as Promise<Ticket[]>;
}

export async function purchaseTicket(
    eventId: number,
    sector: EventSectorName
): Promise<Ticket> {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
        throw new Error("Unauthorized.");
    }

    const res = await fetch(`${API_URL}/me/tickets`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ eventId, sector })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(
            typeof data.error === "string"
                ? data.error
                : "No se pudo completar la compra."
        );
    }

    return data as Ticket;
}
