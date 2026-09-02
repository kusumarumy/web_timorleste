"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl, { Map as MLMap, LngLatLike,} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MAP, BASEMAPS, TERRAIN_OPTIONS, ALL_LAYERS} from "@/lib/config";
import { useMapStore } from "@/lib/store";
import { reprojectGeoJSON } from "@/lib/reproject";
import { getToolMode, onToolMode, setToolMode,} from "./toolMode";
import { MeasureControl } from "@/lib/geotools/measure";
import { IdentifyTool } from "@/lib/geotools/identifyTool";
import { useI18n } from "@/lib/i18n";
import ProfilePanel, { type ProfileData } from "./ProfilePanel";
import type { ProfileSample } from "@/lib/geotools/measure";

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
  if (
    Math.abs(x) <= 180 &&
    Math.abs(y) <= 90
  ) {
    return true;
  }
  return false;
}
function getIconId(iconUrl?: string): string | undefined {
  if (!iconUrl) return undefined;
  const filename = iconUrl.split("/").pop();
  if (!filename) return undefined;
  return filename.replace(/\.png$/i, "");
}
function buildStyle(): maplibregl.StyleSpecification {
  const sources: Record<string, unknown> = {};
  Object.values(TERRAIN_OPTIONS).forEach((t) => {
    sources[`terrain_${t.id}`] = {
      type: "raster-dem",
      tiles: t.tiles,
      encoding: t.encoding,
      tileSize: 256,
      minzoom: t.minzoom,
      maxzoom: t.maxzoom,
      bounds: [...t.bounds] as [number, number, number, number],
    };
  });

  const layers: maplibregl.LayerSpecification[] = [
    { id: "bg", type: "background", paint: { "background-color": "#0B1620" } } as any,
  ];
BASEMAPS.forEach((b) => {
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
      visibility: b.id === "sat"
        ? "visible"
        : "none",
    },
  } as any);
});

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
  "icon-size": l.iconSize ?? 0.05,
  "icon-allow-overlap": true,
  "icon-ignore-placement": true,
};

