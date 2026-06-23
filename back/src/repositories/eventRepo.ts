import type { DeepPartial } from "typeorm";
import { AppDataSource } from "../dataSource.js";
import { Event } from "../models/eventModel.js";

class EventRepo {
    private readonly repository = AppDataSource.getRepository(Event);

    findAll(): Promise<Event[]> {
        return this.repository.find();
    }

    findById(id: number): Promise<Event | null> {
        return this.repository.findOneBy({ id });
    }

    async create(event: DeepPartial<Event>): Promise<Event> {
        return this.repository.save(this.repository.create(event));
    }

    async update(event: Event, patch: Partial<Event>): Promise<Event> {
        return this.repository.save({ ...event, ...patch });
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete({ id });
    }
}

export default new EventRepo();
