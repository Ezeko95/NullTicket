"use client";

import { EventForm } from "@/components/admin/EventForm";

interface CreateEventFormProps {
    adminEmail: string;
}

export function CreateEventForm({ adminEmail }: CreateEventFormProps) {
    return <EventForm mode="create" adminEmail={adminEmail} />;
}
