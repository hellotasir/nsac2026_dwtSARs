import React from "react";
import { Play, Pause, Clock, Split, MapPin } from "lucide-react";

interface MapHUDProps {
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
  animSpeed: number;
  setAnimSpeed: (speed: number) => void;
  splitView: boolean;
  setSplitView: (val: boolean) => void;
}

export const MapHUD: React.FC<MapHUDProps> = ({
  isPlaying,
  setIsPlaying,
  animSpeed,
  setAnimSpeed,
  splitView,
  setSplitView,
}) => {
  return (
    <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 bg-white/90 backdrop-blur-2xl border border-slate-200 p-2 rounded-xl">
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="bg-black hover:bg-slate-800 border border-black text-white px-3.5 py-2 rounded-lg text-xs font-bold flex items-center space-x-2 transition active:scale-95"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 text-blue-400 fill-current" />
        ) : (
          <Play className="w-4 h-4 text-blue-400 fill-current" />
        )}
        <span>{isPlaying ? "Motion Active" : "Resume Motion"}</span>
      </button>

      <div className="flex items-center space-x-1 bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-lg text-[11px] font-mono text-slate-900">
        <Clock className="w-3.5 h-3.5 text-slate-500" />
        <span className="text-slate-500">Speed:</span>
        {[0.5, 1, 2].map((spd) => (
          <button
            key={spd}
            onClick={() => setAnimSpeed(spd)}
            className={`px-2 py-0.5 rounded-lg text-xs font-semibold transition active:scale-95 ${
              animSpeed === spd
                ? "bg-black text-white border border-black"
                : "text-slate-600 hover:text-black hover:bg-slate-200"
            }`}
          >
            {spd}x
          </button>
        ))}
      </div>

      <button
        onClick={() => setSplitView(!splitView)}
        className={`flex items-center space-x-2 text-xs px-3.5 py-2 rounded-lg font-semibold border transition active:scale-95 ${
          splitView
            ? "bg-black text-white border-black"
            : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
        }`}
      >
        <Split className="w-4 h-4" />
        <span>Dual-Date Comparison</span>
      </button>

      <div className="text-[11px] text-blue-900 font-mono bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 flex items-center space-x-1.5">
        <MapPin className="w-3 h-3 text-blue-600" />
        <span>Click map to select target location</span>
      </div>
    </div>
  );
};