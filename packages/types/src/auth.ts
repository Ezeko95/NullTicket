import { IUser } from "./user.js";

export interface AuthUser {
    id: number;
    name: string;
    email: string;
}

export type SignInRequest = {
    email: string;
    password: string;
};

export type SignInInput = SignInRequest;

export type LoginRequest = SignInRequest;

export type LoginResponse = {
    token: string;
    user: IUser;
};
