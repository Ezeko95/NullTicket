import Image from "next/image";
import Link from "next/link";

const featuredSide = [
    {
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNI3ysnhIHR5rs3GrOE31BJHHZ4aPg6F17guehI9mb8qV2QmxpnLA2lICdsy0Ig12sopHkxVCgmmRzBgYP2H7EfSVYoQkvlzUqCUKpmm2odPp4dtmaMk5T3px4OqmDcs1ifOEjMX1ol1Q-sLskfWjPYlYJa0JvLH_tOxTWzDOVD2PXYnyJWBK0EJmDQM0pxoUpJU0DamGjoIs7jOKyM9N5yDiXfYT_LnPa7nR0JwWzK1KLB_SaKTbzOvMVCiuHUEQ-K3_jCYABqsHX",
        title: "Serie Orquesta Skyline"
    },
    {
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBlOi45aGeCNhvhNa1bpvRl0MjWh-L345EeEmxnRYgv7xDKTEuFXnwy68a9PzZ3FGPR4Ffd1mDiwC4oS0zdiAQDtrzZsPBgEhxA0MtFig0SpL98Swoe7RXq-qVNigU3KNGnQIEeoJhcLDougFsPoIwhyXIUKbaSTyTg59DpXvnattgo3vZcnch7Fx2RsQny30Zka1stHb5wrsC8Ny2AiKgRNoh39w_jKQblNkovOcewUfMP_sbTgfRHpozyvYya4TY_fsuaCNz80RMv",
        title: "Cumbre de Gastronomía Experimental"
    }
];

const comoFunciona = [
    {
        n: "01",
        title: "Proceso de Selección Élite",
        desc: "Cada organizador debe superar una revisión de 40 puntos antes de que su evento sea considerado para la plataforma."
    },
    {
        n: "02",
        title: "Concierge Sin Fricciones",
        desc: "Nuestro sistema de reserva con un clic gestiona traslados, preferencias de asiento y requerimientos especiales de forma automática."
    },
    {
        n: "03",
        title: "Entradas de Identidad Digital",
        desc: "Activos digitales encriptados que funcionan como tu llave maestra al evento, incluido contenido exclusivo post-evento."
    }
];

