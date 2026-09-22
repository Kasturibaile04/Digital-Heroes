import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const plan: "monthly" | "yearly" = body.plan ?? "monthly";

    const renewalDate = new Date();
    renewalDate.setMonth(renewalDate.getMonth() + (plan === "yearly" ? 12 : 1));

    // Insert mock payment
    await supabase.from("payments").insert({
        user_id: user.id,
        razorpay_order_id: null,
        razorpay_payment_id: null,
        amount: plan === "yearly" ? 4799 : 499,
        status: "paid",
    });

    // Update profile
    const { error } = await supabase
        .from("profiles")
        .update({
            subscription_status: "active",
            subscription_plan: plan,
        })
        .eq("id", user.id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, plan });
}
