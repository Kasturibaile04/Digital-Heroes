"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function cancelSubscription() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        await supabase
            .from("profiles")
            .update({ subscription_status: "cancelled" })
            .eq("id", user.id);
    }
    redirect("/dashboard");
}
