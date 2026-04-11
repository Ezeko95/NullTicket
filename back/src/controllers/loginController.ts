import { Request, Response } from "express";
import { LoginResponse, LoginRequest } from "@repo/types";
import { LoginUser } from "../models/auth/user";

export function loginController(req: Request, res: Response) {
    const { email, password } = req.body as LoginRequest;

    const user = new LoginUser({ email: "", id: "", name: "" });
    const token = "";
    res.status(200).json({
        token: token,
        user: user
    } as LoginResponse);
}
