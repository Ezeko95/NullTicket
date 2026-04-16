import type { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import ticketService from "../services/ticketService.js";

export const getUserTicketsController = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            res.status(401).json({ ok: false, error: "Unauthorized." });
            return;
        }

        const token = authHeader.slice(7);
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET ?? "secret"
        ) as {
            id: number;
        };

        const tickets = await ticketService.getByUserId(payload.id);

        res.status(200).json(tickets);
    } catch {
        res.status(401).json({ ok: false, error: "Unauthorized." });
    }
};
