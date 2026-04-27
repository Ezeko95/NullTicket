import type { Event } from "@repo/types";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL ?? "http://localhost:3001";

export async function getEvents(): Promise<Event[]> {
    const token = (await cookies()).get("token")?.value;

    const res = await fetch(`${API_URL}/events`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch events: ${res.status}`);
    }

    return res.json() as Promise<Event[]>;
}

export async function getEventById(id: number): Promise<Event> {
    const token = (await cookies()).get("token")?.value;

    const res = await fetch(`${API_URL}/events/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
    });

    if (res.status === 404) {
        throw new Error("Event not found");
    }

    if (!res.ok) {
        throw new Error(`Failed to fetch event: ${res.status}`);
    }

    return res.json() as Promise<Event>;
}
