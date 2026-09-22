"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Heart, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
        if (error) { setError(error.message); setLoading(false); return; }
        router.push("/dashboard");
    }

    async function handleGuestLogin() {
        setLoading(true);
        setError(null);
        const guestEmail = `guest_${Math.floor(Math.random() * 1000000)}@digitalheroes.test`;
        const { data, error } = await supabase.auth.signUp({ email: guestEmail, password: "guestpassword123" });
        if (error) { setError(error.message); setLoading(false); return; }
        if (data.user) {
            await supabase.from("profiles").insert([
                { id: data.user.id, full_name: "Guest User", is_admin: false, active_subscription: false }
            ]);
        }
        router.push("/dashboard");
    }

    const inputCls = "w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-white focus:outline-none focus:border-[#4F46E5] focus:ring-[3px] focus:ring-[#4F46E5]/10 transition-all placeholder:text-[#CBD5E1] text-[14px] text-[#0F172A]";

    return (
        <main className="min-h-screen flex bg-[#F8FAFC]">
            {/* ── Left: Form ─────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20">
                <Link href="/" className="absolute top-10 left-6 sm:left-12 lg:left-20 flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#FEF2F2] border border-red-100">
                        <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    </span>
                    <span className="font-semibold text-[15px] text-[#0F172A] tracking-tight"
                        style={{ fontFamily: "var(--font-manrope)" }}>
                        DigitalHeroes
                    </span>
                </Link>

                <div className="max-w-[400px] w-full mx-auto relative z-10 mt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        {/* Main heading — Manrope */}
                        <h1 className="text-[34px] md:text-[40px] font-bold mb-2 leading-tight text-[#0F172A] tracking-[-0.03em]"
                            style={{ fontFamily: "var(--font-manrope)" }}>
                            Sign in to <span className="text-[#4F46E5]">impact.</span>
                        </h1>
                        {/* Sub — Inter */}
                        <p className="text-[15px] text-[#64748B] mb-8 leading-[1.65]"
                            style={{ fontFamily: "var(--font-inter)" }}>
                            Enter your details to track your scores, confirm your draws, and see your real-world charity impact.
                        </p>

                        <form onSubmit={handleLogin} className="space-y-4">
                            {error && (
                                <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5]/40 text-[#EF4444] text-[13px] font-medium"
                                    style={{ fontFamily: "var(--font-inter)" }}>
                                    {error}
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-[12px] font-semibold text-[#0F172A] block uppercase tracking-[0.06em]"
                                    style={{ fontFamily: "var(--font-inter)" }} htmlFor="email">
                                    Email address
                                </label>
                                <input
                                    id="email" type="email" required value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={inputCls} style={{ fontFamily: "var(--font-inter)" }}
                                    placeholder="james@example.com"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-[12px] font-semibold text-[#0F172A] uppercase tracking-[0.06em]"
                                        style={{ fontFamily: "var(--font-inter)" }} htmlFor="password">
                                        Password
                                    </label>
                                    <span className="text-[13px] text-[#64748B] hover:text-[#4F46E5] cursor-pointer transition-colors font-medium"
                                        style={{ fontFamily: "var(--font-inter)" }}>Forgot?</span>
                                </div>
                                <div className="relative">
                                    <input
                                        id="password" type={showPw ? "text" : "password"} required value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`${inputCls} pr-11`} style={{ fontFamily: "var(--font-inter)" }}
                                        placeholder="••••••••"
                                    />
                                    <button type="button" onClick={() => setShowPw(!showPw)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors">
                                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" disabled={loading}
                                style={{ fontFamily: "var(--font-inter)" }}
                                className="w-full flex items-center justify-center py-3 rounded-xl bg-[#4F46E5] text-white font-semibold text-[14px] hover:bg-[#4338CA] transition-all shadow-[0_2px_12px_rgba(79,70,229,0.25)] hover:shadow-[0_4px_20px_rgba(79,70,229,0.35)] disabled:opacity-60 group mt-2">
                                {loading
                                    ? <Loader2 className="w-4 h-4 animate-spin" />
                                    : <> Sign In <ArrowRight className="w-4 h-4 ml-2 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" /></>
                                }
                            </button>
                        </form>

                        <div className="my-6 flex items-center gap-3">
                            <div className="h-px bg-[#E2E8F0] flex-1" />
                            <div className="text-[11px] uppercase font-semibold tracking-[0.08em] text-[#CBD5E1]"
                                style={{ fontFamily: "var(--font-inter)" }}>Or</div>
                            <div className="h-px bg-[#E2E8F0] flex-1" />
                        </div>

                        <button onClick={handleGuestLogin} disabled={loading}
                            style={{ fontFamily: "var(--font-inter)" }}
                            className="w-full flex items-center justify-center py-3 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] font-medium text-[14px] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all disabled:opacity-50">
                            Continue as Guest
                        </button>

                        <p className="mt-8 text-center text-[#64748B] text-[13.5px]"
                            style={{ fontFamily: "var(--font-inter)" }}>
                            Don&apos;t have an account?{" "}
                            <Link href="/signup" className="text-[#4F46E5] font-semibold hover:underline underline-offset-4">
                                Become a member
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* ── Right: Visual ───────────────────────────────────────── */}
            <div className="hidden lg:flex flex-1 relative bg-[#EEF2FF] p-10 items-center justify-center overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4F46E5]/08 rounded-full blur-[80px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#7C3AED]/06 rounded-full blur-[60px]" />

                <div className="relative z-10 w-full max-w-sm p-10 bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_8px_40px_rgba(15,23,42,0.08)]">
                    <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-center mb-7">
                        <Heart className="w-6 h-6 text-[#4F46E5] fill-[#4F46E5]" />
                    </div>
                    {/* Quote — Manrope for heading feel */}
                    <blockquote className="text-[19px] font-semibold text-[#0F172A] leading-snug mb-7 tracking-[-0.02em]"
                        style={{ fontFamily: "var(--font-manrope)" }}>
                        &ldquo;Seeing my scores actively contribute to charity every month is completely game-changing.&rdquo;
                    </blockquote>
                    <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-full border border-[#E2E8F0] bg-[#F1F5F9]" />
                        <div>
                            <div className="font-semibold text-[#0F172A] text-[14px]"
                                style={{ fontFamily: "var(--font-manrope)" }}>Alex M.</div>
                            <div className="text-[12px] text-[#94A3B8]"
                                style={{ fontFamily: "var(--font-inter)" }}>Digital Hero Member</div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
