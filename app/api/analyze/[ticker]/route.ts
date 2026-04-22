import { NextResponse } from "next/server";
import { getAnalyses } from "@/lib/analysis";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60; // Vercel 기본 10초 → AI 호출을 위해 60초로

/**
 * GET/POST /api/analyze/:ticker
 *   Claude + Gemini 분석을 동시 실행 (캐시 있으면 캐시 반환).
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;
  const t = decodeURIComponent(ticker);
  const result = await getAnalyses(t);
  return NextResponse.json({ ticker: t, ...result });
}

export const POST = GET;
