import React from 'react';

export default function GlossyOrb() {
  return (
    <div className="relative w-44 h-44 mx-auto flex items-center justify-center my-6 group select-none">
      {/* Intense pulsing neon-yellow behind-glow */}
      <div className="absolute w-28 h-28 rounded-full bg-[#e2ff3b]/5 blur-xl animate-pulse scale-110"></div>
      
      {/* Concentric rotating radar circles */}
      <div className="absolute inset-2 rounded-full border border-dashed border-[#e2ff3b]/20 animate-spin" style={{ animationDuration: '30s' }}></div>
      <div className="absolute inset-6 rounded-full border border-spacing-1 border-dotted border-[#e2ff3b]/10 animate-spin animate-pulse" style={{ animationDuration: '18s', animationDirection: 'reverse' }}></div>
      <div className="absolute inset-10 rounded-full border border-zinc-800"></div>
      <div className="absolute inset-16 rounded-full border border-zinc-800"></div>

      {/* Crosshair grids */}
      <div className="absolute w-40 h-[1px] bg-zinc-900"></div>
      <div className="absolute h-40 w-[1px] bg-zinc-900"></div>

      {/* Central Solid Glossy Radar Node */}
      <div className="absolute w-20 h-20 rounded-full bg-zinc-950 border border-[#e2ff3b]/30 shadow-[inset_0_2px_10px_rgba(226,255,59,0.1),_0_8px_30px_rgba(0,0,0,0.8)] flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-105">
        
        {/* Radar sweeping indicator line */}
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(226,255,59,0.15)_0deg,transparent_180deg)] animate-spin" style={{ animationDuration: '4s' }}></div>
        
        {/* Center core pulse node */}
        <div className="relative z-10 w-9 h-9 rounded-full bg-black border border-zinc-800 flex items-center justify-center shadow-lg">
          <span className="text-sm font-black text-[#e2ff3b] animate-pulse">⚡</span>
        </div>
      </div>

      {/* Radar signal blips (little active signal dots) */}
      <div className="absolute top-[20%] left-[30%] w-2 h-2 rounded-full bg-[#e2ff3b] shadow-lg shadow-[#e2ff3b]/50 animate-ping"></div>
      <div className="absolute bottom-[25%] right-[22%] w-1.5 h-1.5 rounded-full bg-white opacity-40"></div>
    </div>
  );
}

