"use client";

import { useMemo } from "react";
import { useI18n } from "@/lib/i18n";
import type { ProfileSample } from "@/lib/geotools/measure";
import type { ProfileSegment } from "@/lib/geotools/measure";

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

const W = 640;
const H = 200;
const PAD_L = 52;
const PAD_R = 14;
const PAD_T = 14;
const PAD_B = 34;

function fmtRatio(ratio: number | null): string {
  if (ratio == null || !Number.isFinite(ratio)) return "—";
  return `1 : ${Math.round(ratio)}`;
}

function fmtDist(m: number): string {
  return m >= 1000 ? `${(m / 1000).toFixed(2)} km` : `${m.toFixed(0)} m`;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[10px] border border-strokeSoft bg-bg/40 px-3 py-2">
      <div className="text-[10px] text-muted2">{label}</div>
      <div className="mt-0.5 text-[15px] font-bold text-ink">{value}</div>
    </div>
  );
}

function nearestSample(
  samples: ProfileSample[],
  target: number
): ProfileSample {
  let best = samples[0];
  let bestDiff = Infinity;
  for (const s of samples) {
    const diff = Math.abs(s.dist - target);
    if (diff < bestDiff) {
      bestDiff = diff;
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

  const geom = useMemo(() => {
    if (!data || data.samples.length < 2) return null;

    const { samples, minElev, maxElev, total } = data;
    const range = Math.max(0.5, maxElev - minElev);
    const yMin = minElev - range * 0.1;
    const yMax = maxElev + range * 0.1;

    const x = (d: number) => PAD_L + (d / total) * (W - PAD_L - PAD_R);
    const y = (e: number) =>
      PAD_T + (1 - (e - yMin) / (yMax - yMin)) * (H - PAD_T - PAD_B);

    const pt = (s: ProfileSample) =>
      `${x(s.dist).toFixed(1)},${y(s.elev).toFixed(1)}`;

    const path = samples.map(pt).join(" ");

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

    const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => ({
      value: yMax - (yMax - yMin) * f,
      y: PAD_T + f * (H - PAD_T - PAD_B),
    }));

    return { path, counter, ticks };
  }, [data]);

  if (!data || !geom) return null;

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!onHoverSample) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const ratio = (px - PAD_L) / (W - PAD_L - PAD_R);
    if (ratio < 0 || ratio > 1) {
      onHoverSample(null);
      return;
    }
    onHoverSample(nearestSample(data.samples, ratio * data.total));
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
    <div className="absolute bottom-11 left-1/2 z-[16] w-[680px] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-2xl border border-stroke bg-panel/95 p-4 shadow-[0_18px_50px_rgba(0,0,0,.5)] backdrop-blur-xl max-md:left-2.5 max-md:right-2.5 max-md:w-auto max-md:translate-x-0">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[13px]">📈</span>
          <span className="text-[13px] font-bold text-ink">
            {t("profile_title")}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={exportCsv}
            className="rounded-lg border border-stroke px-2.5 py-1 text-[10.5px] font-semibold text-muted transition-colors hover:border-teal/40 hover:text-ink"
          >
            CSV
          </button>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg px-2 py-1 text-base leading-none text-muted transition-colors hover:bg-stroke hover:text-ink"
          >
            ×
          </button>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-4 gap-2 max-md:grid-cols-2">
        <Stat label={t("profile_length")} value={fmtDist(data.total)} />
        <Stat
          label={t("profile_delta")}
          value={`${data.deltaElevation.toFixed(2)} m`}
        />
        <Stat
          label={t("profile_slope")}
          value={`${Math.abs(data.slopePercent).toFixed(2)}%`}
        />
        <Stat label={t("profile_ratio")} value={fmtRatio(data.slopeRatio)} />
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        onMouseMove={handleMove}
        onMouseLeave={() => onHoverSample?.(null)}
      >
        {geom.ticks.map((tk, i) => (
          <g key={i}>
            <line
              x1={PAD_L}
              y1={tk.y}
              x2={W - PAD_R}
              y2={tk.y}
              stroke="#ffffff"
              strokeOpacity={0.08}
              strokeWidth={1}
            />
            <text
              x={PAD_L - 8}
              y={tk.y + 4}
              textAnchor="end"
              fontSize={10}
              fill="#8fa3a8"
            >
              {tk.value.toFixed(1)}
            </text>
          </g>
        ))}

        <polyline
          points={geom.path}
          fill="none"
          stroke="#2FA6A0"
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {geom.counter.map((c) => (
          <polyline
            key={c.key}
            points={c.points}
            fill="none"
            stroke="#EF4444"
            strokeWidth={3}
            strokeLinejoin="round"
          />
        ))}

        <text x={PAD_L} y={H - 10} fontSize={10} fill="#8fa3a8">
          0
        </text>
        <text
          x={W - PAD_R}
          y={H - 10}
          textAnchor="end"
          fontSize={10}
          fill="#8fa3a8"
        >
          {fmtDist(data.total)}
        </text>
      </svg>

      <div className="mt-3 max-h-[132px] overflow-y-auto border-t border-strokeSoft pt-2">
        <table className="w-full text-[11px]">
          <tbody>
            {data.segments.map((sg) => (
              <tr
                key={sg.index}
                className={sg.counterSlope ? "text-red-400" : "text-muted"}
              >
                <td className="py-1">
                  {fmtDist(sg.from)} – {fmtDist(sg.to)}
                </td>
                <td className="py-1 text-right">
                  {sg.slopePercent > 0 ? "+" : ""}
                  {sg.slopePercent.toFixed(2)}%
                </td>
                <td className="py-1 text-right">
                  {sg.counterSlope
                    ? t("profile_counter_slope")
                    : fmtRatio(sg.slopeRatio)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-2 text-[10px] leading-snug text-muted2">
        ℹ {t("profile_geoid_note")}
      </p>
    </div>
  );
}
