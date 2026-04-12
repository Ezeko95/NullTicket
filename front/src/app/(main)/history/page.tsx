"use client";

import Image from "next/image";
import { useTickets } from "@/context/TicketContext";

const upcomingTickets = [
    {
        id: "ETP-22941",
        status: "CONFIRMADO",
        title: "Sinfonía Vanguardia: Noches Neoclásicas",
        date: "24 Oct 2025 · 20:00 hs",
        venue: "The Glass Pavilion, Seattle",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNI3ysnhIHR5rs3GrOE31BJHHZ4aPg6F17guehI9mb8qV2QmxpnLA2lICdsy0Ig12sopHkxVCgmmRzBgYP2H7EfSVYoQkvlzUqCUKpmm2odPp4dtmaMk5T3px4OqmDcs1ifOEjMX1ol1Q-sLskfWjPYlYJa0JvLH_tOxTWzDOVD2PXYnyJWBK0EJmDQM0pxoUpJU0DamGjoIs7jOKyM9N5yDiXfYT_LnPa7nR0JwWzK1KLB_SaKTbzOvMVCiuHUEQ-K3_jCYABqsHX"
    },
    {
        id: "ETP-88301",
        status: "CONFIRMADO",
        title: "Curadores Digitales: IA & El Alma",
        date: "12 Nov 2025 · 10:30 hs",
        venue: "MOMA, Ala Digital",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQ4aBDj-bakm3zGimgCo8c4cAxcxApFgrA_ghKhqZYbtI4hvDVwT3fEAabvRy0wq_CZqSgerNgznw8ual6KsedUL_ds3It6sgH7PxklsJattVGq3JmCApyjUZmuJg8Uk64UuyOa26UMuGt3MCBoXPdU_0SzNyX2Urix0lPG-FL-6C84Z_g7lbxR-npgyktYFptZvInK9wEl1pi-sXLtKYRflaQLJyPdMXaHpVtXTJGcQXb12ryrfdfWzSJW-_JV1bAj_Zv6YETGLAd"
    }
];

const pastTickets = [
    {
        id: "past-1",
        title: "Ecos del Underground",
        date: "16 Sep 2024",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUNt0ES8xymCm2HxvwnplfW5_haebIEz2W1q42X6t4_QUMnl8c2RYN-mraNqKAk3Ch5O30QCmtSnF7l5vk_hU1BfWnlWskUzj0hmiIF5s-8UB1OGZzG8QSnRLlhI5vRCgN1g2EBX3r-FJzEulaXEPEG5YHKQ4v5uVhsfjbZRQ9XHB3kgN_1ZP_ZdroNldoZRLMab6gG5rP-PJPfl-1vJJkTH6dWv-01CfQ7OFT-m0o7P5GQ4dU1suZ2wvhuJNY4xF1fVj1PXXIDz0O"
    },
    {
        id: "past-2",
        title: "La Gala de Medianoche",
        date: "3 Ago 2024",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBlOi45aGeCNhvhNa1bpvRl0MjWh-L345EeEmxnRYgv7xDKTEuFXnwy68a9PzZ3FGPR4Ffd1mDiwC4oS0zdiAQDtrzZsPBgEhxA0MtFig0SpL98Swoe7RXq-qVNigU3KNGnQIEeoJhcLDougFsPoIwhyXIUKbaSTyTg59DpXvnattgo3vZcnch7Fx2RsQny30Zka1stHb5wrsC8Ny2AiKgRNoh39w_jKQblNkovOcewUfMP_sbTgfRHpozyvYya4TY_fsuaCNz80RMv"
    },
    {
        id: "past-3",
        title: "Comida Callejera & Film Noir",
        date: "21 Jul 2024",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDe-ETsPsZFIjwe00XieRHJ7_vDvZZJG_0So5PUHdq2gH-nqeEyoIjWyuKa_t2VwFjM9mpGDc8U447SR7bVCwsc-fvJyotlUBoOL4fOfbXr4tu8WmszqnbIpcxaaB_PmDa199Hl4FpbPKSTYwN_Y6Aa7frJekAbCxeHWyXlhaWFzusdngT98FWrvP1nAAt18FaeGty13ys0ZrTDEdMfE4FQ33-Fkh6nIQl8FFoW_zJxd18Ity61gk3HWd1DqxCvz9u-LNlvEJDHv60q"
    }
];

