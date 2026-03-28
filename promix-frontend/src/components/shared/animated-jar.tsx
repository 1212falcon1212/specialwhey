"use client";

import { useMemo } from "react";

interface AnimatedJarProps {
  fillPercent: number;
  width?: number;
  height?: number;
  label?: string;
  sublabel?: string;
}

export function AnimatedJar({
  fillPercent,
  width = 200,
  height = 280,
  label = "Special",
  sublabel = "Whey",
}: AnimatedJarProps) {
  const lidW = width * 0.7;
  const lidH = height * 0.05;
  const fill = Math.min(100, Math.max(0, fillPercent));

  // Deterministic pseudo-random to avoid hydration mismatch
  const bubbles = useMemo(
    () => {
      const seeds = [0.12, 0.87, 0.34, 0.56, 0.73];
      return seeds.map((s, i) => ({
        id: i,
        x: 8 + s * (width - 24),
        size: 3 + ((s * 7 + i * 0.3) % 7),
        delay: (s * 2.5 + i * 0.2) % 2.5,
        duration: 1 + ((s * 1.8 + i * 0.15) % 1.8),
      }));
    },
    [width],
  );

  return (
    <div className="flex flex-col items-center">
      {/* Glow */}
      <div
        className="absolute rounded-full transition-opacity duration-700 pointer-events-none"
        style={{
          width: width + 60,
          height: height + 60,
          marginTop: -10,
          background: `radial-gradient(circle, rgba(255,107,44,${fill * 0.004}) 0%, transparent 70%)`,
        }}
      />

      {/* Lid */}
      <div
        className="relative z-10 rounded-t-lg bg-gradient-to-b from-[#e0e0e0] to-[#ccc] border border-b-0 border-[#bbb]"
        style={{ width: lidW, height: lidH }}
      >
        <div className="absolute inset-x-2 top-[2px] h-[3px] rounded-full bg-white/40" />
      </div>

      {/* Body */}
      <div
        className="relative rounded-b-2xl border border-[#ccc] bg-white overflow-hidden shadow-lg"
        style={{ width, height }}
      >
        {/* Fill */}
        <div
          className="absolute bottom-0 left-0 right-0 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{ height: `${fill}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#e85a1f] via-[#ff6b2c] to-[#ff9a5c]" />

          {/* Shimmer */}
          <div
            className="absolute inset-0 animate-[shimmer_2.5s_ease-in-out_infinite]"
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.15) 55%, transparent 60%)",
              backgroundSize: "200% 100%",
            }}
          />

          {/* Bubbles — only render when filling */}
          {fill > 10 && bubbles.map((b) => (
            <div
              key={b.id}
              className="absolute rounded-full bg-white/30 animate-[bubble_1.5s_ease-out_infinite]"
              style={{
                width: b.size,
                height: b.size,
                left: b.x,
                bottom: "5%",
                animationDelay: `${b.delay}s`,
                animationDuration: `${b.duration}s`,
              }}
            />
          ))}

          {/* Wave 1 */}
          <div className="absolute -top-2 left-0 right-0 h-4 overflow-hidden">
            <svg
              viewBox="0 0 120 12"
              preserveAspectRatio="none"
              className="w-[200%] h-full animate-[wave1_1.5s_linear_infinite]"
            >
              <path
                d="M0 6 Q15 0 30 6 Q45 12 60 6 Q75 0 90 6 Q105 12 120 6 L120 12 L0 12 Z"
                fill="#ff6b2c"
              />
            </svg>
          </div>

          {/* Wave 2 */}
          <div className="absolute -top-1 left-0 right-0 h-3 overflow-hidden">
            <svg
              viewBox="0 0 120 10"
              preserveAspectRatio="none"
              className="w-[200%] h-full animate-[wave2_2s_linear_infinite]"
            >
              <path
                d="M0 5 Q15 8 30 5 Q45 2 60 5 Q75 8 90 5 Q105 2 120 5 L120 10 L0 10 Z"
                fill="#ff9a5c"
                opacity="0.4"
              />
            </svg>
          </div>
        </div>

        {/* Glass reflection */}
        <div className="absolute left-1.5 top-3 bottom-3 w-2 rounded-full bg-white/10" />

        {/* Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
          <span
            className={`text-xs font-black uppercase tracking-[0.2em] transition-colors duration-500 ${fill > 55 ? "text-white/80" : "text-[#bbb]"}`}
          >
            {label}
          </span>
          <span
            className={`text-sm font-black uppercase tracking-[0.15em] transition-colors duration-500 ${fill > 45 ? "text-white" : "text-[#999]"}`}
          >
            {sublabel}
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes wave1 {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes wave2 {
          0% { transform: translateX(-25%); }
          100% { transform: translateX(-75%); }
        }
        @keyframes bubble {
          0% { transform: translateY(0) scale(1); opacity: 0.6; }
          50% { transform: translateY(-40px) scale(1.1); opacity: 0.8; }
          100% { transform: translateY(-80px) scale(0.4); opacity: 0; }
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
