"use client";

import { useState, useCallback, useRef, useTransition } from "react";
import Link from "next/link";
import { AnimatedJar } from "@/components/shared/animated-jar";

const DEMO_INGREDIENTS = [
  { id: 1, name: "Whey Protein", desc: "Kas yapıcı baz" },
  { id: 2, name: "Whey İzolat", desc: "Saf protein" },
  { id: 3, name: "Çikolata Aroma", desc: "Lezzet katıcı" },
  { id: 4, name: "Vanilya Aroma", desc: "Klasik tat" },
  { id: 5, name: "BCAA", desc: "Amino asit" },
  { id: 6, name: "Kreatin", desc: "Güç artırıcı" },
  { id: 7, name: "Glutamin", desc: "Toparlanma" },
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

export function JarConfigurator() {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const [, startTransition] = useTransition();

  const toggle = useCallback((id: number) => {
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

  return (
    <section id="konfigurator" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Title */}
        <h2 className="font-display text-3xl md:text-4xl text-center mb-12 text-[#1a1a1a]">
          Kendi Paketini{" "}
          <span className="font-bold text-[#ff6b2c]">Keşfet</span>
        </h2>

        {/* ==================== DESKTOP ==================== */}
        <div className="hidden lg:block">
          <div
            ref={containerRef}
            className="relative mx-auto"
            style={{ maxWidth: 700, height: 600 }}
          >
            {/* SVG Lines */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 600 600"
              preserveAspectRatio="xMidYMid meet"
            >
              {DEMO_INGREDIENTS.map((ing, i) => {
                const isSelected = selected.has(ing.id);
                return (
                  <line
                    key={ing.id}
                    x1={PILL_ANCHORS[i].x}
                    y1={PILL_ANCHORS[i].y}
                    x2={JAR_CENTER.x}
                    y2={JAR_CENTER.y}
                    stroke={isSelected ? "#ff6b2c" : "#dddddd"}
                    strokeWidth={isSelected ? 2 : 1}
                    strokeDasharray={isSelected ? "0" : "6 4"}
                    className="transition-all duration-500"
                  />
                );
              })}
            </svg>

            {/* Jar */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <AnimatedJar fillPercent={fillPercent} width={200} height={280} />
              <p className="mt-4 text-sm text-[#888888]">
                <span className="font-bold text-[#ff6b2c]">{selected.size}</span>{" "}
                bileşen seçildi
              </p>
            </div>

            {/* Ingredient Pills */}
            {DEMO_INGREDIENTS.map((ing, i) => {
              const pos = PILL_POSITIONS[i];
              const isSelected = selected.has(ing.id);
              return (
                <button
                  key={ing.id}
                  onClick={() => toggle(ing.id)}
                  className={`group/pill absolute rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? "bg-[#ff6b2c] text-white shadow-[0_6px_20px_rgba(255,107,44,0.35)]"
                      : "bg-white text-[#ff6b2c] border-2 border-[#ff6b2c] hover:bg-[#ff6b2c] hover:text-white"
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
        </div>

        {/* ==================== MOBILE ==================== */}
        <div className="lg:hidden">
          <div className="flex flex-col items-center mb-8">
            <AnimatedJar fillPercent={fillPercent} width={140} height={190} />
            <p className="mt-3 text-sm text-[#888888]">
              <span className="font-bold text-[#ff6b2c]">{selected.size}</span>{" "}
              bileşen seçildi
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            {DEMO_INGREDIENTS.map((ing) => {
              const isSelected = selected.has(ing.id);
              return (
                <button
                  key={ing.id}
                  onClick={() => toggle(ing.id)}
                  className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                    isSelected
                      ? "bg-[#ff6b2c] text-white shadow-[0_6px_20px_rgba(255,107,44,0.35)]"
                      : "bg-white text-[#ff6b2c] border-2 border-[#ff6b2c]"
                  }`}
                >
                  {ing.name}
                </button>
              );
            })}
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
    </section>
  );
}
