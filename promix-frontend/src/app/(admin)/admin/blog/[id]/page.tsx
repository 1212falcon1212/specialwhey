"use client";

import { use } from "react";
import { useApi } from "@/hooks/use-api";
import { BlogForm } from "@/components/admin/blog/blog-form";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminEditBlogPostPageProps {
  params: Promise<{ id: string }>;
}

export default function AdminEditBlogPostPage({ params }: AdminEditBlogPostPageProps) {
  const { id } = use(params);
  const { data, isLoading } = useApi<{
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string | null;
    image: string | null;
    is_published: boolean;
    published_at: string | null;
    meta_title: string | null;
    meta_description: string | null;
  }>(`/admin/blog-posts/${id}`);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const post = data?.data;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Blog Yazısı Düzenle</h1>
      {post && <BlogForm postId={id} initialData={post} />}
    </div>
  );
}
