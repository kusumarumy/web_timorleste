// ============================================================================
// src/components/toolMode.ts
// State kecil bersama untuk tool geospasial yang sedang aktif.
// Dipakai ControlPanel / MapTools / MapCanvas.
//
// length  = pengukuran panjang polygon
// width   = pengukuran lebar polygon
// area    = pengukuran luas polygon
// distance = pengukuran jarak/garis
// ============================================================================

export type ToolMode =
  | null
  | "distance"
  | "length"
  | "width"
  | "area";

let _mode: ToolMode = null;

const subs = new Set<(m: ToolMode) => void>();

export const getToolMode = (): ToolMode => _mode;

export const setToolMode = (m: ToolMode): void => {
  _mode = m;
  subs.forEach((f) => f(m));
};

export const onToolMode = (
  f: (m: ToolMode) => void
): (() => void) => {
  subs.add(f);

  return () => {
    subs.delete(f);
  };
};
