import { tickerSymbols, signCls, signStr } from "@/lib/mockData";

export function TickerStrip() {
  const items = [...tickerSymbols, ...tickerSymbols];
  return (
    <div className="overflow-hidden border-t border-[var(--color-border)] bg-gradient-to-r from-[rgba(124,92,255,0.04)] to-[rgba(34,211,238,0.04)]">
      <div className="ticker-track flex gap-10 whitespace-nowrap px-10 py-2.5 text-xs">
        {items.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-2">
            <span className="font-semibold text-[var(--color-text-dim)]">{t.sym}</span>
            <span>{t.val}</span>
            <span className={signCls(t.chg)}>{signStr(t.chg)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
