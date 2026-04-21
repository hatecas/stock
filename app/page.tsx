import { TopBar } from "@/components/TopBar";
import { NewsSlider } from "@/components/NewsSlider";
import { AIPickGrid } from "@/components/AIPickGrid";
import { StockTable } from "@/components/StockTable";
import { RankList } from "@/components/RankList";
import { Watchlist } from "@/components/Watchlist";
import { Heatmap } from "@/components/Heatmap";
import { usStocks, krStocks, gainers, losers } from "@/lib/mockData";

export default function Home() {
  return (
    <>
      <TopBar />

      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-6 py-8 md:px-10">
        <NewsSlider />
        <AIPickGrid />

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
        <div>데이터는 샘플입니다. 실시간 연동은 백엔드 작업 후 제공됩니다.</div>
      </footer>
    </>
  );
}
