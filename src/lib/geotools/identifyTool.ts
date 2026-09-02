import maplibregl, { Map as MLMap, MapMouseEvent } from "maplibre-gl";

import { getToolMode, onToolMode, setToolMode } from "@/components/toolMode";
type QueriedFeature = ReturnType<MLMap["queryRenderedFeatures"]>[number];
type QueryGeometry = Parameters<MLMap["queryRenderedFeatures"]>[0];

function cursorSvg(accent: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
<path d="M5.5 2.5 L5.5 23.5 L10.8 18.6 L14.4 26.5 L18 24.8 L14.3 17.2 L21.5 17.2 Z" fill="#FFFFFF" stroke="#0B1620" stroke-width="1.6" stroke-linejoin="round"/>
<circle cx="23.5" cy="8.5" r="7" fill="${accent}" stroke="#FFFFFF" stroke-width="2"/>
<circle cx="23.5" cy="5.4" r="1.15" fill="#FFFFFF"/>
<rect x="22.5" y="7.6" width="2" height="5.2" rx="1" fill="#FFFFFF"/>
</svg>`;
}

function toCursor(svg: string): string {
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

export interface IdentifyToolOptions {
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
}

const DEFAULT_TITLE_FIELDS = [
  "nama",
  "name",
  "nama_objek",
  "label",
  "judul",
  "title",
  "subkelas",
  "kelas",
];

const DEFAULT_HIDDEN_FIELDS = ["geometry", "bbox", "__id", "layer", "source"];

function titleCase(key: string): string {
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

export class IdentifyTool {
  map: MLMap;

  private opts: IdentifyToolOptions;

  private container: HTMLDivElement | null = null;
  private button: HTMLButtonElement | null = null;
  private popup: maplibregl.Popup | null = null;

  private active = false;
  private prevCursor = "";
  private unsub: (() => void) | null = null;

  constructor(map: MLMap, options: IdentifyToolOptions) {
    this.map = map;
    this.opts = options;

    this._onClick = this._onClick.bind(this);
    this._onMove = this._onMove.bind(this);

    this._mountButton();

    this.unsub = onToolMode((mode) => this._sync(mode === "identify"));
    this._sync(getToolMode() === "identify");
  }

  private _mountButton(): void {
    const container = document.createElement("div");
    container.className =
      "maplibregl-ctrl maplibregl-ctrl-group identify-ctrl";
    
    container.style.borderRadius = "7px";
    container.style.overflow = "hidden";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "identify-ctrl-btn";
    
    button.style.width = "32px";
    button.style.height = "32px";
    button.style.borderRadius = "7px";
    button.style.overflow = "hidden";

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
    
    const slot = this.map
      .getContainer()
      .querySelector(".maplibregl-ctrl-top-right");

    if (slot) {
      slot.appendChild(container);
    } else {
      console.warn("IDENTIFY: container control kanan-atas tidak ditemukan");

      container.style.position = "absolute";
      container.style.top = "120px";
      container.style.right = "10px";
      container.style.zIndex = "10";

      this.map.getContainer().appendChild(container);
    }

    this.container = container;
    this.button = button;
  }

  private _sync(next: boolean): void {
    if (next === this.active) return;

    this.active = next;

    if (next) this._enable();
    else this._disable();

    this.button?.setAttribute("aria-pressed", String(next));
    this.container?.classList.toggle("is-active", next);
  }

  private _enable(): void {
    const canvas = this.map.getCanvas();

    this.prevCursor = canvas.style.cursor;
    canvas.style.cursor = CURSOR_IDLE;

    this.map.on("click", this._onClick);
    this.map.on("mousemove", this._onMove);

    console.log("IDENTIFY START");
  }

private _disable(): void {
  this.map.off("click", this._onClick);
  this.map.off("mousemove", this._onMove);

  this.map.getCanvas().style.cursor = this.prevCursor || "";

  this._closePopup();

  this._clearHighlight();

  console.log("IDENTIFY STOP");
}
  stop(): void {
    setToolMode(null);
  }
  destroy(): void {
    this._sync(false);
    this.unsub?.();
    this.unsub = null;
    this.container?.parentNode?.removeChild(this.container);
    this.container = null;
    this.button = null;
  }

  private _closePopup(): void {
    this.popup?.remove();
    this.popup = null;
  }

private _clearHighlight(): void {
  const map = this.map;

  const layers = [
    "identify-highlight-fill",
    "identify-highlight-line",
    "identify-highlight-line-inner",
    "identify-highlight-point",
  ];

  layers.forEach((id) => {
    if (map.getLayer(id)) {
      map.removeLayer(id);
    }
  });

  if (map.getSource("identify-highlight")) {
    map.removeSource("identify-highlight");
  }
}

private _showHighlight(feature: QueriedFeature): void {
  const map = this.map;

  this._clearHighlight();

  if (!feature.geometry) return;

  map.addSource("identify-highlight", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: feature.geometry,
          properties: {},
        },
      ],
    },
  });

  const geometryType = feature.geometry.type;
  if (
    geometryType === "Polygon" ||
    geometryType === "MultiPolygon"
  ) {
    map.addLayer({
      id: "identify-highlight-fill",
      type: "fill",
      source: "identify-highlight",
      paint: {
        "fill-color": "#2FA6A0",
        "fill-opacity": 0.28,
      },
    });

    map.addLayer({
      id: "identify-highlight-line",
      type: "line",
      source: "identify-highlight",
      paint: {
        "line-color": "#FFFFFF",
        "line-width": 4,
        "line-opacity": 0.95,
      },
    });
  }

  else if (
    geometryType === "LineString" ||
    geometryType === "MultiLineString"
  ) {
    map.addLayer({
      id: "identify-highlight-line",
      type: "line",
      source: "identify-highlight",
      paint: {
        "line-color": "#2FA6A0",
        "line-width": 7,
        "line-opacity": 0.95,
        "line-blur": 0.5,
      },
    });

    map.addLayer({
      id: "identify-highlight-line-inner",
      type: "line",
      source: "identify-highlight",
      paint: {
        "line-color": "#FFFFFF",
        "line-width": 2,
        "line-opacity": 0.9,
      },
    });
  }
  else if (
    geometryType === "Point" ||
    geometryType === "MultiPoint"
  ) {
    map.addLayer({
      id: "identify-highlight-point",
      type: "circle",
      source: "identify-highlight",
      paint: {
        "circle-radius": 9,
        "circle-color": "#2FA6A0",
        "circle-opacity": 0.9,
        "circle-stroke-color": "#FFFFFF",
        "circle-stroke-width": 3,
      },
    });
  }
}
  private _onMove(e: MapMouseEvent): void {
    if (!this.active) return;
    const hit = this._query(e.point).length > 0;
    this.map.getCanvas().style.cursor = hit ? CURSOR_HIT : CURSOR_IDLE;
  }

private _onClick(e: MapMouseEvent): void {
  if (!this.active) return;

  const features = this._query(e.point);

  this._closePopup();
  if (features.length > 0) {
    this._showHighlight(features[0]);
  } else {
    this._clearHighlight();
  }

  const popup = new maplibregl.Popup({
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
    popup.setDOMContent(this._buildContent(features));
  }

  popup.addTo(this.map);

  this.popup = popup;
}

  private _query(point: { x: number; y: number }): QueriedFeature[] {
    const ids = this.opts
      .getLayerIds(this.map)
      .filter((id) => !!this.map.getLayer(id));
    if (ids.length === 0) return [];
    const pad = this.opts.tolerance ?? 6;
    const bbox = [
      [point.x - pad, point.y - pad],
      [point.x + pad, point.y + pad],
    ] as unknown as QueryGeometry;
    let raw: QueriedFeature[] = [];
    try {
      raw = this.map.queryRenderedFeatures(bbox, { layers: ids });
    } catch (err) {
      console.warn("IDENTIFY: query gagal", err);
      return [];
    }
    
    const seen = new Set<string>();
    const out: QueriedFeature[] = [];
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

  private _layerLabel(layerId: string): string {
    return this.opts.getLayerLabel?.(layerId) ?? titleCase(layerId);
  }

  private _fieldLabel(key: string): string {
    return this.opts.getFieldLabel?.(key) ?? titleCase(key);
  }

  private _featureTitle(f: QueriedFeature): string {
    const props = (f.properties ?? {}) as Record<string, unknown>;
    const candidates = this.opts.titleFields ?? DEFAULT_TITLE_FIELDS;

    const lower = new Map(Object.keys(props).map((k) => [k.toLowerCase(), k]));

    for (const c of candidates) {
      const realKey = lower.get(c.toLowerCase());
      const val = realKey ? props[realKey] : undefined;

      if (val !== null && val !== undefined && String(val).trim() !== "") {
        return String(val);
      }
    }

    return this._layerLabel(f.layer?.id ?? "");
  }

  private _buildContent(features: QueriedFeature[]): HTMLElement {
    const root = document.createElement("div");
    root.className = "identify-pop";

    let index = 0;

    const render = () => {
      root.replaceChildren();

      const f = features[index];
      const props = (f.properties ?? {}) as Record<string, unknown>;

      const head = document.createElement("div");
      head.className = "identify-pop-head";

      const title = document.createElement("div");
      title.className = "identify-pop-title";
      title.textContent = this._featureTitle(f);

      const sub = document.createElement("div");
      sub.className = "identify-pop-sub";
      sub.textContent = this._layerLabel(f.layer?.id ?? "");

      head.append(title, sub);
      root.appendChild(head);

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

  this._showHighlight(features[index]);

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

  this._showHighlight(features[index]);

  render();
});

        pager.append(prev, count, next);
        root.appendChild(pager);
      }

      const hidden = new Set(
        (this.opts.hiddenFields ?? DEFAULT_HIDDEN_FIELDS).map((k) =>
          k.toLowerCase()
        )
      );

      const entries = Object.entries(props).filter(([k, val]) => {
        if (hidden.has(k.toLowerCase())) return false;
        if (val === null || val === undefined) return false;
        if (typeof val === "string" && val.trim() === "") return false;
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
          k.textContent = this._fieldLabel(key);

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
            const text = formatValue(value);

            const v = document.createElement("b");
            v.className = "identify-val";
            v.textContent = text;
            v.title = text;

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
