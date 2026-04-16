import type { RegisterRequest } from "@repo/types";
import { LoginResponse, LoginRequest, ErrorsNumber } from "@repo/types";
import type { Request, Response } from "express";
import { HttpError } from "../common/HttpError.js";
import authService from "../services/authService.js";

const hasRegisterFields = (body: unknown): body is RegisterRequest =>
    typeof body === "object" &&
    body !== null &&
    "name" in body &&
    "email" in body &&
    "password" in body &&
    typeof body.name === "string" &&
    typeof body.email === "string" &&
    typeof body.password === "string";

const parseRegisterRequest = (body: unknown): RegisterRequest => {
    if (!hasRegisterFields(body)) {
        throw new HttpError("Email, name and password are required.", 400);
    }

    const normalizedName = body.name
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase());
    const normalizedEmail = body.email.trim().toLowerCase();

    if (!normalizedEmail || !normalizedEmail.includes("@") || !body.password) {
        throw new HttpError("A valid email and password is required.", 400);
    }

    return {
        name: normalizedName,
        email: normalizedEmail,
        password: body.password
    };
};

export const registerController = async (req: Request, res: Response) => {
    try {
        const registerRequest = parseRegisterRequest(req.body);
        const result = await authService.register(registerRequest);

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

export async function loginController(req: Request, res: Response) {
    try {
        const { email, password } = req.body as LoginRequest;

        const [token, user] = await authService.login(email, password);

        if (token && user)
            return res.status(200).json({
                token,
                user
            } as LoginResponse);

        if (!token && user)
            return res.status(401).json({
                message: "passwords must be equal",
                errorNumber: ErrorsNumber.PasswordError
            });

        return res.status(401).json({
            message: "user not found",
            errorNumber: ErrorsNumber.UserNotFound
        });
    } catch {
        return res.status(500).json({
            ok: false,
            error: "Internal server error."
        });
    }
}
