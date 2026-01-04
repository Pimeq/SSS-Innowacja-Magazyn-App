"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

interface AdminHeaderProps {
  title: string;
}

type ProductSearchItem = {
  id: number;
  name: string;
  qr_code: string;
};

export function AdminHeader({ title }: AdminHeaderProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<ProductSearchItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/products");
        if (!res.ok) return;
        const data = (await res.json()) as ProductSearchItem[];
        if (!cancelled) setProducts(data);
      } catch {
        // ignore search bootstrap errors
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) => {
        return (
          p.name.toLowerCase().includes(q) ||
          p.qr_code.toLowerCase().includes(q)
        );
      })
      .slice(0, 8);
  }, [products, query]);

  const openStockManager = (productId: number) => {
    setIsOpen(false);
    setQuery("");
    router.push(`/dashboard/admin/stock?productId=${productId}`);
  };

  return (
    <header className="relative z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 px-8 py-5 ml-64 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">{title}</h2>

        <div className="flex items-center gap-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Szukaj..."
              value={query}
              onChange={(e) => {
                const next = e.target.value;
                setQuery(next);
                setIsOpen(next.trim().length > 0);
              }}
              onFocus={() => setIsOpen(query.trim().length > 0)}
              onBlur={() => {
                // allow click on dropdown items
                window.setTimeout(() => setIsOpen(false), 120);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && results.length > 0) {
                  e.preventDefault();
                  openStockManager(results[0].id);
                }
                if (e.key === "Escape") {
                  setIsOpen(false);
                }
              }}
              className="pl-10 placeholder:text-slate-400 text-slate-900 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />

            {isOpen && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 z-[60] overflow-hidden rounded-xl border border-slate-200 bg-white/95 backdrop-blur shadow-2xl ring-1 ring-black/5">
                <div className="max-h-80 overflow-auto p-1">
                  {results.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => openStockManager(p.id)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="min-w-0 flex-1 font-medium text-slate-900 truncate">
                        {p.name}
                      </span>
                      <span className="shrink-0 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-700">
                        {p.qr_code}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
