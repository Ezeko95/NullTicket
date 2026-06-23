import { redirect } from "next/navigation";
import { CreateEventForm } from "@/components/admin/CreateEventForm";
import { getAdminSession } from "@/lib/admin-session";

export default async function NewAdminEventPage() {
    const adminSession = await getAdminSession();

    if (!adminSession) {
        redirect("/admin/login?redirect=/admin/events/new");
    }

    return (
        <section className="pb-12">
            <div className="mb-8">
                <p className="text-xs font-black uppercase tracking-widest text-primary font-label">
                    Backoffice editorial
                </p>
                <h1 className="mt-3 text-3xl font-black tracking-tighter text-on-surface font-headline">
                    Alta de eventos
                </h1>
            </div>

            <CreateEventForm adminEmail={adminSession.email} />
        </section>
    );
}
