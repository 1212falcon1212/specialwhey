const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://specialwhey.com.tr";

type RobotsConfig = {
  rules: Array<{
    userAgent: string;
    allow: string;
    disallow: string[];
  }>;
  sitemap: string;
};

export default function robots(): RobotsConfig {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/hesabim/", "/sepet", "/odeme/", "/kayit", "/giris", "/admin/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
