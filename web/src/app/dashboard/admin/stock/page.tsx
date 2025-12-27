'use client';

import { AdminLayout } from "@/components/admin/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, ArrowRightLeft } from "lucide-react";
import { useEffect, useState } from "react";

interface Stock {
  id: number;
  product_id: number;
  location_id: number;
  quantity: number;
  product_name: string;
  location_name: string;
  updated_at: string;
}

interface Product {
  id: number;
  name: string;
}

interface Location {
  id: number;
  name: string;
}

export default function StockPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [movingStock, setMovingStock] = useState<Stock | null>(null);
  const [formData, setFormData] = useState({
    product_id: "",
    location_id: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(true);
  const [moveData, setMoveData] = useState({ to_location_id: "", quantity: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [stockRes, productsRes, locationsRes] = await Promise.all([
        fetch("/api/admin/stock"),
        fetch("/api/admin/products"),
        fetch("/api/admin/locations"),
      ]);

      setStocks(await stockRes.json());
      setProducts(await productsRes.json());
      setLocations(await locationsRes.json());
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (stock?: Stock) => {
    if (stock) {
      setEditingStock(stock);
      setFormData({
        product_id: stock.product_id.toString(),
        location_id: stock.location_id.toString(),
        quantity: stock.quantity.toString(),
      });
    } else {
      setEditingStock(null);
      setFormData({
        product_id: "",
        location_id: "",
        quantity: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingStock(null);
  };

  const handleOpenMoveDialog = (stock: Stock) => {
    setMovingStock(stock);
    setMoveData({ to_location_id: "", quantity: stock.quantity.toString() });
    setIsMoveDialogOpen(true);
  };

  const handleCloseMoveDialog = () => {
    setIsMoveDialogOpen(false);
    setMovingStock(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingStock) {
        await fetch(`/api/admin/stock/${editingStock.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quantity: parseInt(formData.quantity),
          }),
        });
      } else {
        await fetch("/api/admin/stock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_id: parseInt(formData.product_id),
            location_id: parseInt(formData.location_id),
            quantity: parseInt(formData.quantity),
          }),
        });
      }
      await fetchData();
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to save stock:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Czy na pewno chcesz usunąć ten rekord zasobów?")) return;

    try {
      await fetch(`/api/admin/stock/${id}`, { method: "DELETE" });
      await fetchData();
    } catch (error) {
      console.error("Failed to delete stock:", error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pl-PL");
  };

  return (
    <AdminLayout title="Magazyn">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600">Zarządzaj stanem zasobów w magazynie</p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="size-4 mr-2" />
            Dodaj zasób
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Produkt</TableHead>
                  <TableHead>Lokalizacja</TableHead>
                  <TableHead>Ilość</TableHead>
                  <TableHead>Ostatnia aktualizacja</TableHead>
                  <TableHead className="text-right">Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stocks.map((stock) => (
                  <TableRow key={stock.id}>
                    <TableCell>{stock.id}</TableCell>
                    <TableCell>{stock.product_name}</TableCell>
                    <TableCell>{stock.location_name}</TableCell>
                    <TableCell className="font-medium">
                      {stock.quantity} szt.
                    </TableCell>
                    <TableCell>{formatDate(stock.updated_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(stock)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Przenieś do innej lokalizacji"
                          onClick={() => handleOpenMoveDialog(stock)}
                        >
                          <ArrowRightLeft className="size-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(stock.id)}
                        >
                          <Trash2 className="size-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingStock ? "Edytuj zasób" : "Dodaj nowy zasób"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                {!editingStock && (
                  <>
                    <div>
                      <Label htmlFor="product_id">Produkt</Label>
                      <Select value={formData.product_id} onValueChange={(value) => setFormData({ ...formData, product_id: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz produkt" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((p) => (
                            <SelectItem key={p.id} value={p.id.toString()}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="location_id">Lokalizacja</Label>
                      <Select value={formData.location_id} onValueChange={(value) => setFormData({ ...formData, location_id: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz lokalizację" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((l) => (
                            <SelectItem key={l.id} value={l.id.toString()}>
                              {l.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <div>
                  <Label htmlFor="quantity">Ilość</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                >
                  Anuluj
                </Button>
                <Button type="submit">
                  {editingStock ? "Zapisz zmiany" : "Dodaj zasób"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Move dialog */}
        <Dialog open={isMoveDialogOpen} onOpenChange={setIsMoveDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Przenieś zasób</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!movingStock) return;
                try {
                  await fetch("/api/admin/stock/move", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      product_id: movingStock.product_id,
                      from_location_id: movingStock.location_id,
                      to_location_id: parseInt(moveData.to_location_id),
                      quantity: parseInt(moveData.quantity),
                    }),
                  });
                  await fetchData();
                  handleCloseMoveDialog();
                } catch (error) {
                  console.error("Failed to move stock:", error);
                }
              }}
            >
              <div className="space-y-4 py-4">
                <div>
                  <Label>Docelowa lokalizacja</Label>
                  <Select
                    value={moveData.to_location_id}
                    onValueChange={(value) => setMoveData({ ...moveData, to_location_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz lokalizację" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations
                        .filter((l) => l.id !== movingStock?.location_id)
                        .map((l) => (
                          <SelectItem key={l.id} value={l.id.toString()}>
                            {l.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Ilość do przeniesienia</Label>
                  <Input
                    type="number"
                    value={moveData.quantity}
                    onChange={(e) => setMoveData({ ...moveData, quantity: e.target.value })}
                    min={1}
                    max={movingStock?.quantity ?? undefined}
                    required
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseMoveDialog}>
                  Anuluj
                </Button>
                <Button type="submit">Przenieś</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
