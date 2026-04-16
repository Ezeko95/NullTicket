import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { AppDataSource } from "../src/dataSource.js";
import { Event } from "../src/models/eventModel.js";
import { User } from "../src/models/userModel.js";

const ROOT = process.cwd();
const DB_PATH = path.join(ROOT, "NullTicket");
const SEED_DIR = path.join(ROOT, "seed");

function parseRow(line) {
    const result = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === "," && !inQuotes) {
            result.push(current.trim());
            current = "";
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}

function parseCsv(filePath) {
    const lines = fs.readFileSync(filePath, "utf-8").trim().split("\n");
    const headers = parseRow(lines[0]);
    return lines.slice(1).map((line) => {
        const values = parseRow(line);
        return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""]));
    });
}

if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH);
    console.log("Deleted existing database.");
}

await AppDataSource.initialize();
console.log("Database initialized.");

const userRepo = AppDataSource.getRepository(User);
const userRows = parseCsv(path.join(SEED_DIR, "users.csv"));
for (const row of userRows) {
    const passwordHash = await bcrypt.hash(row.password, 12);
    await userRepo.save(
        userRepo.create({
            name: row.name,
            email: row.email,
            password: passwordHash
        })
    );
}
console.log(`Seeded ${userRows.length} users.`);

const eventRepo = AppDataSource.getRepository(Event);
const eventRows = parseCsv(path.join(SEED_DIR, "events.csv"));
for (const row of eventRows) {
    await eventRepo.save(
        eventRepo.create({
            name: row.name,
            location: row.location,
            date: row.date,
            availableTickets: Number(row.availableTickets),
            image: row.image || undefined,
            sectors: JSON.parse(row.sectors)
        })
    );
}
console.log(`Seeded ${eventRows.length} events.`);

await AppDataSource.destroy();
console.log("Seeding complete!");
