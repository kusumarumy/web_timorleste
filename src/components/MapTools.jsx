// ============================================================================
// MapTools.jsx
// Integrasi Identify + Measurement untuk Next.js 14 / MapLibre
//
// Tool pengukuran:
// - length   → Panjang
// - width    → Lebar
// - area     → Luas
// - distance → Jarak
//
// Panjang, Lebar, dan Luas menggunakan MeasureControl mode "area".
// Yang membedakan adalah nilai hasil yang ditampilkan ke pengguna.
// ============================================================================

"use client";

import { useEffect, useRef, useState } from "react";

import { IdentifyControl } from "../lib/geotools/identify";
import {
  MeasureControl,
  fmtLen,
  fmtArea,
} from "../lib/geotools/measure";

import {
  getToolMode,
  onToolMode,
  setToolMode,
} from "./toolMode";

import "./geo-tools.css";

// GANTI dengan ID layer interaktif sebenarnya
const INTERACTIVE_LAYERS = [
  "aoi-foto-udara",
  "aoi-lidar",
  "batas-desa",
  "batas-posto",
  "batas-kotamadya",
  "batas-negara",
  "kontur-mayor",
  "kontur-minor",
];

// 1 = nilai grid UTM
const GROUND_K = 1;

export default function MapTools({ map }) {
  const identifyRef = useRef(null);
  const measureRef = useRef(null);

  const [tool, setTool] = useState(getToolMode());
  const [result, setResult] = useState(null);

  // ============================================================
  // INIT CONTROLS
  // ============================================================

  useEffect(() => {
    if (!map) return;

    identifyRef.current = new IdentifyControl(map, {
      layerIds: INTERACTIVE_LAYERS,
      labelFn: (k) => k.replace(/_/g, " "),
    });

    measureRef.current = new MeasureControl(map, {
      scaleFactor: GROUND_K,
      onResult: setResult,
    });

    return () => {
      identifyRef.current?.disable();
      measureRef.current?.stop();
      measureRef.current?.clear();
    };
  }, [map]);

  // ============================================================
  // DENGARKAN TOOL MODE DARI CONTROL PANEL
  // ============================================================

  useEffect(() => {
    const unsubscribe = onToolMode((next) => {
      setTool(next);

      // Matikan tool sebelumnya
      identifyRef.current?.disable();
      measureRef.current?.stop();
      measureRef.current?.clear();

      setResult(null);

      if (!next) return;

      // IDENTIFY
      if (next === "identify") {
        identifyRef.current?.enable();
        return;
      }

      // JARAK
      if (next === "distance") {
        measureRef.current?.start("distance");
        return;
      }

      // PANJANG / LEBAR / LUAS
      //
      // Ketiganya menggambar polygon.
      // Hasilnya sudah dihitung oleh measurePolygon().
      if (
        next === "length" ||
        next === "width" ||
        next === "area"
      ) {
        measureRef.current?.start("area");
      }
    });

    return unsubscribe;
  }, []);

  // ============================================================
  // TOOLBAR LAMA
  //
  // Boleh dihapus kalau tombol sekarang sudah ada di ControlPanel.
  // ============================================================

  return (
    <>
      {result && (
        <div
          className="geo-measure"
          style={{
            position: "absolute",
            top: 60,
            right: 16,
            zIndex: 20,
          }}
        >
          {/* ==================================================
              JARAK
          ================================================== */}

          {tool === "distance" &&
            result.mode === "distance" && (
              <>
                <div className="geo-measure__row">
                  <span className="lbl">
                    Jarak
                  </span>

                  <span className="val">
                    {fmtLen(result.total)}
                  </span>
                </div>

                {result.segments?.length > 1 && (
                  <div className="geo-measure__row">
                    <span className="lbl">
                      Segmen terakhir
                    </span>

                    <span className="val">
                      {fmtLen(
                        result.segments.at(-1)
                      )}
                    </span>
                  </div>
                )}
              </>
            )}

          {/* ==================================================
              PANJANG
          ================================================== */}

          {tool === "length" &&
            result.mode === "area" &&
            result.length != null && (
              <div className="geo-measure__row">
                <span className="lbl">
                  Panjang
                </span>

                <span className="val">
                  {fmtLen(result.length)}
                </span>
              </div>
            )}

          {/* ==================================================
              LEBAR
          ================================================== */}

          {tool === "width" &&
            result.mode === "area" &&
            result.width != null && (
              <div className="geo-measure__row">
                <span className="lbl">
                  Lebar
                </span>

                <span className="val">
                  {fmtLen(result.width)}
                </span>
              </div>
            )}

          {/* ==================================================
              LUAS
          ================================================== */}

          {tool === "area" &&
            result.mode === "area" &&
            result.area != null && (
              <>
                <div className="geo-measure__row">
                  <span className="lbl">
                    Luas
                  </span>

                  <span className="val">
                    {fmtArea(result.area)}
                  </span>
                </div>
              </>
            )}

          <div className="geo-measure__hint">
            Klik untuk menambah titik ·
            double-click / Enter untuk selesai ·
            Esc untuk batal
          </div>

          <div className="geo-measure__crs">
            EPSG:32751 ·{" "}
            {result.k === 1
              ? "nilai grid UTM"
              : `ground (k=${result.k})`}
          </div>
        </div>
      )}
    </>
  );
}
