"use server";

import type { EventSectorName, Ticket } from "@repo/types";
import { purchaseTicket } from "@/lib/tickets";

export async function purchaseTicketAction(
    eventId: number,
    sector: EventSectorName
): Promise<{ ticket: Ticket } | { error: string }> {
    try {
        const ticket = await purchaseTicket(eventId, sector);
        return { ticket };
    } catch (error) {
        return {
            error:
                error instanceof Error
                    ? error.message
                    : "No se pudo completar la compra."
        };
    }
}
