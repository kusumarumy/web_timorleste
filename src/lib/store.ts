"use client";

import { create } from "zustand";
import {
  ALL_LAYERS,
  LayerSubLayer,
  TerrainKey,
} from "./config";

interface MapState {
  basemap: string;
  setBasemap: (id: string) => void;

  visible: Record<string, boolean>;
  toggle: (id: string) => void;

  // KELAS_DI + KETERANGAN
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

  setView: (
    v: Partial<
      Pick<
        MapState,
        "lng" | "lat" | "zoom" | "pitch" | "bearing"
      >
    >
  ) => void;
}

/* =========================================================
   INITIAL STATE
========================================================= */

const initialVisible: Record<string, boolean> = {};
const initialOpacity: Record<string, number> = {};
const initialSubVisible: Record<string, boolean> = {};

/*
 * Semua level sublayer diinisialisasi secara recursive.
 *
 * Contoh:
 *
 * 8 Daerah Irigasi
 * ├── AKADIRU KEDE
 * │   ├── FUNGSIONAL
 * │   └── POTENSIAL
 * ├── BUIHA
 * │   ├── FUNGSIONAL
 * │   ├── POTENSIAL
 * │   └── CROP PLANTATION
 * └── ...
 */
function collectSubVisible(
  sublayers?: LayerSubLayer[]
) {
  if (!sublayers) return;

  for (const sub of sublayers) {
    initialSubVisible[sub.id] = true;

    // Kalau masih mempunyai anak, lanjut recursive
    collectSubVisible(sub.sublayers);
  }
}

ALL_LAYERS.forEach((layer) => {
  initialVisible[layer.id] = layer.defaultOn;

  if (layer.opacity != null) {
    initialOpacity[layer.id] = layer.opacity;
  }

  collectSubVisible(layer.sublayers);
});

/* =========================================================
   STORE
========================================================= */

export const useMapStore = create<MapState>((set) => ({
  /* -------------------------
     BASEMAP
  ------------------------- */

  basemap: "sat",

  setBasemap: (id) =>
    set({
      basemap: id,
    }),

  /* -------------------------
     MAIN LAYERS
  ------------------------- */

  visible: initialVisible,

  toggle: (id) =>
    set((state) => ({
      visible: {
        ...state.visible,
        [id]: !state.visible[id],
      },
    })),

  /* -------------------------
     KELAS_DI + KETERANGAN
  ------------------------- */

  subVisible: initialSubVisible,

  toggleSub: (id) =>
    set((state) => ({
      subVisible: {
        ...state.subVisible,
        [id]: !(state.subVisible[id] ?? true),
      },
    })),

  /* -------------------------
     OPACITY
  ------------------------- */

  opacity: initialOpacity,

  setOpacity: (id, v) =>
    set((state) => ({
      opacity: {
        ...state.opacity,
        [id]: v,
      },
    })),

  /* -------------------------
     TERRAIN
  ------------------------- */

  terrainSource: "off",

  setTerrainSource: (t) =>
    set({
      terrainSource: t,
    }),

  exaggeration: 1,

  setExaggeration: (v) =>
    set({
      exaggeration: v,
    }),

  /* -------------------------
     MAP VIEW
  ------------------------- */

  lng: null,
  lat: null,
  zoom: 14.4,
  pitch: 58,
  bearing: -18,

  setView: (v) =>
    set(v),
}));

/* =========================================================
   DEBUG
========================================================= */

if (typeof window !== "undefined") {
  (window as any).useMapStore = useMapStore;
}
