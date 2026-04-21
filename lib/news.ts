import { createAdminClient } from "@/lib/supabase";
import { newsSlides as fallbackSlides, type NewsSlide } from "@/lib/mockData";

export type NewsRow = {
  id: number;
  source: string;
  title: string;
  summary: string | null;
  url: string | null;
  published_at: string;
  category: string | null;
  image_url: string | null;
};

const CATEGORY_TAG: Record<string, string> = {
  kr_market: "국내장 속보",
  us_market: "미국장",
  macro: "거시 경제",
  crypto: "암호화폐",
  general: "뉴스",
};

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 60000; // 분
  if (diff < 1) return "방금 전";
  if (diff < 60) return `${Math.round(diff)}분 전`;
  if (diff < 60 * 24) return `${Math.round(diff / 60)}시간 전`;
  return `${Math.round(diff / 60 / 24)}일 전`;
}

export async function getTopNewsSlides(limit = 5): Promise<NewsSlide[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("news_items")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) {
      return fallbackSlides;
    }

    return (data as NewsRow[]).map((n) => ({
      tag: CATEGORY_TAG[n.category ?? "general"] ?? "뉴스",
      title: n.title,
      desc: n.summary ?? "",
      src: `${n.source} · ${timeAgo(n.published_at)}`,
      image:
        n.image_url ??
        "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=900&q=80",
    }));
  } catch {
    return fallbackSlides;
  }
}
