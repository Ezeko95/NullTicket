"use server";

import { redirect } from "next/navigation";
import type { SafeUser } from "@repo/types";
import {
    buildMockAdminToken,
    clearAdminSessionCookie,
    isAdminMockAuthEnabled,
    setAdminSessionCookie
} from "@/lib/admin-session";

const API_URL =
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:3001";

interface AdminUser {
    email: string;
    name: string;
    mode: "mock" | "backend";
}

function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

function readErrorMessage(payload: unknown, fallback: string): string {
    if (!payload || typeof payload !== "object") {
        return fallback;
    }

    const message =
        "message" in payload && typeof payload.message === "string"
            ? payload.message
            : "error" in payload && typeof payload.error === "string"
              ? payload.error
              : null;

    return message ?? fallback;
}

export async function loginAdminAction(
    email: string,
    password: string
): Promise<{ admin: AdminUser } | { error: string }> {
    const normalizedEmail = normalizeEmail(email);

    if (isAdminMockAuthEnabled()) {
        const expectedEmail = process.env.ADMIN_EMAIL
            ? normalizeEmail(process.env.ADMIN_EMAIL)
            : null;
        const expectedPassword = process.env.ADMIN_PASSWORD;

        if (!expectedEmail || !expectedPassword) {
            return {
                error: "ADMIN_MOCK_AUTH está activo, pero faltan ADMIN_EMAIL o ADMIN_PASSWORD."
            };
        }

        if (
            normalizedEmail !== expectedEmail ||
            password !== expectedPassword
        ) {
            return {
                error: "Credenciales de admin inválidas. Con ADMIN_MOCK_AUTH activo solo valen ADMIN_EMAIL y ADMIN_PASSWORD del .env."
            };
        }

        await setAdminSessionCookie(buildMockAdminToken(normalizedEmail));

        return {
            admin: {
                email: normalizedEmail,
                name: "Admin",
                mode: "mock"
            }
        };
    }

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: normalizedEmail, password }),
            cache: "no-store"
        });

        if (!response.ok) {
            const payload = await response.json().catch(() => null);
            return {
                error: readErrorMessage(
                    payload,
                    "No se pudo iniciar sesión como admin."
                )
            };
        }

        const payload = (await response.json()) as {
            token?: string;
            user?: SafeUser;
        };

        if (!payload.token) {
            return {
                error: "La respuesta del backend no incluyó el token."
            };
        }

        if (payload.user?.role !== "admin") {
            return {
                error: "Esta cuenta no tiene rol admin. Usá un usuario admin del seed (p. ej. juan.garcia@nullticket.com)."
            };
        }

        await setAdminSessionCookie(payload.token);

        return {
            admin: {
                email: payload.user.email ?? normalizedEmail,
                name: payload.user.name ?? "Admin",
                mode: "backend"
            }
        };
    } catch {
        return {
            error: "No se pudo contactar el backend. Activá ADMIN_MOCK_AUTH para desarrollo local sin API."
        };
    }
}

export async function logoutAdminAction(): Promise<void> {
    await clearAdminSessionCookie();
    redirect("/admin/login");
}
