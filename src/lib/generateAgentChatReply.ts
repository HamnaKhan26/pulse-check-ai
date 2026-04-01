/**
 * Deterministic, keyword-aware mock replies for the debate chat (no backend).
 */
export function generateAgentChatReply(
  topic: string,
  userMessage: string,
  agent: "alpha" | "beta"
): string {
  const t = topic.trim() || "this market";
  const m = userMessage.trim();
  const preview =
    m.length > 90 ? `${m.slice(0, 90)}…` : m || "(no message)";
  const seed = (t.length + m.length) % 3;

  const mentionsRisk =
    /risk|crash|scam|bubble|bear|short|dump|liquidat/i.test(m);
  const mentionsBull =
    /moon|pump|long|bull|breakout|ath|accumulat/i.test(m);

  if (agent === "alpha") {
    const angles = [
      `Fair challenge on "${preview}". For ${t}, I still lean constructive: the path of least resistance is higher as long as spot demand absorbs supply on pullbacks and funding stays non-euphoric.`,
      `I get the skepticism. On ${t}, the bull case isn't "hope"—it's structure: if higher lows persist and breadth doesn't collapse, continuation beats mean-reversion until proven otherwise.`,
      `Pushback noted. Alpha view: ${t} benefits when liquidity is supportive and narratives compound. Your point actually reinforces why staged sizing matters—add on confirmation, not on vibes.`,
    ];
    const tail = mentionsRisk
      ? ` The risks you raised are exactly why I want clean invalidation: if support breaks with volume, I de-risk fast—but until then, dips are features, not bugs.`
      : mentionsBull
        ? ` Chasing vertical moves is dangerous; I'd rather buy the first controlled pullback after strength than front-run euphoria.`
        : ` Watch for spot-led follow-through; if price rallies on thin participation, I tighten stops.`;

    return `${angles[seed]!}${tail}`;
  }

  const angles = [
    `On "${preview}"—that's the right question for ${t}. Beta view: upside can happen, but fragility rises when positioning crowds one direction and catalysts get priced early.`,
    `I'll argue the other side. For ${t}, the bearish read isn't "never up"—it's that drawdowns arrive faster than consensus expects when liquidity tightens or narratives slip.`,
    `Strong point, but here's the stress test for ${t}: if leadership narrows and correlations spike, you get violent mean reversion even in strong names.`,
  ];
  const tail = mentionsBull
    ? ` Chasing strength without a risk plan is how accounts get shredded—I'd rather miss the last 10% than give back 40%.`
    : mentionsRisk
      ? ` Your downside framing is compatible with my view: defense first, then offense if the tape proves itself.`
      : ` I'd need sustained spot accumulation + breadth expansion to flip from skeptical to committed long.`;

  return `${angles[seed]!}${tail}`;
}
