import type { Event } from "@repo/types";
import type { Request, Response } from "express";

const events: Event[] = [
    {
        id: 1,
        name: "Noche de Indie Austral",
        location: "Teatro Gran Rex, Buenos Aires",
        date: "2026-05-18T21:00:00.000Z",
        availableTickets: 420,
        image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
        sectors: [
            { name: "general", capacity: 800, price: 25000 },
            { name: "vip", capacity: 120, price: 65000 }
        ]
    },
    {
        id: 2,
        name: "Festival Pixel Beat",
        location: "Centro Cultural Konex, Buenos Aires",
        date: "2026-06-07T19:30:00.000Z",
        availableTickets: 980,
        image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
        sectors: [
            { name: "campo", capacity: 1500, price: 32000 },
            { name: "vip", capacity: 200, price: 78000 }
        ]
    },
    {
        id: 3,
        name: "Sinfonia Bajo las Estrellas",
        location: "Anfiteatro Municipal, Rosario",
        date: "2026-07-12T22:00:00.000Z",
        availableTickets: 310,
        image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6",
        sectors: [
            { name: "platea", capacity: 500, price: 45000 },
            { name: "general", capacity: 700, price: 28000 }
        ]
    },
    {
        id: 4,
        name: "Stand Up en La Fabrica",
        location: "La Fabrica Teatro, Cordoba",
        date: "2026-08-03T20:00:00.000Z",
        availableTickets: 85,
        image: "https://images.unsplash.com/photo-1527224857830-43a7acc85260",
        sectors: [
            { name: "general", capacity: 180, price: 18000 },
            { name: "platea", capacity: 90, price: 26000 }
        ]
    },
    {
        id: 5,
        name: "Electronica del Rio",
        location: "Parque Sarmiento, Mendoza",
        date: "2026-09-26T23:30:00.000Z",
        availableTickets: 1250,
        image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3",
        sectors: [
            { name: "campo", capacity: 2000, price: 30000 },
            { name: "vip", capacity: 300, price: 90000 },
            { name: "general", capacity: 1000, price: 22000 }
        ]
    }
];

export const eventsController = (_req: Request, res: Response) => {
    res.status(200).json(events);
};
