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

    console.log("MAPTOOLS: init controls");

    identifyRef.current = new IdentifyControl(map, {
      layerIds: INTERACTIVE_LAYERS,
      labelFn: (k) => k.replace(/_/g, " "),
    });

    measureRef.current = new MeasureControl(map, {
      scaleFactor: GROUND_K,
      onResult: setResult,
    });

    console.log("MAPTOOLS: MeasureControl siap");

    // ==========================================================
    // Kalau user sudah memilih tool sebelum MeasureControl siap
    // jalankan lagi tool tersebut.
    // ==========================================================

    const currentTool = getToolMode();

    if (currentTool) {
      console.log(
        "MAPTOOLS: current tool saat init =",
        currentTool
      );

      if (currentTool === "distance") {
        measureRef.current.start("distance");
      }

      if (
        currentTool === "length" ||
        currentTool === "width" ||
        currentTool === "area"
      ) {
        measureRef.current.start("area");
      }
    }

    return () => {
      identifyRef.current?.disable();

      measureRef.current?.stop();
      measureRef.current?.clear();

      identifyRef.current = null;
      measureRef.current = null;
    };
  }, [map]);

  // ============================================================
  // DENGARKAN TOOL MODE DARI CONTROL PANEL
  // ============================================================

  useEffect(() => {
    const unsubscribe = onToolMode((next) => {
      console.log("MAPTOOLS: tool mode =", next);

      setTool(next);

      // Matikan tool sebelumnya
      identifyRef.current?.disable();

      measureRef.current?.stop();
      measureRef.current?.clear();

      setResult(null);

      if (!next) return;

      // ========================================================
      // IDENTIFY
      // ========================================================

      if (next === "identify") {
        identifyRef.current?.enable();
        return;
      }

      // ========================================================
      // JARAK
      // ========================================================

      if (next === "distance") {
        console.log("MAPTOOLS: start distance");

        measureRef.current?.start("distance");
        return;
      }

      // ========================================================
      // PANJANG / LEBAR / LUAS
      // ========================================================

      if (
        next === "length" ||
        next === "width" ||
        next === "area"
      ) {
        console.log(
          "MAPTOOLS: start area →",
          next
        );

        measureRef.current?.start("area");
        return;
      }
    });

    return unsubscribe;
  }, []);

  // ============================================================
  // HASIL PENGUKURAN
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
              <div className="geo-measure__row">
                <span className="lbl">
                  Luas
                </span>

                <span className="val">
                  {fmtArea(result.area)}
                </span>
              </div>
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
