import type { PurchaseTicketRequest } from "@repo/types";
import ticketRepo from "../repositories/ticketRepo.js";
import type { Ticket } from "../models/ticketModel.js";
import { HttpError } from "../common/HttpError.js";

const startOfDay = (date: Date): Date => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    return normalizedDate;
};

class TicketService {
    getByUserId(userId: number): Promise<Ticket[]> {
        return ticketRepo.findByUserId(userId);
    }

    async deleteUserTicket(ticketId: number, userId: number): Promise<void> {
        const ticket = await ticketRepo.findByIdAndUserId(ticketId, userId);

        if (!ticket) {
            throw new HttpError("Ticket not found.", 404);
        }

        // TODO CHECK FRAN LUNA: Here we first fetch the ticket and check that it is not in the past so we can throw the proper error. The alternative is to query
        // the database directly to delete it only if it is today or in the future, but then nothing would be deleted for a past ticket and we would not be able
        // to throw this specific error.
        if (startOfDay(new Date(ticket.eventDate)) < startOfDay(new Date())) {
            throw new HttpError("Past tickets cannot be deleted.", 409);
        }

        await ticketRepo.deleteByIdAndUserId(ticketId, userId);
    }

    async purchaseUserTicket(
        userId: number,
        { eventId, sector }: PurchaseTicketRequest
    ): Promise<Ticket> {
        const event = await ticketRepo.findEventById(eventId);

        if (!event) {
            throw new HttpError("Event not found.", 404);
        }

        if (startOfDay(new Date(event.date)) < startOfDay(new Date())) {
            throw new HttpError("Past events cannot be purchased.", 409);
        }

        const eventSector = event.sectors.find(({ name }) => name === sector);

        if (!eventSector) {
            throw new HttpError("A valid event sector is required.", 400);
        }

        if (event.availableTickets <= 0) {
            throw new HttpError("Event is sold out.", 409);
        }

        const soldInSector = await ticketRepo.countSoldByEventIdAndSector(
            eventId,
            sector
        );

        if (soldInSector >= eventSector.capacity) {
            throw new HttpError("Event sector is sold out.", 409);
        }

        return ticketRepo.createTicketAndDecrementStock(
            userId,
            event,
            sector,
            eventSector.price
        );
    }
}

export default new TicketService();
