type AIResult = {
  name: "Claude" | "Gemini";
  score: number;
  verdict: string;
  summary: string;
  pros: string[];
  cons: string[];
  outlook: string;
  color: "claude" | "gemini";
};

const mockResults: AIResult[] = [
  {
    name: "Claude",
    score: 94,
    verdict: "강력 매수",
    color: "claude",
    summary:
      "AI 가속기 시장에서 사실상 독점적 지위를 유지 중이며, 차세대 플랫폼 공급이 본격화되며 데이터센터 매출의 폭발적 성장이 지속될 전망.",
    pros: [
      "데이터센터 부문 YoY +154% 성장",
      "CUDA 기반 생태계 해자(moat) 견고",
      "하이퍼스케일러 설비투자 확대 수혜",
    ],
    cons: [
      "PER 68배 — 단기 밸류 부담",
      "중국 수출규제 리스크 상존",
      "커스텀 ASIC 경쟁 심화 가능성",
    ],
    outlook: "중장기 강세 지속 가능. 조정 시 분할 매수 관점.",
  },
  {
    name: "Gemini",
    score: 91,
    verdict: "매수",
    color: "gemini",
    summary:
      "실적 모멘텀과 AI 인프라 사이클의 중심 수혜주. 다만 주가가 기대치를 선반영한 구간이어서 단기 변동성 확대 가능.",
    pros: ["차세대 B200/B300 양산 초입", "소프트웨어 매출 기여 확대", "견조한 현금흐름·자사주 매입 여력"],
    cons: ["전방 수요 피크아웃 논쟁", "공급망 집중(TSMC) 의존도", "헤지펀드 포지션 과도 누적"],
    outlook: "3~6개월 관점 긍정적. 하방 지지 확인 필요.",
  },
];

export function AIAnalysis({ ticker }: { ticker: string }) {
  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elev)] p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold">🤖 AI 종합 분석</h2>
        <span className="text-xs text-[var(--color-muted)]">
          Claude & Gemini의 독립 분석 · {ticker}
        </span>
      </div>

      {mockResults.map((r, idx) => {
        const textColor = r.color === "claude" ? "text-[var(--color-claude)]" : "text-[var(--color-gemini)]";
        return (
          <div
            key={r.name}
            className={`grid grid-cols-[90px_1fr] gap-3.5 py-3.5 ${
              idx < mockResults.length - 1 ? "border-b border-[var(--color-border)]" : ""
            }`}
          >
            <div className="flex flex-col gap-1.5">
              <span className={`text-[13px] font-bold ${textColor}`}>● {r.name}</span>
              <span className={`text-[28px] font-extrabold ${textColor}`}>{r.score}</span>
              <span className="text-xs text-[var(--color-muted)]">{r.verdict}</span>
            </div>
            <div>
              <p className="mb-2 text-[13px]">{r.summary}</p>
              <div className="mt-2 grid grid-cols-1 gap-3.5 md:grid-cols-2">
                <div className="rounded-lg bg-[var(--color-bg-elev-2)] p-3">
                  <h4 className="mb-2 text-xs font-bold text-[var(--color-up)]">✅ 장점</h4>
                  <ul className="list-disc pl-4 text-xs leading-relaxed text-[var(--color-text-dim)]">
                    {r.pros.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg bg-[var(--color-bg-elev-2)] p-3">
                  <h4 className="mb-2 text-xs font-bold text-[var(--color-down)]">⚠️ 단점</h4>
                  <ul className="list-disc pl-4 text-xs leading-relaxed text-[var(--color-text-dim)]">
                    {r.cons.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-3 rounded-md border-l-[3px] border-[var(--color-accent)] bg-[rgba(124,92,255,0.08)] px-3.5 py-3 text-[13px]">
                <strong>유망도:</strong> {r.outlook}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