const iconId = getIconId(l.icon);
if (iconId) {
  symbolLayout["icon-image"] = iconId;
}
      const symbolPaint: Record<string, unknown> = {};
      if (l.label) {
        symbolLayout["text-field"] = [
          "coalesce",
          ["get", l.label.field],
          "",
        ];
        symbolLayout["text-size"] = l.label.size ?? 11;
        symbolLayout["text-anchor"] = "bottom-left";
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
      if (l.label) {
  const isPolygon = l.kind === "fill";
  const isLine = l.kind === "line";
  const labelLayout: Record<string, unknown> = {
    visibility: l.defaultOn
      ? "visible"
      : "none",
    "text-field": [
      "coalesce",
      ["get", l.label.field],
      "",
    ],
    "text-size": l.label.size ?? 11,
    "text-pitch-alignment": "viewport",
    "text-allow-overlap": false,
    "text-ignore-placement": false,
  };
        
  if (isPolygon) {
    labelLayout["symbol-placement"] = "point";
    labelLayout["text-anchor"] = "center";
    labelLayout["text-rotation-alignment"] = "viewport";
  }
  else if (isLine) {
    labelLayout["symbol-placement"] = "line";
    labelLayout["symbol-spacing"] =
      l.label.spacing ?? 250;
    labelLayout["text-rotation-alignment"] = "map";
    labelLayout["text-max-angle"] = 30;
    labelLayout["text-keep-upright"] = true;
  }
  layers.push({
    id: `${l.id}_label`,
    type: "symbol",
    source: l.id,
    minzoom: l.label.minzoom ?? 0,
    maxzoom: l.label.maxzoom ?? 24,
    layout: labelLayout,
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
        
if (l.kind === "fill") {
  layers.push({
    id: `${l.id}_outline`,
    type: "line",
    source: l.id,
    layout: {
      visibility: l.defaultOn
        ? "visible"
        : "none",
    },
    paint: {
      "line-color":
        l.id === "desa"
          ? "#E53935"
          : l.id === "posto"
          ? "#FF6B6B"
          : l.id === "kotamadya"
          ? "#A66DD4"
          : "#000000",
      "line-width":
        l.id === "desa"
          ? 1.2
          : l.id === "posto"
          ? 1.6
          : l.id === "kotamadya"
          ? 2
          : 1,
      "line-dasharray":
        l.id === "desa"
          ? [8, 4]
          : l.id === "posto"
          ? [10, 5]
          : l.id === "kotamadya"
          ? [12, 5]
          : [1, 0],
      "line-opacity": 1,
    },
  } as any);
}
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

  const prop = layer.subProp ?? "subkelas";

  const activeValues = layer.sublayers
    .filter((sub) => subVisible[sub.id] !== false)
    .map((sub) => sub.filterValue);

  if (activeValues.length === 0) {
    return ["==", ["literal", 1], ["literal", 0]] as any;
  }
  if (activeValues.length === layer.sublayers.length) {
    return undefined;
  }
  return [
    "in",
    ["get", prop],
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
    {
      id: "drill",
      url: "/icons/drill.png",
    },
    {
      id: "bm",
      url: "/icons/bm.png",
    },
    {
      id: "cp",
      url: "/icons/cp.png",
    },
    {
      id: "aksesories",
      url: "/icons/aksesories.png",
    },
    {
      id: "kupasan",
      url: "/icons/kupasan.png",
    },
    {
      id: "desain",
      url: "/icons/desain.png",
    },
    {
      id: "coordinate",
      url: "/icons/coordinate.png",
    },
    {
      id: "canal",
      url: "/icons/canal.png",
    },
    {
      id: "profil",
      url: "/icons/profil.png",
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
      //console.log(`✓ Icon ${icon.id} berhasil didaftarkan`);
    } //catch (error) {
      //console.error(
        //`✗ Gagal load icon ${icon.id}:`,
       // error
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
  const measureRef = useRef<MeasureControl | null>(null);
  const identifyRef = useRef<IdentifyTool | null>(null);
  const store = useMapStore;
  const { t } = useI18n();
  const tRef = useRef(t);
  tRef.current = t;
  const loadedLayers = useRef(new Set<string>());
  const loadingLayers = useRef(new Set<string>());
  const [loadingLayerIds, setLoadingLayerIds] = useState<string[]>([]);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const hoverMarkerRef = useRef<maplibregl.Marker | null>(null);

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
  function applyTerrain(map: MLMap, source: "off" | "aws" | "r2") {
  console.log("APPLY TERRAIN →", source);
  if (source === "off") {
    map.setTerrain(null);
    return;
  }
  map.setTerrain({
    source: `terrain_${source}`,
  });
}

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
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
    if (typeof window !== "undefined") (window as any).__map = map;
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
    map.on("error", (e) => {
      console.error("MAPLIBRE ERROR:", e.error);
    });
    map.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: true,
      }),
      "top-right"
    );
    identifyRef.current = new IdentifyTool(map, {
      getLayerIds: (m) => {
        const s = store.getState();
        return ALL_LAYERS
          .filter(
            (l) =>
              l.kind !== "raster" &&
              l.clickable !== false &&
              !!s.visible[l.id]
          )
          .map((l) => l.id)
          .filter((id) => !!m.getLayer(id));
      },
      getLayerLabel: (id) => {
        const layer = ALL_LAYERS.find((l) => l.id === id);
        return layer
          ? tRef.current(layer.nameKey)
          : id;
      },
      texts: {
        button: "Identify",
        empty: "Tidak ada fitur di titik ini.",
        noAttribute: "Fitur ini tidak punya atribut.",
      },
    });
    map.addControl(
      new maplibregl.ScaleControl({
        maxWidth: 120,
        unit: "metric",
      }),
      "bottom-left"
    );

    map.on("load", async () => {
      map.resize();
      await registerMapIcons(map);
          const measure = new MeasureControl(map, {
  t: (key) => tRef.current(key),

  onResult: (result) => {
    if (result?.mode === "profile" && result.finished) {
      setProfile(result as unknown as ProfileData);
      return;
    }

    if (!result) {
      setProfile(null);
    }
  },

  onStop: () => {
    console.log("MEASURE STOP → CONTROL PANEL OFF");
    setToolMode(null);
  },
});
      measureRef.current = measure;
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
      const s = store.getState();
      applyTerrain(map, s.terrainSource);
      map.setSky({
        "sky-color": "#12324A",
        "horizon-color": "#0B1620",
        "fog-color": "#0B1620",
        "sky-horizon-blend": 0.6,
        "horizon-fog-blend": 0.5,
        "fog-ground-blend": 0.4,
      } as any);
      onReady?.(map);
    });


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


    return () => {
      ro.disconnect();
      if (hoverMarkerRef.current) {
        hoverMarkerRef.current.remove();
        hoverMarkerRef.current = null;
      }
      if (measureRef.current) {
        measureRef.current.stop();
        measureRef.current = null;
      }
      if (identifyRef.current) {
        identifyRef.current.destroy();
        identifyRef.current = null;
      }
      map.remove();
      mapRef.current = null;
    };
  }, []);
