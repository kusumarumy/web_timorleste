"use client";

import { useMemo, useState } from "react";
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

// viewBox lebih lebar untuk dock horizontal
const W = 560;
const H = 168;
const PAD_L = 44;
const PAD_R = 14;
const PAD_T = 14;
const PAD_B = 24;

const fmtRatio = (r: number | null) =>
  r == null || !Number.isFinite(r) ? "—" : `1 : ${Math.round(r)}`;
const fmtDist = (m: number) =>
  m >= 1000 ? `${(m / 1000).toFixed(2)} km` : `${m.toFixed(0)} m`;
const fmtElev = (e: number) => `${e.toFixed(2)} m`;

function Row({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-[3px]">
      <span className="text-[11px] text-muted">{label}</span>
      <span className="text-[11.5px] font-bold" style={{ color: accent ?? "var(--ink, #E7EFF3)" }}>
        {value}
      </span>
    </div>
  );
}

function nearest(samples: ProfileSample[], target: number): ProfileSample {
  let best = samples[0];
  let bestDiff = Infinity;
  for (const s of samples) {
    const d = Math.abs(s.dist - target);
    if (d < bestDiff) { bestDiff = d; best = s; }
  }
  return best;
}

function toCsv(samples: ProfileSample[]): string {
  const head = "jarak_m,elevasi_m,lng,lat";
  const body = samples.map(
    (s) => `${s.dist.toFixed(2)},${s.elev.toFixed(3)},${s.lng.toFixed(7)},${s.lat.toFixed(7)}`
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
  const [hover, setHover] = useState<ProfileSample | null>(null);

  // ---- skala + geometri grafik ----
  const geom = useMemo(() => {
    if (!data || data.samples.length < 2) return null;
    const { samples, minElev, maxElev, total } = data;
    const range = Math.max(0.3, maxElev - minElev);
    const yMin = minElev - range * 0.12;
    const yMax = maxElev + range * 0.12;

    const x = (d: number) => PAD_L + (d / total) * (W - PAD_L - PAD_R);
    const y = (e: number) => PAD_T + (1 - (e - yMin) / (yMax - yMin)) * (H - PAD_T - PAD_B);
    const baseY = H - PAD_B;

    const linePts = samples.map((s) => `${x(s.dist).toFixed(1)},${y(s.elev).toFixed(1)}`);
    const areaPath =
      `M ${x(samples[0].dist).toFixed(1)},${baseY} ` +
      samples.map((s) => `L ${x(s.dist).toFixed(1)},${y(s.elev).toFixed(1)}`).join(" ") +
      ` L ${x(samples[samples.length - 1].dist).toFixed(1)},${baseY} Z`;

    const counter = data.segments
      .filter((sg) => sg.counterSlope)
      .map((sg) => ({
        key: sg.index,
        points: samples.filter((s) => s.dist >= sg.from && s.dist <= sg.to)
          .map((s) => `${x(s.dist).toFixed(1)},${y(s.elev).toFixed(1)}`).join(" "),
      }))
      .filter((c) => c.points.length > 0);

    // gridlines Y (5 tick) + label elevasi
    const ticks = 4;
    const gridY = Array.from({ length: ticks + 1 }, (_, i) => {
      const e = yMin + (i / ticks) * (yMax - yMin);
      return { e, y: y(e) };
    });
    // gridlines X (0 / 25 / 50 / 75 / 100 %)
    const gridX = [0, 0.25, 0.5, 0.75, 1].map((r) => ({ d: r * total, x: x(r * total) }));

    // titik min & maks
    let minS = samples[0], maxS = samples[0];
    for (const s of samples) {
      if (s.elev < minS.elev) minS = s;
      if (s.elev > maxS.elev) maxS = s;
    }

    return { x, y, baseY, linePts: linePts.join(" "), areaPath, counter, gridY, gridX, minS, maxS };
  }, [data]);

  // ---- statistik turunan (naik/turun/kemiringan maks) ----
  const stats = useMemo(() => {
    if (!data) return null;
    let gain = 0, loss = 0;
    for (let i = 1; i < data.samples.length; i++) {
      const d = data.samples[i].elev - data.samples[i - 1].elev;
      if (d > 0) gain += d; else loss += -d;
    }
    let steep: ProfileSegment | null = null;
    for (const sg of data.segments) {
      if (!steep || Math.abs(sg.slopePercent) > Math.abs(steep.slopePercent)) steep = sg;
    }
    return { gain, loss, steep };
  }, [data]);

  if (!data || !geom || !stats) return null;

  const descending = data.deltaElevation < 0;

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const ratio = (px - PAD_L) / (W - PAD_L - PAD_R);
    if (ratio < 0 || ratio > 1) { setHover(null); onHoverSample?.(null); return; }
    const s = nearest(data.samples, ratio * data.total);
    setHover(s); onHoverSample?.(s);
  };
  const clearHover = () => { setHover(null); onHoverSample?.(null); };

  const exportCsv = () => {
    const blob = new Blob([toCsv(data.samples)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `profil_${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  // posisi tooltip hover
  const hx = hover ? geom.x(hover.dist) : 0;
  const hy = hover ? geom.y(hover.elev) : 0;
  const tipW = 96, tipH = 34;
  const tipX = Math.min(Math.max(hx - tipW / 2, PAD_L), W - PAD_R - tipW);

  return (
    <div className="absolute bottom-10 left-[336px] right-4 z-[16] mx-auto max-w-[920px] rounded-xl border border-stroke bg-panel/95 p-3 shadow-[0_12px_36px_rgba(0,0,0,.5)] backdrop-blur-xl max-md:left-2 max-md:right-2">
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11.5px] font-bold text-teal">{t("profile_title")}</span>
        <div className="flex items-center gap-1">
          <button onClick={exportCsv}
            className="rounded-md border border-stroke px-2 py-[3px] text-[10px] font-semibold text-muted transition-colors hover:border-teal/40 hover:text-ink">
            CSV
          </button>
          <button onClick={onClose} aria-label="Close"
            className="rounded-md px-1.5 py-[3px] text-[15px] leading-none text-muted transition-colors hover:bg-stroke hover:text-ink">
            ×
          </button>
        </div>
      </div>

      {/* Body: grafik (kiri) + statistik (kanan) */}
      <div className="flex flex-col gap-3 md:flex-row">
        {/* GRAFIK */}
        <div className="min-w-0 flex-1">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full"
            onMouseMove={handleMove} onMouseLeave={clearHover}>
            <defs>
              <linearGradient id="profileFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2FA6A0" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#2FA6A0" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* gridlines Y + label elevasi */}
            {geom.gridY.map((g, i) => (
              <g key={`gy${i}`}>
                <line x1={PAD_L} y1={g.y} x2={W - PAD_R} y2={g.y} stroke="#ffffff" strokeOpacity={0.06} />
                <text x={PAD_L - 6} y={g.y + 3} textAnchor="end" fontSize={8.5} fill="#8fa3a8">
                  {g.e.toFixed(1)}
                </text>
              </g>
            ))}
            {/* gridlines X + label jarak */}
            {geom.gridX.map((g, i) => (
              <g key={`gx${i}`}>
                <line x1={g.x} y1={PAD_T} x2={g.x} y2={geom.baseY} stroke="#ffffff" strokeOpacity={0.04} />
                <text x={g.x} y={H - 6} textAnchor={i === 0 ? "start" : i === geom.gridX.length - 1 ? "end" : "middle"}
                  fontSize={8.5} fill="#8fa3a8">
                  {fmtDist(g.d)}
                </text>
              </g>
            ))}

            {/* area + garis */}
            <path d={geom.areaPath} fill="url(#profileFill)" />
            <polyline points={geom.linePts} fill="none" stroke="#2FA6A0" strokeWidth={1.8} strokeLinejoin="round" />
            {geom.counter.map((c) => (
              <polyline key={c.key} points={c.points} fill="none" stroke="#EF4444" strokeWidth={2.6} strokeLinejoin="round" />
            ))}

            {/* titik maks & min */}
            <circle cx={geom.x(geom.maxS.dist)} cy={geom.y(geom.maxS.elev)} r={3.4} fill="#E0A13A" stroke="#04171a" strokeWidth={1} />
            <circle cx={geom.x(geom.minS.dist)} cy={geom.y(geom.minS.elev)} r={3.4} fill="#4AA6E0" stroke="#04171a" strokeWidth={1} />

            {/* hover: garis panduan + dot + tooltip */}
            {hover && (
              <g>
                <line x1={hx} y1={PAD_T} x2={hx} y2={geom.baseY} stroke="#2FA6A0" strokeOpacity={0.5} strokeDasharray="3 2" />
                <circle cx={hx} cy={hy} r={3.6} fill="#0B1620" stroke="#2FA6A0" strokeWidth={2} />
                <g transform={`translate(${tipX}, ${Math.max(PAD_T, hy - tipH - 6)})`}>
                  <rect width={tipW} height={tipH} rx={5} fill="#101F2C" stroke="#22394A" />
                  <text x={8} y={13} fontSize={9} fill="#8fa3a8">{fmtDist(hover.dist)}</text>
                  <text x={8} y={26} fontSize={11} fontWeight={700} fill="#E7EFF3">{fmtElev(hover.elev)}</text>
                </g>
              </g>
            )}
          </svg>
        </div>

        {/* STATISTIK */}
        <div className="w-full shrink-0 md:w-[210px]">
          <Row label={t("profile_length")} value={fmtDist(data.total)} />
          <Row label={t("profile_delta")}
            value={`${descending ? "↓" : "↑"} ${Math.abs(data.deltaElevation).toFixed(2)} m`} />
          <Row label={t("profile_slope")} value={`${Math.abs(data.slopePercent).toFixed(2)}%`} />
          <Row label={t("profile_ratio")} value={fmtRatio(data.slopeRatio)} />

          <div className="my-1.5 border-t border-strokeSoft" />

          <Row label={t("profile_max")} value={fmtElev(data.maxElev)} accent="#E0A13A" />
          <Row label={t("profile_min")} value={fmtElev(data.minElev)} accent="#4AA6E0" />
          <Row label={t("profile_gain")} value={`↑ ${stats.gain.toFixed(2)} m`} />
          <Row label={t("profile_loss")} value={`↓ ${stats.loss.toFixed(2)} m`} />
          {stats.steep && (
            <Row label={t("profile_max_slope")} value={`${Math.abs(stats.steep.slopePercent).toFixed(1)}%`} />
          )}
        </div>
      </div>

      {/* segmen (opsional, kalau banyak) */}
      {data.segments.length > 1 && (
        <div className="mt-2 max-h-[70px] overflow-y-auto border-t border-strokeSoft pt-1.5">
          <div className="grid grid-cols-2 gap-x-6 md:grid-cols-3">
            {data.segments.map((sg) => (
              <div key={sg.index}
                className={`flex items-center justify-between gap-2 py-[2px] text-[10px] ${sg.counterSlope ? "text-red-400" : "text-muted2"}`}>
                <span>{fmtDist(sg.from)}–{fmtDist(sg.to)}</span>
                <span>{sg.slopePercent > 0 ? "+" : ""}{sg.slopePercent.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.hasCounterSlope && (
        <p className="mt-1.5 text-[9.5px] leading-snug text-red-400">⚠ {t("profile_counter_slope_warn")}</p>
      )}

      <p className="mt-1.5 text-[9.5px] leading-snug text-muted2">
        ℹ {t(terrainSource === "r2" ? "profile_note_dtm" : "profile_note_aws")}
      </p>
    </div>
  );
}
