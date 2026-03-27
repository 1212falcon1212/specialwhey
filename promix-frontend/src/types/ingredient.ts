export interface Ingredient {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  image: string | null;
  gallery: string[];
  base_price: number;
  unit: "gram" | "ml" | "adet";
  unit_amount: number;
  stock_quantity: number;
  sku: string | null;
  nutritional_info: NutritionalInfo | null;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  meta_title: string | null;
  meta_description: string | null;
  category?: Category;
  options?: IngredientOption[];
}

export interface IngredientOption {
  id: number;
  ingredient_id: number;
  label: string;
  amount: number;
  price: number;
  stock_quantity: number;
  is_default: boolean;
  sort_order: number;
}

export interface NutritionalInfo {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  [key: string]: number | undefined;
}

export interface Category {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sort_order: number;
  is_active: boolean;
  ingredient_count?: number;
  children?: Category[];
  ingredients?: Ingredient[];
}

export interface MixerTemplate {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  items?: MixerTemplateItem[];
}

export interface MixerTemplateItem {
  id: number;
  mixer_template_id: number;
  ingredient_id: number;
  ingredient_option_id: number | null;
  is_required: boolean;
  sort_order: number;
  ingredient?: Ingredient;
  option?: IngredientOption;
}

export interface Banner {
  id: number;
  title: string;
  subtitle: string | null;
  image: string | null;
  mobile_image: string | null;
  link: string | null;
  button_text: string | null;
  position: 'hero' | 'sidebar' | 'category_promo' | 'fullwidth_promo' | 'lifestyle' | 'process' | string;
}

export interface PageContent {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
}
