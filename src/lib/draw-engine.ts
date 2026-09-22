/**
 * Draw Engine — Digital Heroes
 *
 * Generates 5 unique random draw numbers (1–45) and evaluates
 * each user's stored scores against them to determine prize tier.
 */

export type DrawTier = '5match' | '4match' | '3match' | null

export interface DrawResult {
    userId: string
    userScores: number[]
    matchCount: number
    tier: DrawTier
    matches: number[]
}

/**
 * Generates 5 unique random integers in the range [1, 45].
 */
export function generateDrawNumbers(): number[] {
    const pool = Array.from({ length: 45 }, (_, i) => i + 1)
    const drawn: number[] = []

    for (let i = 0; i < 5; i++) {
        const idx = Math.floor(Math.random() * pool.length)
        drawn.push(pool.splice(idx, 1)[0])
    }

    return drawn.sort((a, b) => a - b)
}

/**
 * Compares a user's stored scores against the draw numbers.
 * Returns match count, tier, and which numbers matched.
 */
export function evaluateUserScores(
    userScores: number[],
    drawNumbers: number[]
): { matchCount: number; tier: DrawTier; matches: number[] } {
    const drawSet = new Set(drawNumbers)
    const matches = userScores.filter((s) => drawSet.has(s))
    const matchCount = matches.length

    let tier: DrawTier = null
    if (matchCount === 5) tier = '5match'
    else if (matchCount === 4) tier = '4match'
    else if (matchCount === 3) tier = '3match'

    return { matchCount, tier, matches }
}

/**
 * Runs the draw for all participating users.
 * Returns draw numbers and each user's result.
 */
export function runDraw(
    drawNumbers: number[],
    users: { userId: string; scores: number[] }[]
): DrawResult[] {
    return users.map(({ userId, scores }) => {
        const { matchCount, tier, matches } = evaluateUserScores(scores, drawNumbers)
        return { userId, userScores: scores, matchCount, tier, matches }
    })
}

/**
 * Calculates prize distribution.
 * @param poolAmount  Total prize pool for this draw
 * @param carryover   Jackpot carryover from previous month
 * @param results     All draw results
 */
export interface PrizeDistribution {
    tier: DrawTier
    winners: string[]
    totalTierPool: number
    perWinnerAmount: number
    rollover: number
}

export function calculatePrizes(
    poolAmount: number,
    carryover: number,
    results: DrawResult[]
): PrizeDistribution[] {
    const fiveMatchWinners = results.filter((r) => r.tier === '5match').map((r) => r.userId)
    const fourMatchWinners = results.filter((r) => r.tier === '4match').map((r) => r.userId)
    const threeMatchWinners = results.filter((r) => r.tier === '3match').map((r) => r.userId)

    const jackpotPool = poolAmount * 0.4 + carryover
    const fourPool = poolAmount * 0.35
    const threePool = poolAmount * 0.25

    const distributions: PrizeDistribution[] = []

    // 5-match tier (with rollover if no winners)
    if (fiveMatchWinners.length > 0) {
        distributions.push({
            tier: '5match',
            winners: fiveMatchWinners,
            totalTierPool: jackpotPool,
            perWinnerAmount: jackpotPool / fiveMatchWinners.length,
            rollover: 0,
        })
    } else {
        distributions.push({
            tier: '5match',
            winners: [],
            totalTierPool: jackpotPool,
            perWinnerAmount: 0,
            rollover: jackpotPool, // rolls to next month
        })
    }

    // 4-match tier
    distributions.push({
        tier: '4match',
        winners: fourMatchWinners,
        totalTierPool: fourPool,
        perWinnerAmount: fourMatchWinners.length > 0 ? fourPool / fourMatchWinners.length : 0,
        rollover: 0,
    })

    // 3-match tier
    distributions.push({
        tier: '3match',
        winners: threeMatchWinners,
        totalTierPool: threePool,
        perWinnerAmount: threeMatchWinners.length > 0 ? threePool / threeMatchWinners.length : 0,
        rollover: 0,
    })

    return distributions
}
