import { getEvents } from "@/lib/events";
import { EventCard } from "@/components/events/EventCard";

export default async function DiscoverPage() {
    const events = await getEvents();

    return (
        <div className="max-w-screen-2xl mx-auto px-8 pb-24">
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
                <div className="col-span-12 lg:col-span-4 lg:col-start-9">
                    <p className="text-on-surface-variant text-lg leading-relaxed font-body">
                        Una selección intencional de las experiencias más
                        evocadoras del mundo. Desde jazz underground hasta
                        simposios de arquitectura.
                    </p>
                </div>
            </section>

            {events.length === 0 ? (
                <p className="font-body text-on-surface-variant text-center py-24">
                    No hay eventos disponibles en este momento.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {events.map((event) => (
                        <EventCard key={event.id} {...event} />
                    ))}
                </div>
            )}
        </div>
    );
}
