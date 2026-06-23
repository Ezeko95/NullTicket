import { AppDataSource } from "../dataSource.js";
import { User } from "../models/userModel.js";
import type { UserRole } from "@repo/types";

class UserRepo {
    private readonly repository = AppDataSource.getRepository(User);

    findByEmail(email: string): Promise<User | null> {
        return this.repository.findOneBy({ email });
    }

    findById(id: number): Promise<User | null> {
        return this.repository.findOneBy({ id });
    }

    async create(
        name: string,
        email: string,
        password: string,
        role: UserRole = "user"
    ): Promise<User> {
        const user = this.repository.create({ name, email, password, role });
        return this.repository.save(user);
    }
}

export default new UserRepo();
