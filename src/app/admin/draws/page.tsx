"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Plus, Play, Zap, Loader2, CheckCircle } from "lucide-react";

interface Draw {
    id: string;
    month: string;
    status: string;
    draw_numbers: number[] | null;
    jackpot_carryover: number;
    created_at: string;
}

interface SimResult {
    drawNumbers: number[];
    results: { userId: string; matchCount: number; tier: string | null }[];
    prizes: { tier: string | null; winners: string[]; totalTierPool: number; perWinnerAmount: number; rollover: number }[];
    simulate: boolean;
}

export default function AdminDrawsPage() {
    const supabase = createClient();
    const router = useRouter();
    const [draws, setDraws] = useState<Draw[]>([]);
    const [loading, setLoading] = useState(true);
    const [newMonth, setNewMonth] = useState(new Date().toISOString().slice(0, 7));
    const [creating, setCreating] = useState(false);
    const [running, setRunning] = useState<string | null>(null);
    const [simResult, setSimResult] = useState<SimResult | null>(null);

    async function fetchDraws() {
        const { data } = await supabase
            .from("draws")
            .select("*")
            .order("created_at", { ascending: false });
        setDraws(data ?? []);
        setLoading(false);
    }

    useEffect(() => {
        fetchDraws();
    }, []);

    async function createDraw() {
        setCreating(true);
        await supabase.from("draws").insert({ month: newMonth, status: "draft" });
        await fetchDraws();
        setCreating(false);
    }

    async function simulateDraw(drawId: string) {
        setRunning(drawId);
        const res = await fetch("/api/draws/run", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ drawId, simulate: true }),
        });
        const data = await res.json();
        setSimResult(data);
        setRunning(null);
    }

    async function publishDraw(drawId: string) {
        if (!confirm("Publish this draw? This will create prize entries and cannot be undone.")) return;
        setRunning(drawId);
        const res = await fetch("/api/draws/run", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ drawId, simulate: false }),
        });
        const data = await res.json();
        await fetchDraws();
        setSimResult({ ...data, simulate: false });
        setRunning(null);
    }

    if (loading) return <div className="flex-1 min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-brand" /></div>;

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
                            Draw <span className="italic text-brand">Engine.</span>
                        </h1>
                        <p className="text-muted-foreground text-lg">Create draw cycles, preview simulations, and run the real algorithm.</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Create & Simulation */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-border premium-shadow">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
                                    <Plus className="w-5 h-5 text-brand" />
                                </div>
                                <h2 className="text-xl font-serif font-bold">New Draw Cycle</h2>
                            </div>
                            <form onSubmit={(e) => { e.preventDefault(); createDraw(); }} className="space-y-6">
                                <div>
                                    <label className="text-sm font-semibold tracking-tight block mb-2 text-foreground">Month (YYYY-MM)</label>
                                    <input
                                        type="month"
                                        value={newMonth}
                                        onChange={e => setNewMonth(e.target.value)}
                                        required
                                        className="w-full px-5 py-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand font-medium text-[15px]"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="w-full flex items-center justify-center py-4 rounded-xl bg-foreground text-background font-medium hover:bg-brand transition-all hover-lift shadow-lg disabled:opacity-50"
                                >
                                    {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Initialize Draw"}
                                </button>
                            </form>
                        </div>

                        {/* Simulation Output Box */}
                        {simResult && (
                            <div className="bg-brand text-white p-8 rounded-[2.5rem] premium-shadow border border-brand/20 relative overflow-hidden">
                                <h3 className="text-[11px] font-bold tracking-widest text-white/60 uppercase mb-4">
                                    {simResult.simulate ? "Simulation Preview Results" : "Live Draw Executed & Published"}
                                </h3>

                                <div className="mb-6">
                                    <div className="text-sm text-white/80 mb-2">Simulated Draw Numbers:</div>
                                    <div className="flex flex-wrap gap-2">
                                        {simResult.drawNumbers?.map((n, i) => (
                                            <span key={i} className="w-10 h-10 bg-white text-brand rounded-lg flex items-center justify-center font-bold">{n}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {simResult.prizes?.map((tier, i) => (
                                        <div key={i} className="p-4 bg-white/10 rounded-xl border border-white/20">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="font-bold">{tier.tier || "No Tier"}</div>
                                                <div className="text-sm bg-white text-brand px-2 py-0.5 rounded font-bold">{tier.winners?.length ?? 0} Winners</div>
                                            </div>
                                            <div className="text-sm text-white/80 flex justify-between">
                                                <span>Payout: ₹{Math.floor(tier.perWinnerAmount || 0).toLocaleString()}</span>
                                                {(tier.rollover || 0) > 0 && <span className="text-accent underline text-xs">Rollover: ₹{(tier.rollover || 0).toLocaleString()}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Existing Draws */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-[2rem] premium-shadow border border-border h-full">
                            <div className="p-8 border-b border-border bg-muted/20">
                                <h2 className="text-xl font-serif font-bold text-foreground">Draw Lifecycle Management</h2>
                            </div>

                            <div className="p-8 divide-y divide-border">
                                {draws.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">No draws created yet.</div>
                                ) : (
                                    draws.map(draw => (
                                        <div key={draw.id} className="py-6 first:pt-0 last:pb-0">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-2xl font-serif font-bold text-foreground">{draw.month}</h3>
                                                        <span className={`px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase border ${draw.status === "published" ? "bg-[#E3F2E8] text-[#1E5631] border-[#1E5631]/20" :
                                                            draw.status === "processing" ? "bg-accent/10 text-accent border-accent/20" :
                                                                "bg-brand-light text-brand border-brand/20"
                                                            }`}>
                                                            {draw.status}
                                                        </span>
                                                    </div>
                                                </div>

                                                {draw.status === "draft" && (
                                                    <div className="flex flex-wrap gap-2">
                                                        <button
                                                            disabled={running === draw.id}
                                                            onClick={() => simulateDraw(draw.id)}
                                                            className="flex items-center px-4 py-2 bg-muted text-foreground border border-border rounded-lg text-sm font-semibold hover:bg-white hover:border-brand/40 transition-colors disabled:opacity-50 shadow-sm"
                                                        >
                                                            {running === draw.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2 text-accent" />}
                                                            Simulate
                                                        </button>
                                                        <button
                                                            disabled={running === draw.id}
                                                            onClick={() => publishDraw(draw.id)}
                                                            className="flex items-center px-4 py-2 bg-brand text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50"
                                                        >
                                                            {running === draw.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                                                            Execute Draw
                                                        </button>
                                                    </div>
                                                )}
                                                {draw.status === "published" && (
                                                    <div className="flex items-center px-4 py-2 bg-background border border-border rounded-xl text-sm font-bold text-[#1E5631] shadow-sm">
                                                        <CheckCircle className="w-4 h-4 mr-2" /> Draw Published & Locked
                                                    </div>
                                                )}
                                            </div>

                                            {/* Final Draw Numbers */}
                                            {draw.draw_numbers && (
                                                <div className="p-5 bg-muted/40 rounded-xl border border-border flex flex-col md:flex-row md:items-center gap-4">
                                                    <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase flex-shrink-0">Winning Sequence</div>
                                                    <div className="flex gap-2 flex-wrap">
                                                        {draw.draw_numbers.map(n => (
                                                            <div key={n} className="w-8 h-8 rounded bg-white border border-border text-foreground font-bold flex items-center justify-center text-sm shadow-sm ring-1 ring-brand/10">
                                                                {n}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="text-sm font-medium text-muted-foreground md:ml-auto">
                                                        Carryover: <span className="text-foreground font-bold font-serif">₹{draw.jackpot_carryover?.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
