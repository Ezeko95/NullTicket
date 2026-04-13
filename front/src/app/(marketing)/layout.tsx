import { TopAppBar } from "@/components/ui/TopAppBar";
import { Footer } from "@/components/ui/Footer";

export default function MarketingLayout({
    children
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <TopAppBar variant="marketing" />
            <main className="pt-24 min-h-screen">{children}</main>
            <Footer />
        </>
    );
}
