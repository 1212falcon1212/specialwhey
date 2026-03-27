"use client";

import Image from "next/image";
import Link from "next/link";
import { useApi } from "@/hooks/use-api";
import { useSettings } from "@/hooks/use-settings";
import { SectionHeader } from "@/components/storefront/shared/section-header";
import type { Category } from "@/types/ingredient";

interface GoalItem {
  name: string;
  slug: string;
  image?: string | null;
  color: string;
}

const defaultGoals: GoalItem[] = [
  { name: "Kas Gelişimi", slug: "kas-gelisimi", color: "#ff6b2c" },
  { name: "Kilo Kontrolü", slug: "kilo-kontrolu", color: "#e8a849" },
  { name: "Dayanıklılık", slug: "dayaniklilik", color: "#d4a574" },
  { name: "Genel Sağlık", slug: "genel-saglik", color: "#8fbc8f" },
];

export function ShopByGoals() {
  const { settings } = useSettings();
  const rawGoalIds = settings?.['storefront.goal_category_ids'];
  const goalIds: number[] = Array.isArray(rawGoalIds) ? rawGoalIds : [];
  const { data } = useApi<Category[]>("/storefront/categories");
  const categories = data?.data ?? [];

  // If goal_category_ids are set, use those categories; otherwise use defaults
  const goalCategories = goalIds.length > 0
    ? categories.filter((c) => goalIds.includes(c.id))
    : [];

  const goals: GoalItem[] = goalCategories.length > 0
    ? goalCategories.map((c, i) => ({
        name: c.name,
        slug: c.slug,
        image: c.image,
        color: defaultGoals[i % defaultGoals.length].color,
      }))
    : defaultGoals;

  return (
    <section className="py-10 md:py-14">
      <div className="container mx-auto px-4">
        <SectionHeader title="HEDEFİNE GÖRE" boldTitle="ALIŞVERİŞ" />
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {goals.map((goal) => (
            <Link
              key={goal.slug}
              href={`/urunler?kategori=${goal.slug}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl border-2 bg-white transition-all duration-300"
              style={{
                borderColor: goal.color + '4D',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 25px ${goal.color}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {goal.image && (
                <Image src={goal.image} alt={goal.name} fill className="object-cover opacity-30 transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" unoptimized />
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="font-display text-center text-lg font-bold text-[#1a1a1a] drop-shadow-lg md:text-xl">
                  {goal.name}
                </h3>
              </div>
              <div
                className="absolute bottom-0 left-0 h-0.5 w-full"
                style={{ background: goal.color }}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
