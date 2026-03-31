"use client";

import { FormEvent } from "react";
import { HapticButton } from "./HapticButton";

type SearchHeroProps = {
  query: string;
  onQueryChange: (v: string) => void;
  onSearch: () => void;
  searching: boolean;
};

export function SearchHero({
  query,
  onQueryChange,
  onSearch,
  searching,
}: SearchHeroProps) {
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSearch();
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-5 pt-16 pb-10">
      <div className="text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-white/5 px-4 py-2 text-xs text-zinc-200 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-300/90 shadow-[0_0_18px_rgba(34,211,238,0.55)]" />
          Market Intelligence, synthesized by agents
        </div>

        <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-zinc-50 md:text-5xl">
          Ask Pulse-Check about any market, token, or narrative.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-7 text-zinc-400">
          Two opposing agents stream their reasoning in real-time: Alpha (bullish)
          and Beta (bearish). Compare conviction, risks, and catalysts at a
          glance.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-10">
        <div className="relative">
          <div className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-400/25 via-blue-500/15 to-cyan-400/10 blur-xl" />
          <div className="relative rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-xl shadow-[0_0_0_1px_rgba(34,211,238,0.06),0_30px_80px_rgba(0,0,0,0.55)]">
            <div className="flex items-center gap-2">
              <div className="flex flex-1 items-center gap-3 rounded-xl bg-zinc-950/40 px-4 py-4">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    searching
                      ? "animate-pulse bg-cyan-300/90"
                      : "bg-cyan-300/70"
                  } shadow-[0_0_22px_rgba(34,211,238,0.45)]`}
                />
                <input
                  value={query}
                  onChange={(e) => onQueryChange(e.target.value)}
                  placeholder="e.g. ETH staking outlook, AI tokens rotation, Solana memecoin risk…"
                  className="w-full bg-transparent text-base text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
                  aria-label="Search market topic"
                />
              </div>

              <HapticButton
                type="submit"
                disabled={searching || query.trim().length === 0}
                className="rounded-xl border border-cyan-400/20 bg-gradient-to-b from-cyan-300/15 to-blue-500/10 px-5 py-4 text-sm font-semibold text-zinc-100 shadow-[0_0_24px_rgba(34,211,238,0.18)] transition disabled:cursor-not-allowed disabled:opacity-50 hover:border-cyan-400/35"
              >
                {searching ? "Analyzing…" : "Analyze"}
              </HapticButton>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

