import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  boldTitle?: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllText?: string;
}

export function SectionHeader({
  title,
  boldTitle,
  subtitle,
  viewAllHref,
  viewAllText = "Tümünü Gör",
}: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <h2 className="font-display text-xl font-extralight uppercase tracking-wider text-[#1a1a1a] sm:text-2xl">
          {title}{" "}
          {boldTitle && (
            <span className="font-extrabold text-[#ff6b2c]">{boldTitle}</span>
          )}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-[#888888]">{subtitle}</p>
        )}
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="hidden items-center gap-1 text-sm font-medium text-[#ff6b2c] transition-colors hover:text-[#e85a1e] sm:flex"
        >
          {viewAllText}
          <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}
