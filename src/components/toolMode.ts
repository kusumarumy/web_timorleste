export type ToolMode =
  | "distance"
  | "area"
  | "profile"
  | "elevation"
  | "identify"
  | null;

let _mode: ToolMode = null;

const subs = new Set<(m: ToolMode) => void>();

export const getToolMode = (): ToolMode => _mode;

export const setToolMode = (m: ToolMode): void => {
  if (_mode === m) return;
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
