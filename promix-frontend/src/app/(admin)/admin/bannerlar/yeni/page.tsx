"use client";

import { BannerForm } from "@/components/admin/banners/banner-form";

export default function NewBannerPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Yeni Banner</h1>
      <BannerForm />
    </div>
  );
}
