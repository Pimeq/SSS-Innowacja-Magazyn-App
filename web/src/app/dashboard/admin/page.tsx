'use client';

import { AdminLayout } from "@/components/admin/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Users, MapPin, Warehouse, AlertTriangle, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


interface StatsCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

interface Operation {
  id: number;
  product_name: string;
  type: string;
  from_location_name: string;
  to_location_name: string;
  quantity: number;
  first_name?: string | null;
  last_name?: string | null;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<StatsCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [lowStock, setLowStock] = useState<{ product_id: number; product_name: string; total: number }[]>([]);
  const [operations, setOperations] = useState<Operation[]>([]);

  type StockRow = { product_id: number; product_name: string; quantity: number | string };
  type ProductRow = { id: number; name: string };

  useEffect(() => {
    if (session && session.user?.role !== 'admin') {
      router.push('/dashboard/worker');
    }
  }, [session, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();

        setStats([
          {
            title: "Produkty",
            value: data.totalProducts,
            icon: <Package className="size-6 text-white" />,
            color: "bg-blue-500",
          },
          {
            title: "Aktywni użytkownicy",
            value: data.activeUsers,
            icon: <Users className="size-6 text-white" />,
            color: "bg-green-500",
          },
          {
            title: "Lokalizacje",
            value: data.totalLocations,
            icon: <MapPin className="size-6 text-white" />,
            color: "bg-purple-500",
          },
          {
            title: "Całkowity stan",
            value: data.totalStockValue,
            icon: <Warehouse className="size-6 text-white" />,
            color: "bg-orange-500",
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchLowStockAndOperations = async () => {
      try {
        // Low stock: aggregate totals per product across all locations
        const [stockRes, productsRes] = await Promise.all([
          fetch("/api/admin/stock"),
          fetch("/api/admin/products"),
        ]);

        const stockData: StockRow[] = await stockRes.json();
        const productsData: ProductRow[] = await productsRes.json();

        const totals = new Map<number, { name: string; total: number }>();

        // Seed with all products so items with total=0 are included.
        for (const p of productsData) {
          totals.set(p.id, { name: p.name, total: 0 });
        }

        for (const row of stockData) {
          const current = totals.get(row.product_id) || { name: row.product_name, total: 0 };
          current.total += Number(row.quantity) || 0;
          totals.set(row.product_id, current);
        }
        const low = Array.from(totals.entries())
          .map(([product_id, v]) => ({ product_id, product_name: v.name, total: v.total }))
          .filter((p) => p.total < 10)
          .sort((a, b) => a.total - b.total)
          .slice(0, 8);
        setLowStock(low);

        // Recent operations: latest stock_history entries
        const histRes = await fetch("/api/admin/history");
        const histData: unknown = await histRes.json();
        setOperations(Array.isArray(histData) ? (histData.slice(0, 8) as Operation[]) : []);
      } catch (e) {
        console.error("Failed to fetch dashboard data:", e);
      }
    };
    fetchLowStockAndOperations();
  }, []);

  if (!session || session.user?.role !== 'admin') {
    return null;
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold bg-gradient-to-br from-slate-900 to-slate-600 bg-clip-text text-transparent">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-4 rounded-xl shadow-md`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <AlertTriangle className="size-5 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Produkty o niskim stanie</h3>
              </div>
              {lowStock.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">Brak produktów poniżej progu</p>
              ) : (
                <div className="space-y-2">
                  {lowStock.map((p) => (
                    <div key={p.product_id} className="flex items-center justify-between rounded-lg bg-gradient-to-r from-orange-50 to-transparent border border-orange-100 px-4 py-3 hover:shadow-md transition-all">
                      <span className="font-medium text-slate-800">{p.product_name}</span>
                      <span className="text-sm font-semibold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">Suma: {p.total}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-green-50 rounded-lg">
                  <TrendingUp className="size-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Ostatnie operacje</h3>
              </div>
              {operations.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">Brak danych</p>
              ) : (
                <div className="space-y-2">
                  {operations.map((op) => (
                    <div key={op.id} className="flex items-center justify-between rounded-lg bg-gradient-to-r from-slate-50 to-transparent border border-slate-100 px-4 py-3 hover:shadow-md transition-all">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">{op.product_name}</span>
                        <span className="text-xs text-slate-600">
                          {op.type} • {op.from_location_name} → {op.to_location_name} • ilość: {op.quantity}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        {op.first_name && op.last_name ? `${op.first_name} ${op.last_name}` : ""}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
