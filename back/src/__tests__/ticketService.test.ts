import { beforeEach, describe, expect, it, vi } from "vitest";
import { HttpError } from "../common/HttpError.js";
import type { Ticket } from "../models/ticketModel.js";
import ticketRepo from "../repositories/ticketRepo.js";
import ticketService from "../services/ticketService.js";

vi.mock("../repositories/ticketRepo.js", () => ({
    default: {
        findByIdAndUserId: vi.fn(),
        deleteByIdAndUserId: vi.fn()
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
