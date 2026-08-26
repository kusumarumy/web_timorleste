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
  lazy?: boolean;
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
   // LOMEA
  {
    titleKey: "g_lomea",
    dot: "#F59E0B",

    layers: [
      {
        id: "lomea_2009",
        nameKey: "l_lomea_2009",
        kind: "line",
        paint: {},
        defaultOn: false,
        lazy: true,

        children: [
          // =====================================================
          // AREA
          // =====================================================

          {
            id: "lo_ar_00",
            nameKey: "l_lo_ar_00",
            kind: "fill",
            data: v("09_lo_ar_00"),
            clickable: true,
            lazy: true,
            paint: {
              "fill-color": "#8B5CF6",
              "fill-opacity": 0.35,
              "fill-outline-color": "#7C3AED",
            },
            defaultOn: false,
            opacity: 0.35,
            opacityProp: "fill-opacity",
            legend: {
              color: "#8B5CF6",
            },
          },

          {
            id: "lo_ar_areal",
            nameKey: "l_lo_ar_areal",
            kind: "fill",
            data: v("09_lo_ar_areal"),
            clickable: true,
            lazy: true,
            paint: {
              "fill-color": "#A855F7",
              "fill-opacity": 0.35,
              "fill-outline-color": "#9333EA",
            },
            defaultOn: false,
            opacity: 0.35,
            opacityProp: "fill-opacity",
            legend: {
              color: "#A855F7",
            },
          },

          {
            id: "lo_ar_asesories",
            nameKey: "l_lo_ar_asesories",
            kind: "fill",
            data: v("09_lo_ar_asesories"),
            clickable: true,
            lazy: true,
            paint: {
              "fill-color": "#EC4899",
              "fill-opacity": 0.35,
              "fill-outline-color": "#DB2777",
            },
            defaultOn: false,
            opacity: 0.35,
            opacityProp: "fill-opacity",
            legend: {
              color: "#EC4899",
            },
          },

          {
            id: "lo_ar_bangsadap",
            nameKey: "l_lo_ar_bangsadap",
            kind: "fill",
            data: v("09_lo_ar_bangsadap"),
            clickable: true,
            lazy: true,
            paint: {
              "fill-color": "#F59E0B",
              "fill-opacity": 0.35,
              "fill-outline-color": "#D97706",
            },
            defaultOn: false,
            opacity: 0.35,
            opacityProp: "fill-opacity",
            legend: {
              color: "#F59E0B",
            },
          },

          {
            id: "lo_ar_bangunan",
            nameKey: "l_lo_ar_bangunan",
            kind: "fill",
            data: v("09_lo_ar_bangunan"),
            clickable: true,
            lazy: true,
            paint: {
              "fill-color": "#7C3AED",
              "fill-opacity": 0.35,
              "fill-outline-color": "#6D28D9",
            },
            defaultOn: false,
            opacity: 0.35,
            opacityProp: "fill-opacity",
            legend: {
              color: "#7C3AED",
            },
          },

          {
            id: "lo_ar_bmcp",
            nameKey: "l_lo_ar_bmcp",
            kind: "fill",
            data: v("09_lo_ar_bmcp"),
            clickable: true,
            lazy: true,
            paint: {
              "fill-color": "#2563EB",
              "fill-opacity": 0.35,
              "fill-outline-color": "#1D4ED8",
            },
            defaultOn: false,
            opacity: 0.35,
            opacityProp: "fill-opacity",
            legend: {
              color: "#2563EB",
            },
          },

          {
            id: "lo_ar_box",
            nameKey: "l_lo_ar_box",
            kind: "fill",
            data: v("09_lo_ar_box"),
            clickable: true,
            lazy: true,
            paint: {
              "fill-color": "#0891B2",
              "fill-opacity": 0.35,
              "fill-outline-color": "#0E7490",
            },
            defaultOn: false,
            opacity: 0.35,
            opacityProp: "fill-opacity",
            legend: {
              color: "#0891B2",
            },
          },

          {
            id: "lo_ar_kodebm",
            nameKey: "l_lo_ar_kodebm",
            kind: "fill",
            data: v("09_lo_ar_kodebm"),
            clickable: true,
            lazy: true,
            paint: {
              "fill-color": "#16A34A",
              "fill-opacity": 0.35,
              "fill-outline-color": "#15803D",
            },
            defaultOn: false,
            opacity: 0.35,
            opacityProp: "fill-opacity",
            legend: {
              color: "#16A34A",
            },
          },

          {
            id: "lo_ar_salkwater",
            nameKey: "l_lo_ar_salkwater",
            kind: "fill",
            data: v("09_lo_ar_salkwater"),
            clickable: true,
            lazy: true,
            paint: {
              "fill-color": "#06B6D4",
              "fill-opacity": 0.35,
              "fill-outline-color": "#0891B2",
            },
            defaultOn: false,
            opacity: 0.35,
            opacityProp: "fill-opacity",
            legend: {
              color: "#06B6D4",
            },
          },

          {
            id: "lo_ar_tertiary",
            nameKey: "l_lo_ar_tertiary",
            kind: "fill",
            data: v("09_lo_ar_tertiary"),
            clickable: true,
            lazy: true,
            paint: {
              "fill-color": "#22C55E",
              "fill-opacity": 0.35,
              "fill-outline-color": "#16A34A",
            },
            defaultOn: false,
            opacity: 0.35,
            opacityProp: "fill-opacity",
            legend: {
              color: "#22C55E",
            },
          },

          // =====================================================
          // LINE
          // =====================================================

          {
            id: "lo_li_areal",
            nameKey: "l_lo_li_areal",
            kind: "line",
            data: v("09_lo_li_areal"),
            clickable: true,
            lazy: true,
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
            id: "lo_li_asesories",
            nameKey: "l_lo_li_asesories",
            kind: "line",
            data: v("09_lo_li_asesories"),
            clickable: true,
            lazy: true,
            paint: {
              "line-color": "#EC4899",
              "line-width": 2,
            },
            defaultOn: false,
            legend: {
              color: "#EC4899",
              line: true,
            },
          },

          {
            id: "lo_li_asjalan",
            nameKey: "l_lo_li_asjalan",
            kind: "line",
            data: v("09_lo_li_asjalan"),
            clickable: true,
            lazy: true,
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
            id: "lo_li_bataslaut",
            nameKey: "l_lo_li_bataslaut",
            kind: "line",
            data: v("09_lo_li_bataslaut"),
            clickable: true,
            lazy: true,
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
            id: "lo_li_bmcp",
            nameKey: "l_lo_li_bmcp",
            kind: "line",
            data: v("09_lo_li_bmcp"),
            clickable: true,
            lazy: true,
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
            id: "lo_li_box",
            nameKey: "l_lo_li_box",
            kind: "line",
            data: v("09_lo_li_box"),
            clickable: true,
            lazy: true,
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
            id: "lo_li_crossline",
            nameKey: "l_lo_li_crossline",
            kind: "line",
            data: v("09_lo_li_crossline"),
            clickable: true,
            lazy: true,
            paint: {
              "line-color": "#F59E0B",
              "line-width": 2,
            },
            defaultOn: false,
            legend: {
              color: "#F59E0B",
              line: true,
            },
          },

          {
            id: "lo_li_designdrain",
            nameKey: "l_lo_li_designdrain",
            kind: "line",
            data: v("09_lo_li_designdrain"),
            clickable: true,
            lazy: true,
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
            id: "lo_li_design",
            nameKey: "l_lo_li_design",
            kind: "line",
            data: v("09_lo_li_design"),
            clickable: true,
            lazy: true,
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
            id: "lo_li_jalan",
            nameKey: "l_lo_li_jalan",
            kind: "line",
            data: v("09_lo_li_jalan"),
            clickable: true,
            lazy: true,
            paint: {
              "line-color": "#E1B94A",
              "line-width": 2,
            },
            defaultOn: false,
            legend: {
              color: "#E1B94A",
              line: true,
            },
          },

          {
            id: "lo_li_jalanlain",
            nameKey: "l_lo_li_jalanlain",
            kind: "line",
            data: v("09_lo_li_jalanlain"),
            clickable: true,
            lazy: true,
            paint: {
              "line-color": "#CA8A04",
              "line-width": 2,
            },
            defaultOn: false,
            legend: {
              color: "#CA8A04",
              line: true,
            },
          },

          {
            id: "lo_li_jembatan",
            nameKey: "l_lo_li_jembatan",
            kind: "line",
            data: v("09_lo_li_jembatan"),
            clickable: true,
            lazy: true,
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
            id: "lo_li_kodebm",
            nameKey: "l_lo_li_kodebm",
            kind: "line",
            data: v("09_lo_li_kodebm"),
            clickable: true,
            lazy: true,
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
            id: "lo_li_pembuangutama",
            nameKey: "l_lo_li_pembuangutama",
            kind: "line",
            data: v("09_lo_li_pembuangutama"),
            clickable: true,
            lazy: true,
            paint: {
              "line-color": "#0284C7",
              "line-width": 2,
            },
            defaultOn: false,
            legend: {
              color: "#0284C7",
              line: true,
            },
          },

          {
            id: "lo_li_profile",
            nameKey: "l_lo_li_profile",
            kind: "line",
            data: v("09_lo_li_profile"),
            clickable: true,
            lazy: true,
            paint: {
              "line-color": "#64748B",
              "line-width": 2,
            },
            defaultOn: false,
            legend: {
              color: "#64748B",
              line: true,
            },
          },

          {
            id: "lo_li_salexisting",
            nameKey: "l_lo_li_salexisting",
            kind: "line",
            data: v("09_lo_li_salexisting"),
            clickable: true,
            lazy: true,
            paint: {
              "line-color": "#16A34A",
              "line-width": 2,
            },
            defaultOn: false,
            legend: {
              color: "#16A34A",
              line: true,
            },
          },

          {
            id: "lo_li_salkwater",
            nameKey: "l_lo_li_salkwater",
            kind: "line",
            data: v("09_lo_li_salkwater"),
            clickable: true,
            lazy: true,
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
            id: "lo_li_salnodata",
            nameKey: "l_lo_li_salnodata",
            kind: "line",
            data: v("09_lo_li_salnodata"),
            clickable: true,
            lazy: true,
            paint: {
              "line-color": "#9CA3AF",
              "line-width": 2,
            },
            defaultOn: false,
            legend: {
              color: "#9CA3AF",
              line: true,
            },
          },

          {
            id: "lo_li_salters",
            nameKey: "l_lo_li_salters",
            kind: "line",
            data: v("09_lo_li_salters"),
            clickable: true,
            lazy: true,
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
            id: "lo_li_tertiarycrossline",
            nameKey: "l_lo_li_tertiarycrossline",
            kind: "line",
            data: v("09_lo_li_tertiarycrossline"),
            clickable: true,
            lazy: true,
            paint: {
              "line-color": "#F59E0B",
              "line-width": 2,
            },
            defaultOn: false,
            legend: {
              color: "#F59E0B",
              line: true,
            },
          },

          {
            id: "lo_li_textgcp",
            nameKey: "l_lo_li_textgcp",
            kind: "line",
            data: v("09_lo_li_textgcp"),
            clickable: true,
            lazy: true,
            paint: {
              "line-color": "#DC2626",
              "line-width": 2,
            },
            defaultOn: false,
            legend: {
              color: "#DC2626",
              line: true,
            },
          },

          // =====================================================
          // POINT
          // =====================================================

          {
            id: "lo_po_asesories",
            nameKey: "l_lo_po_asesories",
            kind: "circle",
            data: v("09_lo_po_asesories"),
            clickable: true,
            lazy: true,
            paint: {
              "circle-color": "#EC4899",
              "circle-radius": 5,
              "circle-opacity": 1,
              "circle-stroke-color": "#FFFFFF",
              "circle-stroke-width": 1,
            },
            defaultOn: false,
            legend: {
              color: "#EC4899",
              circle: true,
            },
          },

          {
            id: "lo_po_bmcp",
            nameKey: "l_lo_po_bmcp",
            kind: "circle",
            data: v("09_lo_po_bmcp"),
            clickable: true,
            lazy: true,
            paint: {
              "circle-color": "#2563EB",
              "circle-radius": 5,
              "circle-opacity": 1,
              "circle-stroke-color": "#FFFFFF",
              "circle-stroke-width": 1,
            },
            defaultOn: false,
            legend: {
              color: "#2563EB",
              circle: true,
            },
          },

          {
            id: "lo_po_design",
            nameKey: "l_lo_po_design",
            kind: "circle",
            data: v("09_lo_po_design"),
            clickable: true,
            lazy: true,
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
            id: "lo_po_kodebm",
            nameKey: "l_lo_po_kodebm",
            kind: "circle",
            data: v("09_lo_po_kodebm"),
            clickable: true,
            lazy: true,
            paint: {
              "circle-color": "#7C3AED",
              "circle-radius": 5,
              "circle-opacity": 1,
              "circle-stroke-color": "#FFFFFF",
              "circle-stroke-width": 1,
            },
            defaultOn: false,
            legend: {
              color: "#7C3AED",
              circle: true,
            },
          },

          {
            id: "lo_po_patoksaluran",
            nameKey: "l_lo_po_patoksaluran",
            kind: "circle",
            data: v("09_lo_po_patoksaluran"),
            clickable: true,
            lazy: true,
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
            id: "lo_po_salkwater",
            nameKey: "l_lo_po_salkwater",
            kind: "circle",
            data: v("09_lo_po_salkwater"),
            clickable: true,
            lazy: true,
            paint: {
              "circle-color": "#06B6D4",
              "circle-radius": 5,
              "circle-opacity": 1,
              "circle-stroke-color": "#FFFFFF",
              "circle-stroke-width": 1,
            },
            defaultOn: false,
            legend: {
              color: "#06B6D4",
              circle: true,
            },
          },

          {
            id: "lo_po_tertiarycrosspoint",
            nameKey: "l_lo_po_tertiarycrosspoint",
            kind: "circle",
            data: v("09_lo_po_tertiarycrosspoint"),
            clickable: true,
            lazy: true,
            paint: {
              "circle-color": "#22C55E",
              "circle-radius": 5,
              "circle-opacity": 1,
              "circle-stroke-color": "#FFFFFF",
              "circle-stroke-width": 1,
            },
            defaultOn: false,
            legend: {
              color: "#22C55E",
              circle: true,
            },
          },

          {
            id: "lo_po_textcrosstertiary",
            nameKey: "l_lo_po_textcrosstertiary",
            kind: "circle",
            data: v("09_lo_po_textcrosstertiary"),
            clickable: true,
            lazy: true,
            paint: {
              "circle-color": "#F97316",
              "circle-radius": 5,
              "circle-opacity": 1,
              "circle-stroke-color": "#FFFFFF",
              "circle-stroke-width": 1,
            },
            defaultOn: false,
            legend: {
              color: "#F97316",
              circle: true,
            },
          },

          {
            id: "lo_po_textgcp",
            nameKey: "l_lo_po_textgcp",
            kind: "circle",
            data: v("09_lo_po_textgcp"),
            clickable: true,
            lazy: true,
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
        ],
      },
    ],
  },
 // RAIBERE
{
  titleKey: "g_raibere",
  dot: "#EC4899",

  layers: [

    // =====================================================
    // RAIBERE 2009
    // =====================================================
    {
      id: "raibere_2009",
      nameKey: "l_raibere_2009",
      kind: "line",
      paint: {},

      // Tidak dipanggil saat website pertama kali load
      defaultOn: false,
      lazy: true,

      children: [

        // =================================================
        // 09_rei_ar_ → AREA
        // =================================================

        {
          id: "rei09_ar_0",
          nameKey: "l_rei09_ar_0",
          kind: "fill",
          data: v("09_rei_ar_0"),
          clickable: true,

          paint: {
            "fill-color": "#8B5CF6",
            "fill-opacity": 0.35,
            "fill-outline-color": "#8B5CF6",
          },

          defaultOn: true,

          opacity: 0.35,
          opacityProp: "fill-opacity",

          legend: {
            color: "#8B5CF6",
          },
        },

        {
          id: "rei09_ar_bangsadap",
          nameKey: "l_rei09_ar_bangsadap",
          kind: "fill",
          data: v("09_rei_ar_bangsadap"),
          clickable: true,

          paint: {
            "fill-color": "#F59E0B",
            "fill-opacity": 0.35,
            "fill-outline-color": "#F59E0B",
          },

          defaultOn: true,

          opacity: 0.35,
          opacityProp: "fill-opacity",

          legend: {
            color: "#F59E0B",
          },
        },

        {
          id: "rei09_ar_bmcp",
          nameKey: "l_rei09_ar_bmcp",
          kind: "fill",
          data: v("09_rei_ar_bmcp"),
          clickable: true,

          paint: {
            "fill-color": "#2563EB",
            "fill-opacity": 0.35,
            "fill-outline-color": "#2563EB",
          },

          defaultOn: true,

          opacity: 0.35,
          opacityProp: "fill-opacity",

          legend: {
            color: "#2563EB",
          },
        },

        {
          id: "rei09_ar_boxkwarter",
          nameKey: "l_rei09_ar_boxkwarter",
          kind: "fill",
          data: v("09_rei_ar_boxkwarter"),
          clickable: true,

          paint: {
            "fill-color": "#0891B2",
            "fill-opacity": 0.35,
            "fill-outline-color": "#0891B2",
          },

          defaultOn: true,

          opacity: 0.35,
          opacityProp: "fill-opacity",

          legend: {
            color: "#0891B2",
          },
        },

        {
          id: "rei09_ar_boxtersier",
          nameKey: "l_rei09_ar_boxtersier",
          kind: "fill",
          data: v("09_rei_ar_boxtersier"),
          clickable: true,

          paint: {
            "fill-color": "#06B6D4",
            "fill-opacity": 0.35,
            "fill-outline-color": "#06B6D4",
          },

          defaultOn: true,

          opacity: 0.35,
          opacityProp: "fill-opacity",

          legend: {
            color: "#06B6D4",
          },
        },

        {
          id: "rei09_ar_desain",
          nameKey: "l_rei09_ar_desain",
          kind: "fill",
          data: v("09_rei_ar_desain"),
          clickable: true,

          paint: {
            "fill-color": "#22C55E",
            "fill-opacity": 0.35,
            "fill-outline-color": "#22C55E",
          },

          defaultOn: true,

          opacity: 0.35,
          opacityProp: "fill-opacity",

          legend: {
            color: "#22C55E",
          },
        },

        {
          id: "rei09_ar_legend",
          nameKey: "l_rei09_ar_legend",
          kind: "fill",
          data: v("09_rei_ar_legend"),
          clickable: true,

          paint: {
            "fill-color": "#EC4899",
            "fill-opacity": 0.35,
            "fill-outline-color": "#EC4899",
          },

          defaultOn: true,

          opacity: 0.35,
          opacityProp: "fill-opacity",

          legend: {
            color: "#EC4899",
          },
        },

        {
          id: "rei09_ar_salpemb",
          nameKey: "l_rei09_ar_salpemb",
          kind: "fill",
          data: v("09_rei_ar_salpemb"),
          clickable: true,

          paint: {
            "fill-color": "#A855F7",
            "fill-opacity": 0.35,
            "fill-outline-color": "#A855F7",
          },

          defaultOn: true,

          opacity: 0.35,
          opacityProp: "fill-opacity",

          legend: {
            color: "#A855F7",
          },
        },

        // =================================================
        // 09_rei_li_ → LINE
        // =================================================

        {
          id: "rei09_li_bangunan",
          nameKey: "l_rei09_li_bangunan",
          kind: "line",
          data: v("09_rei_li_bangunan"),
          clickable: true,

          paint: {
            "line-color": "#7C3AED",
            "line-width": 2,
            "line-opacity": 1,
          },

          defaultOn: true,

          legend: {
            color: "#7C3AED",
            line: true,
          },
        },

        {
          id: "rei09_li_contourmayor",
          nameKey: "l_rei09_li_contourmayor",
          kind: "line",
          data: v("09_rei_li_contourmayor"),
          clickable: true,

          paint: {
            "line-color": "#7A1E1A",
            "line-width": 1.5,
            "line-opacity": 1,
          },

          defaultOn: true,

          legend: {
            color: "#7A1E1A",
            line: true,
          },
        },

        {
          id: "rei09_li_contourminor",
          nameKey: "l_rei09_li_contourminor",
          kind: "line",
          data: v("09_rei_li_contourminor"),
          clickable: true,

          paint: {
            "line-color": "#A855F7",
            "line-width": 1,
            "line-opacity": 1,
          },

          defaultOn: true,

          legend: {
            color: "#A855F7",
            line: true,
          },
        },

        {
          id: "rei09_li_cotambah",
          nameKey: "l_rei09_li_cotambah",
          kind: "line",
          data: v("09_rei_li_cotambah"),
          clickable: true,

          paint: {
            "line-color": "#0EA5E9",
            "line-width": 2,
            "line-opacity": 1,
          },

          defaultOn: true,

          legend: {
            color: "#0EA5E9",
            line: true,
          },
        },

        {
          id: "rei09_li_jalan",
          nameKey: "l_rei09_li_jalan",
          kind: "line",
          data: v("09_rei_li_jalan"),
          clickable: true,

          paint: {
            "line-color": "#E1B94A",
            "line-width": 2.2,
            "line-opacity": 1,
          },

          defaultOn: true,

          legend: {
            color: "#E1B94A",
            line: true,
          },
        },

        {
          id: "rei09_li_linepol",
          nameKey: "l_rei09_li_linepol",
          kind: "line",
          data: v("09_rei_li_linepol"),
          clickable: true,

          paint: {
            "line-color": "#6B7280",
            "line-width": 2,
            "line-opacity": 1,
          },

          defaultOn: true,

          legend: {
            color: "#6B7280",
            line: true,
          },
        },

        {
          id: "rei09_li_salexisting",
          nameKey: "l_rei09_li_salexisting",
          kind: "line",
          data: v("09_rei_li_salexisting"),
          clickable: true,

          paint: {
            "line-color": "#16A34A",
            "line-width": 2,
            "line-opacity": 1,
          },

          defaultOn: true,

          legend: {
            color: "#16A34A",
            line: true,
          },
        },

        {
          id: "rei09_li_saltersier",
          nameKey: "l_rei09_li_saltersier",
          kind: "line",
          data: v("09_rei_li_saltersier"),
          clickable: true,

          paint: {
            "line-color": "#06B6D4",
            "line-width": 2,
            "line-opacity": 1,
          },

          defaultOn: true,

          legend: {
            color: "#06B6D4",
            line: true,
          },
        },

        {
          id: "rei09_li_sungaialur",
          nameKey: "l_rei09_li_sungaialur",
          kind: "line",
          data: v("09_rei_li_sungaialur"),
          clickable: true,

          paint: {
            "line-color": "#2563EB",
            "line-width": 2,
            "line-opacity": 1,
          },

          defaultOn: true,

          legend: {
            color: "#2563EB",
            line: true,
          },
        },

        // =================================================
        // 09_rei_po_ → POINT
        // =================================================

        {
          id: "rei09_po_asesories",
          nameKey: "l_rei09_po_asesories",
          kind: "circle",
          data: v("09_rei_po_asesories"),
          clickable: true,

          paint: {
            "circle-color": "#EC4899",
            "circle-radius": 5,
            "circle-opacity": 1,
            "circle-stroke-color": "#FFFFFF",
            "circle-stroke-width": 1,
          },

          defaultOn: true,

          legend: {
            color: "#EC4899",
            circle: true,
          },
        },

        {
          id: "rei09_po_crosstierser",
          nameKey: "l_rei09_po_crosstierser",
          kind: "circle",
          data: v("09_rei_po_crosstierser"),
          clickable: true,

          paint: {
            "circle-color": "#F59E0B",
            "circle-radius": 5,
            "circle-opacity": 1,
            "circle-stroke-color": "#FFFFFF",
            "circle-stroke-width": 1,
          },

          defaultOn: true,

          legend: {
            color: "#F59E0B",
            circle: true,
          },
        },

        {
          id: "rei09_po_namabang",
          nameKey: "l_rei09_po_namabang",
          kind: "circle",
          data: v("09_rei_po_namabang"),
          clickable: true,

          paint: {
            "circle-color": "#7C3AED",
            "circle-radius": 5,
            "circle-opacity": 1,
            "circle-stroke-color": "#FFFFFF",
            "circle-stroke-width": 1,
          },

          defaultOn: true,

          legend: {
            color: "#7C3AED",
            circle: true,
          },
        },

        {
          id: "rei09_po_patoksaluran",
          nameKey: "l_rei09_po_patoksaluran",
          kind: "circle",
          data: v("09_rei_po_patoksaluran"),
          clickable: true,

          paint: {
            "circle-color": "#DC2626",
            "circle-radius": 5,
            "circle-opacity": 1,
            "circle-stroke-color": "#FFFFFF",
            "circle-stroke-width": 1,
          },

          defaultOn: true,

          legend: {
            color: "#DC2626",
            circle: true,
          },
        },

        {
          id: "rei09_po_text",
          nameKey: "l_rei09_po_text",
          kind: "circle",
          data: v("09_rei_po_text"),
          clickable: true,

          paint: {
            "circle-color": "#111827",
            "circle-radius": 4,
            "circle-opacity": 1,
            "circle-stroke-color": "#FFFFFF",
            "circle-stroke-width": 1,
          },

          defaultOn: true,

          legend: {
            color: "#111827",
            circle: true,
          },
        },

        {
          id: "rei09_po_textcrosscanal",
          nameKey: "l_rei09_po_textcrosscanal",
          kind: "circle",
          data: v("09_rei_po_textcrosscanal"),
          clickable: true,

          paint: {
            "circle-color": "#0891B2",
            "circle-radius": 4,
            "circle-opacity": 1,
            "circle-stroke-color": "#FFFFFF",
            "circle-stroke-width": 1,
          },

          defaultOn: true,

          legend: {
            color: "#0891B2",
            circle: true,
          },
        },

        {
          id: "rei09_po_textcrosstierser",
          nameKey: "l_rei09_po_textcrosstierser",
          kind: "circle",
          data: v("09_rei_po_textcrosstierser"),
          clickable: true,

          paint: {
            "circle-color": "#22C55E",
            "circle-radius": 4,
            "circle-opacity": 1,
            "circle-stroke-color": "#FFFFFF",
            "circle-stroke-width": 1,
          },

          defaultOn: true,

          legend: {
            color: "#22C55E",
            circle: true,
          },
        },

        {
          id: "rei09_po_textpol",
          nameKey: "l_rei09_po_textpol",
          kind: "circle",
          data: v("09_rei_po_textpol"),
          clickable: true,

          paint: {
            "circle-color": "#F97316",
            "circle-radius": 4,
            "circle-opacity": 1,
            "circle-stroke-color": "#FFFFFF",
            "circle-stroke-width": 1,
          },

          defaultOn: true,

          legend: {
            color: "#F97316",
            circle: true,
          },
        },
      ],
    },

    // =====================================================
    // RAIBERE 2026
    // =====================================================
    {
      id: "raibere_2026",
      nameKey: "l_raibere_2026",
      kind: "line",
      paint: {},

      // Tidak dipanggil saat website pertama kali load
      defaultOn: false,
      lazy: true,

      children: [

        // =================================================
        // 26_rei_ar_ → AREA
        // =================================================

        {
          id: "rei26_ar_access",
          nameKey: "l_rei26_ar_access",
          kind: "fill",
          data: v("26_rei_ar_access"),
          clickable: true,

          paint: {
            "fill-color": "#78716C",
            "fill-opacity": 0.35,
            "fill-outline-color": "#78716C",
          },

          defaultOn: true,

          opacity: 0.35,
          opacityProp: "fill-opacity",

          legend: {
            color: "#78716C",
          },
        },

        {
          id: "rei26_ar_crest",
          nameKey: "l_rei26_ar_crest",
          kind: "fill",
          data: v("26_rei_ar_crest"),
          clickable: true,

          paint: {
            "fill-color": "#7C3AED",
            "fill-opacity": 0.35,
            "fill-outline-color": "#7C3AED",
          },

          defaultOn: true,

          opacity: 0.35,
          opacityProp: "fill-opacity",

          legend: {
            color: "#7C3AED",
          },
        },

        {
          id: "rei26_ar_downstream",
          nameKey: "l_rei26_ar_downstream",
          kind: "fill",
          data: v("26_rei_ar_downstream"),
          clickable: true,

          paint: {
            "fill-color": "#2563EB",
            "fill-opacity": 0.35,
            "fill-outline-color": "#2563EB",
          },

          defaultOn: true,

          opacity: 0.35,
          opacityProp: "fill-opacity",

          legend: {
            color: "#2563EB",
          },
        },

        {
          id: "rei26_ar_flushingcanal",
          nameKey: "l_rei26_ar_flushingcanal",
          kind: "fill",
          data: v("26_rei_ar_flushingcanal"),
          clickable: true,

          paint: {
            "fill-color": "#06B6D4",
            "fill-opacity": 0.35,
            "fill-outline-color": "#06B6D4",
          },

          defaultOn: true,

          opacity: 0.35,
          opacityProp: "fill-opacity",

          legend: {
            color: "#06B6D4",
          },
        },

        {
          id: "rei26_ar_flushinggate",
          nameKey: "l_rei26_ar_flushinggate",
          kind: "fill",
          data: v("26_rei_ar_flushinggate"),
          clickable: true,

          paint: {
            "fill-color": "#0891B2",
            "fill-opacity": 0.35,
            "fill-outline-color": "#0891B2",
          },

          defaultOn: true,

          opacity: 0.35,
          opacityProp: "fill-opacity",

          legend: {
            color: "#0891B2",
          },
        },

        {
          id: "rei26_ar_flushingpier",
          nameKey: "l_rei26_ar_flushingpier",
          kind: "fill",
          data: v("26_rei_ar_flushingpier"),
          clickable: true,

          paint: {
            "fill-color": "#0EA5E9",
            "fill-opacity": 0.35,
            "fill-outline-color": "#0EA5E9",
          },

          defaultOn: true,

          opacity: 0.35,
          opacityProp: "fill-opacity",

          legend: {
            color: "#0EA5E9",
          },
        },

        {
          id: "rei26_ar_ingate",
          nameKey: "l_rei26_ar_ingate",
          kind: "fill",
          data: v("26_rei_ar_ingate"),
          clickable: true,

          paint: {
            "fill-color": "#16A34A",
            "fill-opacity": 0.35,
            "fill-outline-color": "#16A34A",
          },

          defaultOn: true,

          opacity: 0.35,
          opacityProp: "fill-opacity",

          legend: {
            color: "#16A34A",
          },
        },

        {
          id: "rei26_ar_intake",
          nameKey: "l_rei26_ar_intake",
          kind: "fill",
          data: v("26_rei_ar_intake"),
          clickable: true,

          paint: {
            "fill-color": "#0284C7",
            "fill-opacity": 0.35,
            "fill-outline-color": "#0284C7",
          },

          defaultOn: true,

          opacity: 0.35,
          opacityProp: "fill-opacity",

          legend: {
            color: "#0284C7",
          },
        },

        {
          id: "rei26_ar_irrigation",
          nameKey: "l_rei26_ar_irrigation",
          kind: "fill",
          data: v("26_rei_ar_irrigation"),
          clickable: true,

          paint: {
            "fill-color": "#22C55E",
            "fill-opacity": 0.35,
            "fill-outline-color": "#22C55E",
          },

          defaultOn: true,

          opacity: 0.35,
          opacityProp: "fill-opacity",

          legend: {
            color: "#22C55E",
          },
        },

        {
          id: "rei26_ar_parking",
          nameKey: "l_rei26_ar_parking",
          kind: "fill",
          data: v("26_rei_ar_parking"),
          clickable: true,

          paint: {
            "fill-color": "#A8A29E",
            "fill-opacity": 0.40,
            "fill-outline-color": "#78716C",
          },

          defaultOn: true,

          opacity: 0.40,
          opacityProp: "fill-opacity",

          legend: {
            color: "#A8A29E",
          },
        },

        {
          id: "rei26_ar_primer",
          nameKey: "l_rei26_ar_primer",
          kind: "fill",
          data: v("26_rei_ar_primer"),
          clickable: true,

          paint: {
            "fill-color": "#92400E",
            "fill-opacity": 0.35,
            "fill-outline-color": "#92400E",
          },

          defaultOn: true,

          opacity: 0.35,
          opacityProp: "fill-opacity",

          legend: {
            color: "#92400E",
          },
        },

        {
          id: "rei26_ar_road",
          nameKey: "l_rei26_ar_road",
          kind: "fill",
          data: v("26_rei_ar_road"),
          clickable: true,

          paint: {
            "fill-color": "#E1B94A",
            "fill-opacity": 0.35,
            "fill-outline-color": "#E1B94A",
          },

          defaultOn: true,

          opacity: 0.35,
          opacityProp: "fill-opacity",

          legend: {
            color: "#E1B94A",
          },
        },

        {
          id: "rei26_ar_rock",
          nameKey: "l_rei26_ar_rock",
          kind: "fill",
          data: v("26_rei_ar_rock"),
          clickable: true,

          paint: {
            "fill-color": "#78716C",
            "fill-opacity": 0.45,
            "fill-outline-color": "#57534E",
          },

          defaultOn: true,

          opacity: 0.45,
          opacityProp: "fill-opacity",

          legend: {
            color: "#78716C",
          },
        },

        {
          id: "rei26_ar_silt",
          nameKey: "l_rei26_ar_silt",
          kind: "fill",
          data: v("26_rei_ar_silt"),
          clickable: true,

          paint: {
            "fill-color": "#A8A29E",
            "fill-opacity": 0.40,
            "fill-outline-color": "#78716C",
          },

          defaultOn: true,

          opacity: 0.40,
          opacityProp: "fill-opacity",

          legend: {
            color: "#A8A29E",
          },
        },

        {
          id: "rei26_ar_stilling",
          nameKey: "l_rei26_ar_stilling",
          kind: "fill",
          data: v("26_rei_ar_stilling"),
          clickable: true,

          paint: {
            "fill-color": "#38BDF8",
            "fill-opacity": 0.30,
            "fill-outline-color": "#0284C7",
          },

          defaultOn: true,

          opacity: 0.30,
          opacityProp: "fill-opacity",

          legend: {
            color: "#38BDF8",
          },
        },

        {
          id: "rei26_ar_upstream",
          nameKey: "l_rei26_ar_upstream",
          kind: "fill",
          data: v("26_rei_ar_upstream"),
          clickable: true,

          paint: {
            "fill-color": "#0EA5E9",
            "fill-opacity": 0.35,
            "fill-outline-color": "#0EA5E9",
          },

          defaultOn: true,

          opacity: 0.35,
          opacityProp: "fill-opacity",

          legend: {
            color: "#0EA5E9",
          },
        },

        {
          id: "rei26_ar_weirbody",
          nameKey: "l_rei26_ar_weirbody",
          kind: "fill",
          data: v("26_rei_ar_weirbody"),
          clickable: true,

          paint: {
            "fill-color": "#EC4899",
            "fill-opacity": 0.50,
            "fill-outline-color": "#BE185D",
          },

          defaultOn: true,

          opacity: 0.50,
          opacityProp: "fill-opacity",

          legend: {
            color: "#EC4899",
          },
        },

        {
          id: "rei26_ar_wing",
          nameKey: "l_rei26_ar_wing",
          kind: "fill",
          data: v("26_rei_ar_wing"),
          clickable: true,

          paint: {
            "fill-color": "#A855F7",
            "fill-opacity": 0.40,
            "fill-outline-color": "#7E22CE",
          },

          defaultOn: true,

          opacity: 0.40,
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
          defaultOn: true,
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
   
];

const flattenLayers = (layers: LayerDef[]): LayerDef[] =>
  layers.flatMap((layer) => [
    ...(layer.data ? [layer] : []),
    ...(layer.children ? flattenLayers(layer.children) : []),
  ]);

export const ALL_LAYERS: LayerDef[] = GROUPS.flatMap((g) =>
  flattenLayers(g.layers)
);
