import { User } from "./user.js";

export type RegisterRequest = {
    name: string;
    email: string;
    password: string;
};

export type LoginRequest = {
    email: string;
    password: string;
};

export type LoginResponse = {
    token: string;
    user: User;
};
