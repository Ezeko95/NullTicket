"use client";

import Link from "next/link";
import { useState } from "react";
import { DeleteEventModal } from "@/components/admin/DeleteEventModal";

interface AdminEventActionsProps {
    eventId: number;
    eventName: string;
    eventLocation: string;
    eventDateLabel: string;
    canModify: boolean;
}

export function AdminEventActions({
    eventId,
    eventName,
    eventLocation,
    eventDateLabel,
    canModify
}: AdminEventActionsProps) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    if (!canModify) {
        return (
            <span className="text-sm text-on-surface-variant font-body">—</span>
        );
    }

    return (
        <>
            <div className="flex flex-wrap items-center gap-2">
                <Link
                    href={`/admin/events/${eventId}/edit`}
                    className="rounded-full border border-outline-variant bg-surface-container-low px-3 py-1.5 text-xs font-black uppercase tracking-widest text-primary font-label hover:bg-primary/8 transition"
                >
                    Editar
                </Link>
                <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="rounded-full border border-error/20 bg-error-container px-3 py-1.5 text-xs font-black uppercase tracking-widest text-on-error-container font-label hover:opacity-90 transition"
                >
                    Eliminar
                </button>
            </div>

            <DeleteEventModal
                eventId={eventId}
                eventName={eventName}
                eventLocation={eventLocation}
                eventDateLabel={eventDateLabel}
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
            />
        </>
    );
}
