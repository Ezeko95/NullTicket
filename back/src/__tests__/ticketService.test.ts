import { beforeEach, describe, expect, it, vi } from "vitest";
import { HttpError } from "../common/HttpError.js";
import type { Event } from "../models/eventModel.js";
import type { Ticket } from "../models/ticketModel.js";
import ticketRepo from "../repositories/ticketRepo.js";
import ticketService from "../services/ticketService.js";

vi.mock("../repositories/ticketRepo.js", () => ({
    default: {
        findByIdAndUserId: vi.fn(),
        deleteByIdAndUserId: vi.fn(),
        findEventById: vi.fn(),
        countSoldByEventIdAndSector: vi.fn(),
        createTicketAndDecrementStock: vi.fn()
    }
}));

const makeTicket = (eventDate: string): Ticket =>
    ({
        id: 10,
        eventId: 3,
        eventName: "Demo Event",
        eventDate,
        sector: "general",
        price: 25000,
        status: "active",
        userId: 1,
        purchasedAt: "2026-01-01T10:00:00.000Z"
    }) as Ticket;

const tomorrowIso = () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString();
};

const todayIso = () => new Date().toISOString();

const yesterdayIso = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString();
};

const makeEvent = (overrides: Partial<Event> = {}): Event =>
    ({
        id: 3,
        name: "Demo Event",
        location: "Demo Arena",
        date: tomorrowIso(),
        image: undefined,
        availableTickets: 10,
        sectors: [
            { name: "general", capacity: 2, price: 25000 },
            { name: "vip", capacity: 1, price: 65000 }
        ],
        ...overrides
    }) as Event;

describe("Ticket Service - Delete User Ticket", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should delete a user ticket for a future event", async () => {
        vi.mocked(ticketRepo.findByIdAndUserId).mockResolvedValue(
            makeTicket(tomorrowIso())
        );

        await ticketService.deleteUserTicket(10, 1);

        expect(ticketRepo.findByIdAndUserId).toHaveBeenCalledWith(10, 1);
        expect(ticketRepo.deleteByIdAndUserId).toHaveBeenCalledWith(10, 1);
    });

    it("should delete a user ticket for an event happening today", async () => {
        vi.mocked(ticketRepo.findByIdAndUserId).mockResolvedValue(
            makeTicket(todayIso())
        );

        await ticketService.deleteUserTicket(10, 1);

        expect(ticketRepo.deleteByIdAndUserId).toHaveBeenCalledWith(10, 1);
    });

    it("should throw a 404 error if the ticket does not belong to the user", async () => {
        vi.mocked(ticketRepo.findByIdAndUserId).mockResolvedValue(null);

        await expect(
            ticketService.deleteUserTicket(99, 1)
        ).rejects.toMatchObject(new HttpError("Ticket not found.", 404));
        expect(ticketRepo.deleteByIdAndUserId).not.toHaveBeenCalled();
    });

    it("should throw a 409 error for a past ticket", async () => {
        vi.mocked(ticketRepo.findByIdAndUserId).mockResolvedValue(
            makeTicket(yesterdayIso())
        );

        await expect(
            ticketService.deleteUserTicket(10, 1)
        ).rejects.toMatchObject(
            new HttpError("Past tickets cannot be deleted.", 409)
        );
        expect(ticketRepo.deleteByIdAndUserId).not.toHaveBeenCalled();
    });
});

describe("Ticket Service - Purchase User Ticket", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should create a ticket and decrement stock for a valid purchase", async () => {
        const event = makeEvent();
        const ticket = makeTicket(event.date);

        vi.mocked(ticketRepo.findEventById).mockResolvedValue(event);
        vi.mocked(ticketRepo.countSoldByEventIdAndSector).mockResolvedValue(1);
        vi.mocked(ticketRepo.createTicketAndDecrementStock).mockResolvedValue(
            ticket
        );

        const result = await ticketService.purchaseUserTicket(1, {
            eventId: event.id,
            sector: "general"
        });

        expect(result).toBe(ticket);
        expect(ticketRepo.findEventById).toHaveBeenCalledWith(event.id);
        expect(ticketRepo.countSoldByEventIdAndSector).toHaveBeenCalledWith(
            event.id,
            "general"
        );
        expect(ticketRepo.createTicketAndDecrementStock).toHaveBeenCalledWith(
            1,
            event,
            "general",
            25000
        );
    });

    it("should throw a 404 error when the event does not exist", async () => {
        vi.mocked(ticketRepo.findEventById).mockResolvedValue(null);

        await expect(
            ticketService.purchaseUserTicket(1, {
                eventId: 99,
                sector: "general"
            })
        ).rejects.toMatchObject(new HttpError("Event not found.", 404));
        expect(ticketRepo.createTicketAndDecrementStock).not.toHaveBeenCalled();
    });

    it("should throw a 409 error when the event is in the past", async () => {
        vi.mocked(ticketRepo.findEventById).mockResolvedValue(
            makeEvent({ date: yesterdayIso() })
        );

        await expect(
            ticketService.purchaseUserTicket(1, {
                eventId: 3,
                sector: "general"
            })
        ).rejects.toMatchObject(
            new HttpError("Past events cannot be purchased.", 409)
        );
        expect(ticketRepo.createTicketAndDecrementStock).not.toHaveBeenCalled();
    });

    it("should throw a 400 error when the sector does not exist", async () => {
        vi.mocked(ticketRepo.findEventById).mockResolvedValue(makeEvent());

        await expect(
            ticketService.purchaseUserTicket(1, {
                eventId: 3,
                sector: "campo"
            })
        ).rejects.toMatchObject(
            new HttpError("A valid event sector is required.", 400)
        );
        expect(ticketRepo.createTicketAndDecrementStock).not.toHaveBeenCalled();
    });

    it("should throw a 409 error when the event has no global stock", async () => {
        vi.mocked(ticketRepo.findEventById).mockResolvedValue(
            makeEvent({ availableTickets: 0 })
        );

        await expect(
            ticketService.purchaseUserTicket(1, {
                eventId: 3,
                sector: "general"
            })
        ).rejects.toMatchObject(new HttpError("Event is sold out.", 409));
        expect(ticketRepo.createTicketAndDecrementStock).not.toHaveBeenCalled();
    });

    it("should throw a 409 error when the selected sector is sold out", async () => {
        vi.mocked(ticketRepo.findEventById).mockResolvedValue(makeEvent());
        vi.mocked(ticketRepo.countSoldByEventIdAndSector).mockResolvedValue(2);

        await expect(
            ticketService.purchaseUserTicket(1, {
                eventId: 3,
                sector: "general"
            })
        ).rejects.toMatchObject(
            new HttpError("Event sector is sold out.", 409)
        );
        expect(ticketRepo.createTicketAndDecrementStock).not.toHaveBeenCalled();
    });
});
