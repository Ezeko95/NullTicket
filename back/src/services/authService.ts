import type { RegisterRequest } from "@repo/types";
import bcrypt from "bcryptjs";
import { HttpError } from "../common/HttpError.js";
import { createUser, findUserByEmail, type User } from "../models/User.js";

const saltRounds = 12;

type SafeUser = {
    id: number;
    email: string;
    createdAt: string;
};

type RegisterResult = {
    created: boolean;
    user: SafeUser;
};

const toSafeUser = (user: User): SafeUser => ({
    id: user.id,
    email: user.email,
    createdAt: user.createdAt
});

export const register = async ({
    email,
    password
}: RegisterRequest): Promise<RegisterResult> => {
    const passwordHash = await bcrypt.hash(password, saltRounds);
    let user: User;

    try {
        user = await createUser(email, passwordHash);
    } catch (error) {
        const existingUser = await findUserByEmail(email);

        if (existingUser) {
            throw new HttpError("User already exists", 409);
        }

        throw error;
    }

    return {
        created: true,
        user: toSafeUser(user)
    };
};
