"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Stock, fmt, signCls, signStr } from "@/lib/mockData";

type Tab = "gainers" | "losers" | "volume";

export function StockTable({
  id,
  title,
  flag,
  stocks,
}: {
  id: string;
  title: string;
  flag: string;
  stocks: Stock[];
}) {
  const [tab, setTab] = useState<Tab>("gainers");

  const sorted = useMemo(() => {
    const rows = stocks.slice();
    if (tab === "gainers") rows.sort((a, b) => b.chg - a.chg);
    if (tab === "losers") rows.sort((a, b) => a.chg - b.chg);
    if (tab === "volume") rows.sort((a, b) => b.claude + b.gemini - (a.claude + a.gemini));
    return rows;
  }, [tab, stocks]);

  return (
    <section
      id={id}
      className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elev)] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-base font-bold tracking-tight">
          <span className="text-xl">{flag}</span>
          <span>{title}</span>
        </h2>
        <div className="flex gap-1 rounded-lg bg-[var(--color-bg-elev-2)] p-1">
          {(["gainers", "losers", "volume"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                tab === t
                  ? "bg-[var(--color-accent)] text-white"
                  : "text-[var(--color-text-dim)] hover:text-[var(--color-text)]"
              }`}
            >
              {t === "gainers" ? "상승" : t === "losers" ? "하락" : "거래량"}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[14px]">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-dim)]">
              <th className="w-8 px-2 py-3 text-left">#</th>
              <th className="px-2 py-3 pl-3 text-left">종목</th>
              <th className="px-2 py-3 text-right">현재가</th>
              <th className="px-2 py-3 text-right">등락</th>
              <th className="px-2 py-3 text-center">Claude</th>
              <th className="px-2 py-3 text-center">Gemini</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s, i) => (
              <tr
                key={s.ticker}
                className="border-b border-[var(--color-border)] transition-colors last:border-0 hover:bg-[var(--color-bg-elev-2)]"
              >
                <td className="px-2 py-3.5 text-left font-bold text-[var(--color-muted)]">
                  {i + 1}
                </td>
                <td className="px-2 py-3.5 pl-3">
                  <Link href={`/stock/${s.ticker}`} className="flex flex-col gap-0.5">
                    <span className="text-[14px] font-bold">{s.ticker}</span>
                    <span className="truncate text-[11px] text-[var(--color-text-dim)]">
                      {s.name}
                    </span>
                  </Link>
                </td>
                <td className="px-2 py-3.5 text-right font-semibold tabular-nums">
                  {fmt(s.price)}
                </td>
                <td className={`px-2 py-3.5 text-right font-bold tabular-nums ${signCls(s.chg)}`}>
                  {signStr(s.chg)}
                </td>
                <td className="px-2 py-3.5 text-center">
                  <span className="inline-flex min-w-[44px] items-center justify-center rounded-full border border-[rgba(217,119,87,0.3)] bg-[rgba(217,119,87,0.15)] px-2 py-1 text-[12px] font-bold text-[var(--color-claude)]">
                    {s.claude}
                  </span>
                </td>
                <td className="px-2 py-3.5 text-center">
                  <span className="inline-flex min-w-[44px] items-center justify-center rounded-full border border-[rgba(66,133,244,0.3)] bg-[rgba(66,133,244,0.15)] px-2 py-1 text-[12px] font-bold text-[var(--color-gemini)]">
                    {s.gemini}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
