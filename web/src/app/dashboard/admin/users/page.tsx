'use client';

import { AdminLayout } from "@/components/admin/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  role: "admin" | "worker" | "viewer";
  active: boolean;
  created_at: string;
}

type UserFormData = {
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  role: User["role"];
  active: boolean;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    first_name: "",
    last_name: "",
    password: "",
    role: "worker",
    active: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        password: "",
        role: user.role,
        active: user.active,
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: "",
        first_name: "",
        last_name: "",
        password: "",
        role: "worker",
        active: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingUser) {
        const updateData = {
          username: formData.username,
          first_name: formData.first_name,
          last_name: formData.last_name,
          role: formData.role,
          active: formData.active,
          ...(formData.password && { password: formData.password }),
        };
        await fetch(`/api/admin/users/${editingUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        });
      } else {
        await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
      await fetchUsers();
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to save user:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Czy na pewno chcesz usunąć tego użytkownika?")) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) {
        let message = "Nie udało się usunąć użytkownika";
        try {
          const data = (await res.json()) as { error?: string; details?: unknown };
          if (data?.error) message = data.error;
          if (data?.details) {
            const detailsText =
              typeof data.details === "string"
                ? data.details
                : JSON.stringify(data.details, null, 2);
            message = `${message}\n\n${detailsText}`;
          }
        } catch {
          const text = await res.text();
          if (text) message = text;
        }
        throw new Error(message);
      }
      await fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      window.alert(
        error instanceof Error
          ? error.message
          : "Nie udało się usunąć użytkownika"
      );
    }
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, string> = {
      admin: "bg-red-100 text-red-800",
      worker: "bg-blue-100 text-blue-800",
      viewer: "bg-gray-100 text-gray-800",
    };
    return variants[role] || variants.viewer;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pl-PL");
  };

  return (
    <AdminLayout title="Użytkownicy">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-lg">Zarządzaj użytkownikami systemu</p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/30 transition-all duration-200 hover:shadow-xl">
            <Plus className="size-4 mr-2" />
            Dodaj użytkownika
          </Button>
        </div>

        <Card className="border-0 shadow-xl">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100/50 hover:from-slate-100 hover:to-slate-100">
                    <TableHead className="font-semibold text-slate-700">Login</TableHead>
                    <TableHead className="font-semibold text-slate-700">Imię i nazwisko</TableHead>
                    <TableHead className="font-semibold text-slate-700">Rola</TableHead>
                    <TableHead className="font-semibold text-slate-700">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700">Data utworzenia</TableHead>
                    <TableHead className="text-right font-semibold text-slate-700">Akcje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-medium text-slate-800">{user.username}</TableCell>
                      <TableCell className="font-medium text-slate-800">{user.first_name} {user.last_name}</TableCell>
                      <TableCell>
                        <Badge className={`${getRoleBadge(user.role)} border-0 shadow-sm`}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.active ? "default" : "secondary"}
                          className="border-0 shadow-sm"
                        >
                          {user.active ? "Aktywny" : "Nieaktywny"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600">{formatDate(user.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(user)}
                            className="hover:bg-blue-50 hover:text-blue-600 transition-all"
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(user.id)}
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
                {editingUser ? "Edytuj użytkownika" : "Dodaj nowego użytkownika"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="username" className="text-slate-700 dark:text-slate-200 font-medium">Nazwa użytkownika</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="mt-1.5 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="first_name" className="text-slate-700 dark:text-slate-200 font-medium">Imię</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    className="mt-1.5 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="last_name" className="text-slate-700 dark:text-slate-200 font-medium">Nazwisko</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    className="mt-1.5 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-slate-700 dark:text-slate-200 font-medium">
                    Hasło {editingUser && "(zostaw puste aby nie zmieniać)"}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="mt-1.5 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required={!editingUser}
                  />
                </div>

                <div>
                  <Label htmlFor="role" className="text-slate-700 dark:text-slate-200 font-medium">Rola</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as User["role"] })}>
                    <SelectTrigger className="mt-1.5 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="worker">Pracownik</SelectItem>
                      <SelectItem value="viewer">Przeglądający</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800/70 dark:bg-slate-900/30">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) =>
                      setFormData({ ...formData, active: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20"
                  />
                  <Label htmlFor="active" className="cursor-pointer text-slate-700 dark:text-slate-200 font-medium">
                    Konto aktywne
                  </Label>
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
                  {editingUser ? "Zapisz zmiany" : "Dodaj użytkownika"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
