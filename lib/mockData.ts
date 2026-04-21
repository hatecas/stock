// 목업 데이터 — 백엔드(Railway) 및 Supabase 연동 전 임시 데이터
// Step 2에서 이 파일을 실제 API 호출로 교체합니다.

export type Stock = {
  ticker: string;
  name: string;
  market: string;
  price: number;
  chg: number;
  claude: number;
  gemini: number;
};

export type NewsSlide = {
  tag: string;
  title: string;
  desc: string;
  src: string;
  image: string;
};

export const newsSlides: NewsSlide[] = [
  {
    tag: "미국장 마감",
    title: "엔비디아, AI 칩 수요 급증에 사상 최고치 경신",
    desc: "3분기 실적 발표 앞두고 월가 목표가 줄줄이 상향. 데이터센터 매출 전년 대비 +154%.",
    src: "Reuters · 3분 전",
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=900&q=80",
  },
  {
    tag: "국내장 속보",
    title: "삼성전자, HBM3E 양산 본격화… 외국인 6거래일 연속 순매수",
    desc: "메모리 업황 회복 기대감에 반도체 대형주 동반 강세.",
    src: "연합뉴스 · 12분 전",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900&q=80",
  },
  {
    tag: "거시 경제",
    title: "연준 9월 FOMC 의사록 공개… 인하 시점 놓고 위원 간 이견",
    desc: "일부 위원은 추가 인하를 지지했으나 물가 고착 우려 제기.",
    src: "Bloomberg · 32분 전",
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=900&q=80",
  },
  {
    tag: "기업 공시",
    title: "테슬라, 로보택시 시범서비스 오스틴 확대… 주가 +4.2%",
    desc: "FSD v13 배포와 맞물려 호재.",
    src: "CNBC · 1시간 전",
    image: "https://images.unsplash.com/photo-1620891549027-942fdc95d3f5?w=900&q=80",
  },
  {
    tag: "암호화폐",
    title: "비트코인 $72,000 돌파… ETF 자금 유입 3일 연속 최대",
    desc: "블랙록·피델리티 ETF 합산 일일 순유입 8억 달러 돌파.",
    src: "CoinDesk · 2시간 전",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=900&q=80",
  },
];

export const aiPicks: (Stock & { summary: string })[] = [
  { ticker: "NVDA", name: "NVIDIA", market: "NASDAQ", price: 487.23, chg: 3.82, claude: 94, gemini: 91, summary: "AI 칩 독점적 지위 강화. 단기 과열 주의." },
  { ticker: "005930", name: "삼성전자", market: "KOSPI", price: 78600, chg: 2.14, claude: 88, gemini: 85, summary: "HBM 양산·메모리 업사이클 초입." },
  { ticker: "TSLA", name: "Tesla", market: "NASDAQ", price: 248.91, chg: -1.24, claude: 72, gemini: 78, summary: "로보택시 모멘텀 긍정적이나 밸류 부담." },
  { ticker: "373220", name: "LG에너지솔루션", market: "KOSPI", price: 412500, chg: 4.05, claude: 81, gemini: 76, summary: "북미 IRA 수혜 재부각." },
];

export const usStocks: Stock[] = [
  { ticker: "NVDA", name: "NVIDIA", market: "NASDAQ", price: 487.23, chg: 3.82, claude: 94, gemini: 91 },
  { ticker: "AAPL", name: "Apple", market: "NASDAQ", price: 182.41, chg: 1.22, claude: 82, gemini: 84 },
  { ticker: "MSFT", name: "Microsoft", market: "NASDAQ", price: 412.88, chg: 0.94, claude: 87, gemini: 90 },
  { ticker: "META", name: "Meta Platforms", market: "NASDAQ", price: 498.12, chg: 2.18, claude: 85, gemini: 79 },
  { ticker: "GOOGL", name: "Alphabet", market: "NASDAQ", price: 164.77, chg: -0.42, claude: 79, gemini: 86 },
  { ticker: "AMZN", name: "Amazon", market: "NASDAQ", price: 188.94, chg: 1.05, claude: 80, gemini: 82 },
  { ticker: "TSLA", name: "Tesla", market: "NASDAQ", price: 248.91, chg: -1.24, claude: 72, gemini: 78 },
  { ticker: "AMD", name: "AMD", market: "NASDAQ", price: 168.02, chg: 2.41, claude: 78, gemini: 74 },
];

