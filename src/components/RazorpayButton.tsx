"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface RazorpayButtonProps {
    planId: string;
    planName: string;
    planPrice: number;
    highlighted: boolean;
}

export default function RazorpayButton({ planId, planName, planPrice, highlighted }: RazorpayButtonProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            router.push("/signup");
            setLoading(false);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_Teh1L7VccWK1MV",
                amount: planPrice * 100, // amount in the smallest currency unit
                currency: "INR",
                name: "Digital Heroes",
                description: `Purchase ${planName}`,
                handler: async function (response: any) {
                    await supabase.from("profiles").update({
                        subscription_status: "active",
                        subscription_plan: 'monthly',
                        plan: planId,
                        razorpay_customer_id: response.razorpay_payment_id
                    }).eq("id", session.user.id);

                    router.push("/dashboard");
                    router.refresh();
                },
                prefill: {
                    email: session.user.email,
                },
                theme: {
                    color: "#4F46E5",
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on("payment.failed", function (response: any) {
                alert("Payment failed: " + response.error.description);
                setLoading(false);
            });
            rzp.open();
        };

        // If the script fails to load, gracefully handle it
        script.onerror = () => {
            alert("Failed to load Razorpay payment gateway.");
            setLoading(false);
        };

        document.body.appendChild(script);
    };

    return (
        <button onClick={handlePayment} disabled={loading}
            style={{ fontFamily: "var(--font-inter)" }}
            className={`w-full py-3.5 rounded-xl text-[14px] font-semibold transition-all mt-auto ${highlighted
                ? "bg-white text-[#4F46E5] hover:bg-[#EEF2FF]"
                : "bg-[#4F46E5] text-white hover:bg-[#4338CA] shadow-[0_2px_12px_rgba(79,70,229,0.2)]"
                }`}>
            {loading ? "Processing..." : `Join ${planName.split(" ")[0]}`}
        </button>
    );
}
