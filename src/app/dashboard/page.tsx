import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: profile } = await supabase.from("profiles")
        .select("*")
        .eq("id", user.id).single();

    const { data: scores } = await supabase.from("scores")
        .select("value, score_date")
        .eq("user_id", user.id)
        .order("score_date", { ascending: false })
        .limit(10); // getting up to 10 for the chart

    const { data: drawEntries } = await supabase.from("draw_entries")
        .select("*, draws(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

    // Fetch charities based on array logic or individual logic
    let charityList: any[] = [];
    if (profile?.razorpay_customer_id && profile?.razorpay_customer_id.startsWith("[")) {
        try {
            const arr = JSON.parse(profile.razorpay_customer_id);
            if (arr.length > 0) {
                const ids = arr.map((a: any) => a.id);
                const { data: matched } = await supabase.from("charities").select("*").in("id", ids);
                if (matched) {
                    charityList = matched.map(m => {
                        const a = arr.find((a: any) => a.id === m.id);
                        return { ...m, pct: a?.pct || 10 };
                    });
                    // Maintain order from JSON array
                    charityList.sort((req1, req2) => arr.findIndex((a: any) => a.id === req1.id) - arr.findIndex((a: any) => a.id === req2.id));
                }
            }
        } catch (e) { }
    } else if (profile?.charity_id) {
        const { data: matched } = await supabase.from("charities").select("*").eq("id", profile.charity_id).single();
        if (matched) charityList = [{ ...matched, pct: profile.charity_pct || 10 }];
    }

    return (
        <DashboardClient
            user={user}
            profile={profile!}
            scores={scores ?? []}
            drawEntries={drawEntries ?? []}
            charities={charityList}
        />
    )
}
