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
export function Legend() {
  const { t } = useI18n();

  const {
    visible,
    subVisible,
  } = useMapStore();

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
                                opacity:
                                  child.legend.opacity ?? 1,
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
                              background:
                                child.legend.color,
                              opacity:
                                child.legend.opacity ?? 1,
                            }}
                          />
                        ) : (
                          <span
                            className="h-[13px] w-[18px] flex-none rounded-[2px]"
                            style={{
                              background:
                                child.legend.color,
                              opacity:
                                child.legend.opacity ?? 1,
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
              if (
                layer.sublayers?.length &&
                visible[layer.id]
              ) {
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
                          backgroundColor:
                            "#66BB6A",
                          opacity: 0.25,
                          border:
                            "1px solid #2E7D32",
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
                            subVisible[sub.id] ??
                            true
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
                                  backgroundColor:
                                    "#66BB6A",
                                  opacity: 0.25,
                                  border: `2px solid ${
                                    sub.outlineColor ??
                                    "#2E7D32"
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
                          opacity:
                            layer.legend.opacity ??
                            1,
                        }}
                      >
                        <line
                          x1="1"
                          y1="6"
                          x2="23"
                          y2="6"
                          stroke={
                            layer.legend.color
                          }
                          strokeWidth={Math.max(
                            1,
                            layer.legend.width ??
                              2
                          )}
                          strokeLinecap="butt"
                          strokeDasharray={
                            layer.legend.dasharray
                              ? layer.legend.dasharray.join(
                                  " "
                                )
                              : undefined
                          }
                        />
                      </svg>
                    </span>
                  ) : layer.legend.circle ? (
                    <span
                      className="h-[12px] w-[12px] flex-none rounded-full"
                      style={{
                        background:
                          layer.legend.color,
                        opacity:
                          layer.legend.opacity ??
                          1,
                      }}
                    />
                  ) : (
                    <span
                      className="h-[13px] w-[18px] flex-none rounded-[2px]"
                      style={{
                        background:
                          layer.legend.color,
                        opacity:
                          layer.legend.opacity ??
                          1,
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

export function Loader({ hidden }: { hidden: boolean }) {
  const { t } = useI18n();
  const [phase, setPhase] = useState(0);

  const phases = [
    t("loadPhase1"),
    t("loadPhase2"),
    t("loadPhase3"),
    t("loadPhase4"),
  ];

  // Rotate loading message
  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((prev) => (prev + 1) % phases.length);
    }, 2200);

    return () => clearInterval(interval);
  }, [phases.length]);

  return (
    <div
      className={`absolute inset-0 z-40 overflow-hidden bg-[#08151E] transition-all duration-1000 ${
        hidden
          ? "pointer-events-none opacity-0"
          : "opacity-100"
      }`}
    >

      {/* =====================================================
          BACKGROUND ATMOSPHERE
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0">

        {/* radial glow */}
        <div className="absolute left-1/2 top-[42%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal/[0.035] blur-[100px]" />

        {/* subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />
      </div>


      {/* =====================================================
          FLOATING DATA POINTS
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0">

        <span className="absolute left-[18%] top-[25%] h-1 w-1 animate-pulse rounded-full bg-teal/70" />

        <span className="absolute left-[28%] top-[62%] h-1.5 w-1.5 animate-pulse rounded-full bg-teal/40 [animation-delay:700ms]" />

        <span className="absolute right-[22%] top-[31%] h-1 w-1 animate-pulse rounded-full bg-teal/60 [animation-delay:1200ms]" />

        <span className="absolute right-[31%] top-[67%] h-1.5 w-1.5 animate-pulse rounded-full bg-teal/40 [animation-delay:400ms]" />

      </div>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="relative z-10 flex min-h-full items-center justify-center px-5">

        <div className="w-full max-w-[620px]">

          {/* -----------------------------------------------
              BRAND
          ------------------------------------------------ */}

          <div className="mb-8 text-center">

            <div className="mb-5 flex justify-center">

              <div className="flex h-[48px] w-[48px] items-center justify-center rounded-[14px] border border-white/10 bg-white/[0.035] shadow-[0_8px_35px_rgba(0,0,0,.25)]">

                <div
  className="h-[24px] w-[24px] rounded-full border-[2px] border-teal/30 border-t-teal"
  style={{
    animation: "layerLoadingSpin 1s linear infinite",
  }}
/>

              </div>

            </div>

            <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-teal/80">
              GEOLANDSCAPE
            </div>

            <h1 className="font-display text-[32px] font-semibold tracking-[-0.04em] text-white md:text-[38px]">
              Ainaro – Belulik
            </h1>

            <p className="mx-auto mt-3 max-w-[430px] text-[13px] leading-relaxed text-white/45">
              {t("welcomeDescription")}
            </p>

          </div>


          {/* =================================================
              TERRAIN GRAPH
          ================================================= */}

          <div className="relative overflow-hidden rounded-[20px] border border-white/[0.08] bg-white/[0.025] shadow-[0_25px_80px_rgba(0,0,0,.35)]">

            {/* graph header */}

            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">

              <div>
                <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">
                  LANDSCAPE PROFILE
                </div>

                <div className="mt-1 text-[11px] text-white/55">
                  Ainaro – Belulik
                </div>
              </div>

              <div className="flex items-center gap-1.5">

                <span className="h-1.5 w-1.5 rounded-full bg-teal animate-pulse" />

                <span className="text-[9px] uppercase tracking-[0.12em] text-white/35">
                  {t("live")}
                </span>

              </div>

            </div>


            {/* terrain chart */}

            <div className="relative h-[155px] overflow-hidden px-5 pt-5">

              {/* horizontal grid */}

              <div className="absolute inset-x-5 top-[28px] border-t border-white/[0.035]" />
              <div className="absolute inset-x-5 top-[68px] border-t border-white/[0.035]" />
              <div className="absolute inset-x-5 top-[108px] border-t border-white/[0.035]" />

              {/* vertical grid */}

              <div className="absolute bottom-5 left-[25%] top-5 border-l border-white/[0.025]" />
              <div className="absolute bottom-5 left-[50%] top-5 border-l border-white/[0.025]" />
              <div className="absolute bottom-5 left-[75%] top-5 border-l border-white/[0.025]" />

              {/* animated terrain */}

              <svg
                viewBox="0 0 600 130"
                preserveAspectRatio="none"
                className="absolute inset-x-5 bottom-5 h-[125px] w-[calc(100%-40px)]"
              >

                {/* fill */}

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
                  className="fill-teal/[0.07]"
                />

                {/* main terrain line */}

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

                {/* moving point */}

                <circle
                  r="3"
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

              </svg>

              {/* elevation labels */}

              <div className="absolute bottom-2 left-5 text-[8px] text-white/20">
                LOW
              </div>

              <div className="absolute bottom-2 right-5 text-[8px] text-white/20">
                HIGH
              </div>

            </div>


            {/* =================================================
                DATA STATUS
            ================================================= */}

            <div className="grid grid-cols-3 border-t border-white/[0.06]">

              <div className="border-r border-white/[0.06] px-4 py-3">

                <div className="text-[8px] uppercase tracking-[0.15em] text-white/30">
                  Terrain
                </div>

                <div className="mt-1 text-[11px] font-semibold text-white/70">
                  Processing
                </div>

              </div>

              <div className="border-r border-white/[0.06] px-4 py-3">

                <div className="text-[8px] uppercase tracking-[0.15em] text-white/30">
                  Spatial
                </div>

                <div className="mt-1 text-[11px] font-semibold text-white/70">
                  Preparing
                </div>

              </div>

              <div className="px-4 py-3">

                <div className="text-[8px] uppercase tracking-[0.15em] text-white/30">
                  3D Scene
                </div>

                <div className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-white/70">

                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal" />

                  Initializing

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              LOADING STATUS
          ================================================= */}

          <div className="mt-7 text-center">

            <div className="mb-3 flex items-center justify-center gap-2">

              <span className="h-1.5 w-1.5 rounded-full bg-teal animate-pulse" />

<span
  key={phase}
  className="text-[11px] font-medium tracking-wide text-white/55"
  style={{
    animation: "layerLoadingIn 0.45s ease-out",
  }}
>
  {phases[phase]}
</span>

            </div>


            {/* progress animation */}

            <div className="mx-auto h-[2px] w-[180px] overflow-hidden rounded-full bg-white/[0.07]">

              className="h-full w-[45%] animate-[layerLoadingProgress_2.4s_ease-in-out_infinite] rounded-full bg-teal"

            </div>

          </div>


          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="mt-8 text-center">

            <p className="text-[9px] uppercase tracking-[0.2em] text-white/20">
              Spatial Data · Terrain · Landscape
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}
