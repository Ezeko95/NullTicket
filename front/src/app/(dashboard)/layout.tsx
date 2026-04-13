import { TopAppBar } from "@/components/ui/TopAppBar";

export default function DashboardLayout({
    children
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <TopAppBar />
            <main className="pt-24 min-h-screen">{children}</main>
        </>
    );
}
