export function EventCardSkeleton() {
    return (
        <div className="group flex flex-col space-y-4 animate-pulse">
            {/* Imagen */}
            <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-gray-200" />

            <div className="flex items-start gap-4">
                {/* Fecha */}
                <div className="border-l-4 border-gray-200 pl-4 shrink-0 space-y-2">
                    <div className="h-5 w-10 bg-gray-200 rounded" />
                    <div className="h-3 w-8 bg-gray-200 rounded" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-2">
                    <div className="h-5 w-3/4 bg-gray-200 rounded" />
                    <div className="h-4 w-1/2 bg-gray-200 rounded" />
                    <div className="h-3 w-1/3 bg-gray-200 rounded" />
                    <div className="flex justify-between items-center pt-2">
                        <div className="h-6 w-24 bg-gray-200 rounded" />
                        <div className="h-8 w-28 bg-gray-200 rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
}
