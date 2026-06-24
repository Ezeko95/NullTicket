import { notFound } from "next/navigation";
import { TicketPassDetail } from "@/components/tickets/TicketPassDetail";
import { getEvents } from "@/lib/events";
import { getMyTicketById } from "@/lib/tickets";

export default async function TicketPassPage({
    params
}: {
    params: Promise<{ ticketId: string }>;
}) {
    const { ticketId } = await params;
    const id = Number(ticketId);

    if (!Number.isInteger(id) || id <= 0) {
        notFound();
    }

    let ticket;
    try {
        ticket = await getMyTicketById(id);
    } catch {
        notFound();
    }

    if (!ticket) {
        notFound();
    }

    const events = await getEvents();
    const image = events.find((event) => event.id === ticket.eventId)?.image;

    return <TicketPassDetail ticket={ticket} image={image} />;
}
