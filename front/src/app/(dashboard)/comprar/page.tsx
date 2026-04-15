'use client';
import React, { useState } from 'react';

// Datos de ejemplo para los eventos
const EVENTOS_MOCK = [
  { id: 1, nombre: "Tech Conference 2026", precio: 15000, stock: 45, categoria: "Tecnología" },
  { id: 2, nombre: "Festival de Música", precio: 25000, stock: 12, categoria: "Música" },
  { id: 3, nombre: "Workshop de React", precio: 8000, stock: 0, categoria: "Educación" },
];

export default function ComprarPage() {
  const [seleccionado, setSeleccionado] = useState<number | null>(null);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-2">Adquirir Tickets</h1>
      <p className="text-slate-400 mb-8">Selecciona un evento para ver la disponibilidad en tiempo real.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EVENTOS_MOCK.map((evento) => (
          <div 
            key={evento.id}
            onClick={() => evento.stock > 0 && setSeleccionado(evento.id)}
            className={`relative p-6 rounded-2xl border transition-all cursor-pointer 
              ${seleccionado === evento.id 
                ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                : 'bg-[#1e293b] border-slate-700 hover:border-slate-500'} 
              ${evento.stock === 0 ? 'opacity-60 grayscale cursor-not-allowed' : ''}`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">
                {evento.categoria}
              </span>
              {evento.stock === 0 && (
                <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-1 rounded-full border border-red-500/50">
                  AGOTADO
                </span>
              )}
            </div>

            <h3 className="text-xl font-semibold text-white mb-1">{evento.nombre}</h3>
            <p className="text-2xl font-bold text-white mb-4">${evento.precio.toLocaleString('es-AR')}</p>

            <div className="flex items-center justify-between mt-6">
              <span className="text-sm text-slate-400">
                Disponibles: <span className={evento.stock < 10 ? 'text-orange-400' : 'text-green-400'}>{evento.stock}</span>
              </span>
              <button 
                disabled={evento.stock === 0}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${evento.stock > 0 
                    ? 'bg-blue-600 text-white hover:bg-blue-500' 
                    : 'bg-slate-700 text-slate-500'}`}
              >
                {evento.stock > 0 ? 'Seleccionar' : 'No disponible'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {seleccionado && (
        <div className="mt-10 p-6 bg-green-500/10 border border-green-500/50 rounded-xl flex justify-between items-center animate-in fade-in slide-in-from-bottom-4">
          <div>
            <p className="text-green-400 font-medium">Evento seleccionado listo para procesar</p>
            <p className="text-slate-400 text-sm">Haz clic en el carrito para confirmar la compra.</p>
          </div>
          <button className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-full font-bold transition-all transform hover:scale-105">
            Confirmar Compra
          </button>
        </div>
      )}
    </div>
  );
}