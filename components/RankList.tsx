import Link from "next/link";
import { fmt, signCls, signStr } from "@/lib/mockData";

type RankItem = { ticker: string; name: string; price: number; chg: number };

export function RankList({
  id,
  title,
  icon,
  items,
}: {
  id: string;
  title: string;
  icon: string;
  items: RankItem[];
}) {
  return (
    <section
      id={id}
      className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elev)] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-base font-bold tracking-tight">
          <span className="text-xl">{icon}</span>
          <span>{title}</span>
        </h2>
        <span className="text-xs text-[var(--color-muted)]">상위 10</span>
      </div>

      <ul className="flex flex-col gap-0.5">
        {items.map((s, i) => {
          const rankColor =
            i === 0
              ? "text-[#fbbf24]"
              : i === 1
              ? "text-[#cbd5e1]"
              : i === 2
              ? "text-[#d97757]"
              : "text-[var(--color-muted)]";
          return (
            <li key={s.ticker}>
              <Link
                href={`/stock/${s.ticker}`}
                className="grid cursor-pointer grid-cols-[32px_1fr_auto_auto] items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-[var(--color-bg-elev-2)]"
              >
                <span className={`text-[15px] font-bold ${rankColor}`}>{i + 1}</span>
                <div className="flex min-w-0 flex-col gap-0.5 pl-0.5">
                  <span className="truncate text-[14px] font-bold">{s.ticker}</span>
                  <span className="truncate text-[12px] text-[var(--color-text-dim)]">{s.name}</span>
                </div>
                <span className="text-[14px] font-semibold tabular-nums">{fmt(s.price)}</span>
                <span
                  className={`min-w-[78px] text-right text-[14px] font-bold tabular-nums ${signCls(
                    s.chg
                  )}`}
                >
                  {signStr(s.chg)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
