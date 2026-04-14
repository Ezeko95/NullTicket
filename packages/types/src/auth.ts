import { IUser } from "./user.ts";

export interface AuthUser {
    id: number;
    name: string;
    email: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: IUser;
}
