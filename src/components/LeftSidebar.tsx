import React from 'react';
import { Coins, Flame, Award, Shield } from 'lucide-react';
import { ExchangeRate } from '../types';
import GlossyOrb from './GlossyOrb';

interface LeftSidebarProps {
  userWallet: number;
  exchangeRate: ExchangeRate;
  reportsCount: number;
  crowdReports: {
    id: string;
    user: string;
    product: string;
    store: string;
    price: number;
    time: string;
  }[];
  activeRole: string;
}

export default function LeftSidebar({
  userWallet,
  exchangeRate,
  reportsCount,
  crowdReports,
  activeRole,
}: LeftSidebarProps) {
  return (
    <aside className="col-span-1 md:col-span-4 lg:col-span-3 space-y-6 hidden md:block self-stretch">
      {/* Logo & Platform Info Card with glowing neon border */}
      <div className="glass-panel purple-glow-border rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(226,255,59,0.1)]">
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#e2ff3b]/5 rounded-full blur-3xl -z-10"></div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#e2ff3b] flex items-center justify-center font-black text-black text-lg shadow-md shadow-[#e2ff3b]/20 font-display">
            F
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-white block text-sm font-display uppercase">
              FORCÉ PULSO
            </span>
            <span className="text-[9px] uppercase text-[#e2ff3b] font-extrabold tracking-widest block">
              San Felipe, Yaracuy
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
          Monitoreo colaborativo en tiempo real. Compara precios en bodegas, abastos y supermercados locales de Yaracuy para ahorrar en cada compra.
        </p>

        <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between">
          <span className="text-[10px] text-[#e2ff3b]/85 uppercase font-black tracking-wider">Tasa Activa S CALLE</span>
          <span className="text-xs text-white bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800 font-mono font-bold">
            1 $ = <strong className="text-[#e2ff3b]">Bs. {exchangeRate.rate}</strong>
          </span>
        </div>
      </div>

      {/* Futuristic "MindWave" 3D Spherical Orb inside sidebar as dynamic radar indicator */}
      <div className="glass-panel rounded-2xl p-5 text-center relative overflow-hidden border border-zinc-800">
        <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full py-1 px-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#e2ff3b] animate-ping"></div>
          <span className="text-[8px] uppercase tracking-wider text-gray-400 font-black">S CALLE Radar</span>
        </div>
        
        <GlossyOrb />
        
        <div className="space-y-1">
          <h4 className="text-xs text-white font-black font-display uppercase tracking-wider">
            Optimización de Consumo
          </h4>
          <p className="text-[10px] text-gray-400 leading-relaxed max-w-xs mx-auto">
            Visualizando la densidad de ofertas colaborativas vigentes en San Felipe hoy.
          </p>
        </div>
      </div>

      {/* Collaborative Wallet Stat Box - Styled like Screen 3 (Profile premium plan) */}
      <div className="glass-panel rounded-2xl p-5 relative overflow-hidden border border-zinc-800">
        <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
        <label className="text-[10px] uppercase tracking-widest text-[#e2ff3b] font-extrabold block mb-3">
          Mi Cartera Colaboradora
        </label>
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-[#e2ff3b]/10 rounded-2xl border border-[#e2ff3b]/30 text-[#e2ff3b]">
            <Coins className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-3xl font-display font-black text-white">
              ${userWallet.toFixed(2)}
            </div>
            <div className="text-[10px] text-[#e2ff3b] font-mono font-bold">
              ≈ Bs. {(userWallet * exchangeRate.rate).toFixed(2)}
            </div>
          </div>
        </div>
        <p className="text-[10px] text-gray-400 mt-4 italic leading-relaxed">
          Saldo acumulado al avisar precios nuevos o ganar cashback. Úsalo como método de pago (Forcé Wallet).
        </p>
      </div>

      {/* Crowd Activity Ticker */}
      <div className="glass-panel rounded-2xl p-5 space-y-4 border border-zinc-800">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
          <label className="text-[10px] uppercase tracking-widest text-gray-400 font-extrabold">
            Actividad en la Zona
          </label>
          <div className="flex items-center gap-1 text-[9px] font-black bg-[#e2ff3b]/10 text-[#e2ff3b] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            <Flame className="w-2.5 h-2.5 animate-pulse shrink-0" />
            <span>{reportsCount} Reportes</span>
          </div>
        </div>
        
        <div className="space-y-2.5 max-h-[200px] overflow-y-auto pr-1">
          {crowdReports.map((report) => (
            <div 
              key={report.id} 
              className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80 hover:border-[#e2ff3b]/30 transition-all text-xs"
            >
              <div className="flex justify-between text-gray-400 text-[9px] mb-1">
                <span className="font-bold text-white">{report.user}</span>
                <span>{report.time}</span>
              </div>
              <div className="text-white font-bold mb-0.5">
                {report.product}
              </div>
              <div className="flex justify-between items-center text-gray-400 text-[10px]">
                <span className="truncate max-w-[120px]">{report.store}</span>
                <strong className="text-[#e2ff3b] font-mono font-bold">${report.price.toFixed(2)}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick How-it-Works Help */}
      <div className="p-5 bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl text-xs space-y-2.5">
        <div className="flex items-center gap-2 text-[#e2ff3b] font-black uppercase tracking-wider text-[10px]">
          <Award className="w-4 h-4 text-[#e2ff3b]" />
          <span>Gana por Ayudar</span>
        </div>
        <p className="text-gray-400 leading-relaxed">
          ¿Viste un precio diferente en la calle? Toca <strong>&ldquo;Avisar Precio&rdquo;</strong>, actualiza la información y gana <strong>+$0.10</strong> inmediatamente.
        </p>
      </div>
    </aside>
  );
}
