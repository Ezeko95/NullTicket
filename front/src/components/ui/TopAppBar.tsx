"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
    { href: "/discover", label: "Descubrí" },
    { href: "/history", label: "Historial" },
    { href: "/concierge", label: "Concierge" }
];

export function TopAppBar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    return (
        <header className="fixed top-0 w-full z-50 glass-header shadow-ambient">
            <nav className="flex justify-between items-center px-8 py-5 max-w-screen-2xl mx-auto">
                {/* Logo + Nav */}
                <div className="flex items-center gap-12">
                    <Link
                        href="/"
                        className="text-2xl font-black text-primary tracking-tighter font-headline"
                    >
                        NullTicket
                    </Link>

                    <div className="hidden md:flex gap-8 items-center font-headline font-bold tracking-tight">
                        {navLinks.map(({ href, label }) => {
                            const active = pathname.startsWith(href);
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={
                                        active
                                            ? "text-primary border-b-2 border-primary pb-1"
                                            : "text-on-surface-variant hover:text-primary transition-colors"
                                    }
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Búsqueda + Auth */}
                <div className="flex items-center gap-6">
                    <div className="hidden lg:flex items-center bg-surface-container-low rounded-full px-4 py-2 gap-2">
                        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                            search
                        </span>
                        <input
                            type="text"
                            placeholder="Buscá una experiencia..."
                            className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-on-surface-variant font-body"
                        />
                    </div>

                    {user ? (
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full editorial-gradient flex items-center justify-center text-on-primary text-sm font-black font-headline">
                                {user.name?.[0]?.toUpperCase() ?? "U"}
                            </div>
                            <button
                                onClick={logout}
                                className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors font-headline"
                            >
                                Salir
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="editorial-gradient text-on-primary px-6 py-2.5 rounded-xl font-headline font-bold text-sm tracking-tight hover:opacity-80 transition-opacity"
                        >
                            Ingresá
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
}
