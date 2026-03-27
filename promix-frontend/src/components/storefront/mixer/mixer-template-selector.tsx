"use client";

import { useState } from "react";
import Image from "next/image";
import { useApi } from "@/hooks/use-api";
import type { MixerTemplate } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles } from "lucide-react";

interface MixerTemplateSelectorProps {
  onSelectTemplate: (template: MixerTemplate) => void;
}

export function MixerTemplateSelector({
  onSelectTemplate,
}: MixerTemplateSelectorProps) {
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useApi<MixerTemplate[]>(
    open ? "/storefront/mixer/templates" : null,
  );

  const templates = data?.data ?? [];

  function handleSelect(template: MixerTemplate) {
    onSelectTemplate(template);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="outline" className="gap-2" />}
      >
        <Sparkles className="h-4 w-4 text-[#ff6b2c]" />
        Hazır Şablonlardan Seç
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Hazır Şablonlar</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          {isLoading ? (
            <div className="space-y-3 p-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          ) : templates.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#888888]">
              Henüz hazır şablon bulunamadı.
            </p>
          ) : (
            <div className="space-y-3 p-1">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleSelect(template)}
                  className="flex w-full items-start gap-4 rounded-lg border border-[#eeeeee] p-3 text-left transition-colors hover:border-[#ff6b2c] hover:bg-[rgba(255,107,44,0.08)]"
                >
                  {template.image ? (
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#f0f0ee]">
                      <Image
                        src={template.image}
                        alt={template.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[rgba(255,107,44,0.08)]">
                      <Sparkles className="h-6 w-6 text-[#ff6b2c]" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold text-[#1a1a1a]">
                      {template.name}
                    </h4>
                    {template.description && (
                      <p className="mt-0.5 line-clamp-2 text-xs text-[#888888]">
                        {template.description}
                      </p>
                    )}
                    {template.items && template.items.length > 0 && (
                      <Badge
                        variant="secondary"
                        className="mt-1.5 text-[10px]"
                      >
                        {template.items.length} bileşen
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
