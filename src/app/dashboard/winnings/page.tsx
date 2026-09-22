import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Trophy, Upload, Sparkles, AlertCircle } from "lucide-react";

export default async function WinningsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: entries } = await supabase
        .from("draw_entries")
        .select("*, draws(month, draw_numbers)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    const totalPaid = entries
        ?.filter((e) => e.payment_status === "paid")
        .reduce((sum, e) => sum + (e.prize_amount ?? 0), 0) ?? 0;

    return (
        <main className="flex-1 bg-background pt-24 pb-24 px-6 md:px-12 relative overflow-hidden min-h-screen text-foreground font-sans">

            <div className="max-w-[1000px] mx-auto relative z-10 pt-10">
                <div className="mb-12 border-b subtle-border pb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#111111] tracking-tight">
                        Prize History
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Track your draw participation, results, and verified prize payouts.
                    </p>
                </div>

                {/* Total winnings card */}
                <div className="premium-card p-8 md:p-12 mb-12 flex items-center gap-8 relative overflow-hidden group soft-gradient-bg">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] transform translate-x-1/4 -translate-y-1/4">
                        <Trophy className="w-48 h-48 text-[#111111]" />
                    </div>
                    <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center flex-shrink-0 subtle-border shadow-sm z-10">
                        <Trophy className="w-10 h-10 text-brand" />
                    </div>
                    <div className="z-10">
                        <div className="text-[12px] font-bold tracking-widest text-[#111111]/70 uppercase mb-2">Total Verified Winnings</div>
                        <div className="text-6xl font-bold text-[#111111] flex items-baseline gap-2">
                            ₹{totalPaid.toLocaleString()}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {entries && entries.length > 0 ? entries.map((entry: any) => {
                        const drawNumbers = (entry.draws?.draw_numbers as number[]) ?? [];
                        const userNumbers = (entry.user_numbers as number[]) ?? [];
                        const isWinner = entry.prize_amount && entry.prize_amount > 0;

                        return (
                            <div key={entry.id} className={`p-8 rounded-[24px] premium-card transition-colors ${isWinner ? 'border-brand shadow-md' : 'shadow-sm hover:shadow-md'}`}>
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-8">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="px-3 py-1 bg-[#FAFAFC] subtle-border rounded-full text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                                {entry.draws?.month || "Unknown Draw"}
                                            </div>
                                            {isWinner && <span className="px-2 py-1 bg-[#E3F2E8] text-[#1E5631] text-[10px] font-bold tracking-wider uppercase rounded">Winner</span>}
                                        </div>
                                        <h3 className="text-2xl font-serif font-bold text-foreground">Matched {entry.matches} numbers</h3>
                                    </div>
                                    {isWinner ? (
                                        <div className="text-right flex items-center md:items-end flex-col">
                                            <span className="text-3xl font-serif font-bold text-foreground">₹{entry.prize_amount?.toLocaleString()}</span>
                                            <span className={`text-[11px] font-bold tracking-widest uppercase mt-2 ${entry.payment_status === "paid" ? "text-[#1E5631]" :
                                                entry.payment_status === "pending" ? "text-[#D47963]" : "text-muted-foreground"
                                                }`}>
                                                Status: {entry.payment_status}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="text-right md:text-right">
                                            <span className="text-xl font-serif font-bold text-muted-foreground">No Prize</span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 rounded-2xl bg-muted/40 border border-border/50">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-3">Your Played Numbers</div>
                                            <div className="flex gap-2 flex-wrap">
                                                {userNumbers.map((n, i) => {
                                                    const matched = drawNumbers.includes(n);
                                                    return (
                                                        <span key={i} className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${matched ? "bg-brand text-white shadow-md border border-brand" : "bg-white text-muted-foreground border border-border"}`}>
                                                            {n}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-3">Drawn Numbers</div>
                                            <div className="flex gap-2 flex-wrap">
                                                {drawNumbers.length > 0 ? drawNumbers.map((n, i) => (
                                                    <span key={i} className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 text-accent flex items-center justify-center font-bold text-sm">
                                                        {n}
                                                    </span>
                                                )) : (
                                                    <span className="text-sm text-muted-foreground italic">Draw pending</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Verification Section */}
                                {isWinner && (
                                    <div className="mt-6 pt-6 border-t border-border">
                                        {entry.proof_url ? (
                                            <div className="flex items-center gap-3 text-sm font-medium text-[#1E5631] bg-[#E3F2E8] p-4 rounded-xl border border-[#1E5631]/20">
                                                <Sparkles className="w-5 h-5 flex-shrink-0" />
                                                Verified: Proof submitted successfully.
                                            </div>
                                        ) : (
                                            <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#FEF6F5] p-5 rounded-xl border border-[#D47963]/30">
                                                <AlertCircle className="w-5 h-5 text-[#D47963] flex-shrink-0" />
                                                <div className="flex-1 text-sm text-[#D47963]/90 font-medium">
                                                    Please submit scorecard proof to claim your prize. Verification is required before payout.
                                                </div>
                                                <a href={`mailto:verifications@digitalheroes.app?subject=Proof%20for%20Entry%20${entry.id}`}
                                                    className="whitespace-nowrap px-6 py-2.5 bg-[#D47963] hover:bg-[#B96450] text-white rounded-full font-bold text-xs uppercase tracking-wider transition-colors shadow-sm">
                                                    Email Proof
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    }) : (
                        <div className="text-center py-24 bg-white rounded-[2rem] border border-border border-dashed">
                            <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                            <h3 className="text-xl font-serif font-bold text-foreground mb-2">No Draw Entries Yet</h3>
                            <p className="text-muted-foreground">Keep logging scores. Active members automatically enter the monthly draw.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
