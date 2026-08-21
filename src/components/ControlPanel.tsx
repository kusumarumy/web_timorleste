"use client";

import { useEffect, useState } from "react";
import { GROUPS, LayerDef } from "@/lib/config";
import { useMapStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { setToolMode, getToolMode, onToolMode } from "./toolMode";

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={`relative h-[19px] w-[34px] flex-none rounded-full transition-colors ${on ? "bg-teal" : "bg-stroke"}`}
    >
      <span className={`absolute top-[2px] h-[13px] w-[13px] rounded-full transition-all ${on ? "left-[19px] bg-[#04171a]" : "left-[2px] bg-muted"}`} />
    </button>
  );
}

function LayerRow({ l }: { l: LayerDef }) {
  const { t } = useI18n();

  const {
    visible,
    toggle,
    opacity,
    setOpacity,
    subVisible,
    toggleSub,
  } = useMapStore();

  const on = visible[l.id];
  const sw = l.legend;

  return (
    <div>
      {/* Layer utama */}
      <div className="group flex items-center gap-2.5 rounded-[10px] px-2 py-2 transition-colors hover:bg-teal/[0.07]">
        <Toggle on={on} onClick={() => toggle(l.id)} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-ink">

            {/* =========================
                SYMBOL / ICON LAYER
                ========================= */}
            {l.icon ? (
              <span className="flex h-[24px] w-[24px] flex-none items-center justify-center">
                <img
                  src={l.icon}
                  alt=""
                  className="max-h-[24px] max-w-[24px] object-contain"
                />
              </span>
            ) : sw ? (
              /* =========================
                 FALLBACK LEGEND COLOR
                 ========================= */
              <span
                className="inline-block h-[11px] w-[11px] flex-none rounded-[3px]"
                style={
                  sw.line
                    ? {
                        background: "none",
                        borderTop: `3px solid ${sw.color}`,
                        height: 0,
                        borderRadius: 0,
                      }
                    : sw.circle
                    ? {
                        background: sw.color,
                        borderRadius: "9999px",
                      }
                    : {
                        background: sw.color,
                      }
                }
              />
            ) : null}

            {t(l.nameKey)}
          </div>

          {l.subKey && (
            <div className="mt-0.5 text-[10.5px] text-muted2">
              {t(l.subKey)}
            </div>
          )}
        </div>

        {l.opacityProp != null && (
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={opacity[l.id] ?? 1}
            onChange={(e) => setOpacity(l.id, +e.target.value)}
            className="h-[3px] w-16 flex-none accent-teal"
          />
        )}
      </div>

      {/* SUBCLASS */}
      {l.sublayers && on && (
        <div className="ml-10 mb-2 mt-0.5 space-y-0.5 border-l border-strokeSoft pl-3">
          {l.sublayers.map((sub) => (
            <label
              key={sub.id}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-[11.5px] text-muted hover:bg-teal/[0.07]"
            >
              <input
                type="checkbox"
                checked={subVisible[sub.id] ?? true}
                onChange={() => toggleSub(sub.id)}
                className="h-3.5 w-3.5 accent-teal"
              />

              <span>{t(sub.labelKey)}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function TerrainControl() {
  const { t } = useI18n();
  const {
    terrainSource,
    setTerrainSource,
    exaggeration,
    setExaggeration,
  } = useMapStore();

  // hanya AWS Terrarium yang boleh diatur elevasinya
  const adjustable = terrainSource === "aws";

  const options: { id: "off" | "aws" | "r2"; label: string }[] = [
    { id: "off", label: "Nonaktif" },
    { id: "aws", label: "AWS Terrarium" },
    { id: "r2", label: "DEM Pengukuran" },
  ];

  return (
    <div className="m-1.5 rounded-xl border border-strokeSoft bg-gradient-to-br from-teal/10 to-teal/[0.02] p-3">
      {/* Judul */}
      <div className="flex items-center gap-2 text-[13px] font-bold text-ink">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#2FA6A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 20l6-12 4 7 3-5 5 10z" />
        </svg>
        {t("terrain")}
      </div>

      {/* 3 pilihan sumber DEM */}
      <div className="mt-2.5 flex gap-1 rounded-[10px] border border-stroke bg-bg/40 p-[3px]">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setTerrainSource(opt.id)}
            className={`flex-1 rounded-lg px-2 py-1.5 text-[11px] font-semibold transition-colors ${
              terrainSource === opt.id
                ? "bg-teal text-[#04171a]"
                : "text-muted hover:text-ink"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Slider elevasi — hanya saat DEM aktif */}
      {terrainSource !== "off" && (
        <div className={`mt-3 ${adjustable ? "" : "opacity-40"}`}>
          <div className="flex items-center gap-2.5">
            <span className="w-16 text-[10.5px] text-muted">{t("exagg")}</span>
            <input
              type="range"
              min={0}
              max={3}
              step={0.1}
              value={adjustable ? exaggeration : 1}
              disabled={!adjustable}
              onChange={(e) => setExaggeration(+e.target.value)}
              className="h-[3px] flex-1 accent-teal disabled:cursor-not-allowed"
            />
            <b className="w-7 text-right text-[11px] text-teal">
              {adjustable ? exaggeration.toFixed(1) : "1.0"}×
            </b>
          </div>

          {!adjustable && (
            <p className="mt-1.5 text-[10px] leading-snug text-muted2">
              Elevasi DEM pengukuran terkunci pada skala asli (1×).
            </p>
          )}
        </div>
      )}
    </div>
  );
}
function MeasurementControl() {
  const [active, setActive] = useState(getToolMode());

  useEffect(() => {
    return onToolMode((mode) => {
      setActive(mode);
    });
  }, []);

  const activate = (
    mode: "length" | "width" | "area" | "distance"
  ) => {
    if (active === mode) {
      setToolMode(null);
      return;
    }

    setToolMode(mode);
  };

  const buttonClass = (
    mode: "length" | "width" | "area" | "distance"
  ) =>
    `flex items-center gap-2 rounded-lg border px-2.5 py-2.5 transition-colors ${
      active === mode
        ? "border-teal/50 bg-teal text-[#04171a]"
        : "border-stroke bg-bg/30 text-muted hover:border-teal/30 hover:bg-teal/[0.07] hover:text-ink"
    }`;

  return (
    <div className="m-1.5 mt-2 rounded-xl border border-strokeSoft bg-gradient-to-br from-teal/10 to-teal/[0.02] p-3">

      {/* HEADER */}
      <div className="flex items-center gap-2 text-[13px] font-bold text-ink">
        <svg
          viewBox="0 0 24 24"
          width="15"
          height="15"
          fill="none"
          stroke="#2FA6A0"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 20L20 4" />
          <path d="M7 17l-3 3" />
          <path d="M17 7l3-3" />
          <path d="M8 16l-2-2" />
          <path d="M11 13l-2-2" />
          <path d="M14 10l-2-2" />
        </svg>

        <span>Pengukuran</span>
      </div>

      {/* 4 TOOLS */}
      <div className="mt-2.5 grid grid-cols-2 gap-1.5">

        {/* JARAK */}
        <button
          type="button"
          onClick={() => activate("distance")}
          className={buttonClass("distance")}
          aria-pressed={active === "distance"}
        >
          <span className="text-[15px]">📏</span>

          <span className="text-[11px] font-semibold">
            Jarak
          </span>
        </button>

        {/* PANJANG */}
        <button
          type="button"
          onClick={() => activate("length")}
          className={buttonClass("length")}
          aria-pressed={active === "length"}
        >
          <span className="text-[15px]">↔</span>

          <span className="text-[11px] font-semibold">
            Panjang
          </span>
        </button>

        {/* LEBAR */}
        <button
          type="button"
          onClick={() => activate("width")}
          className={buttonClass("width")}
          aria-pressed={active === "width"}
        >
          <span className="text-[15px]">↕</span>

          <span className="text-[11px] font-semibold">
            Lebar
          </span>
        </button>

        {/* LUAS */}
        <button
          type="button"
          onClick={() => activate("area")}
          className={buttonClass("area")}
          aria-pressed={active === "area"}
        >
          <span className="text-[15px]">▱</span>

          <span className="text-[11px] font-semibold">
            Luas
          </span>
        </button>

      </div>

      <p className="mt-2 text-[10px] leading-snug text-muted2">
  {active ? (
    <>
      Klik titik ·{" "}
      <b className="text-teal">Double klik</b> selesai ·{" "}
      <b className="text-teal">Esc</b> batal
    </>
  ) : (
    "Pilih salah satu alat pengukuran."
  )}
</p>
    </div>
  );
}
export default function ControlPanel() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Tombol buka panel */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="absolute left-4 top-[70px] z-[15] flex items-center gap-2 rounded-xl border border-stroke bg-panel/90 px-3.5 py-2.5 text-[12px] font-bold text-ink shadow-[0_8px_25px_rgba(0,0,0,.35)] backdrop-blur-xl transition-colors hover:bg-panel"
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Panel kontrol */}
      {open && (
        <aside className="absolute bottom-11 left-4 top-[70px] z-[15] flex w-[312px] flex-col overflow-hidden rounded-2xl border border-stroke bg-panel/90 shadow-[0_18px_50px_rgba(0,0,0,.45)] backdrop-blur-xl max-md:inset-x-2.5 max-md:bottom-auto max-md:top-16 max-md:max-h-[52%] max-md:w-auto">

          {/* Header */}
          <div className="border-b border-strokeSoft px-4 pb-2.5 pt-3.5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10.5px] font-bold uppercase tracking-[1.4px] text-teal">
                  {t("eyebrow")}
                </div>

                <p className="mt-1.5 text-[11.5px] leading-snug text-muted">
                  {t("panelsub")}
                </p>
              </div>

              <button
                onClick={() => setOpen(false)}
                aria-label="Close panel"
                className="ml-3 rounded-lg px-2 py-1 text-lg leading-none text-muted transition-colors hover:bg-stroke hover:text-ink"
              >
                ×
              </button>
            </div>
          </div>

          {/* Isi panel */}
          <div className="flex-1 overflow-y-auto px-2 pb-3 pt-1.5">
            <TerrainControl />
<MeasurementControl />
            {GROUPS.map((g) => (
              <div key={g.titleKey} className="mx-1.5 mb-1 mt-2">
                <div className="flex items-center gap-2 px-1.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-muted2">
                  <span
                    className="h-[7px] w-[7px] rounded-[2px]"
                    style={{ background: g.dot }}
                  />
                  {t(g.titleKey)}
                </div>

                {g.layers.map((l) => (
                  <LayerRow key={l.id} l={l} />
                ))}
              </div>
            ))}
          </div>
        </aside>
      )}
    </>
  );
}
