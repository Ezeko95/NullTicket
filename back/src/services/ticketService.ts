import ticketRepo from "../repositories/ticketRepo.js";
import type { Ticket } from "../models/ticketModel.js";

class TicketService {
    getByUserId(userId: number): Promise<Ticket[]> {
        return ticketRepo.findByUserId(userId);
    }
}

export default new TicketService();
