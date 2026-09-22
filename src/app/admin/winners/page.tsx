"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle, XCircle, Upload, Loader2 } from "lucide-react";

interface WinnerEntry {
    id: string;
    user_id: string;
    tier: string;
    prize_amount: number;
    payment_status: string;
    verification_status: string;
    proof_url: string | null;
    created_at: string;
    draws: { month: string } | null;
    profiles: { email: string } | null;
}

export default function AdminWinnersPage() {
    const supabase = createClient();
    const [entries, setEntries] = useState<WinnerEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);
    const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

    async function fetchEntries() {
        const { data } = await supabase
            .from("draw_entries")
            .select("*, draws(month), profiles(email)")
            .in("verification_status", filter === "all" ? ["pending", "approved", "rejected", "unsubmitted"] : [filter])
            .not("tier", "is", null)
            .order("created_at", { ascending: false });
        setEntries((data as WinnerEntry[]) ?? []);
        setLoading(false);
    }

    useEffect(() => {
        setLoading(true);
        fetchEntries();
    }, [filter]);

    async function handleVerify(entryId: string, action: "approve" | "reject") {
        setProcessing(entryId);
        await fetch("/api/winners/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ entryId, action }),
        });
        await fetchEntries();
        setProcessing(null);
    }

    const TIER_COLORS: Record<string, string> = {
        "5match": "#1E5631",
        "4match": "#4C9A2A",
        "3match": "#76BA1B",
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
                            Verification <span className="italic text-brand">Queue.</span>
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Review proof uploads and approve or reject prize claims.
                        </p>
                    </div>
                </div>

                {/* Filter tabs */}
                <div className="flex flex-wrap gap-2 mb-10 bg-white border border-border p-2 rounded-2xl w-fit premium-shadow shadow-sm">
                    {(["pending", "all", "approved", "rejected"] as const).map((f) => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${filter === f
                                ? "bg-foreground text-background shadow-md"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                }`}>
                            {f}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="bg-white border border-border rounded-3xl p-24 text-center flex justify-center shadow-sm">
                        <Loader2 className="w-10 h-10 animate-spin text-brand" />
                    </div>
                ) : entries.length === 0 ? (
                    <div className="bg-white border border-border border-dashed rounded-3xl p-24 text-center shadow-sm">
                        <CheckCircle className="w-12 h-12 mx-auto opacity-20 mb-4 text-muted-foreground" />
                        <p className="text-lg font-medium text-muted-foreground">No entries matching this filter.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {entries.map((entry) => (
                            <div key={entry.id} className="bg-white border border-border rounded-3xl p-8 hover:border-brand/40 transition-all group relative overflow-hidden premium-shadow">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-light/30 rounded-full blur-[40px] pointer-events-none translate-x-1/2 -translate-y-1/2 group-hover:bg-brand/10 transition-colors" />

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-6 flex-wrap">
                                            <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border inline-block"
                                                style={{
                                                    background: `color-mix(in srgb, ${TIER_COLORS[entry.tier] ?? "var(--tw-colors-brand)"} 10%, transparent)`,
                                                    color: TIER_COLORS[entry.tier] ?? "var(--tw-colors-brand)",
                                                    borderColor: `color-mix(in srgb, ${TIER_COLORS[entry.tier] ?? "var(--tw-colors-brand)"} 20%, transparent)`
                                                }}>
                                                {entry.tier.replace('match', ' Match') /* e.g. "5match" -> "5 Match" */}
                                            </span>
                                            <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border inline-block"
                                                style={{
                                                    background: entry.verification_status === "approved"
                                                        ? "#E3F2E8"
                                                        : entry.verification_status === "rejected"
                                                            ? "#FEE2E2"
                                                            : "#FDF5E6",
                                                    color: entry.verification_status === "approved"
                                                        ? "#1E5631"
                                                        : entry.verification_status === "rejected"
                                                            ? "#991B1B"
                                                            : "#B45309",
                                                    borderColor: entry.verification_status === "approved"
                                                        ? "rgba(30, 86, 49, 0.2)"
                                                        : entry.verification_status === "rejected"
                                                            ? "rgba(153, 27, 27, 0.2)"
                                                            : "rgba(180, 83, 9, 0.2)",
                                                }}>
                                                {entry.verification_status}
                                            </span>
                                        </div>

                                        <div className="grid sm:grid-cols-3 gap-6">
                                            <div>
                                                <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1.5">User Account</p>
                                                <p className="text-sm font-semibold text-foreground truncate" title={entry.profiles?.email}>
                                                    {entry.profiles?.email ?? "Unknown user"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1.5">Draw Month</p>
                                                <p className="text-sm font-semibold text-foreground">
                                                    {entry.draws?.month ?? "—"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold tracking-widest text-brand mb-1.5">Prize Claim</p>
                                                <p className="text-xl font-bold font-serif text-brand">
                                                    ₹{entry.prize_amount?.toLocaleString("en-IN")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap md:flex-col lg:flex-row items-center justify-end gap-3 flex-shrink-0 pt-4 md:pt-0 mt-4 md:mt-0 border-t md:border-t-0 border-border md:pl-8 md:border-l">
                                        {entry.proof_url && (
                                            <a href={entry.proof_url} target="_blank" rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest bg-white text-muted-foreground hover:bg-muted border border-border shadow-sm transition-colors w-full md:w-auto">
                                                <Upload className="w-4 h-4" /> View Proof
                                            </a>
                                        )}
                                        {entry.verification_status === "pending" && (
                                            <>
                                                <button onClick={() => handleVerify(entry.id, "approve")}
                                                    disabled={processing === entry.id}
                                                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all bg-[#E3F2E8]/60 text-[#1E5631] border border-[#1E5631]/20 hover:bg-[#E3F2E8] shadow-sm disabled:opacity-50 w-full md:w-auto">
                                                    {processing === entry.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                                    Approve
                                                </button>
                                                <button onClick={() => handleVerify(entry.id, "reject")}
                                                    disabled={processing === entry.id}
                                                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all bg-[#FEE2E2]/60 text-[#991B1B] border border-[#991B1B]/20 hover:bg-[#FEE2E2] shadow-sm disabled:opacity-50 w-full md:w-auto">
                                                    {processing === entry.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
