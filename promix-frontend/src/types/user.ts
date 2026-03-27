export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: "admin" | "customer";
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: number;
  user_id: number;
  title: string;
  full_name: string;
  phone: string;
  city: string;
  district: string;
  neighborhood: string | null;
  address_line: string;
  zip_code: string | null;
  is_default: boolean;
}
