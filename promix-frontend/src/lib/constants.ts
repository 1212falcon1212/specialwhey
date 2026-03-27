export const SITE_NAME = "Special Whey";
export const SITE_DESCRIPTION =
  "Kendi protein karışımını oluştur. Whey, İzolat, BCAA ve daha fazlası.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Beklemede",
  paid: "Ödendi",
  preparing: "Hazırlanıyor",
  shipped: "Kargoda",
  delivered: "Teslim Edildi",
  cancelled: "İptal Edildi",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  preparing: "bg-orange-100 text-orange-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: "Beklemede",
  success: "Başarılı",
  failed: "Başarısız",
};

export const REFUND_STATUS_LABELS: Record<string, string> = {
  pending: "Beklemede",
  approved: "Onaylandı",
  rejected: "Reddedildi",
  refunded: "İade Edildi",
};

export const REFUND_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
  refunded: "bg-green-100 text-green-800",
};

export const REFUND_REASON_LABELS: Record<string, string> = {
  defective: "Ürün Hasarlı/Kusurlu",
  wrong_product: "Yanlış Ürün Gönderildi",
  not_as_described: "Ürün Açıklamaya Uygun Değil",
  changed_mind: "Fikir Değişikliği",
  other: "Diğer",
};
