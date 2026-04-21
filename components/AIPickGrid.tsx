import Link from "next/link";
import { aiPicks, fmt, signCls, signStr } from "@/lib/mockData";

export function AIPickGrid() {
  return (
    <section id="ai" className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3 px-1">
        <h2 className="text-lg font-bold tracking-tight">
          AI 추천 TOP <span className="text-[var(--color-accent)]">오늘의 픽</span>
        </h2>
        <div className="hidden gap-3 text-xs sm:flex">
          <span className="text-[var(--color-claude)]">● Claude</span>
          <span className="text-[var(--color-gemini)]">● Gemini</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {aiPicks.map((p) => (
          <Link
            key={p.ticker}
            href={`/stock/${p.ticker}`}
            className="group relative flex cursor-pointer flex-col gap-4 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elev)] p-5 transition-all hover:-translate-y-1 hover:border-[var(--color-accent)] hover:shadow-[0_12px_40px_rgba(124,92,255,0.15)]"
          >
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[var(--color-claude)] via-[var(--color-consensus)] to-[var(--color-gemini)]" />

            {/* Header: ticker + price */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 pl-0.5">
                <div className="truncate text-[22px] font-extrabold tracking-tight">{p.ticker}</div>
                <div className="mt-0.5 truncate text-[12px] text-[var(--color-text-dim)]">
                  {p.name}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[15px] font-bold tabular-nums">{fmt(p.price)}</div>
                <div className={`text-[13px] font-bold ${signCls(p.chg)}`}>{signStr(p.chg)}</div>
              </div>
            </div>

            {/* Big AI scores */}
            <div className="flex gap-3">
              <div className="flex flex-1 flex-col gap-1.5 rounded-xl bg-[var(--color-bg-elev-2)] px-3.5 py-3">
                <span className="text-[10px] font-bold tracking-widest text-[var(--color-text-dim)]">
                  CLAUDE
                </span>
                <span className="text-[28px] font-extrabold leading-none text-[var(--color-claude)]">
                  {p.claude}
                </span>
                <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/5">
                  <span
                    className="block h-full rounded-full bg-[var(--color-claude)]"
                    style={{ width: `${p.claude}%` }}
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-1.5 rounded-xl bg-[var(--color-bg-elev-2)] px-3.5 py-3">
                <span className="text-[10px] font-bold tracking-widest text-[var(--color-text-dim)]">
                  GEMINI
                </span>
                <span className="text-[28px] font-extrabold leading-none text-[var(--color-gemini)]">
                  {p.gemini}
                </span>
                <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/5">
                  <span
                    className="block h-full rounded-full bg-[var(--color-gemini)]"
                    style={{ width: `${p.gemini}%` }}
                  />
                </div>
              </div>
            </div>

            {/* One-line summary */}
            <p className="mt-auto border-t border-dashed border-[var(--color-border)] pl-0.5 pt-3 text-[12px] leading-relaxed text-[var(--color-text-dim)]">
              {p.summary}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
