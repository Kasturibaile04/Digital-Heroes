"use client";

import Link from "next/link";
import {
    Heart, Trophy, TrendingUp, Calendar, ArrowRight, Star, Plus,
    Activity, ChevronRight, Award, Flame, CheckCircle, Gift
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

function AnimatedNumber({ value }: { value: number | string }) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (typeof value === "string") return;
        let start = 0;
        const duration = 1200;
        const stepTime = 16;
        const frames = duration / stepTime;
        const step = value / frames;

        const interval = setInterval(() => {
            start += step;
            if (start >= value) {
                setDisplay(value);
                clearInterval(interval);
            } else {
                setDisplay(start);
            }
        }, stepTime);
        return () => clearInterval(interval);
    }, [value]);

    if (typeof value === "string") return <>{value}</>;

    const isFloat = value % 1 !== 0;
    return <>{isFloat ? display.toFixed(1) : Math.floor(display).toLocaleString("en-IN")}</>;
}

interface Props {
    user?: any;
    profile: any;
    scores: any[];
    drawEntries: any[];
    charities: any[];
}

export default function DashboardClient({ user, profile, scores, drawEntries, charities }: Props) {
    const isActive = profile?.subscription_status === "active";
    const userName = user?.user_metadata?.full_name || "Hero";

    // 1. Rolling Average
    const avgScoreRaw = scores.length > 0
        ? (scores.reduce((s, sc) => s + sc.value, 0) / scores.length)
        : null;

    const bestScoreRaw = scores.length > 0 ? Math.max(...scores.map(s => s.value)) : null;

    // Recharts Data prep
    const chartData = [...scores].reverse().map(sc => ({
        date: new Date(sc.score_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
        score: sc.value
    }));

    const primaryCharity = charities && charities.length > 0 ? charities[0] : null;

    return (
        <main className="flex-1 bg-[#FAFAFC] font-sans text-[#171827] min-h-screen">
            <div className="max-w-[1300px] mx-auto px-6 md:px-10 pt-16 pb-32">

                {/* 1. HERO / WELCOME SECTION */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-[32px] md:text-[44px] font-[750] tracking-tight mb-2 text-[#171827] leading-tight" style={{ fontFamily: "var(--font-manrope)" }}>
                            Welcome back, Hero <span className="inline-block hover:animate-wave origin-bottom-right cursor-default">👋</span>
                        </h1>
                        <p className="text-[#6F7182] text-[17px] max-w-2xl font-medium" style={{ fontFamily: "var(--font-inter)" }}>
                            Overview of your performance and charitable impact.
                        </p>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-4">
                        {scores.length > 0 && (
                            <div className="hidden sm:flex items-center gap-2 px-4 py-3 bg-[rgba(67,169,130,0.08)] rounded-full text-[13px] font-[700] text-[#43A982] shadow-sm">
                                <div className="w-2 h-2 rounded-full bg-[#43A982]" /> On track this month
                            </div>
                        )}
                        <Link href="/dashboard/scores" className="px-7 py-4 bg-[#6F8FEF] hover:bg-[#5C7CE0] text-white rounded-full text-[14px] font-[600] flex items-center justify-center gap-2 transition-all shadow-[0_8px_20px_rgba(111,143,239,0.25)] hover:-translate-y-[2px]" style={{ fontFamily: "var(--font-inter)" }}>
                            <Plus className="w-4.5 h-4.5" /> Log Score
                        </Link>
                    </div>
                </div>

                {/* 2. TOP PERFORMANCE BENTO */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
                    {/* Primary KPI - Rolling Average */}
                    <div className="md:col-span-5 bg-[#FFFFFF] border border-[rgba(30,30,50,0.06)] p-8 rounded-[32px] shadow-[0_12px_40px_rgba(30,40,90,0.03)] hover:-translate-y-[4px] hover:shadow-[0_16px_48px_rgba(30,40,90,0.06)] transition-all duration-400 flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-80 h-80 bg-[#A9DDF2]/20 rounded-full blur-[80px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <span className="text-[12px] font-[700] text-[#6F7182] uppercase tracking-[0.08em]">Rolling Average</span>
                            <div className="w-10 h-10 rounded-xl bg-[#F0F5FF] text-[#6F8FEF] flex items-center justify-center group-hover:bg-[#E4EEFF] transition-colors">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <div className="text-[64px] font-[750] leading-none mb-3 tracking-[-0.03em] text-[#171827]" style={{ fontFamily: "var(--font-manrope)" }}>
                                {avgScoreRaw !== null ? <AnimatedNumber value={avgScoreRaw} /> : "—"}
                            </div>
                            <div className="text-[15px] text-[#6F7182] font-medium">Based on {scores.length} recent rounds</div>
                        </div>
                    </div>

                    {/* Secondary - Tier (Gold Atmosphere) */}
                    <Link href="/pricing" className="md:col-span-3 bg-[rgba(217,164,65,0.02)] border border-[rgba(217,164,65,0.15)] p-8 rounded-[32px] shadow-[0_4px_24px_rgba(30,40,90,0.02)] hover:shadow-[0_12px_32px_rgba(217,164,65,0.08)] hover:-translate-y-[4px] transition-all duration-400 flex flex-col justify-between relative group overflow-hidden">
                        <div className="absolute bottom-0 right-0 w-40 h-40 bg-[rgba(217,164,65,0.1)] rounded-full blur-[40px] pointer-events-none translate-x-1/3 translate-y-1/3" />
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <span className="text-[12px] font-[700] text-[#6F7182] uppercase tracking-[0.08em]">Membership Tier</span>
                            <div className="w-10 h-10 rounded-xl bg-[#FFFDF7] border border-[rgba(217,164,65,0.1)] text-[#D9A441] flex items-center justify-center group-hover:scale-105 transition-transform">
                                <Star className="w-5 h-5 fill-current" />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <div className="text-[36px] font-[750] text-[#171827] leading-none mb-2 tracking-tight" style={{ fontFamily: "var(--font-manrope)" }}>{isActive ? profile.plan?.charAt(0).toUpperCase() + profile.plan?.slice(1) : "None"}</div>
                            <div className="text-[14px] text-[#6F7182] font-medium group-hover:text-[#D9A441] transition-colors flex items-center gap-1">{isActive ? "Active Plan" : "Upgrade Plan"} <ArrowRight className="w-3.5 h-3.5" /></div>
                        </div>
                    </Link>

                    {/* Secondary - Next Draw (Green Atmosphere) */}
                    <Link href="/dashboard/scores" className="md:col-span-4 bg-[rgba(67,169,130,0.02)] border border-[rgba(67,169,130,0.15)] p-8 rounded-[32px] shadow-[0_4px_24px_rgba(30,40,90,0.02)] hover:shadow-[0_12px_32px_rgba(67,169,130,0.08)] hover:-translate-y-[4px] transition-all duration-400 flex flex-col justify-between group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-[rgba(67,169,130,0.1)] rounded-full blur-[40px] pointer-events-none translate-x-1/3 -translate-y-1/3" />

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <span className="text-[12px] font-[700] text-[#6F7182] uppercase tracking-[0.08em]">Next Prize Draw</span>
                            <div className="w-10 h-10 rounded-xl bg-[#F7FCF9] border border-[rgba(67,169,130,0.1)] text-[#43A982] flex items-center justify-center group-hover:scale-105 transition-transform">
                                <Calendar className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <div className="text-[36px] font-[750] text-[#171827] leading-none mb-3 tracking-tight" style={{ fontFamily: "var(--font-manrope)" }}>Coming soon</div>
                            {isActive && scores.length > 0 ? (
                                <div className="flex items-center gap-1.5 text-[14px] font-[700] text-[#43A982]">
                                    <CheckCircle className="w-4 h-4" /> Qualified for entry
                                </div>
                            ) : (
                                <div className="text-[14px] text-[#6F7182] font-medium flex items-center gap-1 group-hover:text-[#171827] transition-colors">See requirements <ArrowRight className="w-3.5 h-3.5" /></div>
                            )}
                        </div>
                    </Link>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* ── LEFT COLUMN ── */}
                    <div className="lg:col-span-8 flex flex-col gap-8">

                        {/* CHART SECTION */}
                        <div className="bg-[#FFFFFF] border border-[rgba(30,30,50,0.06)] rounded-[32px] p-8 md:p-10 shadow-[0_4px_24px_rgba(30,40,90,0.02)] transition-all duration-400 hover:shadow-[0_12px_32px_rgba(30,40,90,0.04)]">
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-6">
                                <div>
                                    <h2 className="text-[22px] font-[750] text-[#171827] tracking-tight" style={{ fontFamily: "var(--font-manrope)" }}>Score Performance</h2>
                                    <p className="text-[16px] text-[#6F7182] mt-1 font-medium">Your historical rounds trajectory</p>
                                </div>
                                <div className="flex gap-8">
                                    <div className="flex flex-col gap-1">
                                        <div className="text-[11px] font-[700] text-[#6F7182] uppercase tracking-[0.08em]">Average</div>
                                        <div className="text-[20px] font-[750] text-[#6F8FEF]" style={{ fontFamily: "var(--font-manrope)" }}>{avgScoreRaw !== null ? avgScoreRaw.toFixed(1) : "—"}</div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className="text-[11px] font-[700] text-[#6F7182] uppercase tracking-[0.08em]">Lifetime Best</div>
                                        <div className="text-[20px] font-[750] text-[#171827]" style={{ fontFamily: "var(--font-manrope)" }}>{bestScoreRaw !== null ? bestScoreRaw : "—"}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="h-[300px] w-full">
                                {scores.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6F8FEF" stopOpacity={0.25} />
                                                    <stop offset="95%" stopColor="#6F8FEF" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(30,30,50,0.05)" />
                                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#6F7182", fontSize: 13, fontWeight: 500 }} dy={12} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6F7182", fontSize: 13, fontWeight: 500 }} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(30,40,90,0.08)', fontWeight: 600, color: '#171827', padding: '12px 16px' }}
                                                itemStyle={{ color: '#6F8FEF', fontSize: '15px' }}
                                                cursor={{ stroke: '#6F8FEF', strokeWidth: 1, strokeDasharray: '4 4' }}
                                            />
                                            <Area type="monotone" dataKey="score" stroke="#6F8FEF" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" activeDot={{ r: 6, fill: '#6F8FEF', stroke: 'white', strokeWidth: 3 }} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center text-[#6F7182] bg-[#FAFAFC] rounded-[24px] border border-[rgba(30,30,50,0.04)]">
                                        <Activity className="w-10 h-10 mb-4 opacity-[0.15]" />
                                        <p className="text-[15px] font-medium">Log scores to build your chart.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RECENT SCORES */}
                        <div className="bg-[#FFFFFF] border border-[rgba(30,30,50,0.06)] rounded-[32px] shadow-[0_4px_24px_rgba(30,40,90,0.02)] transition-all duration-400 hover:shadow-[0_12px_32px_rgba(30,40,90,0.04)] overflow-hidden">
                            <div className="px-8 md:px-10 py-8 border-b border-[rgba(30,30,50,0.04)] flex items-center justify-between">
                                <h2 className="text-[22px] font-[750] text-[#171827] tracking-tight" style={{ fontFamily: "var(--font-manrope)" }}>Recent Rounds</h2>
                                <Link href="/dashboard/scores" className="text-[14px] font-[700] text-[#6F8FEF] hover:text-[#5C7CE0] flex items-center transition-colors group">
                                    View all <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                            <div>
                                {scores.length > 0 ? (
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-[#FAFAFC] border-b border-[rgba(30,30,50,0.04)]">
                                                <th className="px-8 md:px-10 py-5 text-[11px] font-[700] uppercase tracking-[0.08em] text-[#6F7182]">Round</th>
                                                <th className="px-8 md:px-10 py-5 text-[11px] font-[700] uppercase tracking-[0.08em] text-[#6F7182]">Date</th>
                                                <th className="px-8 md:px-10 py-5 text-[11px] font-[700] uppercase tracking-[0.08em] text-[#6F7182]">Score</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[rgba(30,30,50,0.04)]">
                                            {scores.slice(0, 5).map((sc, i) => {
                                                let perfLabel = "—";
                                                let badgeClass = "bg-[#FAFAFC] text-[#6F7182] border border-[rgba(30,30,50,0.04)]";
                                                if (sc.value >= 38) { perfLabel = "Excellent"; badgeClass = "bg-[rgba(67,169,130,0.08)] text-[#43A982]"; }
                                                else if (sc.value >= 30) { perfLabel = "Good"; badgeClass = "bg-[rgba(111,143,239,0.08)] text-[#6F8FEF]"; }

                                                return (
                                                    <tr key={i} className="hover:bg-[#FAFAFC] transition-colors group">
                                                        <td className="px-8 md:px-10 py-6 text-[15px] font-[600] text-[#171827]">#{scores.length - i}</td>
                                                        <td className="px-8 md:px-10 py-6 text-[15px] text-[#6F7182] font-medium">{new Date(sc.score_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</td>
                                                        <td className="px-8 md:px-10 py-6">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[16px] font-[700] text-[#171827]">{sc.value} pts</span>
                                                                {perfLabel !== "—" && (
                                                                    <span className={`hidden sm:inline-flex px-3.5 py-1.5 rounded-full text-[12px] font-[700] tracking-wide ${badgeClass} shadow-sm group-hover:-translate-y-0.5 transition-transform`}>
                                                                        {perfLabel}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="py-24 text-center">
                                        <p className="text-[16px] text-[#6F7182] font-medium">No recent rounds recorded.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* ── RIGHT COLUMN ── */}
                    <div className="lg:col-span-4 flex flex-col gap-8">

                        {/* TOTAL WINNINGS */}
                        <div className="bg-[#FFFFFF] border border-[rgba(30,30,50,0.06)] rounded-[32px] p-8 shadow-[0_4px_24px_rgba(30,40,90,0.02)] transition-all duration-400 hover:shadow-[0_12px_32px_rgba(30,40,90,0.04)] hover:-translate-y-[4px]">
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-[12px] font-[700] text-[#6F7182] uppercase tracking-[0.08em]">Total Winnings</span>
                                <div className="w-12 h-12 rounded-[16px] bg-[#FFFDF7] border border-[rgba(217,164,65,0.1)] shadow-sm flex items-center justify-center">
                                    <Trophy className="w-6 h-6 text-[#D9A441]" />
                                </div>
                            </div>
                            <div className="text-[48px] font-[750] text-[#171827] mb-2 tracking-[-0.02em]" style={{ fontFamily: "var(--font-manrope)" }}>
                                ₹<AnimatedNumber value={profile?.winnings_total ?? 0} />
                            </div>
                            <p className="text-[15px] text-[#6F7182] font-medium mb-10">From eligible monthly draws</p>

                            <Link href="/dashboard/scores" className="w-full py-4.5 bg-[#FAFAFC] border border-[rgba(30,30,50,0.04)] hover:border-[rgba(30,30,50,0.1)] hover:bg-white text-[#171827] rounded-[100px] font-[600] text-[15px] transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md hover:-translate-y-[2px]">
                                View Draw History
                            </Link>
                        </div>

                        {/* CHARITY IMPACT WIDGET */}
                        <div className="bg-[#FFFFFF] border border-[rgba(30,30,50,0.06)] rounded-[32px] p-8 shadow-[0_4px_24px_rgba(30,40,90,0.02)] transition-all duration-400 hover:shadow-[0_12px_32px_rgba(30,40,90,0.04)] hover:-translate-y-[4px]">
                            <h2 className="text-[20px] font-[750] text-[#171827] mb-3" style={{ fontFamily: "var(--font-manrope)" }}>Charitable Impact</h2>
                            <p className="text-[15px] text-[#6F7182] font-medium mb-8">Causes you are actively backing.</p>

                            {primaryCharity ? (
                                <div className="bg-[#FAFAFC] border border-[rgba(30,30,50,0.04)] rounded-[24px] p-6 mb-8">
                                    <div className="text-[11px] font-[700] text-[#6F7182] uppercase tracking-[0.08em] mb-2">Primary Supported</div>
                                    <div className="font-[750] text-[20px] text-[#171827] leading-tight mb-2 tracking-tight">{primaryCharity.name}</div>
                                    <div className="text-[14px] font-[700] text-[#6F8FEF]">{primaryCharity.pct}% standard allocation</div>
                                </div>
                            ) : (
                                <div className="bg-[#FAFAFC] border border-[rgba(30,30,50,0.04)] border-dashed rounded-[24px] p-10 mb-8 text-center flex flex-col items-center">
                                    <Heart className="w-8 h-8 text-[#6F7182]/30 mb-4" />
                                    <div className="font-[600] text-[16px] mb-1 text-[#171827]">No charity selected</div>
                                    <div className="text-[14px] text-[#6F7182] font-medium">Allocate your membership impact.</div>
                                </div>
                            )}

                            <Link href="/dashboard/charity" className="w-full py-4.5 bg-[#F0F5FF] hover:bg-[#E4EEFF] text-[#6F8FEF] rounded-[100px] font-[600] text-[15px] flex items-center justify-center transition-colors duration-300">
                                {primaryCharity ? "Manage Causes" : "Explore Charities"}
                            </Link>
                        </div>

                        {/* ACHIEVEMENTS GRID */}
                        <div className="bg-[#FFFFFF] border border-[rgba(30,30,50,0.06)] rounded-[32px] p-8 shadow-[0_4px_24px_rgba(30,40,90,0.02)] transition-all duration-400 hover:shadow-[0_12px_32px_rgba(30,40,90,0.04)] hover:-translate-y-[4px]">
                            <h2 className="text-[20px] font-[750] text-[#171827] mb-6" style={{ fontFamily: "var(--font-manrope)" }}>Achievements</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className={`flex flex-col p-6 rounded-[24px] border ${scores.length > 0 ? "bg-[#FFFDF7] border-[rgba(217,164,65,0.15)]" : "bg-[#FAFAFC] border-[rgba(30,30,50,0.04)]"}`}>
                                    <Trophy className={`w-7 h-7 mb-4 ${scores.length > 0 ? "text-[#D9A441]" : "text-[#6F7182]/40"}`} />
                                    <div className="font-[700] text-[14px] text-[#171827]">First Score</div>
                                    <div className="text-[13px] text-[#6F7182] font-medium mt-1">Foundational</div>
                                </div>
                                <div className={`flex flex-col p-6 rounded-[24px] border ${scores.length >= 5 ? "bg-[#F4D9E8]/30 border-[#F4D9E8]" : "bg-[#FAFAFC] border-[rgba(30,30,50,0.04)]"}`}>
                                    <Flame className={`w-7 h-7 mb-4 ${scores.length >= 5 ? "text-[#E982B3]" : "text-[#6F7182]/40"}`} />
                                    <div className="font-[700] text-[14px] text-[#171827]">Consistent</div>
                                    <div className="text-[13px] text-[#6F7182] font-medium mt-1">5+ Rounds</div>
                                </div>
                                <div className={`flex flex-col p-6 rounded-[24px] border ${charities.length > 0 ? "bg-[#F0F5FF] border-[rgba(111,143,239,0.15)]" : "bg-[#FAFAFC] border-[rgba(30,30,50,0.04)]"}`}>
                                    <Gift className={`w-7 h-7 mb-4 ${charities.length > 0 ? "text-[#6F8FEF]" : "text-[#6F7182]/40"}`} />
                                    <div className="font-[700] text-[14px] text-[#171827]">Supporter</div>
                                    <div className="text-[13px] text-[#6F7182] font-medium mt-1">Impact Set</div>
                                </div>
                                <div className={`flex flex-col p-6 rounded-[24px] border ${isActive ? "bg-[rgba(67,169,130,0.04)] border-[rgba(67,169,130,0.15)]" : "bg-[#FAFAFC] border-[rgba(30,30,50,0.04)]"}`}>
                                    <Award className={`w-7 h-7 mb-4 ${isActive ? "text-[#43A982]" : "text-[#6F7182]/40"}`} />
                                    <div className="font-[700] text-[14px] text-[#171827]">Hero</div>
                                    <div className="text-[13px] text-[#6F7182] font-medium mt-1">Active Plan</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}
