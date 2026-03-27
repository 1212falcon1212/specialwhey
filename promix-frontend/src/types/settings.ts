export interface TrustBadge {
  icon: string;
  text: string;
}

export interface StorefrontSettings {
  site_name?: string;
  site_description?: string;
  site_email?: string;
  site_phone?: string;
  free_shipping_min_amount?: string;
  shipping_fee?: string;
  instagram_url?: string;
  facebook_url?: string;
  twitter_url?: string;
  'storefront.top_bar_messages'?: string[];
  'storefront.ticker_messages'?: string[];
  'storefront.trust_badges'?: TrustBadge[];
  'storefront.footer_about_text'?: string;
  'storefront.goal_category_ids'?: number[];
  [key: string]: unknown;
}
