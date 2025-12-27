'use client';

import { AdminLayout } from "@/components/admin/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
            <p className="text-slate-600">Zarządzaj lokalizacjami magazynu</p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="size-4 mr-2" />
            Dodaj lokalizację
          </Button>
        </div>

        <Card>
          <CardContent className="p-0 overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-white">
                <TableRow>
                  <TableHead className="w-20">ID</TableHead>
                  <TableHead>Nazwa</TableHead>
                  <TableHead>Opis</TableHead>
                  <TableHead className="text-right">Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-slate-500 py-6">
                      Brak lokalizacji. Dodaj pierwszą lokalizację, aby zacząć.
                    </TableCell>
                  </TableRow>
                ) : (
                  locations.map((location) => (
                    <TableRow key={location.id} className="even:bg-slate-50 hover:bg-slate-100/60 transition-colors">
                      <TableCell>{location.id}</TableCell>
                      <TableCell className="font-medium text-slate-800">{location.name}</TableCell>
                      <TableCell className="max-w-lg truncate text-slate-700" title={location.description}>
                        {location.description}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            title="Edytuj lokalizację"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(location)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            title="Usuń lokalizację"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(location.id)}
                          >
                            <Trash2 className="size-4 text-red-500" />
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingLocation ? "Edytuj lokalizację" : "Dodaj nową lokalizację"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="name">Nazwa lokalizacji</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Opis</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
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
