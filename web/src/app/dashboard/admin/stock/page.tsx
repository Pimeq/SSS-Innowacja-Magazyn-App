'use client';

import { AdminLayout } from "@/components/admin/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, ArrowRightLeft } from "lucide-react";
import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

function StockPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const openedFromSearchRef = useRef<string | null>(null);

  const [stocks, setStocks] = useState<Stock[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productStocks, setProductStocks] = useState<Stock[]>([]);
  const [isProductManagerOpen, setIsProductManagerOpen] = useState(false);
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [movingStock, setMovingStock] = useState<Stock | null>(null);
  const [addQuantities, setAddQuantities] = useState<Record<number, string>>({});
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

  useEffect(() => {
    const productIdParam = searchParams.get("productId");
    if (!productIdParam) return;
    if (openedFromSearchRef.current === productIdParam) return;
    if (loading) return;
    if (products.length === 0 || locations.length === 0) return;

    const productId = Number.parseInt(productIdParam, 10);
    openedFromSearchRef.current = productIdParam;

    if (!Number.isFinite(productId)) {
      router.replace("/dashboard/admin/stock");
      return;
    }

    const product = products.find((p) => p.id === productId);
    if (!product) {
      router.replace("/dashboard/admin/stock");
      return;
    }

    // Open modal, then clear query param so it doesn't reopen.
    openProductManager(product);
    router.replace("/dashboard/admin/stock");
  }, [searchParams, loading, products, locations, router]);

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

  const openProductManager = async (product: Product) => {
    setSelectedProduct(product);
    try {
      const res = await fetch(`/api/admin/stock?product_id=${product.id}`);
      const data: Stock[] = await res.json();
      setProductStocks(data);
      setAddQuantities((prev) => {
        const next: Record<number, string> = { ...prev };
        for (const loc of locations) {
          if (!next[loc.id]) next[loc.id] = "1";
        }
        return next;
      });
      const defaultSource = data.length > 0 ? data[0] : null;
      setMovingStock(defaultSource);
      setMoveData({ to_location_id: "", quantity: defaultSource && defaultSource.quantity > 0 ? "1" : "" });
    } catch (error) {
      console.error("Failed to fetch product stocks:", error);
    }
    setIsProductManagerOpen(true);
  };

  const handleCloseProductManager = () => {
    setIsProductManagerOpen(false);
    setSelectedProduct(null);
    setProductStocks([]);
    setMovingStock(null);
    setMoveData({ to_location_id: "", quantity: "" });
    setAddQuantities({});
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
    setIsStockDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsStockDialogOpen(false);
    setEditingStock(null);
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
            <p className="text-slate-600 text-lg">Zarządzaj stanem zasobów w magazynie</p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/30 transition-all duration-200 hover:shadow-xl">
            <Plus className="size-4 mr-2" />
            Dodaj zasób
          </Button>
        </div>

        <Card className="border-0 shadow-xl">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100/50 hover:from-slate-100 hover:to-slate-100">
                    <TableHead className="font-semibold text-slate-700">Produkt</TableHead>
                    <TableHead className="font-semibold text-slate-700">Łączna ilość</TableHead>
                    <TableHead className="text-right font-semibold text-slate-700">Zarządzaj</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((p) => {
                    const total = stocks
                      .filter((s) => s.product_id === p.id)
                      .reduce((sum, s) => sum + s.quantity, 0);
                    return (
                      <TableRow key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="font-semibold text-slate-800">{p.name}</TableCell>
                        <TableCell className="font-bold text-blue-600">{total} szt.</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" onClick={() => openProductManager(p)} className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md hover:shadow-lg transition-all">
                            Zarządzaj
                          </Button>
                        </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>

        {/* Product manager dialog */}
        <Dialog open={isProductManagerOpen} onOpenChange={setIsProductManagerOpen}>
          <DialogContent className="sm:max-w-[650px] border-0 shadow-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-slate-50 dark:to-slate-300">
                Zarządzaj produktem: {selectedProduct?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Per-location list */}
              <div className="rounded-lg border border-slate-200 overflow-hidden dark:border-slate-800/70">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-900/50 dark:to-slate-900/30">
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-200">Lokalizacja</TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-200">Ilość</TableHead>
                      <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-200">Akcje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {locations.map((loc) => {
                      const row = productStocks.find((s) => s.location_id === loc.id);
                    const qty = row?.quantity ?? 0;
                    return (
                      <TableRow key={loc.id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="font-medium text-slate-800 dark:text-slate-100">{loc.name}</TableCell>
                        <TableCell className="font-bold text-blue-600">{qty} szt.</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Input
                              type="number"
                              min={1}
                              value={addQuantities[loc.id] ?? "1"}
                              onChange={(e) =>
                                setAddQuantities((prev) => ({ ...prev, [loc.id]: e.target.value }))
                              }
                              className="h-8 w-20 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-green-50 hover:text-green-600 transition-all"
                              onClick={async () => {
                                try {
                                  if (!selectedProduct) return;
                                  const delta = parseInt(addQuantities[loc.id] ?? "1", 10);
                                  if (!Number.isFinite(delta) || delta <= 0) {
                                    window.alert("Podaj poprawną ilość (min. 1)");
                                    return;
                                  }

                                  if (row) {
                                    const resp = await fetch(`/api/admin/stock/${row.id}`, {
                                      method: "PUT",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ quantity: qty + delta }),
                                    });
                                    if (!resp.ok) throw new Error(await resp.text());
                                  } else {
                                    const resp = await fetch(`/api/admin/stock`, {
                                      method: "POST",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ product_id: selectedProduct.id, location_id: loc.id, quantity: delta }),
                                    });
                                    if (!resp.ok) throw new Error(await resp.text());
                                  }

                                  setAddQuantities((prev) => ({ ...prev, [loc.id]: "1" }));
                                  const res = await fetch(`/api/admin/stock?product_id=${selectedProduct.id}`);
                                  setProductStocks(await res.json());
                                  await fetchData();
                                } catch (error) {
                                  console.error(error);
                                  window.alert("Nie udało się dodać zasobu. Sprawdź konsolę/logi API.");
                                }
                              }}
                            >Dodaj</Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-red-50 hover:text-red-600 transition-all"
                              onClick={async () => {
                                try {
                                  if (!selectedProduct) return;
                                  if (!row || qty <= 0) return;

                                  const delta = parseInt(addQuantities[loc.id] ?? "1", 10);
                                  if (!Number.isFinite(delta) || delta <= 0) {
                                    window.alert("Podaj poprawną ilość (min. 1)");
                                    return;
                                  }

                                  const nextQty = qty - delta;
                                  if (nextQty <= 0) {
                                    const resp = await fetch(`/api/admin/stock/${row.id}`, { method: "DELETE" });
                                    if (!resp.ok) throw new Error(await resp.text());
                                  } else {
                                    const resp = await fetch(`/api/admin/stock/${row.id}`, {
                                      method: "PUT",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ quantity: nextQty }),
                                    });
                                    if (!resp.ok) throw new Error(await resp.text());
                                  }

                                  setAddQuantities((prev) => ({ ...prev, [loc.id]: "1" }));
                                  const res = await fetch(`/api/admin/stock?product_id=${selectedProduct.id}`);
                                  setProductStocks(await res.json());
                                  await fetchData();
                                } catch (error) {
                                  console.error(error);
                                  window.alert("Nie udało się usunąć zasobu. Sprawdź konsolę/logi API.");
                                }
                              }}
                            >Usuń</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              </div>

              {/* Transfer section */}
              <div className="border-t border-slate-200 pt-6 dark:border-slate-800/70">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Przenieś między lokalizacjami</h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!selectedProduct) return;
                    if (!movingStock?.location_id) return;
                    if (!moveData.to_location_id) return;
                    if (!moveData.quantity) return;
                    try {
                      await fetch("/api/admin/stock/move", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          product_id: selectedProduct.id,
                          from_location_id: movingStock.location_id,
                          to_location_id: parseInt(moveData.to_location_id),
                          quantity: parseInt(moveData.quantity),
                        }),
                      });
                      const res = await fetch(`/api/admin/stock?product_id=${selectedProduct.id}`);
                      const updated: Stock[] = await res.json();
                      setProductStocks(updated);
                      const nextSource = updated.find((s) => s.location_id === movingStock.location_id) ?? (updated[0] ?? null);
                      setMovingStock(nextSource);
                      await fetchData();
                    } catch (error) { console.error("Failed to move", error); }
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-slate-700 dark:text-slate-200 font-medium">Źródło</Label>
                      <Select
                      value={movingStock?.location_id?.toString() ?? ""}
                      onValueChange={(value) => {
                        const locId = parseInt(value);
                        const row = productStocks.find((s) => s.location_id === locId);
                        setMovingStock(row ?? null);
                        setMoveData({ ...moveData, quantity: (row?.quantity ?? 0).toString() });
                      }}
                    >
                      <SelectTrigger className="mt-1.5 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                        <SelectValue placeholder="Wybierz lokalizację" />
                      </SelectTrigger>
                      <SelectContent>
                        {productStocks.map((s) => (
                          <SelectItem key={s.location_id} value={s.location_id.toString()}>
                            {s.location_name} ({s.quantity} szt.)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-slate-700 dark:text-slate-200 font-medium">Cel</Label>
                    <Select
                      value={moveData.to_location_id}
                      onValueChange={(value) => setMoveData({ ...moveData, to_location_id: value })}
                    >
                      <SelectTrigger className="mt-1.5 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
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
                    <Label className="text-slate-700 dark:text-slate-200 font-medium">Ilość</Label>
                    <Input
                      type="number"
                      value={moveData.quantity}
                      onChange={(e) => setMoveData({ ...moveData, quantity: e.target.value })}
                      min={1}
                      max={movingStock?.quantity ?? undefined}
                      className="mt-1.5 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      required
                    />
                  </div>
                </div>

                <DialogFooter className="mt-6 gap-2">
                  <Button type="button" variant="outline" onClick={handleCloseProductManager} className="hover:bg-slate-50">
                    Zamknij
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/30">
                    <ArrowRightLeft className="size-4 mr-2" />
                    Przenieś
                  </Button>
                </DialogFooter>
              </form>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add/Edit stock dialog */}
        <Dialog open={isStockDialogOpen} onOpenChange={setIsStockDialogOpen}>
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                {editingStock ? "Edytuj zasób" : "Dodaj zasób"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div>
                  <Label className="text-slate-700 font-medium">Produkt</Label>
                  <Select
                    value={formData.product_id}
                    onValueChange={(value) => setFormData({ ...formData, product_id: value })}
                    disabled={!!editingStock}
                  >
                    <SelectTrigger className="mt-1.5 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
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
                  <Label className="text-slate-700 font-medium">Lokalizacja</Label>
                  <Select
                    value={formData.location_id}
                    onValueChange={(value) => setFormData({ ...formData, location_id: value })}
                    disabled={!!editingStock}
                  >
                    <SelectTrigger className="mt-1.5 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
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

                <div>
                  <Label className="text-slate-700 font-medium">Ilość</Label>
                  <Input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    min={0}
                    className="mt-1.5 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={handleCloseDialog} className="hover:bg-slate-50">
                  Anuluj
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/30">
                  {editingStock ? "Zapisz" : "Dodaj"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

export default function StockPage() {
  return (
    <Suspense fallback={
      <AdminLayout title="Magazyn">
        <div className="space-y-6">
          <div className="flex items-center justify-center p-12">
            <p className="text-slate-600">Ładowanie...</p>
          </div>
        </div>
      </AdminLayout>
    }>
      <StockPageContent />
    </Suspense>
  );
}
