"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Calendar, Home, ChevronLeft, ChevronRight } from "lucide-react";
import { usePaginatedApi } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/types/blog";

function BlogCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Skeleton className="aspect-[16/10] w-full" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  );
}

export function BlogListingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("sayfa") ?? "1");

  const { data, isLoading, error } = usePaginatedApi<BlogPost>(
    `/storefront/blog?page=${currentPage}&per_page=9`
  );

  const posts = data?.data ?? [];
  const meta = data?.meta;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("sayfa");
    } else {
      params.set("sayfa", String(page));
    }
    const qs = params.toString();
    router.push(`/blog${qs ? `?${qs}` : ""}`);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-lg font-semibold text-destructive">Bir hata oluştu</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Blog yazıları yüklenirken bir sorun oluştu.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Sayfayı Yenile
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="flex items-center gap-1 transition-colors hover:text-foreground">
          <Home className="size-3.5" />
          Anasayfa
        </Link>
        <span>/</span>
        <span className="font-medium text-foreground">Blog</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">Blog</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Protein, beslenme ve fitness hakkında bilgilendirici içerikler.
        </p>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">Henüz blog yazısı bulunmamaktadır.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-lg border border-[#eeeeee] bg-[#fafaf8] transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#f5f5f3]">
                {post.image ? (
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <Calendar className="size-10" />
                  </div>
                )}
              </div>
              <div className="p-4">
                {post.published_at && (
                  <p className="text-xs text-muted-foreground">
                    {new Date(post.published_at).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                )}
                <h2 className="mt-1.5 line-clamp-2 font-semibold text-foreground group-hover:text-[#ff6b2c]">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                    {post.excerpt}
                  </p>
                )}
                <span className="mt-3 inline-block text-sm font-medium text-[#ff6b2c]">
                  Devamını Oku →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.last_page > 1 && !isLoading && (
        <div className="mt-8 flex items-center justify-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="size-9"
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              className={cn("size-9", currentPage === page && "bg-[#ff6b2c] hover:bg-[#e85a1e]")}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            className="size-9"
            disabled={currentPage >= meta.last_page}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
