import maplibregl, {
  Map as MLMap,
  MapMouseEvent,
  GeoJSONSource,
} from "maplibre-gl";

import type {
  Feature,
  FeatureCollection,
  LineString,
  Point,
  Polygon,
} from "geojson";

import {
  measureLine,
  measurePolygon,
} from "./geo";

import type { ToolMode } from "@/components/toolMode";

// ============================================================================
// CONSTANT
// ============================================================================

const SRC = "__measure_src";
const L_FILL = "__measure_fill";
const L_LINE = "__measure_line";
const L_VERT = "__measure_vert";

// ============================================================================
// TYPE
// ============================================================================

type MeasureMode = Exclude<ToolMode, null>;

type Coordinate = [number, number];

interface MeasureLineResult {
  total: number;
  [key: string]: unknown;
}

interface MeasurePolygonResult {
  area: number;
  length: number;
  width: number;
  [key: string]: unknown;
}

type MeasureResult =
  | {
      mode: "distance";
      total: number;
      finished: boolean;
      unit: "m";
      k: number;
      [key: string]: unknown;
    }
  | {
      mode: "area";
      area?: number;
      length?: number;
      width?: number;
      pendingPerimeter?: number;
      finished: boolean;
      unit: "m";
      k: number;
      [key: string]: unknown;
    }
  | {
      mode: "length";
      length: number;
      finished: boolean;
      unit: "m";
      k: number;
      [key: string]: unknown;
    }
  | {
      mode: "width";
      width: number;
      finished: boolean;
      unit: "m";
      k: number;
      [key: string]: unknown;
    }
  | null;

interface MeasureControlOptions {
  onResult?: (result: MeasureResult) => void;
  onStop?: () => void;
  scaleFactor?: number;
}

// ============================================================================
// MEASURE CONTROL
// ============================================================================

export class MeasureControl {
  map: MLMap;

  onResult: (result: MeasureResult) => void;
  onStop: () => void;

  scaleFactor: number;

  mode: MeasureMode | null;
  coords: Coordinate[];
  hover: Coordinate | null;
  private _popups = new Set<maplibregl.Popup>();

  constructor(
  map: MLMap,
  options: MeasureControlOptions = {}
) {
  this.map = map;

  this.onResult =
    options.onResult ??
    (() => {});

  this.onStop =
    options.onStop ??
    (() => {});

  this.scaleFactor =
    options.scaleFactor ?? 1;

  this.mode = null;
  this.coords = [];
  this.hover = null;

  // Bind event handler
  this._onClick = this._onClick.bind(this);
  this._onMove = this._onMove.bind(this);
  this._onDbl = this._onDbl.bind(this);
  this._onKey = this._onKey.bind(this);
}

  // ============================================================
  // LAYERS
  // ============================================================

  private _ensureLayers(): void {
    // ==========================================================
    // SOURCE
    // ==========================================================

    if (!this.map.getSource(SRC)) {
      this.map.addSource(SRC, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });
    }

    // ==========================================================
    // FILL
    // ==========================================================

    if (!this.map.getLayer(L_FILL)) {
      this.map.addLayer({
        id: L_FILL,
        type: "fill",
        source: SRC,
        filter: [
          "==",
          ["geometry-type"],
          "Polygon",
        ],
        paint: {
          "fill-color": "#2dd4bf",
          "fill-opacity": 0.12,
        },
      });
    }

    // ==========================================================
    // LINE
    // ==========================================================

