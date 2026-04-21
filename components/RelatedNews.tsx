export function RelatedNews({ ticker }: { ticker: string }) {
  const news = [
    { title: `${ticker}, 차세대 제품 출시 앞두고 기관 매수세 유입`, src: "Reuters", time: "42분 전" },
    { title: "월가 애널리스트 목표주가 일제히 상향 — 컨센서스 $560", src: "Bloomberg", time: "2시간 전" },
    { title: "실적 발표 앞두고 옵션 시장 변동성 확대", src: "CNBC", time: "5시간 전" },
    { title: "경쟁사 신제품 로드맵 공개 — 시장 점유율 영향은 제한적", src: "TheStreet", time: "8시간 전" },
    { title: "공급망 체크 리포트: 수요 강세 지속 중", src: "Morgan Stanley", time: "14시간 전" },
  ];

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elev)] p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold">📰 관련 뉴스</h2>
        <span className="text-xs text-[var(--color-muted)]">최근 24시간</span>
      </div>
      <div>
        {news.map((n, i) => (
          <div
            key={i}
            className={`group flex cursor-pointer flex-col gap-1 py-3 ${
              i < news.length - 1 ? "border-b border-[var(--color-border)]" : ""
            }`}
          >
            <div className="text-[13px] font-semibold transition-colors group-hover:text-[var(--color-accent)]">
              {n.title}
            </div>
            <div className="flex gap-2 text-[11px] text-[var(--color-text-dim)]">
              <span>{n.src}</span>·<span>{n.time}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
