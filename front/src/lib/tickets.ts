import type { Ticket } from "@repo/types";
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