    if (!this.map.getLayer(L_LINE)) {
      this.map.addLayer({
        id: L_LINE,
        type: "line",
        source: SRC,
        filter: [
          "==",
          ["geometry-type"],
          "LineString",
        ],
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "#ffff00",
          "line-width": 4,
          "line-opacity": 1,
        },
      });
    }

    // ==========================================================
    // VERTEX
    // ==========================================================

    if (!this.map.getLayer(L_VERT)) {
      this.map.addLayer({
        id: L_VERT,
        type: "circle",
        source: SRC,
        filter: [
          "==",
          ["geometry-type"],
          "Point",
        ],
        paint: {
          "circle-radius": 6,
          "circle-color": "#ffff00",
          "circle-stroke-color": "#000000",
          "circle-stroke-width": 2,
        },
      });
    }

    // ==========================================================
    // PASTIKAN TERLIHAT
    // ==========================================================

    this.map.setLayoutProperty(
      L_FILL,
      "visibility",
      "visible"
    );

    this.map.setLayoutProperty(
      L_LINE,
      "visibility",
      "visible"
    );

       this.map.setLayoutProperty(
      L_VERT,
      "visibility",
      "visible"
    );
  }

  // ============================================================
  // POPUP MANAGEMENT
  // ============================================================

  private _addPopup(
    popup: maplibregl.Popup
  ): void {
    this._popups.add(popup);

    popup.on("close", () => {
      this._popups.delete(popup);
    });

    popup.addTo(this.map);
  }

  private _closePopups(): void {
    this._popups.forEach((popup) => {
      popup.remove();
    });

    this._popups.clear();
  }
  }

  // ============================================================
  // START
  // ============================================================

  start(mode: MeasureMode): void {
    console.log(
      "MEASURE START:",
      mode
    );

    // Lepas listener lama
    this._removeListeners();

    this.mode = mode;
    this.coords = [];
    this.hover = null;

    this._ensureLayers();

    // Bersihkan geometry lama
    this._setData([]);

    // Listener
    this.map.on(
      "click",
      this._onClick
    );

    this.map.on(
      "mousemove",
      this._onMove
    );

    this.map.on(
      "dblclick",
      this._onDbl
    );

    document.addEventListener(
      "keydown",
      this._onKey
    );

    this.map.doubleClickZoom.disable();

    this.map
      .getCanvas()
      .style.cursor = "crosshair";

    console.log(
      "MEASURE CLICK LISTENER TERPASANG"
    );
  }

  // ============================================================
  // REMOVE LISTENERS
  // ============================================================

  private _removeListeners(): void {
    this.map.off(
      "click",
      this._onClick
    );

    this.map.off(
      "mousemove",
      this._onMove
    );

    this.map.off(
      "dblclick",
      this._onDbl
    );

    document.removeEventListener(
      "keydown",
      this._onKey
    );

    if (this.map.doubleClickZoom) {
      this.map.doubleClickZoom.enable();
    }

    this.map
      .getCanvas()
      .style.cursor = "";
  }

  // ============================================================
  // STOP
  // ============================================================

  stop(): void {
    this._removeListeners();

    /*
     * Geometry hasil pengukuran
     * tetap dibiarkan di peta.
     */

    this.hover = null;

    this.onStop();
  }

  // ============================================================
  // CLEAR
  // ============================================================

  clear(): void {
    this.coords = [];
    this.hover = null;

    this._setData([]);

    this.onResult(null);
  }
  // ============================================================
  // SET DATA
  // ============================================================

  private _setData(
    coords: Coordinate[]
  ): void {
    const source =
      this.map.getSource(SRC) as GeoJSONSource | undefined;

    if (!source) {
      console.warn(
        "MEASURE: source tidak ditemukan"
      );
      return;
    }

    const geojson =
      this._fc(coords);

    console.log(
      "MEASURE DRAW:",
      {
        mode: this.mode,
        coords,
        geojson,
        lineLayer:
          !!this.map.getLayer(L_LINE),
        vertexLayer:
          !!this.map.getLayer(L_VERT),
      }
    );

    source.setData(geojson);
  }
  // ============================================================
  // CLICK
  // ============================================================

  private _onClick(
    e: MapMouseEvent
  ): void {
    if (!this.mode) {
      return;
    }

    const point: Coordinate = [
      e.lngLat.lng,
      e.lngLat.lat,
    ];

    console.log(
      "MEASURE CLICK:",
      point
    );

    // ==========================================================
    // TITIK PERMANEN
    // ==========================================================

    this.coords.push(point);

    // Preview mouse dihapus
    this.hover = null;

    console.log(
      "MEASURE COORDS:",
      this.coords
    );

    // ==========================================================
    // POPUP KOORDINAT
    // ==========================================================

    const popup = new maplibregl.Popup({
  closeButton: true,
  closeOnClick: false,
  offset: 12,
  className: "measure-coordinate-popup",
})
  .setLngLat(e.lngLat)
  .setHTML(`
    <div style="
      min-width: 150px;
      font-family: Arial, sans-serif;
      color: #1f2937;
      background: #ffffff;
    ">

      <div style="
        font-size: 11px;
        font-weight: 700;
        color: #0f766e;
        margin-bottom: 8px;
      ">
        TITIK ${this.coords.length}
      </div>

      <div style="
        font-size: 11px;
        line-height: 1.6;
        color: #1f2937;
      ">

        <div>
          <b style="color:#374151;">Longitude</b><br/>
          <span style="color:#111827;">
            ${e.lngLat.lng.toFixed(6)}
          </span>
        </div>

        <div style="
          margin-top: 6px;
        ">
          <b style="color:#374151;">Latitude</b><br/>
          <span style="color:#111827;">
            ${e.lngLat.lat.toFixed(6)}
          </span>
        </div>

      </div>

    </div>
  `);

this._addPopup(popup);

    // ==========================================================
    // GAMBAR ULANG
    // ==========================================================

    this._update();
  }

  // ============================================================
  // MOUSE MOVE
  // ============================================================

  private _onMove(
    e: MapMouseEvent
  ): void {
    if (!this.mode) {
      return;
    }

    /*
     * Kalau belum ada titik,
     * tidak perlu preview.
     */

    if (this.coords.length === 0) {
      return;
    }

    this.hover = [
      e.lngLat.lng,
      e.lngLat.lat,
    ];

    this._update();
  }

  // ============================================================
  // DOUBLE CLICK
  // ============================================================

  private _onDbl(
    _e: MapMouseEvent
  ): void {
    if (!this.mode) {
      return;
    }

    console.log(
      "MEASURE DOUBLE CLICK"
    );

    if (this.coords.length === 0) {
      return;
    }

    const finishedMode =
      this.mode;

    const finalCoords =
      this.coords.slice();

    // Jangan masukkan hover
    this.hover = null;

    // Geometry final
    this._setData(
      finalCoords
    );

    // Hasil final
    this._updateResult(
      finalCoords,
      true
    );

    // Popup hasil
    this._showResultPopup(
      finalCoords[
        finalCoords.length - 1
      ],
      finishedMode,
      finalCoords
    );

    // Listener dimatikan,
    // geometry tetap ada.
    this.stop();
  }

  // ============================================================
  // KEYBOARD
  // ============================================================

  private _onKey(
    e: KeyboardEvent
  ): void {
    if (!this.mode) {
      return;
    }

    // ==========================================================
    // ESC
    // ==========================================================

    if (e.key === "Escape") {
  this._closePopups();
  this.clear();
  this.stop();
  return;
}

    // ==========================================================
    // ENTER
    // ==========================================================

    if (e.key === "Enter") {
      if (this.coords.length === 0) {
        return;
      }

      const finishedMode =
        this.mode;

      const finalCoords =
        this.coords.slice();

      this.hover = null;

      this._setData(
        finalCoords
      );

      this._updateResult(
        finalCoords,
        true
      );

    // Tutup semua popup titik
this._closePopups();

// Popup hasil
this._showResultPopup(
  finalCoords[
    finalCoords.length - 1
  ],
  finishedMode,
  finalCoords
);

      this.stop();
    }
  }

  // ============================================================
  // WORKING COORDINATES
  // ============================================================

  private _working(): Coordinate[] {
    const c =
      this.coords.slice();

    /*
     * Hover hanya preview.
     */

    if (
      this.hover &&
      this.coords.length > 0
    ) {
      c.push(this.hover);
    }

    return c;
  }

  // ============================================================
  // UPDATE
  // ============================================================

  private _update(
    finished = false
  ): void {
    if (!this.mode) {
      return;
    }

    const c =
      this._working();

    console.log(
      "MEASURE UPDATE:",
      c
    );

    // Gambar geometry
    this._setData(c);

    // Hitung hasil
    this._updateResult(
      c,
      finished
    );
  }

  // ============================================================
  // UPDATE RESULT
  // ============================================================

  private _updateResult(
    c: Coordinate[],
    finished = false
  ): void {
    const k =
      this.scaleFactor;

    // ==========================================================
    // DISTANCE
    // ==========================================================

    if (this.mode === "distance") {
      const r =
        measureLine(
          c,
          k
        ) as MeasureLineResult | null;

      this.onResult(
        r
          ? {
              mode: "distance",
              ...r,
              finished,
              unit: "m",
              k,
            }
          : null
      );

      return;
    }

    // ==========================================================
    // AREA
    // ==========================================================

    if (this.mode === "area") {
      if (c.length >= 3) {
        const r =
          measurePolygon(
            c,
            k
          ) as MeasurePolygonResult;

        this.onResult({
          mode: "area",
          ...r,
          finished,
          unit: "m",
          k,
        });

        return;
      }

      if (c.length === 2) {
        const r =
          measureLine(
            c,
            k
          ) as MeasureLineResult | null;

        this.onResult(
          r
            ? {
                mode: "area",
                pendingPerimeter:
                  r.total,
                finished,
                unit: "m",
                k,
              }
            : null
        );

        return;
      }

      this.onResult(null);
      return;
    }

    // ==========================================================
// LENGTH
// ==========================================================

if (this.mode === "length") {
  if (c.length >= 2) {
    const r =
      measureLine(
        c,
        k
      ) as MeasureLineResult | null;

    this.onResult(
      r
        ? {
            mode: "length",
            length: r.total,
            finished,
            unit: "m",
            k,
          }
        : null
    );

    return;
  }

  this.onResult(null);
  return;
}

// ==========================================================
// WIDTH
// ==========================================================

if (this.mode === "width") {
  if (c.length >= 2) {
    const r =
      measureLine(
        c,
        k
      ) as MeasureLineResult | null;

    this.onResult(
      r
        ? {
            mode: "width",
            width: r.total,
            finished,
            unit: "m",
            k,
          }
        : null
    );

    return;
  }

  this.onResult(null);
  return;
}

  // ============================================================
  // RESULT POPUP
  // ============================================================

  private _showResultPopup(
    position: Coordinate | undefined,
    mode: MeasureMode,
    coords: Coordinate[]
  ): void {
    if (!position) {
      return;
    }

    const lng = position[0];
    const lat = position[1];

    let html = `
  <div style="
    min-width: 190px;
    font-family: Arial, sans-serif;
    color: #1f2937;
    background: #ffffff;
  ">

        <div style="
          color: #0f766e;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 8px;
        ">
          HASIL PENGUKURAN
        </div>
    `;

    // ==========================================================
    // DISTANCE
    // ==========================================================

    if (mode === "distance") {
      const r =
        measureLine(
          coords,
          this.scaleFactor
        ) as MeasureLineResult | null;

      if (r) {
        html += `
          <div style="
            display:flex;
            justify-content:space-between;
            gap:15px;
            margin-bottom:5px;
          ">
            <span style="color:#374151;">Jarak</span>
<b style="color:#111827;">${fmtLen(r.total)}</b>
          </div>
        `;
      }
    }
    // ==========================================================
    // LENGTH
    // ==========================================================

    if (
      mode === "length" &&
      coords.length >= 3
    ) {
      const r =
        measurePolygon(
          coords,
          this.scaleFactor
        ) as MeasurePolygonResult;

      html += `
        <div style="
          display:flex;
          justify-content:space-between;
          gap:15px;
          margin-bottom:5px;
        ">
          <span style="color:#374151;">
            Panjang
          </span>

          <b style="color:#111827;">
            ${fmtLen(r.length)}
          </b>
        </div>
      `;
    }

    // ==========================================================
    // WIDTH
    // ==========================================================

    if (
      mode === "width" &&
      coords.length >= 3
    ) {
      const r =
        measurePolygon(
          coords,
          this.scaleFactor
        ) as MeasurePolygonResult;

      html += `
        <div style="
          display:flex;
          justify-content:space-between;
          gap:15px;
          margin-bottom:5px;
        ">
          <span style="color:#374151;">
            Lebar
          </span>

          <b style="color:#111827;">
            ${fmtLen(r.width)}
          </b>
        </div>
      `;
    }
    // ==========================================================
    // AREA
    // ==========================================================

    if (
      mode === "area" &&
      coords.length >= 3
    ) {
      const r =
        measurePolygon(
          coords,
          this.scaleFactor
        ) as MeasurePolygonResult;

      html += `
        <div style="
          display:flex;
          justify-content:space-between;
          gap:15px;
          margin-bottom:5px;
        ">
          <span style="color:#374151;">Luas</span>
<b style="color:#111827;">${fmtArea(r.area)}</b>
        </div>

        <div style="
          display:flex;
          justify-content:space-between;
          gap:15px;
          margin-bottom:5px;
        ">
          <span style="color:#374151;">Panjang</span>
<b style="color:#111827;">${fmtLen(r.length)}</b>
        </div>

        <div style="
          display:flex;
          justify-content:space-between;
          gap:15px;
        ">
          <span style="color:#374151;">Lebar</span>
<b style="color:#111827;">${fmtLen(r.width)}</b>
        </div>
      `;
    }

    html += `
        <hr style="
          margin:8px 0;
          border:0;
          border-top:1px solid #ddd;
        "/>

        <div style="
  font-size:10px;
  color:#374151;
">
  <b>Longitude:</b>
  <span style="color:#111827;">
    ${lng.toFixed(6)}
  </span>
</div>

<div style="
  font-size:10px;
  color:#374151;
">
  <b>Latitude:</b>
  <span style="color:#111827;">
    ${lat.toFixed(6)}
  </span>
</div>

      </div>
    `;

    const popup = new maplibregl.Popup({
  closeButton: true,
  closeOnClick: false,
  offset: 15,
})
  .setLngLat({
    lng,
    lat,
  })
  .setHTML(html);

this._addPopup(popup);
  }

  // ============================================================
  // GEOJSON
  // ============================================================

  private _fc(
    c: Coordinate[]
  ): FeatureCollection {
    const feats: Feature[] = [];

    // ==========================================================
    // POLYGON
    // ==========================================================

    if (
      this.mode === "area" &&
      c.length >= 3
    ) {
      const polygon: Polygon = {
        type: "Polygon",
        coordinates: [
          [
            ...c,
            c[0],
          ],
        ],
      };

      feats.push({
        type: "Feature",
        geometry: polygon,
        properties: {},
      });
    }

    // ==========================================================
    // LINE
    // ==========================================================

    if (c.length >= 2) {
      const line: LineString = {
        type: "LineString",
        coordinates: c,
      };

      feats.push({
        type: "Feature",
        geometry: line,
        properties: {},
      });
    }

    // ==========================================================
    // POINT
    // ==========================================================

    c.forEach((p) => {
      const point: Point = {
        type: "Point",
        coordinates: p,
      };

      feats.push({
        type: "Feature",
        geometry: point,
        properties: {},
      });
    });

    return {
      type: "FeatureCollection",
      features: feats,
    };
  }
}

// ============================================================================
// FORMAT
// ============================================================================

export function fmtLen(
  m: number
): string {
  return m >= 1000
    ? `${(m / 1000).toFixed(3)} km`
    : `${m.toFixed(2)} m`;
}

export function fmtArea(
  m2: number
): string {
  return m2 >= 10000
    ? `${(m2 / 10000).toFixed(4)} ha (${m2.toFixed(2)} m²)`
    : `${m2.toFixed(2)} m²`;
}
