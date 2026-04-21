"use client";

import Link from "next/link";
import { useMemo } from "react";
import { watchlist, fmt, signCls, signStr } from "@/lib/mockData";

function randomSeries(n: number, up: boolean, seed: number) {
  const arr: number[] = [];
  let v = 50;
  let x = seed;
  for (let i = 0; i < n; i++) {
    x = (x * 9301 + 49297) % 233280;
    const r = x / 233280;
    v += (r - (up ? 0.35 : 0.65)) * 6;
    arr.push(v);
  }
  return arr;
}

function Sparkline({ points, up }: { points: number[]; up: boolean }) {
  const w = 160;
  const h = 36;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const step = w / (points.length - 1);
  const d = points
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${(h - ((p - min) / range) * h).toFixed(1)}`
    )
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-9 w-full">
      <path d={d} fill="none" stroke={up ? "#22c55e" : "#ef4444"} strokeWidth="1.8" />
    </svg>
  );
}

export function Watchlist() {
  const cards = useMemo(
    () =>
      watchlist.map((w, i) => ({
        ...w,
        series: randomSeries(24, w.chg >= 0, i + 1),
      })),
    []
  );

  return (
    <section
      id="watchlist"
      className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elev)] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-base font-bold tracking-tight">
          <span className="text-xl">⭐</span>
          <span>관심종목</span>
        </h2>
        <button className="rounded-lg border border-[var(--color-border)] bg-transparent px-3 py-1.5 text-xs font-semibold text-[var(--color-text-dim)] transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-text)]">
          + 추가
        </button>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
        {cards.map((w) => (
          <Link
            key={w.ticker}
            href={`/stock/${w.ticker}`}
            className="flex cursor-pointer flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elev-2)] p-4 transition-all hover:-translate-y-0.5 hover:border-[var(--color-accent)]"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 pl-0.5">
                <div className="truncate text-[15px] font-bold">{w.ticker}</div>
                <div className="truncate text-[11px] text-[var(--color-text-dim)]">{w.name}</div>
              </div>
              <div className={`whitespace-nowrap text-[13px] font-bold tabular-nums ${signCls(w.chg)}`}>
                {signStr(w.chg)}
              </div>
            </div>
            <div className="pl-0.5 text-[18px] font-extrabold tabular-nums">{fmt(w.price)}</div>
            <Sparkline points={w.series} up={w.chg >= 0} />
          </Link>
        ))}
      </div>
    </section>
  );
}
