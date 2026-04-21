import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "token";

const PROTECTED_PATHS = ["/discover", "/history", "/concierge"];

export function proxy(request: NextRequest) {
    if (process.env.DISABLE_AUTH === "true") return NextResponse.next();

    const { pathname } = request.nextUrl;
    const hasSession = request.cookies.has(SESSION_COOKIE);

    const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
    const isAuthPage = pathname === "/login" || pathname === "/register";

    if (isProtected && !hasSession) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(url);
    }

    if (isAuthPage && hasSession) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
