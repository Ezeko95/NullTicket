'use client';
import React, { useState, useEffect } from 'react';
import { Evento } from '@/interfaces/eventos';

export default function ComprarPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const traerEventos = async () => {
      try {
        // Por ahora, como estás en local, la URL suele ser http://localhost:3001/events
        // Si no funciona, usá el mockData con los nombres nuevos:
        const res = await fetch('http://localhost:3001/events'); 
        const data = await res.json();
        setEventos(data);
      } catch (error) {
        console.error("Todavía no puedo conectar al back, usando datos locales...");
        // Poné aquí los datos que me pasaste del controller para probar visualmente
      } finally {
        setCargando(false);
      }
    };
    traerEventos();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Eventos Disponibles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventos.map((evento) => (
          <div key={evento.id} className="bg-[#1e293b] rounded-xl border border-slate-700 overflow-hidden">
            <img src={evento.image} alt={evento.name} className="w-full h-40 object-cover" />
            <div className="p-5">
              <h3 className="text-xl font-bold text-white mb-1">{evento.name}</h3>
              <p className="text-slate-400 text-sm mb-4">{evento.location}</p>
              
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-slate-500 uppercase">Desde</p>
                  <p className="text-xl font-bold text-blue-400">
                    ${Math.min(...evento.sectors.map(s => s.price)).toLocaleString('es-AR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Disponibles</p>
                  <p className="text-sm font-medium text-green-400">{evento.availableTickets}</p>
                </div>
              </div>
              
              <button className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-semibold transition-colors">
                Ver Sectores y Comprar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}