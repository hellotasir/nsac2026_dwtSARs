import { MapPin } from "lucide-react";
import { CURRENT_YEAR, PREV_YEAR } from "../constants";
import type { Hotspot } from "../types";

export const createSyntheticHotspot = (
  name: string,
  lat: number | string,
  lng: number | string,
  category = "Custom Earth Target"
): Hotspot => {
  const numLat = typeof lat === "string" ? parseFloat(lat) : lat;
  const numLng = typeof lng === "string" ? parseFloat(lng) : lng;

  return {
    id: `custom_${Date.now()}`,
    name: name,
    category: category,
    icon: MapPin,
    lat: numLat,
    lng: numLng,
    zoom: 11,
    spanLat: 0.2,
    spanLng: 0.2,
    band: "L-band (24 cm)",
    pol: "HH",
    theme: `User Defined Radar Target Zone (${CURRENT_YEAR})`,
    description: `Custom Earth location target centered at coordinates ${numLat.toFixed(4)}°, ${numLng.toFixed(4)}° observed during ${CURRENT_YEAR} science operations.`,
    unit: "mm/yr deformation",
    preDate: `${PREV_YEAR}-10-01 (Baseline T1)`,
    postDate: `${CURRENT_YEAR}-09-15 (Repeat Pass T2)`,
    timeData: [
      { date: `${PREV_YEAR}-10`, lBand: -10.2, sBand: -13.1, displacement: 0, coherence: 0.91 },
      { date: `${PREV_YEAR}-12`, lBand: -10.5, sBand: -13.4, displacement: 12, coherence: 0.88 },
      { date: `${CURRENT_YEAR}-02`, lBand: -11.0, sBand: -14.1, displacement: 28, coherence: 0.85 },
      { date: `${CURRENT_YEAR}-04`, lBand: -11.8, sBand: -15.0, displacement: 45, coherence: 0.81 },
      { date: `${CURRENT_YEAR}-06`, lBand: -12.4, sBand: -15.8, displacement: 68, coherence: 0.78 },
      { date: `${CURRENT_YEAR}-08`, lBand: -12.1, sBand: -15.5, displacement: 82, coherence: 0.8 },
      { date: `${CURRENT_YEAR}-09`, lBand: -11.5, sBand: -14.9, displacement: 95, coherence: 0.83 },
    ],
    histogram: [
      { range: "-30 to -25", count: 110 },
      { range: "-25 to -20", count: 480 },
      { range: "-20 to -15", count: 1210 },
      { range: "-15 to -10", count: 850 },
      { range: "-10 to -5", count: 320 },
      { range: "-5 to 0", count: 90 },
    ],
  };
};