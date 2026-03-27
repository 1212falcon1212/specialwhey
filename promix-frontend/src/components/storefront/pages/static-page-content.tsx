"use client";

import { useApi } from "@/hooks/use-api";
import { Skeleton } from "@/components/ui/skeleton";
import type { PageContent } from "@/types/ingredient";

interface StaticPageContentProps {
  slug: string;
}

function StaticPageSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
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
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-4 text-muted-foreground"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <h3 className="text-lg font-semibold text-foreground">
          Sayfa bulunamadı
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Aradığınız sayfa mevcut değil veya kaldırılmış olabilir.
        </p>
      </div>
    );
  }

  const page = data.data;

  return (
    <div>
      <h1 className="font-display mb-6 text-2xl font-bold text-foreground md:text-3xl">
        {page.title}
      </h1>
      <div
        className="space-y-4 text-base leading-relaxed text-foreground/80 [&_a]:text-[#ff6b2c] [&_a]:underline [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_li]:ml-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:mb-3 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-4"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </div>
  );
}
