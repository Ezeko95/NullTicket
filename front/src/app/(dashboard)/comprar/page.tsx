'use client';
import React, { useState, useEffect } from 'react';
import { Evento } from '@/interfaces/eventos'; // Importamos el tipo que creamos

export default function ComprarPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Esta función simula el GET /events hasta que el back esté listo
    const obtenerEventos = async () => {
      try {
        // CUANDO EL BACK ESTÉ LISTO, USARÁS: 
        // const res = await fetch('http://tu-api.com/events');
        // const data = await res.json();
        
        // POR AHORA, usamos este mock para no frenar:
        const mockData: Evento[] = [
          { id: 1, nombre: "Concierto Rock", descripcion: "Vivo en el estadio", precio: 15000, stock: 20, categoria: "Musica" },
          { id: 2, nombre: "Teatro Colon", descripcion: "Obra clásica", precio: 8000, stock: 5, categoria: "Cultura" }
        ];
        
        setEventos(mockData);
      } catch (error) {
        console.error("Error al traer eventos", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerEventos();
  }, []);

  if (cargando) return <div className="p-10 text-white">Cargando eventos...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Próximos Eventos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {eventos.map((evento) => (
          <div key={evento.id} className="bg-[#1e293b] p-5 rounded-xl border border-slate-700">
            <h3 className="text-xl font-bold text-white">{evento.nombre}</h3>
            <p className="text-slate-400 text-sm mb-4">{evento.descripcion}</p>
            <div className="flex justify-between items-center">
              <span className="text-blue-400 font-bold">${evento.precio}</span>
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm">
                Comprar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}