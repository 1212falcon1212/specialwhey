"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { usePaginatedApi } from "@/hooks/use-api";
import { Skeleton } from "@/components/ui/skeleton";
import type { BlogPost } from "@/types/blog";

const DEMO_POSTS = [
  {
    id: -1,
    title: "Whey Protein vs İzolat: Hangisi Sana Uygun?",
    slug: "whey-protein-vs-izolat",
    excerpt: "İki popüler protein türü arasındaki farkları, avantajları ve dezavantajları detaylıca inceliyoruz.",
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80&auto=format",
    published_at: "2025-03-10T10:00:00Z",
  },
  {
    id: -2,
    title: "Antrenman Sonrası Beslenme Rehberi",
    slug: "antrenman-sonrasi-beslenme",
    excerpt: "Egzersiz sonrası vücudunuzun ihtiyaç duyduğu besinler ve doğru zamanlama hakkında bilmeniz gerekenler.",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80&auto=format",
    published_at: "2025-03-05T10:00:00Z",
  },
  {
    id: -3,
    title: "BCAA Nedir? Ne İşe Yarar?",
    slug: "bcaa-nedir",
    excerpt: "Dallı zincirli amino asitlerin kas gelişimi ve toparlanma üzerindeki etkileri.",
    image: "https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?w=800&q=80&auto=format",
    published_at: "2025-02-28T10:00:00Z",
  },
  {
    id: -4,
    title: "Kreatin: Bilimsel Gerçekler",
    slug: "kreatin-bilimsel-gercekler",
    excerpt: "Kreatin takviyesinin performans üzerindeki etkileri ve doğru kullanım rehberi.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80&auto=format",
    published_at: "2025-02-20T10:00:00Z",
  },
];

export function BlogPreview() {
  const { data, isLoading } = usePaginatedApi<BlogPost>(
    "/storefront/blog?per_page=4"
  );
  const apiPosts = data?.data ?? [];
  const posts = apiPosts.length > 0 ? apiPosts : DEMO_POSTS as unknown as BlogPost[];

  const featured = posts[0];
  const rest = posts.slice(1, 4);

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-display text-3xl font-black tracking-tight text-[#1a1a1a] md:text-4xl">
            Blog
          </h2>
          <Link
            href="/blog"
            className="hidden text-sm font-semibold text-[#ff6b2c] hover:text-[#e85a1e] transition-colors sm:block"
          >
            Tüm Yazılar &rarr;
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Skeleton className="aspect-[4/3] rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-28 rounded-xl" />
              <Skeleton className="h-28 rounded-xl" />
              <Skeleton className="h-28 rounded-xl" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Featured — large card */}
            {featured && (
              <Link href={`/blog/${featured.slug}`} className="group relative overflow-hidden rounded-2xl bg-[#1a1a1a]">
                <div className="relative aspect-[4/3]">
                  {featured.image ? (
                    <Image
                      src={featured.image}
                      alt={featured.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#f0f0ee]">
                      <Calendar className="size-16 text-[#ccc]" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                    {featured.published_at && (
                      <p className="text-xs text-white/50 mb-2">
                        {new Date(featured.published_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    )}
                    <h3 className="font-display text-xl font-bold text-white md:text-2xl line-clamp-2 group-hover:text-[#ff9a5c] transition-colors">
                      {featured.title}
                    </h3>
                    {featured.excerpt && (
                      <p className="mt-2 text-sm text-white/60 line-clamp-2">
                        {featured.excerpt}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            )}

            {/* Side list — stacked cards */}
            <div className="flex flex-col gap-4">
              {rest.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex gap-4 rounded-xl border border-[#eeeeee] bg-white p-3 transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-square w-28 shrink-0 overflow-hidden rounded-lg bg-[#f5f5f3]">
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="112px"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#ccc]">
                        <Calendar className="size-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-center min-w-0">
                    {post.published_at && (
                      <p className="text-xs text-[#888888]">
                        {new Date(post.published_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    )}
                    <h3 className="mt-1 font-display text-sm font-semibold text-[#1a1a1a] group-hover:text-[#ff6b2c] transition-colors line-clamp-2 md:text-base">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-1 text-xs text-[#888888] line-clamp-1">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Mobile link */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/blog" className="text-sm font-semibold text-[#ff6b2c]">
            Tüm Yazılar &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
