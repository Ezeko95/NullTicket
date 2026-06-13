import type { Request, Response } from "express";
import type { AuthPayload } from "../middleware/authMiddleware.js";
import { HttpError } from "../common/HttpError.js";
import ticketService from "../services/ticketService.js";

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
