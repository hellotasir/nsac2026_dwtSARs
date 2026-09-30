import { useCallback, useRef } from "react";
import { COLOR_PALETTES } from "../constants";

interface UseSarCanvasProps {
  colormap: string;
  speckleFilter: boolean;
  sarMode: string;
  fringeScale: number;
  radarBand: string;
  polarization: string;
  selectedSpotId: string;
  dbCutoff: number;
  opacity: number;
  timeOffset: number;
}

export const useSarCanvas = ({
  colormap,
  sarMode,
  fringeScale,
  radarBand,
  polarization,
  dbCutoff,
}: UseSarCanvasProps) => {
  // Reuse an offscreen canvas instance across renders
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const generateSarDataUrl = useCallback(
    (isSecondaryTime: boolean = false, timeOffset: number = 0): string => {
      // 1. Ensure offscreen canvas exists
      if (!canvasRef.current) {
        canvasRef.current = document.createElement("canvas");
      }

      const canvas = canvasRef.current;
      const width = 256;
      const height = 256;

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return "";

      ctx.clearRect(0, 0, width, height);

      // Get color palette or fallback
      const palette = COLOR_PALETTES[colormap]?.colors || [
        "#0000ff",
        "#00ffff",
        "#00ff00",
        "#ffff00",
        "#ff0000",
      ];

      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = width / 2;

      // Adjust phase/fringe base calculation on selected parameters
      const bandMultiplier = radarBand === "L-band" ? 1.0 : 1.8;
      const polShift = polarization === "HV" || polarization === "VH" ? 0.5 : 0;
      const timePhase = isSecondaryTime ? timeOffset * 0.8 : timeOffset;

      ctx.save();

      // Render mode-specific SAR patterns
      if (sarMode === "insar_phase") {
        const numRings = fringeScale || 14;
        for (let r = numRings; r > 0; r--) {
          const radius = (r / numRings) * maxRadius;
          const colorIdx = Math.floor(
            ((r / numRings) * palette.length + timePhase + polShift) %
              palette.length
          );

          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
          ctx.fillStyle = palette[Math.abs(colorIdx) % palette.length];
          ctx.fill();
        }
      } else {
        // Backscatter / Coherence / Intensity visualization
        const imgData = ctx.createImageData(width, height);
        const data = imgData.data;

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const dx = (x - centerX) / centerX;
            const dy = (y - centerY) / centerY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist <= 1.0) {
              const pixelIdx = (y * width + x) * 4;
              const val =
                (Math.sin(dist * fringeScale + timePhase * bandMultiplier) +
                  1) /
                2;
              const colIdx = Math.floor(val * (palette.length - 1));

              // Hex to RGB conversion
              const hex = palette[colIdx] || "#0000ff";
              const r = parseInt(hex.slice(1, 3), 16) || 0;
              const g = parseInt(hex.slice(3, 5), 16) || 0;
              const b = parseInt(hex.slice(5, 7), 16) || 0;

              data[pixelIdx] = r;
              data[pixelIdx + 1] = g;
              data[pixelIdx + 2] = b;
              data[pixelIdx + 3] = val * 255 > dbCutoff ? 200 : 50;
            }
          }
        }
        ctx.putImageData(imgData, 0, 0);
      }

      ctx.restore();

      // Return valid image Data URL for Leaflet L.imageOverlay
      return canvas.toDataURL("image/png");
    },
    [colormap, sarMode, fringeScale, radarBand, polarization, dbCutoff]
  );

  return generateSarDataUrl;
};