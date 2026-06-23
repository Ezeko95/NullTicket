import type { SafeUser, UserRole } from "@repo/types";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import userRepo from "../repositories/userRepo.js";

export type AuthPayload = SafeUser;

type AuthMiddlewareOptions = {
    role?: UserRole;
};

export function authMiddleware(options: AuthMiddlewareOptions = {}) {
    return async function authenticate(
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

        if (options.role && user.role !== options.role) {
            res.status(403).json({ ok: false, error: "Forbidden." });
            return;
        }

        res.locals.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        } satisfies AuthPayload;
        next();
    };
}
