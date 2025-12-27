'use client';

import { AdminLayout } from "@/components/admin/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Users, MapPin, Warehouse, AlertTriangle, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";


interface StatsCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsCard[]>([]);
  const [loading, setLoading] = useState(true);

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
              <p className="text-2xl font-bold">-</p>
              <p className="text-sm text-slate-600 mt-2">Brak danych</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="size-5 text-green-500" />
                <h3 className="font-semibold">Ostatnie operacje</h3>
              </div>
              <p className="text-sm text-slate-600">Brak danych</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
