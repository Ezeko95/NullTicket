import type { User as UserContract, UserRole } from "@repo/types";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User implements UserContract {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    name: string;

    @Column("text")
    email: string;

    @Column("text")
    password: string;

    @Column({ type: "text", default: "user" })
    role: UserRole;
}
