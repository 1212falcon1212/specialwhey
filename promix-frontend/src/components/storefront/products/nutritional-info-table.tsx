import type { NutritionalInfo } from "@/types/ingredient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface NutritionalInfoTableProps {
  info: NutritionalInfo | null;
}

const LABEL_MAP: Record<string, { label: string; unit: string }> = {
  calories: { label: "Kalori", unit: "kcal" },
  protein: { label: "Protein", unit: "g" },
  carbs: { label: "Karbonhidrat", unit: "g" },
  fat: { label: "Yag", unit: "g" },
  fiber: { label: "Lif", unit: "g" },
};

const KEY_ORDER = ["calories", "protein", "carbs", "fat", "fiber"];

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function NutritionalInfoTable({ info }: NutritionalInfoTableProps) {
  if (!info) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Besin degeri bilgisi bulunmamaktadir.
      </p>
    );
  }

  const entries: { key: string; label: string; unit: string; value: number }[] =
    [];

  // Add known keys in order
  for (const key of KEY_ORDER) {
    const value = info[key];
    if (value !== undefined) {
      const mapping = LABEL_MAP[key];
      entries.push({
        key,
        label: mapping.label,
        unit: mapping.unit,
        value,
      });
    }
  }

  // Add any extra keys not in KEY_ORDER
  for (const [key, value] of Object.entries(info)) {
    if (!KEY_ORDER.includes(key) && value !== undefined) {
      entries.push({
        key,
        label: capitalizeFirst(key),
        unit: "g",
        value,
      });
    }
  }

  if (entries.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Besin degeri bilgisi bulunmamaktadir.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">100g basina besin degeri</p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Besin Degeri</TableHead>
            <TableHead className="text-right">Miktar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.key}>
              <TableCell className="font-medium">{entry.label}</TableCell>
              <TableCell className="text-right">
                {entry.value} {entry.unit}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
