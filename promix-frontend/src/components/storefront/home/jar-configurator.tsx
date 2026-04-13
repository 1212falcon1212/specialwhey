"use client";

import { useState, useCallback, useRef, useTransition, useEffect } from "react";
import Link from "next/link";
import { AnimatedJar } from "@/components/shared/animated-jar";

interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface DemoIngredient {
  id: number;
  name: string;
  desc: string;
  nutrition: Nutrition;
}

interface Goal {
  name: string;
  contrib: Record<number, number>; // ingredient id → puan katkısı
  color: string;
}

const GOALS: Goal[] = [
  { name: "Kas Kazanımı", color: "#ff6b2c", contrib: { 1: 30, 2: 30, 5: 25, 6: 15 } },
  { name: "Toparlanma", color: "#ff8a4c", contrib: { 7: 40, 5: 40, 2: 20 } },
  { name: "Performans", color: "#ffa86c", contrib: { 6: 60, 5: 30, 7: 10 } },
  { name: "Lezzet", color: "#ffc28a", contrib: { 3: 50, 4: 50 } },
];

const DEMO_INGREDIENTS: DemoIngredient[] = [
  { id: 1, name: "Whey Protein", desc: "Kas yapıcı baz", nutrition: { calories: 120, protein: 24, carbs: 3, fat: 1.5 } },
  { id: 2, name: "Whey İzolat", desc: "Saf protein", nutrition: { calories: 110, protein: 27, carbs: 1, fat: 0.5 } },
  { id: 3, name: "Çikolata Aroma", desc: "Lezzet katıcı", nutrition: { calories: 5, protein: 0, carbs: 1, fat: 0 } },
  { id: 4, name: "Vanilya Aroma", desc: "Klasik tat", nutrition: { calories: 5, protein: 0, carbs: 1, fat: 0 } },
  { id: 5, name: "BCAA", desc: "Amino asit", nutrition: { calories: 0, protein: 5, carbs: 0, fat: 0 } },
  { id: 6, name: "Kreatin", desc: "Güç artırıcı", nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 } },
  { id: 7, name: "Glutamin", desc: "Toparlanma", nutrition: { calories: 0, protein: 5, carbs: 0, fat: 0 } },
];

const PILL_POSITIONS: { top: string; left?: string; right?: string; translateX?: string }[] = [
  { top: "8%", left: "0" },
  { top: "38%", left: "0" },
  { top: "68%", left: "0" },
  { top: "8%", right: "0" },
  { top: "38%", right: "0" },
  { top: "68%", right: "0" },
  { top: "0", left: "50%", translateX: "-50%" },
];

const PILL_ANCHORS = [
  { x: 100, y: 80 },
  { x: 80, y: 260 },
  { x: 100, y: 440 },
  { x: 500, y: 80 },
  { x: 520, y: 260 },
  { x: 500, y: 440 },
  { x: 300, y: 30 },
];
const JAR_CENTER = { x: 300, y: 300 };

const FLOATING_PARTICLES = [
  { left: "5%", top: "15%", delay: 0, duration: 8, size: 6 },
  { left: "92%", top: "20%", delay: 1.5, duration: 10, size: 4 },
  { left: "8%", top: "70%", delay: 3, duration: 9, size: 5 },
  { left: "95%", top: "75%", delay: 0.8, duration: 11, size: 7 },
  { left: "15%", top: "45%", delay: 2.2, duration: 8.5, size: 4 },
  { left: "88%", top: "50%", delay: 4, duration: 10.5, size: 5 },
  { left: "25%", top: "10%", delay: 1, duration: 9.5, size: 5 },
  { left: "78%", top: "12%", delay: 3.5, duration: 8, size: 3 },
  { left: "30%", top: "85%", delay: 2.8, duration: 11.5, size: 6 },
  { left: "70%", top: "88%", delay: 0.5, duration: 9, size: 4 },
  { left: "45%", top: "8%", delay: 4.2, duration: 10, size: 3 },
  { left: "55%", top: "92%", delay: 1.8, duration: 8.5, size: 5 },
];

