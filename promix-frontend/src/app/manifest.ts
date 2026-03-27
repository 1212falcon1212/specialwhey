import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Special Whey - Kişiselleştirilmiş Protein Tozu",
    short_name: "Special Whey",
    description:
      "Kendi protein karışımını oluştur. Whey, İzolat, BCAA ve daha fazlası.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafaf8",
    theme_color: "#ff6b2c",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
