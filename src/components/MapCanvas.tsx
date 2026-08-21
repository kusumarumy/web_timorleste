"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl, {
  Map as MLMap,
  LngLatLike,
  Popup,
} from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";
import { MAP, BASEMAPS, TERRAIN_OPTIONS, ALL_LAYERS, FIXED_EXAGGERATION } from "@/lib/config";

import { useMapStore } from "@/lib/store";
import { reprojectGeoJSON } from "@/lib/reproject";
import { getToolMode, setToolMode } from "./toolMode";
import { MeasureControl } from "@/lib/geotools/measure";
import { useI18n } from "@/lib/i18n";
function isWGS84GeoJSON(geojson: any): boolean {

  const crsName =
    geojson?.crs?.properties?.name?.toString().toLowerCase() ?? "";
  if (
    crsName.includes("crs84") ||
    crsName.includes("4326") ||
    crsName.includes("wgs84") ||
    crsName.includes("wgs 84")
  ) {
    return true;
  }
  function findFirstCoordinate(coords: any): number[] | null {
    if (!Array.isArray(coords)) return null;
    if (
      coords.length >= 2 &&
      typeof coords[0] === "number" &&
      typeof coords[1] === "number"
    ) {
      return coords;
    }
    for (const item of coords) {
      const result = findFirstCoordinate(item);
      if (result) return result;
    }
    return null;
  }
  const firstFeature = geojson?.features?.[0];
  const coordinates =
    firstFeature?.geometry?.coordinates;
  const coord = findFirstCoordinate(coordinates);
  if (!coord) {
    console.warn(
      "Tidak dapat mendeteksi CRS: koordinat tidak ditemukan."
    );
    return false;
  }
  const [x, y] = coord;

  //console.log("Sample coordinate:", [x, y]);

  if (
    Math.abs(x) <= 180 &&
    Math.abs(y) <= 90
  ) {
    return true;
  }
  return false;
}

