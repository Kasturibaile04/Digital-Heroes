"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";

export default function ScoreDropdown({ userId }: { userId: string }) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        const numeric = parseInt(value);
        if (isNaN(numeric) || numeric < 1 || numeric > 45) {
            setError("Score must be between 1 and 45.");
            return;
        }

        setLoading(true);

        // Fetch latest 5 scores - ordered by score_date (actual column name)
        const { data: scores } = await supabase
            .from("scores")
            .select("id")
            .eq("user_id", userId)
            .order("score_date", { ascending: false });

        if (scores && scores.length >= 5) {
            const oldest = scores[scores.length - 1];
            await supabase.from("scores").delete().eq("id", oldest.id);
        }

        // Insert using correct column name: score_date
        const { error: insErr } = await supabase.from("scores").insert([
            { user_id: userId, value: numeric, score_date: date }
        ]);

        if (insErr) {
            if (insErr.code === "23505") setError("You already have a score on this date.");
            else setError(insErr.message);
        } else {
            setSuccess(true);
            setValue("");
            router.refresh();
            setTimeout(() => {
                setOpen(false);
                setSuccess(false);
            }, 1500);
        }
        setLoading(false);
    }

    const inputCls = "w-full px-3 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[14px] text-[#0F172A] focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition-all";

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger */}
            <button
                onClick={() => setOpen(!open)}
                style={{ fontFamily: "var(--font-inter)" }}
                className="flex items-center gap-1.5 bg-[#4F46E5] text-white px-4 py-2 rounded-lg text-[13px] font-semibold hover:bg-[#4338CA] transition-colors shadow-[0_1px_4px_rgba(79,70,229,0.3)]"
            >
                <Plus className="w-3.5 h-3.5" /> Log Score
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-3 w-[300px] bg-white rounded-xl border border-[#E2E8F0] shadow-[0_8px_32px_rgba(15,23,42,0.12)] p-5 z-50">
                    {/* Heading */}
                    <h3 className="font-semibold text-[#0F172A] mb-4 text-[14px]"
                        style={{ fontFamily: "var(--font-manrope)" }}>Quick Log Round</h3>

                    {error && (
                        <div className="p-3 bg-[#FEF2F2] text-[#EF4444] text-[12px] font-medium rounded-lg mb-3 border border-[#FCA5A5]/30"
                            style={{ fontFamily: "var(--font-inter)" }}>
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="p-3 bg-[#ECFDF5] text-[#10B981] text-[12px] font-medium rounded-lg mb-3 border border-[#6EE7B7]/30"
                            style={{ fontFamily: "var(--font-inter)" }}>
                            Score logged successfully!
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-3.5">
                        <div>
                            <label className="text-[11px] font-semibold text-[#64748B] uppercase tracking-[0.07em] block mb-1.5"
                                style={{ fontFamily: "var(--font-inter)" }}>Score (1–45)</label>
                            <input
                                type="number"
                                min="1" max="45"
                                required
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className={inputCls}
                                style={{ fontFamily: "var(--font-inter)" }}
                                placeholder="e.g. 32"
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-semibold text-[#64748B] uppercase tracking-[0.07em] block mb-1.5"
                                style={{ fontFamily: "var(--font-inter)" }}>Date</label>
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className={inputCls}
                                style={{ fontFamily: "var(--font-inter)" }}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || success}
                            style={{ fontFamily: "var(--font-inter)" }}
                            className="w-full bg-[#4F46E5] text-white font-semibold text-[13px] py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-[#4338CA] transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm mt-1"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Score"}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
