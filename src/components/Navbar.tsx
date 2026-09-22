"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Menu, X, Heart, User, LogOut, Plus } from "lucide-react";
import Chatbot from "./Chatbot";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        supabase.auth.getUser().then(async ({ data }) => {
            if (data.user) {
                setUser(data.user);
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("is_admin")
                    .eq("id", data.user.id)
                    .single();
                setIsAdmin(profile?.is_admin ?? false);
            }
        });

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => authListener.subscription.unsubscribe();
    }, []);

    async function handleSignOut() {
        await supabase.auth.signOut();
        setUser(null);
        router.push("/");
    }

    if (pathname === "/login" || pathname === "/signup") return null;

    const navLinks = user
        ? [
            { href: "/dashboard", label: "Dashboard" },
            { href: "/charities", label: "Charities" },
            { href: "/pricing", label: "Plan" },
            { href: "/dashboard/charity", label: "Supports" },
            { href: "/dashboard/scores", label: "Draws" },
        ]
        : [
            { href: "/pricing", label: "Plan" },
            { href: "/charities", label: "Charities" },
        ];

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-400 ease-out font-sans ${scrolled ? "py-2.5" : "bg-transparent py-5"}`}
            style={scrolled ? {
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(16px)",
                borderBottom: "1px solid rgba(30,30,50,0.06)"
            } : {
                borderBottom: "1px solid transparent"
            }}
        >
            <div className={`max-w-[1400px] mx-auto px-6 flex items-center justify-between`}>

                {/* Brand */}
                <div className="flex items-center gap-2.5">
                    <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 rounded-lg bg-[#6F8FEF] flex items-center justify-center shadow-sm group-hover:bg-[#5C7CE0] transition-colors duration-300">
                            <Heart className="w-4 h-4 text-white fill-white" />
                        </div>
                        <span className="font-[750] text-[16px] text-[#171827] tracking-tight group-hover:text-[#6F8FEF] transition-colors duration-300" style={{ fontFamily: "var(--font-manrope)" }}>
                            Digital Heroes
                        </span>
                    </Link>
                </div>

                {/* Center Nav (Desktop) */}
                <nav className="hidden lg:flex items-center space-x-2">
                    {navLinks.map(link => {
                        const active = pathname === link.href;
                        return (
                            <Link key={link.href} href={link.href}
                                className={`px-4 py-2 rounded-full text-[13.5px] font-[600] transition-all duration-300 ease-out ${active ? "bg-[#F4D9E8]/40 text-[#6F8FEF]" : "text-[#6F7182] hover:bg-white/60 hover:text-[#171827]"}`}
                                style={{ fontFamily: "var(--font-inter)" }}>
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Actions */}
                <div className="hidden lg:flex items-center gap-4">
                    {user ? (
                        <>
                            <Chatbot />
                            <div className="h-5 w-px bg-[rgba(30,30,50,0.08)]"></div>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-[#E9D8F5]/40 text-[#6F8FEF] border border-[rgba(30,30,50,0.04)] flex items-center justify-center font-[700] text-[14px]">
                                    {user.email?.charAt(0).toUpperCase() ?? "U"}
                                </div>
                                <button onClick={handleSignOut} className="text-[13.5px] font-[600] text-[#6F7182] hover:text-[#171827] flex items-center gap-1.5 transition-colors duration-300">
                                    <LogOut className="w-4 h-4" /> Sign out
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link href="/login" className="text-[14px] font-[600] text-[#171827] hover:text-[#6F8FEF] transition-colors duration-300" style={{ fontFamily: "var(--font-inter)" }}>Sign in</Link>
                            <Link href="/signup" className="px-5 py-2.5 bg-[#6F8FEF] hover:bg-[#5C7CE0] hover:-translate-y-[2px] text-white rounded-full text-[14px] font-[600] transition-all duration-300 shadow-[0_4px_12px_rgba(111,143,239,0.2)]">Get Started</Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="lg:hidden flex items-center">
                    <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-[#171827]">
                        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {
                menuOpen && (
                    <div className="lg:hidden absolute top-full left-0 w-full bg-[rgba(255,255,255,0.95)] backdrop-blur-xl border-b border-[rgba(30,30,50,0.06)] shadow-[0_20px_40px_rgba(30,40,90,0.08)] p-6 flex flex-col gap-3 z-50">
                        {navLinks.map(link => (
                            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                                className={`p-4 rounded-2xl text-[15px] font-[600] ${pathname === link.href ? "bg-[#F4D9E8]/40 text-[#6F8FEF]" : "text-[#6F7182] hover:text-[#171827]"}`}>
                                {link.label}
                            </Link>
                        ))}
                        {user && (
                            <>
                                <hr className="my-3 border-[rgba(30,30,50,0.06)]" />
                                <button onClick={handleSignOut} className="p-4 text-[#6F7182] text-left text-[15px] font-[600] flex items-center gap-2 hover:text-[#171827]">
                                    <LogOut className="w-5 h-5" /> Sign Out
                                </button>
                            </>
                        )}
                    </div>
                )
            }
        </header >
    );
}
