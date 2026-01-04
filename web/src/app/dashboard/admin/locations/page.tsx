'use client';

import { AdminLayout } from "@/components/admin/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

interface Location {
  id: number;
  name: string;
  description: string;
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await fetch("/api/admin/locations");
      const data = await res.json();
      setLocations(data);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (location?: Location) => {
    if (location) {
      setEditingLocation(location);
      setFormData({
        name: location.name,
        description: location.description,
      });
    } else {
      setEditingLocation(null);
      setFormData({
        name: "",
        description: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingLocation(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingLocation) {
        await fetch(`/api/admin/locations/${editingLocation.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch("/api/admin/locations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
      await fetchLocations();
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to save location:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Czy na pewno chcesz usunąć tę lokalizację?")) return;

    try {
      await fetch(`/api/admin/locations/${id}`, { method: "DELETE" });
      await fetchLocations();
    } catch (error) {
      console.error("Failed to delete location:", error);
    }
  };

  // Removed date display as locations table doesn't include created_at

  return (
    <AdminLayout title="Lokalizacje">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-lg">Zarządzaj lokalizacjami magazynu</p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/30 transition-all duration-200 hover:shadow-xl">
            <Plus className="size-4 mr-2" />
            Dodaj lokalizację
          </Button>
        </div>

        <Card className="border-0 shadow-xl">
          <CardContent className="p-0 overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-white">
                <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100/50 hover:from-slate-100 hover:to-slate-100">
                  <TableHead className="w-20 font-semibold text-slate-700">ID</TableHead>
                  <TableHead className="font-semibold text-slate-700">Nazwa</TableHead>
                  <TableHead className="font-semibold text-slate-700">Opis</TableHead>
                  <TableHead className="text-right font-semibold text-slate-700">Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-slate-500 py-12">
                      <div className="flex flex-col items-center gap-2">
                        <MapPin className="size-12 text-slate-300" />
                        <p className="font-medium">Brak lokalizacji</p>
                        <p className="text-sm">Dodaj pierwszą lokalizację, aby zacząć.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  locations.map((location) => (
                    <TableRow key={location.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-medium text-slate-600">{location.id}</TableCell>
                      <TableCell className="font-semibold text-slate-800">{location.name}</TableCell>
                      <TableCell className="max-w-lg truncate text-slate-600" title={location.description}>
                        {location.description}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            title="Edytuj lokalizację"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(location)}
                            className="hover:bg-blue-50 hover:text-blue-600 transition-all"
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            title="Usuń lokalizację"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(location.id)}
                            className="hover:bg-red-50 hover:text-red-600 transition-all"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px] border-0 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-slate-50 dark:to-slate-300">
                {editingLocation ? "Edytuj lokalizację" : "Dodaj nową lokalizację"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="name" className="text-slate-700 dark:text-slate-200 font-medium">Nazwa lokalizacji</Label>
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
                  {editingLocation ? "Zapisz zmiany" : "Dodaj lokalizację"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
