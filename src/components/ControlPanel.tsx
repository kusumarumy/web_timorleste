"use client";

import { useEffect, useState } from "react";
import {
  GROUPS,
  LayerDef,
  getDescendantIds,
} from "@/lib/config";
import { useMapStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import {
  setToolMode,
  getToolMode,
  onToolMode,
} from "./toolMode";

function Toggle({
  on,
  onClick,
}: {
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={`relative h-[17px] w-[30px] flex-none rounded-full transition-colors ${
        on ? "bg-teal" : "bg-stroke"
      }`}
    >
      <span
        className={`absolute top-[2px] h-[13px] w-[13px] rounded-full transition-all ${
          on
            ? "left-[15px] bg-[#04171a]"
            : "left-[2px] bg-muted"
        }`}
      />
    </button>
  );
}

function LayerSymbol({ l }: { l: LayerDef }) {
  const legend = l.legend;
  const paint = (l.paint ?? {}) as Record<
    string,
    unknown
  >;

  if (l.icon) {
    return (
      <span className="flex h-[20px] w-[24px] flex-none items-center justify-center">
        <img
          src={l.icon}
          alt=""
          className="max-h-[19px] max-w-[19px] object-contain"
        />
      </span>
    );
  }

  const color =
    legend?.color ??
    (typeof paint["line-color"] === "string"
      ? paint["line-color"]
      : typeof paint["fill-color"] === "string"
      ? paint["fill-color"]
      : typeof paint["circle-color"] === "string"
      ? paint["circle-color"]
      : undefined);

  const opacity =
    legend?.opacity ??
    (typeof paint["line-opacity"] === "number"
      ? paint["line-opacity"]
      : typeof paint["fill-opacity"] === "number"
      ? paint["fill-opacity"]
      : typeof paint["circle-opacity"] === "number"
      ? paint["circle-opacity"]
      : 1);

  const width =
    legend?.width ??
    (typeof paint["line-width"] === "number"
      ? paint["line-width"]
      : 2);

  const dasharray =
    legend?.dasharray ??
    (Array.isArray(paint["line-dasharray"])
      ? (paint["line-dasharray"] as number[])
      : undefined);

  if (legend?.line === true || l.kind === "line") {
    if (!color) return null;

    return (
      <span className="flex h-[20px] w-[24px] flex-none items-center">
        <svg
          width="24"
          height="10"
          viewBox="0 0 24 10"
          className="block"
          style={{ opacity }}
        >
          <line
            x1="1"
            y1="5"
            x2="23"
            y2="5"
            stroke={color}
            strokeWidth={Math.max(1, width)}
            strokeLinecap="butt"
            strokeDasharray={
              dasharray
                ? dasharray.join(" ")
                : undefined
            }
          />
        </svg>
      </span>
    );
  }

  if (
    legend?.circle === true ||
    l.kind === "circle"
  ) {
    if (!color) return null;

    return (
      <span
        className="h-[10px] w-[10px] flex-none rounded-full"
        style={{
          backgroundColor: color,
          opacity,
        }}
      />
    );
  }

  if (l.kind === "fill") {
    return (
      <span
        className="h-[11px] w-[18px] flex-none rounded-[2px]"
        style={{
          backgroundColor:
            typeof paint["fill-color"] === "string"
              ? (paint["fill-color"] as string)
              : "transparent",
          opacity,
          border: color
            ? `${Math.max(1, width)}px solid ${color}`
            : undefined,
        }}
      />
    );
  }

  if (!color) return null;

  return (
    <span
      className="h-[10px] w-[10px] flex-none rounded-full"
      style={{
        backgroundColor: color,
        opacity,
      }}
    />
  );
}

function LayerRow({
  l,
  depth = 0,
}: {
  l: LayerDef;
  depth?: number;
}) {
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

  const handleToggle = () => {
    const next = !on;

    toggle(l.id);

    if (l.cascade) {
      for (const childId of getDescendantIds(l.id)) {
        if (
          (visible[childId] ?? false) !== next
        ) {
          toggle(childId);
        }
      }
    }
  };

  return (
    <div className="min-w-0">
      {/* MAIN LAYER */}
      <div
        className={`group flex min-w-0 items-start gap-1.5 rounded-[8px] py-1 transition-colors hover:bg-teal/[0.07] ${
          depth > 0
            ? "pl-4 pr-1.5"
            : "px-1.5"
        }`}
      >
        <Toggle
          on={on}
          onClick={handleToggle}
        />

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-start gap-1.5 text-[10px] font-semibold leading-tight text-ink">
            <LayerSymbol l={l} />

            <span className="min-w-0 flex-1 whitespace-normal break-words line-clamp-2">
              {t(l.nameKey)}
            </span>
          </div>

          {l.subKey && (
            <div className="mt-0.5 whitespace-normal break-words text-[9px] leading-tight text-muted2 line-clamp-2">
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
            onChange={(e) =>
              setOpacity(
                l.id,
                +e.target.value
              )
            }
            className="mt-1 h-[3px] w-12 flex-none accent-teal"
          />
        )}
      </div>

      {/* SUBLAYERS */}
      {l.sublayers && on && (
        <div className="ml-8 mb-1 mt-0.5 min-w-0 space-y-0 border-l border-strokeSoft pl-2">
          {l.sublayers.map((sub) => {
            const subOn =
              subVisible[sub.id] ?? true;

            return (
              <div
                key={sub.id}
                className="min-w-0"
              >
                <label className="flex min-w-0 cursor-pointer items-start gap-1.5 rounded-md px-1.5 py-0.5 text-[9.5px] leading-tight text-muted hover:bg-teal/[0.07]">
                  <input
                    type="checkbox"
                    checked={subOn}
                    onChange={() =>
                      toggleSub(sub.id)
                    }
                    className="mt-[1px] h-3 w-3 flex-none accent-teal"
                  />

                  {l.kind === "line" ? (
                    <span
                      className="mt-[4px] block h-[2px] w-[20px] flex-none"
                      style={{
                        backgroundColor:
                          sub.color ??
                          "#2FA6A0",
                      }}
                    />
                  ) : (
                    <span
                      className="mt-[1px] h-[10px] w-[20px] flex-none rounded-[2px]"
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
                  )}

                  <span className="min-w-0 flex-1 whitespace-normal break-words line-clamp-2">
                    {t(sub.labelKey)}
                  </span>
                </label>

                {/* STATUS */}
                {sub.sublayers?.length &&
                subOn ? (
                  <div className="ml-7 mb-0.5 mt-0 min-w-0 border-l border-strokeSoft/60 pl-1.5">
                    {sub.sublayers.map(
                      (status) => {
                        const statusOn =
                          subVisible[
                            status.id
                          ] ?? true;

                        return (
                          <label
                            key={status.id}
                            className="flex min-w-0 cursor-pointer items-start gap-1.5 rounded-md px-1.5 py-0.5 text-[9px] leading-tight text-muted2 hover:bg-teal/[0.07]"
                          >
                            <input
                              type="checkbox"
                              checked={
                                statusOn
                              }
                              onChange={() =>
                                toggleSub(
                                  status.id
                                )
                              }
                              className="mt-[1px] h-3 w-3 flex-none accent-teal"
                            />

                            <span className="mt-[3px] h-[5px] w-[5px] flex-none rounded-full bg-muted2/70" />

                            {/* FIX:
                                sebelumnya t(l.nameKey)
                                sekarang t(status.labelKey)
                            */}
                            <span className="min-w-0 flex-1 whitespace-normal break-words line-clamp-2">
                              {t(
                                status.labelKey
                              )}
                            </span>
                          </label>
                        );
                      }
                    )}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      {/* CHILDREN */}
      {l.children &&
        l.children.length > 0 &&
        on && (
          <div className="ml-4 mb-0.5 min-w-0 border-l border-strokeSoft pl-1.5">
            {l.children.map((child) => (
              <LayerRow
                key={child.id}
                l={child}
                depth={depth + 1}
              />
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
  } = useMapStore();

  const options: {
    id: "off" | "aws" | "r2";
    label: string;
  }[] = [
    {
      id: "off",
      label: t("terrain_off"),
    },
    {
      id: "aws",
      label: "AWS Terrarium 30 m",
    },
    {
      id: "r2",
      label: "DTM 3 m",
    },
  ];

  return (
    <div className="m-1.5 rounded-xl border border-strokeSoft bg-gradient-to-br from-teal/10 to-teal/[0.02] p-2">
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-ink">
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="#2FA6A0"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 20l6-12 4 7 3-5 5 10z" />
        </svg>

        {t("terrain")}
      </div>

      <div className="mt-2 flex gap-1 rounded-[9px] border border-stroke bg-bg/40 p-[2px]">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() =>
              setTerrainSource(opt.id)
            }
            className={`flex-1 whitespace-nowrap rounded-md px-1 py-1.5 text-[9px] font-semibold leading-none transition-colors ${
              terrainSource === opt.id
                ? "bg-teal text-[#04171a]"
                : "text-muted hover:text-ink"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function MeasurementControl() {
  const { t } = useI18n();

  const { terrainSource } = useMapStore();

  const [active, setActive] =
    useState(getToolMode());

  const needsTerrain =
    active === "elevation" ||
    active === "profile";

  const terrainOff =
    terrainSource === "off";

  useEffect(() => {
    const unsubscribe = onToolMode(
      (mode) => {
        setActive(mode);
      }
    );

    const handleKeyDown = (
      e: KeyboardEvent
    ) => {
      if (e.key === "Escape") {
        setToolMode(null);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      unsubscribe();

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  const activate = (
    mode:
      | "distance"
      | "elevation"
      | "area"
      | "profile"
  ) => {
    if (active === mode) {
      setToolMode(null);
      return;
    }

    setToolMode(mode);
  };

  const buttonClass = (
    mode:
      | "distance"
      | "elevation"
      | "area"
      | "profile"
  ) =>
    `flex items-center justify-center gap-1 rounded-md border px-1 py-1.5 transition-colors ${
      active === mode
        ? "border-teal/50 bg-teal text-[#04171a]"
        : "border-stroke bg-bg/30 text-muted hover:border-teal/30 hover:bg-teal/[0.07] hover:text-ink"
    }`;

  return (
    <div className="m-1.5 mt-1.5 rounded-xl border border-strokeSoft bg-gradient-to-br from-teal/10 to-teal/[0.02] p-2">
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-ink">
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
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

        <span>
          {t("measurement")}
        </span>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-1 rounded-[9px] border border-stroke bg-bg/40 p-[2px]">
        <button
          type="button"
          onClick={() =>
            activate("distance")
          }
          className={buttonClass(
            "distance"
          )}
          aria-pressed={
            active === "distance"
          }
        >
          <span className="text-[11px]">
            📏
          </span>

          <span className="whitespace-nowrap text-[9px] font-semibold">
            {t("distance")}
          </span>
        </button>

        <button
          type="button"
          onClick={() =>
            activate("elevation")
          }
          className={buttonClass(
            "elevation"
          )}
          aria-pressed={
            active === "elevation"
          }
        >
          <span className="text-[12px]">
            ↕
          </span>

          <span className="whitespace-nowrap text-[9px] font-semibold">
            {t("elevation")}
          </span>
        </button>

        <button
          type="button"
          onClick={() =>
            activate("area")
          }
          className={buttonClass("area")}
          aria-pressed={active === "area"}
        >
          <span className="text-[11px]">
            ▱
          </span>

          <span className="whitespace-nowrap text-[9px] font-semibold">
            {t("area")}
          </span>
        </button>

        <button
          type="button"
          onClick={() =>
            activate("profile")
          }
          className={buttonClass(
            "profile"
          )}
          aria-pressed={
            active === "profile"
          }
        >
          <span className="text-[11px]">
            📈
          </span>

          <span className="whitespace-nowrap text-[9px] font-semibold">
            {t("profile")}
          </span>
        </button>
      </div>

      <p className="mt-1.5 text-[9px] leading-snug text-muted2">
        {active ? (
          <>
            {t("measurement_click")} ·{" "}
            <b className="text-teal">
              {t(
                "measurement_double_click"
              )}
            </b>{" "}
            {t("measurement_finish")} ·{" "}
            <b className="text-teal">
              Esc
            </b>{" "}
            {t("measurement_cancel")}

            {needsTerrain &&
              terrainOff && (
                <span className="mt-1 block rounded-md border border-amber/40 bg-amber/10 px-1.5 py-1 text-amber">
                  ⚠{" "}
                  {t("terrain_required")}
                </span>
              )}
          </>
        ) : (
          t("measurement_select")
        )}
      </p>
    </div>
  );
}

export default function ControlPanel() {
  const { t } = useI18n();

  const [open, setOpen] =
    useState(false);

  const [collapsedGroups, setCollapsedGroups] =
    useState<Record<string, boolean>>(
      () =>
        Object.fromEntries(
          GROUPS.map((g) => [
            g.titleKey,
            true,
          ])
        )
    );

  const toggleGroup = (
    key: string
  ) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <>
      {/* OPEN BUTTON */}
      {!open && (
        <button
          id="tour-menu"
          onClick={() => setOpen(true)}
          className="absolute left-4 top-[70px] z-[15] flex items-center gap-2 rounded-xl border border-stroke bg-panel/90 px-3 py-2 text-[11px] font-bold text-ink shadow-[0_8px_25px_rgba(0,0,0,.35)] backdrop-blur-xl transition-colors hover:bg-panel"
        >
          <svg
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* PANEL */}
      {open && (
        <aside className="absolute bottom-11 left-4 top-[70px] z-[15] flex w-[285px] min-w-0 flex-col overflow-hidden rounded-2xl border border-stroke bg-panel/90 shadow-[0_18px_50px_rgba(0,0,0,.45)] backdrop-blur-xl max-md:inset-x-2.5 max-md:bottom-auto max-md:top-16 max-md:max-h-[52%] max-md:w-auto">
          {/* HEADER */}
          <div className="border-b border-strokeSoft px-3 pb-2 pt-3">
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <div className="text-[9.5px] font-bold uppercase tracking-[1.2px] text-teal">
                  {t("eyebrow")}
                </div>

                <p className="mt-1 text-[10px] leading-snug text-muted">
                  {t("panelsub")}
                </p>
              </div>

              <button
                onClick={() =>
                  setOpen(false)
                }
                aria-label="Close panel"
                className="ml-2 rounded-lg px-1.5 py-0.5 text-base leading-none text-muted transition-colors hover:bg-stroke hover:text-ink"
              >
                ×
              </button>
            </div>
          </div>

          {/* CONTENT */}
          <div className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-1.5 pb-2 pt-1">
            <TerrainControl />

            <MeasurementControl />

            {/* DATA LAYER */}
            <div 
              id="tour-data-layer"
              className="m-1.5 mt-1.5 min-w-0 rounded-xl border border-strokeSoft bg-gradient-to-br from-teal/10 to-teal/[0.02] p-2">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-ink">
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="#2FA6A0"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect
                    x="4"
                    y="4"
                    width="16"
                    height="16"
                    rx="2"
                  />
                  <path d="M8 8h8" />
                  <path d="M8 12h8" />
                  <path d="M8 16h5" />
                </svg>

                <span>
                  {t("data_layer")}
                </span>
              </div>

              <div className="mt-1.5 min-w-0">
                {GROUPS.map((g) => {
                  const collapsed =
                    collapsedGroups[
                      g.titleKey
                    ];

                  return (
                    <div
                      key={g.titleKey}
                      className="mb-0.5 min-w-0 last:mb-0"
                    >
                      {/* GROUP HEADER */}
                      <button
                        type="button"
                        onClick={() =>
                          toggleGroup(
                            g.titleKey
                          )
                        }
                        aria-expanded={
                          !collapsed
                        }
                        className="flex w-full min-w-0 items-center gap-1.5 rounded-lg px-1 py-1.5 text-left transition-colors hover:bg-teal/[0.07]"
                      >
                        <span
                          className="h-[6px] w-[6px] flex-none rounded-[2px]"
                          style={{
                            background:
                              g.dot,
                          }}
                        />

                        <span className="min-w-0 flex-1 truncate text-[9.5px] font-bold uppercase tracking-wide text-muted2">
                          {t(g.titleKey)}
                        </span>

                        <svg
                          viewBox="0 0 24 24"
                          width="12"
                          height="12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`flex-none text-muted2 transition-transform duration-200 ${
                            collapsed
                              ? ""
                              : "rotate-90"
                          }`}
                        >
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </button>

                      {/* LAYERS */}
                      {!collapsed && (
                        <div className="mt-0 min-w-0">
                          {g.layers.map(
                            (l) => (
                              <LayerRow
                                key={l.id}
                                l={l}
                              />
                            )
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
