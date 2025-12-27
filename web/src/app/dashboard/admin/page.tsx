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

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<StatsCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [lowStock, setLowStock] = useState<{ product_id: number; product_name: string; total: number }[]>([]);
  const [operations, setOperations] = useState<any[]>([]);

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
        const stockRes = await fetch("/api/admin/stock");
        const stockData = await stockRes.json();
        const totals = new Map<number, { name: string; total: number }>();
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
        const histData = await histRes.json();
        setOperations(Array.isArray(histData) ? histData.slice(0, 8) : []);
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
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">{stat.title}</p>
                    <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="size-5 text-orange-500" />
                <h3 className="font-semibold">Produkty o niskim stanie</h3>
              </div>
              {lowStock.length === 0 ? (
                <p className="text-sm text-slate-600">Brak produktów poniżej progu</p>
              ) : (
                <div className="space-y-2">
                  {lowStock.map((p) => (
                    <div key={p.product_id} className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2">
                      <span className="font-medium">{p.product_name}</span>
                      <span className="text-sm text-slate-700">Suma: {p.total}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="size-5 text-green-500" />
                <h3 className="font-semibold">Ostatnie operacje</h3>
              </div>
              {operations.length === 0 ? (
                <p className="text-sm text-slate-600">Brak danych</p>
              ) : (
                <div className="space-y-2">
                  {operations.map((op) => (
                    <div key={op.id} className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2">
                      <div className="flex flex-col">
                        <span className="font-medium">{op.product_name}</span>
                        <span className="text-sm text-slate-700">
                          {op.type} • {op.from_location_name} → {op.to_location_name} • ilość: {op.quantity}
                        </span>
                      </div>
                      <span className="text-sm text-slate-600">
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
