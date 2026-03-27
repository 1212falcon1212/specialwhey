"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User as UserIcon, Home, ArrowLeft } from "lucide-react";
import { useApi } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { BlogPost } from "@/types/blog";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

function DetailSkeleton() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-6">
      <Skeleton className="mb-6 h-4 w-48" />
      <Skeleton className="h-8 w-3/4" />
      <div className="mt-4 flex items-center gap-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="mt-6 aspect-[16/9] w-full rounded-lg" />
      <div className="mt-6 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = use(params);
  const { data, error, isLoading } = useApi<BlogPost>(
    `/storefront/blog/${slug}`
  );

  const post = data?.data;

  if (isLoading) return <DetailSkeleton />;

  if (error || !post) {
    return (
      <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4 py-10">
        <p className="text-lg font-medium text-destructive">
          Blog yazısı bulunamadı.
        </p>
        <Button variant="outline" className="mt-4" render={<Link href="/blog" />}>
          <ArrowLeft className="size-4" />
          Blog&apos;a Dön
        </Button>
      </div>
    );
  }

  return (
    <article className="container mx-auto max-w-3xl px-4 py-6 lg:py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="flex items-center gap-1 transition-colors hover:text-foreground">
          <Home className="size-3.5" />
          Anasayfa
        </Link>
        <span>/</span>
        <Link href="/blog" className="transition-colors hover:text-foreground">
          Blog
        </Link>
        <span>/</span>
        <span className="line-clamp-1 font-medium text-foreground">
          {post.title}
        </span>
      </nav>

      {/* Title */}
      <h1 className="font-display text-2xl font-bold tracking-tight lg:text-4xl">
        {post.title}
      </h1>

      {/* Meta */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        {post.author && (
          <div className="flex items-center gap-1.5">
            <UserIcon className="size-4" />
            <span>{post.author.name}</span>
          </div>
        )}
        {post.published_at && (
          <div className="flex items-center gap-1.5">
            <Calendar className="size-4" />
            <time dateTime={post.published_at}>
              {new Date(post.published_at).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          </div>
        )}
      </div>

      {/* Featured Image */}
      {post.image && (
        <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-lg bg-[#f5f5f3]">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
            unoptimized
          />
        </div>
      )}

      {/* Content */}
      {post.content && (
        <div
          className="blog-content mt-8 max-w-none text-[#555555] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      )}

      {/* Back to Blog */}
      <div className="mt-10 border-t pt-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#ff6b2c] transition-colors hover:text-[#e85a1e]"
        >
          <ArrowLeft className="size-4" />
          Tüm Yazılara Dön
        </Link>
      </div>
    </article>
  );
}
