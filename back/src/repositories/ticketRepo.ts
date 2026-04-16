import { AppDataSource } from "../dataSource.js";
import { Ticket } from "../models/ticketModel.js";

class TicketRepo {
    private readonly repository = AppDataSource.getRepository(Ticket);

    findByUserId(userId: number): Promise<Ticket[]> {
        return this.repository.findBy({ userId });
    }
}

export default new TicketRepo();
