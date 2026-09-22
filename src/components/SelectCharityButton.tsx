"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SelectCharityButton({ charityId }: { charityId: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleSelect = async (e: React.MouseEvent) => {
        e.preventDefault(); // prevent navigation to charity details page
        setLoading(true);

        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            router.push("/signup");
            return;
        }

        await supabase.from("profiles").update({
            charity_id: charityId
        }).eq("id", session.user.id);

        alert("Success! This charity is now your selected cause.");
        router.push("/dashboard/charity");
        router.refresh();
    };

    return (
        <button
            onClick={handleSelect}
            disabled={loading}
            className="text-[11.5px] uppercase font-bold tracking-[0.06em] text-[#4F46E5] hover:text-[#4338CA] transition-colors relative z-40 bg-[#EEF2FF] hover:bg-[#E0E7FF] px-3 py-1.5 rounded-md disabled:opacity-50"
            style={{ fontFamily: "var(--font-inter)" }}
        >
            {loading ? "Saving..." : "Support Cause"}
        </button>
    );
}
