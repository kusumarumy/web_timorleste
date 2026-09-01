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
    const yMax = maxElev
