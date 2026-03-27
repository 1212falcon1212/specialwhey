"use client";

import { useApi } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";

interface DashboardStats {
  orders: {
    total: number;
    today: number;
    this_week: number;
    this_month: number;
    pending: number;
  };
  revenue: {
    total: number;
    today: number;
    this_week: number;
    this_month: number;
  };
  customers: {
    total: number;
    this_month: number;
  };
  ingredients: {
    total: number;
    active: number;
    low_stock: number;
  };
}

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}

function StatSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-20" />
        <Skeleton className="mt-1 h-3 w-32" />
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data, isLoading } = useApi<DashboardStats>("/admin/dashboard/stats");
  const stats = data?.data;

  if (isLoading || !stats) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <StatSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>

      {/* Sipariş İstatistikleri */}
      <h2 className="mb-3 text-lg font-semibold">Siparişler</h2>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Toplam Sipariş"
          value={stats.orders.total}
          subtitle={`${stats.orders.today} bugün`}
        />
        <StatCard
          title="Bu Hafta"
          value={stats.orders.this_week}
          subtitle="sipariş"
        />
        <StatCard
          title="Bu Ay"
          value={stats.orders.this_month}
          subtitle="sipariş"
        />
        <StatCard
          title="Bekleyen"
          value={stats.orders.pending}
          subtitle="onay bekliyor"
        />
      </div>

      {/* Gelir İstatistikleri */}
      <h2 className="mb-3 text-lg font-semibold">Gelir</h2>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Toplam Gelir"
          value={formatPrice(stats.revenue.total)}
        />
        <StatCard title="Bugün" value={formatPrice(stats.revenue.today)} />
        <StatCard
          title="Bu Hafta"
          value={formatPrice(stats.revenue.this_week)}
        />
        <StatCard title="Bu Ay" value={formatPrice(stats.revenue.this_month)} />
      </div>

      {/* Diğer İstatistikler */}
      <h2 className="mb-3 text-lg font-semibold">Genel</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Toplam Müşteri"
          value={stats.customers.total}
          subtitle={`${stats.customers.this_month} bu ay yeni`}
        />
        <StatCard
          title="Toplam Bileşen"
          value={stats.ingredients.total}
          subtitle={`${stats.ingredients.active} aktif`}
        />
        <StatCard
          title="Düşük Stok"
          value={stats.ingredients.low_stock}
          subtitle="bileşen"
        />
      </div>
    </div>
  );
}
