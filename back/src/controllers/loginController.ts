import { Request, Response } from "express";
import { LoginResponse, LoginRequest, ErrorsNumber } from "@repo/types";
import loginService from "../services/login/login.service.js";

export async function loginController(req: Request, res: Response) {
    const { email, password } = req.body as LoginRequest;

    const [token, user] = await loginService.login(email, password);

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

    if (!user)
        return res.status(401).json({
            message: "user not found",
            errorNumber: ErrorsNumber.UserNotFound
        });
}
