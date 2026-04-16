export interface User {
    id: number;

    name: string;

    email: string;

    password: string;
}

export type SafeUser = Pick<User, "id" | "name" | "email">;
