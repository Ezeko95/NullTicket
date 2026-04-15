import { IUser } from "./user.js";

export interface AuthUser {
    id: number;
    name: string;
    email: string;
}

export type RegisterRequest = {
    email: string;
    password: string;
};

export type LoginRequest = RegisterRequest;

export type LoginResponse = {
    token: string;
    user: IUser;
};
