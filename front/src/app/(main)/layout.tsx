import { TopAppBar } from "@/components/ui/TopAppBar";
import { Footer } from "@/components/ui/Footer";

export default function MainLayout({
    children
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <TopAppBar />
            <main className="pt-24 min-h-screen">{children}</main>
            <Footer />
        </>
    );
}
