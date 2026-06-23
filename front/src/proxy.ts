import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const USER_SESSION_COOKIE = "token";
const ADMIN_SESSION_COOKIE = "admin_token";

const PROTECTED_PATHS = ["/discover", "/history", "/concierge", "/events"];
const ADMIN_LOGIN_PATH = "/admin/login";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hasUserSession = request.cookies.has(USER_SESSION_COOKIE);
    const hasAdminSession = request.cookies.has(ADMIN_SESSION_COOKIE);
    const isAdminRoute = pathname.startsWith("/admin");
    const isAdminLoginPage = pathname === ADMIN_LOGIN_PATH;

    if (isAdminRoute) {
        if (!isAdminLoginPage && !hasAdminSession) {
            const url = request.nextUrl.clone();
            url.pathname = ADMIN_LOGIN_PATH;
            url.searchParams.set("redirect", pathname);
            return NextResponse.redirect(url);
        }

        if (isAdminLoginPage && hasAdminSession) {
            return NextResponse.redirect(new URL("/admin/events", request.url));
        }

        return NextResponse.next();
    }

    if (process.env.DISABLE_AUTH === "true") return NextResponse.next();

    const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
    const isAuthPage = pathname === "/login" || pathname === "/register";

    if (isProtected && !hasUserSession) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(url);
    }

    if (isAuthPage && hasUserSession) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
