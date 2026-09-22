import Link from "next/link";
import { Heart, ExternalLink } from "lucide-react";
import SelectCharityButton from "./SelectCharityButton";

interface Charity {
    id: string;
    name: string;
    description: string;
    image_url: string | null;
    website_url: string | null;
    is_featured: boolean;
}

export default function CharityCard({ charity }: { charity: Charity }) {
    return (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl flex flex-col h-full overflow-hidden group hover:border-[#C7D2FE] hover:shadow-[0_4px_24px_rgba(79,70,229,0.08)] transition-all duration-200 relative">
            <Link href={`/charities/${charity.id}`} className="absolute inset-0 z-10" />

            {/* Image Banner */}
            {charity.image_url && (
                <div className="relative w-full h-44 bg-[#F1F5F9] overflow-hidden">
                    <img
                        src={charity.image_url}
                        alt={charity.name}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    {charity.is_featured && (
                        <span
                            className="absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest bg-[#4F46E5] text-white z-20"
                            style={{ fontFamily: "var(--font-inter)" }}
                        >
                            Featured
                        </span>
                    )}
                </div>
            )}

            {/* Content */}
            <div className="p-6 flex flex-col flex-1 relative z-20">
                <div className="flex-1">
                    <h3
                        className="font-semibold text-[17px] mb-2 text-[#0F172A] leading-snug tracking-[-0.02em] group-hover:text-[#4F46E5] transition-colors"
                        style={{ fontFamily: "var(--font-manrope)" }}
                    >
                        {charity.name}
                    </h3>
                    <p className="text-[#64748B] text-[13.5px] leading-[1.65] line-clamp-3"
                        style={{ fontFamily: "var(--font-inter)" }}>
                        {charity.description}
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-5 pt-5 border-t border-[#F1F5F9] flex items-center justify-between pointer-events-auto relative z-30">
                    <SelectCharityButton charityId={charity.id} />
                    {charity.website_url ? (
                        <a href={charity.website_url} target="_blank" rel="noopener noreferrer"
                            className="p-1.5 hover:bg-[#EEF2FF] rounded-lg transition-colors">
                            <ExternalLink className="w-3.5 h-3.5 text-[#4F46E5] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                    ) : (
                        <ExternalLink className="w-3.5 h-3.5 text-[#4F46E5] opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                </div>
            </div>
        </div>
    );
}
