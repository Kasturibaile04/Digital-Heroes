import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface AdminKpiCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    color?: string;
    href?: string;
    subtext?: string;
}

export default function AdminKpiCard({ label, value, icon: Icon, color = "#4F46E5", href, subtext }: AdminKpiCardProps) {
    const content = (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 hover:border-[#C7D2FE] hover:shadow-[0_4px_20px_rgba(79,70,229,0.08)] transition-all duration-200 flex flex-col gap-2.5 h-full">
            <div className="w-9 h-9 rounded-lg bg-[#EEF2FF] flex items-center justify-center">
                <Icon className="w-4.5 h-4.5" style={{ color }} />
            </div>
            {/* Value — Manrope for numeric impact */}
            <div className="text-2xl font-bold text-[#0F172A] tracking-tight mt-1"
                style={{ fontFamily: "var(--font-manrope)" }}>
                {value}
            </div>
            {/* Label — Inter small caps */}
            <div className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#94A3B8]"
                style={{ fontFamily: "var(--font-inter)" }}>{label}</div>
            {subtext && (
                <div className="text-[12px] font-medium" style={{ color, fontFamily: "var(--font-inter)" }}>
                    {subtext}
                </div>
            )}
        </div>
    );

    if (href) return <Link href={href} className="block h-full group">{content}</Link>;
    return content;
}
