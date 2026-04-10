"use client";

import { useState } from "react";
import { useTickets } from "@/context/TicketContext";

export default function ComprarTickets() {
    const { stock, comprarTickets } = useTickets();
    const [cantidad, setCantidad] = useState(1);
    const [mensaje, setMensaje] = useState<{
        texto: string;
        isError: boolean;
    } | null>(null);

    const handleComprar = () => {
        const res = comprarTickets(cantidad);
        setMensaje({ texto: res.message, isError: !res.success });
        if (res.success) {
            setCantidad(1);
            setTimeout(() => setMensaje(null), 4000);
        }
    };

    return (
        <div className="max-w-xl mx-auto glass-panel p-10 mt-6">
            <h2 className="text-3xl font-bold mb-3">Carro de Adquisición</h2>
            <p className="text-gray-400 mb-8 border-b border-gray-800 pb-6">
                Selecciona la cantidad de tickets necesarios utilizando la
                botonera.
                <br />
                <span className="text-blue-400 font-bold mt-2 inline-block">
                    Stock Restante en Sistema: {stock} unidades
                </span>
            </p>

            <div className="flex bg-gray-900 rounded-2xl overflow-hidden self-start mb-8 border border-gray-700 shadow-inner w-max mx-auto">
                <button
                    onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                    className="px-8 py-4 bg-gray-800 hover:bg-gray-700 transition text-3xl font-bold flex items-center justify-center"
                >
                    -
                </button>
                <span className="w-24 text-center py-4 bg-gray-900 text-3xl font-bold text-white flex items-center justify-center">
                    {cantidad}
                </span>
                <button
                    onClick={() => setCantidad((c) => c + 1)}
                    className="px-8 py-4 bg-gray-800 hover:bg-gray-700 transition text-3xl font-bold flex items-center justify-center"
                >
                    +
                </button>
            </div>

            <button
                onClick={handleComprar}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all transform hover:scale-[1.02] py-5 rounded-2xl font-bold text-xl mb-4 shadow-lg shadow-blue-500/30 text-white"
            >
                Confirmar Compra
            </button>

            {mensaje && (
                <div
                    className={`p-4 mt-4 rounded-xl flex items-center gap-3 font-medium transition ${
                        mensaje.isError
                            ? "bg-red-500/20 text-red-300 border border-red-500/50"
                            : "bg-green-500/20 text-green-300 border border-green-500/50"
                    }`}
                >
                    <span className="text-2xl">
                        {mensaje.isError ? "⚠️" : "✅"}
                    </span>
                    {mensaje.texto}
                </div>
            )}
        </div>
    );
}
