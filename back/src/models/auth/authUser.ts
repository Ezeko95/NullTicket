import { AuthUser } from "@repo/types";

export class LoginUser implements AuthUser {
    id: number;
    name: string;
    email: string;
    password: string;

    constructor({ id, name, email, password }: AuthUser) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }
}
