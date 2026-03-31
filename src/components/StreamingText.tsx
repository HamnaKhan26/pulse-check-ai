"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type StreamingTextProps = {
  text: string;
  active: boolean;
  speedMs?: number;
  className?: string;
  onDone?: () => void;
};

export function StreamingText({
  text,
  active,
  speedMs = 12,
  className,
  onDone,
}: StreamingTextProps) {
  const [shown, setShown] = useState("");
  const doneCalledRef = useRef(false);
  const onDoneRef = useRef(onDone);

  const normalized = useMemo(() => text ?? "", [text]);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    setShown(active ? "" : normalized);
    doneCalledRef.current = false;
  }, [active, normalized]);

  useEffect(() => {
    if (!active) return;
    if (!normalized) return;

    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setShown(normalized.slice(0, i));
      if (i >= normalized.length) {
        window.clearInterval(id);
        if (!doneCalledRef.current) {
          doneCalledRef.current = true;
          onDoneRef.current?.();
        }
      }
    }, Math.max(6, speedMs));

    return () => window.clearInterval(id);
  }, [active, normalized, speedMs]);

  return (
    <div className={className}>
      <span className="whitespace-pre-wrap">{shown}</span>
      {active && shown.length < normalized.length ? (
        <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-[2px] animate-pulse rounded-full bg-cyan-300/80" />
      ) : null}
    </div>
  );
}

