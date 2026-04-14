import { getDatabase, persistDatabase } from "./database.js";

export type User = {
    id: number;
    email: string;
    passwordHash: string;
    createdAt: string;
};

type UserRow = {
    id: number;
    email: string;
    password_hash: string;
    created_at: string;
};

type SqlValue = string | number | Uint8Array | null;

const readUserRow = (columns: string[], values: SqlValue[]): UserRow => ({
    id: values[columns.indexOf("id")] as number,
    email: values[columns.indexOf("email")] as string,
    password_hash: values[columns.indexOf("password_hash")] as string,
    created_at: values[columns.indexOf("created_at")] as string
});

const mapUser = (row: UserRow): User => ({
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    createdAt: row.created_at
});

export const findUserByEmail = async (
    email: string
): Promise<User | undefined> => {
    const database = getDatabase();
    const [result] = database.exec(
        "SELECT id, email, password_hash, created_at FROM users WHERE email = ?",
        [email]
    );

    if (!result?.values[0]) {
        return undefined;
    }

    return mapUser(readUserRow(result.columns, result.values[0]));
};

export const createUser = async (
    email: string,
    passwordHash: string
): Promise<User> => {
    const database = getDatabase();

    database.run("INSERT INTO users (email, password_hash) VALUES (?, ?)", [
        email,
        passwordHash
    ]);

    const [idResult] = database.exec("SELECT last_insert_rowid() AS id");
    const id = idResult.values[0]?.[0];
    const [userResult] = database.exec(
        "SELECT id, email, password_hash, created_at FROM users WHERE id = ?",
        [id]
    );
    const row = userResult.values[0];

    if (!row) {
        throw new Error("Created user could not be loaded.");
    }

    persistDatabase(database);

    return mapUser(readUserRow(userResult.columns, row));
};
