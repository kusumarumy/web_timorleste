"use client";

import type {
  IControl,
  Map as MLMap,
  MapGeoJSONFeature,
  MapMouseEvent,
  PointLike,
  GeoJSONSource,
} from "maplibre-gl";

import { Popup } from "maplibre-gl";
import { getToolMode, onToolMode, setToolMode } from "@/components/toolMode";

function cursorSvg(accent: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
<path d="M5.5 2.5 L5.5 23.5 L10.8 18.6 L14.4 26.5 L18 24.8 L14.3 17.2 L21.5 17.2 Z" fill="#FFFFFF" stroke="#0B1620" stroke-width="1.6" stroke-linejoin="round"/>
<circle cx="23.5" cy="8.5" r="7" fill="${accent}" stroke="#FFFFFF" stroke-width="2"/>
<circle cx="23.5" cy="5.4" r="1.15" fill="#FFFFFF"/>
<rect x="22.5" y="7.6" width="2" height="5.2" rx="1" fill="#FFFFFF"/>
</svg>`;
}

function toCursor(svg: string) {
  return `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    svg
  )}") 5 2, crosshair`;
}
const CURSOR_IDLE = toCursor(cursorSvg("#2563EB"));
const CURSOR_HIT = toCursor(cursorSvg("#16A34A"));
const ICON_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
  <circle cx="12" cy="12" r="9.2" fill="none" stroke="currentColor" stroke-width="1.9"/>
  <circle cx="12" cy="7.6" r="1.35" fill="currentColor"/>
  <rect x="10.85" y="10.4" width="2.3" height="7.2" rx="1.15" fill="currentColor"/>
