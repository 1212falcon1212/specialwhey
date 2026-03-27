"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { Category } from "@/types/ingredient";

interface CategoryFilterSidebarProps {
  categories: Category[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
}

export function CategoryFilterSidebar({
  categories,
  selected,
  onSelect,
}: CategoryFilterSidebarProps) {
  const parentCategories = categories.filter((c) => !c.parent_id);

  return (
    <div className="flex flex-col gap-0.5">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
        Kategoriler
      </h3>
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={cn(
          "flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
          selected === null
            ? "bg-[rgba(255,107,44,0.08)] font-semibold text-[#ff6b2c]"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        Tümü
      </button>
      {parentCategories.map((category) => (
        <div key={category.id}>
          <button
            type="button"
            onClick={() => onSelect(category.slug)}
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
              selected === category.slug
                ? "bg-[rgba(255,107,44,0.08)] font-semibold text-[#ff6b2c]"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <span>{category.name}</span>
            {category.ingredient_count !== undefined && (
              <Badge variant="secondary" className="ml-2 text-[10px]">
                {category.ingredient_count}
              </Badge>
            )}
          </button>
          {/* Child categories */}
          {category.children && category.children.length > 0 && (
            <div className="ml-3 border-l pl-3">
              {category.children.map((child) => (
                <button
                  key={child.id}
                  type="button"
                  onClick={() => onSelect(child.slug)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors",
                    selected === child.slug
                      ? "bg-[rgba(255,107,44,0.08)] font-semibold text-[#ff6b2c]"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span>{child.name}</span>
                  {child.ingredient_count !== undefined && (
                    <Badge variant="secondary" className="ml-2 text-[10px]">
                      {child.ingredient_count}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
