const TIER_LABELS: Record<string, { label: string; color: string; bg: string; border: string }> = {
    "5match": { label: "Jackpot", color: "#065F46", bg: "#D1FAE5", border: "#6EE7B7" },
    "4match": { label: "Silver", color: "#92400E", bg: "#FEF3C7", border: "#FCD34D" },
    "3match": { label: "Bronze", color: "#9F1239", bg: "#FFE4E6", border: "#FDA4AF" },
};

interface DrawEntry {
    id: string;
    tier: string | null;
    match_count: number;
    prize_amount: number;
    payment_status: string;
    verification_status: string;
    draws?: { month: string; draw_numbers: number[] };
}

interface DrawResultsTableProps {
    entries: DrawEntry[];
    showUser?: boolean;
}

export default function DrawResultsTable({ entries, showUser = false }: DrawResultsTableProps) {
    if (!entries.length) {
        return (
            <p className="text-[14px] text-center py-10 text-[#94A3B8]"
                style={{ fontFamily: "var(--font-inter)" }}>
                No draw entries found.
            </p>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-[13px] text-left">
                <thead>
                    <tr className="border-b border-[#E2E8F0]">
                        {["Draw", "Numbers", "Matches", "Tier", "Prize", "Status"].map((h) => (
                            <th key={h}
                                className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.07em] text-[#94A3B8]"
                                style={{ fontFamily: "var(--font-inter)" }}>
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                    {entries.map((entry) => {
                        const tier = entry.tier ? TIER_LABELS[entry.tier] : null;
                        return (
                            <tr key={entry.id} className="hover:bg-[#F8FAFC] transition-colors">
                                {/* Month — Manrope */}
                                <td className="px-5 py-4 font-medium text-[#0F172A]"
                                    style={{ fontFamily: "var(--font-manrope)" }}>
                                    {entry.draws?.month ?? "—"}
                                </td>
                                {/* Numbers */}
                                <td className="px-5 py-4">
                                    {entry.draws?.draw_numbers ? (
                                        <div className="flex gap-1.5 flex-wrap">
                                            {entry.draws.draw_numbers.map((n, i) => (
                                                <span key={i}
                                                    className="w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center bg-[#EEF2FF] text-[#4F46E5]"
                                                    style={{ fontFamily: "var(--font-inter)" }}>
                                                    {n}
                                                </span>
                                            ))}
                                        </div>
                                    ) : <span className="text-[#C0CCDA]">—</span>}
                                </td>
                                {/* Matches — Manrope bold */}
                                <td className="px-5 py-4 font-bold text-[#4F46E5]"
                                    style={{ fontFamily: "var(--font-manrope)" }}>
                                    {entry.match_count}
                                </td>
                                {/* Tier badge */}
                                <td className="px-5 py-4">
                                    {tier ? (
                                        <span
                                            className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.07em] border"
                                            style={{ background: tier.bg, color: tier.color, borderColor: tier.border, fontFamily: "var(--font-inter)" }}
                                        >
                                            {tier.label}
                                        </span>
                                    ) : <span className="text-[#C0CCDA] font-medium">—</span>}
                                </td>
                                {/* Prize — Manrope */}
                                <td className="px-5 py-4">
                                    {entry.prize_amount > 0 ? (
                                        <span className="font-bold text-[#0F172A]"
                                            style={{ fontFamily: "var(--font-manrope)" }}>
                                            ₹{entry.prize_amount.toLocaleString("en-IN")}
                                        </span>
                                    ) : <span className="text-[#C0CCDA] font-medium">—</span>}
                                </td>
                                {/* Status badge */}
                                <td className="px-5 py-4">
                                    <span
                                        className={`text-[11px] font-semibold capitalize px-2 py-0.5 rounded-full ${entry.verification_status === "verified"
                                            ? "bg-[#D1FAE5] text-[#065F46]"
                                            : "bg-[#F1F5F9] text-[#64748B]"
                                            }`}
                                        style={{ fontFamily: "var(--font-inter)" }}
                                    >
                                        {entry.verification_status}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