export default function LandingPage() {
    return (
        <>
            {/* ── Hero ── */}
            <section className="max-w-screen-2xl mx-auto px-8 mb-32 pt-8">
                <div className="grid grid-cols-12 gap-8 items-end">
                    <div className="col-span-12 lg:col-span-7">
                        <h1
                            className="text-editorial-gradient leading-[0.9] font-black font-headline tracking-tighter mb-8"
                            style={{ fontSize: "clamp(3.5rem, 10vw, 7rem)" }}
                        >
                            Eventos,
                            <br />
                            Curados.
                        </h1>
                        <p className="text-xl md:text-2xl text-on-surface-variant max-w-xl mb-12 font-medium leading-relaxed font-body">
                            Accedé a una selección curada de los momentos
                            culturales más significativos del mundo,
                            simplificada para el asistente exigente.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/discover"
                                className="group relative px-10 py-5 editorial-gradient text-on-primary font-black rounded-xl overflow-hidden transition-all hover:opacity-90 active:scale-95 font-headline flex items-center gap-2"
                            >
                                Explorá Eventos
                                <span className="material-symbols-outlined text-[20px]">
                                    arrow_forward
                                </span>
                            </Link>
                            <button className="px-10 py-5 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-surface-container-highest transition-colors font-headline">
                                Cómo funciona
                            </button>
                        </div>
                    </div>

                    {/* Imagen hero */}
                    <div className="col-span-12 lg:col-span-5 relative">
                        <div className="aspect-4/5 rounded-4xl overflow-hidden shadow-float relative">
                            <Image
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfL_iXOpPOtrv7p_Z_O-GurPdeURfzGK9hcXg9YabguTYAueZQGF63H0Ddp3JZBjbn9w1p5ISIJdrbBPWIQ5WGgMcwp2iyWIlo_nd10WmvioWskA793KItlhbujI0sKzvMuOuRv0upPs8zhdkPsXmThnWKF7FJKej99v5wnS1q-eDMQ5M-MG5X2zYqZl5CFb7bp8PkqTYhZw9rdVtRC2W9v5Gjc0mm-GBRgI34njCAS6gqt7n4TvHcApPVGm6EX6lwkggGUvMUAvO4"
                                alt="iluminación dramática en sala de lujo"
                                fill
                                sizes="(max-width: 1024px) 100vw, 42vw"
                                className="object-cover"
                                priority
                            />
                        </div>
                        {/* Tarjeta flotante */}
                        <div className="absolute -bottom-6 -left-6 bg-surface-container-lowest/80 backdrop-blur-md p-8 rounded-2xl shadow-float border-ghost max-w-60">
                            <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-2 font-label">
                                Próximo Evento Destacado
                            </p>
                            <p className="text-lg font-bold leading-tight font-headline">
                                The Modernist Gala en The Met
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Bento Destacados ── */}
            <section className="bg-surface-container-low py-32 overflow-hidden">
                <div className="max-w-screen-2xl mx-auto px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div>
                            <span className="inline-block px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant text-xs font-black uppercase tracking-widest rounded-full mb-4 font-label">
                                Destacados
                            </span>
                            <h2 className="text-5xl font-black font-headline tracking-tighter">
                                Experiencias Seleccionadas
                            </h2>
                        </div>
                        <Link
                            href="/discover"
                            className="flex items-center gap-2 font-bold text-on-surface border-b-2 border-primary/10 hover:border-primary transition-all pb-1 font-headline"
                        >
                            Ver todos los eventos
                            <span className="material-symbols-outlined text-[18px]">
                                north_east
                            </span>
                        </Link>
                    </div>

                    {/* Bento grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:h-200">
                        {/* Tarjeta principal */}
                        <div className="md:col-span-8 group relative overflow-hidden rounded-[2.5rem] bg-surface-container-lowest">
                            <Image
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAV1PoGDO0_6J3W7I5AmF7SU7cm2npkuE69CfWNA_BxN0U0qWJQlYsK5J9uT9b5vBwEqUpDBFaqibKzPUp8bI91mzrfHRvHafcxlxFeCUQYhb5cHPEUw-zHHHYq_X5floAEqRyAlorgeOzHUULQk8qmxErsOpAdg4OMOd0_VBqjOiQ7hTEjZ3AdyhImgXrrkUNgLtNpzOn0Dn_CyNqpVmGEajCWh4opqo0WAmHsV6_WMYKdwCnD4RfZ4jhHHLZxWMddSN0f-rICsWW2"
                                alt="instalación de arte digital vibrante"
                                fill
                                sizes="(max-width: 768px) 100vw, 66vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-primary/80 via-transparent to-transparent" />
                            <div className="absolute bottom-0 left-0 p-12 w-full">
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="bg-surface-container-lowest/20 backdrop-blur px-4 py-1 rounded-full text-white text-sm font-medium font-body">
                                        24–26 de Octubre
                                    </span>
                                    <span className="text-white/60 text-sm font-medium font-body">
                                        Tokio, Japón
                                    </span>
                                </div>
                                <h3 className="text-white text-5xl font-black mb-6 leading-none font-headline">
                                    The Future Sound
                                    <br />
                                    Visual Arts Festival
                                </h3>
                                <button className="bg-white text-primary px-8 py-4 rounded-xl font-bold transition-transform active:scale-95 hover:bg-primary-fixed font-headline">
                                    Reservar Acceso Privado
                                </button>
                            </div>
                        </div>

                        {/* Grid lateral */}
                        <div className="md:col-span-4 grid grid-rows-2 gap-8">
                            {featuredSide.map(({ image, title }) => (
                                <div
                                    key={title}
                                    className="group relative overflow-hidden rounded-[2.5rem] bg-surface-container-lowest"
                                >
                                    <Image
                                        src={image}
                                        alt={title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                                    <div className="absolute inset-x-8 bottom-8">
                                        <h4 className="text-white text-2xl font-black leading-tight font-headline">
                                            {title}
                                        </h4>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Cómo Funciona ── */}
            <section className="py-32 max-w-screen-2xl mx-auto px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    <div className="lg:col-span-4 lg:sticky lg:top-32">
                        <h2 className="text-4xl font-black font-headline tracking-tighter mb-6">
                            El Estándar del Curador
                        </h2>
                        <p className="text-on-surface-variant text-lg leading-relaxed mb-8 font-body">
                            No listamos cualquier evento. Verificamos, validamos
                            y seleccionamos solo los que cumplen nuestros
                            estándares de producción e impacto cultural.
                        </p>
                        <div className="flex items-center gap-4 text-primary font-black font-headline">
                            <span className="w-12 h-0.5 bg-primary" />
                            NUESTRA PROMESA
                        </div>
                    </div>

                    <div className="lg:col-span-8 space-y-24">
                        {comoFunciona.map(({ n, title, desc }, i) => (
                            <div
                                key={n}
                                className={`flex flex-col md:flex-row gap-12 items-center ${i === 1 ? "lg:ml-24" : ""}`}
                            >
                                <div className="text-[8rem] font-black text-surface-container leading-none tabular-nums font-headline select-none">
                                    {n}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black mb-4 font-headline">
                                        {title}
                                    </h3>
                                    <p className="text-on-surface-variant text-lg font-body">
                                        {desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="max-w-screen-2xl mx-auto px-8 mb-32">
                <div className="bg-primary-container rounded-[3rem] p-16 md:p-24 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#e0e0fa,transparent)] scale-150" />
                    </div>
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-on-primary text-5xl md:text-6xl font-black mb-8 leading-tight tracking-tighter font-headline">
                            Tu próximo recuerdo, curado profesionalmente.
                        </h2>
                        <p className="text-on-primary-container text-xl mb-12 font-body">
                            Unite a más de 50.000 exploradores culturales que
                            acceden antes que nadie a los eventos más exclusivos
                            del mundo.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <input
                                type="email"
                                placeholder="Tu email premium"
                                className="bg-primary border-none rounded-xl px-8 py-5 text-on-primary focus:ring-2 ring-primary-fixed w-full sm:w-80 font-body placeholder:text-on-primary/50 outline-none"
                            />
                            <button className="bg-primary-fixed text-on-primary-fixed px-10 py-5 rounded-xl font-black hover:bg-white transition-colors font-headline">
                                Unirme a la Lista
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Floating Ticket Bar — solo mobile ── */}
            <div className="md:hidden fixed bottom-6 left-6 right-6 z-50">
                <div className="glass-header rounded-2xl p-4 shadow-float border-ghost flex justify-between items-center">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest font-black text-on-surface-variant font-label">
                            Membresía desde
                        </p>
                        <p className="text-xl font-black font-headline">
                            $499 / año
                        </p>
                    </div>
                    <button className="editorial-gradient text-on-primary px-6 py-3 rounded-xl font-black text-sm font-headline">
                        Unirme
                    </button>
                </div>
            </div>
        </>
    );
}
