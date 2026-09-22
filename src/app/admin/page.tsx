import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Heart, Trophy, TrendingUp, ArrowRight, ShieldCheck, Activity } from "lucide-react";

export default async function AdminPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
    if (!profile?.is_admin) redirect("/dashboard");

    const [
        { count: totalUsers },
        { count: activeUsers },
        { count: totalCharities },
        { count: pendingWinners },
        { data: recentDraw },
    ] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("subscription_status", "active"),
        supabase.from("charities").select("id", { count: "exact", head: true }),
        supabase.from("draw_entries").select("id", { count: "exact", head: true }).eq("verification_status", "pending"),
        supabase.from("draws").select("month, status, draw_numbers").order("created_at", { ascending: false }).limit(1),
    ]);

    const prizePool = (activeUsers ?? 0) * 50;

    const kpis = [
        { label: "Total Users", value: String(totalUsers ?? 0), icon: Users, href: "/admin/users", highlight: false },
        { label: "Active Subs", value: String(activeUsers ?? 0), icon: TrendingUp, href: "/admin/users", highlight: false },
        { label: "Est. Prize Pool", value: `₹${prizePool.toLocaleString("en-IN")}`, icon: Trophy, href: "/admin/draws", highlight: true },
        { label: "Charities", value: String(totalCharities ?? 0), icon: Heart, href: "/admin/charities", highlight: false },
        { label: "Pending Verifications", value: String(pendingWinners ?? 0), icon: ShieldCheck, href: "/admin/winners", highlight: false },
    ];

    const adminLinks = [
        { href: "/admin/users", label: "User Management", icon: Users, desc: "Search, view, and manage subscriptions" },
        { href: "/admin/draws", label: "Draw Engine", icon: Trophy, desc: "Run algorithm and view results" },
        { href: "/admin/charities", label: "Charities", icon: Heart, desc: "Manage causes and featured charity" },
        { href: "/admin/winners", label: "Verifications", icon: ShieldCheck, desc: "Process proofs and confirm payouts" },
    ];

    return (
        <main className="flex-1 bg-[#F8FAFC] pt-24 pb-24 px-6 md:px-10 font-sans min-h-screen text-[#0F172A]">
            <div className="max-w-[1200px] mx-auto">
                <div className="mb-10 border-b border-[#E2E8F0] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-5">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] mb-4">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#4F46E5]" />
                            <span className="text-[11px] font-semibold tracking-widest uppercase text-[#4F46E5]">Admin Console</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-[#0F172A] tracking-tight mb-2"
                            style={{ fontFamily: "var(--font-manrope)" }}>
                            Platform <span className="text-[#4F46E5]">Overview.</span>
                        </h1>
                        <p className="text-[#64748B] text-[15px]" style={{ fontFamily: "var(--font-inter)" }}>System metrics and management modules.</p>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-9">
                    {kpis.map((kpi, idx) => (
                        <Link key={idx} href={kpi.href}
                            className={`p-5 rounded-xl border transition-all duration-200 group hover:-translate-y-0.5 ${kpi.highlight
                                ? "bg-[#4F46E5] text-white border-[#4338CA] shadow-[0_4px_16px_rgba(79,70,229,0.25)]"
                                : "bg-white border-[#E2E8F0] hover:border-[#C7D2FE] hover:shadow-[0_4px_16px_rgba(79,70,229,0.06)]"
                                }`}>
                            <div className="flex items-center gap-2.5 mb-3">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${kpi.highlight ? "bg-white/15" : "bg-[#EEF2FF]"}`}>
                                    <kpi.icon className={`w-4.5 h-4.5 ${kpi.highlight ? "text-white" : "text-[#4F46E5]"}`} />
                                </div>
                            </div>
                            <div className={`text-[11px] font-semibold tracking-widest uppercase mb-1 ${kpi.highlight ? "text-white/70" : "text-[#94A3B8]"}`}
                                style={{ fontFamily: "var(--font-inter)" }}>{kpi.label}</div>
                            <div className={`text-2xl font-bold tracking-tight ${kpi.highlight ? "text-white" : "text-[#0F172A]"}`}
                                style={{ fontFamily: "var(--font-manrope)" }}>{kpi.value}</div>
                        </Link>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Management modules */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm">
                            <div className="px-7 py-5 border-b border-[#E2E8F0]">
                                <h2 className="text-[16px] font-bold text-[#0F172A] tracking-tight"
                                    style={{ fontFamily: "var(--font-manrope)" }}>Management Modules</h2>
                                <p className="text-[13px] text-[#64748B] mt-0.5"
                                    style={{ fontFamily: "var(--font-inter)" }}>Access core system controls.</p>
                            </div>
                            <div className="p-4 grid sm:grid-cols-2 gap-2">
                                {adminLinks.map((link) => (
                                    <Link key={link.href} href={link.href} className="flex p-4 rounded-xl border border-transparent hover:bg-[#F8FAFC] hover:border-[#E2E8F0] transition-all group">
                                        <div className="w-10 h-10 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex items-center justify-center mr-4 group-hover:bg-[#EEF2FF] group-hover:border-[#C7D2FE] transition-all flex-shrink-0">
                                            <link.icon className="w-5 h-5 text-[#4F46E5]" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-[14px] mb-0.5 text-[#0F172A] flex items-center gap-2"
                                                style={{ fontFamily: "var(--font-manrope)" }}>
                                                {link.label}
                                                <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#4F46E5]" />
                                            </div>
                                            <div className="text-[13px] text-[#64748B]" style={{ fontFamily: "var(--font-inter)" }}>{link.desc}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Latest draw */}
                    <div className="lg:col-span-1">
                        <div className="rounded-2xl border border-[#E2E8F0] p-7 h-full relative overflow-hidden" style={{ background: "linear-gradient(140deg, #4F46E5 0%, #7C3AED 100%)" }}>
                            <div className="absolute top-0 right-0 p-5 opacity-[0.08]">
                                <Activity className="w-28 h-28 text-white" />
                            </div>
                            <div className="relative z-10 w-full h-full flex flex-col">
                                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-5">
                                    <Trophy className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-[17px] font-bold text-white mb-1.5"
                                    style={{ fontFamily: "var(--font-manrope)" }}>Latest Draw Status</h3>

                                {recentDraw && recentDraw.length > 0 ? (
                                    <div className="mt-5 flex-1">
                                        <div className="text-3xl font-bold text-white mb-2 tracking-tight"
                                            style={{ fontFamily: "var(--font-manrope)" }}>{recentDraw[0].month}</div>
                                        <div className="inline-flex px-2.5 py-1 bg-white/20 text-white text-[10px] font-bold tracking-widest uppercase rounded-lg border border-white/20"
                                            style={{ fontFamily: "var(--font-inter)" }}>
                                            {recentDraw[0].status}
                                        </div>

                                        <div className="mt-7">
                                            <div className="text-[10px] font-semibold tracking-widest uppercase text-white/50 mb-2.5">Winning Numbers</div>
                                            <div className="flex gap-2 flex-wrap">
                                                {recentDraw[0].draw_numbers ? (recentDraw[0].draw_numbers as number[]).map((n) => (
                                                    <span key={n} className="w-8 h-8 rounded-lg bg-white/20 border border-white/25 flex items-center justify-center font-bold text-[13px] text-white">
                                                        {n}
                                                    </span>
                                                )) : (
                                                    <span className="text-[13px] text-white/60 italic">None generated</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-5 text-white/60 text-[14px]">No draws run in the system yet.</div>
                                )}

                                <Link href="/admin/draws" className="mt-8 w-full py-3 bg-white text-[#4F46E5] rounded-xl font-semibold text-[14px] text-center block hover:bg-[#EEF2FF] transition-colors shadow-sm"
                                    style={{ fontFamily: "var(--font-inter)" }}>
                                    Manage Draws
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
