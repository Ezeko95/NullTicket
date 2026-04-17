"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.API_URL ?? "http://localhost:3001";
const TOKEN_KEY = "token";

interface User {
    id: number;
    name: string;
    email: string;
}

export async function loginAction(
    email: string,
    password: string
): Promise<{ user: User } | { error: string }> {
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        cache: "no-store"
    });

    if (!res.ok) {
        const { message } = await res
            .json()
            .catch(() => ({ message: "Error al iniciar sesión" }));
        return { error: message as string };
    }

    const { token, user } = (await res.json()) as { token: string; user: User };

    const cookieStore = await cookies();
    cookieStore.set(TOKEN_KEY, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/"
    });

    return { user };
}

export async function registerAction(
    name: string,
    email: string,
    password: string
): Promise<{ user: User } | { error: string }> {
    const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        cache: "no-store"
    });

    if (!res.ok) {
        const { error } = await res
            .json()
            .catch(() => ({ error: "Error al registrarse" }));
        return { error: error as string };
    }

    const { token, user } = (await res.json()) as { token: string; user: User };

    const cookieStore = await cookies();
    cookieStore.set(TOKEN_KEY, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/"
    });

    return { user };
}

export async function logoutAction(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(TOKEN_KEY);
    redirect("/login");
}
