/**
 * 뉴스 RSS 피드 목록
 * 새 피드 추가할 때 여기만 수정하면 됨.
 */

export type Feed = {
  source: string;
  url: string;
  category: "kr_market" | "us_market" | "macro" | "crypto" | "general";
  tag: string; // 슬라이드 뱃지 라벨
};

export const RSS_FEEDS: Feed[] = [
  // 국내
  {
    source: "한경 증권",
    url: "https://www.hankyung.com/feed/finance",
    category: "kr_market",
    tag: "국내장 속보",
  },
  {
    source: "매일경제 증권",
    url: "https://www.mk.co.kr/rss/50200011/",
    category: "kr_market",
    tag: "국내장 속보",
  },
  {
    source: "연합뉴스 경제",
    url: "https://www.yonhapnewstv.co.kr/category/news/economy/feed/",
    category: "kr_market",
    tag: "경제",
  },
  // 미국 / 글로벌
  {
    source: "Yahoo Finance",
    url: "https://finance.yahoo.com/news/rssindex",
    category: "us_market",
    tag: "미국장",
  },
  {
    source: "CNBC Top News",
    url: "https://www.cnbc.com/id/100003114/device/rss/rss.html",
    category: "us_market",
    tag: "미국장",
  },
  {
    source: "Reuters Markets",
    url: "https://feeds.reuters.com/reuters/businessNews",
    category: "macro",
    tag: "거시 경제",
  },
  // 암호화폐
  {
    source: "CoinDesk",
    url: "https://www.coindesk.com/arc/outboundfeeds/rss/",
    category: "crypto",
    tag: "암호화폐",
  },
];
