import type { User } from "@repo/types";
import type { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import userRepo from "../repositories/userRepo.js";

export type AuthPayload = Omit<User, "password">;

export async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization ?? "";
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : undefined;

    if (!token) {
        res.status(401).json({ ok: false, error: "Unauthorized." });
        return;
    }

    let payload: AuthPayload;
    try {
        payload = jwt.verify(
            token,
            process.env.JWT_SECRET ?? "secret"
        ) as AuthPayload;
    } catch {
        res.status(401).json({ ok: false, error: "Unauthorized." });
        return;
    }

    const user = await userRepo.findById(payload.id);
    if (!user) {
        res.status(401).json({ ok: false, error: "Invalid user." });
        return;
    }

    res.locals.user = payload;
    next();
}
