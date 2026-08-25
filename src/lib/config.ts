export const R2 = process.env.NEXT_PUBLIC_R2_BASE_URL ?? "";

const GITHUB_RAW =
  "https://raw.githubusercontent.com/kusumarumy/web_timorleste/main";

const v = (name: string) =>
  `${GITHUB_RAW}/public/data/${name}.geojson`;

const r2Vector = (name: string) =>
  `${R2}/vector/${name}.geojson`;

const ICON_RAW =
  `${GITHUB_RAW}/public/icons`;

const icon = (name: string) =>
  `${ICON_RAW}/${name}.png`;

export const MAP = {
  centerUTM: [773279.2384, 8989643.1798],
  center: [125.48428, -9.15017] as [number, number],
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
  tiles: [`${R2}/orthophoto/tiles/{z}/{x}/{y}.webp`],
  attribution: "Orthophoto",
  minzoom: 13,
  maxzoom: 20,
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
    label: "AWS Terrarium 30 m",
    tiles: ["https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"],
    encoding: "terrarium" as const,
    minzoom: 0,
    maxzoom: 14,
    bounds: [-180, -85.0511, 180, 85.0511],
    adjustable: true,
  },
  r2: {
    id: "r2",
    label: "DTM 3 m",
    tiles: [`${R2}/dtm/{z}/{x}/{y}.png`],
    encoding: "terrarium" as const,
    minzoom: 8,
    maxzoom: 16,
    bounds: [125.3505, -9.2745, 125.6254, -8.9916],
    adjustable: false,
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
  icon?: string;
  label?: {
    field: string;
    minzoom?: number;
    maxzoom?: number;
    spacing?: number;
    size?: number;
    color?: string;
    haloColor?: string;
    haloWidth?: number;
  };
  paint: Record<string, unknown>;
  svg?: {
    size: number;
    svg: string;
  };
  defaultOn: boolean;
  opacity?: number;
  opacityProp?: string;
  legend?: {
    color: string;
    line?: boolean;
    circle?: boolean;
    svg?: string;
  };
  clickable?: boolean;
  sublayers?: {
    id: string;
    labelKey: string;
    filterValue: string;
  }[];
  children?: LayerDef[];
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
      kind: "line",
      data: v("aoi_photo"),
      clickable: true,
      paint: {
        "line-color": "#4DA6FF",
        "line-width": 2.5,
        "line-opacity": 1,
      },

      defaultOn: true,

      legend: {
        color: "#4DA6FF",
        line: true,
      },
    },

    {
      id: "aoi_lidar",
      nameKey: "l_aoi_lidar",
      kind: "line",
      data: v("aoi_lidar"),
      clickable: true,

      paint: {
        "line-color": "#0000FF",
        "line-width": 2.5,
        "line-opacity": 1,
      },

      defaultOn: true,

      legend: {
        color: "#0000FF",
        line: true,
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
  dot: "#7A1E1A",

  layers: [
    {
      id: "contour",
      nameKey: "l_contour",
      kind: "line",
      data: r2Vector("contour"),

      paint: {
        "line-color": "#7A1E1A",
        "line-width": 1.2,
        "line-opacity": 0.9,
      },

      defaultOn: false,

      label: {
        field: "ELEVATION",
        minzoom: 11,
        spacing: 300,
        size: 11,
        color: "#5A1715",
        haloColor: "#FFFFFF",
        haloWidth: 2,
      },

      legend: {
        color: "#7A1E1A",
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
  id: "irrigation_point",
  nameKey: "l_irrigation_point",
  kind: "symbol",
  data: v("irrigation_point"),
  clickable: true,

  icon: icon("irrigation_point"),

  paint: {},

  defaultOn: false,

  label: {
    field: "Name",
    minzoom: 9,
    size: 14,
    color: "#111827",
    haloColor: "#FFFFFF",
    haloWidth: 3,
  },


  legend: {
    color: "#F28C52",
    svg: "irrigation_point",
  },
},
   {
  id: "rainfall",
  nameKey: "l_rainfall",
  kind: "symbol",
  data: v("rainfall"),
  clickable: true,

  icon: icon("rainfall"),

  paint: {},

  defaultOn: false,

  label: {
    field: "NAME",
    minzoom: 10,
    size: 11,
    color: "#111827",
    haloColor: "#FFFFFF",
    haloWidth: 2,
  },

  legend: {
    color: "#7B61A8",
    svg: "rainfall",
  },
}, 
{
  id: "weir",
  nameKey: "l_weir",
  kind: "symbol",
  data: v("weir"),
  clickable: true,

  icon: icon("weir"),

  paint: {},

  defaultOn: false,

  label: {
    field: "Name",
    minzoom: 9,
    size: 14,
    color: "#111827",
    haloColor: "#FFFFFF",
    haloWidth: 3,
  },


  legend: {
    color: "#2C7FB8",
    svg: "weir",
  },
},
 
    {
      id: "irrigation",
      nameKey: "l_irrigation",
      kind: "line",
      data: v("irrigation"),
      clickable: true,

      paint: {},

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
  id: "river",
  nameKey: "l_river",
  kind: "fill",
  data: v("river"),
  clickable: true,

  paint: {
    "fill-color": "#4AA6E0",
    "fill-opacity": 0.65,
    "fill-outline-color": "#4AA6E0",
  },

  defaultOn: false,

  opacity: 0.65,
  opacityProp: "fill-opacity",

  legend: {
    color: "#4AA6E0",
  },
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
  ],
},
    // LAYER GENANGAN
  {
    titleKey: "g_genangan",
    dot: "#3B82F6",

    layers: [
      {
        id: "genangan_titikbor",
        nameKey: "l_genangan_titikbor",
        kind: "circle",
        data: v("genangan_titikbor"),

        paint: {
          "circle-color": "#DC2626",
          "circle-radius": 5,
          "circle-opacity": 1,
          "circle-stroke-color": "#FFFFFF",
          "circle-stroke-width": 1,
        },

        defaultOn: false,

        legend: {
          color: "#DC2626",
          circle: true,
        },
      },

      {
        id: "genangan_titikdesain",
        nameKey: "l_genangan_titikdesain",
        kind: "circle",
        data: v("genangan_titikdesain"),

        paint: {
          "circle-color": "#F59E0B",
          "circle-radius": 5,
          "circle-opacity": 1,
          "circle-stroke-color": "#FFFFFF",
          "circle-stroke-width": 1,
        },

        defaultOn: false,

        legend: {
          color: "#F59E0B",
          circle: true,
        },
      },

      {
        id: "genangan_titikkoordinat",
        nameKey: "l_genangan_titikkoordinat",
        kind: "circle",
        data: v("genangan_titikkoordinat"),

        paint: {
          "circle-color": "#8B5CF6",
          "circle-radius": 5,
          "circle-opacity": 1,
          "circle-stroke-color": "#FFFFFF",
          "circle-stroke-width": 1,
        },

        defaultOn: false,

        legend: {
          color: "#8B5CF6",
          circle: true,
        },
      },

      {
        id: "genangan_titikkupasan",
        nameKey: "l_genangan_titikkupasan",
        kind: "circle",
        data: v("genangan_titikkupasan"),

        paint: {
          "circle-color": "#EF4444",
          "circle-radius": 5,
          "circle-opacity": 1,
          "circle-stroke-color": "#FFFFFF",
          "circle-stroke-width": 1,
        },

        defaultOn: false,

        legend: {
          color: "#EF4444",
          circle: true,
        },
      },
      {
        id: "genangan_garidesain",
        nameKey: "l_genangan_garidesain",
        kind: "line",
        data: v("genangan_garidesain"),

        paint: {
          "line-color": "#F59E0B",
          "line-width": 2,
          "line-opacity": 1,
        },

        defaultOn: false,

        legend: {
          color: "#F59E0B",
          line: true,
        },
      },

      {
        id: "genangan_gariskoordinat",
        nameKey: "l_genangan_gariskoordinat",
        kind: "line",
        data: v("genangan_gariskoordinat"),

        paint: {
          "line-color": "#8B5CF6",
          "line-width": 1.5,
          "line-dasharray": [4, 3],
          "line-opacity": 1,
        },

        defaultOn: false,

        legend: {
          color: "#8B5CF6",
          line: true,
        },
      },

      {
        id: "genangan_gariskupasan",
        nameKey: "l_genangan_gariskupasan",
        kind: "line",
        data: v("genangan_gariskupasan"),

        paint: {
          "line-color": "#EF4444",
          "line-width": 2,
          "line-opacity": 1,
        },

        defaultOn: false,

        legend: {
          color: "#EF4444",
          line: true,
        },
      },

      {
        id: "genangan_garissungai",
        nameKey: "l_genangan_garissungai",
        kind: "line",
        data: v("genangan_garissungai"),

        paint: {
          "line-color": "#2563EB",
          "line-width": 2,
          "line-opacity": 1,
        },

        defaultOn: false,

        legend: {
          color: "#2563EB",
          line: true,
        },
      },
      {
        id: "genangan_areadesain",
        nameKey: "l_genangan_areadesain",
        kind: "fill",
        data: v("genangan_areadesain"),
        clickable: true,

        paint: {
          "fill-color": "#F59E0B",
          "fill-opacity": 0.35,
          "fill-outline-color": "#F59E0B",
        },

        defaultOn: false,

        opacity: 0.35,
        opacityProp: "fill-opacity",

        legend: {
          color: "#F59E0B",
        },
      },
      {
        id: "genangan_areagenangan",
        nameKey: "l_genangan_areagenangan",
        kind: "fill",
        data: v("genangan_areagenangan"),
        clickable: true,

        paint: {
          "fill-color": "#3B82F6",
          "fill-opacity": 0.40,
          "fill-outline-color": "#3B82F6",
        },

        defaultOn: false,

        opacity: 0.40,
        opacityProp: "fill-opacity",

        legend: {
          color: "#3B82F6",
        },
      },

      {
        id: "genangan_areasungai",
        nameKey: "l_genangan_areasungai",
        kind: "fill",
        data: v("genangan_areasungai"),
        clickable: true,

        paint: {
          "fill-color": "#60A5FA",
          "fill-opacity": 0.35,
          "fill-outline-color": "#60A5FA",
        },

        defaultOn: false,

        opacity: 0.35,
        opacityProp: "fill-opacity",

        legend: {
          color: "#60A5FA",
        },
      },
    ],
  },
  // RAIBERE
{
  titleKey: "g_raibere",
  dot: "#EC4899",

  layers: [
    // RAIBERE 2009
    {
      id: "raibere_2009",
      nameKey: "l_raibere_2009",
      kind: "line",
      paint: {},
      defaultOn: false,
    },

    {
      id: "raibere_2026",
      nameKey: "l_raibere_2026",
      kind: "line",
      paint: {},
      defaultOn: false,

      children: [
        {
          id: "rei_access",
          nameKey: "l_rei_access",
          kind: "line",
          data: v("rei_access"),
          clickable: true,
          paint: {
            "line-color": "#78716C",
            "line-width": 2,
          },
          defaultOn: false,
          legend: {
            color: "#78716C",
            line: true,
          },
        },

        {
          id: "rei_crest",
          nameKey: "l_rei_crest",
          kind: "line",
          data: v("rei_crest"),
          clickable: true,
          paint: {
            "line-color": "#7C3AED",
            "line-width": 2,
          },
          defaultOn: false,
          legend: {
            color: "#7C3AED",
            line: true,
          },
        },

        {
          id: "rei_downstream",
          nameKey: "l_rei_downstream",
          kind: "line",
          data: v("rei_downstream"),
          clickable: true,
          paint: {
            "line-color": "#2563EB",
            "line-width": 2,
          },
          defaultOn: false,
          legend: {
            color: "#2563EB",
            line: true,
          },
        },

        {
          id: "rei_flushingpier",
          nameKey: "l_rei_flushingpier",
          kind: "line",
          data: v("rei_flushingpier"),
          clickable: true,
          paint: {
            "line-color": "#0891B2",
            "line-width": 2,
          },
          defaultOn: false,
          legend: {
            color: "#0891B2",
            line: true,
          },
        },

        {
          id: "rei_flushingcanal",
          nameKey: "l_rei_flushingcanal",
          kind: "line",
          data: v("rei_flushingcanal"),
          clickable: true,
          paint: {
            "line-color": "#06B6D4",
            "line-width": 2,
          },
          defaultOn: false,
          legend: {
            color: "#06B6D4",
            line: true,
          },
        },

        {
          id: "rei_irrigation",
          nameKey: "l_rei_irrigation",
          kind: "line",
          data: v("rei_irrigation"),
          clickable: true,
          paint: {
            "line-color": "#22C55E",
            "line-width": 2,
          },
          defaultOn: false,
          legend: {
            color: "#22C55E",
            line: true,
          },
        },

        {
          id: "rei_primer",
          nameKey: "l_rei_primer",
          kind: "line",
          data: v("rei_primer"),
          clickable: true,
          paint: {
            "line-color": "#92400E",
            "line-width": 2,
          },
          defaultOn: false,
          legend: {
            color: "#92400E",
            line: true,
          },
        },

        {
          id: "rei_road",
          nameKey: "l_rei_road",
          kind: "line",
          data: v("rei_road"),
          clickable: true,
          paint: {
            "line-color": "#E1B94A",
            "line-width": 2.2,
          },
          defaultOn: false,
          legend: {
            color: "#E1B94A",
            line: true,
          },
        },

        {
          id: "rei_upstream",
          nameKey: "l_rei_upstream",
          kind: "line",
          data: v("rei_upstream"),
          clickable: true,
          paint: {
            "line-color": "#0EA5E9",
            "line-width": 2,
          },
          defaultOn: false,
          legend: {
            color: "#0EA5E9",
            line: true,
          },
        },

        {
          id: "rei_flushinggate",
          nameKey: "l_rei_flushinggate",
          kind: "symbol",
          data: v("rei_flushinggate"),
          clickable: true,
          paint: {},
          defaultOn: false,
          legend: {
            color: "#0891B2",
          },
        },

        {
          id: "rei_ingate",
          nameKey: "l_rei_ingate",
          kind: "symbol",
          data: v("rei_ingate"),
          clickable: true,
          paint: {},
          defaultOn: false,
          legend: {
            color: "#16A34A",
          },
        },

        {
          id: "rei_intake",
          nameKey: "l_rei_intake",
          kind: "symbol",
          data: v("rei_intake"),
          clickable: true,
          paint: {},
          defaultOn: false,
          legend: {
            color: "#0284C7",
          },
        },

        {
          id: "rei_parking",
          nameKey: "l_rei_parking",
          kind: "fill",
          data: v("rei_parking"),
          clickable: true,
          paint: {
            "fill-color": "#A8A29E",
            "fill-opacity": 0.4,
            "fill-outline-color": "#78716C",
          },
          defaultOn: false,
          opacity: 0.4,
          opacityProp: "fill-opacity",
          legend: {
            color: "#A8A29E",
          },
        },

        {
          id: "rei_rock",
          nameKey: "l_rei_rock",
          kind: "fill",
          data: v("rei_rock"),
          clickable: true,
          paint: {
            "fill-color": "#78716C",
            "fill-opacity": 0.45,
            "fill-outline-color": "#57534E",
          },
          defaultOn: false,
          opacity: 0.45,
          opacityProp: "fill-opacity",
          legend: {
            color: "#78716C",
          },
        },

        {
          id: "rei_silt",
          nameKey: "l_rei_silt",
          kind: "fill",
          data: v("rei_silt"),
          clickable: true,
          paint: {
            "fill-color": "#A8A29E",
            "fill-opacity": 0.4,
            "fill-outline-color": "#78716C",
          },
          defaultOn: false,
          opacity: 0.4,
          opacityProp: "fill-opacity",
          legend: {
            color: "#A8A29E",
          },
        },

        {
          id: "rei_stilling",
          nameKey: "l_rei_stilling",
          kind: "fill",
          data: v("rei_stilling"),
          clickable: true,
          paint: {
            "fill-color": "#38BDF8",
            "fill-opacity": 0.3,
            "fill-outline-color": "#0284C7",
          },
          defaultOn: false,
          opacity: 0.3,
          opacityProp: "fill-opacity",
          legend: {
            color: "#38BDF8",
          },
        },

        {
          id: "rei_weirbody",
          nameKey: "l_rei_weirbody",
          kind: "fill",
          data: v("rei_weirbody"),
          clickable: true,
          paint: {
            "fill-color": "#EC4899",
            "fill-opacity": 0.5,
            "fill-outline-color": "#BE185D",
          },
          defaultOn: false,
          opacity: 0.5,
          opacityProp: "fill-opacity",
          legend: {
            color: "#EC4899",
          },
        },

        {
          id: "rei_wing",
          nameKey: "l_rei_wing",
          kind: "fill",
          data: v("rei_wing"),
          clickable: true,
          paint: {
            "fill-color": "#A855F7",
            "fill-opacity": 0.4,
            "fill-outline-color": "#7E22CE",
          },
          defaultOn: false,
          opacity: 0.4,
          opacityProp: "fill-opacity",
          legend: {
            color: "#A855F7",
          },
        },
      ],
    },
  ],
},
  
{
  titleKey: "g_oebaba",
  dot: "#8B5CF6",

  layers: [
    {
      id: "oebaba_2009",
      nameKey: "l_oebaba_2009",
      kind: "line",
      paint: {},
      defaultOn: true,
    },

    {
      id: "oebaba_2026",
      nameKey: "l_oebaba_2026",
      kind: "line",
      paint: {},
      defaultOn: true,

      children: [
        {
          id: "oe_crest",
          nameKey: "l_oe_crest",
          kind: "line",
          data: v("oe_crest"),
          clickable: true,
          paint: {
            "line-color": "#7C3AED",
            "line-width": 2,
          },
          defaultOn: true,
          legend: {
            color: "#7C3AED",
            line: true,
          },
        },

        {
          id: "oe_downstream",
          nameKey: "l_oe_downstream",
          kind: "line",
          data: v("oe_downstream"),
          clickable: true,
          paint: {
            "line-color": "#2563EB",
            "line-width": 2,
          },
          defaultOn: true,
          legend: {
            color: "#2563EB",
            line: true,
          },
        },

        {
          id: "oe_flushingcanal",
          nameKey: "l_oe_flushingcanal",
          kind: "line",
          data: v("oe_flushingcanal"),
          clickable: true,
          paint: {
            "line-color": "#06B6D4",
            "line-width": 2,
          },
          defaultOn: true,
          legend: {
            color: "#06B6D4",
            line: true,
          },
        },

        {
          id: "oe_flushingpier",
          nameKey: "l_oe_flushingpier",
          kind: "line",
          data: v("oe_flushingpier"),
          clickable: true,
          paint: {
            "line-color": "#0891B2",
            "line-width": 2,
          },
          defaultOn: true,
          legend: {
            color: "#0891B2",
            line: true,
          },
        },

        {
          id: "oe_guidewall",
          nameKey: "l_oe_guidewall",
          kind: "line",
          data: v("oe_guidewall"),
          clickable: true,
          paint: {
            "line-color": "#6B7280",
            "line-width": 2,
          },
          defaultOn: false,
          legend: {
            color: "#6B7280",
            line: true,
          },
        },

        {
          id: "oe_ingatpier",
          nameKey: "l_oe_ingatpier",
          kind: "line",
          data: v("oe_ingatpier"),
          clickable: true,
          paint: {
            "line-color": "#16A34A",
            "line-width": 2,
          },
          defaultOn: true,
          legend: {
            color: "#16A34A",
            line: true,
          },
        },

        {
          id: "oe_irrigationcanal",
          nameKey: "l_oe_irrigationcanal",
          kind: "line",
          data: v("oe_irrigationcanal"),
          clickable: true,
          paint: {
            "line-color": "#22C55E",
            "line-width": 2,
          },
          defaultOn: true,
          legend: {
            color: "#22C55E",
            line: true,
          },
        },

        {
          id: "oe_irrigationpier",
          nameKey: "l_oe_irrigationpier",
          kind: "line",
          data: v("oe_irrigationpier"),
          clickable: true,
          paint: {
            "line-color": "#15803D",
            "line-width": 2,
          },
          defaultOn: true,
          legend: {
            color: "#15803D",
            line: true,
          },
        },

        {
          id: "oe_strais",
          nameKey: "l_oe_strais",
          kind: "line",
          data: v("oe_strais"),
          clickable: true,
          paint: {
            "line-color": "#92400E",
            "line-width": 2,
          },
          defaultOn: true,
          legend: {
            color: "#92400E",
            line: true,
          },
        },

        {
          id: "oe_upstream",
          nameKey: "l_oe_upstream",
          kind: "line",
          data: v("oe_upstream"),
          clickable: true,
          paint: {
            "line-color": "#0EA5E9",
            "line-width": 2,
          },
          defaultOn: true,
          legend: {
            color: "#0EA5E9",
            line: true,
          },
        },

        {
          id: "oe_intake",
          nameKey: "l_oe_intake",
          kind: "symbol",
          data: v("oe_intake"),
          clickable: true,
          paint: {},
          defaultOn: true,
          legend: {
            color: "#0284C7",
          },
        },

        {
          id: "oe_irrigationgate",
          nameKey: "l_oe_irrigationgate",
          kind: "symbol",
          data: v("oe_irrigationgate"),
          clickable: true,
          paint: {},
          defaultOn: true,
          legend: {
            color: "#15803D",
          },
        },

        {
          id: "oe_operatinghouse",
          nameKey: "l_oe_operatinghouse",
          kind: "fill",
          data: v("oe_operatinghouse"),
          clickable: true,
          paint: {
            "fill-color": "#78716C",
            "fill-opacity": 0.5,
            "fill-outline-color": "#57534E",
          },
          defaultOn: true,
          opacity: 0.5,
          opacityProp: "fill-opacity",
          legend: {
            color: "#78716C",
          },
        },

        {
          id: "oe_silt",
          nameKey: "l_oe_silt",
          kind: "fill",
          data: v("oe_silt"),
          clickable: true,
          paint: {
            "fill-color": "#A8A29E",
            "fill-opacity": 0.4,
            "fill-outline-color": "#78716C",
          },
          defaultOn: true,
          opacity: 0.4,
          opacityProp: "fill-opacity",
          legend: {
            color: "#A8A29E",
          },
        },

        {
          id: "oe_stilling",
          nameKey: "l_oe_stilling",
          kind: "fill",
          data: v("oe_stilling"),
          clickable: true,
          paint: {
            "fill-color": "#38BDF8",
            "fill-opacity": 0.3,
            "fill-outline-color": "#0284C7",
          },
          defaultOn: true,
          opacity: 0.3,
          opacityProp: "fill-opacity",
          legend: {
            color: "#38BDF8",
          },
        },

        {
          id: "oe_weirbody",
          nameKey: "l_oe_weirbody",
          kind: "fill",
          data: v("oe_weirbody"),
          clickable: true,
          paint: {
            "fill-color": "#7C3AED",
            "fill-opacity": 0.5,
            "fill-outline-color": "#5B21B6",
          },
          defaultOn: true,
          opacity: 0.5,
          opacityProp: "fill-opacity",
          legend: {
            color: "#7C3AED",
          },
        },

        {
          id: "oe_wing",
          nameKey: "l_oe_wing",
          kind: "fill",
          data: v("oe_wing"),
          clickable: true,
          paint: {
            "fill-color": "#6366F1",
            "fill-opacity": 0.4,
            "fill-outline-color": "#4338CA",
          },
          defaultOn: true,
          opacity: 0.4,
          opacityProp: "fill-opacity",
          legend: {
            color: "#6366F1",
          },
        },
      ],
    },
  ],
},
{
  titleKey: "g_lomea",
  dot: "#F59E0B",

  layers: [
    {
      id: "lomea_2009",
      nameKey: "l_lomea_2009",
      kind: "line",
      paint: {},
      defaultOn: true,
    },
  ],
},
   
];

const flattenLayers = (layers: LayerDef[]): LayerDef[] =>
  layers.flatMap((layer) => [
    ...(layer.data ? [layer] : []),
    ...(layer.children ? flattenLayers(layer.children) : []),
  ]);

export const ALL_LAYERS: LayerDef[] = GROUPS.flatMap((g) =>
  flattenLayers(g.layers)
);
