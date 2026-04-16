import { DataSource } from "typeorm";
import { User } from "./models/userModel.js";

export const AppDataSource = new DataSource({
    type: "better-sqlite3",
    database: "NullTicket",
    entities: [User],
    synchronize: true
});

export async function initializeDB() {
    try {
        await AppDataSource.initialize();
        console.log("Data Source has been initialized!");
    } catch (err) {
        console.error("Error during Data Source initialization:", err);
    }
}
