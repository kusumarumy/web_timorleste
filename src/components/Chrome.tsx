"use client";

import { useState } from "react";
import { BASEMAPS, GROUPS } from "@/lib/config";
import { useMapStore } from "@/lib/store";
import { useI18n, Lang } from "@/lib/i18n";

export function TopBar() {
  const { t, lang, setLang } = useI18n();
  const { basemap, setBasemap } = useMapStore();

  const [basemapOpen, setBasemapOpen] = useState(false);

  const langs: Lang[] = ["id", "en", "pt"];

  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex h-[70px] items-center bg-gradient-to-b from-bg/95 via-bg/65 to-transparent px-4">
        <div className="pointer-events-auto flex items-center gap-3">
          <div className="flex h-[42px] items-center gap-1">
            <img
              src="/icons/1.png"
              alt=""
              className="h-[32px] w-[32px] object-contain"
            />
            <img
              src="/icons/2.png"
              alt=""
              className="h-[32px] w-[32px] object-contain"
            />
            <img
              src="/icons/3.png"
              alt=""
              className="h-[32px] w-[32px] object-contain"
            />
          </div>
          <div className="leading-none">
            <h1 className="font-display text-[17px] font-semibold tracking-[-0.02em] text-white">
              {t("title")}
            </h1>
            <span className="mt-1.5 block text-[10.5px] font-medium uppercase tracking-[0.12em] text-white/60 max-md:hidden">
              {t("sub")}
            </span>
          </div>
        </div>
        <div className="flex-1" />
        <div className="pointer-events-auto flex gap-0.5 rounded-[9px] border border-stroke bg-white/85 p-[3px] backdrop-blur-md">
          {langs.map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`rounded-[6px] px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wide transition-colors ${
                lang === l
                  ? "bg-teal text-ink shadow-[0_1px_5px_rgba(47,166,160,.4)]"
                  : "text-black/70 hover:text-ink"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="pointer-events-auto absolute right-[10px] top-[198px] z-[30]">
        <button
          type="button"
          onClick={() => setBasemapOpen((prev) => !prev)}
          title="Basemap"
          aria-label="Basemap"
          className={`flex h-[32px] w-[32px] items-center justify-center rounded-[7px] border border-stroke bg-white text-[#26343b] shadow-[0_3px_10px_rgba(0,0,0,.18)] transition-all hover:bg-white ${
            basemapOpen ? "ring-2 ring-teal/40" : ""
          }`}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3z" />
            <path d="M9 3v15" />
            <path d="M15 6v15" />
          </svg>
        </button>

{basemapOpen && (
  <div className="absolute right-0 top-[39px] w-[310px] rounded-[16px] border border-[#e1e5e8] bg-white p-2.5 shadow-[0_10px_30px_rgba(0,0,0,.25)]">

    <div className="grid grid-cols-2 gap-2.5">

      {BASEMAPS.map((b) => {
        const isActive = basemap === b.id;

        return (
          <button
            key={b.id}
            type="button"
            onClick={() => {
              setBasemap(b.id);
              setBasemapOpen(false);
            }}
            className={`flex h-[88px] w-full flex-col items-center justify-center rounded-[11px] border bg-white transition-all ${
              isActive
                ? "border-teal shadow-[0_0_0_1px_rgba(47,166,160,.25)]"
                : "border-[#d9dee3] hover:border-teal/60 hover:bg-[#f8fafb]"
            }`}
          >

            {/* ICON */}
            <div className="mb-1.5 flex h-[34px] w-[34px] items-center justify-center">
              {b.id === "sat" ? (
                <span className="text-[25px]">🛰️</span>
              ) : b.id === "ortho" ? (
                <span className="text-[25px]">📷</span>
              ) : b.id === "streets" ? (
                <span className="text-[25px]">🚗</span>
              ) : b.id === "topo" ? (
                <span className="text-[25px]">⛰️</span>
              ) : (
                <span className="text-[25px]">🌎</span>
              )}
            </div>

            {/* NAME */}
            <span className="max-w-[125px] truncate text-center text-[12px] font-medium leading-tight text-[#26343b]">
              {t(b.labelKey)}
            </span>

          </button>
        );
      })}

    </div>
  </div>
)}
      </div>
    </>
  );
}
export function Legend() {
  const { t } = useI18n();
  const { visible, subVisible } = useMapStore();
  const [open, setOpen] = useState(true);

  return (
    <div className="absolute bottom-[65px] right-4 z-[15] w-[210px] overflow-hidden rounded-[14px] border border-stroke bg-panel/90 shadow-[0_14px_40px_rgba(0,0,0,.4)] backdrop-blur-xl max-md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between border-b border-strokeSoft px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-wide text-muted"
      >
        {t("legend")}
        <span>{open ? "▾" : "▸"}</span>
      </button>

      {open && (
        <div className="max-h-[55vh] overflow-y-auto px-3.5 pb-3 pt-2.5">
          <div className="flex flex-col gap-2.5">
  {GROUPS.flatMap((g) => g.layers).map((layer) => {
    if (layer.children?.length) {
     return layer.children
  .filter((child) => visible[child.id])
  .map((child) => {
    if (!child.legend) return null;

    return (
      <div
        key={child.id}
        className="flex items-center gap-2.5 text-[12px] text-ink"
      >
        {child.icon ? (
          <span className="flex h-[24px] w-[24px] flex-none items-center justify-center">
            <img
              src={child.icon}
              alt=""
              className="max-h-[24px] max-w-[24px] object-contain"
            />
          </span>
        ) : child.legend.line ? (
          <span className="flex h-[24px] w-[24px] flex-none items-center">
            <svg
              width="24"
              height="12"
              viewBox="0 0 24 12"
              className="block"
              style={{
                opacity: child.legend.opacity ?? 1,
              }}
            >
              <line
                x1="1"
                y1="6"
                x2="23"
                y2="6"
                stroke={child.legend.color}
                strokeWidth={Math.max(
                  1,
                  child.legend.width ?? 2
                )}
                strokeLinecap="butt"
                strokeDasharray={
                  child.legend.dasharray
                    ? child.legend.dasharray.join(" ")
                    : undefined
                }
              />
            </svg>
          </span>
        ) : child.legend.circle ? (
          <span
            className="h-[12px] w-[12px] flex-none rounded-full"
            style={{
              background: child.legend.color,
              opacity: child.legend.opacity ?? 1,
            }}
          />
        ) : (
          <span
            className="h-[13px] w-[18px] flex-none rounded-[2px]"
            style={{
              background: child.legend.color,
              opacity: child.legend.opacity ?? 1,
              border:
                child.kind === "fill"
                  ? `1px solid ${child.legend.color}`
                  : undefined,
            }}
          />
        )}

        {t(child.nameKey)}
      </div>
    );
  });
    }

    // ==========================================
    // 10 IRRIGATION AREAS + 10 DI
    // ==========================================
    if (layer.sublayers?.length && visible[layer.id]) {
      return (
        <div
          key={layer.id}
          className="flex flex-col gap-2"
        >
          {/* PARENT */}
          <div className="flex items-center gap-2.5 text-[12px] font-semibold text-ink">
            <span
              className="h-[13px] w-[18px] flex-none rounded-[2px]"
              style={{
                backgroundColor: "#66BB6A",
                opacity: 0.25,
                border: "1px solid #2E7D32",
              }}
            />

            <span className="truncate">
              {t(layer.nameKey)}
            </span>
          </div>

          {/* DI */}
<div className="ml-5 flex flex-col gap-1.5">
  {layer.sublayers
    .filter(
      (sub) => subVisible[sub.id] ?? true
    )
    .map((sub) => (
      <div
        key={sub.id}
        className="flex items-center gap-2 text-[11px] text-ink"
      >
        <span
          className="h-[11px] w-[22px] flex-none rounded-[2px]"
          style={{
            backgroundColor: "#66BB6A",
            opacity: 0.25,
            border: `2px solid ${
              sub.outlineColor ?? "#2E7D32"
            }`,
          }}
        />

        <span className="truncate">
          {t(sub.labelKey)}
        </span>
      </div>
    ))}
</div>
        </div>
      );
    }

    // ==========================================
    // LAYER BIASA
    // ==========================================
    if (!layer.legend || !visible[layer.id]) {
      return null;
    }

    return (
      <div
        key={layer.id}
        className="flex items-center gap-2.5 text-[12px] text-ink"
      >
        {layer.icon ? (
          <span className="flex h-[24px] w-[24px] flex-none items-center justify-center">
            <img
              src={layer.icon}
              alt=""
              className="max-h-[24px] max-w-[24px] object-contain"
            />
          </span>
        ) : layer.legend.line ? (
          <span className="flex h-[24px] w-[24px] flex-none items-center">
            <svg
              width="24"
              height="12"
              viewBox="0 0 24 12"
              className="block"
              style={{
                opacity: layer.legend.opacity ?? 1,
              }}
            >
              <line
                x1="1"
                y1="6"
                x2="23"
                y2="6"
                stroke={layer.legend.color}
                strokeWidth={Math.max(
                  1,
                  layer.legend.width ?? 2
                )}
                strokeLinecap="butt"
                strokeDasharray={
                  layer.legend.dasharray
                    ? layer.legend.dasharray.join(" ")
                    : undefined
                }
              />
            </svg>
          </span>
        ) : layer.legend.circle ? (
          <span
            className="h-[12px] w-[12px] flex-none rounded-full"
            style={{
              background: layer.legend.color,
              opacity: layer.legend.opacity ?? 1,
            }}
          />
        ) : (
          <span
            className="h-[13px] w-[18px] flex-none rounded-[2px]"
            style={{
              background: layer.legend.color,
              opacity: layer.legend.opacity ?? 1,
              border:
                layer.kind === "fill"
                  ? `1px solid ${layer.legend.color}`
                  : undefined,
            }}
          />
        )}

        {t(layer.nameKey)}
      </div>
    );
  })}
</div>
        </div>
      )}
    </div>
  );
}


/* =====================================================
   STATUS BAR
===================================================== */

export function StatusBar() {
  const { t } = useI18n();
  const { lng, lat, zoom, pitch, bearing } = useMapStore();

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[14] flex h-8 items-center gap-4 bg-gradient-to-t from-bg/95 to-transparent px-4 text-[11.5px] text-muted [font-variant-numeric:tabular-nums]">

      <span>
        Lon{" "}
        <b className="text-ink">
          {lng != null ? lng.toFixed(5) : "—"}
        </b>{" "}
        · Lat{" "}
        <b className="text-ink">
          {lat != null ? lat.toFixed(5) : "—"}
        </b>
      </span>

      <span>
        {t("zoom")}{" "}
        <b className="text-ink">
          {zoom.toFixed(1)}
        </b>
      </span>

      <span>
        {t("pitch")}{" "}
        <b className="text-ink">
          {Math.round(pitch)}°
        </b>{" "}
        · {Math.round(bearing)}°
      </span>

      <div className="flex-1" />

      <span>{t("crs")}</span>
    </div>
  );
}


/* =====================================================
   LOADER
===================================================== */

export function Loader({ hidden }: { hidden: boolean }) {
  const { t } = useI18n();

  return (
    <div
      className={`absolute inset-0 z-40 grid place-items-center bg-bg transition-opacity duration-500 ${
        hidden
          ? "pointer-events-none opacity-0"
          : ""
      }`}
    >
      <div className="text-center">

        <div className="mx-auto mb-4 h-[46px] w-[46px] animate-spin rounded-full border-[3px] border-stroke border-t-teal" />

        <div className="mb-1.5 font-display text-[15px] font-semibold text-ink">
          {t("load")}
        </div>

        <p className="text-[12.5px] tracking-wide text-muted">
          {t("load2")}
        </p>

      </div>
    </div>
  );
}
