"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Loader2, Save, Calendar, Target, HelpCircle, Activity, Award, ArrowRight } from "lucide-react";

interface Score {
    id: string;
    value: number;
    score_date: string;
}

export default function ScoresPage() {
    const supabase = createClient();
    const [scores, setScores] = useState<Score[]>([]);
    const [loading, setLoading] = useState(true);
    const [newValue, setNewValue] = useState("");
    const [newDate, setNewDate] = useState(new Date().toISOString().slice(0, 10));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [average, setAverage] = useState<number>(0);
    const [editingId, setEditingId] = useState<string | null>(null);

    async function fetchScores(uid: string) {
        const { data } = await supabase
            .from("scores")
            .select("*")
            .eq("user_id", uid)
            .order("score_date", { ascending: false });

        const fetchedScores = data ?? [];
        setScores(fetchedScores);

        // recalculate simple avg of last 5 for display
        if (fetchedScores.length > 0) {
            const top5 = fetchedScores.slice(0, 5);
            const sum = top5.reduce((a: number, b: any) => a + b.value, 0);
            setAverage(sum / top5.length);
        } else {
            setAverage(0);
        }
    }

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (data.user) {
                setUserId(data.user.id);
                fetchScores(data.user.id).finally(() => setLoading(false));
            }
        });
    }, [supabase]); // eslint-disable-line react-hooks/exhaustive-deps

    async function handleAddScore(e: React.FormEvent) {
        e.preventDefault();
        if (!userId) return;
        setSaving(true);
        setError(null);
        setSuccess(null);

        const scoreInt = parseInt(newValue);
        if (isNaN(scoreInt) || scoreInt < 1 || scoreInt > 45) {
            setError("Score must be a number between 1 and 45.");
            setSaving(false);
            return;
        }

        if (editingId) {
            const { error: updErr } = await supabase.from("scores").update({
                value: scoreInt,
                score_date: newDate
            }).eq("id", editingId);

            if (updErr) {
                if (updErr.code === '23505') setError("You already have a score entered for that date.");
                else setError(updErr.message);
                setSaving(false);
                return;
            }
            setSuccess("Score updated successfully!");
        } else {
            if (scores.length >= 5) {
                const oldest = scores[scores.length - 1];
                await supabase.from("scores").delete().eq("id", oldest.id);
            }

            const { error: insErr } = await supabase.from("scores").insert([
                { user_id: userId, value: scoreInt, score_date: newDate }
            ]);

            if (insErr) {
                if (insErr.code === '23505') setError("You already have a score entered for that date. Edit it instead.");
                else setError(insErr.message);
                setSaving(false);
                return;
            }
            setSuccess("Score logged successfully!");
        }

        setNewValue("");
        setNewDate(new Date().toISOString().slice(0, 10));
        setEditingId(null);
        await fetchScores(userId);
        setTimeout(() => setSuccess(null), 3000);
        setSaving(false);
    }

    function startEdit(score: Score) {
        setEditingId(score.id);
        setNewValue(score.value.toString());
        setNewDate(score.score_date);
        setError(null);
        setSuccess(null);
    }

    function cancelEdit() {
        setEditingId(null);
        setNewValue("");
        setNewDate(new Date().toISOString().slice(0, 10));
        setError(null);
        setSuccess(null);
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this score? This may affect your average.")) return;
        const { error } = await supabase.from("scores").delete().eq("id", id);
        if (error) {
            alert("Error deleting score: " + error.message);
        } else {
            if (userId) await fetchScores(userId);
        }
    }

    if (loading) return <div className="flex-1 min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-brand" /></div>;

    const top5 = scores.slice(0, 5);
    const older = scores.slice(5);

    return (
        <main className="flex-1 bg-background min-h-screen py-24 px-6 md:px-12 font-sans overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-light/40 rounded-full blur-[100px] pointer-events-none -translate-y-1/3 translate-x-1/3" />

            <div className="max-w-[1200px] mx-auto relative z-10">
                <div className="mb-12 border-b border-border pb-8">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-editorial mb-3">
                        Your <span className="italic text-brand">Scores.</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">Record your rounds and build your draw entry profile.</p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Left Column: Form & Stats */}
                    <div className="lg:col-span-5 space-y-8">
                        {/* Add Score Box */}
                        <div className="p-8 rounded-[24px] premium-card">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center">
                                    <Plus className="w-5 h-5 text-brand" />
                                </div>
                                <h2 className="text-xl font-bold text-[#111111]">{editingId ? "Edit Round" : "Log New Round"}</h2>
                            </div>

                            {error && <div className="p-4 rounded-xl bg-[#FCE1E1] text-[#912525] text-sm font-medium mb-6">{error}</div>}
                            {success && <div className="p-4 rounded-xl bg-[#E3F2E8] text-[#1E5631] text-sm font-medium mb-6">{success}</div>}

                            <form onSubmit={handleAddScore} className="space-y-6">
                                <div>
                                    <label className="text-sm font-semibold tracking-tight block mb-2 text-foreground">Date of Round</label>
                                    <input
                                        type="date"
                                        value={newDate}
                                        onChange={e => setNewDate(e.target.value)}
                                        required
                                        className="w-full px-5 py-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all font-medium text-[15px]"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold tracking-tight block mb-2 text-foreground">Stableford Score (1-45)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="1" max="45"
                                            value={newValue}
                                            onChange={e => setNewValue(e.target.value)}
                                            required
                                            placeholder="e.g. 38"
                                            className="w-full px-5 py-4 pr-16 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all font-medium text-[15px] appearance-none"
                                        />
                                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm">pts</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="btn-primary flex-1 flex items-center justify-center disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> {editingId ? "Update Score" : "Save Round"}</>}
                                    </button>
                                    {editingId && (
                                        <button
                                            type="button"
                                            disabled={saving}
                                            onClick={cancelEdit}
                                            className="btn-secondary flex-1 flex items-center justify-center disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                                {!editingId && scores.length >= 5 && (
                                    <p className="text-xs text-muted-foreground text-center mt-4">
                                        You already have 5 scores. Adding a new one will replace your oldest entry ({scores[scores.length - 1]?.score_date}).
                                    </p>
                                )}
                            </form>
                        </div>

                        {/* Quick Stats */}
                        <div className="p-8 premium-card relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
                                <Activity className="w-32 h-32 text-[#111111]" />
                            </div>
                            <div className="relative z-10">
                                <div className="text-[12px] font-bold tracking-widest uppercase text-brand mb-2">Active Average</div>
                                <div className="flex items-baseline gap-2 mb-6">
                                    <span className="text-7xl font-bold text-[#111111]">{average.toFixed(1)}</span>
                                    <span className="font-semibold text-muted-foreground">pts</span>
                                </div>
                                <div className="p-4 bg-[#FAFAFC] subtle-border rounded-[12px] text-sm leading-relaxed text-muted-foreground">
                                    Your active average is automatically calculated from your {top5.length > 0 ? top5.length : "latest"} most recent scores and submitted for the current draw cycle.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Score History */}
                    <div className="lg:col-span-7">
                        <div className="premium-card overflow-hidden h-full">
                            <div className="p-8 border-b subtle-border bg-[#FAFAFC] flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-[#111111]">Score History</h2>
                                    <p className="text-sm text-muted-foreground mt-1">Active scores heavily impact draw logic.</p>
                                </div>
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm subtle-border">
                                    <Target className="w-5 h-5 text-brand" />
                                </div>
                            </div>

                            <div className="p-8 space-y-8 h-[calc(100%-100px)] overflow-y-auto">

                                {scores.length === 0 ? (
                                    <div className="text-center py-20">
                                        <div className="w-16 h-16 bg-[#FAFAFC] rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Calendar className="w-6 h-6 text-muted-foreground" />
                                        </div>
                                        <h3 className="font-bold text-[#111111] text-lg mb-2">No scores recorded</h3>
                                        <p className="text-muted-foreground text-sm">Your scorecard is empty. Log a round to begin.</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Top 5 / Active */}
                                        <div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="w-2 h-2 rounded-full bg-brand"></span>
                                                <span className="text-[12px] font-bold tracking-widest uppercase text-muted-foreground">Active for Draw ({top5.length})</span>
                                            </div>
                                            <div className="grid gap-3">
                                                {top5.map((s, i) => (
                                                    <div key={s.id} className="group flex items-center justify-between p-4 rounded-[12px] border border-brand/20 bg-brand-soft/30 transition-colors">
                                                        <div className="flex items-center gap-5">
                                                            <div className="w-14 h-14 rounded-lg bg-white shadow-sm subtle-border flex items-center justify-center font-bold text-2xl text-brand">
                                                                {s.value}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-[15px] text-[#111111]">{new Date(s.score_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</div>
                                                                <div className="text-xs text-brand font-medium">Included in Current Average</div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                title="Edit score"
                                                                onClick={() => startEdit(s)}
                                                                className="text-xs font-semibold px-3 py-1.5 rounded-md bg-[#FAFAFC] text-muted-foreground hover:bg-[#111111]/5 transition-colors border border-transparent hover:border-[#111111]/10 opacity-0 group-hover:opacity-100"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                title="Delete score"
                                                                onClick={() => handleDelete(s.id)}
                                                                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Older scores */}
                                        {older.length > 0 && (
                                            <div className="mt-8">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className="w-2 h-2 rounded-full bg-[#111111]/20"></span>
                                                    <span className="text-[12px] font-bold tracking-widest uppercase text-muted-foreground">Archived Rounds ({older.length})</span>
                                                </div>
                                                <div className="grid gap-2">
                                                    {older.map((s) => (
                                                        <div key={s.id} className="group flex items-center justify-between p-4 rounded-[12px] border border-transparent hover:border-[#111111]/10 hover:bg-[#FAFAFC] transition-colors">
                                                            <div className="flex items-center gap-5">
                                                                <div className="w-12 h-12 rounded-lg bg-[#FAFAFC] subtle-border flex items-center justify-center font-bold text-[#111111]">
                                                                    {s.value}
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium text-[14px] text-[#111111]">{new Date(s.score_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
                                                                </div>
                                                            </div>
                                                            <button
                                                                title="Delete score"
                                                                onClick={() => handleDelete(s.id)}
                                                                className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sample Draws Section */}
                <div className="mt-12">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-[#111111]">Draw History & Upcoming</h2>
                            <p className="text-sm text-muted-foreground mt-1">Monthly prize pools and your entry status.</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Upcoming Draw */}
                        <div className="bg-brand text-white rounded-2xl p-6 shadow-md relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
                            <div className="flex justify-between items-start mb-4">
                                <span className="px-3 py-1 bg-white/20 text-xs font-bold rounded-full uppercase tracking-widest backdrop-blur-sm">Upcoming</span>
                                <Award className="w-6 h-6 text-white/80" />
                            </div>
                            <h3 className="text-2xl font-bold mb-1">September Draw</h3>
                            <p className="text-white/80 text-sm mb-6">Draws in 8 days</p>

                            <div className="bg-white/10 rounded-xl p-4 mb-4 backdrop-blur-md">
                                <div className="text-xs text-white/70 uppercase tracking-widest font-semibold mb-1">Estimated Jackpot</div>
                                <div className="text-3xl font-bold">₹1,25,000</div>
                            </div>

                            <button className="w-full py-3 bg-white text-brand rounded-xl font-bold text-sm hover:bg-[#F8FAFC] transition-colors flex items-center justify-center gap-2">
                                View Details <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Past Draw 1 */}
                        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <span className="px-3 py-1 bg-[#F1F5F9] text-[#64748B] text-xs font-bold rounded-full uppercase tracking-widest">Completed</span>
                                <Calendar className="w-5 h-5 text-[#94A3B8]" />
                            </div>
                            <h3 className="text-xl font-bold text-[#0F172A] mb-1">August Draw</h3>
                            <p className="text-[#64748B] text-sm mb-6">Drawn on 31 Aug 2026</p>

                            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 mb-4">
                                <div className="text-xs text-[#64748B] uppercase tracking-widest font-semibold mb-1">Winning Number</div>
                                <div className="flex gap-2 font-mono text-lg font-bold text-[#4F46E5]">
                                    <span className="w-8 h-8 rounded bg-white border border-[#C7D2FE] flex items-center justify-center">3</span>
                                    <span className="w-8 h-8 rounded bg-white border border-[#C7D2FE] flex items-center justify-center">1</span>
                                    <span className="w-8 h-8 rounded bg-white border border-[#C7D2FE] flex items-center justify-center">8</span>
                                    <span className="w-8 h-8 rounded bg-white border border-[#C7D2FE] flex items-center justify-center">4</span>
                                    <span className="w-8 h-8 rounded bg-white border border-[#C7D2FE] flex items-center justify-center">5</span>
                                </div>
                            </div>
                            <div className="text-sm font-semibold text-[#10B981] flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
                                You matched 2 numbers
                            </div>
                        </div>

                        {/* Past Draw 2 */}
                        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <span className="px-3 py-1 bg-[#F1F5F9] text-[#64748B] text-xs font-bold rounded-full uppercase tracking-widest">Completed</span>
                                <Calendar className="w-5 h-5 text-[#94A3B8]" />
                            </div>
                            <h3 className="text-xl font-bold text-[#0F172A] mb-1">July Draw</h3>
                            <p className="text-[#64748B] text-sm mb-6">Drawn on 31 Jul 2026</p>

                            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 mb-4">
                                <div className="text-xs text-[#64748B] uppercase tracking-widest font-semibold mb-1">Winning Number</div>
                                <div className="flex gap-2 font-mono text-lg font-bold text-[#4F46E5]">
                                    <span className="w-8 h-8 rounded bg-white border border-[#C7D2FE] flex items-center justify-center">1</span>
                                    <span className="w-8 h-8 rounded bg-white border border-[#C7D2FE] flex items-center justify-center">4</span>
                                    <span className="w-8 h-8 rounded bg-white border border-[#C7D2FE] flex items-center justify-center">9</span>
                                    <span className="w-8 h-8 rounded bg-white border border-[#C7D2FE] flex items-center justify-center">0</span>
                                    <span className="w-8 h-8 rounded bg-white border border-[#C7D2FE] flex items-center justify-center">2</span>
                                </div>
                            </div>
                            <div className="text-sm font-semibold text-[#64748B] flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#E2E8F0]"></div>
                                No numbers matched
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </main>
    );
}
