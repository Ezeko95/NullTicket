'use client';

import { useTickets } from '@/context/TicketContext';

export default function Dashboard() {
  const { stock, misTickets } = useTickets();

  return (
    <>
      <div className="glass-panel p-8">
        <h2 className="text-3xl font-bold mb-4">Bienvenido al Sistema de Gestión</h2>
        <p className="text-gray-400 max-w-2xl">
          Navega en el menú lateral para adquirir nuevos tickets o consultar tu inventario disponible.
          El estado de compra se actualiza instántaneamente gracias a la integración global.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="glass-panel p-6 border-l-4 border-l-blue-500">
          <h3 className="text-gray-400 text-sm uppercase tracking-wider">Stock Global Disponible</h3>
          <p className="text-5xl font-bold mt-2">{stock}</p>
        </div>
        <div className="glass-panel p-6 border-l-4 border-l-green-500">
          <h3 className="text-gray-400 text-sm uppercase tracking-wider">Tus Tickets Comprados</h3>
          <p className="text-5xl font-bold mt-2 text-green-400">{misTickets}</p>
        </div>
      </div>
    </>
  );
}
