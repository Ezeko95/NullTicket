export type EventSectorName = "vip" | "campo" | "platea" | "general";

export type EventSector = {
    name: EventSectorName;
    capacity: number;
    price: number;
};

export type Event = {
    id: number;
    name: string;
    location: string;
    date: string;
    sectors: EventSector[];
    availableTickets: number;
    image?: string;
};
