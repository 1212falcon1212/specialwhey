const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://specialwhey.com.tr";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type SitemapEntry = {
  url: string;
  lastModified: Date;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
};

export default async function sitemap(): Promise<SitemapEntry[]> {
  const staticPages: SitemapEntry[] = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/urunler`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/proteinini-olustur`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/hakkimizda`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/iletisim`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/sikca-sorulan-sorular`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  let dynamicPages: SitemapEntry[] = [];

  try {
    const [categoriesRes, ingredientsRes] = await Promise.all([
      fetch(`${API_URL}/storefront/categories`, { next: { revalidate: 3600 } }),
      fetch(`${API_URL}/storefront/ingredients?per_page=100`, { next: { revalidate: 3600 } }),
    ]);

    if (categoriesRes.ok) {
      const categoriesData = await categoriesRes.json();
      const categories = categoriesData.data || [];
      dynamicPages.push(
        ...categories.map((cat: { slug: string }) => ({
          url: `${BASE_URL}/urunler?category=${cat.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }))
      );
    }

    if (ingredientsRes.ok) {
      const ingredientsData = await ingredientsRes.json();
      const ingredients = ingredientsData.data || [];
      dynamicPages.push(
        ...ingredients.map((ing: { slug: string }) => ({
          url: `${BASE_URL}/urunler/${ing.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        }))
      );
    }
  } catch {
    // API unavailable during build, return static pages only
  }

  return [...staticPages, ...dynamicPages];
}
