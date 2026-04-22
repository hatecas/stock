import { TopBar } from "@/components/TopBar";
import { NewsSlider } from "@/components/NewsSlider";
import { AIPickGrid } from "@/components/AIPickGrid";
import { StockTable } from "@/components/StockTable";
import { RankList } from "@/components/RankList";
import { Watchlist } from "@/components/Watchlist";
import { Heatmap } from "@/components/Heatmap";
import {
  usStocks as mockUs,
  krStocks as mockKr,
  gainers as mockGainers,
  losers as mockLosers,
} from "@/lib/mockData";
import { getTopNewsSlides } from "@/lib/news";
import { getStocksLive } from "@/lib/prices";

export const revalidate = 60;

export default async function Home() {
  const [slides, live] = await Promise.all([getTopNewsSlides(5), getStocksLive()]);

  const usStocks = live.us.length > 0 ? live.us : mockUs;
  const krStocks = live.kr.length > 0 ? live.kr : mockKr;
  const gainers = live.gainers.length > 0
    ? live.gainers.map((s) => ({ ticker: s.ticker, name: s.name, price: s.price, chg: s.chg }))
    : mockGainers;
  const losers = live.losers.length > 0
    ? live.losers.map((s) => ({ ticker: s.ticker, name: s.name, price: s.price, chg: s.chg }))
    : mockLosers;

  return (
    <>
      <TopBar />

      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-6 py-8 md:px-10">
        <NewsSlider slides={slides} />
        <AIPickGrid picks={live.aiPicks} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <StockTable id="us" title="미국주식" flag="🇺🇸" stocks={usStocks} />
          <StockTable id="kr" title="국내주식" flag="🇰🇷" stocks={krStocks} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RankList id="gainers" title="실시간 상승주" icon="📈" items={gainers} />
          <RankList id="losers" title="실시간 하락주" icon="📉" items={losers} />
        </div>

        <Watchlist />
        <Heatmap />
      </main>

      <footer className="mx-auto mt-10 flex w-full max-w-[1280px] items-center justify-between border-t border-[var(--color-border)] px-10 py-6 text-xs text-[var(--color-text-dim)]">
        <div>StockHub · 개인용 대시보드</div>
        <div>실시간 시세 (Yahoo Finance · 네이버 금융)</div>
      </footer>
    </>
  );
}
