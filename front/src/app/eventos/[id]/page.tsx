"use client";
import React, { useState, useEffect } from "react";
import {
    ShoppingCart,
    X,
    Trash2,
    Plus,
    Minus,
    CreditCard,
    Ticket,
    ArrowLeft
} from "lucide-react";
import Link from "next/link";

export default function SeleccionEntradas({
    params
}: {
    params: { id: string };
}) {
    const [cantidad, setCantidad] = useState(1);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // En un escenario real, aquí harías un fetch usando params.id
    const evento = {
        nombre: "Ecos Sintetizados: Noches en Berlín",
        precio: 8000,
        img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000",
        fecha: "24 de Octubre, 2025",
        lugar: "Templehof Hangar 4, Berlín",
        disponibles: 220
    };

    const total = cantidad * evento.precio;

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-zinc-900 font-sans selection:bg-zinc-200">
            {/* --- NAVIGATION --- */}
            <nav className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
                <Link
                    href="/"
                    className="flex items-center gap-2 group text-zinc-500 hover:text-black transition-colors"
                >
                    <ArrowLeft
                        size={18}
                        className="group-hover:-translate-x-1 transition-transform"
                    />
                    <span className="text-sm font-medium uppercase tracking-widest">
                        Volver
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative p-3 bg-white shadow-sm border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors"
                    >
                        <ShoppingCart size={20} strokeWidth={1.5} />
                        {cantidad > 0 && (
                            <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-[#F8F9FA]">
                                {cantidad}
                            </span>
                        )}
                    </button>
                </div>
            </nav>

            {/* --- MAIN CONTENT --- */}
            <main className="max-w-6xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Imagen con badge dinámico */}
                <div className="relative">
                    <div className="absolute -inset-4 bg-zinc-200/50 rounded-[2rem] -z-10 blur-2xl"></div>
                    <div className="relative rounded-3xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] bg-white aspect-[4/5]">
                        <img
                            src={evento.img}
                            alt={evento.nombre}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 text-white">
                            <p className="text-xs font-black uppercase tracking-[0.2em] mb-1 opacity-80">
                                Ubicación
                            </p>
                            <p className="font-medium">{evento.lugar}</p>
                        </div>
                    </div>
                </div>

                {/* Detalles de compra */}
                <div className="flex flex-col">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-200/50 rounded-full w-fit text-[10px] font-black uppercase tracking-tighter mb-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                        Entradas Disponibles: {evento.disponibles}
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-black mb-4 tracking-tighter leading-[0.9]">
                        {evento.nombre.split(":").map((text, i) => (
                            <span
                                key={i}
                                className={
                                    i === 1
                                        ? "block text-zinc-400 font-light text-4xl mt-2"
                                        : ""
                                }
                            >
                                {text}
                            </span>
                        ))}
                    </h1>

                    <div className="flex items-center gap-4 mb-8 text-zinc-500">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-widest">
                                Fecha
                            </span>
                            <span className="font-semibold text-zinc-900">
                                {evento.fecha}
                            </span>
                        </div>
                        <div className="w-px h-8 bg-zinc-200"></div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-widest">
                                Precio Unitario
                            </span>
                            <span className="font-semibold text-zinc-900">
                                ${evento.precio.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-black uppercase tracking-widest text-zinc-400">
                                Seleccionar Cantidad
                            </label>
                            <div className="flex items-center bg-white border border-zinc-200 rounded-2xl p-2 w-full sm:w-fit shadow-sm">
                                <button
                                    onClick={() =>
                                        setCantidad(Math.max(1, cantidad - 1))
                                    }
                                    className="p-4 hover:bg-zinc-100 rounded-xl transition-all active:scale-90"
                                >
                                    <Minus size={20} />
                                </button>
                                <span className="w-16 text-center font-black text-2xl tracking-tighter">
                                    {cantidad}
                                </span>
                                <button
                                    onClick={() => setCantidad(cantidad + 1)}
                                    className="p-4 hover:bg-zinc-100 rounded-xl transition-all active:scale-90"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="w-full bg-black text-white p-6 rounded-2xl font-black text-lg tracking-tight hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_-12px_rgba(0,0,0,0.3)] flex justify-between items-center group"
                        >
                            <span>RESERVAR ENTRADAS</span>
                            <div className="flex items-center gap-3">
                                <span className="text-zinc-400 group-hover:text-white transition-colors">
                                    ${total.toLocaleString()}
                                </span>
                                <ShoppingCart size={22} />
                            </div>
                        </button>
                    </div>
                </div>
            </main>

            {/* --- CART OVERLAY --- */}
            {isCartOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
                        onClick={() => setIsCartOpen(false)}
                    ></div>

                    <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-10 animate-in slide-in-from-right duration-500">
                        <div className="flex justify-between items-center mb-12">
                            <h2 className="text-3xl font-black tracking-tighter italic">
                                TU PEDIDO
                            </h2>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-3 hover:bg-zinc-100 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-grow">
                            <div className="flex gap-6 items-start">
                                <div className="w-24 h-32 rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src={evento.img}
                                        className="w-full h-full object-cover"
                                        alt="Event"
                                    />
                                </div>
                                <div className="flex flex-col py-2">
                                    <h3 className="font-black text-lg leading-none mb-1">
                                        {evento.nombre.split(":")[0]}
                                    </h3>
                                    <p className="text-zinc-400 text-xs font-bold uppercase mb-4">
                                        {evento.fecha}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm font-bold">
                                        <span className="bg-zinc-100 px-2 py-1 rounded-md">
                                            {cantidad} Tickets
                                        </span>
                                        <span>×</span>
                                        <span>
                                            ${evento.precio.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto pt-10 border-t border-zinc-100">
                            <div className="flex justify-between items-baseline mb-8">
                                <span className="text-zinc-400 font-bold uppercase text-xs tracking-widest">
                                    Total a pagar
                                </span>
                                <span className="text-4xl font-black tracking-tighter">
                                    ${total.toLocaleString()}
                                </span>
                            </div>

                            <button
                                className="w-full bg-black text-white py-6 rounded-2xl font-black flex items-center justify-center gap-3 hover:shadow-2xl transition-all"
                                onClick={() =>
                                    alert("Redirigiendo a Checkout seguro...")
                                }
                            >
                                <CreditCard size={20} />
                                CONFIRMAR COMPRA
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
