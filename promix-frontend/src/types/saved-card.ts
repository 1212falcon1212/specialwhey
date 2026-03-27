export interface SavedCard {
  id: number;
  card_label: string;
  last_four: string;
  card_brand: string | null;
  is_default: boolean;
  created_at: string;
}
