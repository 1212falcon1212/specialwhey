import { BlogForm } from "@/components/admin/blog/blog-form";

export default function AdminNewBlogPostPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Yeni Blog Yazısı</h1>
      <BlogForm />
    </div>
  );
}
