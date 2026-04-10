'use client';

import { createContext, useContext, useState } from 'react';

interface TicketResult {
  success: boolean;
  message: string;
}

interface TicketContextValue {
  stock: number;
  misTickets: number;
  comprarTickets: (cantidad: number) => TicketResult;
}

const TicketContext = createContext<TicketContextValue | null>(null);

export function TicketProvider({ children }: { children: React.ReactNode }) {
  const [stock, setStock] = useState(100);
  const [misTickets, setMisTickets] = useState(0);

  const comprarTickets = (cantidad: number): TicketResult => {
    if (cantidad <= 0 || isNaN(cantidad)) {
      return { success: false, message: 'Cantidad inválida' };
    }
    if (stock >= cantidad) {
      setStock((prev) => prev - cantidad);
      setMisTickets((prev) => prev + cantidad);
      return { success: true, message: `Adquiriste ${cantidad} tickets exitosamente.` };
    }
    return { success: false, message: 'Stock insuficiente.' };
  };

  return (
    <TicketContext.Provider value={{ stock, misTickets, comprarTickets }}>
      {children}
    </TicketContext.Provider>
  );
}

export function useTickets(): TicketContextValue {
  const ctx = useContext(TicketContext);
  if (!ctx) throw new Error('useTickets must be used within a TicketProvider');
  return ctx;
}
