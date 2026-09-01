"use client";

import { useMemo } from "react";
import { useI18n } from "@/lib/i18n";
import { useMapStore } from "@/lib/store";
import type { ProfileSample, ProfileSegment } from "@/lib/geotools/measure";

export interface ProfileData {
  samples: ProfileSample[];
  segments: ProfileSegment[];
  total: number;
  elevStart: number;
  elevEnd: number;
  deltaElevation: number;
  slopePercent: number;
  slopeRatio: number | null;
  minElev: number;
  maxElev: number;
  hasCounterSlope: boolean;
}

const W = 300;
const H = 96;
const PAD_L = 32;
const PAD_R = 6;
const PAD_T = 8;
const PAD_B = 16;

function fmtRatio(r: number | null): string {
  if (r == null || !Number.isFinite(r)) return "—";
  return `1 : ${Math.round(r)}`;
}

function fmtDist(m: number): string {
  return m >= 1000 ? `${(m / 1000).toFixed(2)} km` : `${m.toFixed(0)} m`;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-[3px]">
      <span className="text-[11px] text-muted">{label}</span>
      <span className="text-[11.5px] font-bold text-ink">{value}</span>
    </div>
  );
}

function nearest(samples: ProfileSample[], target: number): ProfileSample {
  let best = samples[0];
  let bestDiff = Infinity;
  for (const s of samples) {
    const d = Math.abs(s.dist - target);
    if (d < bestDiff) {
      bestDiff = d;
      best = s;
    }
  }
  return best;
}

function toCsv(samples: ProfileSample[]): string {
  const head = "jarak_m,elevasi_m,lng,lat";
  const body = samples.map(
    (s) =>
      `${s.dist.toFixed(2)},${s.elev.toFixed(3)},${s.lng.toFixed(7)},${s.lat.toFixed(7)}`
  );
  return [head, ...body].join("\n");
}

export default function ProfilePanel({
  data,
  onClose,
  onHoverSample,
}: {
  data: ProfileData | null;
  onClose: () => void;
  onHoverSample?: (sample: ProfileSample | null) => void;
}) {
  const { t } = useI18n();
  const terrainSource = useMapStore((s) => s.terrainSource);

  const geom = useMemo(() => {
    if (!data || data.samples.length < 2) return null;

    const { samples, minElev, maxElev, total } = data;
    const range = Math.max(0.3, maxElev - minElev);
    const yMin = minElev - range * 0.12;
    const yMax = maxElev + range * 0.12;

    const x = (d: number) => PAD_L + (d / total) * (W - PAD_L - PAD_R);
    const y = (e: number) =>
      PAD_T + (1 - (e - yMin) / (yMax - yMin)) * (H - PAD_T - PAD_B);

    const pt = (s: ProfileSample) =>
      `${x(s.dist).toFixed(1)},${y(s.elev).toFixed(1)}`;

    const counter = data.segments
      .filter((sg) => sg.counterSlope)
      .map((sg) => ({
        key: sg.index,
        points: samples
          .filter((s) => s.dist >= sg.from && s.dist <= sg.to)
          .map(pt)
          .join(" "),
      }))
      .filter((c) => c.points.length > 0);

    return {
      path: samples.map(pt).join(" "),
      counter,
      yTop: yMax,
      yBot: yMin,
    };
  }, [data]);

  if (!data || !geom) return null;

  const descending = data.deltaElevation < 0;

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!onHoverSample) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const ratio = (px - PAD_L) / (W - PAD_L - PAD_R);
    if (ratio < 0 || ratio > 1) {
      onHoverSample(null);
      return;
    }
    onHoverSample(nearest(data.samples, ratio * data.total));
  };

  const exportCsv = () => {
    const blob = new Blob([toCsv(data.samples)], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `profil_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="absolute bottom-11 right-4 z-[16] w-[336px] rounded-xl border border-stroke bg-panel/95 p-3 shadow-[0_12px_36px_rgba(0,0,0,.5)] backdrop-blur-xl max-md:left-2.5 max-md:right-2.5 max-md:w-auto">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11.5px] font-bold text-teal">
          {t("profile_title")}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={exportCsv}
            className="rounded-md border border-stroke px-2 py-[3px] text-[10px] font-semibold text-muted transition-colors hover:border-teal/40 hover:text-ink"
          >
            CSV
          </button>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md px-1.5 py-[3px] text-[15px] leading-none text-muted transition-colors hover:bg-stroke hover:text-ink"
          >
            ×
          </button>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        onMouseMove={handleMove}
        onMouseLeave={() => onHoverSample?.(null)}
      >
        <line
          x1={PAD_L}
          y1={PAD_T}
          x2={W - PAD_R}
          y2={PAD_T}
          stroke="#ffffff"
          strokeOpacity={0.07}
        />
        <line
          x1={PAD_L}
          y1={H - PAD_B}
          x2={W - PAD_R}
          y2={H - PAD_B}
          stroke="#ffffff"
          strokeOpacity={0.07}
        />
        <text x={PAD_L - 5} y={PAD_T + 4} textAnchor="end" fontSize={8.5} fill="#8fa3a8">
          {geom.yTop.toFixed(1)}
        </text>
        <text x={PAD_L - 5} y={H - PAD_B + 3} textAnchor="end" fontSize={8.5} fill="#8fa3a8">
          {geom.yBot.toFixed(1)}
        </text>

        <polyline
          points={geom.path}
          fill="none"
          stroke="#2FA6A0"
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
        {geom.counter.map((c) => (
          <polyline
            key={c.key}
            points={c.points}
            fill="none"
            stroke="#EF4444"
            strokeWidth={2.6}
            strokeLinejoin="round"
          />
        ))}

        <text x={PAD_L} y={H - 3} fontSize={8.5} fill="#8fa3a8">
          0
        </text>
        <text x={W - PAD_R} y={H - 3} textAnchor="end" fontSize={8.5} fill="#8fa3a8">
          {fmtDist(data.total)}
        </text>
      </svg>

      <div className="mt-2 border-t border-strokeSoft pt-1.5">
        <Row label={t("profile_length")} value={fmtDist(data.total)} />
        <Row
          label={t("profile_delta")}
          value={`${descending ? "↓" : "↑"} ${Math.abs(data.deltaElevation).toFixed(2)} m`}
        />
        <Row
          label={t("profile_slope")}
          value={`${Math.abs(data.slopePercent).toFixed(2)}%`}
        />
        <Row label={t("profile_ratio")} value={fmtRatio(data.slopeRatio)} />
      </div>

      {data.segments.length > 1 && (
        <div className="mt-1.5 max-h-[88px] overflow-y-auto border-t border-strokeSoft pt-1.5">
          {data.segments.map((sg) => (
            <div
              key={sg.index}
              className={`flex items-center justify-between gap-2 py-[2px] text-[10px] ${
                sg.counterSlope ? "text-red-400" : "text-muted2"
              }`}
            >
              <span>
                {fmtDist(sg.from)} – {fmtDist(sg.to)}
              </span>
              <span>
                {sg.slopePercent > 0 ? "+" : ""}
                {sg.slopePercent.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      )}

      {data.hasCounterSlope && (
        <p className="mt-1.5 text-[9.5px] leading-snug text-red-400">
          ⚠ {t("profile_counter_slope_warn")}
        </p>
      )}

      <p className="mt-1.5 text-[9.5px] leading-snug text-muted2">
        ℹ {t(terrainSource === "r2" ? "profile_note_dtm" : "profile_note_aws")}
      </p>
    </div>
  );
}
