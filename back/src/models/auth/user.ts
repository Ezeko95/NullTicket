import { AuthUser } from "@repo/types";

export class LoginUser implements AuthUser {
    id: string;
    name: string;
    email: string;

    constructor({ id, name, email }: AuthUser) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
}
