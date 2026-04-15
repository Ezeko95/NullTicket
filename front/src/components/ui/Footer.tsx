import Link from "next/link";

const links = {
    Plataforma: [
        { label: "Descubrí", href: "/discover" },
        { label: "Concierge", href: "/concierge" },
        { label: "Historial", href: "/history" }
    ],
    Legal: [
        { label: "Política de Privacidad", href: "#" },
        { label: "Términos de Servicio", href: "#" }
    ],
    Soporte: [
        { label: "Centro de Ayuda", href: "#" },
        { label: "Accesibilidad", href: "#" }
    ],
    Redes: [
        { label: "Instagram", href: "#" },
        { label: "Editorial", href: "#" }
    ]
};

export function Footer() {
    return (
        <footer className="w-full bg-surface-container-low py-16 px-8 mt-auto">
            <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
                {/* Marca */}
                <div className="max-w-xs">
                    <span className="font-headline font-black text-lg uppercase text-primary mb-4 block">
                        NullTicket
                    </span>
                    <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                        Un ecosistema premium de entradas diseñado para el
                        connoisseur cultural moderno. Calidad antes que
                        cantidad.
                    </p>
                </div>

                {/* Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                    {Object.entries(links).map(([section, items]) => (
                        <div key={section} className="flex flex-col gap-4">
                            <span className="font-headline font-bold text-xs uppercase tracking-widest text-on-surface-variant">
                                {section}
                            </span>
                            {items.map(({ label, href }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    className="font-body text-sm text-on-surface-variant hover:text-primary hover:underline decoration-primary/20 underline-offset-4 transition-all"
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Barra inferior */}
            <div className="max-w-screen-2xl mx-auto mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-outline-variant/15">
                <p className="font-body text-xs text-on-surface-variant opacity-60">
                    © 2025 NullTicket. Todos los derechos reservados.
                </p>
                <div className="flex gap-6">
                    <span className="material-symbols-outlined text-on-surface-variant text-lg cursor-pointer hover:text-primary transition-colors">
                        language
                    </span>
                    <span className="material-symbols-outlined text-on-surface-variant text-lg cursor-pointer hover:text-primary transition-colors">
                        currency_exchange
                    </span>
                </div>
            </div>
        </footer>
    );
}
