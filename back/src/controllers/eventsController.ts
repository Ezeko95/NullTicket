import type {
    CreateEventRequest,
    EventSector,
    EventSectorName,
    PatchEventRequest
} from "@repo/types";
import type { Request, Response } from "express";
import { HttpError } from "../common/HttpError.js";
import eventService from "../services/eventService.js";

const validSectorNames = new Set<EventSectorName>([
    "vip",
    "campo",
    "platea",
    "general"
]);

const eventFields = new Set([
    "name",
    "location",
    "date",
    "image",
    "availableTickets",
    "sectors"
]);

const parseEventId = (eventId: unknown): number => {
    if (typeof eventId !== "string") {
        throw new HttpError("A valid event id is required.", 400);
    }

    const id = Number(eventId);

    if (!Number.isInteger(id) || id <= 0) {
        throw new HttpError("A valid event id is required.", 400);
    }

    return id;
};

const isRecord = (body: unknown): body is Record<string, unknown> =>
    typeof body === "object" && body !== null && !Array.isArray(body);

const parseRequiredString = (value: unknown, fieldName: string): string => {
    if (typeof value !== "string" || !value.trim()) {
        throw new HttpError(`A valid ${fieldName} is required.`, 400);
    }

    return value.trim();
};

const parseOptionalImage = (value: unknown): string | undefined => {
    if (value === undefined) {
        return undefined;
    }

    if (typeof value !== "string") {
        throw new HttpError("A valid image is required.", 400);
    }

    return value.trim() || undefined;
};

const parseDate = (value: unknown): string => {
    const date = parseRequiredString(value, "date");

    if (Number.isNaN(Date.parse(date))) {
        throw new HttpError("A valid date is required.", 400);
    }

    return date;
};

const parseAvailableTickets = (value: unknown): number => {
    const availableTickets = Number(value);

    if (!Number.isInteger(availableTickets) || availableTickets < 0) {
        throw new HttpError("A valid availableTickets is required.", 400);
    }

    return availableTickets;
};

const parseSectors = (value: unknown): EventSector[] => {
    if (!Array.isArray(value) || value.length === 0) {
        throw new HttpError("At least one valid sector is required.", 400);
    }

    const names = new Set<EventSectorName>();

    return value.map((sector) => {
        if (!isRecord(sector)) {
            throw new HttpError("A valid sector is required.", 400);
        }

        const name = sector.name;
        const capacity = Number(sector.capacity);
        const price = Number(sector.price);

        if (
            typeof name !== "string" ||
            !validSectorNames.has(name as EventSectorName)
        ) {
            throw new HttpError("A valid sector name is required.", 400);
        }

        const sectorName = name as EventSectorName;
        if (names.has(sectorName)) {
            throw new HttpError("Sector names must be unique.", 400);
        }
        names.add(sectorName);

        if (!Number.isInteger(capacity) || capacity < 0) {
            throw new HttpError("A valid sector capacity is required.", 400);
        }

        if (!Number.isFinite(price) || price < 0) {
            throw new HttpError("A valid sector price is required.", 400);
        }

        return {
            name: sectorName,
            capacity,
            price
        };
    });
};

const assertKnownEventFields = (body: Record<string, unknown>): void => {
    for (const field of Object.keys(body)) {
        if (field === "id") {
            throw new HttpError("Event id cannot be modified.", 400);
        }

        if (!eventFields.has(field)) {
            throw new HttpError(`Unknown event field: ${field}.`, 400);
        }
    }
};

const parseCreateEventRequest = (body: unknown): CreateEventRequest => {
    if (!isRecord(body)) {
        throw new HttpError("A valid event payload is required.", 400);
    }

    assertKnownEventFields(body);

    return {
        name: parseRequiredString(body.name, "name"),
        location: parseRequiredString(body.location, "location"),
        date: parseDate(body.date),
        image: parseOptionalImage(body.image),
        availableTickets: parseAvailableTickets(body.availableTickets),
        sectors: parseSectors(body.sectors)
    };
};

const parsePatchEventRequest = (body: unknown): PatchEventRequest => {
    if (!isRecord(body)) {
        throw new HttpError("A valid event payload is required.", 400);
    }

    assertKnownEventFields(body);

    if (Object.keys(body).length === 0) {
        throw new HttpError("At least one event field is required.", 400);
    }

    const patch: PatchEventRequest = {};

    if ("name" in body) {
        patch.name = parseRequiredString(body.name, "name");
    }
    if ("location" in body) {
        patch.location = parseRequiredString(body.location, "location");
    }
    if ("date" in body) {
        patch.date = parseDate(body.date);
    }
    if ("image" in body) {
        patch.image = parseOptionalImage(body.image);
    }
    if ("availableTickets" in body) {
        patch.availableTickets = parseAvailableTickets(body.availableTickets);
    }
    if ("sectors" in body) {
        patch.sectors = parseSectors(body.sectors);
    }

    return patch;
};

const handleEventError = (error: unknown, res: Response): void => {
    if (error instanceof HttpError) {
        res.status(error.statusCode).json({
            ok: false,
            error: error.message
        });
        return;
    }

    throw error;
};

export const eventsController = async (_req: Request, res: Response) => {
    const events = await eventService.getAll();
    res.status(200).json(events);
};

export const eventByIdController = async (req: Request, res: Response) => {
    try {
        const id = parseEventId(req.params.eventId);
        const event = await eventService.getById(id);

        res.status(200).json(event);
    } catch (error) {
        handleEventError(error, res);
    }
};

export const createEventController = async (req: Request, res: Response) => {
    try {
        const createRequest = parseCreateEventRequest(req.body);
        const event = await eventService.create(createRequest);

        res.status(201).json(event);
    } catch (error) {
        handleEventError(error, res);
    }
};

export const patchEventController = async (req: Request, res: Response) => {
    try {
        const id = parseEventId(req.params.eventId);
        const patchRequest = parsePatchEventRequest(req.body);
        const event = await eventService.patch(id, patchRequest);

        res.status(200).json(event);
    } catch (error) {
        handleEventError(error, res);
    }
};

export const deleteEventController = async (req: Request, res: Response) => {
    try {
        const id = parseEventId(req.params.eventId);
        await eventService.delete(id);

        res.sendStatus(204);
    } catch (error) {
        handleEventError(error, res);
    }
};
