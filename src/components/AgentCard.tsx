"use client";

import { motion } from "framer-motion";
import { StreamingText } from "./StreamingText";

type AgentCardProps = {
  title: string;
  tone: "bullish" | "bearish";
  status: string;
  isStreaming: boolean;
  searchKey: number;
  text: string;
  confidence: number;
  onStreamDone?: () => void;
};

export function AgentCard({
  title,
  tone,
  status,
  isStreaming,
  searchKey,
  text,
  confidence,
  onStreamDone,
}: AgentCardProps) {
  const accent =
    tone === "bullish"
      ? {
          chip: "bg-emerald-400/10 text-emerald-200 ring-emerald-400/20",
          glow: "shadow-[0_0_0_1px_rgba(16,185,129,0.14),0_18px_60px_rgba(0,0,0,0.45)]",
          edge: "from-emerald-300/15 via-cyan-300/10 to-transparent",
          dot: "bg-emerald-300/90",
        }
      : {
          chip: "bg-rose-400/10 text-rose-200 ring-rose-400/20",
          glow: "shadow-[0_0_0_1px_rgba(244,63,94,0.14),0_18px_60px_rgba(0,0,0,0.45)]",
          edge: "from-rose-300/15 via-blue-300/10 to-transparent",
          dot: "bg-rose-300/90",
        };

  return (
    <motion.section
      key={searchKey}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl ${accent.glow}`}
    >
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r ${accent.edge}`}
      />
      <div className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className={`h-2 w-2 rounded-full ${accent.dot}`} />
            <h2 className="truncate text-sm font-semibold text-zinc-100">
              {title}
            </h2>
          </div>
          <div className="mt-2 text-xs text-zinc-400">
            {status}
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-medium ring-1 ${accent.chip}`}
        >
          {tone === "bullish" ? "Bullish" : "Bearish"}
        </span>
      </div>

      <div className="px-5 pb-5">
        <div className="max-h-[360px] overflow-y-auto rounded-xl border border-white/10 bg-zinc-950/35 p-4 [scrollbar-color:rgba(34,211,238,0.35)_transparent] [scrollbar-width:thin]">
          <StreamingText
            text={text}
            active={isStreaming}
            onDone={onStreamDone}
            className="text-sm leading-6 text-zinc-200"
          />
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-4">
        <div className="mb-2 flex items-center justify-between text-[11px] text-zinc-400">
          <span>Confidence Level</span>
          <span className="font-medium text-zinc-200">{confidence}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-zinc-900/70 ring-1 ring-white/10">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              tone === "bullish"
                ? "bg-gradient-to-r from-emerald-300/90 to-cyan-300/85"
                : "bg-gradient-to-r from-rose-300/90 to-amber-300/85"
            }`}
            style={{ width: `${Math.max(0, Math.min(100, confidence))}%` }}
          />
        </div>
      </div>
    </motion.section>
  );
}

