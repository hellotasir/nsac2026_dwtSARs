import React from "react";
import { Sparkles, BarChart2,  Users } from "lucide-react";
import { CURRENT_YEAR } from "../constants";

interface HeaderProps {
  onOpenAnalytics: () => void;
  onOpenGroupDetails: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAnalytics,
  onOpenGroupDetails,
}) => {
  return (
    <header className="h-16 border-b border-slate-200 bg-white/90 backdrop-blur-2xl px-6 flex items-center justify-between shrink-0 z-40 text-slate-900">
      <div className="flex items-center space-x-3.5">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-extrabold text-sm tracking-wider text-slate-900 uppercase">
              NISAR Ground Station
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center space-x-1 font-semibold">
              <Sparkles className="w-3 h-3 text-blue-500" />
              <span>{CURRENT_YEAR} Active Science Stream</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            NASA-ISRO Synthetic Aperture Radar Operational Surface Visualizer
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={onOpenGroupDetails}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition active:scale-95 border border-slate-200"
        >
          <Users className="w-4 h-4 text-blue-600" />
          <span>Group & Project Details</span>
        </button>

      

        <button
          onClick={onOpenAnalytics}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition active:scale-95 border border-slate-200"
        >
          <BarChart2 className="w-4 h-4 text-blue-600" />
          <span>InSAR Analytics</span>
        </button>
      </div>

      <div className="hidden lg:flex items-center space-x-3 text-xs font-mono">
        <div className="bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl text-blue-700 font-medium flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          <span>Orbit: 12-Day Repeat ({CURRENT_YEAR} Science Ops)</span>
        </div>
      </div>
    </header>
  );
};