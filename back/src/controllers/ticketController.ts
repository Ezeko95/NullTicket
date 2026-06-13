import type { EventSectorName, PurchaseTicketRequest } from "@repo/types";
import type { Request, Response } from "express";
import type { AuthPayload } from "../middleware/authMiddleware.js";
import { HttpError } from "../common/HttpError.js";
import ticketService from "../services/ticketService.js";

const hasPurchaseTicketFields = (
    body: unknown
): body is { eventId: unknown; sector: unknown } =>
    typeof body === "object" &&
    body !== null &&
    "eventId" in body &&
    "sector" in body;

const parsePurchaseTicketRequest = (body: unknown): PurchaseTicketRequest => {
    if (!hasPurchaseTicketFields(body)) {
        throw new HttpError("Event id and sector are required.", 400);
    }

    const eventId = Number(body.eventId);

    if (
        !Number.isInteger(eventId) ||
        eventId <= 0 ||
        typeof body.sector !== "string" ||
        !body.sector.trim()
    ) {
        throw new HttpError("A valid event id and sector are required.", 400);
    }

    return {
        eventId,
        sector: body.sector.trim() as EventSectorName
    };
};

export const getUserTicketsController = async (req: Request, res: Response) => {
    const { id } = res.locals.user as AuthPayload;
    const tickets = await ticketService.getByUserId(id);
    res.status(200).json(tickets);
};

export const deleteUserTicketController = async (
    req: Request,
    res: Response
) => {
    try {
        const ticketId = Number(req.params.ticketId);

        if (!Number.isInteger(ticketId) || ticketId <= 0) {
            throw new HttpError("A valid ticket id is required.", 400);
        }

        const { id: userId } = res.locals.user as AuthPayload;
        await ticketService.deleteUserTicket(ticketId, userId);

        res.sendStatus(204);
    } catch (error) {
        if (error instanceof HttpError) {
            res.status(error.statusCode).json({
                ok: false,
                error: error.message
            });
            return;
        }

        throw error;
    }
};

export const purchaseUserTicketController = async (
    req: Request,
    res: Response
) => {
    try {
        const purchaseRequest = parsePurchaseTicketRequest(req.body);
        const { id: userId } = res.locals.user as AuthPayload;
        const ticket = await ticketService.purchaseUserTicket(
            userId,
            purchaseRequest
        );

        res.status(201).json(ticket);
    } catch (error) {
        if (error instanceof HttpError) {
            res.status(error.statusCode).json({
                ok: false,
                error: error.message
            });
            return;
        }

        throw error;
    }
};
