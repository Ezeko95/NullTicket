"use client";

import { useState } from "react";
import { EventCard } from "@/components/events/EventCard";

const categories = [
    "Todos",
    "Música",
    "Arte",
    "Deportes",
    "Tecnología",
    "Cine"
];

const events = [
    {
        id: "1",
        category: "Música",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUNt0ES8xymCm2HxvwnplfW5_haebIEz2W1q42X6t4_QUMnl8c2RYN-mraNqKAk3Ch5O30QCmtSnF7l5vk_hU1BfWnlWskUzj0hmiIF5s-8UB1OGZzG8QSnRLlhI5vRCgN1g2EBX3r-FJzEulaXEPEG5YHKQ4v5uVhsfjbZRQ9XHB3kgN_1ZP_ZdroNldoZRLMab6gG5rP-PJPfl-1vJJkTH6dWv-01CfQ7OFT-m0o7P5GQ4dU1suZ2wvhuJNY4xF1fVj1PXXIDz0O",
        imageAlt: "concierto de música electrónica de alta gama",
        dateDay: "24",
        dateMonth: "OCT",
        dateYear: "2025",
        title: "Ecos Sintetizados: Noches en Berlín",
        venue: "Templehof Hangar 4, Berlín",
        price: "$124.00"
    },
    {
        id: "2",
        category: "Arte",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQ4aBDj-bakm3zGimgCo8c4cAxcxApFgrA_ghKhqZYbtI4hvDVwT3fEAabvRy0wq_CZqSgerNgznw8ual6KsedUL_ds3It6sgH7PxklsJattVGq3JmCApyjUZmuJg8Uk64UuyOa26UMuGt3MCBoXPdU_0SzNyX2Urix0lPG-FL-6C84Z_g7lbxR-npgyktYFptZvInK9wEl1pi-sXLtKYRflaQLJyPdMXaHpVtXTJGcQXb12ryrfdfWzSJW-_JV1bAj_Zv6YETGLAd",
        imageAlt: "galería de arte minimalista con pinturas abstractas",
        dateDay: "02",
        dateMonth: "NOV",
        dateYear: "2025",
        title: "La Retrospectiva Cinética",
        venue: "MoMA Manhattan, NY",
        price: "$45.00"
    },
    {
        id: "3",
        category: "Tecnología",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZRiwWoJTiZtg70BzYxP6U2cjgHfSC0rmcUfUdKBbEzGK5RB-vcUL-dCwfEKMoEUdkvYMe2jPgGeOTUB8VA9OWTPQvyFwnd-dqHaAEdQNvkltIvE_F68_lDOegslBkzaDfCu2LV2UQ4bJzLUk1C68mGYK_IW639gf3MEuJiuoCOvklw70Of5djBk_oXRTnTf0Yb2r2J81hHUOfCV86CFMNiq6IL6eBcST3v1ypLMjMI-zuOsZoVMB4VAzKdB60v2AuA_okAouc9-Uf",
        imageAlt:
            "auditorio tecnológico futurista con proyecciones holográficas",
        dateDay: "15",
        dateMonth: "NOV",
        dateYear: "2025",
        title: "El Algoritmo como Arquitectura",
        venue: "The Silicon Pavilion, SF",
        price: "$299.00"
    },
    {
        id: "4",
        category: "Música",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBMuKhNCGFF3QSBbx_RTZBTol1TrK2E-1Th23ICX_HV3BYq2FWem8L4XYVtGMrbehJi7PV3F2sNJd7it1qgD7AIyMl2k-M_FGg4K7HRggYQeMECBCvIjHZbGZ1mK9c5CgcD1CyyOcgjTSJWLVKMcH_Z-ykarBsLxr-4IaGz2rmwZ5TaaHMn8vZKi-OF0xkIm1FQUO-OR2-81_f92RwTxfm8RNoHp96gfYty7t_NpzKY25d_Sb8PJeqG5j4Re4HnZEQclJwPDEA9vHB",
        imageAlt: "club de jazz íntimo con iluminación cálida",
        dateDay: "05",
        dateMonth: "DIC",
        dateYear: "2025",
        title: "Residencia Blue Note",
        venue: "Greenwich Village, NYC",
        price: "$88.00"
    },
    {
        id: "5",
        category: "Deportes",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWgkz8t0W4XBRjcTFqbqQv7kJA9EoXWh5Zw-ExJiNFD8LI_QBROZqRjJ9nbh5C6rhxSPqGhH-MaHz9qZo26yDK-zOVURvtziBvfVBD13oMosS-wyIMmS7rXP1vn4LmIIw2OjeL6nU7UyXMox67qZ9MbFeRutlSBF0zwA6BGvSZRL7WzwvtBTvdWuWM4vagTxLZvQYlAw6z6fUSrw-GDPYLRm7Bytcfe7jEEA2hMzi8b5lI5y4EsbTgAadjSgTq9FGrIjBo349Tv49L",
        imageAlt: "cancha de tenis moderna vista desde arriba",
        dateDay: "12",
        dateMonth: "DIC",
        dateYear: "2025",
        title: "Final Grand Slam Masters",
        venue: "Arena O2, Londres",
        price: "$175.00"
    },
    {
        id: "6",
        category: "Tecnología",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDe-ETsPsZFIjwe00XieRHJ7_vDvZZJG_0So5PUHdq2gH-nqeEyoIjWyuKa_t2VwFjM9mpGDc8U447SR7bVCwsc-fvJyotlUBoOL4fOfbXr4tu8WmszqnbIpcxaaB_PmDa199Hl4FpbPKSTYwN_Y6Aa7frJekAbCxeHWyXlhaWFzusdngT98FWrvP1nAAt18FaeGty13ys0ZrTDEdMfE4FQ33-Fkh6nIQl8FFoW_zJxd18Ity61gk3HWd1DqxCvz9u-LNlvEJDHv60q",
        imageAlt: "rig de iluminación profesional con rayos azules",
        dateDay: "10",
        dateMonth: "ENE",
        dateYear: "2026",
        title: "Cumbre de Ética en IA",
        venue: "Palais des Festivals, Cannes",
        price: "$450.00"
    }
];

