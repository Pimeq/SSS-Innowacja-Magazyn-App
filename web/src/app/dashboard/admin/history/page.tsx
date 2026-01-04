'use client';

import { AdminLayout } from "@/components/admin/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

interface StockHistory {
  id: number;
  product_id: number;
  from_locations_id: number;
  to_locations_id: number;
  quantity: number;
  type: string;
  user_id: number;
  product_name: string;
  from_location_name: string;
  to_location_name: string;
  first_name: string;
  last_name: string;
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

  const getTypeBadge = (type: string) => {
    const variants: Record<string, string> = {
      stock_move: "bg-blue-100 text-blue-800",
      stock_add: "bg-green-100 text-green-800",
      stock_remove: "bg-red-100 text-red-800",
      stock_adjust: "bg-yellow-100 text-yellow-800",
    };
    return variants[type.toLowerCase()] || variants.stock_add;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pl-PL");
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
                  <TableHead>Z lokalizacji</TableHead>
                  <TableHead>Do lokalizacji</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead>Ilość</TableHead>
                  <TableHead>Użytkownik</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.id}</TableCell>
                    <TableCell>{entry.product_name}</TableCell>
                    <TableCell>{entry.from_location_name}</TableCell>
                    <TableCell>{entry.to_location_name}</TableCell>
                    <TableCell>
                      <Badge className={getTypeBadge(entry.type)}>
                        {entry.type.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{entry.quantity}</TableCell>
                    <TableCell>{entry.first_name} {entry.last_name}</TableCell>
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
