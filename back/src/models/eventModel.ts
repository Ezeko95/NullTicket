import { type Event as EventContract, type EventSector } from "@repo/types";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Event implements EventContract {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    location: string;

    @Column()
    date: string;

    @Column({ nullable: true })
    image?: string;

    @Column()
    availableTickets: number;

    @Column("simple-json")
    sectors: EventSector[];
}
