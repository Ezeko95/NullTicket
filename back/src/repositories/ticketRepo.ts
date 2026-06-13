import { AppDataSource } from "../dataSource.js";
import { Ticket } from "../models/ticketModel.js";

class TicketRepo {
    private readonly repository = AppDataSource.getRepository(Ticket);

    findByUserId(userId: number): Promise<Ticket[]> {
        return this.repository.findBy({ userId });
    }

    findByIdAndUserId(id: number, userId: number): Promise<Ticket | null> {
        return this.repository.findOneBy({ id, userId });
    }

    async deleteByIdAndUserId(id: number, userId: number): Promise<void> {
        await this.repository.delete({ id, userId });
    }
}

export default new TicketRepo();
