export type ToolMode =
  | "distance"
  | "length"
  | "width"
  | "area"
  | "elevation"
  | "identify"
  | null;

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
