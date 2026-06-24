"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteEventAction } from "@/actions/admin-events";

interface DeleteEventModalProps {
    eventId: number;
    eventName: string;
    eventLocation: string;
    eventDateLabel: string;
    isOpen: boolean;
    onClose: () => void;
}

export function DeleteEventModal({
    eventId,
    eventName,
    eventLocation,
    eventDateLabel,
    isOpen,
    onClose
}: DeleteEventModalProps) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setError(null);
            setIsDeleting(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleKeyDown = (keyboardEvent: KeyboardEvent) => {
            if (keyboardEvent.key === "Escape" && !isDeleting) {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, isDeleting, onClose]);

    if (!isOpen) {
        return null;
    }

    const handleDelete = async () => {
        setError(null);
        setIsDeleting(true);

        try {
            const result = await deleteEventAction(String(eventId));

            if ("error" in result) {
                setError(result.error);
                return;
            }

            onClose();
            router.push("/admin/events");
        } catch (deleteError) {
            setError(
                deleteError instanceof Error
                    ? deleteError.message
                    : "No se pudo eliminar el evento."
            );
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="presentation"
            onClick={() => {
                if (!isDeleting) {
                    onClose();
                }
            }}
        >
            <div className="absolute inset-0 bg-on-surface/50 backdrop-blur-sm" />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-event-title"
                className="relative w-full max-w-lg rounded-3xl border border-outline-variant bg-surface px-6 py-7 shadow-ambient"
                onClick={(clickEvent) => clickEvent.stopPropagation()}
            >
                <p className="text-xs font-black uppercase tracking-widest text-error font-label">
                    Eliminar evento
                </p>
                <h2
                    id="delete-event-title"
                    className="mt-3 text-2xl font-black tracking-tighter text-on-surface font-headline"
                >
                    ¿Confirmás la eliminación?
                </h2>
                <p className="mt-3 text-sm text-on-surface-variant font-body">
                    Se eliminará permanentemente{" "}
                    <strong className="text-on-surface">{eventName}</strong> (
                    {eventDateLabel}) en {eventLocation}. Esta acción no se
                    puede deshacer.
                </p>

                {error ? (
                    <div className="mt-5 rounded-2xl border border-error/20 bg-error-container px-4 py-3 text-sm text-on-error-container font-body">
                        {error}
                    </div>
                ) : null}

                <div className="mt-8 flex flex-wrap justify-end gap-3">
                    <button
                        type="button"
                        disabled={isDeleting}
                        onClick={onClose}
                        className="rounded-xl border border-outline-variant px-5 py-3 text-sm font-black text-on-surface-variant font-headline hover:bg-surface-container-low disabled:opacity-50 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        disabled={isDeleting}
                        onClick={handleDelete}
                        className="rounded-xl bg-error px-5 py-3 text-sm font-black text-on-error font-headline hover:opacity-90 disabled:opacity-50 transition"
                    >
                        {isDeleting ? "Eliminando..." : "Eliminar evento"}
                    </button>
                </div>
            </div>
        </div>
    );
}
