// ===== Pure geodesy/measurement core — no MapLibre dependency (testable) =====
import proj4 from 'proj4';

// WGS 84 / UTM zone 51S — matches EPSG:32751 shown in the app
proj4.defs('EPSG:32751', '+proj=utm +zone=51 +south +datum=WGS84 +units=m +no_defs +type=crs');
const FWD = proj4('EPSG:4326', 'EPSG:32751');

// [lng, lat] -> [Easting, Northing] in metres (UTM 51S)
export function toUTM([lng, lat]) { const r = FWD.forward([lng, lat]); return [r[0], r[1]]; }
export function toLngLat([e, n]) { const r = FWD.inverse([e, n]); return [r[0], r[1]]; }

const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);

function shoelace(ring) {
  let s = 0;
  for (let i = 0; i < ring.length - 1; i++) s += ring[i][0] * ring[i+1][1] - ring[i+1][0] * ring[i][1];
  return Math.abs(s) / 2;
}

// Convex hull (monotonic chain) on UTM points
function convexHull(pts0) {
  const pts = pts0.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (pts.length < 3) return pts;
  const cross = (o, a, b) => (a[0]-o[0])*(b[1]-o[1]) - (a[1]-o[1])*(b[0]-o[0]);
  const lower = [];
  for (const p of pts) { while (lower.length >= 2 && cross(lower.at(-2), lower.at(-1), p) <= 0) lower.pop(); lower.push(p); }
  const upper = [];
  for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (upper.length >= 2 && cross(upper.at(-2), upper.at(-1), p) <= 0) upper.pop(); upper.push(p); }
  lower.pop(); upper.pop();
  return lower.concat(upper);
}

// Oriented minimum-area bounding rectangle -> panjang (major) x lebar (minor)
export function minAreaRect(utmPts) {
  const h = convexHull(utmPts);
  if (h.length < 3) return h.length === 2 ? { length: dist(h[0], h[1]), width: 0, angle: 0 } : { length: 0, width: 0, angle: 0 };
  let best = { area: Infinity, length: 0, width: 0, angle: 0 };
  for (let i = 0; i < h.length; i++) {
    const p1 = h[i], p2 = h[(i + 1) % h.length];
    const ex = p2[0] - p1[0], ey = p2[1] - p1[1];
    const L = Math.hypot(ex, ey); if (!L) continue;
    const ux = ex / L, uy = ey / L, vx = -uy, vy = ux;
    let minU = Infinity, maxU = -Infinity, minV = Infinity, maxV = -Infinity;
    for (const p of h) {
      const du = p[0]*ux + p[1]*uy, dv = p[0]*vx + p[1]*vy;
      if (du < minU) minU = du; if (du > maxU) maxU = du;
      if (dv < minV) minV = dv; if (dv > maxV) maxV = dv;
    }
    const w = maxU - minU, ht = maxV - minV, area = w * ht;
    if (area < best.area) best = { area, length: Math.max(w, ht), width: Math.min(w, ht), angle: Math.atan2(uy, ux) };
  }
  return best;
}

// k: optional grid->ground multiplier (leave 1 to report pure UTM grid values)
export function measureLine(lngLats, k = 1) {
  if (lngLats.length < 2) return null;
  const utm = lngLats.map(toUTM);
  const segments = [];
  let total = 0;
  for (let i = 1; i < utm.length; i++) { const d = dist(utm[i-1], utm[i]) * k; segments.push(d); total += d; }
  return { total, segments };
}

export function measurePolygon(lngLats, k = 1) {
  if (lngLats.length < 3) return null;
  const utm = lngLats.map(toUTM);
  const ring = [...utm, utm[0]];
  const area = shoelace(ring) * k * k;
  let perimeter = 0;
  for (let i = 1; i < ring.length; i++) perimeter += dist(ring[i-1], ring[i]) * k;
  const rect = minAreaRect(utm);
  return { area, hectare: area / 10000, perimeter, length: rect.length * k, width: rect.width * k, bearing: rect.angle };
}
