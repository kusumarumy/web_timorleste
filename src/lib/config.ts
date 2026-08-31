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
  { id: "ortho", labelKey: "bm_ortho", tiles: [`${R2}/orthophoto/tiles/{z}/{x}/{y}.webp`], attribution: "Orthophoto", minzoom: 13, maxzoom: 21, },
  { id: "hybrid", labelKey: "bm_hybrid", tiles: ["https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"], attribution: "© Google Maps" },
  { id: "streets", labelKey: "bm_streets", tiles: ["https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"], attribution: "© Google Maps" },
  { id: "opentopo", labelKey: "bm_opentopo", tiles: ["https://tile.opentopomap.org/{z}/{x}/{y}.png"], attribution: "© OpenTopoMap" },
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
    adjustable: false,
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
  cascade?: boolean;
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
  dot: "#00A6D6",

  layers: [
    {
      id: "aoi_photo",
      nameKey: "l_aoi_photo",
      kind: "line",
      data: v("aoi_photo"),
      clickable: true,
      paint: {
        "line-color": "#4FC3F7",
        "line-width": 2.5,
        "line-opacity": 1,
      },

      defaultOn: true,

      legend: {
        color: "#4FC3F7",
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
        "line-color": "#1565C0",
        "line-width": 2.5,
        "line-opacity": 1,
      },

      defaultOn: true,

      legend: {
        color: "#1565C0",
        line: true,
      },
    },
  ],
},
  // ADMINISTRASI
{
  titleKey: "g_admin",
  dot: "#212121",

  layers: [
    {
  id: "desa",
  nameKey: "l_desa",
  kind: "fill",
  data: v("desa"),

  paint: {
    "fill-color": "#FBC02D",
    "fill-opacity": 0,
  },

  defaultOn: false,

  legend: {
    color: "#FBC02D",
    line: true,
  },

  label: {
    field: "adm3_name",
    size: 10,
    color: "#C62828",
    haloColor: "#FFFFFF",
    haloWidth: 1.5,
  },
},

{
  id: "posto",
  nameKey: "l_posto",
  kind: "fill",
  data: v("posto"),

  paint: {
    "fill-color": "#F57C00",
    "fill-opacity": 0,
  },

  defaultOn: false,

  legend: {
    color: "#F57C00",
    line: true,
  },

  label: {
    field: "adm2_name",
    size: 11,
    color: "#C62828",
    haloColor: "#FFFFFF",
    haloWidth: 1.5,
  },
},

{
  id: "kotamadya",
  nameKey: "l_kotamadya",
  kind: "fill",
  data: v("kotamadya"),

  paint: {
    "fill-color": "#C2185B",
    "fill-opacity": 0,
  },

  defaultOn: false,

  legend: {
    color: "#C2185B",
    line: true,
  },

  label: {
    field: "adm1_name",
    size: 12,
    color: "#7B3FB3",
    haloColor: "#FFFFFF",
    haloWidth: 2,
  },
},

    {
      id: "negara",
      nameKey: "l_negara",
      kind: "line",
      data: v("negara"),

      paint: {
        "line-color": "#212121",
        "line-width": 2.4,
        "line-dasharray": [14, 7],
        "line-opacity": 1,
      },

      defaultOn: false,

      legend: {
        color: "#212121",
        line: true,
      },
    },
  ],
},
  // KONTUR
{
  titleKey: "g_contour",
  dot: "#8D4A2B",

  layers: [
    {
      id: "contour",
      nameKey: "l_contour",
      kind: "line",
      data: r2Vector("contour"),

      paint: {
        "line-color": "#8D4A2B",
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
        color: "#8D4A2B",
        line: true,
      },
    },
  ],
},
  // JARINGAN
  {
  titleKey: "g_net",
  dot: "#E53935",

  layers: [
    {
      id: "road",
      nameKey: "l_road",
      kind: "line",
      data: v("road"),
      clickable: true,

      paint: {
        "line-color": "#E53935",
        "line-width": 2.2,
        "line-opacity": 1,
      },

      defaultOn: false,

      legend: {
        color: "#E53935",
        line: true,
      },
    },
  ],
},
  // HIDROLOGI
  {
  titleKey: "g_hydro",
  dot: "#1E88E5",

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
    color: "#43A047",
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
    color: "#7B1FA2",
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
    color: "#424242",
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
        color: "#1E88E5",
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
    "fill-color": "#90CAF9",
    "fill-opacity": 0.25,
    "fill-outline-color": "#6791B3",
  },

  defaultOn: false,
  opacity: 0.25,
  opacityProp: "fill-opacity",

  legend: {
    color: "#90CAF9",
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
    "fill-color": "#00ACC1",
    "fill-opacity": 0.65,
    "fill-outline-color": "#007B8A",
  },

  defaultOn: false,

  opacity: 0.65,
  opacityProp: "fill-opacity",

  legend: {
    color: "#00ACC1",
  },
},
    {
      id: "watershed",
      nameKey: "l_watershed",
      kind: "fill",
      data: v("watershed"),
      clickable: true,

      paint: {
        "fill-color": "#B3E5FC",
        "fill-opacity": 0.20,
        "fill-outline-color": "#80A4B5",
      },

      defaultOn: false,

      opacity: 0.20,
      opacityProp: "fill-opacity",

      legend: {
        color: "#B3E5FC",
      },
    },
  ],
},

  // TUTUPAN LAHAN
 {
  titleKey: "g_land",
  dot: "#2E7D32",

  layers: [
    {
      id: "forestprotected",
      nameKey: "l_forestprotected",
      kind: "line",
      data: v("forestprotected"),

      paint: {
        "line-color": "#00695C",
        "line-width": 1.6,
        "line-dasharray": [6, 3],
        "line-opacity": 1,
      },

      defaultOn: false,

      legend: {
        color: "#00695C",
        line: true,
      },
    },    
 {
  id: "8irrigationareas",
  nameKey: "l_8irrigationareas",
  kind: "fill",
  data: v("8irrigationareas"),
  clickable: true,

  paint: {
    "fill-color": "#C49A00",
    "fill-opacity": 0.35,
    "fill-outline-color": "#8D6E00",
  },

  defaultOn: false,

  opacity: 0.35,
  opacityProp: "fill-opacity",

  legend: {
    color: "#C49A00",
    line: true,
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
        "fill-color": "#424242",
        "fill-opacity": 0.40,
        "fill-outline-color": "#2F2F2F",
      },

      defaultOn: false,

      opacity: 0.40,
      opacityProp: "fill-opacity",

      legend: {
        color: "#424242",
      },
    },
        {
      id: "lowveg",
      nameKey: "l_lowveg",
      kind: "fill",
      data: v("lowveg"),
      clickable: true,

      paint: {
        "fill-color": "#9CCC65",
        "fill-opacity": 0.35,
        "fill-outline-color": "#709248",
      },

      defaultOn: false,

      opacity: 0.35,
      opacityProp: "fill-opacity",

      legend: {
        color: "#9CCC65",
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
        "fill-outline-color": "#215A24",
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
        "fill-color": "#C8A97E",
        "fill-opacity": 0.35,
        "fill-outline-color": "#90795A",
      },

      defaultOn: false,

      opacity: 0.35,
      opacityProp: "fill-opacity",

      legend: {
        color: "#C8A97E",
      },
    },
    {
      id: "palm",
      nameKey: "l_palm",
      kind: "fill",
      data: v("palm"),
      clickable: true,

      paint: {
        "fill-color": "#66A65C",
        "fill-opacity": 0.35,
        "fill-outline-color": "#497742",
      },

      defaultOn: false,

      opacity: 0.35,
      opacityProp: "fill-opacity",

      legend: {
        color: "#66A65C",
      },
    },
    {
      id: "ricefield",
      nameKey: "l_ricefield",
      kind: "fill",
      data: v("ricefield"),
      clickable: true,

      paint: {
        "fill-color": "#FBC02D",
        "fill-opacity": 0.35,
        "fill-outline-color": "#B48A20",
      },

      defaultOn: false,

      opacity: 0.35,
      opacityProp: "fill-opacity",

      legend: {
        color: "#FBC02D",
      },
    },
{
      id: "sugarcane",
      nameKey: "l_sugarcane",
      kind: "fill",
      data: v("sugarcane"),
      clickable: true,

      paint: {
        "fill-color": "#F9D64A",
        "fill-opacity": 0.35,
        "fill-outline-color": "#B39A35",
      },

      defaultOn: false,

      opacity: 0.35,
      opacityProp: "fill-opacity",

      legend: {
        color: "#F9D64A",
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
        "fill-outline-color": "#A45252",
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
        "fill-color": "#29B6F6",
        "fill-opacity": 0.40,
        "fill-outline-color": "#1D83B1",
      },

      defaultOn: false,

      opacity: 0.40,
      opacityProp: "fill-opacity",

      legend: {
        color: "#29B6F6",
      },
    },
  ],
},
    // LAYER GENANGAN
  {
    titleKey: "g_genangan",
    dot: "#7B1FA2",

    layers: [
      {
        id: "genangan_titikbor",
        nameKey: "l_genangan_titikbor",
        kind: "symbol",
        data: v("genangan_titikbor"),
        clickable: true,
        icon: icon("drill"),
        paint: {},

        defaultOn: false,

        legend: {
          color: "#D32F2F",
          svg: "drill",
        },
      },

      {
        id: "genangan_titikdesain",
        nameKey: "l_genangan_titikdesain",
        kind: "symbol",
        data: v("genangan_titikdesain"),
        clickable: true,
        icon: icon("desain"),
        paint: {},

        defaultOn: false,

        legend: {
          color: "#F57C00",
          svg: "desain",
        },
      },

      {
        id: "genangan_titikkoordinat",
        nameKey: "l_genangan_titikkoordinat",
        kind: "circle",
        data: v("genangan_titikkoordinat"),
        clickable: true,
        icon: icon("coordinate"),
        paint: {},

        defaultOn: false,

        legend: {
          color: "#7B1FA2",
          svg: "coordinate",
        },
      },

      {
        id: "genangan_titikkupasan",
        nameKey: "l_genangan_titikkupasan",
        kind: "circle",
        data: v("genangan_titikkupasan"),
        clickable: true,
        icon: icon("kupasan"),
        paint: {},

        defaultOn: false,

        legend: {
          color: "#D32F2F",
          svg: "kupasan",
        },
      },
      {
        id: "genangan_garisdesain",
        nameKey: "l_genangan_garisdesain",
        kind: "line",
        data: v("genangan_garisdesain"),

        paint: {
          "line-color": "#F57C00",
          "line-width": 2,
          "line-opacity": 1,
        },

        defaultOn: false,

        legend: {
          color: "#F57C00",
          line: true,
        },
      },

      {
        id: "genangan_gariskoordinat",
        nameKey: "l_genangan_gariskoordinat",
        kind: "line",
        data: v("genangan_gariskoordinat"),

        paint: {
          "line-color": "#7B1FA2",
          "line-width": 1.5,
          "line-dasharray": [4, 3],
          "line-opacity": 1,
        },

        defaultOn: false,

        legend: {
          color: "#7B1FA2",
          line: true,
        },
      },

      {
        id: "genangan_gariskupasan",
        nameKey: "l_genangan_gariskupasan",
        kind: "line",
        data: v("genangan_gariskupasan"),

        paint: {
          "line-color": "#D32F2F",
          "line-width": 2,
          "line-opacity": 1,
        },

        defaultOn: false,

        legend: {
          color: "#D32F2F",
          line: true,
        },
      },

      {
        id: "genangan_garissungai",
        nameKey: "l_genangan_garissungai",
        kind: "line",
        data: v("genangan_garissungai"),

        paint: {
          "line-color": "#00A6D6",
          "line-width": 2,
          "line-opacity": 1,
        },

        defaultOn: false,

        legend: {
          color: "#00A6D6",
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
          "fill-color": "#F57C00",
          "fill-opacity": 0.35,
          "fill-outline-color": "#B05900",
        },

        defaultOn: false,

        opacity: 0.35,
        opacityProp: "fill-opacity",

        legend: {
          color: "#F57C00",
        },
      },
      {
        id: "genangan_areagenangan",
        nameKey: "l_genangan_areagenangan",
        kind: "fill",
        data: v("genangan_areagenangan"),
        clickable: true,

        paint: {
          "fill-color": "#1976D2",
          "fill-opacity": 0.40,
          "fill-outline-color": "#125497",
        },

        defaultOn: false,

        opacity: 0.40,
        opacityProp: "fill-opacity",

        legend: {
          color: "#1976D2",
        },
      },

      {
        id: "genangan_areasungai",
        nameKey: "l_genangan_areasungai",
        kind: "fill",
        data: v("genangan_areasungai"),
        clickable: true,

        paint: {
          "fill-color": "#00A6D6",
          "fill-opacity": 0.35,
          "fill-outline-color": "#00779A",
        },

        defaultOn: false,

        opacity: 0.35,
        opacityProp: "fill-opacity",

        legend: {
          color: "#00A6D6",
        },
      },
    ],
  },
   // LOMEA
  {
    titleKey: "g_lomea",
    dot: "#FF9800",

    layers: [
      {
        id: "lomea_2009",
        nameKey: "l_lomea_2009",
        kind: "line",
        paint: {},
        defaultOn: false,
        lazy: true,
        cascade: true,
        children: [
          {
            id: "lo_po_asesories",
            nameKey: "l_lo_po_asesories",
            kind: "circle",
            data: v("09_lo_po_asesories"),
            clickable: true,
            lazy: true,
            paint: {
              "circle-color": "#D81B60",
              "circle-radius": 2,
              "circle-opacity": 1,
              "circle-stroke-color": "#9B1345",
              "circle-stroke-width": 1,
            },
            defaultOn: false,
            legend: {
              color: "#D81B60",
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
              "circle-color": "#1E88E5",
              "circle-radius": 2,
              "circle-opacity": 1,
              "circle-stroke-color": "#1561A4",
              "circle-stroke-width": 1,
            },
            defaultOn: false,
            legend: {
              color: "#1E88E5",
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
              "circle-color": "#F39C12",
              "circle-radius": 2,
              "circle-opacity": 1,
              "circle-stroke-color": "#AE700C",
              "circle-stroke-width": 1,
            },
            defaultOn: false,
            legend: {
              color: "#F39C12",
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
              "circle-color": "#6A1B9A",
              "circle-radius": 2,
              "circle-opacity": 1,
              "circle-stroke-color": "#4C136E",
              "circle-stroke-width": 1,
            },
            defaultOn: false,
            legend: {
              color: "#6A1B9A",
              circle: true,
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
              "line-color": "#757575",
              "line-width": 2,
            },
            defaultOn: false,
            legend: {
              color: "#757575",
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
              "line-color": "#FF9800",
              "line-width": 2,
            },
            defaultOn: false,
            legend: {
              color: "#FF9800",
              line: true,
            },
          },

          {
            id: "lo_li_desaindrain",
            nameKey: "l_lo_li_desaindrain",
            kind: "line",
            data: v("09_lo_li_desaindrain"),
            clickable: true,
            lazy: true,
            paint: {
              "line-color": "#1565C0",
              "line-width": 2,
            },
            defaultOn: false,
            legend: {
              color: "#1565C0",
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
              "line-color": "#E67E22",
              "line-width": 2,
            },
            defaultOn: false,
            legend: {
              color: "#E67E22",
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
              "line-color": "#212121",
              "line-width": 2,
            },
            defaultOn: false,
            legend: {
              color: "#212121",
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
              "line-color": "#1565C0",
              "line-width": 2,
            },
            defaultOn: false,
            legend: {
              color: "#1565C0",
              line: true,
            },
          },
{
            id: "lo_li_patoksaluran",
            nameKey: "l_lo_li_patoksaluran",
            kind: "line",
            data: v("09_lo_li_patoksaluran"),
            clickable: true,
            lazy: true,
            paint: {
              "line-color": "#D32F2F",
              "line-width": 2,
            },
            defaultOn: false,
            legend: {
              color: "#D32F2F",
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
              "line-color": "#2E7D32",
              "line-width": 2,
            },
            defaultOn: false,
            legend: {
              color: "#2E7D32",
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
              "line-color": "#7B1FA2",
              "line-width": 2,
            },
            defaultOn: false,
            legend: {
              color: "#7B1FA2",
              line: true,
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
              "fill-color": "#B0BEC5",
              "fill-opacity": 0.35,
              "fill-outline-color": "#7E888D",
            },
            defaultOn: false,
            opacity: 0.35,
            opacityProp: "fill-opacity",
            legend: {
              color: "#B0BEC5",
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
              "fill-color": "#FF9800",
              "fill-opacity": 0.35,
              "fill-outline-color": "#B76D00",
            },
            defaultOn: false,
            opacity: 0.35,
            opacityProp: "fill-opacity",
            legend: {
              color: "#FF9800",
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
              "fill-color": "#424242",
              "fill-opacity": 0.35,
              "fill-outline-color": "#2F2F2F",
            },
            defaultOn: false,
            opacity: 0.35,
            opacityProp: "fill-opacity",
            legend: {
              color: "#424242",
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
              "fill-color": "#00ACC1",
              "fill-opacity": 0.35,
              "fill-outline-color": "#007B8A",
            },
            defaultOn: false,
            opacity: 0.35,
            opacityProp: "fill-opacity",
            legend: {
              color: "#00ACC1",
            },
          },

        ],
      },
    ],
  },
{
  titleKey: "g_raibere",
  dot: "#14B8A6",

  layers: [
    {
      id: "raibere_2009",
      nameKey: "l_raibere_2009",
      kind: "line",
      paint: {},
      defaultOn: false,
      cascade: true,
      children: [
{
          id: "rei09_po_asesories",
          nameKey: "l_rei09_po_asesories",
          kind: "circle",
          data: v("09_rei_po_asesories"),
          defaultOn: false,
          paint: {
            "circle-color": "#D81B60",
            "circle-radius": 2,
            "circle-opacity": 1,
            "circle-stroke-color": "#9B1345",
            "circle-stroke-width": 1,
          },
          legend: {
            color: "#D81B60",
            circle: true,
          },
        },

        {
          id: "rei09_po_patoksaluran",
          nameKey: "l_rei09_po_patoksaluran",
          kind: "circle",
          data: v("09_rei_po_patoksaluran"),
          defaultOn: false,
          paint: {
            "circle-color": "#D32F2F",
            "circle-radius": 2,
            "circle-stroke-color": "#972121",
            "circle-stroke-width": 1,
          },
          legend: {
            color: "#D32F2F",
            circle: true,
          },
        },
        {
          id: "rei09_li_bangunan",
          nameKey: "l_rei09_li_bangunan",
          kind: "line",
          data: v("09_rei_li_bangunan"),
          defaultOn: false,
          paint: {
            "line-color": "#424242",
            "line-width": 2,
          },
          legend: {
            color: "#424242",
            line: true,
          },
        },

        {
          id: "rei09_li_cotambah",
          nameKey: "l_rei09_li_cotambah",
          kind: "line",
          data: v("09_rei_li_cotambah"),
          defaultOn: false,
          paint: {
            "line-color": "#2E7D32",
            "line-width": 2,
          },
          legend: {
            color: "#2E7D32",
            line: true,
          },
        },

        {
          id: "rei09_li_jalan",
          nameKey: "l_rei09_li_jalan",
          kind: "line",
          data: v("09_rei_li_jalan"),
          defaultOn: false,
          paint: {
            "line-color": "#E67E22",
            "line-width": 2,
          },
          legend: {
            color: "#E67E22",
            line: true,
          },
        },

        {
          id: "rei09_li_linepol",
          nameKey: "l_rei09_li_linepol",
          kind: "line",
          data: v("09_rei_li_linepol"),
          defaultOn: false,
          paint: {
            "line-color": "#616161",
            "line-width": 2,
          },
          legend: {
            color: "#616161",
            line: true,
          },
        },

        {
          id: "rei09_li_salexisting",
          nameKey: "l_rei09_li_salexisting",
          kind: "line",
          data: v("09_rei_li_salexisting"),
          defaultOn: false,
          paint: {
            "line-color": "#2E7D32",
            "line-width": 2,
          },
          legend: {
            color: "#2E7D32",
            line: true,
          },
        },

        {
          id: "rei09_li_saltersier",
          nameKey: "l_rei09_li_saltersier",
          kind: "line",
          data: v("09_rei_li_saltersier"),
          defaultOn: false,
          paint: {
            "line-color": "#7B1FA2",
            "line-width": 2,
          },
          legend: {
            color: "#7B1FA2",
            line: true,
          },
        },

        {
          id: "rei09_li_sungaialur",
          nameKey: "l_rei09_li_sungaialur",
          kind: "line",
          data: v("09_rei_li_sungaialur"),
          defaultOn: false,
          paint: {
            "line-color": "#00ACC1",
            "line-width": 2,
          },
          legend: {
            color: "#00ACC1",
            line: true,
          },
        },
{
          id: "rei09_ar_0",
          nameKey: "l_rei09_ar_0",
          kind: "fill",
          data: v("09_rei_ar_0"),
          defaultOn: false,
          paint: {
            "fill-color": "#9E9E9E",
            "fill-opacity": 0.35,
            "fill-outline-color": "#717171",
          },
          opacity: 0.35,
          opacityProp: "fill-opacity",
          legend: {
            color: "#9E9E9E",
          },
        },

        {
          id: "rei09_ar_bangsadap",
          nameKey: "l_rei09_ar_bangsadap",
          kind: "fill",
          data: v("09_rei_ar_bangsadap"),
          defaultOn: false,
          paint: {
            "fill-color": "#FF9800",
            "fill-opacity": 0.35,
            "fill-outline-color": "#B76D00",
          },
          opacity: 0.35,
          opacityProp: "fill-opacity",
          legend: {
            color: "#FF9800",
          },
        },

        {
          id: "rei09_ar_bmcp",
          nameKey: "l_rei09_ar_bmcp",
          kind: "fill",
          data: v("09_rei_ar_bmcp"),
          defaultOn: false,
          paint: {
            "fill-color": "#1E88E5",
            "fill-opacity": 0.35,
            "fill-outline-color": "#1561A4",
          },
          opacity: 0.35,
          opacityProp: "fill-opacity",
          legend: {
            color: "#1E88E5",
          },
        },

        {
          id: "rei09_ar_boxkwarter",
          nameKey: "l_rei09_ar_boxkwarter",
          kind: "fill",
          data: v("09_rei_ar_boxkwarter"),
          defaultOn: false,
          paint: {
            "fill-color": "#00ACC1",
            "fill-opacity": 0.35,
            "fill-outline-color": "#007B8A",
          },
          opacity: 0.35,
          opacityProp: "fill-opacity",
          legend: {
            color: "#00ACC1",
          },
        },

        {
          id: "rei09_ar_boxtersier",
          nameKey: "l_rei09_ar_boxtersier",
          kind: "fill",
          data: v("09_rei_ar_boxtersier"),
          defaultOn: false,
          paint: {
            "fill-color": "#0097A7",
            "fill-opacity": 0.35,
            "fill-outline-color": "#006C78",
          },
          opacity: 0.35,
          opacityProp: "fill-opacity",
          legend: {
            color: "#0097A7",
          },
        },

        {
          id: "rei09_ar_desain",
          nameKey: "l_rei09_ar_desain",
          kind: "fill",
          data: v("09_rei_ar_desain"),
          defaultOn: false,
          paint: {
            "fill-color": "#43A047",
            "fill-opacity": 0.35,
            "fill-outline-color": "#307333",
          },
          opacity: 0.35,
          opacityProp: "fill-opacity",
          legend: {
            color: "#43A047",
          },
        },

        {
          id: "rei09_ar_legend",
          nameKey: "l_rei09_ar_legend",
          kind: "fill",
          data: v("09_rei_ar_legend"),
          defaultOn: false,
          paint: {
            "fill-color": "#616161",
            "fill-opacity": 0.35,
            "fill-outline-color": "#454545",
          },
          opacity: 0.35,
          opacityProp: "fill-opacity",
          legend: {
            color: "#616161",
          },
        },

        {
          id: "rei09_ar_salpemb",
          nameKey: "l_rei09_ar_salpemb",
          kind: "fill",
          data: v("09_rei_ar_salpemb"),
          defaultOn: false,
          paint: {
            "fill-color": "#26A69A",
            "fill-opacity": 0.35,
            "fill-outline-color": "#1B776E",
          },
          opacity: 0.35,
          opacityProp: "fill-opacity",
          legend: {
            color: "#26A69A",
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
      defaultOn: false,
      cascade: true,
      children: [
        {
          id: "rei26_ar_access",
          nameKey: "l_rei26_ar_access",
          kind: "fill",
          data: v("26_rei_ar_access"),
          defaultOn: false,
          paint: {
            "fill-color": "#FF9800",
            "fill-opacity": 0.35,
            "fill-outline-color": "#B76D00",
          },
          opacity: 0.35,
          opacityProp: "fill-opacity",
          legend: {
            color: "#FF9800",
          },
        },

        {
          id: "rei26_ar_crest",
          nameKey: "l_rei26_ar_crest",
          kind: "fill",
          data: v("26_rei_ar_crest"),
          defaultOn: false,
          paint: {
            "fill-color": "#6A1B9A",
            "fill-opacity": 0.35,
            "fill-outline-color": "#4C136E",
          },
          opacity: 0.35,
          opacityProp: "fill-opacity",
          legend: {
            color: "#6A1B9A",
          },
        },

        {
          id: "rei26_ar_downstream",
          nameKey: "l_rei26_ar_downstream",
          kind: "fill",
          data: v("26_rei_ar_downstream"),
          defaultOn: false,
          paint: {
            "fill-color": "#1565C0",
            "fill-opacity": 0.35,
            "fill-outline-color": "#0F488A",
          },
          opacity: 0.35,
          opacityProp: "fill-opacity",
          legend: {
            color: "#1565C0",
          },
        },

        {
          id: "rei26_ar_flushingcanal",
          nameKey: "l_rei26_ar_flushingcanal",
          kind: "fill",
          data: v("26_rei_ar_flushingcanal"),
          defaultOn: false,
          paint: {
            "fill-color": "#00ACC1",
            "fill-opacity": 0.35,
            "fill-outline-color": "#007B8A",
          },
          opacity: 0.35,
          opacityProp: "fill-opacity",
          legend: {
            color: "#00ACC1",
          },
        },

        {
          id: "rei26_ar_flushinggate",
          nameKey: "l_rei26_ar_flushinggate",
          kind: "fill",
          data: v("26_rei_ar_flushinggate"),
          defaultOn: false,
          paint: {
            "fill-color": "#00838F",
            "fill-opacity": 0.35,
            "fill-outline-color": "#005E66",
          },
          opacity: 0.35,
          opacityProp: "fill-opacity",
          legend: {
            color: "#00838F",
          },
        },

        {
          id: "rei26_ar_flushingpier",
          nameKey: "l_rei26_ar_flushingpier",
          kind: "fill",
          data: v("26_rei_ar_flushingpier"),
          defaultOn: false,
          paint: {
            "fill-color": "#039BE5",
            "fill-opacity": 0.35,
            "fill-outline-color": "#026FA4",
          },
          opacity: 0.35,
          opacityProp: "fill-opacity",
          legend: {
            color: "#039BE5",
          },
        },

        {
          id: "rei26_ar_ingate",
          nameKey: "l_rei26_ar_ingate",
          kind: "fill",
          data: v("26_rei_ar_ingate"),
          defaultOn: false,
          paint: {
            "fill-color": "#2E7D32",
            "fill-opacity": 0.35,
            "fill-outline-color": "#215A24",
          },
          opacity: 0.35,
          opacityProp: "fill-opacity",
          legend: {
            color: "#2E7D32",
          },
        },

        {
          id: "rei26_ar_intake",
          nameKey: "l_rei26_ar_intake",
          kind: "fill",
          data: v("26_rei_ar_intake"),
          defaultOn: false,
          paint: {
            "fill-color": "#43A047",
            "fill-opacity": 0.35,
            "fill-outline-color": "#307333",
          },
          opacity: 0.35,
          opacityProp: "fill-opacity",
          legend: {
            color: "#43A047",
          },
        },

        {
          id: "rei26_ar_irrigation",
          nameKey: "l_rei26_ar_irrigation",
          kind: "fill",
          data: v("26_rei_ar_irrigation"),
          defaultOn: false,
          paint: {
            "fill-color": "#1B5E20",
            "fill-opacity": 0.35,
            "fill-outline-color": "#134317",
          },
          opacity: 0.35,
          opacityProp: "fill-opacity",
          legend: {
            color: "#1B5E20",
          },
        },

        {
          id: "rei26_ar_parking",
          nameKey: "l_rei26_ar_parking",
          kind: "fill",
          data: v("26_rei_ar_parking"),
          defaultOn: false,
          paint: {
            "fill-color": "#616161",
            "fill-opacity": 0.35,
            "fill-outline-color": "#454545",
          },
          opacity: 0.35,
          opacityProp: "fill-opacity",
          legend: {
            color: "#616161",
          },
        },

        {
          id: "rei26_ar_primer",
          nameKey: "l_rei26_ar_primer",
          kind: "fill",
          data: v("26_rei_ar_primer"),
          defaultOn: false,
          paint: {
            "fill-color": "#795548",
            "fill-opacity": 0.35,
            "fill-outline-color": "#573D33",
          },
          opacity: 0.35,
          opacityProp: "fill-opacity",
          legend: {
            color: "#795548",
          },
        },

        {
          id: "rei26_ar_road",
          nameKey: "l_rei26_ar_road",
          kind: "fill",
          data: v("26_rei_ar_road"),
          defaultOn: false,
          paint: {
            "fill-color": "#E67E22",
            "fill-opacity": 0.35,
            "fill-outline-color": "#A55A18",
          },
          opacity: 0.35,
          opacityProp: "fill-opacity",
          legend: {
            color: "#E67E22",
          },
        },

        {
          id: "rei26_ar_rock",
          nameKey: "l_rei26_ar_rock",
          kind: "fill",
          data: v("26_rei_ar_rock"),
          defaultOn: false,
          paint: {
            "fill-color": "#616161",
            "fill-opacity": 0.35,
            "fill-outline-color": "#454545",
          },
          opacity: 0.35,
          opacityProp: "fill-opacity",
          legend: {
            color: "#616161",
          },
        },

        {
          id: "rei26_ar_silt",
          nameKey: "l_rei26_ar_silt",
          kind: "fill",
          data: v("26_rei_ar_silt"),
          defaultOn: false,
          paint: {
            "fill-color": "#BDBDBD",
            "fill-opacity": 0.35,
            "fill-outline-color": "#888888",
          },
          opacity: 0.35,
          opacityProp: "fill-opacity",
          legend: {
            color: "#BDBDBD",
          },
        },

        {
          id: "rei26_ar_stilling",
          nameKey: "l_rei26_ar_stilling",
          kind: "fill",
          data: v("26_rei_ar_stilling"),
          defaultOn: false,
          paint: {
            "fill-color": "#4FC3F7",
            "fill-opacity": 0.35,
            "fill-outline-color": "#388CB1",
          },
          opacity: 0.35,
          opacityProp: "fill-opacity",
          legend: {
            color: "#4FC3F7",
          },
        },

        {
          id: "rei26_ar_upstream",
          nameKey: "l_rei26_ar_upstream",
          kind: "fill",
          data: v("26_rei_ar_upstream"),
          defaultOn: false,
          paint: {
            "fill-color": "#0288D1",
            "fill-opacity": 0.35,
            "fill-outline-color": "#016196",
          },
          opacity: 0.35,
          opacityProp: "fill-opacity",
          legend: {
            color: "#0288D1",
          },
        },

        {
          id: "rei26_ar_weirbody",
          nameKey: "l_rei26_ar_weirbody",
          kind: "fill",
          data: v("26_rei_ar_weirbody"),
          defaultOn: false,
          paint: {
            "fill-color": "#512DA8",
            "fill-opacity": 0.35,
            "fill-outline-color": "#3A2078",
          },
          opacity: 0.35,
          opacityProp: "fill-opacity",
          legend: {
            color: "#512DA8",
          },
        },

        {
          id: "rei26_ar_wing",
          nameKey: "l_rei26_ar_wing",
          kind: "fill",
          data: v("26_rei_ar_wing"),
          defaultOn: false,
          paint: {
            "fill-color": "#3949AB",
            "fill-opacity": 0.35,
            "fill-outline-color": "#29347B",
          },
          opacity: 0.35,
          opacityProp: "fill-opacity",
          legend: {
            color: "#3949AB",
          },
        },
      ],
    },
  ],
},
{
  titleKey: "g_oebaba",
  dot: "#6A1B9A",

  layers: [
    
    {
      id: "oebaba_2009",
      nameKey: "l_oebaba_2009",
      kind: "line",
      paint: {},
      defaultOn: false,
      lazy: true,
      cascade: true,
      children: [
      
        {
          id: "oe09_po_bmcp",
          nameKey: "l_oe09_po_bmcp",
          kind: "circle",
          data: v("09_oe_po_bmcp"),
          clickable: true,
          lazy: true,
          paint: {
            "circle-color": "#1E88E5",
            "circle-radius": 2,
            "circle-opacity": 1,
            "circle-stroke-color": "#1561A4",
            "circle-stroke-width": 1,
          },
          defaultOn: false,
          legend: { color: "#1E88E5", circle: true },
        },
       
        {
          id: "oe09_po_legend",
          nameKey: "l_oe09_po_legend",
          kind: "circle",
          data: v("09_oe_po_legend"),
          clickable: true,
          lazy: true,
          paint: {
            "circle-color": "#424242",
            "circle-radius": 2,
            "circle-opacity": 1,
            "circle-stroke-color": "#2F2F2F",
            "circle-stroke-width": 1,
          },
          defaultOn: false,
          legend: { color: "#424242", circle: true },
        },
      
        {
          id: "oe09_po_patoksaluran",
          nameKey: "l_oe09_po_patoksaluran",
          kind: "circle",
          data: v("09_oe_po_patoksaluran"),
          clickable: true,
          lazy: true,
          paint: {
            "circle-color": "#D32F2F",
            "circle-radius": 2,
            "circle-opacity": 1,
            "circle-stroke-color": "#972121",
            "circle-stroke-width": 1,
          },
          defaultOn: false,
          legend: { color: "#D32F2F", circle: true },
        },
        {
          id: "oe09_po_profile",
          nameKey: "l_oe09_po_profile",
          kind: "circle",
          data: v("09_oe_po_profile"),
          clickable: true,
          lazy: true,
          paint: {
            "circle-color": "#7E57C2",
            "circle-radius": 2,
            "circle-opacity": 1,
            "circle-stroke-color": "#5A3E8B",
            "circle-stroke-width": 1,
          },
          defaultOn: false,
          legend: { color: "#7E57C2", circle: true },
        },
      
        {
          id: "oe09_li_desainpembuang",
          nameKey: "l_oe09_li_desainpembuang",
          kind: "line",
          data: v("09_oe_li_desainpembuang"),
          clickable: true,
          lazy: true,
          paint: { "line-color": "#1565C0", "line-width": 2 },
          defaultOn: false,
          legend: { color: "#1565C0", line: true },
        },
        {
          id: "oe09_li_design",
          nameKey: "l_oe09_li_design",
          kind: "line",
          data: v("09_oe_li_design"),
          clickable: true,
          lazy: true,
          paint: { "line-color": "#F39C12", "line-width": 2 },
          defaultOn: false,
          legend: { color: "#F39C12", line: true },
        },
  
        {
          id: "oe09_li_jalan",
          nameKey: "l_oe09_li_jalan",
          kind: "line",
          data: v("09_oe_li_jalan"),
          clickable: true,
          lazy: true,
          paint: { "line-color": "#E67E22", "line-width": 2 },
          defaultOn: false,
          legend: { color: "#E67E22", line: true },
        },
      
        {
          id: "oe09_li_linepol",
          nameKey: "l_oe09_li_linepol",
          kind: "line",
          data: v("09_oe_li_linepol"),
          clickable: true,
          lazy: true,
          paint: { "line-color": "#616161", "line-width": 2 },
          defaultOn: false,
          legend: { color: "#616161", line: true },
        },
       
        {
          id: "oe09_li_msalkwarter",
          nameKey: "l_oe09_li_msalkwarter",
          kind: "line",
          data: v("09_oe_li_msalkwarter"),
          clickable: true,
          lazy: true,
          paint: { "line-color": "#00ACC1", "line-width": 2 },
          defaultOn: false,
          legend: { color: "#00ACC1", line: true },
        },
        {
          id: "oe09_li_msalpembuang",
          nameKey: "l_oe09_li_msalpembuang",
          kind: "line",
          data: v("09_oe_li_msalpembuang"),
          clickable: true,
          lazy: true,
          paint: { "line-color": "#0288D1", "line-width": 2 },
          defaultOn: false,
          legend: { color: "#0288D1", line: true },
        },
        {
          id: "oe09_li_msaltersier",
          nameKey: "l_oe09_li_msaltersier",
          kind: "line",
          data: v("09_oe_li_msaltersier"),
          clickable: true,
          lazy: true,
          paint: { "line-color": "#7B1FA2", "line-width": 2 },
          defaultOn: false,
          legend: { color: "#7B1FA2", line: true },
        },

        {
          id: "oe09_li_salexisting",
          nameKey: "l_oe09_li_salexisting",
          kind: "line",
          data: v("09_oe_li_salexisting"),
          clickable: true,
          lazy: true,
          paint: { "line-color": "#2E7D32", "line-width": 2 },
          defaultOn: false,
          legend: { color: "#2E7D32", line: true },
        },
        {
          id: "oe09_li_sungaialur",
          nameKey: "l_oe09_li_sungaialur",
          kind: "line",
          data: v("09_oe_li_sungaialur"),
          clickable: true,
          lazy: true,
          paint: { "line-color": "#00ACC1", "line-width": 2 },
          defaultOn: false,
          legend: { color: "#00ACC1", line: true },
        },
        
        {
          id: "oe09_ar_aliranair",
          nameKey: "l_oe09_ar_aliranair",
          kind: "fill",
          data: v("09_oe_ar_aliranair"),
          clickable: true,
          lazy: true,
          paint: {
            "fill-color": "#4FC3F7",
            "fill-opacity": 0.40,
            "fill-outline-color": "#388CB1",
          },
          defaultOn: false,
          opacity: 0.40,
          opacityProp: "fill-opacity",
          legend: { color: "#4FC3F7" },
        },
        {
          id: "oe09_ar_arsir",
          nameKey: "l_oe09_ar_arsir",
          kind: "fill",
          data: v("09_oe_ar_arsir"),
          clickable: true,
          lazy: true,
          paint: {
            "fill-color": "#BDBDBD",
            "fill-opacity": 0.30,
            "fill-outline-color": "#888888",
          },
          defaultOn: false,
          opacity: 0.30,
          opacityProp: "fill-opacity",
          legend: { color: "#BDBDBD" },
        },
        {
          id: "oe09_ar_bangbagi",
          nameKey: "l_oe09_ar_bangbagi",
          kind: "fill",
          data: v("09_oe_ar_bangbagi"),
          clickable: true,
          lazy: true,
          paint: {
            "fill-color": "#EC407A",
            "fill-opacity": 0.40,
            "fill-outline-color": "#A92E57",
          },
          defaultOn: false,
          opacity: 0.40,
          opacityProp: "fill-opacity",
          legend: { color: "#EC407A" },
        },
        {
          id: "oe09_ar_lahanpotensi",
          nameKey: "l_oe09_ar_lahanpotensi",
          kind: "fill",
          data: v("09_oe_ar_lahanpotensi"),
          clickable: true,
          lazy: true,
          paint: {
            "fill-color": "#66BB6A",
            "fill-opacity": 0.35,
            "fill-outline-color": "#49864C",
          },
          defaultOn: false,
          opacity: 0.35,
          opacityProp: "fill-opacity",
          legend: { color: "#66BB6A" },
        },
        {
          id: "oe09_ar_mbangsadap",
          nameKey: "l_oe09_ar_mbangsadap",
          kind: "fill",
          data: v("09_oe_ar_mbangsadap"),
          clickable: true,
          lazy: true,
          paint: {
            "fill-color": "#FF9800",
            "fill-opacity": 0.40,
            "fill-outline-color": "#B76D00",
          },
          defaultOn: false,
          opacity: 0.40,
          opacityProp: "fill-opacity",
          legend: { color: "#FF9800" },
        },

        {
          id: "oe09_ar_pemukiman",
          nameKey: "l_oe09_ar_pemukiman",
          kind: "fill",
          data: v("09_oe_ar_pemukiman"),
          clickable: true,
          lazy: true,
          paint: {
            "fill-color": "#F4A261",
            "fill-opacity": 0.35,
            "fill-outline-color": "#AF7445",
          },
          defaultOn: false,
          opacity: 0.35,
          opacityProp: "fill-opacity",
          legend: { color: "#F4A261" },
        },
      
      ],
    },

    {
      id: "oebaba_2026",
      nameKey: "l_oebaba_2026",
      kind: "line",
      paint: {},
      defaultOn: false,
      cascade: true,
      children: [
        {
          id: "oe_crest",
          nameKey: "l_oe_crest",
          kind: "line",
          data: v("oe_crest"),
          clickable: true,
          paint: { "line-color": "#6A1B9A", "line-width": 2 },
          defaultOn: false,
          legend: { color: "#6A1B9A", line: true },
        },
        {
          id: "oe_downstream",
          nameKey: "l_oe_downstream",
          kind: "line",
          data: v("oe_downstream"),
          clickable: true,
          paint: { "line-color": "#1565C0", "line-width": 2 },
          defaultOn: false,
          legend: { color: "#1565C0", line: true },
        },
        {
          id: "oe_flushingcanal",
          nameKey: "l_oe_flushingcanal",
          kind: "line",
          data: v("oe_flushingcanal"),
          clickable: true,
          paint: { "line-color": "#00ACC1", "line-width": 2 },
          defaultOn: false,
          legend: { color: "#00ACC1", line: true },
        },
        {
          id: "oe_flushingpier",
          nameKey: "l_oe_flushingpier",
          kind: "line",
          data: v("oe_flushingpier"),
          clickable: true,
          paint: { "line-color": "#039BE5", "line-width": 2 },
          defaultOn: false,
          legend: { color: "#039BE5", line: true },
        },
        {
          id: "oe_guidewall",
          nameKey: "l_oe_guidewall",
          kind: "line",
          data: v("oe_guidewall"),
          clickable: true,
          paint: { "line-color": "#616161", "line-width": 2 },
          defaultOn: false,
          legend: { color: "#616161", line: true },
        },
        {
          id: "oe_ingatpier",
          nameKey: "l_oe_ingatpier",
          kind: "line",
          data: v("oe_ingatpier"),
          clickable: true,
          paint: { "line-color": "#2E7D32", "line-width": 2 },
          defaultOn: false,
          legend: { color: "#2E7D32", line: true },
        },
        {
          id: "oe_irrigationcanal",
          nameKey: "l_oe_irrigationcanal",
          kind: "line",
          data: v("oe_irrigationcanal"),
          clickable: true,
          paint: { "line-color": "#43A047", "line-width": 2 },
          defaultOn: false,
          legend: { color: "#43A047", line: true },
        },
        {
          id: "oe_irrigationpier",
          nameKey: "l_oe_irrigationpier",
          kind: "line",
          data: v("oe_irrigationpier"),
          clickable: true,
          paint: { "line-color": "#1B5E20", "line-width": 2 },
          defaultOn: false,
          legend: { color: "#1B5E20", line: true },
        },
        {
          id: "oe_strais",
          nameKey: "l_oe_strais",
          kind: "line",
          data: v("oe_strais"),
          clickable: true,
          paint: { "line-color": "#795548", "line-width": 2 },
          defaultOn: false,
          legend: { color: "#795548", line: true },
        },
        {
          id: "oe_upstream",
          nameKey: "l_oe_upstream",
          kind: "line",
          data: v("oe_upstream"),
          clickable: true,
          paint: { "line-color": "#0288D1", "line-width": 2 },
          defaultOn: false,
          legend: { color: "#0288D1", line: true },
        },
        {
          id: "oe_intake",
          nameKey: "l_oe_intake",
          kind: "symbol",
          data: v("oe_intake"),
          clickable: true,
          paint: {},
          defaultOn: false,
          legend: { color: "#0284C7" },
        },
        {
          id: "oe_irrigationgate",
          nameKey: "l_oe_irrigationgate",
          kind: "symbol",
          data: v("oe_irrigationgate"),
          clickable: true,
          paint: {},
          defaultOn: false,
          legend: { color: "#15803D" },
        },
        {
          id: "oe_operatinghouse",
          nameKey: "l_oe_operatinghouse",
          kind: "fill",
          data: v("oe_operatinghouse"),
          clickable: true,
          paint: {
            "fill-color": "#424242",
            "fill-opacity": 0.5,
            "fill-outline-color": "#2F2F2F",
          },
          defaultOn: false,
          opacity: 0.5,
          opacityProp: "fill-opacity",
          legend: { color: "#424242" },
        },
        {
          id: "oe_silt",
          nameKey: "l_oe_silt",
          kind: "fill",
          data: v("oe_silt"),
          clickable: true,
          paint: {
            "fill-color": "#BDBDBD",
            "fill-opacity": 0.4,
            "fill-outline-color": "#888888",
          },
          defaultOn: false,
          opacity: 0.4,
          opacityProp: "fill-opacity",
          legend: { color: "#BDBDBD" },
        },
        {
          id: "oe_stilling",
          nameKey: "l_oe_stilling",
          kind: "fill",
          data: v("oe_stilling"),
          clickable: true,
          paint: {
            "fill-color": "#4FC3F7",
            "fill-opacity": 0.3,
            "fill-outline-color": "#388CB1",
          },
          defaultOn: false,
          opacity: 0.3,
          opacityProp: "fill-opacity",
          legend: { color: "#4FC3F7" },
        },
        {
          id: "oe_weirbody",
          nameKey: "l_oe_weirbody",
          kind: "fill",
          data: v("oe_weirbody"),
          clickable: true,
          paint: {
            "fill-color": "#512DA8",
            "fill-opacity": 0.5,
            "fill-outline-color": "#3A2078",
          },
          defaultOn: false,
          opacity: 0.5,
          opacityProp: "fill-opacity",
          legend: { color: "#512DA8" },
        },
        {
          id: "oe_wing",
          nameKey: "l_oe_wing",
          kind: "fill",
          data: v("oe_wing"),
          clickable: true,
          paint: {
            "fill-color": "#3949AB",
            "fill-opacity": 0.4,
            "fill-outline-color": "#29347B",
          },
          defaultOn: false,
          opacity: 0.4,
          opacityProp: "fill-opacity",
          legend: { color: "#3949AB" },
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
const findLayer = (layers: LayerDef[], id: string): LayerDef | undefined => {
  for (const l of layers) {
    if (l.id === id) return l;
    const hit = l.children && findLayer(l.children, id);
    if (hit) return hit;
  }
  return undefined;
};

const collectIds = (layers: LayerDef[]): string[] =>
  layers.flatMap((l) => [l.id, ...(l.children ? collectIds(l.children) : [])]);

/** Semua id turunan (rekursif) dari sebuah layer parent. */
export const getDescendantIds = (id: string): string[] => {
  const node = findLayer(GROUPS.flatMap((g) => g.layers), id);
  return node?.children ? collectIds(node.children) : [];
};

/** Apakah layer ini parent ber-cascade. */
export const isCascadeParent = (id: string): boolean =>
  findLayer(GROUPS.flatMap((g) => g.layers), id)?.cascade === true;
export const ALL_LAYERS: LayerDef[] = GROUPS.flatMap((g) =>
  flattenLayers(g.layers)
);

export const LEGEND_LAYERS: LayerDef[] = ALL_LAYERS.filter((l) => l.legend);
