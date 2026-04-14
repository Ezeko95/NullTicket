import { In } from "typeorm";
import { AppDataSource } from "../../dataSource.ts";
import { User } from "../../models/user/user.ts";

class UserService {
    private readonly repository = AppDataSource.getRepository(User);

    findBy({ ids = [], emails = [] }: { ids?: number[]; emails?: string[] }) {
        return this.repository.findBy({ id: In(ids), email: In(emails) });
    }
}

export default new UserService() as UserService;
