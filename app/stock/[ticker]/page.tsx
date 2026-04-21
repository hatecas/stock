import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StockChart } from "@/components/StockChart";
import { AIAnalysis } from "@/components/AIAnalysis";
import { RelatedNews } from "@/components/RelatedNews";

export default async function StockDetail({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;
  const t = decodeURIComponent(ticker);

  // 임시 목업 — 나중에 Supabase/외부 API에서 조회
  const stock = {
    ticker: t,
    name: `${t} Corporation`,
    market: "NASDAQ",
    price: 487.23,
    chg: 3.82,
    chgAbs: 17.92,
  };

  const stats = [
    { label: "시가총액", value: "$1.2T" },
    { label: "PER", value: "68.2" },
    { label: "PBR", value: "42.4" },
    { label: "배당수익률", value: "0.02%" },
    { label: "52주 최고", value: "$502.66" },
    { label: "52주 최저", value: "$180.97" },
    { label: "거래량", value: "48.2M" },
    { label: "평균거래량", value: "52.1M" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[rgba(11,14,20,0.75)] backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1280px] items-center gap-6 px-10 py-3.5">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold">
            <span className="text-[22px] text-[var(--color-accent)]">◆</span>
            <span>StockHub</span>
          </Link>
          <Link
            href="/"
            className="ml-4 flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium text-[var(--color-text-dim)] transition-all hover:bg-[var(--color-bg-elev)] hover:text-white"
          >
            <ArrowLeft size={14} /> 대시보드
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-10 py-8">
        {/* Head */}
        <section className="flex items-start justify-between gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elev)] p-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-[32px] font-extrabold tracking-tight">{stock.ticker}</span>
              <span className="rounded-md bg-[var(--color-bg-elev-2)] px-2 py-0.5 text-[11px] text-[var(--color-text-dim)]">
                {stock.market}
              </span>
            </div>
            <div className="text-sm text-[var(--color-text-dim)]">{stock.name}</div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[28px] font-extrabold tabular-nums">
              ${stock.price.toFixed(2)}
            </span>
            <span className={`text-sm font-bold ${stock.chg >= 0 ? "up" : "down"}`}>
              {stock.chg >= 0 ? "+" : ""}
              ${stock.chgAbs.toFixed(2)} ({stock.chg >= 0 ? "+" : ""}
              {stock.chg.toFixed(2)}%)
            </span>
          </div>
        </section>

        {/* Chart + Stats */}
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elev)] p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[15px] font-semibold">📊 가격 차트</h2>
              <div className="flex gap-1 rounded-lg bg-[var(--color-bg-elev-2)] p-[3px]">
                {["1D", "1W", "1M", "3M", "1Y"].map((r, i) => (
                  <button
                    key={r}
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                      i === 0 ? "bg-[var(--color-accent)] text-white" : "text-[var(--color-text-dim)]"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <StockChart />
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elev)] p-5">
            <h2 className="mb-3 text-[15px] font-semibold">📋 핵심 지표</h2>
            <div className="grid grid-cols-2 gap-2.5">
              {stats.map((s) => (
                <div key={s.label} className="rounded-lg bg-[var(--color-bg-elev-2)] px-3 py-2.5">
                  <div className="text-[11px] text-[var(--color-text-dim)]">{s.label}</div>
                  <div className="text-sm font-bold tabular-nums">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <AIAnalysis ticker={stock.ticker} />
        <RelatedNews ticker={stock.ticker} />
      </main>

      <footer className="mx-auto mt-10 flex w-full max-w-[1280px] items-center justify-between border-t border-[var(--color-border)] px-10 py-6 text-xs text-[var(--color-text-dim)]">
        <div>StockHub · 개인용 대시보드</div>
        <div>데이터는 샘플입니다.</div>
      </footer>
    </>
  );
}