useEffect(() => {
  const measure = measureRef.current;

  if (!measure) {
    return;
  }

  measure.setTranslator(
    (key) => tRef.current(key)
  );
}, [t]);
  useEffect(() => {
    const unsubscribe = onToolMode((mode) => {
    const measure = measureRef.current;

    if (!mode) {
      measure?.stop();
      setProfile(null);
      return;
    }

    if (mode === "identify") {
      measure?.stop();
      setProfile(null);
      return;
    }

    if (!measure) {
      console.warn("MEASURE: control belum siap");
      return;
    }

    console.log("MEASURE MODE →", mode);

    setProfile(null);
    measure.start(mode);
  });

  return unsubscribe;
}, []);

  useEffect(
    () =>
      useMapStore.subscribe((s) => {
        const map = mapRef.current;
        if (!map || !map.isStyleLoaded()) return;
        const isOrtho = s.basemap === "ortho";
        BASEMAPS.forEach((b) => {
          const layerId = `bm_${b.id}`;
          if (!map.getLayer(layerId)) return;
          let visible = false;
          if (isOrtho && b.id === "sat") {
            visible = true;
          }
          if (b.id === s.basemap) {
            visible = true;
          }

          map.setLayoutProperty(
            layerId,
            "visibility",
            visible ? "visible" : "none"
          );
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

const outlineLayer =
  l.kind === "fill"
    ? map.getLayer(`${l.id}_outline`)
    : null;

          if (!mapLayer) {
            return;
          }

          const isVisible = !!s.visible[l.id];
          if (
            isVisible &&
            l.kind !== "raster" &&
            l.data
          ) {
            void loadGeoJSONLayer(map, l);
          }
          map.setLayoutProperty(
            l.id,
            "visibility",
            isVisible
              ? "visible"
              : "none"
          );
          if (labelLayer) {
            map.setLayoutProperty(
              `${l.id}_label`,
              "visibility",
              isVisible
                ? "visible"
                : "none"
            );
          }
          if (outlineLayer) {
            map.setLayoutProperty(
              `${l.id}_outline`,
              "visibility",
              isVisible
                ? "visible"
                : "none"
            );
          }
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

  const terrainSource = useMapStore((s) => s.terrainSource);
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const run = () => applyTerrain(map, terrainSource);
    if (map.isStyleLoaded()) {
      run();
    } else {
      map.once("idle", run);
    }
  }, [terrainSource]);

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

      <ProfilePanel
        data={profile}
        onClose={() => {
          setProfile(null);
          hoverMarkerRef.current?.remove();
          hoverMarkerRef.current = null;
          measureRef.current?.clear();
          setToolMode(null);
        }}
        onHoverSample={(s: ProfileSample | null) => {
          const map = mapRef.current;
          if (!map) return;

          if (!s) {
            hoverMarkerRef.current?.remove();
            hoverMarkerRef.current = null;
            return;
          }

          if (!hoverMarkerRef.current) {
            const el = document.createElement("div");
            el.style.cssText =
              "width:12px;height:12px;border-radius:9999px;background:#2FA6A0;border:2px solid #04171a;box-shadow:0 0 0 2px rgba(47,166,160,.35);";
            hoverMarkerRef.current = new maplibregl.Marker({
              element: el,
            });
          }

          hoverMarkerRef.current.setLngLat([s.lng, s.lat]).addTo(map);
        }}
      />
    </div>
  );
}
