import { Suspense } from "react";
import { BlogListingPage } from "@/components/storefront/blog/blog-listing-page";

export const metadata = {
  title: "Blog | Special Whey",
  description: "Special Whey blog yazıları - protein, beslenme ve fitness hakkında bilgilendirici içerikler.",
};

export default function BlogPage() {
  return (
    <Suspense>
      <BlogListingPage />
    </Suspense>
  );
}
