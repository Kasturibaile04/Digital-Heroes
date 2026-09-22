import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Heart, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Params {
    params: Promise<{ id: string }>;
}

export default async function CharityProfilePage({ params }: Params) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: charity } = await supabase
        .from("charities")
        .select("*")
        .eq("id", id)
        .single();

    if (!charity) notFound();

    return (
        <main className="flex-1 bg-[#F8FAFC] pt-28 pb-20 px-6 font-sans min-h-screen text-[#0F172A]">
            <div className="max-w-3xl mx-auto">
                <Link href="/charities"
                    className="inline-flex items-center gap-2 text-[13px] font-medium text-[#64748B] hover:text-[#4F46E5] transition-colors mb-10 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back to Directory
                </Link>

                <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_24px_rgba(15,23,42,0.06)] overflow-hidden">
                    {/* Image banner */}
                    {charity.image_url && (
                        <div className="w-full h-64 md:h-80 overflow-hidden relative">
                            <img src={charity.image_url} alt={charity.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            {charity.is_featured && (
                                <span className="absolute top-5 right-5 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest bg-[#4F46E5] text-white">
                                    ★ Featured
                                </span>
                            )}
                        </div>
                    )}

                    <div className="p-8 md:p-12">
                        {!charity.image_url && charity.is_featured && (
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] mb-6 text-[10px] font-bold uppercase tracking-widest text-[#4F46E5]">
                                ★ Featured Organization
                            </div>
                        )}

                        <h1 className="text-3xl md:text-4xl font-bold mb-5 text-[#0F172A] tracking-tight leading-tight">
                            {charity.name}
                        </h1>

                        <p className="text-[#64748B] text-[16px] leading-relaxed mb-10">
                            {charity.description}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3.5">
                            <Link href="/signup"
                                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-[14px] transition-all bg-[#4F46E5] text-white hover:bg-[#4338CA] shadow-[0_2px_12px_rgba(79,70,229,0.25)] hover:shadow-[0_4px_20px_rgba(79,70,229,0.35)] hover:-translate-y-0.5 flex-1 text-center">
                                <Heart className="w-4 h-4 text-white/80 fill-white/80" />
                                Support this Cause
                            </Link>
                            {charity.website_url && (
                                <a href={charity.website_url} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-[14px] transition-all bg-white text-[#0F172A] border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] shadow-sm sm:flex-none">
                                    <ExternalLink className="w-4 h-4 text-[#64748B]" />
                                    Visit Website
                                </a>
                            )}
                            <Link href="/charities"
                                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-semibold text-[14px] transition-all bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] shadow-sm sm:flex-none">
                                View All Causes
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
