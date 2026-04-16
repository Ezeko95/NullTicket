import { User } from "./user.js";

export type AuthUser = User;

export type RegisterRequest = {
    email: string;
    password: string;
};

export type LoginRequest = RegisterRequest;

export type LoginResponse = {
    token: string;
    user: User;
};
