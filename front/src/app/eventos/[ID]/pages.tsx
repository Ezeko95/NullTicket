import React, { useState } from "react";
import { ShoppingCart, X, Trash2 } from "lucide-react"; // Instala lucide-react para los iconos

export default function SeleccionEntradas({ params }) {
    const [cantidad, setCantidad] = useState(1);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Datos del evento (podrían venir de una API)
    const evento = {
        nombre: "Ecos Sintetizados",
        precio: 8000,
        img: "/musica.jpg"
    };
    const total = cantidad * evento.precio;

    return (
        <div className="relative min-h-screen bg-white text-black font-sans">
            {/* --- PÁGINA DE SELECCIÓN --- */}
            <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="rounded-lg overflow-hidden shadow-xl">
                    <img
                        src={evento.img}
                        alt="Evento"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex flex-col justify-center">
                    <h1 className="text-4xl font-bold mb-4">{evento.nombre}</h1>
                    <p className="text-2xl mb-8">
                        ${evento.precio.toLocaleString()}
                    </p>

                    {/* Selector de cantidad */}
                    <div className="flex items-center border w-max mb-8">
                        <button
                            onClick={() =>
                                setCantidad(Math.max(1, cantidad - 1))
                            }
                            className="px-4 py-2 border-r"
                        >
                            -
                        </button>
                        <span className="px-6 py-2">{cantidad}</span>
                        <button
                            onClick={() => setCantidad(cantidad + 1)}
                            className="px-4 py-2 border-l"
                        >
                            +
                        </button>
                    </div>

                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="bg-black text-white py-4 rounded font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all"
                    >
                        Añadir al carrito
                    </button>
                </div>
            </div>

            {/* --- CARRITO LATERAL (OVERLAY) --- */}
            {isCartOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity">
                    <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl p-6 flex flex-col">
                        {/* Header del Carrito */}
                        <div className="flex justify-between items-center border-b pb-4 mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <ShoppingCart size={24} /> Tu Carrito
                            </h2>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Lista de Items */}
                        <div className="flex-grow overflow-y-auto">
                            <div className="flex gap-4 border-b pb-4">
                                <img
                                    src={evento.img}
                                    className="w-20 h-20 object-cover rounded"
                                    alt="Miniatura"
                                />
                                <div className="flex-grow">
                                    <h3 className="font-bold">
                                        {evento.nombre}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Cantidad: {cantidad}
                                    </p>
                                    <p className="font-semibold mt-1">
                                        ${total.toLocaleString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setCantidad(0)}
                                    className="text-gray-400 hover:text-red-500"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Footer del Carrito */}
                        <div className="border-t pt-6">
                            <div className="flex justify-between text-lg font-bold mb-6">
                                <span>Subtotal</span>
                                <span>${total.toLocaleString()}</span>
                            </div>
                            <button
                                className="w-full bg-black text-white py-4 rounded font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all"
                                onClick={() =>
                                    alert("Redirigiendo a pasarela de pago...")
                                }
                            >
                                Finalizar Compra
                            </button>
                            <p className="text-center text-xs text-gray-400 mt-4 uppercase tracking-tighter">
                                Impuestos incluidos. Envío digital inmediato.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
