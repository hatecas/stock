/**
 * 시세 제공자.
 * - 미국: Yahoo Finance unofficial chart API (키 불필요)
 * - 국내: 네이버 모바일 증권 API (키 불필요)
 */

export type Quote = {
  ticker: string;
  name: string;
  market: string;
  country: "US" | "KR";
  price: number;
  change_pct: number;
  volume: number;
};

const UA = "Mozilla/5.0 (StockHub/0.1)";

/* --------------- US (Yahoo Finance) --------------- */

export async function fetchUSQuote(ticker: string): Promise<Quote> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    ticker
  )}?interval=1d&range=5d`;
  const r = await fetch(url, { headers: { "User-Agent": UA }, cache: "no-store" });
  if (!r.ok) throw new Error(`Yahoo ${ticker}: HTTP ${r.status}`);
  const d = await r.json();
  const result = d?.chart?.result?.[0];
  if (!result?.meta) throw new Error(`Yahoo ${ticker}: no meta`);

  const m = result.meta;
  const price = Number(m.regularMarketPrice);
  const prev = Number(m.chartPreviousClose ?? m.previousClose ?? price);
  const change_pct = prev ? ((price - prev) / prev) * 100 : 0;

  return {
    ticker,
    name: String(m.longName || m.shortName || ticker),
    market: String(m.fullExchangeName || m.exchangeName || "NASDAQ"),
    country: "US",
    price: Number.isFinite(price) ? price : 0,
    change_pct: Number.isFinite(change_pct) ? change_pct : 0,
    volume: Number(m.regularMarketVolume ?? 0),
  };
}

/* --------------- KR (Naver Finance) --------------- */

type NaverTotalInfo = { code: string; key: string; value: string };

type NaverIntegration = {
  stockName?: string;
  stockExchangeType?: { name?: string; code?: string };
  dealTrendInfos?: Array<{ closePrice?: string }>;
  totalInfos?: NaverTotalInfo[];
};

export async function fetchKRQuote(code: string): Promise<Quote> {
  const url = `https://m.stock.naver.com/api/stock/${encodeURIComponent(code)}/integration`;
  const r = await fetch(url, { headers: { "User-Agent": UA }, cache: "no-store" });
  if (!r.ok) throw new Error(`Naver ${code}: HTTP ${r.status}`);
  const d = (await r.json()) as NaverIntegration;

  const toNum = (s: string | undefined) => Number((s ?? "0").replace(/,/g, ""));
  const findVal = (k: string) => d.totalInfos?.find((x) => x.code === k)?.value;

  const priceStr =
    findVal("closePrice") ?? d.dealTrendInfos?.[0]?.closePrice ?? "0";
  const price = toNum(priceStr);
  const change_pct = Number(findVal("fluctuationsRatio")?.replace(/,/g, "") ?? "0");
  const volume = toNum(findVal("accumulatedTradingVolume"));

  return {
    ticker: code,
    name: String(d.stockName || code),
    market: String(d.stockExchangeType?.name || d.stockExchangeType?.code || "KOSPI"),
    country: "KR",
    price,
    change_pct: Number.isFinite(change_pct) ? change_pct : 0,
    volume,
  };
}