export default function DiscoverPage() {
    const [activeCategory, setActiveCategory] = useState("Todos");

    const filtered =
        activeCategory === "Todos"
            ? events
            : events.filter((e) => e.category === activeCategory);

    return (
        <div className="max-w-screen-2xl mx-auto px-8 pb-24">
            {/* Hero editorial — grilla asimétrica */}
            <section className="mb-16 grid grid-cols-12 gap-8 items-end pt-8">
                <div className="col-span-12 lg:col-span-7">
                    <p className="font-headline font-bold text-on-surface-variant tracking-widest uppercase text-xs mb-4">
                        Curación Actual
                    </p>
                    <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter text-primary leading-[0.9]">
                        Momentos Culturales,
                        <br />
                        Medidos en
                        <br />
                        <span className="text-on-primary-container">
                            Excelencia.
                        </span>
                    </h1>
                </div>
                {/* Columna muerta intencional — whitespace editorial */}
                <div className="col-span-12 lg:col-span-4 lg:col-start-9">
                    <p className="text-on-surface-variant text-lg leading-relaxed font-body">
                        Una selección intencional de las experiencias más
                        evocadoras del mundo. Desde jazz underground hasta
                        simposios de arquitectura.
                    </p>
                </div>
            </section>

            {/* Filtros por categoría */}
            <section className="mb-12 flex flex-wrap gap-3">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-8 py-3 rounded-full font-headline font-bold text-sm tracking-tight transition-all ${
                            activeCategory === cat
                                ? "editorial-gradient text-on-primary"
                                : "bg-surface-container-high text-on-surface hover:bg-surface-variant"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </section>

            {/* Grilla de eventos — 3 columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filtered.map((event) => (
                    <EventCard key={event.id} {...event} />
                ))}
            </div>

            {/* Ver más */}
            <div className="mt-20 flex justify-center">
                <button className="bg-surface-container-high text-on-surface px-12 py-4 rounded-full font-headline font-bold text-sm tracking-widest uppercase hover:bg-surface-variant transition-all">
                    Ver Archivo
                </button>
            </div>
        </div>
    );
}
