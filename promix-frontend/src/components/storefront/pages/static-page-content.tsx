"use client";

import Link from "next/link";
import { useApi } from "@/hooks/use-api";
import { Skeleton } from "@/components/ui/skeleton";
import type { PageContent } from "@/types/ingredient";

interface StaticPageContentProps {
  slug: string;
}

function StaticPageSkeleton() {
  return (
    <div>
      <div className="bg-[#1a1a1a] py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Skeleton className="h-10 w-64 bg-white/10" />
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-8 w-48 mt-6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
}

export function StaticPageContent({ slug }: StaticPageContentProps) {
  const { data, error, isLoading } = useApi<PageContent>(
    `/storefront/pages/${slug}`,
  );

  if (isLoading) {
    return <StaticPageSkeleton />;
  }

  if (error || !data?.data) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#f5f5f3]">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#888888]">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
        <h3 className="font-display text-xl font-bold text-[#1a1a1a]">
          Sayfa bulunamadı
        </h3>
        <p className="mt-2 text-sm text-[#888888]">
          Aradığınız sayfa mevcut değil veya kaldırılmış olabilir.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-10 items-center rounded-full bg-[#ff6b2c] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#e55a1f]"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  const page = data.data;

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-[#1a1a1a] py-16 md:py-24">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
        <div className="absolute -top-20 right-0 h-64 w-64 rounded-full bg-[#ff6b2c]/8 blur-[100px]" />
        <div className="container relative mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-white/40" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5">
              <li><Link href="/" className="transition-colors hover:text-white/70">Anasayfa</Link></li>
              <li className="text-white/20">/</li>
              <li className="text-white/70">{page.title}</li>
            </ol>
          </nav>
          <h1 className="font-display text-3xl font-black tracking-tight text-white md:text-4xl lg:text-5xl">
            {page.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div
          className="static-page-content mx-auto max-w-3xl text-[#555555] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </div>
  );
}
