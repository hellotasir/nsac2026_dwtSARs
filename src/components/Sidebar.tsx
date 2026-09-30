import React from "react";
import {
  Layers,
  Globe,
  Check,
  Radio,
  Search,
  Plus,
  Loader2,
  MapPin,
  Mountain,
  Cpu,
  Sliders,
} from "lucide-react";
import { COLOR_PALETTES, SAR_MODES, CURRENT_YEAR } from "../constants";
import type { Hotspot, NominatimSearchResult } from "../types";

interface SidebarProps {
  hotspots: Hotspot[];
  selectedSpot: Hotspot;
  setSelectedSpot: (spot: Hotspot) => void;
  radarBand: string;
  setRadarBand: (band: string) => void;
  polarization: string;
  setPolarization: (pol: string) => void;
  sarMode: string;
  setSarMode: (mode: string) => void;
  colormap: string;
  setColormap: (cmap: string) => void;
  opacity: number;
  setOpacity: (val: number) => void;
  overlaySize: number;
  setOverlaySize: (val: number) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isSearching: boolean;
  searchError: string;
  searchResults: NominatimSearchResult[];
  showManualForm: boolean;
  setShowManualForm: (show: boolean) => void;
  manualName: string;
  setManualName: (val: string) => void;
  manualLat: string;
  setManualLat: (val: string) => void;
  manualLng: string;
  setManualLng: (val: string) => void;
  handleLocationSearch: (e: React.FormEvent) => void;
  handleSelectSearchResult: (res: NominatimSearchResult) => void;
  handleAddManualLocation: (e: React.FormEvent) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  hotspots,
  selectedSpot,
  setSelectedSpot,
  radarBand,
  setRadarBand,
  polarization,
  setPolarization,
  sarMode,
  setSarMode,
  colormap,
  setColormap,
  opacity,
  setOpacity,
  overlaySize,
  setOverlaySize,
  searchQuery,
  setSearchQuery,
  isSearching,
  searchError,
  searchResults,
  showManualForm,
  setShowManualForm,
  manualName,
  setManualName,
  manualLat,
  setManualLat,
  manualLng,
  setManualLng,
  handleLocationSearch,
  handleSelectSearchResult,
  handleAddManualLocation,
}) => {
  return (
    <aside className="w-80 bg-white border-r border-slate-200 text-slate-800 flex flex-col z-30 shrink-0 overflow-y-auto">
      <div className="p-4 space-y-5">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900">
            <span className="uppercase tracking-wider text-[11px] text-slate-500">
              Basemap Layer
            </span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="bg-white border border-slate-200 p-2.5 rounded-lg text-xs font-medium text-slate-900 flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>Esri Satellite Imagery</span>
            </span>
            <Check className="w-4 h-4 text-blue-600" />
          </div>
        </div>

        <div className="bg-blue-50/50 border border-blue-100 p-3.5 rounded-xl space-y-1.5">
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-900">
            <Radio className="w-4 h-4 text-blue-600 animate-pulse" />
            <span>NASA-ISRO NISAR Operations ({CURRENT_YEAR})</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Utilizing live radar remote sensing streams from the active{" "}
            <strong className="text-slate-900">NASA-ISRO Synthetic Aperture Radar (NISAR)</strong> mission
            for sub-centimeter global surface deformation tracking.
          </p>
        </div>

        <div className="pt-2 border-t border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
              <Search className="w-3.5 h-3.5 text-slate-700" />
              <span>Search Location</span>
            </label>
            <button
              onClick={() => setShowManualForm(!showManualForm)}
              className="bg-black border border-black hover:bg-slate-800 text-white text-[10px] font-mono px-2.5 py-1 rounded-lg flex items-center space-x-1 transition active:scale-95"
            >
              <Plus className="w-3 h-3" />
              <span>{showManualForm ? "Hide Lat/Lng" : "Manual Lat/Lng"}</span>
            </button>
          </div>

          <form onSubmit={handleLocationSearch} className="flex space-x-2">
            <input
              type="text"
              placeholder="e.g. Mount Vesuvius, Tokyo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="bg-black text-white hover:bg-slate-800 border border-black px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-center transition active:scale-95 shrink-0"
            >
              {isSearching ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Search className="w-3.5 h-3.5" />
              )}
            </button>
          </form>

          {searchError && (
            <div className="text-[11px] text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-lg">
              {searchError}
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 space-y-1">
              <div className="text-[10px] text-slate-500 font-mono px-2 py-1 border-b border-slate-200">
                Geocoded Locations:
              </div>
              {searchResults.map((res, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectSearchResult(res)}
                  className="w-full text-left p-2.5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 transition text-xs flex items-center justify-between text-slate-900 active:scale-95"
                >
                  <span className="truncate text-slate-900 font-medium">
                    {res.display_name}
                  </span>
                  <span className="font-mono text-[9px] text-slate-500 ml-2 shrink-0">
                    {parseFloat(res.lat).toFixed(2)}°,{" "}
                    {parseFloat(res.lon).toFixed(2)}°
                  </span>
                </button>
              ))}
            </div>
          )}

          {showManualForm && (
            <form
              onSubmit={handleAddManualLocation}
              className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5"
            >
              <div className="text-[10px] text-slate-900 font-bold uppercase tracking-wider">
                Manual Coordinates Input
              </div>
              <input
                type="text"
                placeholder="Target Name (e.g. Rotterdam Port)"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  step="any"
                  placeholder="Lat (-90 to 90)"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  required
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Lng (-180 to 180)"
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black hover:bg-slate-800 text-white border border-black py-2 rounded-lg text-xs font-semibold transition flex items-center justify-center space-x-1 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Target to Map</span>
              </button>
            </form>
          )}
        </div>

        <div className="pt-3 border-t border-slate-200">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2.5 items-center justify-between">
            <span>Observation Targets ({hotspots.length})</span>
            <MapPin className="w-3.5 h-3.5 text-slate-700" />
          </label>
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {hotspots.map((spot) => {
              const IconComp = spot.icon || Mountain;
              const isSelected = selectedSpot.id === spot.id;
              return (
                <button
                  key={spot.id}
                  onClick={() => {
                    setSelectedSpot(spot);
                    setRadarBand(
                      spot.band.includes("L-band") ? "L-band" : "S-band"
                    );
                    setPolarization(spot.pol);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all duration-200 flex items-start space-x-3 active:scale-95 ${
                    isSelected
                      ? "bg-blue-50 border-blue-500 text-slate-900 ring-1 ring-blue-500"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-white text-slate-500 border border-slate-200"
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs truncate text-slate-900">
                      {spot.name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 truncate mt-0.5">
                      {spot.lat.toFixed(2)}°, {spot.lng.toFixed(2)}°
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2.5 items-center justify-between">
            <span>Radar Sensor Configuration</span>
            <Cpu className="w-3.5 h-3.5 text-slate-700" />
          </label>

          <div className="grid grid-cols-2 gap-2 mb-3">
            {["L-band", "S-band"].map((band) => (
              <button
                key={band}
                onClick={() => setRadarBand(band)}
                className={`py-2 rounded-lg border text-xs font-mono font-bold transition-all active:scale-95 flex flex-col items-center justify-center ${
                  radarBand === band
                    ? "bg-black text-white border-black"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span>{band}</span>
                <span className="text-[9px] font-normal text-slate-400">
                  {band === "L-band" ? "24 cm λ (NASA)" : "12 cm λ (ISRO)"}
                </span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {["HH", "HV", "VV", "VH"].map((pol) => (
              <button
                key={pol}
                onClick={() => setPolarization(pol)}
                className={`py-1.5 rounded-lg border text-center text-xs font-mono transition active:scale-95 ${
                  polarization === pol
                    ? "bg-black text-white border-black font-bold"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {pol}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center justify-between">
            <span>SAR Visualization Mode</span>
            <Layers className="w-3.5 h-3.5 text-slate-700" />
          </label>
          <div className="space-y-1.5">
            {SAR_MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setSarMode(mode.id)}
                className={`w-full text-left text-xs px-3.5 py-2.5 rounded-xl border transition-all active:scale-95 flex items-center space-x-2.5 ${
                  sarMode === mode.id
                    ? "bg-blue-50 border-blue-500 text-blue-900 font-semibold"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span>{mode.icon}</span>
                <span className="truncate">{mode.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 space-y-4">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block items-center justify-between">
            <span>InSAR Overlay Controls</span>
            <Sliders className="w-3.5 h-3.5 text-slate-700" />
          </label>

          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1.5">
              <span>InSAR Layer Opacity</span>
              <span className="font-mono text-slate-900 font-semibold">
                {Math.round(opacity * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="1.0"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1.5">
              <span>InSAR Coverage Size</span>
              <span className="font-mono text-slate-900 font-semibold">
                {(overlaySize * 100).toFixed(0)} km
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.80"
              step="0.025"
              value={overlaySize}
              onChange={(e) => setOverlaySize(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1.5">
              <span>Palette Ramp</span>
              <span className="font-mono text-slate-900 text-[10px] font-semibold">
                {COLOR_PALETTES[colormap]?.name.split(" ")[0]}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {Object.keys(COLOR_PALETTES).map((cmapKey) => (
                <button
                  key={cmapKey}
                  onClick={() => setColormap(cmapKey)}
                  className={`h-6 rounded-lg border transition-all active:scale-95 ${
                    colormap === cmapKey
                      ? "ring-2 ring-blue-600 border-white scale-105"
                      : "border-slate-200"
                  }`}
                  style={{
                    background: `linear-gradient(to right, ${COLOR_PALETTES[cmapKey].colors.join(", ")})`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};