export const R2 = process.env.NEXT_PUBLIC_R2_BASE_URL ?? "";

const GITHUB_RAW =
  "https://raw.githubusercontent.com/kusumarumy/web_timorleste/main";

const v = (name: string) =>
  `${GITHUB_RAW}/public/data/${name}.geojson`;

const r2Vector = (name: string) =>
  `${R2}/vector/${name}.geojson`;

export const MAP = {
  centerUTM: [773279.2384, 8989643.1798],
  center: [125.52550, -9.18448] as [number, number],
  zoom: 12,
  pitch: 18,
  bearing: -18,
  maxPitch: 85,
};

export type Basemap = { id: string; labelKey: string; tiles: string[]; attribution: string; minzoom?: number; maxzoom?: number; };
export const BASEMAPS: Basemap[] = [
  { id: "map", labelKey: "bm_map", tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"], attribution: "© OpenStreetMap" },
  { id: "sat", labelKey: "bm_sat", tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"], attribution: "Esri, Maxar" },
  {
    id: "ortho",
    labelKey: "bm_ortho",
    tiles: [`${R2}/orthophoto/tiles/{z}/{x}/{y}.jpg`],
    attribution: "Orthophoto",
    minzoom: 13,
  maxzoom: 17,
  },
  { id: "dark", labelKey: "bm_dark", tiles: ["https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"], attribution: "© CARTO © OSM" },
  { id: "hybrid", labelKey: "bm_hybrid", tiles: ["https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"], attribution: "© Google Maps" },
  { id: "streets", labelKey: "bm_streets", tiles: ["https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"], attribution: "© Google Maps" },
  { id: "opentopo", labelKey: "bm_opentopo", tiles: ["https://tile.opentopomap.org/{z}/{x}/{y}.png"], attribution: "© OpenTopoMap" },
  { id: "light", labelKey: "bm_light", tiles: ["https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"], attribution: "© CARTO" },
];
export const TERRAIN_OPTIONS = {
  aws: {
    id: "aws",
    label: "AWS Terrarium",
    tiles: ["https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"],
    encoding: "terrarium" as const,
    maxzoom: 14,
    adjustable: true,   // exaggeration bisa diatur
  },
  r2: {
    id: "r2",
    label: "DEM Pengukuran",
    tiles: [`${R2}/dtm/{z}/{x}/{y}.png`],
    encoding: "mapbox" as const,
    maxzoom: 15,
    adjustable: false,  // exaggeration terkunci
  },
} as const;

export type TerrainKey = keyof typeof TERRAIN_OPTIONS; // "aws" | "r2"

// exaggeration tetap untuk DEM yang tidak bisa diatur
export const FIXED_EXAGGERATION = 1;

export type LayerKind = "raster" | "fill" | "line" | "circle";
export interface LayerDef {
  id: string;
  nameKey: string;
  subKey?: string;
  kind: LayerKind;
  data?: string;
  tiles?: string[];
  minzoom?: number;
maxzoom?: number;
  paint: Record<string, unknown>;
  defaultOn: boolean;
  opacity?: number;
  opacityProp?: string;
  legend?: { color: string; line?: boolean; circle?: boolean };
  clickable?: boolean;
  sublayers?: {
    id: string;
    labelKey: string;
    filterValue: string;
  }[];
}

export interface LayerGroup {
  titleKey: string;
  dot: string;
  layers: LayerDef[];
}

export const GROUPS: LayerGroup[] = [
// AREA OF INTEREST
  {
    titleKey: "g_aoi",
    dot: "#B56BE3",
    layers: [
      {
        id: "aoi_photo",
        nameKey: "l_aoi_photo",
        kind: "fill",
        data: v("aoi_photo"),
        paint: {
          "fill-color": "#D6C45A",
          "fill-opacity": 0.42,
          "fill-outline-color": "#D6C45A",
        },
        defaultOn: true,
        opacity: 0.42,
        opacityProp: "fill-opacity",
        legend: { color: "#D6C45A" },
      },
      {
        id: "aoi_lidar",
        nameKey: "l_aoi_lidar",
        kind: "fill",
        data: v("aoi_lidar"),
        clickable: true,
        paint: {
          "fill-color": "#D6C45A",
          "fill-opacity": 0.42,
          "fill-outline-color": "#D6C45A",
        },
        defaultOn: false,
        opacity: 0.42,
        opacityProp: "fill-opacity",
        legend: { color: "#D6C45A" },
      },
    ],
  },
  // ADMINISTRASI
  {
    titleKey: "g_admin",
    dot: "#E39A4A",
    layers: [
      {
  id: "desa",
  nameKey: "l_desa",
  kind: "line",
  data: v("desa"),
  paint: {
    "line-color": "#D67B45",
    "line-width": 2,
    "line-opacity": 1,
  },
  defaultOn: false,
  legend: { color: "#D67B45", line: true },
},
{
  id: "posto",
  nameKey: "l_posto",
  kind: "line",
  data: v("posto"),
  paint: {
    "line-color": "#C45B5B",
    "line-width": 2.5,
    "line-opacity": 1,
  },
  defaultOn: false,
  legend: { color: "#C45B5B", line: true },
},
{
  id: "kotamadya",
  nameKey: "l_kotamadya",
  kind: "line",
  data: v("kotamadya"),
  paint: {
    "line-color": "#A94442",
    "line-width": 3,
    "line-opacity": 1,
  },
  defaultOn: false,
  legend: { color: "#A94442", line: true },
},
{
  id: "negara",
  nameKey: "l_negara",
  kind: "line",
  data: v("negara"),
  paint: {
    "line-color": "#E39A4A",
    "line-width": 3.5,
    "line-opacity": 1,
  },
  defaultOn: false,
  legend: { color: "#E39A4A", line: true },
},
    ],
  },
  // KONTUR
  {
    titleKey: "g_contour",
    dot: "#660000",
    layers: [
      {
        id: "cmay",
        nameKey: "l_cmay",
        kind: "line",
        data: r2Vector("contour_mayor"),
        paint: {
          "line-color": "#660000",
          "line-width": 1.3,
          "line-opacity": 0.7,
        },
        defaultOn: false,
        legend: { color: "#660000", line: true },
      },
      {
        id: "cmin",
        nameKey: "l_cmin",
        kind: "line",
        data: r2Vector("contour_minor"),
        paint: {
          "line-color": "#994C00",
          "line-width": 0.6,
          "line-opacity": 0.5,
        },
        defaultOn: false,
        legend: { color: "#994C00", line: true },
      },
    ],
  },
  // JARINGAN
  {
    titleKey: "g_net",
    dot: "#E7C46B",
    layers: [
      {
        id: "road",
        nameKey: "l_road",
        kind: "line",
        data: v("road"),
        clickable: true,
        paint: {
          "line-color": "#E7C46B",
          "line-width": 2.4,
          "line-dasharray": [2, 1.2],
        },
        defaultOn: false,
        legend: { color: "#E7C46B", line: true },
      },
    ],
  },

  // HIDROLOGI
  {
    titleKey: "g_hydro",
    dot: "#4AA6E0",
    layers: [
      {
        id: "river",
        nameKey: "l_river",
        kind: "line",
        data: v("river"),
        clickable: true,
        paint: {
          "line-color": "#4AA6E0",
          "line-width": 3,
          "line-opacity": 0.9,
        },
        defaultOn: false,
        legend: { color: "#4AA6E0", line: true },
      },
      {
        id: "weir",
        nameKey: "l_weir",
        kind: "line",
        data: v("weir"),
        clickable: true,
        paint: {
          "line-color": "#367FA8",
          "line-width": 2,
        },
        defaultOn: false,
        legend: { color: "#367FA8", line: true },
      },
      {
        id: "rainfall",
        nameKey: "l_rainfall",
        kind: "line",
        data: v("rainfall"),
        clickable: true,
        paint: {
          "line-color": "#7B61A8",
          "line-width": 2,
        },
        defaultOn: false,
        legend: { color: "#7B61A8", line: true },
      },
      {
  id: "irrigation_point",
  nameKey: "l_irrigation_point",
  kind: "circle",
  data: v("irrigation_point"),
  clickable: true,
  paint: {
    "circle-color": "#F28C52",
    "circle-radius": 5,
    "circle-stroke-color": "#FFFFFF",
    "circle-stroke-width": 1.5,
  },
  defaultOn: false,
  legend: { color: "#F28C52", circle: true },
},
      {
        id: "irrigation",
        nameKey: "l_irrigation",
        kind: "line",
        data: v("irrigation"),
        clickable: true,
        paint: {
          "line-color": "#45A88A",
          "line-width": 2,
        },
        defaultOn: false,
        legend: { color: "#45A88A", line: true },
      },
      {
        id: "catchment",
        nameKey: "l_catchment",
        kind: "fill",
        data: v("catchment"),
        clickable: true,
        paint: {
          "fill-color": "#5A9BD5",
          "fill-opacity": 0.25,
          "fill-outline-color": "#5A9BD5",
        },
        defaultOn: false,
        opacity: 0.25,
        opacityProp: "fill-opacity",
        legend: { color: "#5A9BD5" },
      },
      {
        id: "watershed",
        nameKey: "l_watershed",
        kind: "fill",
        data: v("watershed"),
        clickable: true,
        paint: {
          "fill-color": "#3B82C4",
          "fill-opacity": 0.35,
          "fill-outline-color": "#3B82C4",
        },
        defaultOn: false,
        opacity: 0.35,
        opacityProp: "fill-opacity",
        legend: { color: "#3B82C4" },
      },
    ],
  },
  // TUTUPAN LAHAN
  {
    titleKey: "g_land",
    dot: "#3FB27A",
    layers: [
      {
        id: "sugarcane",
        nameKey: "l_sugarcane",
        kind: "fill",
        data: v("sugarcane"),
        clickable: true,
        paint: {
          "fill-color": "#D6C45A",
          "fill-opacity": 0.42,
          "fill-outline-color": "#D6C45A",
        },
        defaultOn: false,
        opacity: 0.42,
        opacityProp: "fill-opacity",
        legend: { color: "#D6C45A" },
      },
      {
        id: "urban",
        nameKey: "l_urban",
        kind: "fill",
        data: v("urban"),
        clickable: true,
        paint: {
          "fill-color": "#C95B5B",
          "fill-opacity": 0.42,
          "fill-outline-color": "#C95B5B",
        },
        defaultOn: false,
        opacity: 0.42,
        opacityProp: "fill-opacity",
        legend: { color: "#C95B5B" },
      },
      {
        id: "ricefield",
        nameKey: "l_ricefield",
        kind: "fill",
        data: v("ricefield"),
        clickable: true,
        paint: {
          "fill-color": "#D8B24A",
          "fill-opacity": 0.42,
          "fill-outline-color": "#D8B24A",
        },
        defaultOn: false,
        opacity: 0.42,
        opacityProp: "fill-opacity",
        legend: { color: "#D8B24A" },
      },
      {
        id: "ricefield_8di",
        nameKey: "l_ricefield_8di",
        kind: "fill",
        data: v("ricefield_8di"),
        clickable: true,

        paint: {
          "fill-color": "#D8B24A",
          "fill-opacity": 0.42,
          "fill-outline-color": "#D8B24A",
        },

        defaultOn: false,
        opacity: 0.42,
        opacityProp: "fill-opacity",

        legend: { color: "#D8B24A" },

        sublayers: [
          {
            id: "akadiru_kede",
            labelKey: "di_akadiru_kede",
            filterValue: "AKADIRU KEDE",
          },
          {
            id: "buiha",
            labelKey: "di_buiha",
            filterValue: "BUIHA",
          },
          {
            id: "kakeulaku",
            labelKey: "di_kakeulaku",
            filterValue: "KAKEULAKU",
          },
          {
            id: "lias",
            labelKey: "di_lias",
            filterValue: "LIAS",
          },
          {
            id: "luan_kadoe",
            labelKey: "di_luan_kadoe",
            filterValue: "LUAN KADOE",
          },
          {
            id: "oebaba",
            labelKey: "di_oebaba",
            filterValue: "OEBABA",
          },
          {
            id: "paulata",
            labelKey: "di_paulata",
            filterValue: "PAULATA",
          },
          {
            id: "raibere",
            labelKey: "di_raibere",
            filterValue: "RAIBRE",
          },
        ],
      },
      {
        id: "waterbody",
        nameKey: "l_waterbody",
        kind: "fill",
        data: v("waterbody"),
        clickable: true,
        paint: {
          "fill-color": "#4AA6E0",
          "fill-opacity": 0.42,
          "fill-outline-color": "#4AA6E0",
        },
        defaultOn: false,
        opacity: 0.42,
        opacityProp: "fill-opacity",
        legend: { color: "#4AA6E0" },
      },
      {
        id: "ground",
        nameKey: "l_ground",
        kind: "fill",
        data: v("ground"),
        clickable: true,
        paint: {
          "fill-color": "#A9825B",
          "fill-opacity": 0.42,
          "fill-outline-color": "#A9825B",
        },
        defaultOn: false,
        opacity: 0.42,
        opacityProp: "fill-opacity",
        legend: { color: "#A9825B" },
      },
      {
        id: "palm",
        nameKey: "l_palm",
        kind: "fill",
        data: v("palm"),
        clickable: true,
        paint: {
          "fill-color": "#5E9C52",
          "fill-opacity": 0.42,
          "fill-outline-color": "#5E9C52",
        },
        defaultOn: false,
        opacity: 0.42,
        opacityProp: "fill-opacity",
        legend: { color: "#5E9C52" },
      },
      {
        id: "highveg",
        nameKey: "l_highveg",
        kind: "fill",
        data: v("highveg"),
        clickable: true,
        paint: {
          "fill-color": "#287A45",
          "fill-opacity": 0.42,
          "fill-outline-color": "#287A45",
        },
        defaultOn: false,
        opacity: 0.42,
        opacityProp: "fill-opacity",
        legend: { color: "#287A45" },
      },
      {
        id: "lowveg",
        nameKey: "l_lowveg",
        kind: "fill",
        data: v("lowveg"),
        clickable: true,
        paint: {
          "fill-color": "#8BBE63",
          "fill-opacity": 0.42,
          "fill-outline-color": "#8BBE63",
        },
        defaultOn: false,
        opacity: 0.42,
        opacityProp: "fill-opacity",
        legend: { color: "#8BBE63" },
      },
      {
        id: "building",
        nameKey: "l_building",
        kind: "fill",
        data: v("building"),
        clickable: true,
        paint: {
          "fill-color": "#8A6F8F",
          "fill-opacity": 0.42,
          "fill-outline-color": "#8A6F8F",
        },
        defaultOn: false,
        opacity: 0.42,
        opacityProp: "fill-opacity",
        legend: { color: "#8A6F8F" },
      },
      {
        id: "forestprotected",
        nameKey: "l_forestprotected",
        kind: "line",
        data: v("forestprotected"),
        paint: {
          "line-color": "#26734D",
          "line-width": 2,
          "line-dasharray": [3, 2],
        },
        defaultOn: false,
        legend: { color: "#26734D", line: true },
      },
    ],
  },
];

export const ALL_LAYERS: LayerDef[] = GROUPS.flatMap((g) => g.layers);
