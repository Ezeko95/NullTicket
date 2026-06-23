"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdminAction } from "@/actions/admin-auth";

const NAV_LINKS = [
    { href: "/admin/events", label: "Eventos" },
    { href: "/admin/events/new", label: "Nuevo evento" }
] as const;

function linkClassName(isActive: boolean): string {
    return [
        "rounded-xl px-4 py-2 text-sm font-bold transition-colors font-headline",
        isActive
            ? "bg-primary/10 text-primary"
            : "text-on-surface-variant hover:text-primary"
    ].join(" ");
}

export function AdminNav() {
    const pathname = usePathname();

    return (
        <nav className="flex flex-wrap items-center gap-2">
            {NAV_LINKS.map(({ href, label }) => {
                const isActive =
                    href === "/admin/events"
                        ? pathname === href
                        : pathname.startsWith(href);

                return (
                    <Link
                        key={href}
                        href={href}
                        className={linkClassName(isActive)}
                    >
                        {label}
                    </Link>
                );
            })}

            <form action={logoutAdminAction} className="ml-1">
                <button
                    type="submit"
                    className="rounded-xl border border-outline-variant px-4 py-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors font-headline"
                >
                    Cerrar sesión
                </button>
            </form>
        </nav>
    );
}
