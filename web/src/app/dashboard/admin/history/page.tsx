'use client';

import { AdminLayout } from "@/components/admin/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

interface StockHistory {
  id: number;
  product_id: number;
  from_locations_id: number | null;
  to_locations_id: number | null;
  quantity: number;
  type: string;
  user_id: number;
  product_name: string;
  from_location_name: string | null;
  to_location_name: string | null;
  first_name: string | null;
  last_name: string | null;
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
      const res = await fetch("/api/admin/history", {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      const data = await res.json();
      console.log('History data fetched:', data.length, 'entries');
      setHistory(data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeBadge = (type: string) => {
    const variants: Record<string, { bg: string; label: string }> = {
      IN: { bg: "bg-green-100 text-green-800", label: "Przyjęcie" },
      OUT: { bg: "bg-red-100 text-red-800", label: "Wydanie" },
      MOVE: { bg: "bg-blue-100 text-blue-800", label: "Przesunięcie" },
    };
    return variants[type.toUpperCase()] || { bg: "bg-gray-100 text-gray-800", label: type };
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("pl-PL", {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                      Ładowanie...
                    </TableCell>
                  </TableRow>
                ) : history.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                      Brak danych historii
                    </TableCell>
                  </TableRow>
                ) : (
                  history.map((entry) => {
                    const typeBadge = getTypeBadge(entry.type);
                    return (
                      <TableRow key={entry.id}>
                        <TableCell>{entry.id}</TableCell>
                        <TableCell className="font-medium">{entry.product_name}</TableCell>
                        <TableCell>{entry.from_location_name || "-"}</TableCell>
                        <TableCell>{entry.to_location_name || "-"}</TableCell>
                        <TableCell>
                          <Badge className={typeBadge.bg}>
                            {typeBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{entry.quantity}</TableCell>
                        <TableCell>
                          {entry.first_name && entry.last_name 
                            ? `${entry.first_name} ${entry.last_name}` 
                            : "Nieznany"}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">{formatDate(entry.created_at)}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
