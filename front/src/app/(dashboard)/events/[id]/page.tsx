import { notFound } from "next/navigation";
import { EventDetail } from "@/components/events/EventDetail";
import { getEventById } from "@/lib/events";
import type { Event } from "@repo/types";

export default async function EventPage({
    params
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const eventId = Number(id);

    if (!Number.isInteger(eventId) || eventId <= 0) {
        notFound();
    }

    let event: Event;
    try {
        event = await getEventById(eventId);
    } catch {
        notFound();
    }

    return <EventDetail {...event} />;
}
