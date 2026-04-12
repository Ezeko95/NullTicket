import Image from "next/image";
import Link from "next/link";

interface EventCardProps {
    id: string;
    category: string;
    image: string;
    imageAlt: string;
    dateDay: string;
    dateMonth: string;
    dateYear: string;
    title: string;
    venue: string;
    price: string;
}

export function EventCard({
    id,
    category,
    image,
    imageAlt,
    dateDay,
    dateMonth,
    dateYear,
    title,
    venue,
    price
}: EventCardProps) {
    return (
        <div className="group flex flex-col space-y-4">
            {/* Image — 4:5 aspect ratio, no border */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-surface-container">
                <Image
                    src={image}
                    alt={imageAlt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* Category badge — glassmorphism */}
                <div className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur-md px-4 py-2 rounded-lg">
                    <span className="font-headline font-bold text-primary text-xs tracking-tighter uppercase">
                        {category}
                    </span>
                </div>
            </div>

            {/* Info — no dividers, whitespace does the work */}
            <div className="flex items-start gap-4">
                {/* Tabbed date — editorial signature */}
                <div className="border-l-4 border-primary-fixed pl-4 shrink-0">
                    <p className="font-headline font-bold text-primary text-xl leading-tight">
                        {dateMonth} {dateDay}
                    </p>
                    <p className="font-label text-xs text-on-surface-variant uppercase tracking-widest">
                        {dateYear}
                    </p>
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-headline text-xl font-extrabold text-primary leading-tight tracking-tight mb-1">
                        {title}
                    </h3>
                    <p className="font-body text-sm text-on-surface-variant mb-4 truncate">
                        {venue}
                    </p>
                    <div className="flex justify-between items-center">
                        <span className="font-headline font-extrabold text-xl text-primary">
                            {price}
                        </span>
                        <Link
                            href={`/events/${id}`}
                            className="editorial-gradient text-on-primary px-5 py-2 rounded-lg font-headline font-bold text-sm tracking-tight transition-transform active:scale-95 hover:opacity-90"
                        >
                            Ver Entradas
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
