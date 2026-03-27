import { BlogDetailPage } from "@/components/storefront/blog/blog-detail-page";

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <BlogDetailPage params={params} />;
}
