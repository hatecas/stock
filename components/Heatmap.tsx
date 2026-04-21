import { sectors, signStr } from "@/lib/mockData";

function heatColor(chg: number) {
  const abs = Math.min(Math.abs(chg) / 5, 1);
  if (chg >= 0) return `rgba(34, 197, 94, ${0.18 + abs * 0.65})`;
  return `rgba(239, 68, 68, ${0.18 + abs * 0.65})`;
}

export function Heatmap() {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elev)] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-base font-bold tracking-tight">
          <span className="text-xl">🧭</span>
          <span>섹터 히트맵</span>
        </h2>
        <span className="text-xs text-[var(--color-muted)]">오늘 등락률 기준</span>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2">
        {sectors.map((s) => (
          <div
            key={s.name}
            className="flex min-h-[92px] cursor-pointer flex-col justify-between rounded-xl px-4 py-4 transition-transform hover:scale-[1.03]"
            style={{ background: heatColor(s.chg) }}
          >
            <span className="text-[13px] font-bold text-white">{s.name}</span>
            <span className="text-[15px] font-extrabold tabular-nums text-white">
              {signStr(s.chg)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
