export type UserRole = "user" | "admin";

export interface User {
    id: number;

    name: string;

    email: string;

    password: string;

    role: UserRole;
}

export type SafeUser = Pick<User, "id" | "name" | "email" | "role">;
