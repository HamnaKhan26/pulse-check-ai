"use client";

import { HapticButton } from "./HapticButton";

export function PulseCheckHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-zinc-950/35 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-cyan-400/20 bg-white/5 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(34,211,238,0.35),transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(59,130,246,0.25),transparent_55%)]" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide text-zinc-50">
              Pulse-Check
            </div>
            <div className="text-[11px] text-zinc-400">
              Multi-Agent Market Intelligence
            </div>
          </div>
        </div>

        <HapticButton
          className="rounded-full border border-cyan-400/20 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-100 shadow-[0_0_0_1px_rgba(34,211,238,0.06),0_12px_30px_rgba(0,0,0,0.35)] transition hover:border-cyan-400/35 hover:bg-white/8"
          type="button"
          aria-label="Connect Wallet"
        >
          Connect Wallet
        </HapticButton>
      </div>
    </header>
  );
}

