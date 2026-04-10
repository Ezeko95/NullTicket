"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/mis-tickets", label: "Mis Tickets" },
    { href: "/comprar", label: "Comprar / Carro" }
] as const;

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="dashboard-sidebar p-6 flex flex-col gap-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-sky-500 bg-clip-text text-transparent">
                SmartTickets AI
            </div>
            <nav className="mt-8 flex flex-col gap-2">
                {navLinks.map(({ href, label }) => (
                    <Link
                        key={href}
                        href={href}
                        className={`p-3 rounded-lg font-medium transition ${
                            pathname === href
                                ? "bg-blue-600/20 text-blue-400"
                                : "hover:bg-gray-700 text-gray-300"
                        }`}
                    >
                        {label}
                    </Link>
                ))}
                <Link
                    href="/agente-ia"
                    className={`p-3 rounded-lg flex items-center gap-2 font-medium transition ${
                        pathname === "/agente-ia"
                            ? "bg-purple-600/20 text-purple-400"
                            : "hover:bg-gray-700 text-purple-400"
                    }`}
                >
                    <span>✨ Asistente IA</span>
                </Link>
            </nav>
        </aside>
    );
}
