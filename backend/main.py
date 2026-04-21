"""
StockHub backend (FastAPI on Railway)

역할:
- 주기적인 뉴스 크롤링 → Supabase에 insert
- 주가 스냅샷 수집 (yfinance / FinanceDataReader / KIS OpenAPI)
- AI 분석 실행 (Claude + Gemini) → Supabase 캐시

Next.js(Vercel) 프론트엔드는 BACKEND_URL 로 이 서비스를 호출.
"""

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="StockHub Backend")

# CORS (Vercel 도메인 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health():
    return {"status": "ok", "service": "stockhub-backend"}


@app.get("/api/news")
def fetch_news():
    """최근 뉴스 수집 트리거 (cron 또는 수동 호출)."""
    # TODO: 네이버 금융 / Yahoo Finance / 연합뉴스 RSS 등 크롤링
    #       파싱 후 Supabase news_items 테이블에 upsert
    raise HTTPException(501, "not implemented")


@app.get("/api/prices/{ticker}")
def fetch_price(ticker: str):
    """실시간 시세 조회."""
    # TODO: US는 yfinance, KR은 FinanceDataReader 또는 KIS OpenAPI
    raise HTTPException(501, "not implemented")


@app.post("/api/analyze/{ticker}")
def analyze_stock(ticker: str):
    """Claude + Gemini 분석 병렬 실행 후 Supabase ai_analyses 에 저장."""
    # TODO:
    #   1. yfinance로 종목 기본 정보 + 최근 뉴스 조회
    #   2. Anthropic API 호출 (claude-opus-4-6)
    #   3. Gemini API 호출 (gemini-2.0-pro)
    #   4. 결과 파싱 후 Supabase insert
    raise HTTPException(501, "not implemented")