export default function HistoryPage() {
    const { misTickets } = useTickets();

    return (
        <div className="max-w-screen-2xl mx-auto px-8 pb-24 pt-8">
            {/* Encabezado */}
            <div className="mb-16">
                <p className="text-xs uppercase tracking-widest font-bold text-on-surface-variant font-label mb-3">
                    Tu Colección
                </p>
                <h1
                    className="font-headline font-black tracking-tighter text-primary leading-none"
                    style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}
                >
                    Historial
                </h1>
                {misTickets > 0 && (
                    <p className="text-on-surface-variant font-body mt-4">
                        Tenés{" "}
                        <span className="font-bold text-primary">
                            {misTickets}
                        </span>{" "}
                        entrada{misTickets !== 1 ? "s" : ""} en tu colección.
                    </p>
                )}
            </div>

            {/* Próximos */}
            <section className="mb-20">
                <div className="flex items-center gap-3 mb-8">
                    <h2 className="font-headline font-black text-2xl text-primary">
                        Próximos
                    </h2>
                    <span className="material-symbols-outlined text-primary text-[20px]">
                        arrow_downward
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {upcomingTickets.map((ticket) => (
                        <div
                            key={ticket.id}
                            className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-ambient flex flex-col md:flex-row"
                        >
                            {/* Imagen */}
                            <div className="relative w-full md:w-40 h-48 md:h-auto shrink-0">
                                <Image
                                    src={ticket.image}
                                    alt={ticket.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Info */}
                            <div className="p-8 flex flex-col justify-between flex-1">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="bg-primary-fixed text-on-primary-fixed-variant text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full font-label">
                                            {ticket.status}
                                        </span>
                                        <span className="text-on-surface-variant text-xs font-body">
                                            #{ticket.id}
                                        </span>
                                    </div>
                                    <h3 className="font-headline font-extrabold text-xl text-primary leading-tight mb-3">
                                        {ticket.title}
                                    </h3>
                                    <p className="flex items-center gap-2 text-sm text-on-surface-variant font-body mb-1">
                                        <span className="material-symbols-outlined text-[16px]">
                                            calendar_today
                                        </span>
                                        {ticket.date}
                                    </p>
                                    <p className="flex items-center gap-2 text-sm text-on-surface-variant font-body">
                                        <span className="material-symbols-outlined text-[16px]">
                                            location_on
                                        </span>
                                        {ticket.venue}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 mt-6">
                                    <button className="editorial-gradient text-on-primary px-6 py-2.5 rounded-lg font-headline font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity">
                                        <span className="material-symbols-outlined text-[16px]">
                                            qr_code_2
                                        </span>
                                        Ver Pase
                                    </button>
                                    <button className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors font-headline">
                                        Agregar a Billetera
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Experiencias Pasadas */}
            <section>
                <h2 className="font-headline font-black text-2xl text-primary mb-8">
                    Experiencias Pasadas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {pastTickets.map((ticket) => (
                        <div
                            key={ticket.id}
                            className="bg-surface-container-lowest rounded-2xl p-5 flex items-center gap-5 shadow-ambient"
                        >
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                                <Image
                                    src={ticket.image}
                                    alt={ticket.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-on-surface-variant font-bold font-label uppercase tracking-widest mb-1">
                                    {ticket.date}
                                </p>
                                <h3 className="font-headline font-bold text-primary text-sm leading-tight truncate">
                                    {ticket.title}
                                </h3>
                                <p className="flex items-center gap-1 text-xs text-on-surface-variant mt-1 font-body">
                                    <span className="material-symbols-outlined text-[12px]">
                                        check_circle
                                    </span>
                                    Asistido
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
