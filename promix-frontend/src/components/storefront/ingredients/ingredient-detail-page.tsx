"use client";

import Image from "next/image";
import Link from "next/link";
import { useApi } from "@/hooks/use-api";
import { Skeleton } from "@/components/ui/skeleton";
import type { Ingredient, NutritionalInfo } from "@/types/ingredient";

interface IngredientDetailPageProps {
  slug: string;
}

const NUTRITIONAL_LABELS: Record<string, string> = {
  calories: "Kalori",
  protein: "Protein",
  carbs: "Karbonhidrat",
  fat: "Yag",
  fiber: "Lif",
};

function NutritionalTable({ info }: { info: NutritionalInfo }) {
  const entries = Object.entries(NUTRITIONAL_LABELS)
    .map(([key, label]) => ({
      key,
      label,
      value: info[key],
    }))
    .filter((e) => e.value !== undefined && e.value !== null);

  if (entries.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="font-display text-lg font-bold text-[#1a1a1a] mb-3">
        Besin Degerleri
      </h2>
      <div className="overflow-hidden rounded-xl border border-[#eeeeee]">
        <table className="w-full text-sm">
          <tbody>
            {entries.map((entry, i) => (
              <tr
                key={entry.key}
                className={i % 2 === 0 ? "bg-white" : "bg-[#fafaf8]"}
              >
                <td className="px-4 py-2.5 font-medium text-[#555555]">
                  {entry.label}
                </td>
                <td className="px-4 py-2.5 text-right text-[#1a1a1a] font-semibold">
                  {entry.key === "calories"
                    ? `${entry.value} kcal`
                    : `${entry.value}g`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-5 w-48 mb-8" />
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Skeleton className="aspect-square w-full rounded-2xl" />
          </div>
          <div className="lg:col-span-7 space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[#fafaf8]">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-[#1a1a1a] mb-2">
          Bilesen Bulunamadi
        </h1>
        <p className="text-[#888888] mb-6">
          Aradiginiz bilesen mevcut degil veya kaldirilmis olabilir.
        </p>
        <Link
          href="/bilesenler"
          className="inline-flex items-center gap-2 rounded-xl bg-[#ff6b2c] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#e85a1e]"
        >
          Tum Bilesenler
        </Link>
      </div>
    </div>
  );
}

export function IngredientDetailPage({ slug }: IngredientDetailPageProps) {
  const { data, isLoading, error } = useApi<Ingredient>(
    `/storefront/ingredients/${slug}`
  );

  if (isLoading) return <DetailSkeleton />;
  if (error || !data?.data) return <NotFound />;

  const ingredient = data.data;

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <div className="container mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          href="/#bilesenler"
          className="inline-flex items-center gap-1 text-sm text-[#888888] hover:text-[#ff6b2c] transition-colors mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Tum Bilesenler
        </Link>

        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-[#888888]" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-[#ff6b2c] transition-colors">
                Anasayfa
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href="/bilesenler"
                className="hover:text-[#ff6b2c] transition-colors"
              >
                Bilesenler
              </Link>
            </li>
            {ingredient.category && (
              <>
                <li>/</li>
                <li className="text-[#aaaaaa]">{ingredient.category.name}</li>
              </>
            )}
            <li>/</li>
            <li className="text-[#1a1a1a] font-medium">{ingredient.name}</li>
          </ol>
        </nav>

        {/* Two column layout */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* LEFT: Images */}
          <div className="lg:col-span-5">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#eeeeee]">
              {ingredient.image ? (
                <Image
                  src={ingredient.image}
                  alt={ingredient.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                  unoptimized
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-[#ccc]"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </div>
              )}
            </div>

            {/* Gallery */}
            {ingredient.gallery && ingredient.gallery.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {ingredient.gallery.map((img, i) => (
                  <div
                    key={i}
                    className="relative aspect-square overflow-hidden rounded-lg bg-[#eeeeee]"
                  >
                    <Image
                      src={img}
                      alt={`${ingredient.name} - ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="10vw"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Info */}
          <div className="lg:col-span-7">
            {/* Category */}
            {ingredient.category && (
              <p className="text-xs font-semibold uppercase tracking-wider text-[#888888] mb-2">
                {ingredient.category.name}
              </p>
            )}

            {/* Name */}
            <h1 className="font-display text-3xl font-black tracking-tight text-[#1a1a1a] md:text-4xl">
              {ingredient.name}
            </h1>

            {/* Short description */}
            {ingredient.short_description && (
              <p className="mt-4 text-[#555555] leading-relaxed text-base">
                {ingredient.short_description}
              </p>
            )}

            {/* Nutritional info */}
            {ingredient.nutritional_info && (
              <NutritionalTable info={ingredient.nutritional_info} />
            )}

            {/* Options / Sizes */}
            {ingredient.options && ingredient.options.length > 0 && (
              <div className="mt-8">
                <h2 className="font-display text-lg font-bold text-[#1a1a1a] mb-3">
                  Mevcut Secenekler
                </h2>
                <div className="flex flex-wrap gap-2">
                  {ingredient.options.map((opt) => (
                    <span
                      key={opt.id}
                      className="inline-flex items-center rounded-full border border-[#eeeeee] bg-white px-4 py-2 text-sm font-medium text-[#555555]"
                    >
                      {opt.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Full width: Description */}
        {ingredient.description && (
          <div className="mt-12 border-t border-[#eeeeee] pt-10">
            <h2 className="font-display text-2xl font-bold text-[#1a1a1a] mb-6">
              Detayli Bilgi
            </h2>
            <div
              className="prose prose-neutral max-w-none prose-headings:font-display prose-headings:text-[#1a1a1a] prose-p:text-[#555555] prose-a:text-[#ff6b2c] prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: ingredient.description }}
            />
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-[#ff6b2c] to-[#ff8f5c] p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-white mb-2">
            Bu bileseni paketine ekle
          </h2>
          <p className="text-white/80 mb-6">
            Kendi protein karisimini olustur ve bu bileseni ekle.
          </p>
          <Link
            href="/proteinini-olustur"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 text-sm font-bold text-[#ff6b2c] transition-colors hover:bg-white/90"
          >
            Proteinini Olustur
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
