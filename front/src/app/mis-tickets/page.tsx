"use client";

import { useTickets } from "@/context/TicketContext";

export default function MisTickets() {
    const { misTickets } = useTickets();

    return (
        <div className="glass-panel p-8 min-h-[500px]">
            <h2 className="text-3xl font-bold mb-6">
                Inventario de Tickets Personales
            </h2>
            {misTickets === 0 ? (
                <p className="text-gray-400 bg-gray-800/50 p-6 rounded-lg text-lg text-center">
                    Aún no has adquirido ningún ticket. ¡Ve al carrito o pídele
                    a nuestro Agente Inteligente que haga el proceso!
                </p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {[...Array(misTickets)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-gray-800/90 p-6 rounded-2xl border border-gray-700 flex flex-col items-center justify-center gap-3 hover:-translate-y-2 hover:bg-gray-700 hover:shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer"
                        >
                            <span className="text-5xl drop-shadow-md">🎟️</span>
                            <span className="text-sm text-gray-300 font-bold tracking-widest uppercase">
                                ID-{1000 + i}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
