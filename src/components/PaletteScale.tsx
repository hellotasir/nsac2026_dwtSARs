import React from "react";
import { COLOR_PALETTES } from "../constants";

interface PaletteScaleProps {
  colormap: string;
  unit: string;
}

export const PaletteScale: React.FC<PaletteScaleProps> = ({ colormap, unit }) => {
  return (
    <div className="absolute bottom-6 left-6 z-20 bg-white/90 backdrop-blur-2xl border border-slate-200 p-4 rounded-xl w-80 text-slate-900">
      <div className="flex items-center justify-between text-xs font-semibold mb-2">
        <span>{COLOR_PALETTES[colormap]?.name}</span>
        <span className="font-mono text-[10px] text-slate-500">{unit}</span>
      </div>
      <div
        className="h-3 rounded-lg w-full border border-slate-200"
        style={{
          background: `linear-gradient(to right, ${COLOR_PALETTES[colormap]?.colors.join(", ")})`,
        }}
      />
      <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2">
        <span>Low (-π)</span>
        <span>High (+π)</span>
      </div>
    </div>
  );
};