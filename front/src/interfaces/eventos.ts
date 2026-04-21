// src/interfaces/eventos.ts
export interface Sector {
    name: string;
    capacity: number;
    price: number;
}

export interface Evento {
    id: number;
    name: string; // Cambió de nombre a name
    location: string; // Nuevo campo
    date: string; // Nuevo campo
    availableTickets: number; // Cambió de stock a availableTickets
    image: string; // Cambió de imagenUrl a image
    sectors: Sector[]; // Estructura nueva de precios
}
