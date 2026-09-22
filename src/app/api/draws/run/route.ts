import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateDrawNumbers, evaluateUserScores, calculatePrizes } from "@/lib/draw-engine";

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Check admin
    const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

    if (!profile?.is_admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { drawId, simulate = false } = body;

    if (!drawId) return NextResponse.json({ error: "drawId required" }, { status: 400 });

    // Fetch the draw
    const { data: draw } = await supabase
        .from("draws")
        .select("*")
        .eq("id", drawId)
        .single();

    if (!draw) return NextResponse.json({ error: "Draw not found" }, { status: 404 });

    // Generate draw numbers
    const drawNumbers = generateDrawNumbers();

    // Fetch all active subscribers' scores
    const { data: profiles } = await supabase
        .from("profiles")
        .select("id")
        .eq("subscription_status", "active");

    if (!profiles || profiles.length === 0) {
        return NextResponse.json({ drawNumbers, results: [], message: "No active subscribers" });
    }

    const userIds = profiles.map((p) => p.id);

    const { data: scores } = await supabase
        .from("scores")
        .select("user_id, value")
        .in("user_id", userIds);

    // Group scores per user
    const scoresByUser: Record<string, number[]> = {};
    for (const s of scores ?? []) {
        if (!scoresByUser[s.user_id]) scoresByUser[s.user_id] = [];
        scoresByUser[s.user_id].push(s.value);
    }

    // Evaluate each user
    const usersWithScores = userIds
        .filter((id) => scoresByUser[id]?.length > 0)
        .map((userId) => ({ userId, scores: scoresByUser[userId] }));

    const results = usersWithScores.map(({ userId, scores }) => {
        const { matchCount, tier, matches } = evaluateUserScores(scores, drawNumbers);
        return { userId, userScores: scores, matchCount, tier, matches };
    });

    // Prize pool: active subscribers × 50 (contribution per user, simplified)
    const prizePool = profiles.length * 50;
    const carryover = draw.jackpot_carryover ?? 0;
    const prizes = calculatePrizes(prizePool, carryover, results);

    // If simulation, return preview without writing
    if (simulate) {
        return NextResponse.json({ drawNumbers, results, prizes, simulate: true });
    }

    // Persist draw numbers
    await supabase
        .from("draws")
        .update({
            draw_numbers: drawNumbers,
            status: "published",
        })
        .eq("id", drawId);

    // Persist draw_entries for winners
    const entries = results
        .filter((r) => r.tier !== null)
        .map((r) => {
            const tier = prizes.find((p) => p.tier === r.tier);
            return {
                draw_id: drawId,
                user_id: r.userId,
                match_count: r.matchCount,
                tier: r.tier,
                prize_amount: tier?.perWinnerAmount ?? 0,
                payment_status: "pending",
                verification_status: "unsubmitted",
            };
        });

    if (entries.length > 0) {
        await supabase.from("draw_entries").insert(entries);
    }

    // Handle jackpot rollover
    const jackpotTier = prizes.find((p) => p.tier === "5match");
    if (jackpotTier && jackpotTier.winners.length === 0) {
        // Create next month draw stub with carryover
        await supabase.from("draws").update({
            jackpot_carryover: jackpotTier.rollover,
        }).eq("id", drawId);
    }

    return NextResponse.json({ drawNumbers, results, prizes, simulate: false });
}
