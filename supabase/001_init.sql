-- StockHub — initial schema
-- Run with: supabase db push (or paste into Supabase SQL editor)

-- 뉴스 캐시 (백엔드 크롤러가 주기적으로 insert)
create table if not exists news_items (
  id           bigserial primary key,
  source       text not null,
  title        text not null,
  summary      text,
  url          text unique,
  published_at timestamptz not null,
  tickers      text[] default '{}',
  category     text,          -- us_market / kr_market / macro / crypto / earnings
  image_url    text,
  created_at   timestamptz not null default now()
);
create index if not exists idx_news_published on news_items (published_at desc);
create index if not exists idx_news_tickers on news_items using gin (tickers);

-- 종목 기본 정보 (마스터)
create table if not exists stocks (
  ticker       text primary key,
  name         text not null,
  market       text not null,         -- NASDAQ / NYSE / KOSPI / KOSDAQ
  sector       text,
  country      text,                  -- US / KR
  currency     text default 'USD',
  logo_url     text,
  created_at   timestamptz not null default now()
);

-- 시세 스냅샷 (실시간 = 가장 최근 row)
create table if not exists price_snapshots (
  id           bigserial primary key,
  ticker       text not null references stocks(ticker) on delete cascade,
  price        numeric not null,
  change_pct   numeric not null,
  volume       bigint,
  captured_at  timestamptz not null default now()
);
create index if not exists idx_price_ticker_time on price_snapshots (ticker, captured_at desc);

-- AI 분석 결과 캐시 (ticker + provider 조합 최신 1개 조회)
create table if not exists ai_analyses (
  id           bigserial primary key,
  ticker       text not null references stocks(ticker) on delete cascade,
  provider     text not null,         -- 'claude' | 'gemini'
  score        integer not null check (score between 0 and 100),
  verdict      text,                  -- '강력 매수' / '매수' / '중립' / '매도'
  summary      text,
  pros         jsonb default '[]'::jsonb,
  cons         jsonb default '[]'::jsonb,
  outlook      text,
  model        text,
  created_at   timestamptz not null default now()
);
create index if not exists idx_ai_ticker_provider on ai_analyses (ticker, provider, created_at desc);

-- 관심종목 (개인용이지만 확장성 대비 user_id 필드 유지)
create table if not exists watchlist (
  id           bigserial primary key,
  user_id      uuid,                  -- null 허용: 단일 사용자 모드
  ticker       text not null references stocks(ticker) on delete cascade,
  note         text,
  added_at     timestamptz not null default now(),
  unique (user_id, ticker)
);

-- RLS (개인용이지만 기본은 켜두자)
alter table news_items       enable row level security;
alter table stocks           enable row level security;
alter table price_snapshots  enable row level security;
alter table ai_analyses      enable row level security;
alter table watchlist        enable row level security;

-- 개인용: anon/auth 모두 read 허용
create policy "public read news"     on news_items      for select using (true);
create policy "public read stocks"   on stocks          for select using (true);
create policy "public read prices"   on price_snapshots for select using (true);
create policy "public read ai"       on ai_analyses     for select using (true);
create policy "public read watch"    on watchlist       for select using (true);
-- write는 service_role만 (default)
