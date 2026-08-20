// ============================================================================
// identify.js — Tool "Identify": klik fitur (titik/garis/poligon) -> atribut
// MapLibre GL JS. Tanpa dependensi React (bisa dipakai di struktur apa pun).
// ============================================================================
import maplibregl from 'maplibre-gl';

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );

export class IdentifyControl {
  /**
   * @param {maplibregl.Map} map
   * @param {object} options
   * @param {string[]} options.layerIds  daftar id layer yang boleh di-identify
   * @param {number}   [options.tolerance=5]  toleransi klik dalam piksel
   * @param {(k:string)=>string} [options.labelFn]  ubah nama field jadi label
   */
  constructor(map, options = {}) {
    this.map = map;
    this.layerIds = options.layerIds || [];
    this.tolerance = options.tolerance ?? 5;
    this.labelFn = options.labelFn || ((k) => k);
    this.active = false;
    this.popup = new maplibregl.Popup({
      closeButton: true,
      closeOnClick: false,
      maxWidth: '340px',
      className: 'geo-identify-popup',
    });
    this._onClick = this._onClick.bind(this);
    this._onMove = this._onMove.bind(this);
  }

  setLayers(ids) { this.layerIds = ids; }

  enable() {
    if (this.active) return;
    this.active = true;
    this.map.on('click', this._onClick);
    this.map.on('mousemove', this._onMove);
    this.map.getCanvas().style.cursor = 'help';
  }

  disable() {
    if (!this.active) return;
    this.active = false;
    this.map.off('click', this._onClick);
    this.map.off('mousemove', this._onMove);
    this.map.getCanvas().style.cursor = '';
    this.popup.remove();
  }

  toggle() { this.active ? this.disable() : this.enable(); }

  // hanya layer yang benar-benar ada di style saat ini
  _queryable() { return this.layerIds.filter((id) => this.map.getLayer(id)); }

  _onMove(e) {
    const layers = this._queryable();
    if (!layers.length) return;
    const hit = this.map.queryRenderedFeatures(e.point, { layers }).length;
    this.map.getCanvas().style.cursor = hit ? 'pointer' : 'help';
  }

  _onClick(e) {
    const layers = this._queryable();
    if (!layers.length) return;
    const t = this.tolerance;
    const box = [
      [e.point.x - t, e.point.y - t],
      [e.point.x + t, e.point.y + t],
    ];
    const feats = this.map.queryRenderedFeatures(box, { layers });
    if (!feats.length) { this.popup.remove(); return; }
    this.popup.setLngLat(e.lngLat).setHTML(this._html(feats[0])).addTo(this.map);
  }

  _html(feature) {
    const props = feature.properties || {};
    const rows = Object.entries(props)
      .filter(([k, v]) => v !== null && v !== '' && !k.startsWith('_'))
      .map(
        ([k, v]) =>
          `<tr><td class="k">${esc(this.labelFn(k))}</td><td class="v">${esc(v)}</td></tr>`
      )
      .join('');
    return `
      <div class="geo-identify">
        <div class="geo-identify__title">${esc(feature.layer.id)}</div>
        <table class="geo-identify__table">
          ${rows || '<tr><td colspan="2">Tidak ada atribut</td></tr>'}
        </table>
      </div>`;
  }
}
