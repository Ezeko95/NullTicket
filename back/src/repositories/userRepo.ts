import { In } from "typeorm";
import { AppDataSource } from "../dataSource.js";
import { User } from "../models/userModel.js";

class UserRepo {
    private readonly repository = AppDataSource.getRepository(User);

    findBy({ ids = [], emails = [] }: { ids?: number[]; emails?: string[] }) {
        return this.repository.findBy({ id: In(ids), email: In(emails) });
    }

    findByEmail(email: string): Promise<User | null> {
        return this.repository.findOneBy({ email });
    }

    async create(email: string, password: string): Promise<User> {
        const user = this.repository.create({ email, password });
        return this.repository.save(user);
    }
}

export default new UserRepo();
