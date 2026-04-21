import type { Ticket as TicketContract, EventSectorName } from "@repo/types";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Ticket implements TicketContract {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("int")
    eventId: number;

    @Column("text")
    eventName: string;

    @Column("text")
    eventDate: string;

    @Column("text")
    sector: EventSectorName;

    @Column("float")
    price: number;

    @Column("text")
    status: "active" | "used" | "cancelled";

    @Column("int")
    userId: number;

    @Column("text")
    purchasedAt: string;
}
