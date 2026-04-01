"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { HapticButton } from "./HapticButton";
import { generateAgentChatReply } from "@/src/lib/generateAgentChatReply";

export type ChatMessage = {
  id: string;
  role: "user" | "alpha" | "beta";
  text: string;
};

type DebateChatProps = {
  topic: string;
  /** When set, chat input is disabled and a contextual hint is shown. */
  lockReason?: "need_analysis" | "busy" | null;
};

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function DebateChat({ topic, lockReason }: DebateChatProps) {
  const disabled = lockReason != null;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState<"alpha" | "beta" | null>(null);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing, scrollToBottom]);

  const send = useCallback(() => {
    const text = input.trim();
    if (!text || disabled || sending) return;

    const ctx = topic.trim() || "the market";
    setInput("");
    setSending(true);
    setMessages((m) => [...m, { id: uid(), role: "user", text }]);

    setTyping("alpha");
    window.setTimeout(() => {
      const alphaText = generateAgentChatReply(ctx, text, "alpha");
      setMessages((m) => [
        ...m,
        { id: uid(), role: "alpha", text: alphaText },
      ]);
      setTyping("beta");
      window.setTimeout(() => {
        const betaText = generateAgentChatReply(ctx, text, "beta");
        setMessages((m) => [
          ...m,
          { id: uid(), role: "beta", text: betaText },
        ]);
        setTyping(null);
        setSending(false);
      }, 650);
    }, 550);
  }, [input, topic, disabled, sending]);

  return (
    <section className="mt-2 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-100">
            Debate with both agents
          </h3>
          <p className="mt-1 text-xs text-zinc-500">
            Push back, ask for evidence, or stress-test the thesis — Alpha and
            Beta reply in turn.
          </p>
        </div>
        {messages.length > 0 ? (
          <button
            type="button"
            onClick={() => {
              setMessages([]);
              setTyping(null);
              setSending(false);
            }}
            className="text-[11px] font-medium text-zinc-500 underline-offset-2 hover:text-cyan-300/90 hover:underline"
          >
            Clear chat
          </button>
        ) : null}
      </div>

      <div className="max-h-[min(420px,50vh)] space-y-3 overflow-y-auto rounded-xl border border-white/10 bg-zinc-950/40 p-4 [scrollbar-color:rgba(34,211,238,0.35)_transparent] [scrollbar-width:thin]">
        {messages.length === 0 && !typing ? (
          <p className="text-center text-sm text-zinc-500">
            {lockReason === "need_analysis"
              ? "Run Analyze on a topic first — then you can push back and both agents will reply."
              : lockReason === "busy"
                ? "Wait for the current analysis to finish — then debate here."
                : "Type a message — both agents will respond in turn."}
          </p>
        ) : null}

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-cyan-500/15 text-zinc-100 ring-1 ring-cyan-400/20"
                    : msg.role === "alpha"
                      ? "bg-emerald-500/10 text-zinc-200 ring-1 ring-emerald-400/15"
                      : "bg-rose-500/10 text-zinc-200 ring-1 ring-rose-400/15"
                }`}
              >
                <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                  {msg.role === "user"
                    ? "You"
                    : msg.role === "alpha"
                      ? "Agent Alpha"
                      : "Agent Beta"}
                </div>
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {typing ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-xs text-zinc-500"
          >
            <span
              className={`inline-flex h-2 w-2 animate-pulse rounded-full ${
                typing === "alpha" ? "bg-emerald-400" : "bg-rose-400"
              }`}
            />
            {typing === "alpha"
              ? "Agent Alpha is typing…"
              : "Agent Beta is typing…"}
          </motion.div>
        ) : null}

        <div ref={bottomRef} />
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          rows={2}
          placeholder="Challenge the thesis, ask for data, or play devil's advocate…"
          disabled={disabled || sending}
          className="min-h-[72px] flex-1 resize-y rounded-xl border border-white/10 bg-zinc-950/50 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-cyan-400/30 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 disabled:opacity-50"
        />
        <HapticButton
          type="button"
          onClick={send}
          disabled={disabled || sending || !input.trim()}
          className="shrink-0 rounded-xl border border-cyan-400/25 bg-gradient-to-b from-cyan-300/15 to-blue-500/10 px-6 py-3 text-sm font-semibold text-zinc-100 shadow-[0_0_20px_rgba(34,211,238,0.12)] transition disabled:cursor-not-allowed disabled:opacity-40 hover:border-cyan-400/40"
        >
          Send
        </HapticButton>
      </div>
    </section>
  );
}
