import proj4 from "proj4";

// 1. Daftarkan definisi EPSG:32751 (WGS 84 / UTM zone 51S)
proj4.defs(
  "EPSG:32751",
  "+proj=utm +zone=51 +south +datum=WGS84 +units=m +no_defs +type=crs"
);

const UTM_51S = "EPSG:32751";
const WGS84 = "EPSG:4326";

/**
 * Transform satu koordinat dari UTM 51S -> WGS84 [lng, lat]
 */
function transformCoordinate(coord: number[]): number[] {
  if (!coord || coord.length < 2) return coord;

  const [x, y] = coord;

  // Lakukan proyeksi dari UTM ke LngLat WGS84
  const [lon, lat] = proj4(UTM_51S, WGS84, [x, y]);

  // Pertahankan koordinat Z/elevation jika ada
  if (coord.length > 2) {
    return [lon, lat, ...coord.slice(2)];
  }

  return [lon, lat];
}

/**
 * Transform koordinat secara rekursif (Menangani Point hingga MultiPolygon)
 */
function transformCoordinates(coords: any): any {
  if (!coords) return coords;

  // Jika berupa pasangan angka [x, y]
  if (
    Array.isArray(coords) &&
    coords.length >= 2 &&
    typeof coords[0] === "number" &&
    typeof coords[1] === "number"
  ) {
    return transformCoordinate(coords);
  }

  // Jika berupa array bertingkat (Polygon, MultiPolygon, dll)
  if (Array.isArray(coords)) {
    return coords.map(transformCoordinates);
  }

  return coords;
}

/**
 * Transform Geometry
 */
function transformGeometry(geometry: any): any {
  if (!geometry) return geometry;

  if (geometry.type === "GeometryCollection") {
    return {
      ...geometry,
      geometries: (geometry.geometries || []).map(transformGeometry),
    };
  }

  return {
    ...geometry,
    coordinates: transformCoordinates(geometry.coordinates),
  };
}

/**
 * Transform Feature
 */
function transformFeature(feature: any): any {
  if (!feature) return feature;
  return {
    ...feature,
    geometry: transformGeometry(feature.geometry),
  };
}

/**
 * Main export function untuk reproject GeoJSON
 */
export function reprojectGeoJSON(geojson: any): any {
  if (!geojson) return geojson;

  if (geojson.type === "FeatureCollection") {
    return {
      ...geojson,
      crs: {
        type: "name",
        properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
      },
      features: (geojson.features || []).map(transformFeature),
    };
  }

  if (geojson.type === "Feature") {
    return transformFeature(geojson);
  }

  return transformGeometry(geojson);
}