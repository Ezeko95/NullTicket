export default function HistoryLoading() {
    return (
        <div className="max-w-screen-2xl mx-auto px-8 pb-24 pt-8">
            <div className="mb-16">
                <div className="h-3 w-24 bg-surface-container rounded animate-pulse mb-3" />
                <div className="h-20 w-64 bg-surface-container rounded animate-pulse" />
            </div>

            <section className="mb-20">
                <div className="h-8 w-32 bg-surface-container rounded animate-pulse mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-48 rounded-2xl bg-surface-container animate-pulse"
                        />
                    ))}
                </div>
            </section>

            <section>
                <div className="h-8 w-48 bg-surface-container rounded animate-pulse mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-24 rounded-2xl bg-surface-container animate-pulse"
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}
