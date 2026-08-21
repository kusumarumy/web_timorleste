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
// Tombol pengukuran berada di ControlPanel.
// MapTools hanya menjalankan MeasureControl dan menampilkan hasil.
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
} from "./toolMode";

import "./geo-tools.css";

// ============================================================================
// LAYER YANG BISA DI-IDENTIFY
// ============================================================================

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

// ============================================================================
// FAKTOR SKALA
// 1 = nilai grid UTM
// ============================================================================

const GROUND_K = 1;

// ============================================================================
// COMPONENT
// ============================================================================

export default function MapTools({ map }) {
  const identifyRef = useRef(null);
  const measureRef = useRef(null);

  const [tool, setTool] = useState(getToolMode());
  const [result, setResult] = useState(null);

  // ========================================================================
  // INIT
  // ========================================================================

  useEffect(() => {
    if (!map) return;

    console.log("MapTools initialized");

    // ----------------------------------------------------------
    // IDENTIFY
    // ----------------------------------------------------------

    identifyRef.current = new IdentifyControl(map, {
      layerIds: INTERACTIVE_LAYERS,

      labelFn: (key) =>
        key.replace(/_/g, " "),
    });

    // ----------------------------------------------------------
    // MEASUREMENT
    // ----------------------------------------------------------

    measureRef.current = new MeasureControl(map, {
      scaleFactor: GROUND_K,

      onResult: (value) => {
        console.log("MEASURE RESULT:", value);
        setResult(value);
      },
    });

    // ----------------------------------------------------------
    // CLEANUP
    // ----------------------------------------------------------

    return () => {
      console.log("MapTools cleanup");

      identifyRef.current?.disable();

      measureRef.current?.stop();

      measureRef.current?.clear();
    };
  }, [map]);

  // ========================================================================
  // DENGARKAN TOOL MODE DARI CONTROL PANEL
  // ========================================================================

  useEffect(() => {
    if (!map) return;

    const unsubscribe = onToolMode((next) => {
      console.log("TOOL MODE:", next);

      setTool(next);

      // ----------------------------------------------------------
      // MATIKAN TOOL SEBELUMNYA
      // ----------------------------------------------------------

      identifyRef.current?.disable();

      measureRef.current?.stop();

      measureRef.current?.clear();

      setResult(null);

      // Tidak ada tool aktif
      if (!next) {
        return;
      }

      // ----------------------------------------------------------
      // IDENTIFY
      // ----------------------------------------------------------

      if (next === "identify") {
        identifyRef.current?.enable();
        return;
      }

      // ----------------------------------------------------------
      // JARAK
      // ----------------------------------------------------------

      if (next === "distance") {
        measureRef.current?.start("distance");
        return;
      }

      // ----------------------------------------------------------
      // PANJANG
      // LEBAR
      // LUAS
      //
      // Ketiganya menggunakan mode polygon/area.
      // MeasureControl menghitung:
      // - area
      // - perimeter
      // - length
      // - width
      // ----------------------------------------------------------

      if (
        next === "length" ||
        next === "width" ||
        next === "area"
      ) {
        measureRef.current?.start("area");
        return;
      }
    });

    return unsubscribe;
  }, [map]);

  // ========================================================================
  // HASIL PENGUKURAN
  // ========================================================================

  if (!result) {
    return null;
  }

  return (
    <div
      className="geo-measure"
      style={{
        position: "absolute",
        top: 60,
        right: 16,
        zIndex: 20,
      }}
    >
      {/* ================================================================
          JARAK
      ================================================================ */}

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

      {/* ================================================================
          PANJANG
      ================================================================ */}

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

      {/* ================================================================
          LEBAR
      ================================================================ */}

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

      {/* ================================================================
          LUAS
      ================================================================ */}

      {tool === "area" &&
        result.mode === "area" &&
        result.area != null && (
          <div className="geo-measure__row">
            <span className="lbl">
              Luas
            </span>

            <span className="val">
              {fmtArea(result.area)}
            </span>
          </div>
        )}

      {/* ================================================================
          PETUNJUK
      ================================================================ */}

      <div className="geo-measure__hint">
        Klik untuk menambah titik · double-click /
        Enter untuk selesai · Esc untuk batal
      </div>

      {/* ================================================================
          CRS
      ================================================================ */}

      <div className="geo-measure__crs">
        EPSG:32751 ·{" "}
        {result.k === 1
          ? "nilai grid UTM"
          : `ground (k=${result.k})`}
      </div>
    </div>
  );
}
