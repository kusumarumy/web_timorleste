"use client";
import { useState } from "react";
import { BASEMAPS, GROUPS } from "@/lib/config";
import { useMapStore } from "@/lib/store";
import { useI18n, Lang } from "@/lib/i18n";

export function TopBar() {
  const { t, lang, setLang } = useI18n();
  const { basemap, setBasemap } = useMapStore();
  const langs: Lang[] = ["id", "en", "pt"];
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex h-14 items-center gap-4 bg-gradient-to-b from-bg/95 via-bg/60 to-transparent px-4">
      <div className="pointer-events-auto flex items-center gap-3">
        <div className="flex h-10 items-center">
  <img
    src="https://vectorseek.com/wp-content/uploads/2023/09/Republica-Democratica-Timor-Leste-Logo-Vector.svg-.png"
    alt=" "
    className="h-8 w-auto object-contain"
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
      <div className="pointer-events-auto flex rounded-[11px] border border-stroke bg-white/85 p-[3px] backdrop-blur-md">
        {BASEMAPS.map((b) => (
          <button key={b.id} onClick={() => setBasemap(b.id)}
            className={`rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${basemap === b.id ? "bg-teal text-[#04171a] shadow-[0_1px_6px_rgba(47,166,160,.4)]" : "text-black/70 hover:text-ink"}`}>
            {t(b.labelKey)}
          </button>
        ))}
      </div>
      <div className="pointer-events-auto flex gap-0.5 rounded-[10px] border border-stroke bg-white/85 p-[3px] backdrop-blur-md">
        {langs.map((l) => (
          <button key={l} onClick={() => setLang(l)}
            className={`rounded-[7px] px-2.5 py-1.5 text-[11.5px] font-bold uppercase tracking-wide ${lang === l ? "bg-teal text-ink" : "text-black/70 hover:text-ink"}`}>
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Legend() {
  const { t } = useI18n();
  const { visible } = useMapStore();
  const [open, setOpen] = useState(true);

  const items = GROUPS
    .flatMap((g) => g.layers)
    .filter((l) => l.legend && visible[l.id]);

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
        <div className="flex flex-col gap-2.5 px-3.5 pb-3 pt-2.5">
          {items.map((l) => (
            <div
              key={l.id}
              className="flex items-center gap-2.5 text-[12px] text-ink"
            >
              <span
                className="h-3 w-[18px] flex-none rounded-[3px]"
                style={
                  l.legend!.line
                    ? {
                        height: 0,
                        borderTop: `3px solid ${l.legend!.color}`,
                        borderRadius: 0,
                      }
                    : {
                        background: l.legend!.color,
                      }
                }
              />
              {t(l.nameKey)}
            </div>
          ))}
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
      <span>Lon <b className="text-ink">{lng != null ? lng.toFixed(5) : "—"}</b> · Lat <b className="text-ink">{lat != null ? lat.toFixed(5) : "—"}</b></span>
      <span>{t("zoom")} <b className="text-ink">{zoom.toFixed(1)}</b></span>
      <span>{t("pitch")} <b className="text-ink">{Math.round(pitch)}°</b> · {Math.round(bearing)}°</span>
      <div className="flex-1" />
      <span>{t("crs")}</span>
    </div>
  );
}

export function Loader({ hidden }: { hidden: boolean }) {
  const { t } = useI18n();
  return (
    <div className={`absolute inset-0 z-40 grid place-items-center bg-bg transition-opacity duration-500 ${hidden ? "pointer-events-none opacity-0" : ""}`}>
      <div className="text-center">
        <div className="mx-auto mb-4 h-[46px] w-[46px] animate-spin rounded-full border-[3px] border-stroke border-t-teal" />
        <div className="mb-1.5 font-display text-[15px] font-semibold text-ink">{t("load")}</div>
        <p className="text-[12.5px] tracking-wide text-muted">{t("load2")}</p>
      </div>
    </div>
  );
}
