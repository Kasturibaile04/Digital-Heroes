import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import CharityCard from "@/components/CharityCard";
import { Heart, Search, ArrowRight } from "lucide-react";

export default async function CharitiesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: charities } = await supabase
        .from("charities")
        .select("id, name, description, image_url, website_url, is_featured")
        .order("is_featured", { ascending: false })
        .order("name");

    return (
        <main className="flex-1 bg-[#F8FAFC] pt-28 pb-24 px-6 font-sans min-h-screen text-[#0F172A]">
            <div className="max-w-[1200px] mx-auto">

                {/* Header */}
                <div className="mb-16">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF2F2] border border-red-100 mb-5">
                        <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                        <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-red-500"
                            style={{ fontFamily: "var(--font-inter)" }}>Charity Directory</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-[-0.03em] text-[#0F172A] leading-tight"
                                style={{ fontFamily: "var(--font-manrope)" }}>
                                Your impact <span className="text-[#4F46E5]">starts here.</span>
                            </h1>
                            <p className="text-[16px] text-[#64748B] leading-[1.65] max-w-xl"
                                style={{ fontFamily: "var(--font-inter)" }}>
                                Every membership fuels a cause you believe in. Browse our vetted partners and choose the one that resonates with you.
                            </p>
                        </div>

                        {!user && (
                            <Link href="/signup"
                                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#4F46E5] text-white font-semibold text-[14px] hover:bg-[#4338CA] transition-all shadow-[0_2px_12px_rgba(79,70,229,0.25)] hover:-translate-y-0.5 flex-shrink-0"
                                style={{ fontFamily: "var(--font-inter)" }}>
                                Start supporting <ArrowRight className="w-4 h-4 opacity-70" />
                            </Link>
                        )}
                    </div>
                </div>

                {/* Search */}
                <div className="max-w-sm relative mb-12">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <input
                        type="text"
                        placeholder="Search organisations…"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E2E8F0] bg-white text-[14px] text-[#0F172A] focus:outline-none focus:border-[#4F46E5] focus:ring-[3px] focus:ring-[#4F46E5]/10 transition-all placeholder:text-[#CBD5E1]"
                        style={{ fontFamily: "var(--font-inter)" }}
                    />
                </div>

                {/* Grid */}
                {charities && charities.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {charities.map((charity) => (
                            <CharityCard key={charity.id} charity={charity} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center py-24 gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-center">
                            <Heart className="w-8 h-8 text-[#4F46E5] fill-[#4F46E5]" />
                        </div>
                        <h3 className="text-[22px] font-bold text-[#0F172A] tracking-tight"
                            style={{ fontFamily: "var(--font-manrope)" }}>No charities yet</h3>
                        <p className="text-[#64748B] text-[15px] max-w-xs leading-[1.65]"
                            style={{ fontFamily: "var(--font-inter)" }}>
                            Check back soon — we partner with new causes regularly.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
