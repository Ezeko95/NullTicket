import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "better-sqlite3",
    database: "NullTicket"
});

export async function initializeDB() {
    try {
        await AppDataSource.initialize();
        console.log("Data Source has been initialized!");
    } catch (err) {
        console.error("Error during Data Source initialization:", err);
    }
}
