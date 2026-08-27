"use client";

import type {
  IControl,
  Map as MLMap,
  MapGeoJSONFeature,
  MapMouseEvent,
  PointLike,
  GeoJSONSource,
} from "maplibre-gl";

import type { Feature } from "geojson";

import { Popup } from "maplibre-gl";

import {
  getToolMode,
  onToolMode,
  setToolMode,
} from "@/components/toolMode";

// ============================================================
// CURSOR
// ============================================================

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

// Warna cahaya highlight
const GLOW = "#22D3EE";
const CORE = "#FFFFFF";

// ============================================================
// OPTIONS
// ============================================================

export type IdentifyControlOptions = {
  getLayerIds: (map: MLMap) => string[];
  getLayerLabel?: (layerId: string) => string;
  getFieldLabel?: (key: string) => string;

  /** Tambahan field yang disembunyikan, di luar daftar bawaan. */
  hiddenFields?: string[];

  titleFields?: string[];
  maxFeatures?: number;
  tolerance?: number;

  texts?: {
    button?: string;
    empty?: string;
    noAttribute?: string;
    showAll?: string;
    showLess?: string;
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

// Atribut teknis + sisa styling dari konversi KML/KMZ
const DEFAULT_HIDDEN_FIELDS = [
  "geometry",
  "bbox",
  "__id",
  "__hl",
  "source",
  "layer",
  "tessellate",
  "extrude",
  "visibility",
  "altitudemode",
  "draworder",
  "snippet",
  "begin",
  "end",
  "timestamp",
  "gx_media_links",
];

// Pola nama field yang hampir pasti styling, bukan data.
// Contoh yang tertangkap: KML STYLE, POINT SYMB, FONT SIZE,
// FONT COLOR, BORDER STY, BORDER COL, FILL COL.
const HIDDEN_PATTERNS: RegExp[] = [
  /style/i,
  /symb/i,
  /^font[\s_-]/i,
  /^border[\s_-]/i,
  /^fill[\s_-]/i,
  /^line[\s_-]?(sty|col|width)/i,
  /(^|[\s_-])(sty|col|colour|color)$/i,
  /^icon[\s_-]?(scale|color|href)?$/i,
  /^label[\s_-]?(color|size|scale)/i,
];

// ============================================================
// HELPERS
// ============================================================

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

function featureKey(f: MapGeoJSONFeature): string {
  return `${f.layer?.id}::${f.id ?? JSON.stringify(f.properties ?? {})}`;
}

const IS_SELECT = ["==", ["get", "__hl"], "select"] as any;

const POLY_TYPES = [
  "match",
  ["geometry-type"],
  ["Polygon", "MultiPolygon"],
  true,
  false,
] as any;

const LINE_TYPES = [
  "match",
  ["geometry-type"],
  ["LineString", "MultiLineString", "Polygon", "MultiPolygon"],
  true,
  false,
] as any;

const POINT_TYPES = [
  "match",
  ["geometry-type"],
  ["Point", "MultiPoint"],
  true,
  false,
] as any;

// ============================================================
// CONTROL
// ============================================================

export class IdentifyControl implements IControl {
  private opts: IdentifyControlOptions;

  private map: MLMap | null = null;
  private container: HTMLDivElement | null = null;
  private button: HTMLButtonElement | null = null;
  private popup: Popup | null = null;

  // HIGHLIGHT
  private readonly HL_SRC = "__identify_hl_src";
  private readonly HL_FILL = "__identify_hl_fill";
  private readonly HL_GLOW = "__identify_hl_glow";
  private readonly HL_MID = "__identify_hl_mid";
  private readonly HL_CORE = "__identify_hl_core";
  private readonly HL_PT_GLOW = "__identify_hl_pt_glow";
  private readonly HL_PT_CORE = "__identify_hl_pt_core";

  private get hlLayerIds(): string[] {
    return [
      this.HL_FILL,
      this.HL_GLOW,
      this.HL_MID,
      this.HL_CORE,
      this.HL_PT_GLOW,
      this.HL_PT_CORE,
    ];
  }

  private selectedFeature: MapGeoJSONFeature | null = null;
  private hoverFeature: MapGeoJSONFeature | null = null;

  private active = false;
  private prevCursor = "";
  private unsub: (() => void) | null = null;
  private moveRaf = 0;
  private pulseRaf = 0;
  private pulseStart = 0;

  constructor(opts: IdentifyControlOptions) {
    this.opts = opts;
  }

  // ---------- ICONTROL ----------

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

    // Layer highlight dibuat sekali saja saat style siap
    if (map.isStyleLoaded()) {
      this.ensureHighlightLayers();
    } else {
      map.once("load", () => this.ensureHighlightLayers());
    }

    this.unsub = onToolMode((mode) => {
      this.sync(mode === "identify");
    });

    this.sync(getToolMode() === "identify");

    return container;
  }

  onRemove() {
    this.sync(false);

    if (this.moveRaf) {
      cancelAnimationFrame(this.moveRaf);
      this.moveRaf = 0;
    }

    this.stopPulse();

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

    console.log("IDENTIFY START");
  }

  private disable() {
    const map = this.map;
    if (!map) return;

    map.off("click", this.handleClick);
    map.off("mousemove", this.handleMove);

    map.getCanvas().style.cursor = this.prevCursor || "";

    this.closePopup();

    this.selectedFeature = null;
    this.hoverFeature = null;

    this.renderHighlight();

    console.log("IDENTIFY STOP");
  }

  private closePopup() {
    this.popup?.remove();
    this.popup = null;
  }

  // ============================================================
  // HIGHLIGHT
  //
  // Efek cahaya ditiru dengan menumpuk beberapa layer:
  // lebar & redup di bawah, tipis & terang di atas.
  // Layer terluar berdenyut selama ada objek terpilih.
  // ============================================================

  private ensureHighlightLayers(): boolean {
    const map = this.map;
    if (!map) return false;

    try {
      if (!map.getSource(this.HL_SRC)) {
        map.addSource(this.HL_SRC, {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] },
        });
      }

      // POLIGON — isian
      if (!map.getLayer(this.HL_FILL)) {
        map.addLayer({
          id: this.HL_FILL,
          type: "fill",
          source: this.HL_SRC,
          filter: POLY_TYPES,
          paint: {
            "fill-color": GLOW,
            "fill-opacity": ["case", IS_SELECT, 0.25, 0.1],
          },
        } as any);
      }

      // GARIS — lapis cahaya terluar, hanya untuk objek terpilih
      if (!map.getLayer(this.HL_GLOW)) {
        map.addLayer({
          id: this.HL_GLOW,
          type: "line",
          source: this.HL_SRC,
          filter: ["all", LINE_TYPES, IS_SELECT] as any,
          layout: { "line-cap": "round", "line-join": "round" },
          paint: {
            "line-color": GLOW,
            "line-width": 16,
            "line-opacity": 0.18,
            "line-blur": 6,
          },
        } as any);
      }

      // GARIS — lapis tengah
      if (!map.getLayer(this.HL_MID)) {
        map.addLayer({
          id: this.HL_MID,
          type: "line",
          source: this.HL_SRC,
          filter: LINE_TYPES,
          layout: { "line-cap": "round", "line-join": "round" },
          paint: {
            "line-color": GLOW,
            "line-width": ["case", IS_SELECT, 9, 5],
            "line-opacity": ["case", IS_SELECT, 0.55, 0.35],
            "line-blur": 2,
          },
        } as any);
      }

      // GARIS — inti terang
      if (!map.getLayer(this.HL_CORE)) {
        map.addLayer({
          id: this.HL_CORE,
          type: "line",
          source: this.HL_SRC,
          filter: LINE_TYPES,
          layout: { "line-cap": "round", "line-join": "round" },
          paint: {
            "line-color": ["case", IS_SELECT, CORE, GLOW],
            "line-width": ["case", IS_SELECT, 2.5, 1.8],
            "line-opacity": 1,
          },
        } as any);
      }

      // TITIK — halo cahaya, hanya untuk objek terpilih
      if (!map.getLayer(this.HL_PT_GLOW)) {
        map.addLayer({
          id: this.HL_PT_GLOW,
          type: "circle",
          source: this.HL_SRC,
          filter: ["all", POINT_TYPES, IS_SELECT] as any,
          paint: {
            "circle-color": GLOW,
            "circle-radius": 24,
            "circle-opacity": 0.18,
            "circle-blur": 0.8,
          },
        } as any);
      }

      // TITIK — cincin di luar ikon, jadi ikon tetap terlihat
      if (!map.getLayer(this.HL_PT_CORE)) {
        map.addLayer({
          id: this.HL_PT_CORE,
          type: "circle",
          source: this.HL_SRC,
          filter: POINT_TYPES,
          paint: {
            "circle-color": GLOW,
            "circle-radius": ["case", IS_SELECT, 17, 13],
            "circle-opacity": 0.12,
            "circle-stroke-color": ["case", IS_SELECT, CORE, GLOW],
            "circle-stroke-width": ["case", IS_SELECT, 3.5, 2],
            "circle-stroke-opacity": 0.95,
          },
        } as any);
      }
    } catch (err) {
      console.warn("IDENTIFY: gagal menyiapkan layer highlight", err);

      // Style belum siap — coba lagi setelah map tenang
      map.once("idle", () => {
        if (this.ensureHighlightLayers()) this.renderHighlight();
      });

      return false;
    }

    return true;
  }

  private renderHighlight() {
    const map = this.map;
    if (!map) return;

    if (!this.ensureHighlightLayers()) return;

    const source = map.getSource(this.HL_SRC) as GeoJSONSource | undefined;

    if (!source) {
      console.warn("IDENTIFY: source highlight tidak ditemukan");
      return;
    }

    const features: Feature[] = [];

    const sel = this.selectedFeature;
    const hov = this.hoverFeature;

    if (hov && (!sel || featureKey(hov) !== featureKey(sel))) {
      features.push({
        type: "Feature",
        properties: { __hl: "hover" },
        geometry: hov.geometry,
      });
    }

    if (sel) {
      features.push({
        type: "Feature",
        properties: { __hl: "select" },
        geometry: sel.geometry,
      });
    }

    source.setData({ type: "FeatureCollection", features });

    // Highlight harus selalu di paling atas
    this.hlLayerIds.forEach((id) => {
      if (map.getLayer(id)) map.moveLayer(id);
    });

    if (sel) {
      console.log(
        "IDENTIFY HIGHLIGHT →",
        sel.layer?.id,
        sel.geometry?.type
      );

      this.startPulse();
    } else {
      this.stopPulse();
    }
  }

  // ---------- PULSE ----------

  private startPulse() {
    if (this.pulseRaf) return;

    this.pulseStart = performance.now();

    const tick = () => {
      const map = this.map;

      if (!map || !this.selectedFeature) {
        this.pulseRaf = 0;
        return;
      }

      const t = (performance.now() - this.pulseStart) / 1000;

      // 0 → 1 → 0 setiap ~1,6 detik
      const s = (Math.sin((t * Math.PI * 2) / 1.6) + 1) / 2;

      try {
        if (map.getLayer(this.HL_GLOW)) {
          map.setPaintProperty(
            this.HL_GLOW,
            "line-width",
            14 + 8 * s
          );

          map.setPaintProperty(
            this.HL_GLOW,
            "line-opacity",
            0.12 + 0.22 * s
          );
        }

        if (map.getLayer(this.HL_PT_GLOW)) {
          map.setPaintProperty(
            this.HL_PT_GLOW,
            "circle-radius",
            20 + 10 * s
          );

          map.setPaintProperty(
            this.HL_PT_GLOW,
            "circle-opacity",
            0.12 + 0.22 * s
          );
        }
      } catch {
        // layer sedang tidak tersedia, abaikan frame ini
      }

      this.pulseRaf = requestAnimationFrame(tick);
    };

    this.pulseRaf = requestAnimationFrame(tick);
  }

  private stopPulse() {
    if (!this.pulseRaf) return;

    cancelAnimationFrame(this.pulseRaf);
    this.pulseRaf = 0;
  }

  // ---------- EVENTS ----------

  private handleMove = (e: MapMouseEvent) => {
    const map = this.map;
    if (!map || !this.active) return;

    if (this.moveRaf) return;

    this.moveRaf = requestAnimationFrame(() => {
      this.moveRaf = 0;

      if (!this.active) return;

      const feature = this.query(e.point)[0] ?? null;

      map.getCanvas().style.cursor = feature ? CURSOR_HIT : CURSOR_IDLE;

      const prevKey = this.hoverFeature
        ? featureKey(this.hoverFeature)
        : null;

      const nextKey = feature ? featureKey(feature) : null;

      if (prevKey === nextKey) return;

      this.hoverFeature = feature;

      this.renderHighlight();
    });
  };

  private handleClick = (e: MapMouseEvent) => {
    const map = this.map;
    if (!map || !this.active) return;

    const features = this.query(e.point);

    this.closePopup();

    this.selectedFeature = features[0] ?? null;

    this.renderHighlight();

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

    popup.on("close", () => {
      this.selectedFeature = null;
      this.renderHighlight();
    });

    popup.addTo(map);

    this.popup = popup;
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

    const seen = new Set<string>();
    const out: MapGeoJSONFeature[] = [];
    const max = this.opts.maxFeatures ?? 8;

    for (const f of raw) {
      const key = featureKey(f);

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

  private isStylingField(key: string): boolean {
    const k = key.trim().toLowerCase();

    const explicit = [
      ...DEFAULT_HIDDEN_FIELDS,
      ...(this.opts.hiddenFields ?? []),
    ].map((h) => h.toLowerCase());

    if (explicit.includes(k)) return true;

    return HIDDEN_PATTERNS.some((re) => re.test(key));
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
    let showAll = false;

    const render = () => {
      root.replaceChildren();

      const f = features[index];
      const props = (f.properties ?? {}) as Record<string, unknown>;

      // HEADER
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

        const goTo = (nextIndex: number) => {
          index = nextIndex;

          this.selectedFeature = features[index];
          this.renderHighlight();

          render();
        };

        const prev = document.createElement("button");
        prev.type = "button";
        prev.className = "identify-pager-btn";
        prev.textContent = "‹";
        prev.setAttribute("aria-label", "Fitur sebelumnya");
        prev.addEventListener("click", () =>
          goTo((index - 1 + features.length) % features.length)
        );

        const count = document.createElement("span");
        count.className = "identify-pager-count";
        count.textContent = `${index + 1} / ${features.length}`;

        const next = document.createElement("button");
        next.type = "button";
        next.className = "identify-pager-btn";
        next.textContent = "›";
        next.setAttribute("aria-label", "Fitur berikutnya");
        next.addEventListener("click", () =>
          goTo((index + 1) % features.length)
        );

        pager.append(prev, count, next);
        root.appendChild(pager);
      }

      // ATRIBUT
      const all = Object.entries(props).filter(([, v]) => {
        if (v === null || v === undefined) return false;
        if (typeof v === "string" && v.trim() === "") return false;
        return true;
      });

      const dataEntries = all.filter(([k]) => !this.isStylingField(k));

      const hiddenCount = all.length - dataEntries.length;

      const entries = showAll ? all : dataEntries;

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

          if (showAll && this.isStylingField(key)) {
            row.classList.add("identify-row--styling");
          }

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

      // TOGGLE ATRIBUT TEKNIS
      if (hiddenCount > 0) {
        const foot = document.createElement("div");
        foot.className = "identify-pop-foot";

        const toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "identify-toggle";

        toggle.textContent = showAll
          ? this.opts.texts?.showLess ?? "Sembunyikan atribut teknis"
          : `${
              this.opts.texts?.showAll ?? "Tampilkan semua atribut"
            } (+${hiddenCount})`;

        toggle.addEventListener("click", () => {
          showAll = !showAll;
          render();
        });

        foot.appendChild(toggle);
        root.appendChild(foot);
      }
    };

    render();

    return root;
  }
}
