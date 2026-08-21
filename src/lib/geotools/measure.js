import maplibregl from "maplibre-gl";
import { measureLine, measurePolygon } from "./geo";

const SRC = '__measure_src';
const L_FILL = '__measure_fill';
const L_LINE = '__measure_line';
const L_VERT = '__measure_vert';

export class MeasureControl {
  /**
   * @param {maplibregl.Map} map
   * @param {object} options
   * @param {(res:object|null)=>void} options.onResult  callback hasil hidup
   * @param {number} [options.scaleFactor=1]  pengali grid->ground.
   *   Default 1 = laporkan nilai GRID UTM (konsisten dgn EPSG:32751 di app).
   *   Untuk jarak DI TANAH di lokasi Ainaro, pakai ~0.99959 (k^-1).
   */
  constructor(map, options = {}) {
    this.map = map;
    this.onResult = options.onResult || (() => {});
    this.onStop = options.onStop || (() => {});
    this.scaleFactor = options.scaleFactor ?? 1;
    this.mode = null;      // 'distance' | 'area'
    this.coords = [];      // vertex terkonfirmasi [lng,lat]
    this.hover = null;     // posisi kursor [lng,lat]
    ['_onClick', '_onMove', '_onDbl', '_onKey'].forEach((m) => (this[m] = this[m].bind(this)));
  }

  _ensureLayers() {
    if (this.map.getSource(SRC)) return;
    this.map.addSource(SRC, { type: 'geojson', data: this._fc([]) });
    this.map.addLayer({
      id: L_FILL, type: 'fill', source: SRC, filter: ['==', '$type', 'Polygon'],
      paint: { 'fill-color': '#2dd4bf', 'fill-opacity': 0.15 },
    });
    this.map.addLayer({
      id: L_LINE, type: 'line', source: SRC, filter: ['==', '$type', 'LineString'],
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': '#2dd4bf', 'line-width': 2.5, 'line-dasharray': [2, 1] },
    });
    this.map.addLayer({
      id: L_VERT, type: 'circle', source: SRC, filter: ['==', '$type', 'Point'],
      paint: {
        'circle-radius': 5, 'circle-color': '#0f766e',
        'circle-stroke-color': '#ffffff', 'circle-stroke-width': 2,
      },
    });
  }

  start(mode) {
  console.log("MEASURE START:", mode);

  this.stop();

  this.mode = mode;
  this.coords = [];
  this.hover = null;

  this._ensureLayers();

  this.map.on("click", this._onClick);
  this.map.on("mousemove", this._onMove);
  this.map.on("dblclick", this._onDbl);

  document.addEventListener(
    "keydown",
    this._onKey
  );

  this.map.doubleClickZoom.disable();

  this.map.getCanvas().style.cursor =
    "crosshair";

  console.log(
    "MEASURE CLICK LISTENER TERPASANG"
  );
}

  /** hentikan interaksi (gambar tetap ada sampai clear()) */
  stop() {
    this.map.off('click', this._onClick);
    this.map.off('mousemove', this._onMove);
    this.map.off('dblclick', this._onDbl);
    document.removeEventListener('keydown', this._onKey);
    this.map.doubleClickZoom.enable();
    this.map.getCanvas().style.cursor = '';
    this.mode = null;
    this.onStop();
  }

  /** kosongkan gambar + hasil */
  clear() {
    this.coords = [];
    this.hover = null;
    if (this.map.getSource(SRC)) this.map.getSource(SRC).setData(this._fc([]));
    this.onResult(null);
  }

  _onClick(e) {
  const point = [
    e.lngLat.lng,
    e.lngLat.lat,
  ];

  this.coords.push(point);

  // Popup koordinat titik
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
  _onMove(e) { this.hover = [e.lngLat.lng, e.lngLat.lat]; if (this.coords.length) this._update(); }
  _onDbl(e) {
  if (this.coords.length > 1) {
    this.coords.pop();
  }

  this.hover = null;

  this._update(true);

  this._showResultPopup(
    this.coords[this.coords.length - 1]
  );

  this.stop();
}
  _onKey(e) {
    if (e.key === 'Escape') { this.clear(); this.stop(); }
    else if (e.key === 'Enter') { this.hover = null; this._update(true); this.stop(); }
  }

  _working() {
    const c = this.coords.slice();
    if (this.hover) c.push(this.hover);
    return c;
  }

  _update(finished = false) {
    const c = this._working();
    this.map.getSource(SRC).setData(this._fc(c));
    const k = this.scaleFactor;
    if (this.mode === 'distance') {
      const r = measureLine(c, k);
      this.onResult(r ? { mode: 'distance', ...r, finished, unit: 'm', k } : null);
    } else {
      if (c.length >= 3) {
        this.onResult({ mode: 'area', ...measurePolygon(c, k), finished, unit: 'm', k });
      } else if (c.length === 2) {
        const r = measureLine(c, k);
        this.onResult(r ? { mode: 'area', pendingPerimeter: r.total, finished, unit: 'm', k } : null);
      } else this.onResult(null);
    }
  }
_showResultPopup(position) {
  if (!position) return;

  const lng = position[0];
  const lat = position[1];

  const c = this.coords.slice();

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

  if (this.mode === "distance") {
    const r = measureLine(c, this.scaleFactor);

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

  if (this.mode === "area" && c.length >= 3) {
    const r = measurePolygon(
      c,
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
        <b>Longitude:</b> ${lng.toFixed(6)}
      </div>

      <div style="font-size:10px;">
        <b>Latitude:</b> ${lat.toFixed(6)}
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
  _fc(c) {
    const feats = [];
    if (this.mode === 'area' && c.length >= 3) {
      feats.push({ type: 'Feature', geometry: { type: 'Polygon', coordinates: [[...c, c[0]]] }, properties: {} });
    }
    if (c.length >= 2) {
      feats.push({ type: 'Feature', geometry: { type: 'LineString', coordinates: c }, properties: {} });
    }
    c.forEach((p) => feats.push({ type: 'Feature', geometry: { type: 'Point', coordinates: p }, properties: {} }));
    return { type: 'FeatureCollection', features: feats };
  }
}

/** util format angka untuk UI */
export function fmtLen(m) {
  return m >= 1000 ? `${(m / 1000).toFixed(3)} km` : `${m.toFixed(2)} m`;
}
export function fmtArea(m2) {
  return m2 >= 10000 ? `${(m2 / 10000).toFixed(4)} ha  (${m2.toFixed(2)} m²)` : `${m2.toFixed(2)} m²`;
}
