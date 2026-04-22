import { createAdminClient } from "@/lib/supabase";
import {
  analyzeWithClaude,
  analyzeWithGemini,
  MODELS,
  type AnalysisResult,
} from "@/lib/ai";

/**
 * 6시간 캐시.
 * ai_analyses 테이블에 저장된 최신 row가 6h 이내면 재사용, 아니면 새로 AI 호출.
 */
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

export type StoredAnalysis = AnalysisResult & {
  id: number;
  ticker: string;
  provider: "claude" | "gemini";
  model: string;
  created_at: string;
};

/** stocks 테이블의 FK 제약을 만족시키기 위해 최소 row를 upsert */
async function ensureStockRow(ticker: string) {
  const supabase = createAdminClient();
  await supabase
    .from("stocks")
    .upsert(
      { ticker, name: ticker, market: "UNKNOWN", country: "UNKNOWN" },
      { onConflict: "ticker", ignoreDuplicates: true }
    );
}

async function latestFromDb(ticker: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("ai_analyses")
    .select("*")
    .eq("ticker", ticker)
    .order("created_at", { ascending: false });

  const map: Partial<Record<"claude" | "gemini", StoredAnalysis>> = {};
  for (const row of data ?? []) {
    if (!map[row.provider as "claude" | "gemini"]) {
      map[row.provider as "claude" | "gemini"] = row as StoredAnalysis;
    }
  }
  return map;
}

function isFresh(row: StoredAnalysis | undefined): boolean {
  if (!row) return false;
  return Date.now() - new Date(row.created_at).getTime() < CACHE_TTL_MS;
}

/** Claude 또는 Gemini 한 쪽을 새로 호출해서 DB에 저장 */
async function runAndStore(
  ticker: string,
  provider: "claude" | "gemini"
): Promise<StoredAnalysis | null> {
  try {
    const fresh =
      provider === "claude"
        ? await analyzeWithClaude(ticker)
        : await analyzeWithGemini(ticker);

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("ai_analyses")
      .insert({
        ticker,
        provider,
        score: fresh.score,
        verdict: fresh.verdict,
        summary: fresh.summary,
        pros: fresh.pros,
        cons: fresh.cons,
        outlook: fresh.outlook,
        model: MODELS[provider],
      })
      .select()
      .single();

    if (error) {
      console.error(`[ai] insert failed (${provider}/${ticker}):`, error.message);
      return null;
    }
    return data as StoredAnalysis;
  } catch (e) {
    console.error(`[ai] ${provider} analysis failed for ${ticker}:`, (e as Error).message);
    return null;
  }
}

export async function getAnalyses(ticker: string): Promise<{
  claude: StoredAnalysis | null;
  gemini: StoredAnalysis | null;
}> {
  const ticker_ = ticker.toUpperCase();
  const cached = await latestFromDb(ticker_);
  const needClaude = !isFresh(cached.claude);
  const needGemini = !isFresh(cached.gemini);

  if (needClaude || needGemini) {
    await ensureStockRow(ticker_);
    const [claudeRes, geminiRes] = await Promise.all([
      needClaude ? runAndStore(ticker_, "claude") : Promise.resolve(cached.claude ?? null),
      needGemini ? runAndStore(ticker_, "gemini") : Promise.resolve(cached.gemini ?? null),
    ]);
    return {
      claude: claudeRes ?? cached.claude ?? null,
      gemini: geminiRes ?? cached.gemini ?? null,
    };
  }

  return {
    claude: cached.claude ?? null,
    gemini: cached.gemini ?? null,
  };
}
