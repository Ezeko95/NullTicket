import type { CreateEventRequest, PatchEventRequest } from "@repo/types";
import { HttpError } from "../common/HttpError.js";
import type { Event } from "../models/eventModel.js";
import eventRepo from "../repositories/eventRepo.js";
import ticketRepo from "../repositories/ticketRepo.js";

class EventService {
    getAll(): Promise<Event[]> {
        return eventRepo.findAll();
    }

    async getById(id: number): Promise<Event> {
        const event = await eventRepo.findById(id);

        if (!event) {
            throw new HttpError("Event not found.", 404);
        }

        return event;
    }

    create(event: CreateEventRequest): Promise<Event> {
        return eventRepo.create(event);
    }

    async patch(id: number, patch: PatchEventRequest): Promise<Event> {
        const event = await this.getById(id);
        await this.assertEventHasNoTickets(id);

        return eventRepo.update(event, patch);
    }

    async delete(id: number): Promise<void> {
        await this.getById(id);
        await this.assertEventHasNoTickets(id);

        await eventRepo.delete(id);
    }

    private async assertEventHasNoTickets(eventId: number): Promise<void> {
        const ticketsCount = await ticketRepo.countByEventId(eventId);

        if (ticketsCount > 0) {
            throw new HttpError("Events with tickets cannot be modified.", 409);
        }
    }
}

export default new EventService();
