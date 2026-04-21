import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * GET /api/news?limit=5
 *   최근 뉴스를 발행일 내림차순으로 반환.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "5", 10), 50);

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("news_items")
    .select("id, source, title, summary, url, published_at, category, image_url")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}
