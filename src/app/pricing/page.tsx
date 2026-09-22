import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Heart, CheckCircle2 } from "lucide-react";
import RazorpayButton from "@/components/RazorpayButton";

export default async function PricingPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const plans = [
        {
            id: "core",
            name: "Core Membership",
            price: 299,
            desc: "Everything you need to track your impact and enter standard draws.",
            features: ["10% direct charity contribution", "Unlimited score tracking", "Rolling average calculation", "Standard monthly draw entry"],
            highlighted: false,
        },
        {
            id: "hero",
            name: "Hero Membership",
            price: 999,
            desc: "Maximize your impact with expanded charity giving and premium draw eligibility.",
            features: ["25% direct charity contribution", "Verified score auditing", "Premium monthly draw entry", "Featured charity badge", "Priority member support"],
            highlighted: true,
        }
    ];

    return (
        <main className="flex-1 bg-[#FAFAFC] pt-24 pb-32 px-6 font-sans min-h-screen text-[#171827] overflow-hidden">
            <style>{`
                @keyframes fade-slide-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-slide-up {
                    animation: fade-slide-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                }
            `}</style>

            {/* Atmospheric Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-[#E9D8F5]/50 rounded-full blur-[140px]" />
                <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-[#A9DDF2]/40 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-[1020px] mx-auto animate-fade-slide-up relative z-10" style={{ opacity: 0 }}>

                {/* Header */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[rgba(30,30,50,0.06)] mb-6 shadow-sm">
                        <Heart className="w-4 h-4 text-[#6F8FEF] fill-[#6F8FEF]/80" />
                        <span className="text-[12px] font-[700] tracking-[0.1em] uppercase text-[#6F8FEF]"
                            style={{ fontFamily: "var(--font-inter)" }}>Membership Tiers</span>
                    </div>

                    <h1 className="text-[44px] md:text-[56px] font-[750] mb-5 tracking-tight text-[#171827] leading-[1.05]"
                        style={{ fontFamily: "var(--font-manrope)" }}>
                        Choose your level of impact.
                    </h1>
                    <p className="text-[17px] md:text-[19px] text-[#6F7182] max-w-[540px] mx-auto leading-[1.7] font-medium"
                        style={{ fontFamily: "var(--font-inter)" }}>
                        Simple membership plans designed around your game and your giving. Elevate your performance and make a difference.
                    </p>
                </div>

                {/* Plans */}
                <div className="grid md:grid-cols-2 gap-8 md:gap-10">
                    {plans.map((plan, i) => (
                        <div key={plan.id}
                            className={`rounded-[32px] flex flex-col relative overflow-hidden group transition-all duration-400 ease-out hover:-translate-y-[4px] ${plan.highlighted
                                ? "text-white shadow-[0_24px_64px_rgba(111,143,239,0.2)] hover:shadow-[0_40px_80px_rgba(111,143,239,0.3)] border border-[rgba(255,255,255,0.4)]"
                                : "bg-white border border-[rgba(30,30,50,0.06)] shadow-[0_8px_32px_rgba(30,40,90,0.02)] hover:border-[rgba(30,30,50,0.1)] hover:shadow-[0_16px_48px_rgba(30,40,90,0.05)]"
                                }`}
                            style={plan.highlighted ? { background: "linear-gradient(135deg, #6F8FEF 0%, #AEB9F5 100%)" } : {}}>

                            {plan.highlighted && (
                                <>
                                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/20 rounded-full blur-[60px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-white/20 text-white text-[11px] font-[700] uppercase tracking-widest rounded-b-xl backdrop-blur-md border border-[rgba(255,255,255,0.3)] border-t-0 shadow-sm" style={{ fontFamily: "var(--font-inter)" }}>
                                        Most Popular
                                    </div>
                                </>
                            )}

                            <div className={`p-10 md:p-12 flex flex-col flex-1 relative z-10 ${plan.highlighted ? "pt-14" : ""}`}>
                                {/* Plan name */}
                                <div className="text-[13px] font-[700] uppercase tracking-[0.08em] mb-4"
                                    style={{ fontFamily: "var(--font-inter)", color: plan.highlighted ? "rgba(255,255,255,0.85)" : "#6F7182" }}>
                                    {plan.name}
                                </div>

                                {/* Price — Manrope */}
                                <div className="flex items-baseline gap-1.5 mb-2">
                                    <span className="text-[60px] font-[750] tracking-[-0.04em] leading-none"
                                        style={{ fontFamily: "var(--font-manrope)", color: plan.highlighted ? "#FFFFFF" : "#171827" }}>
                                        ₹{plan.price}
                                    </span>
                                    <span className="text-[17px] font-medium"
                                        style={{ fontFamily: "var(--font-inter)", color: plan.highlighted ? "rgba(255,255,255,0.7)" : "#6F7182" }}>
                                        / month
                                    </span>
                                </div>

                                {/* Desc */}
                                <p className="text-[16px] leading-[1.65] mb-10 font-medium"
                                    style={{ fontFamily: "var(--font-inter)", color: plan.highlighted ? "rgba(255,255,255,0.9)" : "#6F7182" }}>
                                    {plan.desc}
                                </p>

                                {/* Divider */}
                                <div className={`h-px mb-10 ${plan.highlighted ? "bg-white/15" : "bg-[rgba(30,30,50,0.06)]"}`} />

                                {/* Features */}
                                <ul className="flex flex-col gap-5 mb-12 flex-1">
                                    {plan.features.map((f) => (
                                        <li key={f} className="flex items-start gap-3 text-[16px] font-medium leading-[1.5]"
                                            style={{ fontFamily: "var(--font-inter)", color: plan.highlighted ? "#FFFFFF" : "#171827" }}>
                                            <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${plan.highlighted ? "text-white/90" : "text-[#6F8FEF]"}`} />
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA - Now Razorpay Button */}
                                <div className="w-full">
                                    <RazorpayButton planId={plan.id} planName={plan.name} planPrice={plan.price} highlighted={plan.highlighted} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer note */}
                <p className="text-center text-[15px] mt-16 text-[#6F7182] font-medium max-w-lg mx-auto"
                    style={{ fontFamily: "var(--font-inter)" }}>
                    All memberships include seamless club score tracking, charity allocations, and fully automated prize draw entries.
                </p>
            </div>
        </main>
    );
}
