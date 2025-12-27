import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AdminHeaderProps {
  title: string;
}

export function AdminHeader({ title }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 ml-64">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>

        <div className="flex items-center gap-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Szukaj..."
              className="pl-10"
            />
          </div>

          <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Bell className="size-5 text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
