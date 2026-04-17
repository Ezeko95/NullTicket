import type { Event } from "@repo/types";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL ?? "http://localhost:3001";

const MOCK_EVENTS: Event[] = [
    {
        id: 1,
        name: "Ecos Sintetizados: Noches en Berlín",
        location: "Templehof Hangar 4, Berlín",
        date: "2025-10-24T21:00:00Z",
        sectors: [
            { name: "vip", capacity: 100, price: 18000 },
            { name: "campo", capacity: 400, price: 8000 }
        ],
        availableTickets: 220,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUNt0ES8xymCm2HxvwnplfW5_haebIEz2W1q42X6t4_QUMnl8c2RYN-mraNqKAk3Ch5O30QCmtSnF7l5vk_hU1BfWnlWskUzj0hmiIF5s-8UB1OGZzG8QSnRLlhI5vRCgN1g2EBX3r-FJzEulaXEPEG5YHKQ4v5uVhsfjbZRQ9XHB3kgN_1ZP_ZdroNldoZRLMab6gG5rP-PJPfl-1vJJkTH6dWv-01CfQ7OFT-m0o7P5GQ4dU1suZ2wvhuJNY4xF1fVj1PXXIDz0O"
    },
    {
        id: 2,
        name: "La Retrospectiva Cinética",
        location: "MoMA Manhattan, NY",
        date: "2025-11-02T18:00:00Z",
        sectors: [
            { name: "platea", capacity: 200, price: 12000 },
            { name: "general", capacity: 300, price: 6000 }
        ],
        availableTickets: 0,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQ4aBDj-bakm3zGimgCo8c4cAxcxApFgrA_ghKhqZYbtI4hvDVwT3fEAabvRy0wq_CZqSgerNgznw8ual6KsedUL_ds3It6sgH7PxklsJattVGq3JmCApyjUZmuJg8Uk64UuyOa26UMuGt3MCBoXPdU_0SzNyX2Urix0lPG-FL-6C84Z_g7lbxR-npgyktYFptZvInK9wEl1pi-sXLtKYRflaQLJyPdMXaHpVtXTJGcQXb12ryrfdfWzSJW-_JV1bAj_Zv6YETGLAd"
    },
    {
        id: 3,
        name: "Final Grand Slam Masters",
        location: "Arena O2, Londres",
        date: "2025-12-12T20:00:00Z",
        sectors: [
            { name: "vip", capacity: 50, price: 40000 },
            { name: "platea", capacity: 300, price: 22000 },
            { name: "campo", capacity: 800, price: 14000 }
        ],
        availableTickets: 610,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWgkz8t0W4XBRjcTFqbqQv7kJA9EoXWh5Zw-ExJiNFD8LI_QBROZqRjJ9nbh5C6rhxSPqGhH-MaHz9qZo26yDK-zOVURvtziBvfVBD13oMosS-wyIMmS7rXP1vn4LmIIw2OjeL6nU7UyXMox67qZ9MbFeRutlSBF0zwA6BGvSZRL7WzwvtBTvdWuWM4vagTxLZvQYlAw6z6fUSrw-GDPYLRm7Bytcfe7jEEA2hMzi8b5lI5y4EsbTgAadjSgTq9FGrIjBo349Tv49L"
    }
];

export async function getEvents(): Promise<Event[]> {
    const token = (await cookies()).get("token")?.value;

    try {
        const res = await fetch(`${API_URL}/events`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        if (res.ok) {
            return res.json() as Promise<Event[]>;
        }
    } catch {
        // back not available — fall through to mock
    }

    return MOCK_EVENTS;
}