export const krStocks: Stock[] = [
  { ticker: "005930", name: "삼성전자", market: "KOSPI", price: 78600, chg: 2.14, claude: 88, gemini: 85 },
  { ticker: "000660", name: "SK하이닉스", market: "KOSPI", price: 198500, chg: 3.42, claude: 90, gemini: 87 },
  { ticker: "373220", name: "LG에너지솔루션", market: "KOSPI", price: 412500, chg: 4.05, claude: 81, gemini: 76 },
  { ticker: "207940", name: "삼성바이오로직스", market: "KOSPI", price: 982000, chg: -0.51, claude: 75, gemini: 80 },
  { ticker: "005380", name: "현대차", market: "KOSPI", price: 248500, chg: 1.18, claude: 77, gemini: 73 },
  { ticker: "035420", name: "NAVER", market: "KOSPI", price: 182000, chg: -1.02, claude: 74, gemini: 78 },
  { ticker: "035720", name: "카카오", market: "KOSPI", price: 41850, chg: -2.14, claude: 58, gemini: 62 },
  { ticker: "051910", name: "LG화학", market: "KOSPI", price: 314500, chg: 0.84, claude: 71, gemini: 69 },
];

export const gainers = [
  { ticker: "SMCI", name: "Super Micro", price: 812.42, chg: 18.24 },
  { ticker: "247540", name: "에코프로비엠", price: 148500, chg: 12.02 },
  { ticker: "COIN", name: "Coinbase", price: 218.9, chg: 9.64 },
  { ticker: "091990", name: "셀트리온헬스케어", price: 72400, chg: 8.41 },
  { ticker: "MSTR", name: "MicroStrategy", price: 1612.5, chg: 7.88 },
  { ticker: "086520", name: "에코프로", price: 612000, chg: 7.2 },
  { ticker: "PLTR", name: "Palantir", price: 48.12, chg: 6.92 },
  { ticker: "042700", name: "한미반도체", price: 142500, chg: 6.41 },
  { ticker: "ARM", name: "Arm Holdings", price: 142.8, chg: 5.88 },
  { ticker: "196170", name: "알테오젠", price: 228500, chg: 5.2 },
];

export const losers = [
  { ticker: "INTC", name: "Intel", price: 21.42, chg: -6.82 },
  { ticker: "035720", name: "카카오", price: 41850, chg: -5.14 },
  { ticker: "BA", name: "Boeing", price: 152.4, chg: -4.88 },
  { ticker: "068270", name: "셀트리온", price: 192500, chg: -4.22 },
  { ticker: "SNAP", name: "Snap", price: 10.91, chg: -3.92 },
  { ticker: "032830", name: "삼성생명", price: 94200, chg: -3.12 },
  { ticker: "F", name: "Ford", price: 10.12, chg: -2.84 },
  { ticker: "051900", name: "LG생활건강", price: 312000, chg: -2.41 },
  { ticker: "PYPL", name: "PayPal", price: 61.44, chg: -2.18 },
  { ticker: "030200", name: "KT", price: 39850, chg: -1.98 },
];

export const watchlist = [
  { ticker: "NVDA", name: "NVIDIA", price: 487.23, chg: 3.82 },
  { ticker: "AAPL", name: "Apple", price: 182.41, chg: 1.22 },
  { ticker: "005930", name: "삼성전자", price: 78600, chg: 2.14 },
  { ticker: "TSLA", name: "Tesla", price: 248.91, chg: -1.24 },
  { ticker: "BTC-USD", name: "Bitcoin", price: 72184, chg: 2.88 },
];

export const sectors = [
  { name: "반도체", chg: 3.82 },
  { name: "2차전지", chg: 2.41 },
  { name: "AI·클라우드", chg: 1.88 },
  { name: "바이오", chg: 0.92 },
  { name: "자동차", chg: 0.41 },
  { name: "금융", chg: -0.32 },
  { name: "통신", chg: -0.82 },
  { name: "화학", chg: -1.14 },
  { name: "조선", chg: 1.24 },
  { name: "건설", chg: -1.88 },
  { name: "에너지", chg: 2.04 },
  { name: "유통", chg: -0.58 },
];

export const tickerSymbols = [
  { sym: "KOSPI", val: "2,684.12", chg: 0.82 },
  { sym: "KOSDAQ", val: "872.14", chg: 1.24 },
  { sym: "S&P500", val: "5,214.88", chg: 0.54 },
  { sym: "NASDAQ", val: "16,412.2", chg: 1.18 },
  { sym: "DOW", val: "38,914.4", chg: 0.22 },
  { sym: "USD/KRW", val: "1,342.5", chg: -0.31 },
  { sym: "BTC", val: "$72,184", chg: 2.88 },
  { sym: "ETH", val: "$3,614", chg: 2.12 },
  { sym: "WTI", val: "$82.4", chg: -0.58 },
  { sym: "GOLD", val: "$2,412", chg: 0.41 },
];

export const fmt = (n: number) =>
  n.toLocaleString(undefined, { maximumFractionDigits: 2 });
export const signCls = (v: number) => (v >= 0 ? "up" : "down");
export const signStr = (v: number) =>
  v >= 0 ? `+${v.toFixed(2)}%` : `${v.toFixed(2)}%`;
