import { type Event as EventContract, type EventSector } from "@repo/types";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Event implements EventContract {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    name: string;

    @Column("text")
    location: string;

    @Column("text")
    date: string;

    @Column({ type: "text", nullable: true })
    image?: string;

    @Column("int")
    availableTickets: number;

    @Column("simple-json")
    sectors: EventSector[];
}
