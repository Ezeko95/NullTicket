export default function EventLoading() {
    return (
        <div className="max-w-screen-2xl mx-auto px-8 pb-24">
            <div className="pt-8 mb-8">
                <div className="h-4 w-32 bg-surface-container rounded animate-pulse" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-5">
                    <div className="aspect-4/5 rounded-xl bg-surface-container animate-pulse" />
                </div>
                <div className="lg:col-span-7 flex flex-col gap-4">
                    <div className="h-8 w-48 bg-surface-container rounded animate-pulse" />
                    <div className="h-12 w-3/4 bg-surface-container rounded animate-pulse" />
                    <div className="h-5 w-1/2 bg-surface-container rounded animate-pulse" />
                    <div className="flex flex-col gap-3 mt-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-20 rounded-xl bg-surface-container animate-pulse"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
