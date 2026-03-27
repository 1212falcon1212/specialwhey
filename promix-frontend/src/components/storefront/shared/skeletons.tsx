import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-square w-full rounded-xl bg-white/10" />
      <Skeleton className="h-3 w-20 bg-white/10" />
      <Skeleton className="h-4 w-3/4 bg-white/10" />
      <Skeleton className="h-3 w-1/2 bg-white/10" />
      <Skeleton className="h-4 w-1/3 bg-white/10" />
    </div>
  );
}

export function BannerSkeleton() {
  return <Skeleton className="aspect-[16/9] w-full rounded-none bg-white/10 md:aspect-[21/9]" />;
}

export function CategoryCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-3">
      <Skeleton className="size-20 rounded-full bg-white/10 sm:size-24" />
      <Skeleton className="h-3 w-16 bg-white/10" />
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="flex gap-4">
      <Skeleton className="aspect-[4/3] w-1/3 shrink-0 rounded-lg bg-white/10" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-20 bg-white/10" />
        <Skeleton className="h-5 w-full bg-white/10" />
        <Skeleton className="h-3 w-full bg-white/10" />
        <Skeleton className="h-3 w-2/3 bg-white/10" />
      </div>
    </div>
  );
}
