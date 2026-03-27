export type OrderStatus =
  | "pending"
  | "paid"
  | "preparing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "success" | "failed";

export interface Order {
  id: number;
  user_id: number | null;
  order_number: string;
  status: OrderStatus;
  payment_method: string;
  payment_status: PaymentStatus;
  subtotal: number;
  discount_amount: number;
  total: number;
  currency: string;
  notes: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  billing_address?: OrderAddress;
  shipping_address?: OrderAddress;
}

export interface OrderItem {
  id: number;
  order_id: number;
  type: "ingredient" | "mixer";
  ingredient_id: number | null;
  ingredient_option_id: number | null;
  mixer_snapshot: Record<string, unknown> | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface OrderAddress {
  id: number;
  order_id: number;
  type: "billing" | "shipping";
  full_name: string;
  phone: string;
  city: string;
  district: string;
  address_line: string;
  zip_code: string | null;
}

export type RefundStatus = "pending" | "approved" | "rejected" | "refunded";
export type RefundReason =
  | "defective"
  | "wrong_product"
  | "not_as_described"
  | "changed_mind"
  | "other";

export interface RefundRequest {
  id: number;
  order_id: number;
  order?: { order_number: string; total: number; created_at: string };
  reason: RefundReason;
  reason_label: string;
  description: string | null;
  status: RefundStatus;
  status_label: string;
  refund_amount: number;
  admin_notes: string | null;
  resolved_at: string | null;
  created_at: string;
}
