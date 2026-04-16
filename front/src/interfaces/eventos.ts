// src/interfaces/eventos.ts
export interface Evento {
    id: number | string;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    categoria: string;
    imagenUrl?: string; // El signo ? es porque puede no venir la imagen
}