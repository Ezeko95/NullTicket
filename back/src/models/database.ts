import initSqlJs, { type Database as SqlDatabase } from "sql.js";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const databasePath = join(__dirname, "../../data/nullticket.sqlite");
const wasmPath = require.resolve("sql.js/dist/sql-wasm.wasm");

let database: SqlDatabase | undefined;

export const initializeDatabase = async () => {
    if (database) {
        return;
    }

    mkdirSync(dirname(databasePath), { recursive: true });

    const SQL = await initSqlJs({
        locateFile: () => wasmPath
    });

    database = existsSync(databasePath)
        ? new SQL.Database(readFileSync(databasePath))
        : new SQL.Database();

    database.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    `);

    persistDatabase(database);
};

export const getDatabase = () => {
    if (!database) {
        throw new Error("Database has not been initialized.");
    }

    return database;
};

export const persistDatabase = (database: SqlDatabase) => {
    writeFileSync(databasePath, Buffer.from(database.export()));
};
