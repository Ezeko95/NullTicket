import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "admin_token";

const MOCK_ADMIN_PREFIX = "mock-admin";
const COOKIE_MAX_AGE = 60 * 60 * 8;

export interface AdminSession {
    token: string;
    email: string;
    name: string;
    mode: "mock" | "backend";
}

function decodeJsonPayload<T>(value: string): T | null {
    try {
        return JSON.parse(Buffer.from(value, "base64url").toString()) as T;
    } catch {
        return null;
    }
}

function readMockSession(token: string): AdminSession | null {
    const [prefix, payload] = token.split(".");

    if (prefix !== MOCK_ADMIN_PREFIX || !payload) {
        return null;
    }

    const session = decodeJsonPayload<{ email?: string; name?: string }>(
        payload
    );
    if (!session?.email) {
        return null;
    }

    return {
        token,
        email: session.email,
        name: session.name ?? "Admin",
        mode: "mock"
    };
}

function readJwtSession(token: string): AdminSession | null {
    const payload = token.split(".")[1];
    if (!payload) {
        return null;
    }

    const session = decodeJsonPayload<{
        email?: string;
        name?: string;
        sub?: string;
        role?: string;
    }>(payload);

    if (!session || session.role !== "admin") {
        return null;
    }

    return {
        token,
        email: session.email ?? session.sub ?? "admin",
        name: session.name ?? "Admin",
        mode: "backend"
    };
}

export async function getAdminSession(): Promise<AdminSession | null> {
    const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
    if (!token) {
        return null;
    }

    return readMockSession(token) ?? readJwtSession(token);
}

export async function setAdminSessionCookie(token: string): Promise<void> {
    (await cookies()).set(ADMIN_SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: COOKIE_MAX_AGE,
        path: "/"
    });
}

export async function clearAdminSessionCookie(): Promise<void> {
    (await cookies()).delete(ADMIN_SESSION_COOKIE);
}

export function isAdminMockAuthEnabled(): boolean {
    return process.env.ADMIN_MOCK_AUTH === "true";
}

export function buildMockAdminToken(email: string, name = "Admin"): string {
    const payload = Buffer.from(JSON.stringify({ email, name })).toString(
        "base64url"
    );

    return `${MOCK_ADMIN_PREFIX}.${payload}.${crypto.randomUUID()}`;
}
