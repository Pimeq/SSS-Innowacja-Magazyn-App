import { Warehouse, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  MapPin,
  Warehouse as WarehouseIcon,
  History,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/admin/products", label: "Produkty", icon: Package },
    { href: "/dashboard/admin/users", label: "Użytkownicy", icon: Users },
    { href: "/dashboard/admin/locations", label: "Lokalizacje", icon: MapPin },
    { href: "/dashboard/admin/stock", label: "Stan magazynu", icon: WarehouseIcon },
    { href: "/dashboard/admin/history", label: "Historia", icon: History },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="w-64 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white h-screen flex flex-col fixed left-0 top-0 shadow-2xl">
      <div className="p-6 border-b border-slate-700/50">
        <h1 className="flex items-center gap-3 font-bold text-xl">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg">
            <Warehouse className="size-5" />
          </div>
          <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">Admin Panel</span>
        </h1>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                      : "text-slate-300 hover:bg-slate-800/50 hover:text-white hover:translate-x-1"
                  }`}
                >
                  <Icon className="size-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-700/50 space-y-3">
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/30 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-sm font-bold shadow-lg">
            A
          </div>
          <div>
            <p className="text-sm font-semibold">Admin</p>
            <p className="text-xs text-slate-400">Administrator</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-red-600/20 hover:text-red-400 transition-all duration-200 hover:translate-x-1"
        >
          <LogOut className="size-5" />
          <span className="font-medium">Wyloguj</span>
        </button>
      </div>
    </div>
  );
}
