export interface CartItem {
  id: string;
  type: "ingredient" | "mixer";
  name: string;
  image: string | null;
  price: number;
  quantity: number;
  ingredientId?: number;
  optionId?: number;
  mixerItems?: MixerCartItem[];
}

export interface MixerCartItem {
  ingredientId: number;
  optionId?: number;
  name: string;
  price: number;
}
