export const R2 = process.env.NEXT_PUBLIC_R2_BASE_URL ?? "";

const GITHUB_RAW =
  "https://raw.githubusercontent.com/kusumarumy/web_timorleste/main";

const v = (name: string) =>
  `${GITHUB_RAW}/public/data/${name}.geojson`;

const r2Vector = (name: string) =>
  `${R2}/vector/${name}.geojson`;

export const MAP = {
  centerUTM: [773279.2384, 8989643.1798],
  center: [125.58, -9.18448] as [number, number],
  zoom: 11,
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

export const FIXED_EXAGGERATION = 1;

export type LayerKind = "raster" | "fill" | "line" | "circle" | "symbol";
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
  svg?: {
    size: number;
    svg: string;
  };
  defaultOn: boolean;
  opacity?: number;
  opacityProp?: string;
  legend?: { color: string; line?: boolean; circle?: boolean; svg?: string; };
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
    dot: "#F2D45C",

    layers: [
      {
        id: "aoi_photo",
        nameKey: "l_aoi_photo",
        kind: "fill",
        data: v("aoi_photo"),

        paint: {
          "fill-color": "#F2D45C",
          "fill-opacity": 0.42,
          "fill-outline-color": "#F2D45C",
        },

        defaultOn: true,

        opacity: 0.42,
        opacityProp: "fill-opacity",

        legend: {
          color: "#F2D45C",
        },
      },

      {
        id: "aoi_lidar",
        nameKey: "l_aoi_lidar",
        kind: "fill",
        data: v("aoi_lidar"),
        clickable: true,

        paint: {
          "fill-color": "#F2D45C",
          "fill-opacity": 0.25,
          "fill-outline-color": "#F2D45C",
        },

        defaultOn: false,

        opacity: 0.25,
        opacityProp: "fill-opacity",

        legend: {
          color: "#F2D45C",
        },
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
        "line-color": "#E53935",
        "line-width": 1.2,
        "line-dasharray": [8, 4],
        "line-opacity": 1,
      },

      defaultOn: false,

      legend: {
        color: "#E53935",
        line: true,
      },
    },

    {
      id: "posto",
      nameKey: "l_posto",
      kind: "line",
      data: v("posto"),

      paint: {
        "line-color": "#FF6B6B",
        "line-width": 1.6,
        "line-dasharray": [10, 5],
        "line-opacity": 1,
      },

      defaultOn: false,

      legend: {
        color: "#FF6B6B",
        line: true,
      },
    },

    {
      id: "kotamadya",
      nameKey: "l_kotamadya",
      kind: "line",
      data: v("kotamadya"),

      paint: {
        "line-color": "#A66DD4",
        "line-width": 2,
        "line-dasharray": [12, 5],
        "line-opacity": 1,
      },

      defaultOn: false,

      legend: {
        color: "#A66DD4",
        line: true,
      },
    },

    {
      id: "negara",
      nameKey: "l_negara",
      kind: "line",
      data: v("negara"),

      paint: {
        "line-color": "#F39C12",
        "line-width": 2.4,
        "line-dasharray": [14, 7],
        "line-opacity": 1,
      },

      defaultOn: false,

      legend: {
        color: "#F39C12",
        line: true,
      },
    },
  ],
},
  // KONTUR
  {
  titleKey: "g_contour",
  dot: "#A00000",

  layers: [
    {
      id: "cmay",
      nameKey: "l_cmay",
      kind: "line",
      data: r2Vector("contour_mayor"),

      paint: {
        "line-color": "#7A1E1A",
        "line-width": 1.2,
        "line-opacity": 0.9,
      },

      defaultOn: false,

      legend: {
        color: "#7A1E1A",
        line: true,
      },
    },

    {
      id: "cmin",
      nameKey: "l_cmin",
      kind: "line",
      data: r2Vector("contour_minor"),

      paint: {
        "line-color": "#A86A1A",
        "line-width": 0.6,
        "line-dasharray": [6, 3],
        "line-opacity": 0.75,
      },

      defaultOn: false,

      legend: {
        color: "#A86A1A",
        line: true,
      },
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
        "line-color": "#E1B94A",
        "line-width": 2.2,
        "line-opacity": 1,
      },

      defaultOn: false,

      legend: {
        color: "#E1B94A",
        line: true,
      },
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
      kind: "fill",
      data: v("river"),
      clickable: true,

      paint: {
        "line-color": "#4AA6E0",
        "line-width": 2.2,
        "line-opacity": 1,
      },

      defaultOn: false,

      legend: {
        color: "#4AA6E0",
        line: true,
      },
    },

    {
      id: "weir",
      nameKey: "l_weir",
      kind: "line",
      data: v("weir"),
      clickable: true,

      paint: {
        "line-color": "#2C7FB8",
        "line-width": 1.6,
        "line-dasharray": [6, 3],
        "line-opacity": 1,
      },

      defaultOn: false,

      legend: {
        color: "#2C7FB8",
        line: true,
      },
    },
{
      id: "rainfall",
      nameKey: "l_rainfall",
      kind: "symbol",
      data: v("rainfall"),
      clickable: true,

      paint: {},

      svg: {
        size: 18,
        svg: `
          <svg xmlns="http://www.w3.org/2000/svg"
               width="10"
               height="10"
               viewBox="0 0 10 10">
            <path
              d="M24 3
                 C24 3 9 21 9 31
                 C9 39 15.7 45 24 45
                 C32.3 45 39 39 39 31
                 C39 21 24 3 24 3Z"
              fill="#7B61A8"
              stroke="#FFFFFF"
              stroke-width="2"/>
            <path
              d="M24 18
                 C24 18 17 27 17 31
                 C17 35 20 37 24 37
                 C28 37 31 35 31 31
                 C31 27 24 18 24 18Z"
              fill="none"
              stroke="#FFFFFF"
              stroke-width="2"/>
          </svg>
        `,
      },

      defaultOn: false,

      legend: {
        color: "#7B61A8",
        svg: "rainfall",
      },
    },

    // POINT — SVG
    {
      id: "irrigation_point",
      nameKey: "l_irrigation_point",
      kind: "symbol",
      data: v("irrigation_point"),
      clickable: true,

      paint: {},

      svg: {
        size: 20,
        svg: `
          <svg xmlns="http://www.w3.org/2000/svg"
               width="10"
               height="10"
               viewBox="0 0 10 10">

            <circle
              cx="24"
              cy="24"
              r="19"
              fill="none"
              stroke="#F28C52"
              stroke-width="5"/>

            <circle
              cx="24"
              cy="24"
              r="6"
              fill="#F28C52"/>

            <path
              d="M24 5V14
                 M24 34V43
                 M5 24H14
                 M34 24H43"
              stroke="#F28C52"
              stroke-width="5"
              stroke-linecap="round"/>

          </svg>
        `,
      },

      defaultOn: false,

      legend: {
        color: "#F28C52",
        svg: "irrigation_point",
      },
    },

    {
      id: "irrigation",
      nameKey: "l_irrigation",
      kind: "line",
      data: v("irrigation"),
      clickable: true,

      paint: {
        "line-color": "#45A88A",
        "line-width": 1.6,
        "line-opacity": 1,
      },

      defaultOn: false,

      legend: {
        color: "#45A88A",
        line: true,
      },
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

  legend: {
    color: "#5A9BD5",
  },

  sublayers: [
    {
      id: "catchment_dam_1",
      labelKey: "catchment_dam_1",
      filterValue: "Catchment Area DAM 1",
    },
    {
      id: "catchment_dam_2",
      labelKey: "catchment_dam_2",
      filterValue: "Catchment Area DAM 2",
    },
    {
      id: "catchment_dam_3",
      labelKey: "catchment_dam_3",
      filterValue: "Catchment Area DAM 3",
    },
    {
      id: "catchment_oebaba",
      labelKey: "catchment_oebaba",
      filterValue: "Catchment Area Oebaba",
    },
  ],
},

    {
      id: "watershed",
      nameKey: "l_watershed",
      kind: "fill",
      data: v("watershed"),
      clickable: true,

      paint: {
        "fill-color": "#3B82C4",
        "fill-opacity": 0.20,
        "fill-outline-color": "#3B82C4",
      },

      defaultOn: false,

      opacity: 0.20,
      opacityProp: "fill-opacity",

      legend: {
        color: "#3B82C4",
      },
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
        "fill-color": "#F2D45C",
        "fill-opacity": 0.35,
        "fill-outline-color": "#F2D45C",
      },

      defaultOn: false,

      opacity: 0.35,
      opacityProp: "fill-opacity",

      legend: {
        color: "#F2D45C",
      },
    },

    {
      id: "urban",
      nameKey: "l_urban",
      kind: "fill",
      data: v("urban"),
      clickable: true,

      paint: {
        "fill-color": "#E57373",
        "fill-opacity": 0.35,
        "fill-outline-color": "#E57373",
      },

      defaultOn: false,

      opacity: 0.35,
      opacityProp: "fill-opacity",

      legend: {
        color: "#E57373",
      },
    },

    {
      id: "ricefield",
      nameKey: "l_ricefield",
      kind: "fill",
      data: v("ricefield"),
      clickable: true,

      paint: {
        "fill-color": "#D8B24A",
        "fill-opacity": 0.35,
        "fill-outline-color": "#D8B24A",
      },

      defaultOn: false,

      opacity: 0.35,
      opacityProp: "fill-opacity",

      legend: {
        color: "#D8B24A",
      },
    },

    {
      id: "ricefield_8di",
      nameKey: "l_ricefield_8di",
      kind: "fill",
      data: v("ricefield_8di"),
      clickable: true,

      paint: {
        "fill-color": "#D8B24A",
        "fill-opacity": 0.35,
        "fill-outline-color": "#D8B24A",
      },

      defaultOn: false,

      opacity: 0.35,
      opacityProp: "fill-opacity",

      legend: {
        color: "#D8B24A",
      },

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
        "fill-opacity": 0.40,
        "fill-outline-color": "#4AA6E0",
      },

      defaultOn: false,

      opacity: 0.40,
      opacityProp: "fill-opacity",

      legend: {
        color: "#4AA6E0",
      },
    },

    {
      id: "ground",
      nameKey: "l_ground",
      kind: "fill",
      data: v("ground"),
      clickable: true,

      paint: {
        "fill-color": "#C9B89C",
        "fill-opacity": 0.35,
        "fill-outline-color": "#C9B89C",
      },

      defaultOn: false,

      opacity: 0.35,
      opacityProp: "fill-opacity",

      legend: {
        color: "#C9B89C",
      },
    },

    {
      id: "palm",
      nameKey: "l_palm",
      kind: "fill",
      data: v("palm"),
      clickable: true,

      paint: {
        "fill-color": "#6DB86D",
        "fill-opacity": 0.35,
        "fill-outline-color": "#6DB86D",
      },

      defaultOn: false,

      opacity: 0.35,
      opacityProp: "fill-opacity",

      legend: {
        color: "#6DB86D",
      },
    },

    {
      id: "highveg",
      nameKey: "l_highveg",
      kind: "fill",
      data: v("highveg"),
      clickable: true,

      paint: {
        "fill-color": "#2E7D32",
        "fill-opacity": 0.40,
        "fill-outline-color": "#2E7D32",
      },

      defaultOn: false,

      opacity: 0.40,
      opacityProp: "fill-opacity",

      legend: {
        color: "#2E7D32",
      },
    },

    {
      id: "lowveg",
      nameKey: "l_lowveg",
      kind: "fill",
      data: v("lowveg"),
      clickable: true,

      paint: {
        "fill-color": "#A5D66B",
        "fill-opacity": 0.35,
        "fill-outline-color": "#A5D66B",
      },

      defaultOn: false,

      opacity: 0.35,
      opacityProp: "fill-opacity",

      legend: {
        color: "#A5D66B",
      },
    },

    {
      id: "building",
      nameKey: "l_building",
      kind: "fill",
      data: v("building"),
      clickable: true,

      paint: {
        "fill-color": "#8A6F8F",
        "fill-opacity": 0.40,
        "fill-outline-color": "#8A6F8F",
      },

      defaultOn: false,

      opacity: 0.40,
      opacityProp: "fill-opacity",

      legend: {
        color: "#8A6F8F",
      },
    },

    {
      id: "forestprotected",
      nameKey: "l_forestprotected",
      kind: "line",
      data: v("forestprotected"),

      paint: {
        "line-color": "#2E7D32",
        "line-width": 1.6,
        "line-dasharray": [6, 3],
        "line-opacity": 1,
      },

      defaultOn: false,

      legend: {
        color: "#2E7D32",
        line: true,
      },
    },
  ],
},
];

export const ALL_LAYERS: LayerDef[] = GROUPS.flatMap((g) => g.layers);
