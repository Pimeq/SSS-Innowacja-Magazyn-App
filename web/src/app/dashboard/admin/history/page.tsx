'use client';

import { AdminLayout } from "@/components/admin/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

interface StockHistory {
  id: number;
  product_id: number;
  location_id: number;
  quantity_change: number;
  action: string;
  performed_by_name: string;
  product_name: string;
  location_name: string;
  created_at: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<StockHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/admin/history");
      const data = await res.json();
      setHistory(data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action: string) => {
    const variants: Record<string, string> = {
      add: "bg-green-100 text-green-800",
      remove: "bg-red-100 text-red-800",
      move: "bg-blue-100 text-blue-800",
      adjust: "bg-yellow-100 text-yellow-800",
    };
    return variants[action.toLowerCase()] || variants.add;
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("pl-PL") + " " + d.toLocaleTimeString("pl-PL");
  };

  return (
    <AdminLayout title="Historia Zmian">
      <div className="space-y-6">
        <div>
          <p className="text-slate-600">Historia wszystkich zmian w zasobach magazynu</p>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Produkt</TableHead>
                  <TableHead>Lokalizacja</TableHead>
                  <TableHead>Typ akcji</TableHead>
                  <TableHead>Zmiana ilości</TableHead>
                  <TableHead>Wykonał</TableHead>
                  <TableHead>Data i godzina</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.id}</TableCell>
                    <TableCell>{entry.product_name}</TableCell>
                    <TableCell>{entry.location_name}</TableCell>
                    <TableCell>
                      <Badge className={getActionBadge(entry.action)}>
                        {entry.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {entry.quantity_change > 0 ? "+" : ""}
                      {entry.quantity_change}
                    </TableCell>
                    <TableCell>{entry.performed_by_name || "System"}</TableCell>
                    <TableCell>{formatDate(entry.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
