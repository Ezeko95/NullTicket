"use client";

import { useState, useRef, useEffect } from "react";
import type { Event } from "@repo/types";
import { EventCard } from "@/components/events/EventCard";

interface Message {
    role: "user" | "ai";
    text: string;
    events?: Event[];
}

const consultasPrevias = [
    {
        label: "Jazz Modernista en Buenos Aires",
        sub: "Buscando salas íntimas..."
    },
    {
        label: "Bienales de Arte y Diseño",
        sub: "Encontró 3 coincidencias en Berlín"
    },
    { label: "La Experiencia Orquestal", sub: "Reserva confirmada en el Colón" }
];

const INITIAL_MESSAGE: Message = {
    role: "ai",
    text: "Soy tu Concierge Editorial, curando en tiempo real. Contame qué tipo de experiencia estás buscando — una ciudad específica, un estado de ánimo o un género cultural — y voy a seleccionar las mejores opciones disponibles para vos."
};

export default function ConciergePage() {
    const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        const text = input.trim();
        if (!text || isTyping) return;

        const userMessage: Message = { role: "user", text };
        const updatedMessages = [...messages, userMessage];

        setMessages(updatedMessages);
        setInput("");
        setIsTyping(true);

        try {
            const res = await fetch("/api/concierge", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: updatedMessages,
                    input: text
                })
            });

            const data = await res.json();

            setMessages((prev) => [
                ...prev,
                {
                    role: "ai",
                    text: res.ok
                        ? data.text
                        : (data.error ?? "Ocurrió un error inesperado."),
                    events: res.ok ? (data.events ?? []) : []
                }
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: "ai",
                    text: "No se pudo conectar con el servicio. Intentá de nuevo en unos momentos."
                }
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    return (
        <div className="max-w-screen-2xl mx-auto flex h-[calc(100vh-6rem)] overflow-hidden">
            {/* ── Panel lateral ── */}
            <aside className="hidden md:flex flex-col w-72 shrink-0 bg-surface-container-low border-r border-outline-variant/10 p-6">
                <p className="text-xs uppercase tracking-widest font-bold text-on-surface-variant font-label mb-6">
                    Historial del Curador Personal
                </p>
                <button className="editorial-gradient text-on-primary rounded-xl px-5 py-3 font-headline font-bold text-sm mb-8 flex items-center gap-2 hover:opacity-90 transition-opacity">
                    <span className="material-symbols-outlined text-[18px]">
                        add
                    </span>
                    Nueva Consulta
                </button>
                <div className="space-y-1">
                    <p className="text-xs font-bold text-on-surface-variant font-label uppercase tracking-widest mb-2">
                        Hoy
                    </p>
                    {consultasPrevias.map(({ label, sub }) => (
                        <button
                            key={label}
                            className="w-full text-left px-4 py-3 rounded-xl hover:bg-surface-container transition-colors"
                        >
                            <p className="font-body text-sm font-semibold text-on-surface truncate">
                                {label}
                            </p>
                            <p className="font-body text-xs text-on-surface-variant truncate mt-0.5">
                                {sub}
                            </p>
                        </button>
                    ))}
                </div>
            </aside>

            {/* ── Chat ── */}
            <div className="flex flex-col flex-1 min-w-0">
                {/* Encabezado */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-outline-variant/10">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full editorial-gradient flex items-center justify-center">
                            <span className="material-symbols-outlined text-on-primary text-[18px]">
                                psychology
                            </span>
                        </div>
                        <div>
                            <p className="font-headline font-bold text-primary text-sm">
                                Concierge Editorial
                            </p>
                            <p className="flex items-center gap-1 text-xs text-on-surface-variant font-body">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                                Curando en tiempo real
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mensajes */}
                <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6">
                    {messages.map((msg, i) => (
                        <div key={i} className="flex flex-col gap-4">
                            <div
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[70%] px-6 py-4 rounded-2xl font-body text-base leading-relaxed whitespace-pre-wrap ${
                                        msg.role === "user"
                                            ? "editorial-gradient text-on-primary rounded-br-sm"
                                            : "bg-surface-container-lowest shadow-ambient text-on-surface rounded-tl-sm"
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                            {msg.events && msg.events.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
                                    {msg.events.map((event) => (
                                        <EventCard key={event.id} {...event} />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-surface-container-lowest shadow-ambient rounded-2xl rounded-tl-sm px-6 py-4 flex gap-2 items-center">
                                {[0, 1, 2].map((i) => (
                                    <span
                                        key={i}
                                        className="w-2 h-2 rounded-full bg-on-surface-variant animate-bounce"
                                        style={{
                                            animationDelay: `${i * 150}ms`
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <form
                    onSubmit={handleSend}
                    className="px-8 py-5 border-t border-outline-variant/10"
                >
                    <div className="flex items-center gap-3 bg-surface-container-low rounded-2xl px-5 py-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Describí tu estado de ánimo o un interés específico..."
                            className="flex-1 bg-transparent border-none outline-none text-sm font-body placeholder:text-on-surface-variant text-on-surface"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className="editorial-gradient text-on-primary px-5 py-2 rounded-xl font-headline font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center gap-2 shrink-0"
                        >
                            Enviar
                            <span className="material-symbols-outlined text-[16px]">
                                arrow_forward
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
