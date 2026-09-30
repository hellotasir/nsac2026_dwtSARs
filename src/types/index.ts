import React from "react";

export interface LeafletLatLng {
  lat: number;
  lng: number;
}

export interface LeafletMouseEvent {
  latlng: LeafletLatLng;
}

export interface LeafletLayer {
  addTo: (map: LeafletMap) => LeafletLayer;
}

export type LeafletTileLayer = LeafletLayer;
export type LeafletImageOverlay = LeafletLayer;

export interface LeafletMap {
  setView: (center: [number, number], zoom: number) => LeafletMap;
  flyTo: (
    center: [number, number],
    zoom: number,
    options?: { duration?: number }
  ) => LeafletMap;
  removeLayer: (layer: LeafletLayer) => LeafletMap;
  on: (event: string, fn: (e: LeafletMouseEvent) => void) => LeafletMap;
  invalidateSize: (options?: boolean | { animate?: boolean; pan?: boolean }) => LeafletMap;
}

export interface LeafletNamespace {
  map: (element: HTMLElement, options?: Record<string, unknown>) => LeafletMap;
  tileLayer: (
    url: string,
    options?: Record<string, unknown>
  ) => LeafletTileLayer;
  imageOverlay: (
    url: string,
    bounds: number[][],
    options?: Record<string, unknown>
  ) => LeafletImageOverlay;
  control: {
    zoom: (options?: Record<string, unknown>) => {
      addTo: (map: LeafletMap) => void;
    };
  };
}

declare global {
  interface Window {
    L: LeafletNamespace;
  }
}

export interface NominatimSearchResult {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    country?: string;
  };
}

export interface NominatimReverseResult {
  display_name?: string;
}

export interface TimeDataPoint {
  date: string;
  lBand: number;
  sBand: number;
  displacement: number;
  coherence: number;
}

export interface HistogramBin {
  range: string;
  count: number;
}

export interface Hotspot {
  id: string;
  name: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  lat: number;
  lng: number;
  zoom: number;
  spanLat: number;
  spanLng: number;
  band: string;
  pol: string;
  theme: string;
  description: string;
  unit: string;
  preDate: string;
  postDate: string;
  timeData: TimeDataPoint[];
  histogram: HistogramBin[];
}

export interface InspectedPixel {
  db: string;
  phase: string;
  coherence: string;
  lat: string;
  lng: string;
}