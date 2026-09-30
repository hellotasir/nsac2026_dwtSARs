import React, { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

import { BASEMAPS, INITIAL_HOTSPOTS } from "./constants";
import { createSyntheticHotspot } from "./utils/helpers";

// Custom Hooks
import { useSarCanvas } from "./hooks/useSarCanvas";

// Modular Components
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { MapHUD } from "./components/MapHUD";
import { CursorTelemetry } from "./components/CursorTelemetry";
import { PaletteScale } from "./components/PaletteScale";
import { AnalyticsTab } from "./components/AnalyticsTab";
import { GroupDetailsTab } from "./components/GroupDetailsTab"; // 1. Added import
import type {
  Hotspot,
  InspectedPixel,
  LeafletImageOverlay,
  LeafletMap,
  LeafletMouseEvent,
  LeafletTileLayer,
  NominatimReverseResult,
  NominatimSearchResult,
} from "./types";

export default function App() {
  // 2. Updated activeDrawer state type to include "group"
  const [activeDrawer, setActiveDrawer] = useState<"analytics" | "group" | null>(null);
  const [hotspots, setHotspots] = useState<Hotspot[]>(INITIAL_HOTSPOTS);
  const [selectedSpot, setSelectedSpot] = useState<Hotspot>(INITIAL_HOTSPOTS[0]);
  const [selectedBasemap] = useState(BASEMAPS[0]);

  // Motion State
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeOffset, setTimeOffset] = useState(0);
  const [animSpeed, setAnimSpeed] = useState(1);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<NominatimSearchResult[]>([]);
  const [searchError, setSearchError] = useState("");
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");

  // NISAR Controls
  const [radarBand, setRadarBand] = useState("L-band");
  const [polarization, setPolarization] = useState("HH");
  const [sarMode, setSarMode] = useState("insar_phase");
  const [colormap, setColormap] = useState("phase_wrap");
  const [opacity, setOpacity] = useState(0.85);
  const [overlaySize, setOverlaySize] = useState(0.2);
  const [dbCutoff] = useState(-28);
  const [fringeScale] = useState(14);
  const [speckleFilter] = useState(true);

  // Layout & Telemetry
  const [splitView, setSplitView] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [inspectedPixel, setInspectedPixel] = useState<InspectedPixel>({
    db: "-12.4",
    phase: "1.20 rad (+14 mm)",
    coherence: "0.88",
    lat: INITIAL_HOTSPOTS[0].lat.toFixed(4),
    lng: INITIAL_HOTSPOTS[0].lng.toFixed(4),
  });

  // Map References
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const tileLayerRef = useRef<LeafletTileLayer | null>(null);
  const sarOverlayRefT1 = useRef<LeafletImageOverlay | null>(null);
  const sarOverlayRefT2 = useRef<LeafletImageOverlay | null>(null);
  const handleMapClickRef = useRef<((lat: number, lng: number) => Promise<void>) | null>(null);

  const generateSarDataUrl = useSarCanvas({
    colormap,
    speckleFilter,
    sarMode,
    fringeScale,
    radarBand,
    polarization,
    selectedSpotId: selectedSpot.id,
    dbCutoff,
    opacity,
    timeOffset,
  });

  // Dynamic Map Click Handler
  const handleMapClick = async (lat: number, lng: number) => {
    const latFixed = parseFloat(lat.toFixed(4));
    const lngFixed = parseFloat(lng.toFixed(4));

    let locationName = `Selected Target (${latFixed}°, ${lngFixed}°)`;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latFixed}&lon=${lngFixed}`
      );
      const data = (await res.json()) as NominatimReverseResult;
      if (data && data.display_name) {
        const parts = data.display_name.split(",");
        locationName = `${parts[0].trim()}${parts[1] ? ", " + parts[1].trim() : ""}`;
      }
    } catch {
      // Fallback location name
    }

    const newSpot = createSyntheticHotspot(
      locationName,
      latFixed,
      lngFixed,
      "Map Clicked Target"
    );

    const dLat = lat - selectedSpot.lat;
    const dLng = lng - selectedSpot.lng;
    const dist = Math.sqrt(dLat * dLat + dLng * dLng) * 10;
    const dbVal = (-12 - dist * 12 + (Math.random() - 0.5) * 2).toFixed(1);
    const phaseValNum = ((dist * fringeScale) % (2 * Math.PI)) - Math.PI;
    const phaseVal = phaseValNum.toFixed(2);
    const cohVal = Math.max(0.12, 0.95 - dist * 0.4).toFixed(2);

    setInspectedPixel({
      db: dbVal,
      phase: `${phaseVal} rad (${(phaseValNum * 12).toFixed(1)} mm)`,
      coherence: cohVal,
      lat: latFixed.toFixed(4),
      lng: lngFixed.toFixed(4),
    });

    setHotspots((prev) => [newSpot, ...prev.filter((h) => h.id !== newSpot.id)]);
    setSelectedSpot(newSpot);
  };

  useEffect(() => {
    handleMapClickRef.current = handleMapClick;
  });

  // Animation Frame Loop
  useEffect(() => {
    let animId: number | undefined;
    if (isPlaying) {
      const animate = () => {
        setTimeOffset((prev) => (prev + 0.04 * animSpeed) % (2 * Math.PI * 50));
        animId = requestAnimationFrame(animate);
      };
      animId = requestAnimationFrame(animate);
    }
    return () => {
      if (animId !== undefined) cancelAnimationFrame(animId);
    };
  }, [isPlaying, animSpeed]);

  useEffect(() => {
    if (!activeDrawer && mapInstanceRef.current) {
      const timer = setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
        mapInstanceRef.current?.setView(
          [selectedSpot.lat, selectedSpot.lng],
          selectedSpot.zoom
        );
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [activeDrawer, selectedSpot]);

  // Leaflet Dynamic Loading
  useEffect(() => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    if (window.L) {
      queueMicrotask(() => setLeafletLoaded(true));
    } else {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => setLeafletLoaded(true);
      document.head.appendChild(script);
    }
  }, []);

  // Update Colormap on Mode Change
  useEffect(() => {
    queueMicrotask(() => {
      if (sarMode === "insar_phase") setColormap("phase_wrap");
      else if (sarMode === "backscatter") setColormap("viridis");
      else if (sarMode === "coherence") setColormap("magma");
      else if (sarMode === "rgb_composite") setColormap("jet");
    });
  }, [sarMode]);

  // Map Initialization & Dynamic Listeners
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return;
    const L = window.L;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([selectedSpot.lat, selectedSpot.lng], selectedSpot.zoom);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      tileLayerRef.current = L.tileLayer(selectedBasemap.url, {
        maxZoom: 18,
        attribution: selectedBasemap.attribution,
      }).addTo(map);

      map.on("click", (e: LeafletMouseEvent) => {
        if (handleMapClickRef.current) {
          handleMapClickRef.current(e.latlng.lat, e.latlng.lng);
        }
      });

      map.on("mousemove", (e: LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        const dLat = lat - selectedSpot.lat;
        const dLng = lng - selectedSpot.lng;
        const dist = Math.sqrt(dLat * dLat + dLng * dLng) * 10;

        const dbVal = (-12 - dist * 12 + (Math.random() - 0.5) * 2).toFixed(1);
        const phaseValNum = ((dist * fringeScale) % (2 * Math.PI)) - Math.PI;
        const phaseVal = phaseValNum.toFixed(2);
        const cohVal = Math.max(0.12, 0.95 - dist * 0.4).toFixed(2);

        setInspectedPixel({
          db: dbVal,
          phase: `${phaseVal} rad (${(phaseValNum * 12).toFixed(1)} mm)`,
          coherence: cohVal,
          lat: lat.toFixed(4),
          lng: lng.toFixed(4),
        });
      });

      mapInstanceRef.current = map;
    }
  }, [
    fringeScale,
    leafletLoaded,
    selectedBasemap.attribution,
    selectedBasemap.url,
    selectedSpot.lat,
    selectedSpot.lng,
    selectedSpot.zoom,
  ]);

  // Center & Tile Update
  useEffect(() => {
    if (!mapInstanceRef.current || !leafletLoaded) return;
    const L = window.L;
    const map = mapInstanceRef.current;

    map.flyTo([selectedSpot.lat, selectedSpot.lng], selectedSpot.zoom, {
      duration: 1.5,
    });

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }
    tileLayerRef.current = L.tileLayer(selectedBasemap.url, {
      maxZoom: 18,
      attribution: selectedBasemap.attribution,
    }).addTo(map);
  }, [selectedSpot, selectedBasemap, leafletLoaded]);

  // SAR Image Overlay Updates
  useEffect(() => {
    if (!mapInstanceRef.current || !leafletLoaded) return;
    const L = window.L;
    const map = mapInstanceRef.current;

    const spanLat = overlaySize;
    const spanLng = overlaySize;

    const bounds = [
      [selectedSpot.lat - spanLat / 2, selectedSpot.lng - spanLng / 2],
      [selectedSpot.lat + spanLat / 2, selectedSpot.lng + spanLng / 2],
    ];

    if (sarOverlayRefT1.current) map.removeLayer(sarOverlayRefT1.current);
    if (sarOverlayRefT2.current) map.removeLayer(sarOverlayRefT2.current);

    const dataUrlT1 = generateSarDataUrl(false, timeOffset);
    sarOverlayRefT1.current = L.imageOverlay(dataUrlT1, bounds, {
      opacity: opacity,
      interactive: false,
    }).addTo(map);

    if (splitView) {
      const dataUrlT2 = generateSarDataUrl(true, timeOffset);
      sarOverlayRefT2.current = L.imageOverlay(dataUrlT2, bounds, {
        opacity: opacity,
        interactive: false,
      }).addTo(map);
    }
  }, [
    selectedSpot,
    radarBand,
    polarization,
    sarMode,
    colormap,
    opacity,
    overlaySize,
    dbCutoff,
    fringeScale,
    speckleFilter,
    splitView,
    leafletLoaded,
    timeOffset,
    generateSarDataUrl,
  ]);

  const handleLocationSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError("");
    setSearchResults([]);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=5`
      );
      const data = (await response.json()) as NominatimSearchResult[];

      if (data && data.length > 0) {
        setSearchResults(data);
      } else {
        setSearchError("No places found matching your query.");
      }
    } catch {
      setSearchError("Geocoding request failed.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (result: NominatimSearchResult) => {
    const newSpot = createSyntheticHotspot(
      result.display_name.split(",")[0] +
        " (" +
        (result.address?.country || "Custom") +
        ")",
      result.lat,
      result.lon,
      "Geocoded Target"
    );

    setHotspots([newSpot, ...hotspots]);
    setSelectedSpot(newSpot);
    setSearchResults([]);
    setSearchQuery("");
  };

  const handleAddManualLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName || !manualLat || !manualLng) return;

    const newSpot = createSyntheticHotspot(
      manualName,
      manualLat,
      manualLng,
      "Manual Lat/Lng Target"
    );

    setHotspots([newSpot, ...hotspots]);
    setSelectedSpot(newSpot);
    setManualName("");
    setManualLat("");
    setManualLng("");
    setShowManualForm(false);
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans overflow-hidden select-none">
      {/* 3. Passed onOpenGroupDetails to Header */}
      <Header
        onOpenAnalytics={() => setActiveDrawer("analytics")}
        onOpenGroupDetails={() => setActiveDrawer("group")}
      />

      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar
          hotspots={hotspots}
          selectedSpot={selectedSpot}
          setSelectedSpot={setSelectedSpot}
          radarBand={radarBand}
          setRadarBand={setRadarBand}
          polarization={polarization}
          setPolarization={setPolarization}
          sarMode={sarMode}
          setSarMode={setSarMode}
          colormap={colormap}
          setColormap={setColormap}
          opacity={opacity}
          setOpacity={setOpacity}
          overlaySize={overlaySize}
          setOverlaySize={setOverlaySize}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isSearching={isSearching}
          searchError={searchError}
          searchResults={searchResults}
          showManualForm={showManualForm}
          setShowManualForm={setShowManualForm}
          manualName={manualName}
          setManualName={setManualName}
          manualLat={manualLat}
          setManualLat={setManualLat}
          manualLng={manualLng}
          setManualLng={setManualLng}
          handleLocationSearch={handleLocationSearch}
          handleSelectSearchResult={handleSelectSearchResult}
          handleAddManualLocation={handleAddManualLocation}
        />

        <main className="flex-1 relative bg-black flex flex-col overflow-hidden">
          <MapHUD
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            animSpeed={animSpeed}
            setAnimSpeed={setAnimSpeed}
            splitView={splitView}
            setSplitView={setSplitView}
          />

          <CursorTelemetry
            inspectedPixel={inspectedPixel}
            radarBand={radarBand}
            polarization={polarization}
          />

          <div className="flex-1 relative w-full h-full bg-black">
            <div
              ref={mapContainerRef}
              className="absolute inset-0 w-full h-full z-10 cursor-crosshair"
            />

            {!leafletLoaded && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
                <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
                <span className="text-xs text-neutral-400 font-mono">
                  Loading Earth Map Engine...
                </span>
              </div>
            )}
          </div>

          <PaletteScale colormap={colormap} unit={selectedSpot.unit} />
        </main>

        {/* Fullscreen Drawers */}
        {activeDrawer === "analytics" && (
          <AnalyticsTab
            selectedSpot={selectedSpot}
            onClose={() => setActiveDrawer(null)}
          />
        )}

      
        {/* 4. Added GroupDetailsTab conditional render */}
        {activeDrawer === "group" && (
          <GroupDetailsTab
            selectedSpot={selectedSpot}
            onClose={() => setActiveDrawer(null)}
          />
        )}
      </div>
    </div>
  );
}