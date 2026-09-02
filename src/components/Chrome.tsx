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
      {/* =====================================================
          TOP BAR
      ===================================================== */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex h-[70px] items-center bg-gradient-to-b from-bg/95 via-bg/65 to-transparent px-4">

        {/* LOGO + TITLE */}
        <div className="pointer-events-auto flex items-center gap-3">

          {/* 3 LOGOS */}
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

          {/* TITLE */}
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

        {/* LANGUAGE */}
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


      {/* =====================================================
          BASEMAP CONTROL
      ===================================================== */}
      <div className="pointer-events-auto absolute right-4 top-[198px] z-[30]">

        {/* BASEMAP BUTTON */}
        <button
          type="button"
          onClick={() => setBasemapOpen((prev) => !prev)}
          title="Basemap"
          aria-label="Basemap"
          className={`flex h-[32px] w-[32px] items-center justify-center rounded-[7px] border border-stroke bg-panel text-ink shadow-[0_4px_12px_rgba(0,0,0,.35)] transition-all hover:bg-panel ${
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


        {/* =================================================
            BASEMAP POPUP
        ================================================== */}
        {basemapOpen && (
          <div className="absolute right-0 top-[39px] w-[195px] overflow-hidden rounded-[12px] border border-stroke bg-panel shadow-[0_14px_40px_rgba(0,0,0,.45)]">

            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-strokeSoft px-3 py-2.5">

              <div>
                <div className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-ink">
                  BASEMAP
                </div>

                <div className="mt-0.5 text-[9px] text-muted">
                  {lang === "id"
                    ? "Pilih tampilan peta"
                    : "Choose map style"}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setBasemapOpen(false)}
                className="flex h-5 w-5 items-center justify-center rounded-md text-[15px] leading-none text-muted transition-colors hover:bg-white/5 hover:text-ink"
              >
                ×
              </button>
            </div>


            {/* BASEMAP OPTIONS */}
            <div className="p-1">

              {BASEMAPS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    setBasemap(b.id);
                    setBasemapOpen(false);
                  }}
                  className={`group flex w-full items-center gap-1.5 rounded-[8px] px-1.5 py-1.5 text-left transition-all ${
                    basemap === b.id
                      ? "bg-teal/20 text-ink"
                      : "text-ink hover:bg-white/5"
                  }`}
                >

                  {/* ICON */}
                  <div
                    className={`flex h-[25px] w-[25px] flex-none items-center justify-center rounded-[6px] border ${
                      basemap === b.id
                        ? "border-teal/50 bg-teal/15"
                        : "border-stroke bg-white/[0.03]"
                    }`}
                  >
                    {b.id === "sat" ? (
                      <span className="text-[11px]">🛰️</span>
                    ) : b.id === "ortho" ? (
                      <span className="text-[11px]">▦</span>
                    ) : b.id === "streets" ? (
                      <span className="text-[11px]">🛣️</span>
                    ) : b.id === "topo" ? (
                      <span className="text-[11px]">⛰️</span>
                    ) : (
                      <span className="text-[11px]">🗺️</span>
                    )}
                  </div>


                  {/* NAME */}
                  <div className="min-w-0 flex-1">

                    <div className="truncate text-[10.5px] font-semibold leading-tight">
                      {t(b.labelKey)}
                    </div>

                    {basemap === b.id && (
                      <div className="mt-[1px] text-[8px] font-medium text-teal">
                        {lang === "id" ? "Aktif" : "Active"}
                      </div>
                    )}

                  </div>


                  {/* CHECK */}
                  {basemap === b.id && (
                    <div className="flex h-[17px] w-[17px] flex-none items-center justify-center rounded-full bg-teal text-white">

                      <svg
                        width="9"
                        height="9"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path d="M5 12l4 4L19 7" />
                      </svg>

                    </div>
                  )}

                </button>
              ))}

            </div>
          </div>
        )}
      </div>
    </>
  );
}
export function Legend() {
  const { t } = useI18n();
  const { visible } = useMapStore();
  const [open, setOpen] = useState(true);

  const items = GROUPS
    .flatMap((g) => g.layers)
    .flatMap((layer) => {
      // Parent dengan children
      if (layer.children?.length) {
        return layer.children.filter(
          (child) => child.legend && visible[child.id]
        );
      }

      // Layer biasa
      return layer.legend && visible[layer.id]
        ? [layer]
        : [];
    });

  return (
    <div className="absolute bottom-[65px] right-4 z-[15] w-[210px] overflow-hidden rounded-[14px] border border-stroke bg-panel/90 shadow-[0_14px_40px_rgba(0,0,0,.4)] backdrop-blur-xl max-md:hidden">

      {/* HEADER */}
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between border-b border-strokeSoft px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-wide text-muted"
      >
        {t("legend")}
        <span>{open ? "▾" : "▸"}</span>
      </button>

      {/* CONTENT */}
      {open && (
        <div className="max-h-[55vh] overflow-y-auto px-3.5 pb-3 pt-2.5">
          <div className="flex flex-col gap-2.5">

            {items.map((l) => (
              <div
                key={l.id}
                className="flex items-center gap-2.5 text-[12px] text-ink"
              >

                {/* ICON LAYER */}
                {l.icon ? (
                  <span className="flex h-[24px] w-[24px] flex-none items-center justify-center">
                    <img
                      src={l.icon}
                      alt=""
                      className="max-h-[24px] max-w-[24px] object-contain"
                    />
                  </span>
                ) : l.legend?.line ? (
                  /* LINE / DASHED LINE */
                  <span className="flex h-[24px] w-[24px] flex-none items-center">
                    <svg
                      width="24"
                      height="12"
                      viewBox="0 0 24 12"
                      className="block"
                      style={{
                        opacity: l.legend.opacity ?? 1,
                      }}
                    >
                      <line
                        x1="1"
                        y1="6"
                        x2="23"
                        y2="6"
                        stroke={l.legend.color}
                        strokeWidth={Math.max(
                          1,
                          l.legend.width ?? 2
                        )}
                        strokeLinecap="butt"
                        strokeDasharray={
                          l.legend.dasharray
                            ? l.legend.dasharray.join(" ")
                            : undefined
                        }
                      />
                    </svg>
                  </span>
                ) : l.legend?.circle ? (
                  /* CIRCLE */
                  <span
                    className="h-[12px] w-[12px] flex-none rounded-full"
                    style={{
                      background: l.legend.color,
                      opacity: l.legend.opacity ?? 1,
                    }}
                  />
                ) : (
                  /* FILL */
                  <span
                    className="h-[13px] w-[18px] flex-none rounded-[2px]"
                    style={{
                      background: l.legend?.color,
                      opacity: l.legend?.opacity ?? 1,
                      border:
                        l.kind === "fill"
                          ? `1px solid ${l.legend?.color}`
                          : undefined,
                    }}
                  />
                )}

                {t(l.nameKey)}
              </div>
            ))}

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
