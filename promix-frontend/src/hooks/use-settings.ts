import { useMemo } from "react";
import { useApi } from "@/hooks/use-api";
import type { StorefrontSettings } from "@/types/settings";

function parseJsonValues(raw: Record<string, unknown>): StorefrontSettings {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string") {
      // Try to parse JSON strings (arrays/objects)
      if (
        (value.startsWith("[") && value.endsWith("]")) ||
        (value.startsWith("{") && value.endsWith("}"))
      ) {
        try {
          result[key] = JSON.parse(value);
          continue;
        } catch {
          // not valid JSON, keep as string
        }
      }
    }
    result[key] = value;
  }
  return result as StorefrontSettings;
}

export function useSettings() {
  const { data, error, isLoading } = useApi<Record<string, unknown>>(
    "/storefront/settings/public"
  );

  const settings = useMemo(() => {
    if (!data?.data) return null;
    return parseJsonValues(data.data as Record<string, unknown>);
  }, [data]);

  return {
    settings,
    error,
    isLoading,
  };
}
