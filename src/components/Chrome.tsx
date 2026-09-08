"use client";

import { useEffect, useState } from "react";
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

        <div className="pointer-events-auto flex gap-0.5 rounded-[9px] border border-stroke bg-panel/90 p-[3px] backdrop-blur-md">
          {langs.map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`rounded-[6px] px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wide transition-colors ${
                lang === l
                  ? "bg-teal text-ink shadow-[0_1px_5px_rgba(47,166,160,.4)]"
                  : "text-white/70 hover:text-white"
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
          className={`flex h-[32px] w-[32px] items-center justify-center rounded-[7px] border border-stroke bg-panel/90 text-[#26343b] shadow-[0_3px_10px_rgba(0,0,0,.18)] transition-all hover:bg-[#22394A] ${
            basemapOpen ? "ring-2 ring-teal/40" : ""
          }`}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
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
          <div className="absolute right-0 top-[39px] w-[260px] rounded-[16px] border border-[#52616a] bg-[#142733] p-2.5 shadow-[0_14px_40px_rgba(0,0,0,.45)]">
            <div className="grid grid-cols-2 gap-1.5">
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
                    className={`flex h-[46px] w-full flex-col items-center justify-center rounded-[10px] border transition-all ${
                      isActive
                        ? "border-[#7ee7df] bg-[#2fa6a0] text-[#0b252b] shadow-[0_0_0_1px_rgba(126,231,223,.45),0_2px_8px_rgba(47,166,160,.35)]"
                        : "border-[#304650] bg-[#10232d] text-[#a5b6be] hover:border-[#4fc5bd] hover:bg-[#18333d]"
                    }`}
                  >
                    <div className="mb-0.5 flex h-[24px] w-[24px] items-center justify-center">
                      {b.id === "sat" ? (
                        <span className="text-[22px]">🛰️</span>
                      ) : b.id === "ortho" ? (
                        <span className="text-[22px]">▦</span>
                      ) : b.id === "streets" ? (
                        <span className="text-[22px]">🛣️</span>
                      ) : b.id === "opentopo" ? (
                        <span className="text-[22px]">⛰️</span>
                      ) : b.id === "hybrid" ? (
                        <span className="text-[22px]">🌍</span>
                      ) : (
                        <span className="text-[22px]">🗺️</span>
                      )}
                    </div>

                    <span className="max-w-[115px] truncate text-center text-[11px] font-semibold leading-tight">
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

/* ============================================================
   LEGEND
   TIDAK DIUBAH
============================================================ */

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
              /* CHILD LAYERS */
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

              /* SUBLAYERS + KETERANGAN */
              if (layer.sublayers?.length && visible[layer.id]) {
                return (
                  <div
                    key={layer.id}
                    className="flex flex-col gap-2"
                  >
                    {/* MAIN LAYER */}
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

                    {/* KELAS_DI */}
                    <div className="ml-5 flex flex-col gap-1.5">
                      {layer.sublayers
                        .filter(
                          (sub) =>
                            subVisible[sub.id] ?? true
                        )
                        .map((sub) => (
                          <div
                            key={sub.id}
                            className="flex flex-col gap-1"
                          >
                            <div className="flex items-center gap-2 text-[11px] text-ink">
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

                            {sub.sublayers?.length ? (
                              <div className="ml-5 flex flex-col gap-1">
                                {sub.sublayers
                                  .filter(
                                    (status) =>
                                      subVisible[status.id] ?? true
                                  )
                                  .map((status) => (
                                    <div
                                      key={status.id}
                                      className="flex items-center gap-2 text-[10px] text-muted"
                                    >
                                      <span className="h-[5px] w-[5px] flex-none rounded-full bg-muted/70" />

                                      <span className="truncate">
                                        {t(status.labelKey)}
                                      </span>
                                    </div>
                                  ))}
                              </div>
                            ) : null}
                          </div>
                        ))}
                    </div>
                  </div>
                );
              }

              /* NORMAL LAYER */
              if (
                !layer.legend ||
                !visible[layer.id]
              ) {
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

/* ============================================================
   STATUS BAR
   TIDAK DIUBAH
============================================================ */

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

/* ============================================================
   LOADER
   CINEMATIC AINARO - BELULIK
============================================================ */

export function Loader({ hidden }: { hidden: boolean }) {
  const { t } = useI18n();

  const [phase, setPhase] = useState(0);
  const [logoIntroDone, setLogoIntroDone] = useState(false);
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [introReady, setIntroReady] = useState(false);

  const phases = [
    t("loadPhase1"),
    t("loadPhase2"),
    t("loadPhase3"),
    t("loadPhase4"),
  ];

  /* ==========================================================
     INTRO TIMING
  ========================================================== */

  useEffect(() => {
    setLogoIntroDone(false);
    setWelcomeVisible(false);
    setIntroReady(false);
    setPhase(0);

    const logoTimer = setTimeout(() => {
      setLogoIntroDone(true);
    }, 2200);

    const welcomeTimer = setTimeout(() => {
      setWelcomeVisible(true);
    }, 2550);

    /*
      Jangan izinkan Loader hilang sebelum
      sequence intro selesai.
    */
    const introReadyTimer = setTimeout(() => {
      setIntroReady(true);
    }, 3000);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(welcomeTimer);
      clearTimeout(introReadyTimer);
    };
  }, []);

  /* ==========================================================
     LOADING PHASE ROTATION
  ========================================================== */

  useEffect(() => {
    if (!welcomeVisible) return;

    const interval = setInterval(() => {
      setPhase((prev) => (prev + 1) % phases.length);
    }, 1800);

    return () => clearInterval(interval);
  }, [welcomeVisible, phases.length]);

  return (
    <div
      className={`absolute inset-0 z-40 overflow-hidden bg-[#06151E] transition-all duration-1000 ${
        hidden && introReady
          ? "pointer-events-none opacity-0"
          : "opacity-100"
      }`}
    >
     {/* ======================================================
    CINEMATIC BACKGROUND
====================================================== */}

<div className="pointer-events-none absolute inset-0 overflow-hidden">

  {/* ==================================================
      AINARO – BELULIK LANDSCAPE
  ================================================== */}

  <img
    src="/icons/loading.png"
    alt=""
    className="absolute inset-0 h-full w-full object-cover"
    style={{
      filter:
        "brightness(.48) saturate(.82) contrast(1.08)",
    }}
  />

  {/* ==================================================
      DEEP CINEMATIC OVERLAY
  ================================================== */}

  <div className="absolute inset-0 bg-[#03131B]/42" />

  {/* ==================================================
      CENTRAL TEAL ATMOSPHERE
  ================================================== */}

  <div
    className="absolute left-1/2 top-[43%] h-[650px] w-[850px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal/[0.08] blur-[140px]"
    style={{
      animation:
        "geoAtmosphere 7s ease-in-out infinite",
    }}
  />

  {/* ==================================================
      SPATIAL GRID
  ================================================== */}

  <div
    className="absolute inset-0 opacity-[0.035]"
    style={{
      backgroundImage:
        "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
      backgroundSize: "70px 70px",
    }}
  />

  {/* ==================================================
      CENTER FOCUS
  ================================================== */}

  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent_15%,rgba(2,10,15,.12)_48%,rgba(2,8,12,.72)_100%)]" />

  {/* ==================================================
      BOTTOM CINEMATIC FADE
  ================================================== */}

  <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-[#06151E] via-[#06151E]/65 to-transparent" />

  {/* ==================================================
      TOP CINEMATIC FADE
  ================================================== */}

  <div className="absolute inset-x-0 top-0 h-[24%] bg-gradient-to-b from-[#06151E]/60 to-transparent" />

</div>
      {/* ======================================================
          SPATIAL LOCATION HUD
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 z-[5]">

        {/* AINARO */}
        <div className="absolute left-7 top-7 md:left-12 md:top-10">
          <div className="flex items-start gap-2">

            <div className="mt-[3px] text-[13px] text-teal">
              ●
            </div>

            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70">
                Ainaro
              </div>

              <div className="mt-0.5 text-[8px] uppercase tracking-[0.18em] text-white/35">
                Timor Leste
              </div>
            </div>

          </div>

          <div className="mt-4 h-px w-[28px] bg-teal/60" />
        </div>

        {/* COORDINATES */}
        <div className="absolute right-7 top-7 text-right md:right-12 md:top-10">

          <div className="text-[8px] uppercase tracking-[0.16em] text-white/30">
            LOCATION
          </div>

          <div className="mt-1 text-[9px] font-medium tracking-[0.12em] text-white/55">
            8.6167° S
          </div>

          <div className="text-[9px] font-medium tracking-[0.12em] text-white/55">
            125.5833° E
          </div>
        </div>

        {/* CROSSHAIR */}
        <div className="absolute right-[12%] top-[15%] hidden h-9 w-9 items-center justify-center md:flex">

          <div className="absolute h-px w-full bg-teal/35" />
          <div className="absolute h-full w-px bg-teal/35" />

          <div className="h-2 w-2 rounded-full border border-teal/80" />

          <div className="absolute -right-1 -top-1 h-2 w-2 border-r border-t border-teal/50" />
          <div className="absolute -bottom-1 -left-1 h-2 w-2 border-b border-l border-teal/50" />
        </div>

        {/* LEFT TARGET */}
        <div className="absolute left-[8%] top-[34%] hidden md:block">
          <div className="h-2 w-2 rounded-full bg-teal shadow-[0_0_12px_rgba(47,166,160,.8)]" />

          <div className="absolute left-3 top-1 h-px w-[55px] bg-teal/20" />
        </div>

        {/* RIGHT TARGET */}
        <div className="absolute right-[21%] top-[30%] hidden md:block">
          <div className="h-1.5 w-1.5 rounded-full bg-teal/60 shadow-[0_0_10px_rgba(47,166,160,.7)]" />
        </div>

        {/* BOTTOM LEFT */}
        <div className="absolute bottom-10 left-7 md:left-12">
          <div className="text-[8px] uppercase tracking-[0.24em] text-white/25">
            Ainaro
          </div>

          <div className="text-[8px] uppercase tracking-[0.24em] text-white/20">
            Timor Leste
          </div>

          <div className="mt-2 h-px w-[28px] bg-teal/60" />
        </div>

        {/* BOTTOM RIGHT */}
        <div className="absolute bottom-10 right-7 text-right md:right-12">

          <div className="text-[8px] uppercase tracking-[0.2em] text-white/25">
            AIR UNTUK TANAH
          </div>

          <div className="mt-0.5 text-[8px] uppercase tracking-[0.2em] text-white/20">
            TANAH UNTUK HIDUP
          </div>

          <div className="mt-2 ml-auto h-px w-[28px] bg-teal/60" />
        </div>
      </div>

      {/* ======================================================
          FLOATING DATA POINTS
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 z-[6]">

        <span
          className="absolute left-[18%] top-[25%] h-1 w-1 rounded-full bg-teal/70"
          style={{
            animation:
              "geoDataFloat 4s ease-in-out infinite",
          }}
        />

        <span
          className="absolute left-[28%] top-[62%] h-1.5 w-1.5 rounded-full bg-teal/40"
          style={{
            animation:
              "geoDataFloat 5s ease-in-out infinite",
            animationDelay: "700ms",
          }}
        />

        <span
          className="absolute right-[22%] top-[31%] h-1 w-1 rounded-full bg-teal/60"
          style={{
            animation:
              "geoDataFloat 4.5s ease-in-out infinite",
            animationDelay: "1200ms",
          }}
        />

        <span
          className="absolute right-[31%] top-[67%] h-1.5 w-1.5 rounded-full bg-teal/40"
          style={{
            animation:
              "geoDataFloat 5.5s ease-in-out infinite",
            animationDelay: "400ms",
          }}
        />

      </div>

      {/* ======================================================
          LOGO INTRO
      ====================================================== */}

      <div
        className={`absolute inset-0 z-50 flex items-center justify-center px-5 transition-all duration-1000 ease-[cubic-bezier(.22,1,.36,1)] ${
          logoIntroDone
            ? "-translate-y-[30vh] opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      >
        <div className="flex flex-col items-center">

          <div className="flex items-center gap-3 md:gap-7">

            {/* LOGO 1 */}
            <div
              className="flex h-[62px] w-[78px] items-center justify-center md:h-[76px] md:w-[105px]"
              style={{
                opacity: 0,
                animation:
                  "geoLogoIntro 0.8s cubic-bezier(.22,1,.36,1) forwards",
                animationDelay: "0.15s",
              }}
            >
              <img
                src="/icons/1.png"
                alt=""
                className="max-h-[58px] max-w-[74px] object-contain md:max-h-[70px] md:max-w-[100px]"
              />
            </div>

            {/* DIVIDER */}
            <div
              className="hidden h-[38px] w-px bg-white/10 md:block"
              style={{
                opacity: 0,
                transform: "scaleY(0)",
                animation:
                  "geoLogoDivider 0.5s ease-out forwards",
                animationDelay: "0.65s",
              }}
            />

            {/* LOGO 2 */}
            <div
              className="flex h-[62px] w-[78px] items-center justify-center md:h-[76px] md:w-[105px]"
              style={{
                opacity: 0,
                animation:
                  "geoLogoIntro 0.8s cubic-bezier(.22,1,.36,1) forwards",
                animationDelay: "0.75s",
              }}
            >
              <img
                src="/icons/2.png"
                alt=""
                className="max-h-[58px] max-w-[74px] object-contain md:max-h-[70px] md:max-w-[100px]"
              />
            </div>

            {/* DIVIDER */}
            <div
              className="hidden h-[38px] w-px bg-white/10 md:block"
              style={{
                opacity: 0,
                transform: "scaleY(0)",
                animation:
                  "geoLogoDivider 0.5s ease-out forwards",
                animationDelay: "1.2s",
              }}
            />

            {/* LOGO 3 */}
            <div
              className="flex h-[62px] w-[78px] items-center justify-center md:h-[76px] md:w-[105px]"
              style={{
                opacity: 0,
                animation:
                  "geoLogoIntro 0.8s cubic-bezier(.22,1,.36,1) forwards",
                animationDelay: "1.35s",
              }}
            >
              <img
                src="/icons/3.png"
                alt=""
                className="max-h-[58px] max-w-[74px] object-contain md:max-h-[70px] md:max-w-[100px]"
              />
            </div>

          </div>

          {/* ACCENT */}
          <div
            className="mt-7 h-px w-[100px] bg-teal/50"
            style={{
              opacity: 0,
              transform: "scaleX(0.2)",
              animation:
                "geoLogoAccent 0.7s ease-out forwards",
              animationDelay: "1.7s",
            }}
          />

          {/* LABEL */}
          <div
            className="mt-4 text-[8px] font-medium uppercase tracking-[0.28em] text-white/30"
            style={{
              opacity: 0,
              animation:
                "geoLogoText 0.7s ease-out forwards",
              animationDelay: "1.85s",
            }}
          >
            GEOSPATIAL COLLABORATION
          </div>

        </div>
      </div>

      {/* ======================================================
          MAIN WELCOME CONTENT
      ====================================================== */}

      <div
        className={`relative z-10 flex min-h-full items-center justify-center px-5 transition-all duration-1000 ease-[cubic-bezier(.22,1,.36,1)] ${
          welcomeVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <div className="w-full max-w-[820px]">

          {/* ==================================================
              BRAND
          ================================================== */}

          <div className="mb-7 text-center">

            {/* Loading icon */}
            <div className="mb-4 flex justify-center">
              <div className="flex h-[48px] w-[48px] items-center justify-center rounded-[14px] border border-white/10 bg-[#071A24]/75 shadow-[0_8px_35px_rgba(0,0,0,.35)] backdrop-blur-md">

                <div
                  className="h-[24px] w-[24px] rounded-full border-[2px] border-teal/30 border-t-teal"
                  style={{
                    animation:
                      "layerLoadingSpin 1s linear infinite",
                  }}
                />

              </div>
            </div>

            {/* Product */}
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-teal/90">
              GEOLANDSCAPE
            </div>

            {/* Location */}
            <h1 className="font-display text-[32px] font-semibold tracking-[-0.04em] text-white drop-shadow-[0_4px_20px_rgba(0,0,0,.45)] md:text-[46px]">
              Ainaro – Belulik
            </h1>

            {/* Description */}
            <p className="mx-auto mt-3 max-w-[500px] text-[13px] leading-relaxed text-white/55">
              {t("welcomeDescription")}
            </p>

          </div>

          {/* ==================================================
              TERRAIN PROFILE CARD
          ================================================== */}

          <div
            className="
              relative overflow-hidden rounded-[20px]
              border border-teal/20
              bg-[#071B25]/75
              shadow-[0_25px_100px_rgba(0,0,0,.6)]
              backdrop-blur-[5px]
            "
          >

            {/* CARD GLOW */}
            <div className="pointer-events-none absolute inset-0">

              <div className="absolute left-1/2 top-0 h-px w-[70%] -translate-x-1/2 bg-teal/50 blur-[1px]" />

              <div className="absolute right-[-80px] top-[-80px] h-[180px] w-[180px] rounded-full bg-teal/[0.09] blur-[70px]" />

              <div className="absolute bottom-[-100px] left-[-60px] h-[180px] w-[180px] rounded-full bg-teal/[0.06] blur-[70px]" />

            </div>

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="relative flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">

              <div>

                <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-teal/80">

                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M3 17l6-6 4 4 5-7 3 3" />
                    <path d="M3 21h18" />
                  </svg>

                  LANDSCAPE PROFILE

                </div>

                <div className="mt-1 text-[11px] text-white/55">
                  Ainaro – Belulik
                </div>

              </div>

              {/* LIVE */}
              <div className="flex items-center gap-1.5">

                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal shadow-[0_0_10px_rgba(47,166,160,.8)]" />

                <span className="text-[9px] uppercase tracking-[0.12em] text-white/45">
                  {t("live")}
                </span>

              </div>

            </div>

            {/* ==================================================
                TERRAIN GRAPH
            ================================================== */}

            <div className="relative h-[155px] overflow-hidden px-5 pt-5">

              {/* Horizontal grid */}

              <div className="absolute inset-x-5 top-[28px] border-t border-white/[0.045]" />

              <div className="absolute inset-x-5 top-[68px] border-t border-white/[0.045]" />

              <div className="absolute inset-x-5 top-[108px] border-t border-white/[0.045]" />

              {/* Vertical grid */}

              <div className="absolute bottom-5 left-[25%] top-5 border-l border-white/[0.03]" />

              <div className="absolute bottom-5 left-[50%] top-5 border-l border-white/[0.03]" />

              <div className="absolute bottom-5 left-[75%] top-5 border-l border-white/[0.03]" />

              {/* Elevation labels */}

              <div className="absolute left-5 top-[22px] text-[7px] text-white/20">
                1.200 m
              </div>

              <div className="absolute left-5 top-[62px] text-[7px] text-white/20">
                800 m
              </div>

              <div className="absolute left-5 top-[102px] text-[7px] text-white/20">
                400 m
              </div>

              <div className="absolute left-5 bottom-[22px] text-[7px] text-white/20">
                0 m
              </div>

              {/* TERRAIN SVG */}

              <svg
                viewBox="0 0 600 130"
                preserveAspectRatio="none"
                className="absolute inset-x-5 bottom-5 h-[125px] w-[calc(100%-40px)]"
              >

                {/* Terrain fill */}
                <path
                  d="
                    M0 105
                    C35 96 45 76 78 82
                    C108 88 118 108 145 91
                    C172 74 183 42 215 51
                    C247 60 255 93 282 79
                    C310 65 322 31 350 39
                    C378 47 390 83 416 70
                    C445 55 456 29 485 43
                    C513 56 528 81 552 68
                    C572 58 585 43 600 47
                    L600 130
                    L0 130
                    Z
                  "
                  className="fill-teal/[0.09]"
                />

                {/* Mountain-like inner fill */}
                <path
                  d="
                    M0 105
                    C35 96 45 76 78 82
                    C108 88 118 108 145 91
                    C172 74 183 42 215 51
                    C247 60 255 93 282 79
                    C310 65 322 31 350 39
                    C378 47 390 83 416 70
                    C445 55 456 29 485 43
                    C513 56 528 81 552 68
                    C572 58 585 43 600 47
                    L600 130
                    L0 130
                    Z
                  "
                  className="fill-teal/[0.035]"
                />

                {/* Main terrain line */}

                <path
                  d="
                    M0 105
                    C35 96 45 76 78 82
                    C108 88 118 108 145 91
                    C172 74 183 42 215 51
                    C247 60 255 93 282 79
                    C310 65 322 31 350 39
                    C378 47 390 83 416 70
                    C445 55 456 29 485 43
                    C513 56 528 81 552 68
                    C572 58 585 43 600 47
                  "
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="text-teal"
                  pathLength="1"
                  strokeDasharray="1"
                  strokeDashoffset="1"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="1"
                    to="0"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </path>

                {/* Secondary terrain line */}

                <path
                  d="
                    M0 113
                    C40 104 55 89 82 94
                    C112 100 125 115 150 100
                    C180 82 190 58 218 63
                    C250 69 265 102 288 89
                    C315 75 325 49 350 54
                    C380 59 392 94 420 81
                    C450 67 460 48 487 58
                    C520 70 535 94 560 80
                  "
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.7"
                  className="text-teal/40"
                />

                {/* Moving point */}

                <circle
                  r="3.5"
                  fill="currentColor"
                  className="text-teal"
                >
                  <animateMotion
                    dur="4s"
                    repeatCount="indefinite"
                    path="
                      M0 105
                      C35 96 45 76 78 82
                      C108 88 118 108 145 91
                      C172 74 183 42 215 51
                      C247 60 255 93 282 79
                      C310 65 322 31 350 39
                      C378 47 390 83 416 70
                      C445 55 456 29 485 43
                      C513 56 528 81 552 68
                      C572 58 585 43 600 47
                    "
                  />
                </circle>

                {/* Current point glow */}

                <circle
                  cx="350"
                  cy="39"
                  r="6"
                  fill="none"
                  stroke="currentColor"
                  className="text-teal/30"
                >
                  <animate
                    attributeName="r"
                    values="4;9;4"
                    dur="2.5s"
                    repeatCount="indefinite"
                  />

                  <animate
                    attributeName="opacity"
                    values="0.7;0.1;0.7"
                    dur="2.5s"
                    repeatCount="indefinite"
                  />
                </circle>

              </svg>

              {/* LOW / HIGH */}

              <div className="absolute bottom-2 left-5 text-[8px] font-medium tracking-[0.08em] text-teal/45">
                LOW
              </div>

              <div className="absolute bottom-2 right-5 text-[8px] font-medium tracking-[0.08em] text-teal/45">
                HIGH
              </div>

            </div>

            {/* ==================================================
                DATA STATUS
            ================================================== */}

            <div className="relative grid grid-cols-3 border-t border-white/[0.06] bg-black/[0.12]">

              {/* TERRAIN */}

              <div className="border-r border-white/[0.06] px-4 py-3">

                <div className="flex items-center gap-2.5">

                  <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-teal/20 bg-teal/[0.06]">

                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-teal"
                    >
                      <path d="M3 17l6-6 4 4 5-7 3 3" />
                      <path d="M3 21h18" />
                    </svg>

                  </div>

                  <div>

                    <div className="text-[8px] uppercase tracking-[0.15em] text-teal/55">
                      Terrain
                    </div>

                    <div className="mt-1 text-[11px] font-semibold text-white/70">
                      Processing
                    </div>

                  </div>

                </div>

              </div>

              {/* SPATIAL */}

              <div className="border-r border-white/[0.06] px-4 py-3">

                <div className="flex items-center gap-2.5">

                  <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-teal/20 bg-teal/[0.06]">

                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-teal"
                    >
                      <ellipse cx="12" cy="5" rx="7" ry="3" />
                      <path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
                      <path d="M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7" />
                    </svg>

                  </div>

                  <div>

                    <div className="text-[8px] uppercase tracking-[0.15em] text-teal/55">
                      Spatial
                    </div>

                    <div className="mt-1 text-[11px] font-semibold text-white/70">
                      Preparing
                    </div>

                  </div>

                </div>

              </div>

              {/* 3D SCENE */}

              <div className="px-4 py-3">

                <div className="flex items-center gap-2.5">

                  <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-teal/20 bg-teal/[0.06]">

                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-teal"
                    >
                      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
                      <path d="M12 12l8-4.5" />
                      <path d="M12 12L4 7.5" />
                      <path d="M12 12v9" />
                    </svg>

                  </div>

                  <div>

                    <div className="text-[8px] uppercase tracking-[0.15em] text-teal/55">
                      3D Scene
                    </div>

                    <div className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-white/70">

                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal shadow-[0_0_8px_rgba(47,166,160,.8)]" />

                      Initializing

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ==================================================
              LOADING STATUS
          ================================================== */}

          <div className="mt-7 text-center">

            <div className="mb-3 flex items-center justify-center gap-2">

              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal shadow-[0_0_8px_rgba(47,166,160,.8)]" />

              <span
                key={phase}
                className="text-[11px] font-medium tracking-wide text-white/60"
                style={{
                  animation:
                    "layerLoadingIn 0.45s ease-out",
                }}
              >
                {phases[phase]}
              </span>

            </div>

            {/* Progress */}

            <div className="mx-auto h-[2px] w-[220px] overflow-hidden rounded-full bg-white/[0.08]">

              <div
                className="h-full w-[45%] rounded-full bg-teal shadow-[0_0_10px_rgba(47,166,160,.6)]"
                style={{
                  animation:
                    "layerLoadingProgress 2.4s ease-in-out infinite",
                }}
              />

            </div>

          </div>

          {/* ==================================================
              FOOTER
          ================================================== */}

          <div className="mt-7 text-center">

            <p className="text-[8px] font-medium uppercase tracking-[0.28em] text-white/25">
              Spatial Data
              <span className="mx-2 text-teal/40">·</span>
              Terrain
              <span className="mx-2 text-teal/40">·</span>
              Landscape
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}
