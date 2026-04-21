import type { Request, Response } from "express";
import { AppDataSource } from "../dataSource.js";
import { Event } from "../models/eventModel.js";

const eventRepo = AppDataSource.getRepository(Event);

export const eventsController = async (_req: Request, res: Response) => {
    const events = await eventRepo.find();
    res.status(200).json(events);
};

export const eventByIdController = async (req: Request, res: Response) => {
    const id = Number(req.params.eventId);
    const event = await eventRepo.findOneBy({ id });

    if (!event) {
        res.status(404).json({ ok: false, error: "Event not found." });
        return;
    }

    res.status(200).json(event);
};
