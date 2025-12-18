"use client";

import { useState, useEffect, useMemo } from "react";
import { signOut } from "next-auth/react";
import { 
  LogOut, 
  Search, 
  Package, 
  MapPin,
  ArrowRight,
  ArrowUp,
  X,
  Loader2,
  Plus,
  Truck,
  BoxSelect
} from "lucide-react";

type StockItem = {
  id: number;
  product_name: string;
  qr_code: string;
  location_name: string;
  location_id: number;
  product_id: number;
  quantity: number;
  updated_at: string;
};

type Location = { id: number; name: string };
type Product = { id: number; name: string };

export default function WorkerDashboard() {
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  
  const [loadingData, setLoadingData] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'DELIVERY' | 'RELEASE' | 'MOVE'>('DELIVERY');
  
  const [targetItem, setTargetItem] = useState<StockItem | null>(null);
  const [formQuantity, setFormQuantity] = useState("");
  const [formToLocation, setFormToLocation] = useState(""); 
  const [formProduct, setFormProduct] = useState(""); 
  const [fixedLocationId, setFixedLocationId] = useState<number | null>(null); 

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);


  const fetchData = async (isBackground = false) => {
    if (!isBackground) setLoadingData(true);
    else setIsRefreshing(true);

    try {
      const [stockRes, prodRes, locRes] = await Promise.all([
        fetch('/api/stock'),
        fetch('/api/products'),
        fetch('/api/locations')
      ]);

      if (stockRes.ok) setStocks(await stockRes.json());
      if (prodRes.ok) setProducts(await prodRes.json());
      if (locRes.ok) setLocations(await locRes.json());
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoadingData(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const sortedLocations = useMemo(() => {
    return [...locations].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      
      if (nameA.includes("przyjęć")) return -1;
      if (nameB.includes("przyjęć")) return 1;
      if (nameA.includes("wydań")) return 1; 
      if (nameB.includes("wydań")) return -1;
      
      return nameA.localeCompare(nameB);
    });
  }, [locations]);

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);


  const openDeliveryModal = (locId: number) => {
    setModalMode('DELIVERY');
    setFixedLocationId(locId);
    setFormProduct("");
    setFormQuantity("");
    setMessage(null);
    setIsModalOpen(true);
  };

  const openReleaseModal = (locId: number) => {
    setModalMode('RELEASE');
    setFixedLocationId(locId);
    setFormProduct(""); 
    setFormQuantity("");
    setMessage(null);
    setIsModalOpen(true);
  };

  const openMoveModal = (item: StockItem) => {
    setModalMode('MOVE');
    setTargetItem(item);
    setFormToLocation("");
    setFormQuantity("");
    setMessage(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    let type: 'IN' | 'OUT' | 'MOVE' = 'MOVE';
    let productId: number | string = "";
    let fromLoc: number | null = null;
    let toLoc: number | null | string = null;

    if (modalMode === 'DELIVERY') {
      type = 'IN';
      productId = formProduct;
      toLoc = fixedLocationId; 
      fromLoc = null;
    } else if (modalMode === 'RELEASE') {
      type = 'OUT';
      productId = formProduct; 
      fromLoc = fixedLocationId; 
      toLoc = null;
    } else if (modalMode === 'MOVE') {
      type = 'MOVE';
      productId = targetItem?.product_id || "";
      fromLoc = targetItem?.location_id || null;
      toLoc = formToLocation;
    }

    try {
      const res = await fetch("/api/stock/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          quantity: formQuantity,
          productId,
          fromLocationId: fromLoc,
          toLocationId: toLoc,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Błąd operacji");

      setMessage({ text: "Sukces!", type: "success" });
      
      setTimeout(() => {
        setIsModalOpen(false);
        fetchData(true);
      }, 800);

    } catch (err: unknown) {
      let errorMessage = "Wystąpił nieoczekiwany błąd";
      if (err instanceof Error) errorMessage = err.message;
      setMessage({ text: errorMessage, type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-20">
      
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <Package size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none flex items-center gap-2">
              Magazyn
              {isRefreshing && <Loader2 size={14} className="animate-spin text-slate-400"/>}
            </h1>
            <span className="text-xs text-slate-500">Panel Workera</span>
          </div>
        </div>
        <button onClick={() => signOut({ callbackUrl: "/login" })} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
          <LogOut size={20} />
        </button>
      </nav>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Szukaj towaru..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loadingData ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-500" size={40}/></div>
        ) : (
          sortedLocations.map(loc => {
            const locStocks = stocks.filter(s => s.location_id === loc.id);
            const isDeliveryZone = loc.name.toLowerCase().includes("przyjęć");
            const isReleaseZone = loc.name.toLowerCase().includes("wydań");

            if (searchTerm === "" && locStocks.length === 0 && !isDeliveryZone && !isReleaseZone) return null;

            const visibleStocks = searchTerm 
              ? locStocks.filter(s => s.product_name.toLowerCase().includes(searchTerm.toLowerCase()) || s.qr_code.toLowerCase().includes(searchTerm.toLowerCase()))
              : locStocks;
            
            if (searchTerm !== "" && visibleStocks.length === 0) return null;

            return (
              <div key={loc.id} className={`rounded-2xl shadow-sm border overflow-hidden flex flex-col transition-all duration-300
                ${isDeliveryZone ? 'bg-green-50/50 border-green-200' : ''}
                ${isReleaseZone ? 'bg-orange-50/50 border-orange-200' : ''}
                ${!isDeliveryZone && !isReleaseZone ? 'bg-white border-slate-200' : ''}
              `}>
                
                <div className={`px-4 py-3 border-b flex justify-between items-center
                  ${isDeliveryZone ? 'bg-green-100 border-green-200 text-green-800' : ''}
                  ${isReleaseZone ? 'bg-orange-100 border-orange-200 text-orange-900' : ''}
                  ${!isDeliveryZone && !isReleaseZone ? 'bg-slate-50 border-slate-100 text-slate-700' : ''}
                `}>
                  <div className="flex items-center gap-2 font-bold">
                    {isDeliveryZone ? <Truck size={18}/> : isReleaseZone ? <BoxSelect size={18}/> : <MapPin size={18} className="opacity-50"/>}
                    {loc.name}
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-white/50 opacity-70">
                    {locStocks.length} poz.
                  </span>
                </div>

                {isDeliveryZone && (
                  <div className="p-4 bg-white/50 border-b border-green-100">
                    <button 
                      onClick={() => openDeliveryModal(loc.id)}
                      className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-sm flex items-center justify-center gap-2 transition active:scale-[0.98]"
                    >
                      <Plus size={20} />
                      PRZYJMIJ DOSTAWĘ
                    </button>
                  </div>
                )}

                <div className="divide-y divide-slate-100/50 bg-white">
                  {visibleStocks.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-sm italic">
                      {isDeliveryZone ? "Brak towarów oczekujących." : "Pusta lokalizacja."}
                    </div>
                  ) : (
                    visibleStocks.map(item => (
                      <button 
                        key={item.id}
                        onClick={() => openMoveModal(item)}
                        className="w-full text-left p-4 hover:bg-blue-50 transition flex justify-between items-center group"
                      >
                        <div>
                          <div className="font-bold text-slate-800 group-hover:text-blue-700">{item.product_name}</div>
                          <div className="text-xs text-slate-400 font-mono">{item.qr_code}</div>
                        </div>
                        <div className="font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg group-hover:bg-white">
                          {item.quantity}
                        </div>
                      </button>
                    ))
                  )}
                </div>

                {isReleaseZone && (
                  <div className="p-4 bg-white/50 border-t border-orange-100">
                    <button 
                      onClick={() => openReleaseModal(loc.id)}
                      className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-sm flex items-center justify-center gap-2 transition active:scale-[0.98]"
                    >
                      <ArrowUp size={20} />
                      ZATWIERDŹ WYDANIE
                    </button>
                  </div>
                )}

              </div>
            );
          })
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            
            <div className={`p-4 border-b flex justify-between items-center text-white
               ${modalMode === 'DELIVERY' ? 'bg-green-600' : ''}
               ${modalMode === 'RELEASE' ? 'bg-orange-500' : ''}
               ${modalMode === 'MOVE' ? 'bg-blue-600' : ''}
            `}>
              <h2 className="text-lg font-bold flex items-center gap-2">
                {modalMode === 'DELIVERY' && <><Truck size={20}/> Nowa Dostawa</>}
                {modalMode === 'RELEASE' && <><ArrowUp size={20}/> Wydanie Towaru</>}
                {modalMode === 'MOVE' && <><ArrowRight size={20}/> Przesunięcie</>}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-white/20 rounded-full"><X size={20}/></button>
            </div>

            <div className="p-6">
              {message && (
                <div className={`mb-4 p-3 rounded-lg text-sm font-bold text-center ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {modalMode === 'MOVE' && targetItem && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                     <p className="text-sm text-blue-600">Produkt:</p>
                     <p className="font-bold text-blue-900 text-lg">{targetItem.product_name}</p>
                     <p className="text-sm text-blue-600 mt-1">Obecnie: {targetItem.location_name} ({targetItem.quantity} szt.)</p>
                  </div>
                )}

                {(modalMode === 'DELIVERY' || modalMode === 'RELEASE') && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      {modalMode === 'DELIVERY' ? "Co przyjechało?" : "Co wydajemy?"}
                    </label>
                    <select 
                      value={formProduct}
                      onChange={e => setFormProduct(e.target.value)}
                      className="w-full p-3 border rounded-xl bg-slate-50"
                      required
                    >
                      <option value="">-- Wybierz produkt --</option>
                      {modalMode === 'RELEASE' 
                        ? stocks.filter(s => s.location_id === fixedLocationId).map(s => (
                            <option key={s.product_id} value={s.product_id}>{s.product_name} (Dostępne: {s.quantity})</option>
                          ))
                        : sortedProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)
                      }
                    </select>
                  </div>
                )}

                {modalMode === 'MOVE' && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Do lokalizacji</label>
                    <select 
                      value={formToLocation}
                      onChange={e => setFormToLocation(e.target.value)}
                      className="w-full p-3 border rounded-xl bg-slate-50"
                      required
                    >
                      <option value="">-- Wybierz cel --</option>
                      {sortedLocations.map(l => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Ilość</label>
                  <input 
                    type="number" 
                    min="1"
                    max={(modalMode === 'MOVE') ? targetItem?.quantity : (modalMode === 'RELEASE' ? stocks.find(s => s.product_id === Number(formProduct) && s.location_id === fixedLocationId)?.quantity : undefined)}
                    value={formQuantity}
                    onChange={e => setFormQuantity(e.target.value)}
                    className="w-full p-3 border rounded-xl bg-slate-50 font-mono text-lg"
                    placeholder="0"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className={`w-full py-4 mt-2 rounded-xl text-white font-bold shadow-lg transition active:scale-[0.98]
                    ${modalMode === 'DELIVERY' ? 'bg-green-600 hover:bg-green-700' : ''}
                    ${modalMode === 'RELEASE' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                    ${modalMode === 'MOVE' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                    ${submitting ? 'opacity-70' : ''}
                  `}
                >
                  {submitting ? <Loader2 className="animate-spin mx-auto"/> : "ZATWIERDŹ"}
                </button>

              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}