"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Heart, Eye, EyeOff, Loader2, ArrowRight, Monitor, MousePointerClick, BarChart3, Rocket } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();
    const supabase = createClient();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleAccountSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true); setError(null);
        const cleanEmail = email.trim().toLowerCase();
        const { data, error: signUpError } = await supabase.auth.signUp({
            email: cleanEmail,
            password,
            options: {
                data: { full_name: name },
                emailRedirectTo: `${location.origin}/auth/callback`
            }
        });

        if (signUpError) {
            if (signUpError.message.toLowerCase().includes("user already registered") || signUpError.message.toLowerCase().includes("already registered")) {
                const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                    email: cleanEmail, password,
                });
                if (signInError) {
                    setError(signInError.message); setLoading(false); return;
                }
                if (signInData.user) {
                    await supabase.auth.updateUser({ data: { full_name: name } });
                    router.push("/dashboard"); return;
                }
            } else {
                setError(signUpError.message); setLoading(false); return;
            }
        }

        if (data?.user) {
            // Force a sign-in to guarantee cookies are set correctly for the Next.js Server Component 
            await supabase.auth.signInWithPassword({ email: cleanEmail, password });
            router.refresh(); // Ensure the server knows about the new cookie
            router.push("/dashboard");
        }
    }

    const inputCls = "w-full px-4 py-3 rounded-lg border border-[#E2E8F0] bg-white focus:outline-none focus:border-[#6F8FEF] focus:ring-[3px] focus:ring-[#6F8FEF]/15 transition-all placeholder:text-[#CBD5E1] text-[14px] text-[#0F172A]";
    const labelCls = "text-[11px] font-semibold text-[#6F7182] block uppercase tracking-[0.05em] mb-2";

    return (
        <main className="min-h-screen flex flex-col md:flex-row bg-white overflow-hidden">

            {/* ── Left: Form ─────────────────────────────────────────── */}
            <div className="w-full md:w-[50%] p-8 lg:p-20 xl:p-24 flex flex-col relative bg-white">
                <Link href="/" className="flex items-center gap-2 mb-12 w-max">
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#F0F4FF] border border-[#6F8FEF]/20">
                        <Heart className="w-4 h-4 text-[#6F8FEF] fill-[#6F8FEF]" />
                    </span>
                    <span className="font-[800] text-[17px] text-[#171827] tracking-tight"
                        style={{ fontFamily: "var(--font-manrope)" }}>
                        DigitalHeroes
                    </span>
                </Link>

                <div className="flex-1 flex flex-col justify-center max-w-[400px] w-full mx-auto md:mx-0">
                    <h1 className="text-[34px] md:text-[40px] font-[800] mb-2.5 leading-tight tracking-[-0.03em] text-[#171827]" style={{ fontFamily: "var(--font-manrope)" }}>
                        Create Account
                    </h1>
                    <p className="text-[15px] text-[#6F7182] mb-12 leading-[1.6]" style={{ fontFamily: "var(--font-inter)" }}>
                        Join players who are transforming their scorecards into real-world impact.
                    </p>

                    <form onSubmit={handleAccountSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3.5 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5]/40 text-[#EF4444] text-[13px] font-medium"
                                style={{ fontFamily: "var(--font-inter)" }}>{error}</div>
                        )}

                        <div>
                            <label className={labelCls} style={{ fontFamily: "var(--font-inter)" }} htmlFor="name">Full Name*</label>
                            <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
                                className={inputCls} style={{ fontFamily: "var(--font-inter)" }} placeholder="Alex Mercer" />
                        </div>

                        <div>
                            <label className={labelCls} style={{ fontFamily: "var(--font-inter)" }} htmlFor="email">Email address*</label>
                            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                className={inputCls} style={{ fontFamily: "var(--font-inter)" }} placeholder="alex@example.com" />
                        </div>

                        <div>
                            <label className={labelCls} style={{ fontFamily: "var(--font-inter)" }} htmlFor="password">Password*</label>
                            <div className="relative">
                                <input id="password" type={showPw ? "text" : "password"} required minLength={6}
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                    className={`${inputCls} pr-11`} style={{ fontFamily: "var(--font-inter)" }} placeholder="••••••••" />
                                <button type="button" onClick={() => setShowPw(!showPw)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors">
                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading}
                            style={{ fontFamily: "var(--font-inter)" }}
                            className="w-full flex items-center justify-center py-4 rounded-lg bg-[#6F8FEF] hover:bg-[#5C7BEA] text-white font-[700] text-[14px] tracking-wide transition-all shadow-[0_4px_14px_rgba(111,143,239,0.3)] hover:shadow-[0_6px_20px_rgba(111,143,239,0.4)] disabled:opacity-60 group mt-4">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>SIGN UP <ArrowRight className="w-4 h-4 ml-2 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" /></>}
                        </button>
                    </form>
                </div>
            </div>

            {/* ── Right: Illustration Panel ────────────────────────────────────────── */}
            <div className="hidden md:flex w-full md:w-[50%] relative flex-col items-center justify-center bg-white border-l border-[#E2E8F0]/50">

                {/* Top Right Login Link */}
                <div className="absolute top-8 right-8 lg:top-12 lg:right-12 flex items-center gap-3">
                    <span className="text-[13.5px] font-medium text-[#6F7182]" style={{ fontFamily: "var(--font-inter)" }}>
                        Already a member?
                    </span>
                    <Link href="/login"
                        style={{ fontFamily: "var(--font-inter)" }}
                        className="px-6 py-2.5 rounded-lg border border-[#6F8FEF]/40 text-[#6F8FEF] font-[700] text-[13px] hover:bg-[#6F8FEF]/5 transition-colors uppercase tracking-widest">
                        LOGIN
                    </Link>
                </div>

                {/* Custom Blue Illustration Image */}
                <div className="relative w-full max-w-[450px] flex items-center justify-center mt-12 mx-auto">
                    <div className="relative w-full aspect-square md:aspect-auto md:h-[450px] flex items-center justify-center">
                        <img
                            src="https://plus.unsplash.com/premium_vector-1771932545767-8d919db63823?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Workspace Illustration"
                            className="w-full h-full object-contain drop-shadow-sm mix-blend-darken"
                        />
                    </div>
                </div>
            </div>

        </main>
    );
}
