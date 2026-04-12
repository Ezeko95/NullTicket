import type { RegisterRequest } from "@repo/types"; // 1
import type { Request, Response } from "express";
import { HttpError } from "../common/HttpError.js";
import { register } from "../services/authService.js"; //2
//3
const hasRegisterFields = (body: unknown): body is RegisterRequest =>
    typeof body === "object" &&
    body !== null &&
    "email" in body &&
    "password" in body &&
    typeof body.email === "string" &&
    typeof body.password === "string";

const parseRegisterRequest = (body: unknown): RegisterRequest => {
    if (!hasRegisterFields(body)) {
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

export const registerController = async (req: Request, res: Response) => {
    try {
        const registerRequest = parseRegisterRequest(req.body); //variable interna renombrada
        const result = await register(registerRequest); //llamada al servicio renombrada

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
