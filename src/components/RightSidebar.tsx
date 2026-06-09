import React from 'react';
import { TrendingUp, Coins, X, HelpCircle } from 'lucide-react';
import { Product, ExchangeRate } from '../types';

interface RightSidebarProps {
  reportingProduct: Product | null;
  setReportingProduct: (p: Product | null) => void;
  reportingPrice: string;
  setReportingPrice: (val: string) => void;
  reportingStoreId: string;
  setReportingStoreId: (val: string) => void;
  reportingStockStatus: 'DISPONIBLE' | 'POCAS UNIDADES' | 'AGOTADO';
  setReportingStockStatus: (val: 'DISPONIBLE' | 'POCAS UNIDADES' | 'AGOTADO') => void;
  reportingStockCount: string;
  setReportingStockCount: (val: string) => void;
  handlePostReport: (e: React.FormEvent) => void;
  storesList: { id: string; name: string; distance: string }[];
  exchangeRate: ExchangeRate;
}

export default function RightSidebar({
  reportingProduct,
  setReportingProduct,
  reportingPrice,
  setReportingPrice,
  reportingStoreId,
  setReportingStoreId,
  reportingStockStatus,
  setReportingStockStatus,
  reportingStockCount,
  setReportingStockCount,
  handlePostReport,
  storesList,
  exchangeRate,
}: RightSidebarProps) {
  return (
    <aside className="col-span-1 md:col-span-12 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-col gap-6 self-stretch">
      
      {/* Siete Calles Average Pricing info panel */}
      <div className="glass-panel rounded-2xl p-5 space-y-3 border border-zinc-800">
        <h3 className="font-bold text-white text-xs lg:text-sm tracking-tight flex items-center gap-2 font-display">
          <TrendingUp className="w-4 h-4 text-[#e2ff3b]" />
          <span>Análisis S CALLE</span>
        </h3>
        <p className="text-xs text-gray-400 leading-relaxed">
          La divisa se devalúa constantemente, por lo que la comunidad vigila el factor <strong className="text-[#e2ff3b]">S CALLE</strong> de Yaracuy 24/7.
        </p>
        <div className="space-y-2.5 border-t border-zinc-800 pt-3 text-xs">
          <div className="flex justify-between font-mono">
            <span className="text-gray-400">Promedio Semana</span>
            <span className="text-white font-bold">Bs. 38.30</span>
          </div>
          <div className="flex justify-between font-mono">
            <span className="text-gray-400">Máximo Registrado</span>
            <span className="text-[#e2ff3b] font-bold">Bs. 38.65</span>
          </div>
          <div className="flex justify-between font-mono">
            <span className="text-gray-400">Desviación Estándar</span>
            <span className="text-emerald-400 font-bold">± 0.2%</span>
          </div>
        </div>
      </div>

      {/* Crowdsourced reporting form inside sidebar box */}
      {reportingProduct ? (
        <div className="glass-panel-heavy rounded-2xl p-5 space-y-4 animate-fadeIn border border-[#e2ff3b]/25 shadow-[0_0_20px_rgba(226,255,59,0.05)]">
          <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
            <h3 className="font-extrabold text-white text-xs lg:text-sm tracking-tight flex items-center gap-2 font-display uppercase">
              <Coins className="w-4 h-4 text-[#e2ff3b] animate-bounce" />
              <span>Avisar Precio</span>
            </h3>
            <button 
              type="button"
              onClick={() => setReportingProduct(null)}
              className="p-1 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handlePostReport} className="space-y-3.5 text-xs">
            <div>
              <label className="text-[10px] text-[#e2ff3b] font-bold block mb-1 uppercase tracking-wider">Carga de Producto:</label>
              <div className="bg-zinc-900 px-3 py-2.5 rounded-xl border border-zinc-800 text-white font-semibold text-xs flex items-center gap-2.5">
                <span className="text-xl">{reportingProduct.icon}</span>
                <span>{reportingProduct.name}</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[#e2ff3b] font-bold block mb-1 uppercase tracking-wider">📍 Selecciona Comercio:</label>
              <select 
                value={reportingStoreId}
                onChange={(e) => setReportingStoreId(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white outline-none focus:border-[#e2ff3b]/65 cursor-pointer"
              >
                {storesList.map((store) => (
                  <option key={store.id} value={store.id} className="bg-zinc-950 text-white">
                    {store.name} ({store.distance})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] text-[#e2ff3b] font-bold block mb-1 uppercase tracking-wider">Precio en USD ($):</label>
                <input 
                  type="number"
                  step="0.01"
                  placeholder="1.95"
                  required
                  value={reportingPrice}
                  onChange={(e) => setReportingPrice(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#e2ff3b]/65 rounded-xl p-2.5 text-white font-mono outline-none font-bold placeholder-zinc-700"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#e2ff3b] font-bold block mb-1 uppercase tracking-wider">Abasto Stock:</label>
                <select 
                  value={reportingStockStatus}
                  onChange={(e) => setReportingStockStatus(e.target.value as any)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white outline-none cursor-pointer"
                >
                  <option value="DISP" className="bg-zinc-950">Hay bastante</option>
                  <option value="DISPONIBLE" className="bg-zinc-950">Disponible</option>
                  <option value="POCAS UNIDADES" className="bg-zinc-950">Pocas unidades</option>
                  <option value="AGOTADO" className="bg-zinc-950">Agotado total</option>
                </select>
              </div>
            </div>

            {reportingStockStatus === 'POCAS UNIDADES' && (
              <div className="animate-slideDown">
                <label className="text-[10px] text-[#e2ff3b] font-bold block mb-1 uppercase tracking-wider">Unidades estimadas:</label>
                <input 
                  type="number"
                  placeholder="9"
                  value={reportingStockCount}
                  onChange={(e) => setReportingStockCount(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#e2ff3b]/65 rounded-xl p-2.5 text-white font-mono outline-none"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 glow-btn-purple text-black font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all cursor-pointer"
            >
              Enviar Reporte & Ganar $0.10
            </button>
          </form>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl p-6 text-center flex flex-col items-center justify-center space-y-4 border border-zinc-800">
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-2xl shadow-inner border border-zinc-800">
            💬
          </div>
          <div className="space-y-1">
            <h4 className="font-extrabold text-white text-xs lg:text-sm font-display uppercase tracking-wider">
              ¿Dudas de un precio?
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
              Selecciona cualquier producto y avisa si el precio ha variado. El resto de la comunidad de San Felipe te lo agradecerá muchísimo.
            </p>
          </div>
        </div>
      )}

      {/* Quick legal stats footnote */}
      <div className="text-[9px] text-gray-600 text-center italic hover:text-white transition-colors leading-normal pt-4 col-span-1 md:col-span-2 lg:col-span-1">
        Forcé Yaracuy Applet v3.3.877373 © 2026. Todos los derechos reservados. No afiliado directa ni indirectamente con organismos estatales venezolanos.
      </div>

    </aside>
  );
}
