import { NextRequest, NextResponse } from "next/server";
import Parser from "rss-parser";
import { createAdminClient } from "@/lib/supabase";
import { RSS_FEEDS, type Feed } from "@/lib/newsFeeds";

/**
 * POST /api/news/crawl
 *   전체 RSS 피드를 크롤링하여 Supabase news_items 테이블에 upsert.
 *   - Vercel Cron에서 5분마다 호출 (vercel.json 참조)
 *   - 수동 호출도 가능: `curl -X POST http://localhost:3000/api/news/crawl`
 *
 * 인증: `CRON_SECRET` 환경변수가 있으면 `Authorization: Bearer <secret>` 검사.
 *      없으면 무인증 (개인용이라 OK, 운영은 설정 권장).
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // rss-parser 는 node api 필요

type RssItem = {
  title?: string;
  link?: string;
  pubDate?: string;
  isoDate?: string;
  contentSnippet?: string;
  content?: string;
  enclosure?: { url?: string };
  "media:thumbnail"?: { $?: { url?: string } };
  "media:content"?: { $?: { url?: string } };
};

const parser = new Parser<object, RssItem>({
  customFields: {
    item: [
      ["media:thumbnail", "media:thumbnail"],
      ["media:content", "media:content"],
    ],
  },
  timeout: 10000,
  headers: { "User-Agent": "StockHub/1.0 (+https://github.com/hatecas/stock)" },
});

function pickImage(item: RssItem, content?: string): string | null {
  if (item.enclosure?.url) return item.enclosure.url;
  if (item["media:thumbnail"]?.$?.url) return item["media:thumbnail"].$.url;
  if (item["media:content"]?.$?.url) return item["media:content"].$.url;
  if (content) {
    const m = content.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (m) return m[1];
  }
  return null;
}

function stripHtml(s: string | undefined): string {
  if (!s) return "";
  return s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, 500);
}

async function crawlFeed(feed: Feed) {
  const parsed = await parser.parseURL(feed.url);
  const rows = (parsed.items || []).slice(0, 15).map((item) => ({
    source: feed.source,
    title: (item.title || "").trim(),
    summary: stripHtml(item.contentSnippet || item.content),
    url: item.link || null,
    published_at: new Date(item.isoDate || item.pubDate || Date.now()).toISOString(),
    category: feed.category,
    image_url: pickImage(item, item.content),
    tickers: [],
  }));
  return rows.filter((r) => r.title && r.url);
}

export async function POST(req: NextRequest) {
  // 선택적 인증
  const expected = process.env.CRON_SECRET;
  if (expected) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${expected}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const supabase = createAdminClient();
  const results: Record<string, { ok: number; err?: string }> = {};

  // 각 피드를 병렬로 가져오되 실패는 무시
  await Promise.all(
    RSS_FEEDS.map(async (feed) => {
      try {
        const rows = await crawlFeed(feed);
        if (rows.length === 0) {
          results[feed.source] = { ok: 0 };
          return;
        }
        const { error } = await supabase
          .from("news_items")
          .upsert(rows, { onConflict: "url", ignoreDuplicates: false });
        if (error) throw error;
        results[feed.source] = { ok: rows.length };
      } catch (e) {
        results[feed.source] = { ok: 0, err: (e as Error).message };
      }
    })
  );

  const total = Object.values(results).reduce((s, r) => s + r.ok, 0);
  return NextResponse.json({ total, results });
}

// GET 으로도 호출 가능 (브라우저에서 편하게 테스트)
export async function GET(req: NextRequest) {
  return POST(req);
}
