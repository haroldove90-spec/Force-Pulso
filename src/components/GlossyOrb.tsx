import React from 'react';

export default function GlossyOrb() {
  return (
    <div className="relative w-44 h-44 mx-auto flex items-center justify-center my-6 group select-none">
      {/* Intense pulsing deep purple behind-glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#8100ff]/30 to-[#ff0080]/30 blur-2xl animate-pulse scale-110"></div>
      
      {/* Outer spinning orbital neon ring */}
      <div className="absolute inset-1 rounded-full border border-dashed border-[#8100ff]/40 animate-spin" style={{ animationDuration: '25s' }}></div>
      <div className="absolute inset-4 rounded-full border border-spacing-1 border-dotted border-[#ff0080]/30 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>

      {/* Glossy Metallic 3D-feeling Sphere with multiple overlay layers */}
      <div className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-[#10032c] via-[#4d0b9e] to-[#e60073] shadow-[inset_-8px_-10px_30px_rgba(0,0,0,0.8),_inset_8px_10px_24px_rgba(255,255,255,0.45),_0_12px_36px_rgba(129,0,255,0.65)] flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-105">
        
        {/* Holographic turquoise bottom reflection */}
        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-[#00f5ff]/30 blur-xl mix-blend-screen animate-pulse"></div>
        
        {/* Upper golden highlight flare */}
        <div className="absolute -top-4 -right-2 w-20 h-20 rounded-full bg-[#ffb700]/15 blur-lg mix-blend-screen"></div>

        {/* Dynamic center core waves */}
        <div className="relative z-10 w-16 h-16 rounded-full bg-[#1e0a45]/80 glass-panel border border-[#a200ff]/30 flex items-center justify-center shadow-inner">
          <span className="text-3xl animate-bounce text-pink-400">⚡</span>
        </div>

        {/* Shiny absolute specular glare arc near top-left surface */}
        <div className="absolute top-1.5 left-3.5 w-24 h-12 bg-white/20 rounded-full rotate-[36deg] blur-[2px] pointer-events-none"></div>
      </div>

      {/* Floating miniature orbiting crystal particles */}
      <div className="absolute top-6 left-6 w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg shadow-cyan-400/50 animate-ping"></div>
      <div className="absolute bottom-6 right-6 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-pink-400 to-[#e60073] shadow-lg shadow-pink-400/50 animate-pulse"></div>
    </div>
  );
}
