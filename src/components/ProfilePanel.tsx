"use client";

import { useMemo } from "react";
import { useI18n } from "@/lib/i18n";
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

    const path = samples
      .map((s) => `${x(s.dist).toFixed(1)},${y(s.elev).toFixed(1)}`)
      .join(" ");

    const counter = data.segments
      .filter((sg) => sg.counterSlope)
      .map((sg) => ({
        key: sg.index,
        points: samples
          .filter((s) => s.dist >= sg.from && s.dist <= sg.to)
          .map((s) => `${x(s.dist).toFixed(1)},${y(s.elev).toFixed(1)}`)
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

    const target = ratio * data.total;
    let best = data.samples[0];
    let bestDiff = Infinity;

    for (const s of
