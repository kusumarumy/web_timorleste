// ============================================================
// IdentifyControl
// Klik objek pada peta -> tampilkan semua atribut GeoJSON
// ============================================================

export class IdentifyControl {
  constructor(map, options = {}) {
    this.map = map;

    this.layerIds = options.layerIds || [];
    this.labelFn =
      options.labelFn ||
      ((key) =>
        String(key)
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()));

    this.enabled = false;

    this.handleClick = this.handleClick.bind(this);
  }

  // ==========================================================
  // ENABLE
  // ==========================================================

  enable() {
    if (this.enabled) return;

    this.enabled = true;

    this.map.getCanvas().style.cursor = "crosshair";

    this.map.on("click", this.handleClick);

    console.log("IDENTIFY: enabled");
  }

  // ==========================================================
  // DISABLE
  // ==========================================================

  disable() {
    if (!this.enabled) return;

    this.enabled = false;

    this.map.off("click", this.handleClick);

    this.map.getCanvas().style.cursor = "";

    console.log("IDENTIFY: disabled");
  }

  // ==========================================================
  // CLICK
  // ==========================================================

  handleClick(e) {
    if (!this.enabled) return;

    const layers = this.layerIds.filter((id) =>
      this.map.getLayer(id)
    );

    if (!layers.length) {
      console.warn("IDENTIFY: tidak ada layer aktif");
      return;
    }

    const features = this.map.queryRenderedFeatures(e.point, {
      layers,
    });

    if (!features.length) {
      this.showEmpty(e);
      return;
    }

    // Ambil feature paling atas
    const feature = features[0];

    this.showFeature(e, feature);
  }

  // ==========================================================
  // FEATURE POPUP
  // ==========================================================

  showFeature(e, feature) {
    const properties = feature.properties || {};

    let html = `
      <div class="identify-popup">
        <div class="identify-popup__title">
          ${this.getLayerTitle(feature)}
        </div>

        <div class="identify-popup__table">
    `;

    const entries = Object.entries(properties);

    if (!entries.length) {
      html += `
        <div class="identify-popup__empty">
          Tidak ada atribut
        </div>
      `;
    } else {
      for (const [key, value] of entries) {
        if (
          value === null ||
          value === undefined ||
          value === ""
        ) {
          continue;
        }

        html += `
          <div class="identify-popup__row">
            <div class="identify-popup__key">
              ${this.escapeHtml(this.labelFn(key))}
            </div>

            <div class="identify-popup__value">
              ${this.formatValue(value)}
            </div>
          </div>
        `;
      }
    }

    html += `
        </div>
      </div>
    `;

    new this.map.constructor.Popup({
      closeButton: true,
      closeOnClick: true,
      maxWidth: "360px",
      className: "identify-popup-container",
    })
      .setLngLat(e.lngLat)
      .setHTML(html)
      .addTo(this.map);
  }

  // ==========================================================
  // LAYER TITLE
  // ==========================================================

  getLayerTitle(feature) {
    const layerId = feature.layer?.id || "Layer";

    return this.labelFn(layerId);
  }

  // ==========================================================
  // EMPTY
  // ==========================================================

  showEmpty(e) {
    new this.map.constructor.Popup({
      closeButton: true,
      closeOnClick: true,
      maxWidth: "280px",
      className: "identify-popup-container",
    })
      .setLngLat(e.lngLat)
      .setHTML(`
        <div class="identify-popup">
          <div class="identify-popup__title">
            Identify
          </div>

          <div class="identify-popup__empty">
            Tidak ada objek pada lokasi ini.
          </div>
        </div>
      `)
      .addTo(this.map);
  }

  // ==========================================================
  // FORMAT VALUE
  // ==========================================================

  formatValue(value) {
    if (typeof value === "object") {
      try {
        return this.escapeHtml(JSON.stringify(value));
      } catch {
        return this.escapeHtml(String(value));
      }
    }

    return this.escapeHtml(String(value));
  }

  // ==========================================================
  // ESCAPE HTML
  // ==========================================================

  escapeHtml(value) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}
