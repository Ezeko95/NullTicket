import { In } from "typeorm";
import { AppDataSource } from "../../dataSource.js";
import { User } from "../../models/user/user.js";

class UserService {
    private readonly repository = AppDataSource.getRepository(User);

    findBy({ ids = [], emails = [] }: { ids?: number[]; emails?: string[] }) {
        return this.repository.findBy({ id: In(ids), email: In(emails) });
    }
}

export default new UserService() as UserService;
