import type { Request, Response } from "express";
import type { AuthPayload } from "../middleware/authMiddleware.js";
import ticketService from "../services/ticketService.js";

export const getUserTicketsController = async (req: Request, res: Response) => {
    const { id } = res.locals.user as AuthPayload;
    const tickets = await ticketService.getByUserId(id);
    res.status(200).json(tickets);
};
