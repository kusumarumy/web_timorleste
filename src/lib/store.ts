"use client";
import { create } from "zustand";
import { ALL_LAYERS, TerrainKey } from "./config";

interface MapState {
  basemap: string;
  setBasemap: (id: string) => void;
  visible: Record<string, boolean>;
  toggle: (id: string) => void;
  subVisible: Record<string, boolean>;
  toggleSub: (id: string) => void;
  opacity: Record<string, number>;
  setOpacity: (id: string, v: number) => void;
  terrainSource: "off" | TerrainKey;
  setTerrainSource: (t: "off" | TerrainKey) => void;
  exaggeration: number;
  setExaggeration: (v: number) => void;
  lng: number | null;
  lat: number | null;
  zoom: number;
  pitch: number;
  bearing: number;
  setView: (v: Partial<Pick<MapState, "lng" | "lat" | "zoom" | "pitch" | "bearing">>) => void;
}

const initialVisible: Record<string, boolean> = {};
const initialOpacity: Record<string, number> = {};
const initialSubVisible: Record<string, boolean> = {};
ALL_LAYERS.forEach((l) => {
  initialVisible[l.id] = l.defaultOn;
  if (l.opacity != null) {
    initialOpacity[l.id] = l.opacity;
  }
  (l.sublayers ?? []).forEach((sub) => {
    initialSubVisible[sub.id] = true;
  });
});

export const useMapStore = create<MapState>((set) => ({
  basemap: "sat",
  setBasemap: (id) => set({ basemap: id }),
  visible: initialVisible,
  toggle: (id) =>
    set((s) => ({
      visible: {
        ...s.visible,
        [id]: !s.visible[id],
      },
    })),

  subVisible: initialSubVisible,
  toggleSub: (id) =>
    set((s) => {
      const newValue = !s.subVisible[id];
      //console.log("TOGGLE SUBCLASS:", id, "=>", newValue);
      return {
        subVisible: {
          ...s.subVisible,
          [id]: newValue,
        },
      };
    }),

  opacity: initialOpacity,
  setOpacity: (id, v) => set((s) => ({ opacity: { ...s.opacity, [id]: v } })),
  terrainSource: "off",
  setTerrainSource: (t) => set({ terrainSource: t }),
  exaggeration: 1,
  setExaggeration: (v) => set({ exaggeration: v }),
  lng: null, lat: null, zoom: 14.4, pitch: 58, bearing: -18,
  setView: (v) => set(v),
}));

if (typeof window !== "undefined") {
  (window as any).useMapStore = useMapStore;
}
