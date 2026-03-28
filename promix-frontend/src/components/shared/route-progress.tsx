"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

interface Bubble {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
}

export function RouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [fill, setFill] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [bubbles] = useState<Bubble[]>(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: 8 + Math.random() * 64,
      size: 3 + Math.random() * 6,
      delay: Math.random() * 2,
      duration: 1.2 + Math.random() * 1.5,
    }))
  );

  const clearTimers = useCallback(() => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
  }, []);

  const start = useCallback(() => {
    clearTimers();
    setFadeOut(false);
    setFill(0);
    setLoading(true);

    timerRef.current.push(setTimeout(() => setFill(12), 50));
    timerRef.current.push(setTimeout(() => setFill(28), 200));
    timerRef.current.push(setTimeout(() => setFill(45), 450));
    timerRef.current.push(setTimeout(() => setFill(60), 700));
    timerRef.current.push(setTimeout(() => setFill(72), 1000));
    timerRef.current.push(setTimeout(() => setFill(83), 1400));
  }, [clearTimers]);

  const done = useCallback(() => {
    clearTimers();
    setFill(100);
    timerRef.current.push(
      setTimeout(() => {
        setFadeOut(true);
        timerRef.current.push(
          setTimeout(() => {
            setLoading(false);
            setFill(0);
            setFadeOut(false);
          }, 500)
        );
      }, 350)
    );
  }, [clearTimers]);

  useEffect(() => {
    done();
  }, [pathname, searchParams, done]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      if (href === pathname) return;
      start();
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname, start]);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
      style={{
        background: "radial-gradient(circle at 50% 50%, rgba(255,107,44,0.03) 0%, rgba(250,250,248,0.95) 50%, rgba(250,250,248,0.98) 100%)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#ff6b2c]/10 animate-float-particle"
            style={{
              width: 4 + i * 3,
              height: 4 + i * 3,
              left: `${15 + i * 14}%`,
              top: `${30 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${3 + i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="flex flex-col items-center">
        {/* Jar with glow */}
        <div className="relative">
          {/* Glow behind jar */}
          <div
            className="absolute -inset-6 rounded-full transition-opacity duration-700"
            style={{
              background: `radial-gradient(circle, rgba(255,107,44,${fill * 0.004}) 0%, transparent 70%)`,
            }}
          />

          {/* Lid */}
          <div className="relative mx-auto w-[60px] h-[16px] rounded-t-lg bg-gradient-to-b from-[#e0e0e0] to-[#ccc] border border-b-0 border-[#bbb] z-10">
            <div className="absolute inset-x-2 top-1 h-1 rounded-full bg-white/40" />
          </div>

          {/* Body */}
          <div className="relative w-[88px] h-[120px] rounded-b-xl border border-[#ccc] bg-white overflow-hidden shadow-lg">
            {/* Fill liquid */}
            <div
              className="absolute bottom-0 left-0 right-0 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{ height: `${fill}%` }}
            >
              {/* Liquid body */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#e85a1f] via-[#ff6b2c] to-[#ff9a5c]" />

              {/* Shimmer */}
              <div className="absolute inset-0 animate-shimmer" style={{
                background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.15) 55%, transparent 60%)",
                backgroundSize: "200% 100%",
              }} />

              {/* Bubbles inside liquid */}
              {bubbles.map((b) => (
                <div
                  key={b.id}
                  className="absolute rounded-full bg-white/30 animate-bubble"
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
                <svg viewBox="0 0 120 12" preserveAspectRatio="none" className="w-[200%] h-full animate-wave1">
                  <path d="M0 6 Q15 0 30 6 Q45 12 60 6 Q75 0 90 6 Q105 12 120 6 L120 12 L0 12 Z" fill="#ff6b2c" />
                </svg>
              </div>

              {/* Wave 2 (offset) */}
              <div className="absolute -top-1 left-0 right-0 h-3 overflow-hidden">
                <svg viewBox="0 0 120 10" preserveAspectRatio="none" className="w-[200%] h-full animate-wave2">
                  <path d="M0 5 Q15 8 30 5 Q45 2 60 5 Q75 8 90 5 Q105 2 120 5 L120 10 L0 10 Z" fill="#ff9a5c" opacity="0.4" />
                </svg>
              </div>
            </div>

            {/* Glass reflection */}
            <div className="absolute left-1 top-2 bottom-2 w-2 rounded-full bg-white/10" />

            {/* Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
              <span className={`text-[8px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${fill > 55 ? "text-white/80" : "text-[#bbb]"}`}>
                Special
              </span>
              <span className={`text-[10px] font-black uppercase tracking-[0.15em] transition-colors duration-500 ${fill > 45 ? "text-white" : "text-[#999]"}`}>
                Whey
              </span>
            </div>
          </div>
        </div>

        {/* Loading text */}
        <div className="mt-5 flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#ff6b2c] tabular-nums tracking-wide">
              {fill}%
            </span>
          </div>
          <span className="text-[10px] tracking-wider text-[#aaa] uppercase animate-pulse">
            Hazırlanıyor
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
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-40px) scale(1.1);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-80px) scale(0.4);
            opacity: 0;
          }
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes float-particle {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) scale(1.3);
            opacity: 0.6;
          }
        }
        .animate-wave1 {
          animation: wave1 1.5s linear infinite;
        }
        .animate-wave2 {
          animation: wave2 2s linear infinite;
        }
        .animate-bubble {
          animation: bubble 1.5s ease-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 2.5s ease-in-out infinite;
        }
        .animate-float-particle {
          animation: float-particle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
