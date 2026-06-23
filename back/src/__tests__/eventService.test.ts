import { beforeEach, describe, expect, it, vi } from "vitest";
import { HttpError } from "../common/HttpError.js";
import type { Event } from "../models/eventModel.js";
import eventRepo from "../repositories/eventRepo.js";
import ticketRepo from "../repositories/ticketRepo.js";
import eventService from "../services/eventService.js";

vi.mock("../repositories/eventRepo.js", () => ({
    default: {
        findAll: vi.fn(),
        findById: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn()
    }
}));

vi.mock("../repositories/ticketRepo.js", () => ({
    default: {
        countByEventId: vi.fn()
    }
}));

const makeEvent = (overrides: Partial<Event> = {}): Event =>
    ({
        id: 3,
        name: "Demo Event",
        location: "Demo Arena",
        date: "2026-10-01T20:00:00.000Z",
        image: undefined,
        availableTickets: 10,
        sectors: [{ name: "general", capacity: 10, price: 25000 }],
        ...overrides
    }) as Event;

describe("Event Service", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should create an event", async () => {
        const event = makeEvent();
        vi.mocked(eventRepo.create).mockResolvedValue(event);

        const result = await eventService.create({
            name: event.name,
            location: event.location,
            date: event.date,
            availableTickets: event.availableTickets,
            image: event.image,
            sectors: event.sectors
        });

        expect(result).toBe(event);
        expect(eventRepo.create).toHaveBeenCalledWith({
            name: event.name,
            location: event.location,
            date: event.date,
            availableTickets: event.availableTickets,
            image: event.image,
            sectors: event.sectors
        });
    });

    it("should throw a 404 error when patching a missing event", async () => {
        vi.mocked(eventRepo.findById).mockResolvedValue(null);

        await expect(
            eventService.patch(99, { name: "Updated" })
        ).rejects.toMatchObject(new HttpError("Event not found.", 404));
        expect(eventRepo.update).not.toHaveBeenCalled();
    });

    it("should reject patching when the event has tickets", async () => {
        vi.mocked(eventRepo.findById).mockResolvedValue(makeEvent());
        vi.mocked(ticketRepo.countByEventId).mockResolvedValue(1);

        await expect(
            eventService.patch(3, { name: "Updated" })
        ).rejects.toMatchObject(
            new HttpError("Events with tickets cannot be modified.", 409)
        );
        expect(eventRepo.update).not.toHaveBeenCalled();
    });

    it("should patch when the event has no tickets", async () => {
        const event = makeEvent();
        const updatedEvent = makeEvent({ name: "Updated" });
        vi.mocked(eventRepo.findById).mockResolvedValue(event);
        vi.mocked(ticketRepo.countByEventId).mockResolvedValue(0);
        vi.mocked(eventRepo.update).mockResolvedValue(updatedEvent);

        const result = await eventService.patch(3, { name: "Updated" });

        expect(result).toBe(updatedEvent);
        expect(eventRepo.update).toHaveBeenCalledWith(event, {
            name: "Updated"
        });
    });

    it("should throw a 404 error when deleting a missing event", async () => {
        vi.mocked(eventRepo.findById).mockResolvedValue(null);

        await expect(eventService.delete(99)).rejects.toMatchObject(
            new HttpError("Event not found.", 404)
        );
        expect(eventRepo.delete).not.toHaveBeenCalled();
    });

    it("should reject deleting when the event has tickets", async () => {
        vi.mocked(eventRepo.findById).mockResolvedValue(makeEvent());
        vi.mocked(ticketRepo.countByEventId).mockResolvedValue(1);

        await expect(eventService.delete(3)).rejects.toMatchObject(
            new HttpError("Events with tickets cannot be modified.", 409)
        );
        expect(eventRepo.delete).not.toHaveBeenCalled();
    });

    it("should delete when the event has no tickets", async () => {
        vi.mocked(eventRepo.findById).mockResolvedValue(makeEvent());
        vi.mocked(ticketRepo.countByEventId).mockResolvedValue(0);
        vi.mocked(eventRepo.delete).mockResolvedValue();

        await eventService.delete(3);

        expect(eventRepo.delete).toHaveBeenCalledWith(3);
    });
});
