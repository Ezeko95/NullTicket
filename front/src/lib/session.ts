import { cookies } from "next/headers";

interface User {
    id: number;
    name: string;
    email: string;
}

// Decodifica el payload del JWT sin verificar firma.
// La verificación real ocurre en el backend en cada API call.
export async function getUserFromCookie(): Promise<User | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    try {
        const payload = token.split(".")[1];
        return JSON.parse(Buffer.from(payload, "base64url").toString()) as User;
    } catch {
        return null;
    }
}
