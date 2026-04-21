"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { newsSlides as fallback, type NewsSlide } from "@/lib/mockData";

export function NewsSlider({ slides }: { slides?: NewsSlide[] }) {
  const newsSlides = slides && slides.length > 0 ? slides : fallback;
  const [idx, setIdx] = useState(0);
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const t = new Date().toLocaleString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    setTime(`자동 크롤링 · ${t}`);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx((i) => (i + 1) % newsSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [newsSlides.length]);

  const go = (dir: number) =>
    setIdx((i) => (i + dir + newsSlides.length) % newsSlides.length);

  const active = newsSlides[idx];

  return (
    <section className="relative overflow-hidden rounded-[20px] border border-[var(--color-border)] bg-[var(--color-bg-elev)] shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
      {/* Top label row */}
      <div className="flex items-center justify-between gap-3 px-6 py-4">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.15)] px-3 py-1 text-[12px] font-bold text-[#fca5a5]">
          <Flame size={12} /> 오늘의 뉴스
        </span>
        <span className="text-[12px] text-[var(--color-text-dim)]">{time}</span>
      </div>

      {/* Main slide area — left text, right image */}
      <div className="relative grid min-h-[320px] grid-cols-1 gap-0 md:grid-cols-[1fr_420px]">
        {/* Text side */}
        <div className="flex flex-col justify-center gap-4 px-8 py-8">
          <span className="inline-block w-fit rounded-full border border-[rgba(124,92,255,0.3)] bg-[rgba(124,92,255,0.18)] px-3 py-1 text-[12px] font-bold text-[#c7bcff]">
            {active.tag}
          </span>
          <h3 className="text-[26px] font-bold leading-tight tracking-tight text-white">
            {active.title}
          </h3>
          <p className="max-w-[560px] text-[14px] leading-relaxed text-[#cbd1dc]">
            {active.desc}
          </p>
          <div className="text-[12px] text-[var(--color-text-dim)]">{active.src}</div>
        </div>

        {/* Image thumbnail side */}
        <div className="relative hidden min-h-[260px] md:block">
          {newsSlides.map((s, i) => (
            <div
              key={i}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
                i === idx ? "opacity-100" : "opacity-0"
              }`}
              style={{ backgroundImage: `url(${s.image})` }}
            />
          ))}
          {/* Left fade overlay so image blends into text side */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--color-bg-elev)] to-transparent" />
        </div>

        {/* Mobile thumbnail (small on top) */}
        <div className="absolute right-4 top-14 block h-16 w-20 overflow-hidden rounded-lg border border-[var(--color-border)] md:hidden">
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${active.image})` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 border-t border-[var(--color-border)] px-6 py-3">
        <div className="flex gap-1.5">
          {newsSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === idx ? "w-6 bg-[var(--color-accent)]" : "w-1.5 bg-white/20"
              }`}
              aria-label={`슬라이드 ${i + 1}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => go(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elev-2)] text-[var(--color-text-dim)] transition-colors hover:text-white"
            aria-label="이전"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => go(1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elev-2)] text-[var(--color-text-dim)] transition-colors hover:text-white"
            aria-label="다음"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
