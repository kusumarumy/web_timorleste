"use client";

import { useEffect, useRef } from "react";
import maplibregl, {
  Map as MLMap,
  LngLatLike,
  Popup,
} from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";
import { MAP, BASEMAPS, TERRAIN_OPTIONS, ALL_LAYERS, FIXED_EXAGGERATION } from "@/lib/config";

import { useMapStore } from "@/lib/store";
import { reprojectGeoJSON } from "@/lib/reproject";
function isWGS84GeoJSON(geojson: any): boolean {
  // 1. Cek metadata CRS
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

  // 2. Ambil koordinat pertama
  function findFirstCoordinate(coords: any): number[] | null {
    if (!Array.isArray(coords)) return null;

    // [x, y]
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

  // WGS84 longitude/latitude
  if (
    Math.abs(x) <= 180 &&
    Math.abs(y) <= 90
  ) {
    return true;
  }

  // Bukan WGS84 → diasumsikan UTM 51S
  return false;
}

function buildStyle(): maplibregl.StyleSpecification {
  const sources: Record<string, unknown> = {};

  // dua sumber DEM sekaligus (dibangun semua, dipakai sesuai pilihan user)
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

    layers.push({
      id: l.id,
      type: "symbol",
      source: l.id,

      layout: {
        visibility: l.defaultOn
          ? "visible"
          : "none",

        "icon-image": l.id,

        "icon-size": 0.30,

        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
      },
    } as any);

  } else {

    sources[l.id] = {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    };

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
export default function MapCanvas({
  onReady,
}: {
  onReady?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap | null>(null);
  const store = useMapStore;
 // ============================================================
// LAZY LOADING GEOJSON
// Hanya download layer ketika layer tersebut dibutuhkan
// ============================================================
const loadedLayers = useRef(new Set<string>());
const loadingLayers = useRef(new Set<string>());

async function loadGeoJSONLayer(
  map: MLMap,
  layer: typeof ALL_LAYERS[number]
) {
  // Tidak perlu load kalau bukan GeoJSON
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

  try {
    console.log(`Lazy loading layer: ${layer.id}`);

    const response = await fetch(layer.data);

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status} - ${response.statusText}`
      );
    }

    const geojson = await response.json();

    // Cek CRS
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

    // Masukkan ke source MapLibre
    const source = map.getSource(layer.id);

    if (
      source &&
      "setData" in source
    ) {
      (
        source as maplibregl.GeoJSONSource
      ).setData(geojson4326);

      // Terapkan filter subclass
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
// ============================================================
// INITIAL LAZY LOAD
// Hanya load layer yang defaultOn = true
// ============================================================

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
      onReady?.();
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


  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
      }}
      className="absolute inset-0 h-full w-full"
    />
  );
}