</svg>`;

export type IdentifyControlOptions = {
  getLayerIds: (map: MLMap) => string[];
  getLayerLabel?: (layerId: string) => string;
  getFieldLabel?: (key: string) => string;
  hiddenFields?: string[];
  titleFields?: string[];
  maxFeatures?: number;
  tolerance?: number;
  texts?: {
    button?: string;
    empty?: string;
    noAttribute?: string;
  };
};

const DEFAULT_TITLE_FIELDS = [
  "nama",
  "name",
  "nama_objek",
  "nama_obj",
  "label",
  "judul",
  "title",
  "subkelas",
  "kelas",
];

const DEFAULT_HIDDEN_FIELDS = ["geometry", "bbox", "__id", "source"];

function titleCase(key: string) {
  return key
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "—";

  if (typeof value === "number") {
    return Number.isInteger(value)
      ? value.toLocaleString("id-ID")
      : value.toLocaleString("id-ID", { maximumFractionDigits: 4 });
  }

  if (typeof value === "boolean") return value ? "Ya" : "Tidak";

  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  return String(value);
}

function isLink(value: unknown): value is string {
  return typeof value === "string" && /^https?:\/\//i.test(value.trim());
}

// ============================================================
// CONTROL
// ============================================================

export class IdentifyControl implements IControl {
  private opts: IdentifyControlOptions;

  private map: MLMap | null = null;
  private container: HTMLDivElement | null = null;
  private button: HTMLButtonElement | null = null;
  private popup: Popup | null = null;
private highlightSourceId = "__identify_highlight_source";
private highlightFillId = "__identify_highlight_fill";
private highlightLineId = "__identify_highlight_line";
private highlightPointId = "__identify_highlight_point";
  private selectedFeature: MapGeoJSONFeature | null = null;
  private active = false;
  
  private prevCursor = "";
  private unsub: (() => void) | null = null;

  constructor(opts: IdentifyControlOptions) {
    this.opts = opts;
  }

  // ---------- IControl ----------

  onAdd(map: MLMap): HTMLElement {
    this.map = map;

    const container = document.createElement("div");
    container.className =
      "maplibregl-ctrl maplibregl-ctrl-group identify-ctrl";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "identify-ctrl-btn";

    const label = this.opts.texts?.button ?? "Identify";
    button.title = label;
    button.setAttribute("aria-label", label);
    button.setAttribute("aria-pressed", "false");
    button.innerHTML = ICON_SVG;

    button.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      setToolMode(this.active ? null : "identify");
    });

    container.appendChild(button);

    this.container = container;
    this.button = button;

    // Sinkron dengan tool mode global (measure ↔ identify saling mematikan)
    this.unsub = onToolMode((mode) => this.sync(mode === "identify"));
    this.sync(getToolMode() === "identify");

    return container;
  }

  onRemove() {
    this.sync(false);

    this.unsub?.();
    this.unsub = null;

    this.container?.parentNode?.removeChild(this.container);

    this.container = null;
    this.button = null;
    this.map = null;
  }

  // ---------- STATE ----------

  private sync(next: boolean) {
    if (next === this.active) return;

    this.active = next;

    if (next) this.enable();
    else this.disable();

    this.button?.setAttribute("aria-pressed", String(next));
    this.container?.classList.toggle("is-active", next);
  }

  private enable() {
  const map = this.map;
  if (!map) return;

  this.ensureHighlightLayers();

  const canvas = map.getCanvas();
  this.prevCursor = canvas.style.cursor;
  canvas.style.cursor = CURSOR_IDLE;

  map.on("click", this.handleClick);
  map.on("mousemove", this.handleMove);
}

private disable() {
  const map = this.map;
  if (!map) return;

  map.off("click", this.handleClick);
  map.off("mousemove", this.handleMove);

  map.getCanvas().style.cursor = this.prevCursor || "";

  this.closePopup();
  this.selectedFeature = null;
  this.removeHighlight();
}
  private closePopup() {
    this.popup?.remove();
    this.popup = null;
  }
// ---------- HIGHLIGHT ----------

private ensureHighlightLayers() {
  const map = this.map;
  if (!map) return;

  if (!map.getSource(this.highlightSourceId)) {
    map.addSource(this.highlightSourceId, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    });
  }

  if (!map.getLayer(this.highlightFillId)) {
    map.addLayer({
      id: this.highlightFillId,
      type: "fill",
      source: this.highlightSourceId,
      paint: {
        "fill-color": "#00FFFF",
        "fill-opacity": 0.10,
      },
    });
  }

  if (!map.getLayer(this.highlightLineId)) {
    map.addLayer({
      id: this.highlightLineId,
      type: "line",
      source: this.highlightSourceId,
      paint: {
        "line-color": "#00FFFF",
        "line-width": 4,
        "line-opacity": 0.95,
      },
    });
  }

  if (!map.getLayer(this.highlightPointId)) {
    map.addLayer({
      id: this.highlightPointId,
      type: "circle",
      source: this.highlightSourceId,
      paint: {
        "circle-color": "#00FFFF",
        "circle-radius": 7,
        "circle-stroke-color": "#FFFFFF",
        "circle-stroke-width": 2,
      },
    });
  }
}

private highlightFeature(feature: MapGeoJSONFeature | null) {
  const map = this.map;
  if (!map) return;

  this.ensureHighlightLayers();

  const source = map.getSource(
    this.highlightSourceId
  ) as GeoJSONSource | undefined;

  if (!source) return;

  if (!feature) {
    source.setData({
      type: "FeatureCollection",
      features: [],
    });
    return;
  }

  source.setData({
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        id: feature.id,
        properties: {},
        geometry: feature.geometry,
      },
    ],
  });
}
private removeHighlight() {
  const map = this.map;
  if (!map) return;

  const source = map.getSource(
    this.highlightSourceId
  ) as GeoJSONSource | undefined;

  if (!source) return;

  source.setData({
    type: "FeatureCollection",
    features: [],
  });
}
  // ---------- EVENTS ----------

  private handleMove = (e: MapMouseEvent) => {
  const map = this.map;
  if (!map || !this.active) return;

  const features = this.query(e.point);
  const feature = features[0] ?? null;

  if (feature) {
    map.getCanvas().style.cursor = CURSOR_HIT;

    // Kalau belum ada objek yang dipilih lewat klik,
    // tampilkan highlight hover.
    if (!this.selectedFeature) {
      this.highlightFeature(feature);
    }
  } else {
    map.getCanvas().style.cursor = CURSOR_IDLE;

    // Kalau belum ada objek yang dipilih,
    // hilangkan highlight hover.
    if (!this.selectedFeature) {
      this.removeHighlight();
    }
  }
};

private handleClick = (e: MapMouseEvent) => {
  const map = this.map;
  if (!map || !this.active) return;

  const features = this.query(e.point);

  this.closePopup();

  if (features.length > 0) {
    this.selectedFeature = features[0];
    this.highlightFeature(this.selectedFeature);
  } else {
    this.selectedFeature = null;
    this.removeHighlight();
  }

  const popup = new Popup({
    offset: 14,
    maxWidth: "330px",
    className: "identify-popup",
    closeButton: true,
    closeOnClick: false,
  }).setLngLat(e.lngLat);

  if (features.length === 0) {
    const empty = document.createElement("div");
    empty.className = "identify-pop identify-pop--empty";
    empty.textContent =
      this.opts.texts?.empty ?? "Tidak ada fitur di titik ini.";
    popup.setDOMContent(empty);
  } else {
    popup.setDOMContent(this.buildContent(features));
  }
private handleClick = (e: MapMouseEvent) => {
  const map = this.map;
  if (!map || !this.active) return;

  const features = this.query(e.point);

  this.closePopup();

  if (features.length > 0) {
    this.selectedFeature = features[0];
    this.highlightFeature(this.selectedFeature);
  } else {
    this.selectedFeature = null;
    this.removeHighlight();
  }

  const popup = new Popup({
    offset: 14,
    maxWidth: "330px",
    className: "identify-popup",
    closeButton: true,
    closeOnClick: false,
  }).setLngLat(e.lngLat);

  if (features.length === 0) {
    const empty = document.createElement("div");
    empty.className = "identify-pop identify-pop--empty";
    empty.textContent =
      this.opts.texts?.empty ?? "Tidak ada fitur di titik ini.";
    popup.setDOMContent(empty);
  } else {
    popup.setDOMContent(this.buildContent(features));
  }

  popup.addTo(map);
  this.popup = popup;
};
};
  // ---------- QUERY ----------

  private query(point: { x: number; y: number }): MapGeoJSONFeature[] {
    const map = this.map;
    if (!map) return [];

    const ids = this.opts
      .getLayerIds(map)
      .filter((id) => !!map.getLayer(id));

    if (ids.length === 0) return [];

    const pad = this.opts.tolerance ?? 6;

    const bbox: [PointLike, PointLike] = [
      [point.x - pad, point.y - pad],
      [point.x + pad, point.y + pad],
    ];

    let raw: MapGeoJSONFeature[] = [];

    try {
      raw = map.queryRenderedFeatures(bbox, { layers: ids });
    } catch (err) {
      console.warn("IDENTIFY: query gagal", err);
      return [];
    }

    // Poligon/garis yang terpotong antar-tile bisa muncul berkali-kali
    const seen = new Set<string>();
    const out: MapGeoJSONFeature[] = [];
    const max = this.opts.maxFeatures ?? 8;

    for (const f of raw) {
      const key = `${f.layer?.id}::${
        f.id ?? JSON.stringify(f.properties ?? {})
      }`;

      if (seen.has(key)) continue;

      seen.add(key);
      out.push(f);

      if (out.length >= max) break;
    }

    return out;
  }
// ---------- QUERY ----------

private query(point: { x: number; y: number }): MapGeoJSONFeature[] {
  const map = this.map;
  if (!map) return [];

  const ids = this.opts
    .getLayerIds(map)
    .filter((id) => !!map.getLayer(id));

  if (ids.length === 0) return [];

  const pad = this.opts.tolerance ?? 6;

  const bbox: [PointLike, PointLike] = [
    [point.x - pad, point.y - pad],
    [point.x + pad, point.y + pad],
  ];

  let raw: MapGeoJSONFeature[] = [];

  try {
    raw = map.queryRenderedFeatures(bbox, {
      layers: ids,
    });
  } catch (err) {
    console.warn("IDENTIFY: query gagal", err);
    return [];
  }

  // Hindari fitur yang sama muncul berkali-kali,
  // misalnya karena tile terpotong.
  const seen = new Set<string>();
  const out: MapGeoJSONFeature[] = [];
  const max = this.opts.maxFeatures ?? 8;

  for (const f of raw) {
    const key = `${f.layer?.id}::${
      f.id ?? JSON.stringify(f.properties ?? {})
    }`;

    if (seen.has(key)) continue;

    seen.add(key);
    out.push(f);

    if (out.length >= max) break;
  }

  return out;
}
  // ---------- POPUP CONTENT ----------

  private layerLabel(layerId: string) {
    return this.opts.getLayerLabel?.(layerId) ?? titleCase(layerId);
  }

  private fieldLabel(key: string) {
    return this.opts.getFieldLabel?.(key) ?? titleCase(key);
  }

  private featureTitle(f: MapGeoJSONFeature) {
    const props = (f.properties ?? {}) as Record<string, unknown>;
    const candidates = this.opts.titleFields ?? DEFAULT_TITLE_FIELDS;

    const lower = new Map(
      Object.keys(props).map((k) => [k.toLowerCase(), k])
    );

    for (const c of candidates) {
      const realKey = lower.get(c.toLowerCase());
      const val = realKey ? props[realKey] : undefined;

      if (val !== null && val !== undefined && String(val).trim() !== "") {
        return String(val);
      }
    }

    return this.layerLabel(f.layer?.id ?? "");
  }

  private buildContent(features: MapGeoJSONFeature[]): HTMLElement {
    const root = document.createElement("div");
    root.className = "identify-pop";

    let index = 0;

    const render = () => {
      root.replaceChildren();

      const f = features[index];
      const props = (f.properties ?? {}) as Record<string, unknown>;

      // HEAD
      const head = document.createElement("div");
      head.className = "identify-pop-head";

      const title = document.createElement("div");
      title.className = "identify-pop-title";
      title.textContent = this.featureTitle(f);

      const sub = document.createElement("div");
      sub.className = "identify-pop-sub";
      sub.textContent = this.layerLabel(f.layer?.id ?? "");

      head.append(title, sub);
      root.appendChild(head);

      // PAGER
      if (features.length > 1) {
        const pager = document.createElement("div");
        pager.className = "identify-pager";

        const prev = document.createElement("button");
        prev.type = "button";
        prev.className = "identify-pager-btn";
        prev.textContent = "‹";
        prev.setAttribute("aria-label", "Fitur sebelumnya");
        prev.addEventListener("click", () => {
  index = (index - 1 + features.length) % features.length;
  this.highlightFeature(features[index]);
  render();
});

        const count = document.createElement("span");
        count.className = "identify-pager-count";
        count.textContent = `${index + 1} / ${features.length}`;

        const next = document.createElement("button");
        next.type = "button";
        next.className = "identify-pager-btn";
        next.textContent = "›";
        next.setAttribute("aria-label", "Fitur berikutnya");
        next.addEventListener("click", () => {
  index = (index + 1) % features.length;
  this.highlightFeature(features[index]);
  render();
});

        pager.append(prev, count, next);
        root.appendChild(pager);
      }

      // BODY — semua atribut GeoJSON, otomatis
      const hidden = new Set(
        (this.opts.hiddenFields ?? DEFAULT_HIDDEN_FIELDS).map((k) =>
          k.toLowerCase()
        )
      );

      const entries = Object.entries(props).filter(([k, v]) => {
        if (hidden.has(k.toLowerCase())) return false;
        if (v === null || v === undefined) return false;
        if (typeof v === "string" && v.trim() === "") return false;
        return true;
      });

      const body = document.createElement("div");
      body.className = "identify-pop-body";

      if (entries.length === 0) {
        const none = document.createElement("div");
        none.className = "identify-pop-none";
        none.textContent =
          this.opts.texts?.noAttribute ?? "Fitur ini tidak punya atribut.";
        body.appendChild(none);
      } else {
        for (const [key, value] of entries) {
          const row = document.createElement("div");
          row.className = "identify-row";

          const k = document.createElement("span");
          k.className = "identify-key";
          k.textContent = this.fieldLabel(key);

          row.appendChild(k);

          if (isLink(value)) {
            const a = document.createElement("a");
            a.className = "identify-val identify-val--link";
            a.href = value.trim();
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            a.textContent = "Buka tautan";
            row.appendChild(a);
          } else {
            const v = document.createElement("b");
            v.className = "identify-val";
            v.textContent = formatValue(value);
            v.title = formatValue(value);
            row.appendChild(v);
          }

          body.appendChild(row);
        }
      }

      root.appendChild(body);
    };

    render();

    return root;
  }
}
