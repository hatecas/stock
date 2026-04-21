import Link from "next/link";
import { Search, Moon, Sparkles } from "lucide-react";
import { TickerStrip } from "./TickerStrip";

export function TopBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[rgba(11,14,20,0.75)] backdrop-blur-md backdrop-saturate-150">
      <div className="mx-auto flex w-full max-w-[1280px] items-center gap-6 px-10 py-3.5">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <span className="text-[22px] text-[var(--color-accent)] [text-shadow:0_0_18px_rgba(124,92,255,0.6)]">◆</span>
          <span>StockHub</span>
        </Link>

        <nav className="ml-4 flex gap-1">
          <NavItem href="#us" active>미국주식</NavItem>
          <NavItem href="#kr">국내주식</NavItem>
          <NavItem href="#gainers">상승주</NavItem>
          <NavItem href="#losers">하락주</NavItem>
          <NavItem href="#watchlist">관심종목</NavItem>
          <NavItem href="#ai">
            <span className="flex items-center gap-1.5">
              AI 분석
              <span className="rounded bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)] px-1.5 py-0.5 text-[10px] font-bold text-white">
                NEW
              </span>
            </span>
          </NavItem>
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <div className="flex min-w-[320px] items-center gap-2 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-bg-elev)] px-3 py-2 text-[var(--color-text-dim)] transition-colors focus-within:border-[var(--color-accent)]">
            <Search size={16} />
            <input
              type="text"
              placeholder="종목명 · 티커 검색 (예: AAPL, 삼성전자)"
              className="flex-1 border-0 bg-transparent text-[13px] text-[var(--color-text)] outline-none"
            />
          </div>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[var(--color-border)] bg-[var(--color-bg-elev)]"
            title="다크/라이트 전환"
          >
            <Moon size={16} />
          </button>
        </div>
      </div>

      <TickerStrip />
    </header>
  );
}

function NavItem({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
        active
          ? "bg-[var(--color-bg-elev-2)] text-white"
          : "text-[var(--color-text-dim)] hover:bg-[var(--color-bg-elev)] hover:text-[var(--color-text)]"
      }`}
    >
      {children}
    </a>
  );
}