export function JarConfigurator() {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const [, startTransition] = useTransition();
  const [shake, setShake] = useState(false);

  const toggle = useCallback((id: number) => {
    setShake(true);
    window.setTimeout(() => setShake(false), 400);
    startTransition(() => {
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    });
  }, []);

  const fillPercent = (selected.size / DEMO_INGREDIENTS.length) * 100;

  // Toplam besin değerleri
  const totals = DEMO_INGREDIENTS.reduce(
    (acc, ing) => {
      if (selected.has(ing.id)) {
        acc.calories += ing.nutrition.calories;
        acc.protein += ing.nutrition.protein;
        acc.carbs += ing.nutrition.carbs;
        acc.fat += ing.nutrition.fat;
      }
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  // Hedef puanları
  const goalScores = GOALS.map((goal) => {
    const score = Object.entries(goal.contrib).reduce(
      (sum, [id, points]) => (selected.has(Number(id)) ? sum + points : sum),
      0,
    );
    return { ...goal, score: Math.min(100, score) };
  });

  return (
    <section id="konfigurator" className="relative overflow-hidden py-16 md:py-24">
      {/* Layered background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 30%, rgba(255,107,44,0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(255,190,122,0.18) 0%, transparent 55%), radial-gradient(ellipse at 50% 50%, rgba(255,154,92,0.08) 0%, transparent 70%), linear-gradient(180deg, #ffffff 0%, #fff8f3 100%)",
        }}
      />

      {/* Subtle dot grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,107,44,0.12) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      {/* Decorative blur orbs */}
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-[#ff6b2c]/15 blur-[100px] animate-pulse-slow" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-[28rem] w-[28rem] rounded-full bg-[#ffbe7a]/20 blur-[120px] animate-pulse-slower" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-[#ff9a5c]/10 blur-[80px]" />

      {/* Diagonal accent line */}
      <div
        className="pointer-events-none absolute right-0 top-1/4 hidden h-[2px] w-72 rotate-[15deg] lg:block"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,107,44,0.4), transparent)",
        }}
      />
      <div
        className="pointer-events-none absolute left-0 bottom-1/4 hidden h-[2px] w-72 -rotate-[10deg] lg:block"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,107,44,0.4), transparent)",
        }}
      />


      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        {FLOATING_PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#ff6b2c]/30 animate-float-particle"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Rotating decorative ring — top right */}
      <svg
        className="pointer-events-none absolute -right-20 top-10 hidden h-80 w-80 opacity-[0.06] animate-rotate-slow lg:block"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle cx="100" cy="100" r="90" stroke="#ff6b2c" strokeWidth="1" strokeDasharray="4 6" />
        <circle cx="100" cy="100" r="70" stroke="#ff6b2c" strokeWidth="1" strokeDasharray="2 4" />
        <circle cx="100" cy="100" r="50" stroke="#ff6b2c" strokeWidth="1" />
      </svg>

      {/* Rotating decorative ring — bottom left (reverse) */}
      <svg
        className="pointer-events-none absolute -left-16 bottom-10 hidden h-64 w-64 opacity-[0.06] animate-rotate-slow-reverse lg:block"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle cx="100" cy="100" r="80" stroke="#ff6b2c" strokeWidth="1" strokeDasharray="3 5" />
        <circle cx="100" cy="100" r="55" stroke="#ff6b2c" strokeWidth="1" />
      </svg>

      <div className="container relative mx-auto px-4">
        {/* Title block */}
        <div className="mb-12 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#ff6b2c]/25 bg-[#fff3ed] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#ff6b2c]">
            <svg viewBox="0 0 24 24" className="size-3" fill="currentColor">
              <path d="M12 2L13.09 8.26L19 7L14.18 11.27L17 17L12 13.77L7 17L9.82 11.27L5 7L10.91 8.26L12 2Z" />
            </svg>
            Kişiye Özel Karışım
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-[#1a1a1a]">
            Kendi Paketini{" "}
            <span className="font-bold text-[#ff6b2c]">Oluştur</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-[#888888] md:text-base">
            Bileşenleri seç, formülün anında oluşsun.
          </p>
        </div>

        {/* ==================== DESKTOP ==================== */}
        <div className="hidden lg:grid lg:grid-cols-[260px_minmax(0,700px)_260px] lg:items-stretch lg:justify-center lg:gap-8">
          {/* Sol — Hedef Göstergesi */}
          <GoalIndicators goals={goalScores} />

          {/* Orta — Bidon + Pill'ler */}
          <div
            ref={containerRef}
            className="relative mx-auto w-full"
            style={{ maxWidth: 700, height: 600 }}
          >
            {/* SVG Lines */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 600 600"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <radialGradient id="flowDot" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ff6b2c" stopOpacity="1" />
                  <stop offset="100%" stopColor="#ff6b2c" stopOpacity="0" />
                </radialGradient>
              </defs>
              {DEMO_INGREDIENTS.map((ing, i) => {
                const isSelected = selected.has(ing.id);
                const anchor = PILL_ANCHORS[i];
                return (
                  <g key={ing.id}>
                    <line
                      x1={anchor.x}
                      y1={anchor.y}
                      x2={JAR_CENTER.x}
                      y2={JAR_CENTER.y}
                      stroke={isSelected ? "#ff6b2c" : "#dddddd"}
                      strokeWidth={isSelected ? 2 : 1}
                      strokeDasharray={isSelected ? "0" : "6 4"}
                      className="transition-all duration-500"
                    />
                    {/* Akan parçacık — sadece seçili çizgilerde */}
                    {isSelected && (
                      <FlowingParticle
                        x1={anchor.x}
                        y1={anchor.y}
                        x2={JAR_CENTER.x}
                        y2={JAR_CENTER.y}
                        delay={i * 0.2}
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Jar — outer wrapper for centering, inner for animation */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="flex flex-col items-center">
                {/* Jar wrapper — sonar covers exactly this area */}
                <div className="relative">
                  {/* Sonar pulse rings — centered behind jar */}
                  <div className="pointer-events-none absolute inset-0 z-0">
                    <span className="absolute left-1/2 top-1/2 block size-64 rounded-full border border-[#ff6b2c]/30 animate-sonar" />
                    <span
                      className="absolute left-1/2 top-1/2 block size-64 rounded-full border border-[#ff6b2c]/30 animate-sonar"
                      style={{ animationDelay: "1s" }}
                    />
                    <span
                      className="absolute left-1/2 top-1/2 block size-64 rounded-full border border-[#ff6b2c]/30 animate-sonar"
                      style={{ animationDelay: "2s" }}
                    />
                  </div>

                  <div className={`relative z-10 animate-float-jar ${shake ? "animate-shake" : ""}`}>
                    <AnimatedJar fillPercent={fillPercent} width={200} height={280} />
                  </div>
                </div>

                <div className="relative z-10 mt-5 inline-flex items-center gap-2 rounded-full border border-[#ff6b2c]/25 bg-[#fff3ed] px-4 py-1.5 text-xs font-semibold text-[#ff6b2c]">
                  <span className="size-1.5 rounded-full bg-[#ff6b2c]" />
                  <span className="tabular-nums">{selected.size}</span>
                  <span className="opacity-70">bileşen seçildi</span>
                </div>
              </div>
            </div>

            {/* Ingredient Pills */}
            {DEMO_INGREDIENTS.map((ing, i) => {
              const pos = PILL_POSITIONS[i];
              const isSelected = selected.has(ing.id);
              return (
                <button
                  key={ing.id}
                  onClick={() => toggle(ing.id)}
                  className={`group/pill absolute rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap hover:scale-105 active:scale-95 ${
                    isSelected
                      ? "bg-[#ff6b2c] text-white shadow-[0_6px_20px_rgba(255,107,44,0.35)] animate-pulse-selected"
                      : "bg-white text-[#ff6b2c] border-2 border-[#ff6b2c] hover:bg-[#ff6b2c] hover:text-white hover:shadow-[0_6px_20px_rgba(255,107,44,0.25)]"
                  }`}
                  style={{
                    top: pos.top,
                    left: pos.left,
                    right: pos.right,
                    transform: pos.translateX ? `translateX(${pos.translateX})` : undefined,
                  }}
                >
                  {ing.name}
                  <span className={`ml-1.5 text-xs hidden xl:inline transition-colors duration-300 ${isSelected ? "text-white/70" : "text-[#ff6b2c]/60 group-hover/pill:text-white/70"}`}>
                    {ing.desc}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sağ — Besin Değerleri (dikey) */}
          <NutritionVertical totals={totals} />
        </div>

        {/* ==================== MOBILE ==================== */}
        <div className="lg:hidden">
          <div className="mb-8 flex flex-col items-center">
            {/* Jar wrapper — sonar covers exactly this area */}
            <div className="relative">
              {/* Sonar rings */}
              <div className="pointer-events-none absolute inset-0 z-0">
                <span className="absolute left-1/2 top-1/2 block size-48 rounded-full border border-[#ff6b2c]/30 animate-sonar" />
                <span
                  className="absolute left-1/2 top-1/2 block size-48 rounded-full border border-[#ff6b2c]/30 animate-sonar"
                  style={{ animationDelay: "1s" }}
                />
              </div>
              <div className={`relative z-10 animate-float-jar ${shake ? "animate-shake" : ""}`}>
                <AnimatedJar fillPercent={fillPercent} width={140} height={190} />
              </div>
            </div>
            <div className="relative z-10 mt-4 inline-flex items-center gap-2 rounded-full border border-[#ff6b2c]/25 bg-[#fff3ed] px-4 py-1.5 text-xs font-semibold text-[#ff6b2c]">
              <span className="size-1.5 rounded-full bg-[#ff6b2c]" />
              <span className="tabular-nums">{selected.size}</span>
              <span className="opacity-70">bileşen seçildi</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            {DEMO_INGREDIENTS.map((ing) => {
              const isSelected = selected.has(ing.id);
              return (
                <button
                  key={ing.id}
                  onClick={() => toggle(ing.id)}
                  className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 active:scale-95 ${
                    isSelected
                      ? "bg-[#ff6b2c] text-white shadow-[0_6px_20px_rgba(255,107,44,0.35)] animate-pulse-selected"
                      : "bg-white text-[#ff6b2c] border-2 border-[#ff6b2c]"
                  }`}
                >
                  {ing.name}
                </button>
              );
            })}
          </div>

          {/* Mobile — Goals + Nutrition (alt alta) */}
          <div className="mt-8 space-y-4">
            <GoalIndicators goals={goalScores} />
            <NutritionVertical totals={totals} />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link
            href="/proteinini-olustur"
            className="inline-flex items-center justify-center rounded-full bg-[#ff6b2c] px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-[#e55a1f] hover:shadow-[0_8px_30px_rgba(255,107,44,0.3)]"
          >
            Paketini Oluştur &rarr;
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-jar {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        :global(.animate-float-jar) {
          animation: float-jar 4s ease-in-out infinite;
        }

        @keyframes shake-jar {
          0%, 100% { transform: translateX(0) rotate(0); }
          20% { transform: translateX(-6px) rotate(-2deg); }
          40% { transform: translateX(6px) rotate(2deg); }
          60% { transform: translateX(-4px) rotate(-1deg); }
          80% { transform: translateX(4px) rotate(1deg); }
        }
        :global(.animate-shake) {
          animation: shake-jar 0.4s ease-in-out;
        }

        @keyframes pulse-selected {
          0%, 100% { box-shadow: 0 6px 20px rgba(255,107,44,0.35); }
          50% { box-shadow: 0 6px 30px rgba(255,107,44,0.55); }
        }
        :global(.animate-pulse-selected) {
          animation: pulse-selected 2s ease-in-out infinite;
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        :global(.animate-pulse-slow) {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        :global(.animate-pulse-slower) {
          animation: pulse-slow 9s ease-in-out infinite;
        }

        @keyframes float-particle {
          0%, 100% { transform: translate(0, 0); opacity: 0.4; }
          25% { transform: translate(8px, -12px); opacity: 0.7; }
          50% { transform: translate(-6px, -20px); opacity: 0.9; }
          75% { transform: translate(-10px, -8px); opacity: 0.5; }
        }
        :global(.animate-float-particle) {
          animation: float-particle 8s ease-in-out infinite;
        }

        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        :global(.animate-rotate-slow) {
          animation: rotate-slow 60s linear infinite;
        }
        :global(.animate-rotate-slow-reverse) {
          animation: rotate-slow 80s linear infinite reverse;
        }

        @keyframes sonar {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0.7;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.4);
            opacity: 0;
          }
        }
        :global(.animate-sonar) {
          animation: sonar 3s ease-out infinite;
        }
      `}</style>
    </section>
  );
}

// Akan parçacık — çizgi üzerinde hareket eden nokta
function FlowingParticle({
  x1,
  y1,
  x2,
  y2,
  delay,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay: number;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf: number;
    const start = performance.now() + delay * 1000;
    const duration = 1800;
    const tick = (now: number) => {
      const elapsed = now - start;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const t = (elapsed % duration) / duration;
      setProgress(t);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [delay]);

  const cx = x1 + (x2 - x1) * progress;
  const cy = y1 + (y2 - y1) * progress;
  const opacity = Math.sin(progress * Math.PI);

  return <circle cx={cx} cy={cy} r="4" fill="url(#flowDot)" opacity={opacity} />;
}

function GoalIndicators({ goals }: { goals: (Goal & { score: number })[] }) {
  const hasSelection = goals.some((g) => g.score > 0);
  const totalScore = goals.reduce((sum, g) => sum + g.score, 0);
  const avg = Math.round(totalScore / goals.length);

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-2xl border bg-white p-6 transition-all duration-500 lg:h-full ${hasSelection ? "border-[#ff6b2c]/30 shadow-[0_8px_30px_rgba(255,107,44,0.08)]" : "border-[#eeeeee]"}`}
    >
      <div className="mb-6">
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#1a1a1a]">
          Hedef Skorların
        </h3>
        <p className="mt-1 text-xs text-[#888888]">Seçimine göre canlı güncellenir</p>
      </div>

      <div className="flex flex-1 flex-col justify-around gap-5">
        {goals.map((g) => (
          <div key={g.name}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-[#1a1a1a]">{g.name}</span>
              <span className="text-xs font-bold tabular-nums text-[#888888]">
                {g.score}<span className="opacity-60">%</span>
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-[#f5f5f3]">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${g.score}%`,
                  background: `linear-gradient(90deg, ${g.color}, ${g.color}dd)`,
                  boxShadow: g.score > 0 ? `0 0 12px ${g.color}66` : "none",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4 border-t border-[#eeeeee] pt-5">
        <CircularScore value={avg} />
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#888888]">
            Genel Skor
          </div>
          <div className="mt-0.5 text-xs text-[#1a1a1a]">
            {avg < 25
              ? "Başla"
              : avg < 50
                ? "İyi başlangıç"
                : avg < 75
                  ? "Güçlü kombinasyon"
                  : "Mükemmel paket"}
          </div>
        </div>
      </div>
    </div>
  );
}

function CircularScore({ value }: { value: number }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative size-14 shrink-0">
      <svg viewBox="0 0 50 50" className="size-full -rotate-90">
        <circle
          cx="25"
          cy="25"
          r={radius}
          fill="none"
          stroke="#f5f5f3"
          strokeWidth="4"
        />
        <circle
          cx="25"
          cy="25"
          r={radius}
          fill="none"
          stroke="#ff6b2c"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.7s ease-out",
            filter: value > 0 ? "drop-shadow(0 0 4px rgba(255,107,44,0.4))" : "none",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display text-sm font-black tabular-nums text-[#ff6b2c]">
          {value}
        </span>
      </div>
    </div>
  );
}

function NutritionVertical({ totals }: { totals: Nutrition }) {
  const hasSelection = totals.calories + totals.protein + totals.carbs + totals.fat > 0;

  const items: {
    label: string;
    value: number;
    unit: string;
    max: number;
    highlight?: boolean;
  }[] = [
    { label: "Kalori", value: totals.calories, unit: "kcal", max: 500 },
    { label: "Protein", value: totals.protein, unit: "g", max: 100, highlight: true },
    { label: "Karbonhidrat", value: totals.carbs, unit: "g", max: 50 },
    { label: "Yağ", value: totals.fat, unit: "g", max: 30 },
  ];

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-2xl border bg-white p-6 transition-all duration-500 lg:h-full ${hasSelection ? "border-[#ff6b2c]/30 shadow-[0_8px_30px_rgba(255,107,44,0.08)]" : "border-[#eeeeee]"}`}
    >
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#1a1a1a]">
            Besin Değerleri
          </h3>
          <p className="mt-1 text-xs text-[#888888]">Tek porsiyon başına</p>
        </div>
        {hasSelection && (
          <span className="rounded-full bg-[#fff3ed] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#ff6b2c]">
            Canlı
          </span>
        )}
      </div>

      <div className="grid flex-1 grid-cols-2 gap-3 lg:grid-cols-1 lg:gap-3">
        {items.map((item) => {
          const display = Number.isInteger(item.value) ? item.value : item.value.toFixed(1);
          const pct = Math.min(100, (item.value / item.max) * 100);
          return (
            <div
              key={item.label}
              className={`flex flex-col justify-between gap-2 rounded-xl px-4 py-3 transition-colors duration-300 lg:flex-1 ${item.highlight ? "bg-[#fff3ed]" : "bg-[#fafaf8]"}`}
            >
              <div className="flex items-start justify-between">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[#888888]">
                  {item.label}
                </div>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`font-display text-2xl font-black tabular-nums leading-none ${item.highlight ? "text-[#ff6b2c]" : "text-[#1a1a1a]"}`}
                  >
                    {display}
                  </span>
                  <span className="text-xs font-semibold text-[#888888]">{item.unit}</span>
                </div>
              </div>
              {/* Mini progress bar */}
              <div className="h-1 overflow-hidden rounded-full bg-white/60">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${pct}%`,
                    background: item.highlight
                      ? "linear-gradient(90deg, #ff6b2c, #ff9a5c)"
                      : "linear-gradient(90deg, #ff9a5c, #ffbe7a)",
                    boxShadow: pct > 0 ? "0 0 8px rgba(255,107,44,0.3)" : "none",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
