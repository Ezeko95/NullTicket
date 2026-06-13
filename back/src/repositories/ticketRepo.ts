import { AppDataSource } from "../dataSource.js";
import { Event } from "../models/eventModel.js";
import { Ticket } from "../models/ticketModel.js";
import type { EventSectorName } from "@repo/types";
import { In } from "typeorm";

class TicketRepo {
    private readonly repository = AppDataSource.getRepository(Ticket);
    private readonly eventRepository = AppDataSource.getRepository(Event);

    findByUserId(userId: number): Promise<Ticket[]> {
        return this.repository.findBy({ userId });
    }

    findByIdAndUserId(id: number, userId: number): Promise<Ticket | null> {
        return this.repository.findOneBy({ id, userId });
    }

    async deleteByIdAndUserId(id: number, userId: number): Promise<void> {
        await this.repository.delete({ id, userId });
    }

    findEventById(id: number): Promise<Event | null> {
        return this.eventRepository.findOneBy({ id });
    }

    countSoldByEventIdAndSector(
        eventId: number,
        sector: EventSectorName
    ): Promise<number> {
        return this.repository.countBy({
            eventId,
            sector,
            status: In(["active", "used"])
        });
    }

    createTicketAndDecrementStock(
        userId: number,
        event: Event,
        sector: EventSectorName,
        price: number
    ): Promise<Ticket> {
        return AppDataSource.transaction(async (manager) => {
            const ticketRepository = manager.getRepository(Ticket);
            const eventRepository = manager.getRepository(Event);
            const ticket = ticketRepository.create({
                eventId: event.id,
                eventName: event.name,
                eventDate: event.date,
                sector,
                price,
                status: "active",
                userId,
                purchasedAt: new Date().toISOString()
            });

            await eventRepository.update(
                { id: event.id },
                { availableTickets: event.availableTickets - 1 }
            );

            return ticketRepository.save(ticket);
        });
    }
}

export default new TicketRepo();
