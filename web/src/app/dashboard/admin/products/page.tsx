'use client';

import { AdminLayout } from "@/components/admin/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, QrCode } from "lucide-react";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  qr_code: string;
  description: string;
  created_at: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    qr_code: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        qr_code: product.qr_code,
        description: product.description,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        qr_code: "",
        description: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingProduct) {
        await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
      await fetchProducts();
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to save product:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Czy na pewno chcesz usunąć ten produkt?")) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const message =
          data?.error || `Nie udało się usunąć produktu (HTTP ${res.status}).`;
        alert(message);
        console.error("Delete product failed:", data);
        return;
      }
      await fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Nie udało się usunąć produktu.");
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pl-PL");
  };

  return (
    <AdminLayout title="Produkty">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-lg">Zarządzaj swoimi produktami</p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/30 transition-all duration-200 hover:shadow-xl">
            <Plus className="size-4 mr-2" />
            Dodaj produkt
          </Button>
        </div>

        <Card className="border-0 shadow-xl">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100/50 hover:from-slate-100 hover:to-slate-100">
                    <TableHead className="font-semibold text-slate-700">ID</TableHead>
                    <TableHead className="font-semibold text-slate-700">Nazwa</TableHead>
                    <TableHead className="font-semibold text-slate-700">Kod QR</TableHead>
                    <TableHead className="font-semibold text-slate-700">Opis</TableHead>
                    <TableHead className="font-semibold text-slate-700">Data utworzenia</TableHead>
                    <TableHead className="text-right font-semibold text-slate-700">Akcje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-medium text-slate-600">{product.id}</TableCell>
                      <TableCell className="font-semibold text-slate-800">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1.5 border-blue-200 bg-blue-50 text-blue-700 shadow-sm">
                          <QrCode className="size-3" />
                          {product.qr_code}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-slate-600">
                        {product.description}
                      </TableCell>
                      <TableCell className="text-slate-600">{formatDate(product.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(product)}
                            className="hover:bg-blue-50 hover:text-blue-600 transition-all"
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                            className="hover:bg-red-50 hover:text-red-600 transition-all"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px] border-0 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-slate-50 dark:to-slate-300">
                {editingProduct ? "Edytuj produkt" : "Dodaj nowy produkt"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="name" className="text-slate-700 dark:text-slate-200 font-medium">Nazwa produktu</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-1.5 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="qr_code" className="text-slate-700 dark:text-slate-200 font-medium">Kod QR</Label>
                  <Input
                    id="qr_code"
                    value={formData.qr_code}
                    onChange={(e) =>
                      setFormData({ ...formData, qr_code: e.target.value })
                    }
                    className="mt-1.5 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-slate-700 dark:text-slate-200 font-medium">Opis</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="mt-1.5 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                  className="hover:bg-slate-50"
                >
                  Anuluj
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/30">
                  {editingProduct ? "Zapisz zmiany" : "Dodaj produkt"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
