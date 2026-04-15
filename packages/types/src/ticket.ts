import type { EventSectorName } from "./event.js";

export type TicketStatus = "active" | "used" | "cancelled";

export type Ticket = {
    id: number;
    eventId: number;
    eventName: string;
    eventDate: string;
    sector: EventSectorName;
    price: number;
    status: TicketStatus;
    userId: number;
    purchasedAt: string;
};
