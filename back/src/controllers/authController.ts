import type { SignInRequest } from "@repo/types";
import type { Request, Response } from "express";
import { HttpError } from "../common/HttpError.js";
import { signIn } from "../services/authService.js";

const hasSignInFields = (body: unknown): body is SignInRequest =>
    typeof body === "object" &&
    body !== null &&
    "email" in body &&
    "password" in body &&
    typeof body.email === "string" &&
    typeof body.password === "string";

const parseSignInRequest = (body: unknown): SignInRequest => {
    if (!hasSignInFields(body)) {
        throw new HttpError("Email and password are required.", 400);
    }

    const normalizedEmail = body.email.trim().toLowerCase();

    if (!normalizedEmail || !normalizedEmail.includes("@") || !body.password) {
        throw new HttpError("A valid email and password is required.", 400);
    }

    return {
        email: normalizedEmail,
        password: body.password
    };
};

export const signInController = async (req: Request, res: Response) => {
    try {
        const signInRequest = parseSignInRequest(req.body);
        const result = await signIn(signInRequest);

        res.status(result.created ? 201 : 200).json({
            ok: true,
            user: result.user
        });
    } catch (error) {
        if (error instanceof HttpError) {
            res.status(error.statusCode).json({
                ok: false,
                error: error.message
            });
            return;
        }

        res.status(500).json({
            ok: false,
            error: "Internal server error."
        });
    }
};
