import { createAdminClient } from "@/lib/supabase";
import type { Stock } from "@/lib/mockData";

/**
 * DB에서 최신 시세 + AI 점수를 결합해 Stock[] 반환.
 * 해당 국가 종목이 아직 DB에 없으면 빈 배열.
 */

type StockRow = {
  ticker: string;
  name: string;
  market: string;
  country: string | null;
};

type SnapshotRow = {
  ticker: string;
  price: number;
  change_pct: number;
  captured_at: string;
};

type AiRow = {
  ticker: string;
  provider: "claude" | "gemini";
  score: number;
  created_at: string;
};

async function buildStocks(country: "US" | "KR"): Promise<Stock[]> {
  const supabase = createAdminClient();
  const { data: stocks } = await supabase
    .from("stocks")
    .select("ticker, name, market, country")
    .eq("country", country)
    .returns<StockRow[]>();

  if (!stocks || stocks.length === 0) return [];

  const tickers = stocks.map((s) => s.ticker);

  const [{ data: snaps }, { data: ais }] = await Promise.all([
    supabase
      .from("price_snapshots")
      .select("ticker, price, change_pct, captured_at")
      .in("ticker", tickers)
      .order("captured_at", { ascending: false })
      .returns<SnapshotRow[]>(),
    supabase
      .from("ai_analyses")
      .select("ticker, provider, score, created_at")
      .in("ticker", tickers)
      .order("created_at", { ascending: false })
      .returns<AiRow[]>(),
  ]);

  const latestSnap: Record<string, SnapshotRow> = {};
  for (const r of snaps ?? []) {
    if (!latestSnap[r.ticker]) latestSnap[r.ticker] = r;
  }

  const claudeScore: Record<string, number> = {};
  const geminiScore: Record<string, number> = {};
  for (const a of ais ?? []) {
    if (a.provider === "claude" && claudeScore[a.ticker] === undefined)
      claudeScore[a.ticker] = a.score;
    if (a.provider === "gemini" && geminiScore[a.ticker] === undefined)
      geminiScore[a.ticker] = a.score;
  }

  return stocks
    .map<Stock>((s) => {
      const snap = latestSnap[s.ticker];
      return {
        ticker: s.ticker,
        name: s.name,
        market: s.market,
        price: Number(snap?.price ?? 0),
        chg: Number(snap?.change_pct ?? 0),
        claude: claudeScore[s.ticker] ?? 0,
        gemini: geminiScore[s.ticker] ?? 0,
      };
    })
    .filter((s) => s.price > 0); // 아직 시세 미수집 종목 제외
}

export async function getStocksLive(): Promise<{
  us: Stock[];
  kr: Stock[];
  gainers: Stock[];
  losers: Stock[];
  aiPicks: Array<Stock & { summary?: string }>;
}> {
  const [us, kr] = await Promise.all([buildStocks("US"), buildStocks("KR")]);
  const all = [...us, ...kr];
  const gainers = all.slice().sort((a, b) => b.chg - a.chg).slice(0, 10);
  const losers = all.slice().sort((a, b) => a.chg - b.chg).slice(0, 10);

  // AI Pick: AI 분석이 있는 종목 중 합의지수(=Claude+Gemini) 상위 4개
  // 없으면 상승률 상위 4개
  const analyzed = all.filter((s) => s.claude > 0 && s.gemini > 0);
  const aiPicksBase = analyzed.length >= 4
    ? analyzed.sort((a, b) => b.claude + b.gemini - (a.claude + a.gemini)).slice(0, 4)
    : all.slice().sort((a, b) => b.chg - a.chg).slice(0, 4);

  const aiPicks = await withSummaries(aiPicksBase);
  return { us, kr, gainers, losers, aiPicks };
}

async function withSummaries(stocks: Stock[]) {
  if (stocks.length === 0) return [];
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("ai_analyses")
    .select("ticker, provider, summary, created_at")
    .in("ticker", stocks.map((s) => s.ticker))
    .eq("provider", "claude")
    .order("created_at", { ascending: false });
  const byTicker: Record<string, string> = {};
  for (const r of data ?? []) {
    if (!byTicker[r.ticker]) byTicker[r.ticker] = r.summary ?? "";
  }
  return stocks.map((s) => ({ ...s, summary: byTicker[s.ticker] }));
}
