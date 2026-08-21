import maplibregl from "maplibre-gl";
import { measureLine, measurePolygon } from "./geo";

const SRC = "__measure_src";
const L_FILL = "__measure_fill";
const L_LINE = "__measure_line";
const L_VERT = "__measure_vert";

export class MeasureControl {
  constructor(map, options = {}) {
    this.map = map;

    this.onResult = options.onResult || (() => {});
    this.onStop = options.onStop || (() => {});

    this.scaleFactor = options.scaleFactor ?? 1;

    this.mode = null;
    this.coords = [];
    this.hover = null;

    // Waktu klik terakhir
    this.lastClickTime = 0;

    this._onClick = this._onClick.bind(this);
    this._onMove = this._onMove.bind(this);
    this._onDbl = this._onDbl.bind(this);
    this._onKey = this._onKey.bind(this);
  }

  // ============================================================
  // LAYER PENGUKURAN
  // ============================================================

  _ensureLayers() {
    if (!this.map.getSource(SRC)) {
      this.map.addSource(SRC, {
        type: "geojson",
        data: this._fc([]),
      });
    }

    if (!this.map.getLayer(L_FILL)) {
      this.map.addLayer({
        id: L_FILL,
        type: "fill",
        source: SRC,
        filter: ["==", "$type", "Polygon"],
        paint: {
          "fill-color": "#2dd4bf",
          "fill-opacity": 0.15,
        },
      });
    }

    if (!this.map.getLayer(L_LINE)) {
      this.map.addLayer({
        id: L_LINE,
        type: "line",
        source: SRC,
        filter: ["==", "$type", "LineString"],
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "#2dd4bf",
          "line-width": 2.5,
          "line-dasharray": [2, 1],
        },
      });
    }

