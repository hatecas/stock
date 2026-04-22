import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { fetchKRQuote, fetchUSQuote, type Quote } from "@/lib/priceProviders";
import { KR_TICKERS, US_TICKERS } from "@/lib/tickers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * POST /api/prices/update
 *   모든 추적 종목의 시세를 가져와 Supabase에 저장.
 *   - stocks 마스터 upsert
 *   - price_snapshots insert (시계열)
 *   Vercel Cron에서 주기적으로 호출.
 */
export async function POST() {
  const supabase = createAdminClient();

  const [usResults, krResults] = await Promise.all([
    Promise.allSettled(US_TICKERS.map((t) => fetchUSQuote(t))),
    Promise.allSettled(KR_TICKERS.map((t) => fetchKRQuote(t))),
  ]);

  const all: Quote[] = [...usResults, ...krResults]
    .filter((r): r is PromiseFulfilledResult<Quote> => r.status === "fulfilled")
    .map((r) => r.value);

  const failures = [...usResults, ...krResults]
    .filter((r): r is PromiseRejectedResult => r.status === "rejected")
    .map((r) => String(r.reason));

  if (all.length === 0) {
    return NextResponse.json({ updated: 0, failures }, { status: 502 });
  }

  // 1) stocks 마스터 upsert (FK 만족)
  const { error: stockErr } = await supabase.from("stocks").upsert(
    all.map((s) => ({
      ticker: s.ticker,
      name: s.name,
      market: s.market,
      country: s.country,
    })),
    { onConflict: "ticker" }
  );
  if (stockErr) return NextResponse.json({ error: stockErr.message }, { status: 500 });

  // 2) price_snapshots insert
  const { error: snapErr } = await supabase.from("price_snapshots").insert(
    all.map((s) => ({
      ticker: s.ticker,
      price: s.price,
      change_pct: s.change_pct,
      volume: s.volume,
    }))
  );
  if (snapErr) return NextResponse.json({ error: snapErr.message }, { status: 500 });

  return NextResponse.json({
    updated: all.length,
    us: usResults.filter((r) => r.status === "fulfilled").length,
    kr: krResults.filter((r) => r.status === "fulfilled").length,
    failures: failures.length ? failures : undefined,
  });
}

export const GET = POST;
