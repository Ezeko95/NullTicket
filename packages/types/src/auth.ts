import { IUser } from "./user.js";

export type AuthUser = IUser;

export type RegisterRequest = {
    email: string;
    password: string;
};

export type LoginRequest = RegisterRequest;

export type LoginResponse = {
    token: string;
    user: IUser;
};
