import { IUser } from "./user.js";

export type AuthUser = IUser;

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
