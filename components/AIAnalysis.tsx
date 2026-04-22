import type { StoredAnalysis } from "@/lib/analysis";

export function AIAnalysis({
  ticker,
  claude,
  gemini,
}: {
  ticker: string;
  claude: StoredAnalysis | null;
  gemini: StoredAnalysis | null;
}) {
  const rows: Array<{
    name: "Claude" | "Gemini";
    color: "claude" | "gemini";
    data: StoredAnalysis | null;
  }> = [
    { name: "Claude", color: "claude", data: claude },
    { name: "Gemini", color: "gemini", data: gemini },
  ];

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elev)] p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold">🤖 AI 종합 분석</h2>
        <span className="text-xs text-[var(--color-muted)]">
          Claude &amp; Gemini의 독립 분석 · {ticker}
        </span>
      </div>

      {rows.map((r, idx) => {
        const textColor =
          r.color === "claude" ? "text-[var(--color-claude)]" : "text-[var(--color-gemini)]";

        if (!r.data) {
          return (
            <div
              key={r.name}
              className={`grid grid-cols-[90px_1fr] gap-3.5 py-3.5 ${
                idx < rows.length - 1 ? "border-b border-[var(--color-border)]" : ""
              }`}
            >
              <div className="flex flex-col gap-1.5">
                <span className={`text-[13px] font-bold ${textColor}`}>● {r.name}</span>
                <span className="text-[28px] font-extrabold text-[var(--color-muted)]">—</span>
                <span className="text-xs text-[var(--color-muted)]">분석 실패</span>
              </div>
              <div className="flex items-center text-[13px] text-[var(--color-text-dim)]">
                분석을 가져올 수 없었습니다. 잠시 후 새로고침해 보세요.
              </div>
            </div>
          );
        }

        const a = r.data;
        return (
          <div
            key={r.name}
            className={`grid grid-cols-[90px_1fr] gap-3.5 py-3.5 ${
              idx < rows.length - 1 ? "border-b border-[var(--color-border)]" : ""
            }`}
          >
            <div className="flex flex-col gap-1.5">
              <span className={`text-[13px] font-bold ${textColor}`}>● {r.name}</span>
              <span className={`text-[28px] font-extrabold ${textColor}`}>{a.score}</span>
              <span className="text-xs text-[var(--color-muted)]">{a.verdict}</span>
            </div>
            <div>
              <p className="mb-2 text-[13px]">{a.summary}</p>
              <div className="mt-2 grid grid-cols-1 gap-3.5 md:grid-cols-2">
                <div className="rounded-lg bg-[var(--color-bg-elev-2)] p-3">
                  <h4 className="mb-2 text-xs font-bold text-[var(--color-up)]">✅ 장점</h4>
                  <ul className="list-disc pl-4 text-xs leading-relaxed text-[var(--color-text-dim)]">
                    {a.pros.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg bg-[var(--color-bg-elev-2)] p-3">
                  <h4 className="mb-2 text-xs font-bold text-[var(--color-down)]">⚠️ 단점</h4>
                  <ul className="list-disc pl-4 text-xs leading-relaxed text-[var(--color-text-dim)]">
                    {a.cons.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-3 rounded-md border-l-[3px] border-[var(--color-accent)] bg-[rgba(124,92,255,0.08)] px-3.5 py-3 text-[13px]">
                <strong>유망도:</strong> {a.outlook}
              </div>
              <div className="mt-2 text-[10px] text-[var(--color-muted)]">
                {a.model} · {new Date(a.created_at).toLocaleString("ko-KR")}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
