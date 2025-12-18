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
  BoxSelect,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  LayoutList,
  Info
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
  const [formToLocation, setFormToLocation] = useState<number | "">(""); 
  const [formProduct, setFormProduct] = useState(""); 
  const [fixedLocationId, setFixedLocationId] = useState<number | null>(null); 
  
  const [modalLocationSearch, setModalLocationSearch] = useState("");
  const [expandedLocId, setExpandedLocId] = useState<number | null>(null);

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

  const getItemsInLocation = (locId: number) => {
    return stocks.filter(s => s.location_id === locId);
  };

  const openDeliveryModal = (locId: number) => {
    setModalMode('DELIVERY');
    setFixedLocationId(locId);
    setFormProduct("");
    setFormQuantity("");
    setModalLocationSearch("");
    setMessage(null);
    setIsModalOpen(true);
  };

  const openReleaseModal = (locId: number) => {
    setModalMode('RELEASE');
    setFixedLocationId(locId);
    setFormProduct(""); 
    setFormQuantity("");
    setModalLocationSearch("");
    setMessage(null);
    setIsModalOpen(true);
  };

  const openMoveModal = (item: StockItem) => {
    setModalMode('MOVE');
    setTargetItem(item);
    setFormToLocation(""); 
    setFormQuantity("");
    setModalLocationSearch("");
    setExpandedLocId(null);
    setMessage(null);
    setIsModalOpen(true);
  };

  const toggleLocationExpand = (locId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedLocId(prev => prev === locId ? null : locId);
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

    if (modalMode === 'MOVE' && !toLoc) {
        setMessage({ text: "Wybierz lokalizację docelową!", type: "error" });
        setSubmitting(false);
        return;
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
          <div className="bg-blue-600 text-white p-2 rounded-xl shadow-blue-200 shadow-md">
            <Package size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none flex items-center gap-2">
              Magazyn
              {isRefreshing && <Loader2 size={14} className="animate-spin text-slate-400"/>}
            </h1>
            <span className="text-xs text-slate-500 font-medium">Panel Workera</span>
          </div>
        </div>
        <button onClick={() => signOut({ callbackUrl: "/login" })} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
          <LogOut size={20} />
        </button>
      </nav>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Szukaj towaru lub kodu QR..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 bg-white shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        {loadingData ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
            <Loader2 className="animate-spin text-blue-500" size={40}/>
            <p className="text-sm font-medium text-slate-500">Ładowanie magazynu...</p>
          </div>
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
              <div key={loc.id} className={`rounded-3xl shadow-sm border overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md
                ${isDeliveryZone ? 'bg-emerald-50/50 border-emerald-100 ring-1 ring-emerald-500/20' : ''}
                ${isReleaseZone ? 'bg-amber-50/50 border-amber-100 ring-1 ring-amber-500/20' : ''}
                ${!isDeliveryZone && !isReleaseZone ? 'bg-white border-slate-200' : ''}
              `}>
                
                <div className={`px-5 py-4 border-b flex justify-between items-center
                  ${isDeliveryZone ? 'bg-emerald-100/50 border-emerald-100 text-emerald-900' : ''}
                  ${isReleaseZone ? 'bg-amber-100/50 border-amber-100 text-amber-900' : ''}
                  ${!isDeliveryZone && !isReleaseZone ? 'bg-slate-50 border-slate-100 text-slate-700' : ''}
                `}>
                  <div className="flex items-center gap-3 font-bold">
                    <div className={`p-2 rounded-lg ${isDeliveryZone ? 'bg-emerald-200' : isReleaseZone ? 'bg-amber-200' : 'bg-white shadow-sm'}`}>
                       {isDeliveryZone ? <Truck size={18}/> : isReleaseZone ? <BoxSelect size={18}/> : <MapPin size={18} className="opacity-50"/>}
                    </div>
                    {loc.name}
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full 
                    ${isDeliveryZone ? 'bg-emerald-200 text-emerald-800' : isReleaseZone ? 'bg-amber-200 text-amber-800' : 'bg-slate-200 text-slate-600'}
                  `}>
                    {locStocks.length} poz.
                  </span>
                </div>

                {isDeliveryZone && (
                  <div className="p-4 bg-white/40 backdrop-blur-sm border-b border-emerald-100/50">
                    <button 
                      onClick={() => openDeliveryModal(loc.id)}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    >
                      <Plus size={20} />
                      PRZYJMIJ DOSTAWĘ
                    </button>
                  </div>
                )}

                <div className="divide-y divide-slate-100 bg-white">
                  {visibleStocks.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
                        <Package size={20} className="opacity-30"/>
                      </div>
                      <span className="italic">{isDeliveryZone ? "Brak towarów oczekujących" : "Pusta lokalizacja"}</span>
                    </div>
                  ) : (
                    visibleStocks.map(item => (
                      <button 
                        key={item.id}
                        onClick={() => openMoveModal(item)}
                        className="w-full text-left p-4 hover:bg-slate-50 transition flex justify-between items-center group relative overflow-hidden"
                      >
                        <div className="relative z-10">
                          <div className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{item.product_name}</div>
                          <div className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                            {item.qr_code}
                          </div>
                        </div>
                        <div className="relative z-10 font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-slate-200">
                          {item.quantity} szt.
                        </div>
                        
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"/>
                      </button>
                    ))
                  )}
                </div>

                {isReleaseZone && (
                  <div className="p-4 bg-white/40 backdrop-blur-sm border-t border-amber-100/50">
                    <button 
                      onClick={() => openReleaseModal(loc.id)}
                      className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-200 ring-1 ring-black/5">
            
            <div className={`px-6 py-5 border-b flex justify-between items-center text-white shadow-sm relative overflow-hidden
               ${modalMode === 'DELIVERY' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : ''}
               ${modalMode === 'RELEASE' ? 'bg-gradient-to-r from-amber-500 to-orange-500' : ''}
               ${modalMode === 'MOVE' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : ''}
            `}>
              <h2 className="text-lg font-bold flex items-center gap-2 relative z-10">
                {modalMode === 'DELIVERY' && <><Truck size={22}/> Nowa Dostawa</>}
                {modalMode === 'RELEASE' && <><ArrowUp size={22}/> Wydanie Towaru</>}
                {modalMode === 'MOVE' && <><ArrowRight size={22}/> Przesunięcie</>}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 hover:bg-white/20 rounded-full transition relative z-10"
              >
                <X size={20}/>
              </button>
              
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              {message && (
                <div className={`mb-6 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 shadow-sm
                  ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                  {message.type === 'success' ? <CheckCircle2 size={20} className="text-emerald-500"/> : <Info size={20} className="text-red-500"/>}
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {modalMode === 'MOVE' && targetItem && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
                     <div className="bg-white p-3 rounded-xl text-blue-600 shadow-sm ring-1 ring-slate-100"><Package size={24}/></div>
                     <div>
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Wybrany produkt</p>
                       <p className="font-bold text-slate-800 text-lg leading-tight">{targetItem.product_name}</p>
                       <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                         <MapPin size={12}/> {targetItem.location_name} • <span className="font-bold text-slate-700">{targetItem.quantity} szt.</span>
                       </p>
                     </div>
                  </div>
                )}

                {(modalMode === 'DELIVERY' || modalMode === 'RELEASE') && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                      {modalMode === 'DELIVERY' ? "Co przyjechało?" : "Co wydajemy?"}
                    </label>
                    <div className="relative">
                      <select 
                        value={formProduct}
                        onChange={e => setFormProduct(e.target.value)}
                        className="w-full p-4 pl-4 pr-10 border-0 bg-slate-50 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer text-slate-700 font-medium hover:bg-slate-100"
                        required
                      >
                        <option value="">-- Wybierz produkt z listy --</option>
                        {modalMode === 'RELEASE' 
                          ? stocks.filter(s => s.location_id === fixedLocationId).map(s => (
                              <option key={s.product_id} value={s.product_id}>{s.product_name} (Dostępne: {s.quantity})</option>
                            ))
                          : sortedProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)
                        }
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18}/>
                    </div>
                  </div>
                )}

                {modalMode === 'MOVE' && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 flex justify-between items-center">
                      Do lokalizacji
                      <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full flex items-center gap-1">
                        <LayoutList size={10}/> Lista
                      </span>
                    </label>

                    <div className="relative mb-3 group">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                       <input 
                         type="text" 
                         placeholder="Filtruj lokalizacje..."
                         value={modalLocationSearch}
                         onChange={(e) => setModalLocationSearch(e.target.value)}
                         className="w-full pl-10 p-3 text-sm border-0 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                       />
                    </div>

                    <div className="max-h-60 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                      {sortedLocations.map(l => {
                         if (l.id === targetItem?.location_id) return null;
                         if (modalLocationSearch && !l.name.toLowerCase().includes(modalLocationSearch.toLowerCase())) return null;

                         const isSelected = Number(formToLocation) === l.id;
                         const isExpanded = expandedLocId === l.id;
                         const itemsHere = getItemsInLocation(l.id);

                         return (
                           <div key={l.id} className={`rounded-xl border transition-all duration-200 overflow-hidden
                             ${isSelected 
                               ? 'border-blue-500 bg-blue-50/50 shadow-sm ring-1 ring-blue-500' 
                               : 'border-slate-100 bg-white hover:border-blue-200'}
                           `}>
                             <div 
                               onClick={() => setFormToLocation(l.id)}
                               className="p-3 flex justify-between items-center cursor-pointer select-none"
                             >
                               <div className="flex items-center gap-3">
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                                     ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-300 bg-white'}
                                  `}>
                                    {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm"/>}
                                  </div>
                                  <span className={`text-sm font-bold ${isSelected ? 'text-blue-800' : 'text-slate-700'}`}>
                                    {l.name}
                                  </span>
                               </div>
                               
                               <button 
                                 type="button"
                                 onClick={(e) => toggleLocationExpand(l.id, e)}
                                 className={`p-1.5 rounded-lg transition-colors ${isExpanded ? 'bg-slate-200 text-slate-700' : 'hover:bg-slate-100 text-slate-400'}`}
                               >
                                 {isExpanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                               </button>
                             </div>

                             {isExpanded && (
                               <div className="px-4 pb-4 pt-0">
                                 <div className="pt-3 border-t border-slate-200/50">
                                    <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-2 flex items-center gap-1">
                                      <Package size={10}/> Obecny stan:
                                    </p>
                                    <div className="space-y-1.5">
                                      {itemsHere.length === 0 ? (
                                        <p className="text-xs italic text-slate-400 bg-slate-50 p-2 rounded-lg text-center">Pusta lokalizacja</p>
                                      ) : (
                                        itemsHere.map(item => (
                                          <div key={item.id} className="flex justify-between items-center text-xs p-2 rounded-lg bg-white border border-slate-100 shadow-sm">
                                            <span className="font-medium text-slate-700 truncate max-w-[180px]">{item.product_name}</span>
                                            <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">{item.quantity}</span>
                                          </div>
                                        ))
                                      )}
                                    </div>
                                 </div>
                               </div>
                             )}
                           </div>
                         )
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Ilość</label>
                  <input 
                    type="number" 
                    min="1"
                    max={(modalMode === 'MOVE') ? targetItem?.quantity : (modalMode === 'RELEASE' ? stocks.find(s => s.product_id === Number(formProduct) && s.location_id === fixedLocationId)?.quantity : undefined)}
                    value={formQuantity}
                    onChange={e => setFormQuantity(e.target.value)}
                    className="w-full p-4 border-0 rounded-xl bg-slate-50 font-mono text-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300"
                    placeholder="Wpisz liczbę..."
                    required
                  />
                  {(modalMode === 'MOVE' && targetItem) && (
                     <div className="text-xs text-right mt-2 text-slate-400 font-medium">
                       Maksymalnie: <span className="text-slate-700">{targetItem.quantity} szt.</span>
                     </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className={`w-full py-4 mt-2 rounded-xl text-white font-bold shadow-lg text-lg tracking-wide transition-all transform active:scale-[0.98]
                    ${modalMode === 'DELIVERY' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:to-emerald-500 shadow-emerald-500/30' : ''}
                    ${modalMode === 'RELEASE' ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:to-amber-500 shadow-orange-500/30' : ''}
                    ${modalMode === 'MOVE' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:to-blue-600 shadow-blue-500/30' : ''}
                    ${submitting ? 'opacity-80 cursor-wait' : ''}
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