    if (!this.map.getLayer(L_VERT)) {
      this.map.addLayer({
        id: L_VERT,
        type: "circle",
        source: SRC,
        filter: ["==", "$type", "Point"],
        paint: {
          "circle-radius": 5,
          "circle-color": "#0f766e",
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,
        },
      });
    }
  }

  // ============================================================
  // START
  // ============================================================

  start(mode) {
    console.log("MEASURE START:", mode);

    this._removeListeners();

    this.mode = mode;
    this.coords = [];
    this.hover = null;
    this.lastClickTime = 0;

    this._ensureLayers();

    this.map.on("click", this._onClick);
    this.map.on("mousemove", this._onMove);
    this.map.on("dblclick", this._onDbl);

    document.addEventListener("keydown", this._onKey);

    this.map.doubleClickZoom.disable();

    this.map.getCanvas().style.cursor = "crosshair";

    console.log("MEASURE CLICK LISTENER TERPASANG");
  }

  // ============================================================
  // REMOVE LISTENER
  // ============================================================

  _removeListeners() {
    this.map.off("click", this._onClick);
    this.map.off("mousemove", this._onMove);
    this.map.off("dblclick", this._onDbl);

    document.removeEventListener(
      "keydown",
      this._onKey
    );

    this.map.doubleClickZoom.enable();

    this.map.getCanvas().style.cursor = "";
  }

  // ============================================================
  // STOP
  // ============================================================

  stop() {
    this._removeListeners();

    this.mode = null;
    this.hover = null;

    this.onStop();
  }

  // ============================================================
  // CLEAR
  // ============================================================

  clear() {
    this.coords = [];
    this.hover = null;
    this.lastClickTime = 0;

    const source = this.map.getSource(SRC);

    if (source && "setData" in source) {
      source.setData(this._fc([]));
    }

    this.onResult(null);
  }

  // ============================================================
  // CLICK
  // ============================================================

  _onClick(e) {
    const now = Date.now();

    /*
     * MapLibre akan mengirim click sebelum dblclick.
     *
     * Kalau click terlalu dekat dengan click sebelumnya,
     * anggap itu bagian dari double-click.
     */
    if (
      this.lastClickTime &&
      now - this.lastClickTime < 300
    ) {
      return;
    }

    this.lastClickTime = now;

    if (!this.mode) {
      return;
    }

    const point = [
      e.lngLat.lng,
      e.lngLat.lat,
    ];

    this.coords.push(point);

    console.log(
      "MEASURE POINT:",
      this.coords.length,
      point
    );

    // Popup koordinat
    new maplibregl.Popup({
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
        ">
          <div style="
            font-size: 11px;
            font-weight: 700;
            color: #0f766e;
            margin-bottom: 6px;
          ">
            TITIK ${this.coords.length}
          </div>

          <div style="
            font-size: 11px;
            line-height: 1.6;
          ">
            <div>
              <b>Longitude</b><br/>
              ${e.lngLat.lng.toFixed(6)}
            </div>

            <div style="margin-top: 4px;">
              <b>Latitude</b><br/>
              ${e.lngLat.lat.toFixed(6)}
            </div>
          </div>
        </div>
      `)
      .addTo(this.map);

    this._update();
  }

  // ============================================================
  // MOUSE MOVE
  // ============================================================

  _onMove(e) {
    if (!this.mode) {
      return;
    }

    this.hover = [
      e.lngLat.lng,
      e.lngLat.lat,
    ];

    if (this.coords.length) {
      this._update();
    }
  }

  // ============================================================
  // DOUBLE CLICK → SELESAI
  // ============================================================

  _onDbl(e) {
    if (!this.mode) {
      return;
    }

    console.log(
      "MEASURE DOUBLE CLICK:",
      this.coords.length
    );

    /*
     * Jangan pop() titik lagi.
     *
     * Click yang menjadi bagian dari double-click
     * sudah dicegah oleh _onClick().
     */

    this.hover = null;

    // Simpan mode sebelum stop()
    const finishedMode = this.mode;

    // Salin koordinat final
    const finalCoords = this.coords.slice();

    // Update geometry terakhir
    this._update(true);

    // Tampilkan hasil berdasarkan mode yang benar
    this._showResultPopup(
      finalCoords[finalCoords.length - 1],
      finishedMode,
      finalCoords
    );

    // Baru hentikan tool
    this.stop();
  }

  // ============================================================
  // KEYBOARD
  // ============================================================

  _onKey(e) {
    if (!this.mode) {
      return;
    }

    if (e.key === "Escape") {
      this.clear();
      this.stop();
      return;
    }

    if (e.key === "Enter") {
      this.hover = null;

      if (this.coords.length >= 1) {
        this._update(true);
      }

      this.stop();
    }
  }

  // ============================================================
  // WORKING COORDINATES
  // ============================================================

  _working() {
    const c = this.coords.slice();

    if (this.hover) {
      c.push(this.hover);
    }

    return c;
  }

  // ============================================================
  // UPDATE
  // ============================================================

  _update(finished = false) {
    if (!this.mode) {
      return;
    }

    const c = this._working();

    const source = this.map.getSource(SRC);

    if (source && "setData" in source) {
      source.setData(this._fc(c));
    }

    const k = this.scaleFactor;

    // ---------------- DISTANCE ----------------

    if (this.mode === "distance") {
      const r = measureLine(c, k);

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

    // ---------------- AREA ----------------

    if (this.mode === "area") {
      if (c.length >= 3) {
        const r = measurePolygon(c, k);

        this.onResult({
          mode: "area",
          ...r,
          finished,
          unit: "m",
          k,
        });
      } else if (c.length === 2) {
        const r = measureLine(c, k);

        this.onResult(
          r
            ? {
                mode: "area",
                pendingPerimeter: r.total,
                finished,
                unit: "m",
                k,
              }
            : null
        );
      } else {
        this.onResult(null);
      }
    }
  }

  // ============================================================
  // RESULT POPUP
  // ============================================================

  _showResultPopup(
    position,
    mode,
    coords
  ) {
    if (!position) {
      return;
    }

    const lng = position[0];
    const lat = position[1];

    let html = `
      <div style="
        min-width: 190px;
        font-family: Arial, sans-serif;
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

    // ---------------- DISTANCE ----------------

    if (mode === "distance") {
      const r = measureLine(
        coords,
        this.scaleFactor
      );

      if (r) {
        html += `
          <div style="
            display:flex;
            justify-content:space-between;
            gap:15px;
            margin-bottom:5px;
          ">
            <span>Jarak</span>
            <b>${fmtLen(r.total)}</b>
          </div>
        `;
      }
    }

    // ---------------- AREA ----------------

    if (
      mode === "area" &&
      coords.length >= 3
    ) {
      const r = measurePolygon(
        coords,
        this.scaleFactor
      );

      html += `
        <div style="
          display:flex;
          justify-content:space-between;
          gap:15px;
          margin-bottom:5px;
        ">
          <span>Luas</span>
          <b>${fmtArea(r.area)}</b>
        </div>

        <div style="
          display:flex;
          justify-content:space-between;
          gap:15px;
          margin-bottom:5px;
        ">
          <span>Panjang</span>
          <b>${fmtLen(r.length)}</b>
        </div>

        <div style="
          display:flex;
          justify-content:space-between;
          gap:15px;
        ">
          <span>Lebar</span>
          <b>${fmtLen(r.width)}</b>
        </div>
      `;
    }

    html += `
        <hr style="
          margin:8px 0;
          border:0;
          border-top:1px solid #ddd;
        "/>

        <div style="font-size:10px;">
          <b>Longitude:</b>
          ${lng.toFixed(6)}
        </div>

        <div style="font-size:10px;">
          <b>Latitude:</b>
          ${lat.toFixed(6)}
        </div>

      </div>
    `;

    new maplibregl.Popup({
      closeButton: true,
      closeOnClick: false,
      offset: 15,
    })
      .setLngLat({
        lng,
        lat,
      })
      .setHTML(html)
      .addTo(this.map);
  }

  // ============================================================
  // GEOJSON
  // ============================================================

  _fc(c) {
    const feats = [];

    // Polygon
    if (
      this.mode === "area" &&
      c.length >= 3
    ) {
      feats.push({
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [...c, c[0]],
          ],
        },
        properties: {},
      });
    }

    // Line
    if (c.length >= 2) {
      feats.push({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: c,
        },
        properties: {},
      });
    }

    // Vertex
    c.forEach((p) => {
      feats.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: p,
        },
        properties: {},
      });
    });

    return {
      type: "FeatureCollection",
      features: feats,
    };
  }
}

// ============================================================
// FORMAT
// ============================================================

export function fmtLen(m) {
  return m >= 1000
    ? `${(m / 1000).toFixed(3)} km`
    : `${m.toFixed(2)} m`;
}

export function fmtArea(m2) {
  return m2 >= 10000
    ? `${(m2 / 10000).toFixed(4)} ha (${m2.toFixed(2)} m²)`
    : `${m2.toFixed(2)} m²`;
}
