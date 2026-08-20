// ============================================================================
// src/components/toolMode.ts
// State kecil bersama untuk "tool yang sedang aktif".
// Dipakai MapTools (set) & MapCanvas (baca, utk mematikan popup identify
// saat sedang mengukur). Tidak menyentuh zustand store yang sudah ada.
// ============================================================================
export type ToolMode = null | "distance" | "area";

let _mode: ToolMode = null;
const subs = new Set<(m: ToolMode) => void>();

export const getToolMode = (): ToolMode => _mode;

export const setToolMode = (m: ToolMode): void => {
  _mode = m;
  subs.forEach((f) => f(m));
};

export const onToolMode = (f: (m: ToolMode) => void): (() => void) => {
  subs.add(f);
  return () => subs.delete(f);
};
