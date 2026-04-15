import { EventCardSkeleton } from "@/components/EventCardSkeleton";

export default function DiscoverLoading() {
    return (
        <div className="max-w-screen-2xl mx-auto px-8 pb-24 pt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <EventCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}
