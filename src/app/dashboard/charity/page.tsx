"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Heart, Search, Loader2, Check, RefreshCw } from "lucide-react";

interface Charity {
    id: string;
    name: string;
    description: string;
}

interface UserAllocation {
    id: string;
    pct: number;
}

export default function CharitySelectionPage() {
    const supabase = createClient();
    const [charities, setCharities] = useState<Charity[]>([]);
    const [search, setSearch] = useState("");

    // The actively viewed/configured charity in the right panel
    const [selected, setSelected] = useState<string | null>(null);
    const [pct, setPct] = useState(10);

    const [activeAllocations, setActiveAllocations] = useState<UserAllocation[]>([]);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(async ({ data }) => {
            if (data.user) {
                setUserId(data.user.id);
                const [characterResponse, profileResponse] = await Promise.all([
                    supabase.from("charities").select("id, name, description").order("name"),
                    // Hack to store array in text column without schema change for UI purposes.
                    supabase.from("profiles").select("charity_id, charity_pct, razorpay_customer_id").eq("id", data.user.id).single(),
                ]);

                setCharities(characterResponse.data ?? []);
                const prof = profileResponse.data;

                if (prof) {
                    setSelected(prof.charity_id);
                    setPct(prof.charity_pct ?? 10);

                    try {
                        if (prof.razorpay_customer_id && prof.razorpay_customer_id.startsWith("[")) {
                            setActiveAllocations(JSON.parse(prof.razorpay_customer_id));
                        } else if (prof.charity_id) {
                            setActiveAllocations([{ id: prof.charity_id, pct: prof.charity_pct ?? 10 }]);
                        }
                    } catch (e) {
                        if (prof.charity_id) setActiveAllocations([{ id: prof.charity_id, pct: prof.charity_pct ?? 10 }]);
                    }
                }
            }
        });
    }, [supabase]);

    const filtered = charities.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.description?.toLowerCase().includes(search.toLowerCase())
    );

    async function handleAddOrUpdate() {
        if (!userId || !selected) return;
        setSaving(true);
        setSuccess(false);

        let newAllocs = [...activeAllocations];
        const existingIndex = newAllocs.findIndex(a => a.id === selected);
        if (existingIndex > -1) {
            newAllocs[existingIndex].pct = pct;
        } else {
            newAllocs.push({ id: selected, pct });
        }

        setActiveAllocations(newAllocs);

        await supabase
            .from("profiles")
            .update({
                // Keep the primary one as the first for simple queries elsewhere
                charity_id: newAllocs[0].id,
                charity_pct: newAllocs[0].pct,
                razorpay_customer_id: JSON.stringify(newAllocs)
            })
            .eq("id", userId);

        setSaving(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    }

    return (
        <main className="flex-1 bg-[#F8FAFC] pt-28 pb-20 px-6 font-sans min-h-screen text-[#0F172A]">
            <div className="max-w-4xl mx-auto">
                <div className="mb-10 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF2F2] border border-red-100 mb-5">
                        <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                        <span className="text-[11px] font-semibold tracking-widest uppercase text-red-500">My Supports</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-3 text-[#0F172A] tracking-tight leading-tight">
                        Your <span className="text-[#4F46E5]">Supports.</span>
                    </h1>
                    <p className="text-[#64748B] text-[15px] leading-relaxed">
                        View and manage the multiple causes your membership actively supports each month.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-start">
                    {/* Active Allocations List */}
                    <div className="space-y-4">
                        <h2 className="text-[14px] font-bold tracking-[0.06em] uppercase text-[#64748B]">Actively Supporting</h2>

                        {activeAllocations.length > 0 ? (
                            activeAllocations.map((alloc) => {
                                const c = charities.find(char => char.id === alloc.id);
                                if (!c) return null;
                                return (
                                    <div key={c.id} className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_8px_30px_rgba(79,70,229,0.06)] p-6 relative overflow-hidden group mb-4">
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#4F46E5]" />
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-full bg-[#EEF2FF] flex items-center justify-center flex-shrink-0">
                                                <Heart className="w-5 h-5 text-[#4F46E5] fill-[#4F46E5]" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-[18px] text-[#0F172A] mb-1.5 uppercase font-mono tracking-tight">{c.name}</h3>
                                                <p className="text-[13px] text-[#64748B] leading-relaxed">{c.description}</p>
                                            </div>
                                        </div>
                                        <div className="mt-6 pt-5 border-t border-[#F1F5F9] flex justify-between items-center">
                                            <div className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-widest">Current allocation</div>
                                            <div className="text-[#4F46E5] font-bold text-lg">{alloc.pct}%</div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="bg-white rounded-2xl border-2 border-dashed border-[#E2E8F0] p-10 flex flex-col items-center justify-center text-center">
                                <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-4">
                                    <Heart className="w-5 h-5 text-[#94A3B8]" />
                                </div>
                                <h3 className="font-bold text-[16px] text-[#0F172A] mb-1">No Cause Selected</h3>
                                <p className="text-[13px] text-[#64748B]">Please select charities from the list to start supporting.</p>
                            </div>
                        )}
                    </div>

                    {/* Add/change sections */}
                    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm divide-y divide-[#E2E8F0]">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold text-[14px] text-[#0F172A]">Set New Allocation</span>
                                </div>
                                <span className="text-[#4F46E5] font-bold text-xl">{pct}%</span>
                            </div>
                            <input
                                type="range"
                                min={5}
                                max={100}
                                value={pct}
                                onChange={(e) => setPct(Number(e.target.value))}
                                className="w-full h-1.5 bg-[#E2E8F0] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#4F46E5] [&::-webkit-slider-thumb]:shadow-sm"
                                style={{ accentColor: "#4F46E5" }}
                            />
                            <div className="flex justify-between text-[11px] mt-2 text-[#94A3B8] font-semibold uppercase tracking-widest">
                                <span>5% Min</span>
                                <span>100% Max</span>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="p-6">
                            <h2 className="text-[14px] font-bold tracking-[0.06em] uppercase text-[#64748B] mb-4">Select Charity To Add</h2>
                            <div className="relative mb-4">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Find a cause to support…"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl text-[14px] font-medium outline-none transition-all bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] focus:border-[#4F46E5] focus:ring-3 focus:ring-[#4F46E5]/10 placeholder:text-[#CBD5E1]"
                                />
                            </div>

                            {/* Charity list */}
                            <div className="flex flex-col gap-2.5 max-h-[320px] overflow-y-auto pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "#E2E8F0 transparent" }}>
                                {filtered.length === 0 ? (
                                    <div className="text-center py-10 text-[#94A3B8] text-[14px]">
                                        No charities match your search.
                                    </div>
                                ) : (
                                    filtered.map((c) => (
                                        <button key={c.id} onClick={() => setSelected(c.id)}
                                            className={`w-full text-left p-4 rounded-xl transition-all flex items-start gap-3 border ${selected === c.id
                                                ? "bg-[#EEF2FF] border-[#4F46E5]"
                                                : "bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#C7D2FE]"
                                                }`}>
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${selected === c.id ? "border-[#4F46E5] bg-[#4F46E5]" : "border-[#CBD5E1]"}`}>
                                                {selected === c.id && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className={`text-[14px] font-semibold mb-1 ${selected === c.id ? "text-[#4F46E5]" : "text-[#0F172A]"}`}>{c.name}</div>
                                                <div className="text-[12px] line-clamp-2 text-[#64748B] leading-relaxed">
                                                    {c.description}
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Save button */}
                        <div className="p-6">
                            <button onClick={handleAddOrUpdate} disabled={!selected || saving}
                                className={`w-full py-3.5 rounded-xl font-semibold text-[14px] transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed ${success
                                    ? "bg-[#D1FAE5] text-[#065F46] border border-[#6EE7B7]"
                                    : "bg-[#4F46E5] text-white hover:bg-[#4338CA] shadow-[0_2px_12px_rgba(79,70,229,0.25)] hover:shadow-[0_4px_20px_rgba(79,70,229,0.35)]"
                                    }`}>
                                {saving ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : success ? <Check className="w-4.5 h-4.5" /> : <RefreshCw className="w-4 h-4" />}
                                {saving ? "Saving…" : success ? "Added to your Causes!" : "Add to Supported list"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
