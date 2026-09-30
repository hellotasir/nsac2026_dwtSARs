import React from "react";
import { Crosshair } from "lucide-react";
import type { InspectedPixel } from "../types";

interface CursorTelemetryProps {
  inspectedPixel: InspectedPixel;
  radarBand: string;
  polarization: string;
}

export const CursorTelemetry: React.FC<CursorTelemetryProps> = ({
  inspectedPixel,
  radarBand,
  polarization,
}) => {
  return (
    <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-2xl border border-slate-200 p-4 rounded-xl w-72 pointer-events-none text-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-2.5">
        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
          <Crosshair className="w-3.5 h-3.5 text-blue-600" />
          <span>Cursor Telemetry</span>
        </span>
        <span className="text-[10px] font-mono text-blue-800 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200 font-semibold">
          {radarBand} {polarization}
        </span>
      </div>

      <div className="space-y-2 font-mono text-xs">
        <div className="flex justify-between text-slate-500">
          <span>Location:</span>
          <span className="text-slate-900 font-medium">
            {inspectedPixel.lat}°, {inspectedPixel.lng}°
          </span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>Backscatter (σ0):</span>
          <span className="text-blue-600 font-bold">
            {inspectedPixel.db} dB
          </span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>InSAR Phase (Δφ):</span>
          <span className="text-slate-900 font-bold">
            {inspectedPixel.phase}
          </span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>Coherence (γ):</span>
          <span className="text-blue-600 font-bold">
            {inspectedPixel.coherence}
          </span>
        </div>
      </div>
    </div>
  );
};