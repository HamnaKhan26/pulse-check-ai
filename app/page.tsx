"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgentCard } from "@/src/components/AgentCard";
import { PulseCheckHeader } from "@/src/components/PulseCheckHeader";
import { SearchHero } from "@/src/components/SearchHero";

type AgentResult = {
  alpha: string;
  beta: string;
  alphaConfidence: number;
  betaConfidence: number;
};

function generateMarketAnalysis(topic: string): AgentResult {
  const q = topic.trim();
  const headline = q.length ? q : "the market";
  const lower = headline.toLowerCase();

  const riskContext = lower.includes("ai")
    ? "AI-linked tokens remain sensitivity-heavy to narrative rotation and quarterly product releases."
    : lower.includes("eth") || lower.includes("ethereum")
      ? "Ethereum sensitivity centers on staking flows, L2 activity, and fee compression regimes."
      : lower.includes("sol") || lower.includes("solana")
        ? "Solana remains highly momentum-driven with pronounced retail flow reflexivity."
        : lower.includes("btc") || lower.includes("bitcoin")
          ? "Bitcoin typically leads macro risk repricing and liquidity beta across majors."
          : "The setup is driven by cross-asset liquidity, positioning concentration, and catalyst quality.";

  const alphaConfidence = 62 + ((headline.length * 7) % 25);
  const betaConfidence = 55 + ((headline.length * 5) % 30);

  const alpha = `Thesis (Alpha): ${headline} shows constructive upside potential if liquidity remains supportive and headline risk stays contained.\n\nMarket read\n${riskContext}\nOrder-flow character looks healthier when dips are absorbed quickly and open interest expands without extreme funding.\n\nBullish catalysts\n- Momentum continuation above recent acceptance zones\n- Improving social + on-chain engagement quality\n- Positive reflexive loop: strength attracts incremental spot demand\n\nPositioning framework\n- Prefer staged entries on pullbacks into support\n- Add only after confirmation closes above resistance\n- De-risk into extension moves to protect realized gains\n\nInvalidation\n- Repeated rejection at reclaim levels with weakening breadth\n- Sharp rise in leverage without matching spot demand`;

  const beta = `Thesis (Beta): ${headline} remains vulnerable to downside repricing while macro uncertainty and crowded narratives stay elevated.\n\nRisk read\n${riskContext}\nCurrent structure can degrade quickly if liquidity thins, especially when positioning gets one-sided and catalysts disappoint.\n\nBearish triggers\n- Loss of key support with broad market correlation uptick\n- Rising funding while spot volume fades (late-cycle squeeze risk)\n- Defensive macro tape: stronger dollar, higher real yields\n\nRisk management view\n- Treat weak bounces as distribution unless breadth recovers\n- Keep tighter stops around event windows\n- Prefer hedged or reduced gross exposure in choppy ranges\n\nWhat flips this view\n- Sustained reclaim + hold above major resistance\n- Healthier breadth and persistent spot-led accumulation`;

  return { alpha, beta, alphaConfidence, betaConfidence };
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [phase, setPhase] = useState<"idle" | "scanning" | "streaming">("idle");
  const [searchKey, setSearchKey] = useState(0);
  const [alphaText, setAlphaText] = useState(
    "Enter a topic above to stream Alpha's bullish read."
  );
  const [betaText, setBetaText] = useState(
    "Enter a topic above to stream Beta's bearish read."
  );
  const [alphaConfidence, setAlphaConfidence] = useState(0);
  const [betaConfidence, setBetaConfidence] = useState(0);
  const [spotlight, setSpotlight] = useState({ x: -300, y: -300 });

  const doneRef = useRef({ alpha: false, beta: false });
  const timerRef = useRef<number | null>(null);

  const hasQuery = useMemo(() => query.trim().length > 0, [query]);

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      setSpotlight({ x: e.clientX, y: e.clientY });
    }

    window.addEventListener("mousemove", handleMove);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  function startSearch() {
    if (!hasQuery) return;

    const outputs = generateMarketAnalysis(query);
    doneRef.current = { alpha: false, beta: false };
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }

    setSearching(true);
    setPhase("scanning");
    setSearchKey((k) => k + 1);
    setAlphaText("Scanning Markets...");
    setBetaText("Scanning Markets...");
    setAlphaConfidence(outputs.alphaConfidence);
    setBetaConfidence(outputs.betaConfidence);

    timerRef.current = window.setTimeout(() => {
      setPhase("streaming");
      setAlphaText(outputs.alpha);
      setBetaText(outputs.beta);
    }, 2000);
  }

  const handleStreamDone = useCallback((which: "alpha" | "beta") => {
    if (phase !== "streaming") return;
    doneRef.current = { ...doneRef.current, [which]: true };
    if (doneRef.current.alpha && doneRef.current.beta) {
      setSearching(false);
      setPhase("idle");
    }
  }, [phase]);

  const handleAlphaDone = useCallback(() => {
    handleStreamDone("alpha");
  }, [handleStreamDone]);

  const handleBetaDone = useCallback(() => {
    handleStreamDone("beta");
  }, [handleStreamDone]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `radial-gradient(260px circle at ${spotlight.x}px ${spotlight.y}px, rgba(34,211,238,0.16), rgba(34,211,238,0.06) 35%, transparent 72%)`,
        }}
      />
      <PulseCheckHeader />

      <main className="relative z-10 mx-auto w-full max-w-6xl">
        <SearchHero
          query={query}
          onQueryChange={setQuery}
          onSearch={startSearch}
          searching={searching}
        />

        <section className="px-5 pb-16">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <AgentCard
              title="Agent Alpha"
              tone="bullish"
              status={
                phase === "scanning"
                  ? "Scanning Markets..."
                  : searching
                    ? "Streaming analysis..."
                    : "Ready."
              }
              isStreaming={phase === "streaming"}
              searchKey={searchKey}
              text={alphaText}
              confidence={alphaConfidence}
              onStreamDone={handleAlphaDone}
            />
            <AgentCard
              title="Agent Beta"
              tone="bearish"
              status={
                phase === "scanning"
                  ? "Scanning Markets..."
                  : searching
                    ? "Streaming analysis..."
                    : "Ready."
              }
              isStreaming={phase === "streaming"}
              searchKey={searchKey}
              text={betaText}
              confidence={betaConfidence}
              onStreamDone={handleBetaDone}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

