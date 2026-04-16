import type { RegisterRequest } from "@repo/types";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { HttpError } from "../common/HttpError.js";
import { User } from "../models/userModel.js";
import userRepo from "../repositories/userRepo.js";

const saltRounds = 12;

type SafeUser = {
    id: number;
    email: string;
};

type RegisterResult = {
    created: boolean;
    user: SafeUser;
};

class AuthService {
    private toSafeUser(user: User): SafeUser {
        return {
            id: user.id,
            email: user.email
        };
    }

    async register({
        email,
        password
    }: RegisterRequest): Promise<RegisterResult> {
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const existingUser = await userRepo.findByEmail(email);
        if (existingUser) {
            throw new HttpError("User already exists", 409);
        }

        const user = await userRepo.create(email, passwordHash);

        return {
            created: true,
            user: this.toSafeUser(user)
        };
    }

    async login(email: string, password: string) {
        const [user] = await userRepo.findBy({ emails: [email] });

        const canLogin = await bcrypt.compare(password, user.password);

        return canLogin
            ? ([
                  jwt.sign(
                      {
                          id: user.id,
                          email: user.email,
                          name: user.name
                      },
                      null
                  ),
                  user
              ] as const)
            : ([null, null] as const);
    }
}

export default new AuthService();
