import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Users, Crown } from "lucide-react";

export default async function AdminUsersPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
    if (!profile?.is_admin) redirect("/dashboard");

    const { data: users } = await supabase
        .from("profiles")
        .select("id, email, subscription_status, subscription_plan, is_admin, created_at, charities(name)")
        .order("created_at", { ascending: false });

    const statusColors: Record<string, string> = {
        active: "oklch(0.60 0.08 155)",
        inactive: "oklch(0.50 0.02 155)",
        cancelled: "oklch(0.65 0.12 30)",
    };

    return (
        <main className="flex-1 bg-background pt-24 pb-24 px-6 md:px-12 font-sans relative overflow-hidden min-h-screen">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-light/20 rounded-full blur-[100px] pointer-events-none -translate-y-1/3 translate-x-1/3" />

            <div className="max-w-[1200px] mx-auto relative z-10">
                <div className="mb-12 border-b border-border pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-light border border-brand/20 mb-4">
                            <span className="text-[10px] font-bold tracking-widest uppercase text-brand">Admin Module</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-editorial mb-3">
                            Platform <span className="italic text-brand">Members.</span>
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            {users?.length ?? 0} registered platform members
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] premium-shadow border border-border overflow-hidden h-full">
                    <div className="p-8 border-b border-border bg-muted/20">
                        <h2 className="text-xl font-serif font-bold text-foreground">User Database Directory</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="border-b border-border bg-muted/40">
                                    {["Account", "Status", "Plan Tier", "Supported Charity", "Role", "Joined Date"].map((h) => (
                                        <th key={h} className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {users?.map((u) => (
                                    <tr key={u.id} className="hover:bg-muted/30 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-brand-light/50 flex items-center justify-center flex-shrink-0 border border-brand/20 shadow-sm group-hover:bg-brand-light transition-colors">
                                                    <Users className="w-4 h-4 text-brand" />
                                                </div>
                                                <span className="font-semibold text-foreground">{u.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border inline-block"
                                                style={{
                                                    background: u.subscription_status === "active" ? "#E3F2E8" :
                                                        u.subscription_status === "inactive" ? "#F1F5F9" :
                                                            "#FEE2E2",
                                                    color: u.subscription_status === "active" ? "#1E5631" :
                                                        u.subscription_status === "inactive" ? "#64748B" :
                                                            "#991B1B",
                                                    borderColor: u.subscription_status === "active" ? "rgba(30, 86, 49, 0.2)" :
                                                        u.subscription_status === "inactive" ? "rgba(100, 116, 139, 0.2)" :
                                                            "rgba(153, 27, 27, 0.2)"
                                                }}>
                                                {u.subscription_status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 font-bold uppercase tracking-widest text-xs text-brand">
                                            {u.subscription_plan ?? "—"}
                                        </td>
                                        <td className="px-6 py-5 font-medium text-muted-foreground">
                                            {(u.charities as { name: string }[] | null)?.[0]?.name ?? "—"}
                                        </td>
                                        <td className="px-6 py-5">
                                            {u.is_admin ? (
                                                <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-accent bg-accent/10 px-2.5 py-1 rounded-lg border border-accent/20 w-fit">
                                                    <Crown className="w-3 h-3" /> Admin
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground/30 font-bold">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 text-sm font-medium text-muted-foreground">
                                            {new Date(u.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}