function buildStyle(): maplibregl.StyleSpecification {
  const sources: Record<string, unknown> = {};
  Object.values(TERRAIN_OPTIONS).forEach((t) => {
    sources[`terrain_${t.id}`] = {
      type: "raster-dem",
      tiles: t.tiles,
      encoding: t.encoding,
      tileSize: 256,
      maxzoom: t.maxzoom,
    };
  });

  const layers: maplibregl.LayerSpecification[] = [
    { id: "bg", type: "background", paint: { "background-color": "#0B1620" } } as any,
  ];

  // BASEMAP
  BASEMAPS.forEach((b, i) => {
    sources[`bm_${b.id}`] = {
      type: "raster",
      tiles: b.tiles,
      tileSize: 256,
      attribution: b.attribution,
      ...(b.minzoom != null ? { minzoom: b.minzoom } : {}),
      ...(b.maxzoom != null ? { maxzoom: b.maxzoom } : {}),
    };
    layers.push({
      id: `bm_${b.id}`,
      type: "raster",
      source: `bm_${b.id}`,
      layout: {
        visibility: i === 0 ? "visible" : "none",
      },
    } as any);
  });

  // DATA LAYERS
  ALL_LAYERS.forEach((l) => {
  if (l.kind === "raster") {
    sources[l.id] = {
      type: "raster",
      tiles: l.tiles,
      tileSize: 256,
      minzoom: l.minzoom ?? 0,
      maxzoom: l.maxzoom ?? 22,
    };

    layers.push({
      id: l.id,
      type: "raster",
      source: l.id,

      paint: l.paint,

      layout: {
        visibility: l.defaultOn
          ? "visible"
          : "none",
      },
    } as any);

 } else if (l.kind === "symbol") {

  sources[l.id] = {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
    },
  };

  const symbolLayout: Record<string, unknown> = {
    visibility: l.defaultOn
      ? "visible"
      : "none",

    // ICON
    "icon-image": l.id,
    "icon-size": 0.05,

    "icon-allow-overlap": true,
    "icon-ignore-placement": true,
  };

  const symbolPaint: Record<string, unknown> = {};

  // =====================================================
  // LABEL
  // =====================================================

  if (l.label) {
    symbolLayout["text-field"] = [
      "coalesce",
      ["get", l.label.field],
      "",
    ];

    symbolLayout["text-size"] = l.label.size ?? 11;

    symbolLayout["text-anchor"] = "bottom-left";

    // Posisi label kanan-atas dari icon
    symbolLayout["text-offset"] = [0.8, -0.8];

    symbolLayout["text-allow-overlap"] = true;
    symbolLayout["text-ignore-placement"] = true;

    if (l.label.spacing != null) {
      symbolLayout["symbol-spacing"] = l.label.spacing;
    }

    symbolPaint["text-color"] =
      l.label.color ?? "#111827";

    symbolPaint["text-halo-color"] =
      l.label.haloColor ?? "#FFFFFF";

    symbolPaint["text-halo-width"] =
      l.label.haloWidth ?? 2;

    symbolPaint["text-halo-blur"] = 0.2;
  }

  layers.push({
    id: l.id,
    type: "symbol",
    source: l.id,

    layout: symbolLayout,

    paint: symbolPaint,
    
    ...(l.label?.minzoom != null
      ? { minzoom: l.label.minzoom }
      : {}),

    ...(l.label?.maxzoom != null
      ? { maxzoom: l.label.maxzoom }
      : {}),
  } as any);

} else {

    sources[l.id] = {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    };

    // =====================================================
    // NORMAL GEOJSON LAYER
    // =====================================================

    layers.push({
      id: l.id,
      type: l.kind,
      source: l.id,

      paint: l.paint,

      layout: {
        visibility: l.defaultOn
          ? "visible"
          : "none",
      },
    } as any);

    // =====================================================
    // LABEL LAYER
    // Menggunakan source GeoJSON yang sama
    // =====================================================

    if (l.label) {

      layers.push({
        id: `${l.id}_label`,
        type: "symbol",
        source: l.id,

        minzoom: l.label.minzoom ?? 0,
        maxzoom: l.label.maxzoom ?? 24,

        layout: {
          visibility: l.defaultOn
            ? "visible"
            : "none",

          // INI YANG MEMBUAT LABEL MENGIKUTI GARIS
          "symbol-placement": "line",

          // Jarak antar label
          "symbol-spacing": l.label.spacing ?? 250,

          // Field yang digunakan sebagai teks
          "text-field": [
            "get",
            l.label.field,
          ],

          "text-size": l.label.size ?? 11,

          // Label mengikuti arah garis
          "text-rotation-alignment": "map",

          // Tetap nyaman dibaca ketika map dipitch
          "text-pitch-alignment": "viewport",

          // Jangan tampilkan terlalu banyak label
          "text-allow-overlap": false,
          "text-ignore-placement": false,

          // Mencegah label terlalu miring
          "text-max-angle": 30,

          // Label tetap terbaca dari kiri-kanan
          "text-keep-upright": true,
        },

        paint: {
          "text-color":
            l.label.color ?? "#5A1715",

          "text-halo-color":
            l.label.haloColor ?? "#FFFFFF",

          "text-halo-width":
            l.label.haloWidth ?? 2,

          "text-halo-blur": 0.2,
        },
      } as any);
    }
  }
});
  return {
    version: 8,
    glyphs:
      "https://basemaps.cartocdn.com/fonts/{fontstack}/{range}.pbf",
    sources: sources as any,
    layers,
  };
}
function getSubkelasFilter(
  layer: typeof ALL_LAYERS[number],
  subVisible: Record<string, boolean>
): maplibregl.FilterSpecification | undefined {
  if (!layer.sublayers || layer.sublayers.length === 0) {
    return undefined;
  }
  const activeValues = layer.sublayers
    .filter((sub) => subVisible[sub.id] !== false)
    .map((sub) => sub.filterValue);

  //console.log("LAYER:", layer.id);
  //console.log("SUBCLASS STATE:", subVisible);
  //console.log("ACTIVE SUBCLASS:", activeValues);

  if (activeValues.length === 0) {
    return ["==", ["get", "subkelas"], "__NONE__"] as any;
  }
  if (activeValues.length === layer.sublayers.length) {
    return undefined;
  }
  return [
    "in",
    ["get", "subkelas"],
    ["literal", activeValues],
  ] as any;
}
async function registerMapIcons(map: MLMap) {
  const icons = [
    {
      id: "weir",
      url: "/icons/weir.png",
    },
    {
      id: "rainfall",
      url: "/icons/rainfall.png",
    },
    {
      id: "irrigation_point",
      url: "/icons/irrigation_point.png",
    },
  ];

  for (const icon of icons) {
    if (map.hasImage(icon.id)) {
      continue;
    }

    try {
      const image = await map.loadImage(icon.url);

      if (!map.hasImage(icon.id)) {
        map.addImage(icon.id, image.data);
      }

      console.log(`✓ Icon ${icon.id} berhasil didaftarkan`);
    } catch (error) {
      console.error(
        `✗ Gagal load icon ${icon.id}:`,
        error
      );
    }
  }
}
export default function MapCanvas({
  onReady,
}: {
  onReady?: (map: MLMap) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap | null>(null);
  const store = useMapStore;
  const { t } = useI18n();
 // ============================================================
// LAZY LOADING GEOJSON
// Hanya download layer ketika layer tersebut dibutuhkan
// ============================================================
const loadedLayers = useRef(new Set<string>());
const loadingLayers = useRef(new Set<string>());
const [loadingLayerIds, setLoadingLayerIds] = useState<string[]>([]);

async function loadGeoJSONLayer(
  map: MLMap,
  layer: typeof ALL_LAYERS[number]
) {
  if (layer.kind === "raster" || !layer.data) {
    return;
  }

  if (loadedLayers.current.has(layer.id)) {
    return;
  }

  if (loadingLayers.current.has(layer.id)) {
    return;
  }

  loadingLayers.current.add(layer.id);

  setLoadingLayerIds((prev) => {
    if (prev.includes(layer.id)) {
      return prev;
    }

    return [...prev, layer.id];
  });

  try {
    console.log(`Lazy loading layer: ${layer.id}`);

    const response = await fetch(layer.data);

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status} - ${response.statusText}`
      );
    }

    const geojson = await response.json();

    const alreadyWGS84 = isWGS84GeoJSON(geojson);

    let geojson4326;

    if (alreadyWGS84) {
      geojson4326 = geojson;
    } else {
      console.log(
        `↻ ${layer.id}: UTM 51S → WGS84`
      );

      geojson4326 = reprojectGeoJSON(geojson);
    }

    const source = map.getSource(layer.id);

    if (source && "setData" in source) {
      (
        source as maplibregl.GeoJSONSource
      ).setData(geojson4326);

      const currentState = store.getState();

      if (
        layer.sublayers &&
        map.getLayer(layer.id)
      ) {
        const filter = getSubkelasFilter(
          layer,
          currentState.subVisible
        );

        map.setFilter(
          layer.id,
          filter ?? null
        );
      }

      loadedLayers.current.add(layer.id);

      console.log(
        `✓ Layer ${layer.id} selesai di-load`
      );
    } else {
      console.warn(
        `Source ${layer.id} tidak ditemukan`
      );
    }

  } catch (error) {
    console.error(
      `Gagal loading layer ${layer.id}:`,
      error
    );
  } finally {
    loadingLayers.current.delete(layer.id);

    setLoadingLayerIds((prev) =>
      prev.filter((id) => id !== layer.id)
    );
  }
}

  function applyTerrain(map: MLMap, source: "off" | "aws" | "r2", exaggeration: number) {
    console.log("APPLY TERRAIN →", source, "| ex:", exaggeration);   
    if (source === "off") { map.setTerrain(null); return; }
    const opt = TERRAIN_OPTIONS[source];
    map.setTerrain({
      source: `terrain_${source}`,
      exaggeration: opt.adjustable ? exaggeration : FIXED_EXAGGERATION,
    });
  }
  // INIT MAP
  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    //console.log("BASEMAPS YANG DIPAKAI:", BASEMAPS);
    //console.log("STYLE DARI BUILDSYLE:", buildStyle());
    const map = new maplibregl.Map({
      container: ref.current,
      style: buildStyle(),
      center: MAP.center as LngLatLike,
      zoom: MAP.zoom,
      pitch: MAP.pitch,
      bearing: MAP.bearing,
      maxPitch: MAP.maxPitch,
      hash: false,
      attributionControl: {
        compact: true,
      },
    });
    mapRef.current = map;


    // RESIZE
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        if (mapRef.current) {
          mapRef.current.resize();
        }
      });
    });
    ro.observe(ref.current);
    requestAnimationFrame(() => {
      if (mapRef.current) {
        mapRef.current.resize();
      }
    });

    // ERROR
    map.on("error", (e) => {
      console.error("MAPLIBRE ERROR:", e.error);
    });

    // SOURCE DEBUG
    map.on("sourcedata", (e) => {
      if (e.sourceId === "bm_map") {
        //console.log(
        //  "OSM SOURCE:",
        //  e.isSourceLoaded
        //);
      }
    });


    // CONTROLS
    map.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: true,
      }),
      "top-right"
    );
    map.addControl(
      new maplibregl.ScaleControl({
        maxWidth: 120,
        unit: "metric",
      }),
      "bottom-left"
    );

    // MAP LOAD
    map.on("load", async () => {
      //console.log("MAP LOADED");
      //console.log(
      //  "STYLE:",
      //  map.getStyle()
      //);
      //console.log(
      //  "LAYERS:",
      //  map
      //    .getStyle()
      //    .layers
      //    ?.map((l) => l.id)
      //);
      map.resize();
      await registerMapIcons(map);
const initialLayers = ALL_LAYERS.filter(
  (l) =>
    l.kind !== "raster" &&
    l.data &&
    l.defaultOn
);

await Promise.all(
  initialLayers.map((l) =>
    loadGeoJSONLayer(map, l)
  )
);

console.log(
  "Initial GeoJSON lazy loading selesai."
);
     
      // TERRAIN
      const s = store.getState();
      applyTerrain(map, s.terrainSource, s.exaggeration);

      // SKY
      map.setSky({
        "sky-color": "#12324A",
        "horizon-color": "#0B1620",
        "fog-color": "#0B1620",
        "sky-horizon-blend": 0.6,
        "horizon-fog-blend": 0.5,
        "fog-ground-blend": 0.4,
      } as any);

      // POPUPS
      ALL_LAYERS
        .filter((l) => l.clickable)
        .forEach((l) => {
          map.on(
            "mouseenter",
            l.id,
            () => {
              map.getCanvas().style.cursor =
                "pointer";
            }
          );
          map.on(
            "mouseleave",
            l.id,
            () => {
              map.getCanvas().style.cursor =
                "";
            }
          );
          map.on(
            "click",
            l.id,
            (e) => {
if (getToolMode()) return; 
              const p =
                (e.features?.[0]
                  ?.properties ?? {}) as Record<
                    string,
                    unknown
                  >;

              const rows =
                Object.entries(p)
                  .map(
                    ([k, val]) =>
                      `<div class="pop-r">
                        <span>${k}</span>
                        <b>${val}</b>
                      </div>`
                  )
                  .join("");

              new Popup({
                offset: 12,
              })
                .setLngLat(e.lngLat)
                .setHTML(
                  `<div class="pop-t">
                    ${p.name ?? "Feature"}
                  </div>
                  ${rows}`
                )
                .addTo(map);
            }
          );
        });

      // READY
      onReady?.(map);
    });


    // MAP READOUT
    const readout = () => {
      const c = map.getCenter();

      if (
        Number.isFinite(c.lng) &&
        Number.isFinite(c.lat)
      ) {
        store.getState().setView({
          zoom: map.getZoom(),
          pitch: map.getPitch(),
          bearing: map.getBearing(),
          lng: c.lng,
          lat: c.lat,
        });
      }
    };

    map.on("move", readout);

    // MOUSE COORDINATE

    map.on("mousemove", (e) => {
      const {
        lng,
        lat,
      } = e.lngLat;

      if (
        Number.isFinite(lng) &&
        Number.isFinite(lat)
      ) {
        store
          .getState()
          .setView({
            lng,
            lat,
          });
      }
    });


    // CLEANUP

    return () => {
      ro.disconnect();

      map.remove();

      mapRef.current = null;
    };

  }, []);

  // BASEMAP CHANGE
  useEffect(
    () =>
      useMapStore.subscribe((s) => {
        const map = mapRef.current;
        if (!map || !map.isStyleLoaded()) return;

        BASEMAPS.forEach((b) => {
          const layerId = `bm_${b.id}`;
          if (map.getLayer(layerId)) {
            map.setLayoutProperty(
              layerId,
              "visibility",
              b.id === s.basemap ? "visible" : "none"
            );
          }
        });
      }),
    []
  );

  useEffect(
  () =>
    useMapStore.subscribe((s) => {
      const map = mapRef.current;

      if (!map || !map.isStyleLoaded()) {
        return;
      }

      ALL_LAYERS.forEach((l) => {
        const mapLayer = map.getLayer(l.id);
const labelLayer =
  l.label && map.getLayer(`${l.id}_label`);

if (!mapLayer) {
  return;
}

        const isVisible = !!s.visible[l.id];

        // =====================================================
        // LAZY LOAD
        // Kalau user menyalakan layer, baru download datanya
        // =====================================================

        if (
          isVisible &&
          l.kind !== "raster" &&
          l.data
        ) {
          void loadGeoJSONLayer(map, l);
        }

        // =====================================================
        // VISIBILITY
        // =====================================================

        map.setLayoutProperty(
  l.id,
  "visibility",
  isVisible
    ? "visible"
    : "none"
);

// Label mengikuti visibility layer utama
if (labelLayer) {
  map.setLayoutProperty(
    `${l.id}_label`,
    "visibility",
    isVisible
      ? "visible"
      : "none"
  );
}

        // =====================================================
        // SUBCLASS FILTER
        // =====================================================

        if (l.sublayers) {
          const filter = getSubkelasFilter(
            l,
            s.subVisible
          );

          map.setFilter(
            l.id,
            filter ?? null
          );
        }

        // =====================================================
        // OPACITY
        // =====================================================

        if (
          l.opacityProp &&
          s.opacity[l.id] != null
        ) {
          map.setPaintProperty(
            l.id,
            l.opacityProp,
            s.opacity[l.id]
          );
        }
      });
    }),
  []
);

    // TERRAIN — baca nilai dari store sebagai dependency useEffect
  const terrainSource = useMapStore((s) => s.terrainSource);
  const exaggeration = useMapStore((s) => s.exaggeration);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const run = () => applyTerrain(map, terrainSource, exaggeration);

    if (map.isStyleLoaded()) {
      run();
    } else {
      map.once("idle", run);
    }
  }, [terrainSource, exaggeration]);

const loadingLayerNames = loadingLayerIds.map((id) => {
  const layer = ALL_LAYERS.find((l) => l.id === id);

  return layer
    ? t(layer.nameKey)
    : id;
});
  return (
  <div
    style={{
      position: "absolute",
      inset: 0,
    }}
    className="absolute inset-0 h-full w-full"
  >
    {/* MAP */}
    <div
      ref={ref}
      className="absolute inset-0 h-full w-full"
    />

    {loadingLayerNames.length > 0 && (
  <div className="layer-loading-popup">
    <div className="layer-loading-spinner" />

    <div className="layer-loading-content">
      <div className="layer-loading-title">
        {t("loading_layer_title")}
      </div>

      <div className="layer-loading-text">
        <strong>
          {loadingLayerNames.join(", ")}
        </strong>{" "}
        {t("loading_layer_text")}
      </div>
    </div>
  </div>
)}
  </div>
);
}
