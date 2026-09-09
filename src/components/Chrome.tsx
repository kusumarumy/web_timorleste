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
type LoaderProps = {
  hidden: boolean;
  onFinished?: () => void;
};

export function Loader({ hidden, onFinished }: LoaderProps) {
  const { t } = useI18n();
useEffect(() => {
  const img = new window.Image();
  img.src = "/icons/loading.png";
}, []);
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
    }, 7000);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(welcomeTimer);
      clearTimeout(introReadyTimer);
    };
  }, []);
useEffect(() => {
  if (!hidden || !introReady) return;

  const timer = setTimeout(() => {
    onFinished?.();
  }, 1000);

  return () => clearTimeout(timer);
}, [hidden, introReady, onFinished]);
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

<div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">

  {/* ==================================================
      AINARO – BELULIK LANDSCAPE
  ================================================== */}

  <img
  src="/icons/loading.png"
  alt=""
  draggable={false}
  className="absolute inset-0 z-0 h-full w-full object-cover"
  style={{
    filter:
      "brightness(.58) saturate(.88) contrast(1.08)",
  }}
/>
  {/* ==================================================
      DEEP CINEMATIC OVERLAY
  ================================================== */}

<div className="absolute inset-0 z-[1] bg-[#03131B]/28" />

  {/* ==================================================
      CENTRAL TEAL ATMOSPHERE
  ================================================== */}

  <div
    className="absolute left-1/2 top-[43%] z-[2] h-[650px] w-[850px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal/[0.08] blur-[140px]"
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
    border border-teal/25
    bg-[#061A24]/82
    shadow-[0_25px_90px_rgba(0,0,0,.62)]
    backdrop-blur-[6px]
  "
>
  {/* ==================================================
      CARD GLOW
  ================================================== */}

  <div className="pointer-events-none absolute inset-0">

    {/* top cyan edge */}
    <div className="absolute left-[8%] right-[8%] top-0 h-px bg-teal/55 blur-[1px]" />

    {/* right glow */}
    <div className="absolute right-[-90px] top-[-90px] h-[220px] w-[220px] rounded-full bg-teal/[0.08] blur-[80px]" />

    {/* bottom glow */}
    <div className="absolute bottom-[-100px] left-[-80px] h-[220px] w-[220px] rounded-full bg-teal/[0.06] blur-[80px]" />

  </div>


  {/* ==================================================
      HEADER
  ================================================== */}

  <div
    className="
      relative flex items-center justify-between
      border-b border-white/[0.07]
      px-5 py-3.5
    "
  >

    {/* LEFT */}

    <div>

      <div
        className="
          flex items-center gap-2
          text-[9px] font-bold
          uppercase tracking-[0.18em]
          text-teal
        "
      >

        {/* terrain icon */}

        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <path d="M3 17l6-6 4 4 5-7 3 3" />
          <path d="M3 21h18" />
        </svg>

        LANDSCAPE PROFILE

      </div>


      {/* LOCATION */}

      <div className="mt-1.5 flex items-center gap-2">

        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="text-white/45"
        >
          <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>

        <span className="text-[11px] font-medium text-white/65">
          Ainaro – Belulik
        </span>

      </div>

    </div>


    {/* ==================================================
        LIVE
    ================================================== */}

    <div className="flex items-center gap-2">

      <span
        className="
          h-2 w-2 rounded-full
          bg-teal
          shadow-[0_0_12px_rgba(47,220,220,.9)]
          animate-pulse
        "
      />

      <span
        className="
          text-[9px] font-medium
          uppercase tracking-[0.13em]
          text-teal/90
        "
      >
        {t("live")}
      </span>

    </div>

  </div>


  {/* ==================================================
      TERRAIN GRAPH
  ================================================== */}

  <div className="relative h-[185px] overflow-hidden px-5 pt-4">

    {/* ==================================================
        HORIZONTAL GRID
    ================================================== */}

    <div className="absolute inset-x-5 top-[30px] border-t border-teal/[0.08]" />

    <div className="absolute inset-x-5 top-[70px] border-t border-teal/[0.07]" />

    <div className="absolute inset-x-5 top-[110px] border-t border-teal/[0.06]" />

    <div className="absolute inset-x-5 top-[150px] border-t border-teal/[0.05]" />


    {/* ==================================================
        VERTICAL GRID
    ================================================== */}

    <div className="absolute bottom-5 left-[25%] top-4 border-l border-teal/[0.045]" />

    <div className="absolute bottom-5 left-[50%] top-4 border-l border-teal/[0.045]" />

    <div className="absolute bottom-5 left-[75%] top-4 border-l border-teal/[0.045]" />


    {/* ==================================================
        ELEVATION LABELS
    ================================================== */}

    <div className="absolute left-5 top-[25px] text-[8px] font-medium text-white/55">
      1.200 m
    </div>

    <div className="absolute left-5 top-[65px] text-[8px] font-medium text-white/55">
      800 m
    </div>

    <div className="absolute left-5 top-[105px] text-[8px] font-medium text-white/55">
      400 m
    </div>

    <div className="absolute bottom-[24px] left-5 text-[8px] font-medium text-white/55">
      0 m
    </div>

{/* ==================================================
    3D MOUNTAIN TERRAIN PROFILE
================================================== */}

<svg
  viewBox="0 0 700 160"
  preserveAspectRatio="none"
  className="absolute inset-x-5 bottom-5 h-[155px] w-[calc(100%-40px)]"
>
  <defs>

    {/* MAIN TERRAIN GRADIENT */}
    <linearGradient
      id="terrainFill"
      x1="0"
      y1="0"
      x2="0"
      y2="1"
    >
      <stop
        offset="0%"
        stopColor="#39d6cf"
        stopOpacity="0.48"
      />

      <stop
        offset="45%"
        stopColor="#168e91"
        stopOpacity="0.28"
      />

      <stop
        offset="100%"
        stopColor="#06343e"
        stopOpacity="0.08"
      />
    </linearGradient>

    {/* BACK MOUNTAIN */}
    <linearGradient
      id="backMountain"
      x1="0"
      y1="0"
      x2="0"
      y2="1"
    >
      <stop
        offset="0%"
        stopColor="#5be0da"
        stopOpacity="0.28"
      />

      <stop
        offset="100%"
        stopColor="#062631"
        stopOpacity="0.05"
      />
    </linearGradient>

    {/* FRONT MOUNTAIN */}
    <linearGradient
      id="frontMountain"
      x1="0"
      y1="0"
      x2="0"
      y2="1"
    >
      <stop
        offset="0%"
        stopColor="#20c8c2"
        stopOpacity="0.52"
      />

      <stop
        offset="50%"
        stopColor="#08777c"
        stopOpacity="0.35"
      />

      <stop
        offset="100%"
        stopColor="#031b25"
        stopOpacity="0.08"
      />
    </linearGradient>

    {/* GLOW */}
    <filter
      id="terrainGlow"
      x="-30%"
      y="-30%"
      width="160%"
      height="160%"
    >
      <feGaussianBlur
        stdDeviation="2"
        result="blur"
      />

      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

  </defs>


  {/* ==================================================
      BACK MOUNTAIN RANGE
  ================================================== */}

  <path
    d="
      M0 128

      L55 106
      L95 115
      L135 82
      L172 104

      L215 68
      L250 92

      L290 54
      L325 82

      L365 38
      L405 83

      L445 61
      L480 94

      L520 48
      L555 79

      L600 57
      L640 89
      L700 62

      L700 160
      L0 160
      Z
    "
    fill="url(#backMountain)"
  />


  {/* ==================================================
      BACK MOUNTAIN RIDGE
  ================================================== */}

  <path
    d="
      M0 128
      L55 106
      L95 115
      L135 82
      L172 104
      L215 68
      L250 92
      L290 54
      L325 82
      L365 38
      L405 83
      L445 61
      L480 94
      L520 48
      L555 79
      L600 57
      L640 89
      L700 62
    "
    fill="none"
    stroke="#54d9d3"
    strokeWidth="1"
    strokeOpacity="0.45"
  />


  {/* ==================================================
      MOUNTAIN SHADING FACETS
  ================================================== */}

  {/* Peak 1 */}

  <path
    d="
      M135 82
      L108 108
      L151 98
      L172 104
      Z
    "
    fill="#63e4dd"
    fillOpacity="0.18"
  />

  <path
    d="
      M135 82
      L151 98
      L140 116
      L108 108
      Z
    "
    fill="#052a35"
    fillOpacity="0.55"
  />


  {/* Peak 2 */}

  <path
    d="
      M215 68
      L187 101
      L225 89
      L250 92
      Z
    "
    fill="#6ce7e0"
    fillOpacity="0.22"
  />

  <path
    d="
      M215 68
      L225 89
      L250 92
      L238 111
      L205 96
      Z
    "
    fill="#052832"
    fillOpacity="0.65"
  />


  {/* Main central mountain */}

  <path
    d="
      M365 38
      L326 91
      L365 70
      L405 83
      Z
    "
    fill="#78eee7"
    fillOpacity="0.30"
  />

  <path
    d="
      M365 38
      L365 70
      L405 83
      L389 110
      L348 91
      Z
    "
    fill="#03222c"
    fillOpacity="0.70"
  />


  {/* Peak 4 */}

  <path
    d="
      M520 48
      L484 92
      L523 76
      L555 79
      Z
    "
    fill="#67e4de"
    fillOpacity="0.24"
  />

  <path
    d="
      M520 48
      L523 76
      L555 79
      L543 105
      L505 91
      Z
    "
    fill="#042630"
    fillOpacity="0.65"
  />


  {/* ==================================================
      INNER MOUNTAIN CONTOURS
  ================================================== */}

  <path
    d="
      M116 106
      C127 101 136 96 145 91
      C153 95 161 99 169 101
    "
    fill="none"
    stroke="#6ce9e2"
    strokeWidth="0.7"
    strokeOpacity="0.45"
  />

  <path
    d="
      M125 111
      C138 104 148 100 158 98
      C168 100 176 104 185 108
    "
    fill="none"
    stroke="#45cbc7"
    strokeWidth="0.55"
    strokeOpacity="0.35"
  />


  {/* Central mountain contours */}

  <path
    d="
      M331 89
      C343 78 355 68 365 58
      C376 68 388 76 399 81
    "
    fill="none"
    stroke="#82eee8"
    strokeWidth="0.8"
    strokeOpacity="0.55"
  />

  <path
    d="
      M321 99
      C338 86 350 78 365 68
      C379 78 393 87 411 94
    "
    fill="none"
    stroke="#45cbc7"
    strokeWidth="0.6"
    strokeOpacity="0.38"
  />

  <path
    d="
      M313 108
      C332 94 348 87 365 77
      C383 89 399 97 420 103
    "
    fill="none"
    stroke="#36aaa9"
    strokeWidth="0.55"
    strokeOpacity="0.28"
  />


  {/* Right mountain contours */}

  <path
    d="
      M489 91
      C501 81 511 72 520 61
      C530 70 540 77 551 82
    "
    fill="none"
    stroke="#7aeae4"
    strokeWidth="0.7"
    strokeOpacity="0.48"
  />

  <path
    d="
      M480 101
      C497 88 509 81 521 71
      C535 83 548 89 564 94
    "
    fill="none"
    stroke="#42c5c2"
    strokeWidth="0.55"
    strokeOpacity="0.32"
  />


  {/* ==================================================
      FRONT TERRAIN MASS
  ================================================== */}

  <path
    d="
      M0 139

      C35 131 55 126 80 129
      C105 132 122 122 145 117

      C170 111 186 119 210 116

      C238 112 254 96 275 99

      C300 103 315 116 340 112

      C365 108 381 91 404 94

      C430 98 443 112 470 109

      C498 106 512 91 535 93

      C558 95 573 108 600 105

      C630 101 654 91 700 88

      L700 160
      L0 160
      Z
    "
    fill="url(#frontMountain)"
  />


  {/* ==================================================
      FRONT TERRAIN RIDGE
  ================================================== */}

  <path
    d="
      M0 139

      C35 131 55 126 80 129
      C105 132 122 122 145 117

      C170 111 186 119 210 116

      C238 112 254 96 275 99

      C300 103 315 116 340 112

      C365 108 381 91 404 94

      C430 98 443 112 470 109

      C498 106 512 91 535 93

      C558 95 573 108 600 105

      C630 101 654 91 700 88
    "
    fill="none"
    stroke="#3bd8d2"
    strokeWidth="1.4"
    strokeOpacity="0.65"
  />


  {/* ==================================================
      FRONT CONTOUR LINES
  ================================================== */}

  <path
    d="
      M30 143
      C70 135 100 137 130 127
      C160 117 180 126 210 122
      C240 117 257 105 276 107
      C301 111 318 123 342 119
      C368 114 382 101 404 102
      C430 105 445 119 470 115
      C500 111 516 100 536 101
      C560 103 578 115 602 112
      C635 108 665 99 700 96
    "
    fill="none"
    stroke="#53d5d0"
    strokeWidth="0.7"
    strokeOpacity="0.32"
  />

  <path
    d="
      M55 149
      C88 142 112 143 140 135
      C168 127 190 134 214 130
      C244 125 260 114 280 115
      C304 119 320 130 345 126
      C370 122 386 110 407 111
      C431 114 449 128 474 123
      C501 119 518 109 540 110
      C563 112 579 123 605 119
      C636 115 668 108 700 105
    "
    fill="none"
    stroke="#2aa9aa"
    strokeWidth="0.55"
    strokeOpacity="0.25"
  />


{/* ==================================================
    ANIMATED TERRAIN RIDGE
    GARIS BERJALAN TEPAT DI PUNCAK GUNUNG
================================================== */}

<path
  d="
    M0 128

    L55 106
    L95 115
    L135 82
    L172 104

    L215 68
    L250 92

    L290 54
    L325 82

    L365 38
    L405 83

    L445 61
    L480 94

    L520 48
    L555 79

    L600 57
    L640 89
    L700 62
  "
  fill="none"
  stroke="#55eee7"
  strokeWidth="1.8"
  strokeOpacity="0.95"
  filter="url(#terrainGlow)"
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


  {/* ==================================================
      ACTIVE ELEVATION POINT
  ================================================== */}

 <line
  x1="494"
  y1="78"
  x2="494"
  y2="150"
  stroke="#37ddd7"
  strokeWidth="0.7"
  strokeOpacity="0.35"
/>

<circle
  cx="494"
  cy="78"
  r="4"
  fill="#5ff4ed"
  filter="url(#terrainGlow)"
/>

<circle
  cx="494"
  cy="78"
  r="8"
  fill="none"
  stroke="#49e5df"
  strokeWidth="1"
  strokeOpacity="0.45"
>
  <animate
    attributeName="r"
    values="5;12;5"
    dur="2.5s"
    repeatCount="indefinite"
  />

  <animate
    attributeName="opacity"
    values="0.8;0.05;0.8"
    dur="2.5s"
    repeatCount="indefinite"
  />
</circle>
</svg>
    
    {/* ==================================================
        LOW / HIGH
    ================================================== */}

    <div
      className="
        absolute bottom-2 left-5
        text-[8px] font-bold
        tracking-[0.08em]
        text-teal
      "
    >
      LOW
    </div>

    <div
      className="
        absolute bottom-2 right-5
        text-[8px] font-bold
        tracking-[0.08em]
        text-teal
      "
    >
      HIGH
    </div>

  </div>


  {/* ==================================================
      DATA STATUS
  ================================================== */}

  <div
    className="
      relative grid grid-cols-[1fr_auto_1fr_auto_1fr]
      items-center
      border-t border-white/[0.07]
      bg-black/[0.13]
      px-4 py-3.5
    "
  >

    {/* ==================================================
        TERRAIN
    ================================================== */}

    <div
      className="
        rounded-[14px]
        border border-teal/25
        bg-[#071D28]/75
        px-4 py-3
      "
    >

      <div className="flex items-center gap-3">

        <div
          className="
            flex h-8 w-8 shrink-0
            items-center justify-center
            rounded-full
            border border-teal/20
            bg-teal/[0.05]
          "
        >

          <svg
            width="17"
            height="17"
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

          <div className="text-[8px] uppercase tracking-[0.15em] text-teal/70">
            Terrain
          </div>

          <div className="mt-1 text-[11px] font-semibold text-white/75">
            Processing
          </div>

        </div>

      </div>

    </div>


    {/* ARROW */}

    <div className="flex w-8 items-center justify-center text-teal">

      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M9 5l7 7-7 7" />
      </svg>

    </div>


    {/* ==================================================
        SPATIAL
    ================================================== */}

    <div
      className="
        rounded-[14px]
        border border-teal/25
        bg-[#071D28]/75
        px-4 py-3
      "
    >

      <div className="flex items-center gap-3">

        <div
          className="
            flex h-8 w-8 shrink-0
            items-center justify-center
            rounded-full
            border border-teal/20
            bg-teal/[0.05]
          "
        >

          <svg
            width="18"
            height="18"
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

          <div className="text-[8px] uppercase tracking-[0.15em] text-teal/70">
            Spatial
          </div>

          <div className="mt-1 text-[11px] font-semibold text-white/75">
            Preparing
          </div>

        </div>

      </div>

    </div>


    {/* ARROW */}

    <div className="flex w-8 items-center justify-center text-teal">

      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M9 5l7 7-7 7" />
      </svg>

    </div>


    {/* ==================================================
        3D SCENE
    ================================================== */}

    <div
      className="
        rounded-[14px]
        border border-teal/25
        bg-[#071D28]/75
        px-4 py-3
      "
    >

      <div className="flex items-center gap-3">

        <div
          className="
            flex h-8 w-8 shrink-0
            items-center justify-center
            rounded-full
            border border-teal/20
            bg-teal/[0.05]
          "
        >

          <svg
            width="17"
            height="17"
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

          <div className="text-[8px] uppercase tracking-[0.15em] text-teal/70">
            3D Scene
          </div>

          <div className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-white/75">

            <span
              className="
                h-1.5 w-1.5 rounded-full
                bg-teal
                shadow-[0_0_8px_rgba(47,166,160,.8)]
                animate-pulse
              "
            />

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
