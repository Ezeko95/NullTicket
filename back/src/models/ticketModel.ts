import type { Ticket as TicketContract, EventSectorName } from "@repo/types";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Ticket implements TicketContract {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    eventId: number;

    @Column()
    eventName: string;

    @Column()
    eventDate: string;

    @Column()
    sector: EventSectorName;

    @Column("float")
    price: number;

    @Column()
    status: "active" | "used" | "cancelled";

    @Column()
    userId: number;

    @Column()
    purchasedAt: string;
}
