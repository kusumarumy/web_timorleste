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

export type Basemap = {
  id: string;
  labelKey: string;
  tiles: string[];
  attribution: string;
  minzoom?: number;
  maxzoom?: number;
};

export const BASEMAPS: Basemap[] = [
  {
    id: "map",
    labelKey: "bm_map",
    tiles: [
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    ],
    attribution: "© OpenStreetMap",
  },

  {
    id: "sat",
    labelKey: "bm_sat",
    tiles: [
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    ],
    attribution: "Esri, Maxar",
  },

  {
    id: "ortho",
    labelKey: "bm_ortho",
    tiles: [
      `${R2}/orthophoto/tiles/{z}/{x}/{y}.webp`,
    ],
    attribution: "Orthophoto",
    minzoom: 13,
    maxzoom: 21,
  },

  {
    id: "hybrid",
    labelKey: "bm_hybrid",
    tiles: [
      "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
    ],
    attribution: "© Google Maps",
  },

  {
    id: "streets",
    labelKey: "bm_streets",
    tiles: [
      "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    ],
    attribution: "© Google Maps",
  },

  {
    id: "opentopo",
    labelKey: "bm_opentopo",
    tiles: [
      "https://tile.opentopomap.org/{z}/{x}/{y}.png",
    ],
    attribution: "© OpenTopoMap",
  },
];

export const TERRAIN_OPTIONS = {
  aws: {
    id: "aws",
    label: "AWS Terrarium 30 m",
    tiles: [
      "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
    ],
    encoding: "terrarium" as const,
    minzoom: 0,
    maxzoom: 14,
    bounds: [-180, -85.0511, 180, 85.0511],
    adjustable: false,
  },

  r2: {
    id: "r2",
    label: "DTM 3 m",
    tiles: [
      `${R2}/dtm/{z}/{x}/{y}.png`,
    ],
    encoding: "terrarium" as const,
    minzoom: 8,
    maxzoom: 16,
    bounds: [125.3505, -9.2745, 125.6254, -8.9916],
    adjustable: false,
  },
} as const;

export type TerrainKey =
  keyof typeof TERRAIN_OPTIONS;

export type LayerKind =
  | "raster"
  | "fill"
  | "line"
  | "circle"
  | "symbol";

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
  iconSize?: number;
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
subProp?: string;
  
  defaultOn: boolean;

  opacity?: number;
  opacityProp?: string;

  legend?: {
    color: string;
    line?: boolean;
    circle?: boolean;
    svg?: string;
    width?: number;
    dasharray?: number[];
    opacity?: number;
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

const SYM = {

  line: {
    road: {
      color: "#424242",
      width: 2.4,
    },

    roadAccess: {
      color: "#616161",
      width: 2.0,
    },

    irrigationExisting: {
      color: "#00897B",
      width: 2.4,
    },

    irrigationTertiary: {
      color: "#7B1FA2",
      width: 2.2,
      dasharray: [6, 3],
    },

    drainage: {
      color: "#1565C0",
      width: 2.4,
      dasharray: [10, 4],
    },

    drainageSecondary: {
      color: "#0288D1",
      width: 2.2,
      dasharray: [6, 3],
    },

    river: {
      color: "#00A6D6",
      width: 2.5,
    },

    design: {
      color: "#F39C12",
      width: 2.0,
      dasharray: [6, 3],
    },

    boundary: {
      color: "#616161",
      width: 1.2,
      dasharray: [7, 4],
    },

    building: {
      color: "#8D6E63",
      width: 2.0,
    },

    bridge: {
      color: "#212121",
      width: 3.0,
    },

    structure: {
      color: "#795548",
      width: 2.0,
    },

    guideWall: {
      color: "#616161",
      width: 2.0,
    },

    flushing: {
      color: "#00ACC1",
      width: 2.3,
    },

    pier: {
      color: "#039BE5",
      width: 2.3,
    },

    weir: {
      color: "#512DA8",
      width: 2.5,
    },

    wing: {
      color: "#3949AB",
      width: 2.3,
    },

    contour: {
      color: "#8D4A2B",
      width: 1.2,
    },
        upstream: {
      color: "#0288D1",
      width: 2.3,
    },
  },

  point: {
    patokSaluran: "#D32F2F",
    bm: "#1E88E5",
    design: "#F39C12",
    accessories: "#D81B60",
    cp: "#424242",
    profile: "#7E57C2",
    intake: "#0284C7",
    gate: "#15803D",
    coordinate: "#7B1FA2",
    kupasan: "#D32F2F",
    drill: "#D32F2F",
  },

  polygon: {
    building: {
      color: "#E53935",
      opacity: 0.45,
      outline: "#B71C1C",
    },

    settlement: {
      color: "#F4A261",
      opacity: 0.35,
      outline: "#AF7445",
    },

    irrigationArea: {
      color: "#66BB6A",
      opacity: 0.25,
      outline: "#2E7D32",
    },

    water: {
      color: "#29B6F6",
      opacity: 0.40,
      outline: "#0277BD",
    },

    river: {
      color: "#00A6D6",
      opacity: 0.45,
      outline: "#00779A",
    },

    catchment: {
      color: "#90CAF9",
      opacity: 0.22,
      outline: "#5C8FB5",
    },

    watershed: {
      color: "#B3E5FC",
      opacity: 0.18,
      outline: "#6B9CAF",
    },

    road: {
      color: "#616161",
      opacity: 0.40,
      outline: "#212121",
    },

    access: {
      color: "#FFB74D",
      opacity: 0.35,
      outline: "#B76D00",
    },

    canal: {
      color: "#26A69A",
      opacity: 0.35,
      outline: "#1B776E",
    },

    drainage: {
      color: "#1565C0",
      opacity: 0.35,
      outline: "#0F488A",
    },

    design: {
      color: "#F39C12",
      opacity: 0.35,
      outline: "#B76D00",
    },

    areaGeneral: {
      color: "#9E9E9E",
      opacity: 0.30,
      outline: "#717171",
    },

    soil: {
      color: "#8D6E63",
      opacity: 0.30,
      outline: "#5D4037",
    },

    rock: {
      color: "#757575",
      opacity: 0.30,
      outline: "#4E4E4E",
    },

    silt: {
      color: "#BDBDBD",
      opacity: 0.35,
      outline: "#888888",
    },

    stilling: {
      color: "#4FC3F7",
      opacity: 0.30,
      outline: "#388CB1",
    },

    weirBody: {
      color: "#512DA8",
      opacity: 0.40,
      outline: "#3A2078",
    },

    wing: {
      color: "#3949AB",
      opacity: 0.35,
      outline: "#29347B",
    },

    upstream: {
      color: "#0288D1",
      opacity: 0.30,
      outline: "#016196",
    },

    downstream: {
      color: "#1565C0",
      opacity: 0.30,
      outline: "#0F488A",
    },

    flushing: {
      color: "#00ACC1",
      opacity: 0.30,
      outline: "#007B8A",
    },

    flushingGate: {
      color: "#00838F",
      opacity: 0.30,
      outline: "#005E66",
    },

    flushingPier: {
      color: "#039BE5",
      opacity: 0.30,
      outline: "#026FA4",
    },

    intake: {
    color: "#43A047",
    opacity: 0.30,
    outline: "#307333",
    },
    
    gate: {
      color: "#15803D",
      opacity: 0.30,
      outline: "#0F5C2B",
    },
    
    irrigationStructure: {
      color: "#2E7D32",
      opacity: 0.30,
      outline: "#215A24",
    },

    parking: {
      color: "#616161",
      opacity: 0.30,
      outline: "#454545",
    },

    primer: {
      color: "#795548",
      opacity: 0.30,
      outline: "#573D33",
    },

    urban: {
      color: "#E57373",
      opacity: 0.35,
      outline: "#A45252",
    },

    lowVegetation: {
      color: "#9CCC65",
      opacity: 0.35,
      outline: "#709248",
    },

    highVegetation: {
      color: "#2E7D32",
      opacity: 0.40,
      outline: "#215A24",
    },

    ground: {
      color: "#C8A97E",
      opacity: 0.35,
      outline: "#90795A",
    },

    palm: {
      color: "#66A65C",
      opacity: 0.35,
      outline: "#497742",
    },

    ricefield: {
      color: "#FBC02D",
      opacity: 0.35,
      outline: "#B48A20",
    },

    sugarcane: {
      color: "#9CCC65",
      opacity: 0.35,
      outline: "#668E3E",
    },

    protectedForest: {
      color: "#00695C",
      opacity: 0.25,
      outline: "#004D40",
    },

    inundation: {
      color: "#1976D2",
      opacity: 0.40,
      outline: "#125497",
    },
  },
} as const;

const linePaint = (s: {
  color: string;
  width: number;
  dasharray?: readonly number[];
}) => ({
  "line-color": s.color,
  "line-width": s.width,
  ...(s.dasharray
    ? { "line-dasharray": [...s.dasharray] }
    : {}),
});

const lineLegend = (s: {
  color: string;
  width: number;
  dasharray?: readonly number[];
}) => ({
  color: s.color,
  line: true,
  width: s.width,
  ...(s.dasharray
    ? { dasharray: [...s.dasharray] }
    : {}),
});

const fillPaint = (
  style: {
    color: string;
    opacity: number;
    outline: string;
  },
) => ({
  "fill-color": style.color,
  "fill-opacity": style.opacity,
  "fill-outline-color": style.outline,
});

const fillLegend = (
  style: {
    color: string;
    opacity: number;
  },
) => ({
  color: style.color,
  opacity: style.opacity,
});

const pointPaint = (
  color: string,
  radius = 2.5,
  stroke?: string,
) => ({
  "circle-color": color,
  "circle-radius": radius,
  "circle-opacity": 1,
  ...(stroke
    ? {
        "circle-stroke-color": stroke,
        "circle-stroke-width": 1,
      }
    : {}),
});
export const GROUPS: LayerGroup[] = [

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

        paint: linePaint({
          color: "#4FC3F7",
          width: 2.5,
        }),

        defaultOn: true,

        legend: lineLegend({
          color: "#4FC3F7",
          width: 2.5,
        }),
      },

      {
        id: "aoi_lidar",
        nameKey: "l_aoi_lidar",
        kind: "line",
        data: v("aoi_lidar"),
        clickable: true,

        paint: linePaint({
          color: "#1565C0",
          width: 2.5,
        }),

        defaultOn: true,

        legend: lineLegend({
          color: "#1565C0",
          width: 2.5,
        }),
      },
    ],
  },

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
          "fill-outline-color": "#FBC02D",
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
          "fill-outline-color": "#F57C00",
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
          "fill-outline-color": "#C2185B",
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
          width: 2.4,
          dasharray: [14, 7],
        },
      },
    ],
  },

  {
    titleKey: "g_contour",
    dot: "#8D4A2B",

    layers: [
      {
        id: "contour",
        nameKey: "l_contour",
        kind: "line",
        data: r2Vector("contour"),

        paint: linePaint(SYM.line.contour),

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

        legend: lineLegend(SYM.line.contour),
      },
    ],
  },
  {
    titleKey: "g_net",
    dot: SYM.line.road.color,

    layers: [
      {
        id: "road",
        nameKey: "l_road",
        kind: "line",
        data: v("road"),
        clickable: true,

        paint: linePaint(SYM.line.road),

        defaultOn: false,

        legend: lineLegend(SYM.line.road),
      },
    ],
  },

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
        iconSize: 0.05,
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
          color: "#00897B",
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
        iconSize: 0.04,
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
        iconSize: 0.04,
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
          color: "#512DA8",
          svg: "weir",
        },
      },

      {
        id: "irrigation",
        nameKey: "l_irrigation",
        kind: "line",
        data: v("irrigation"),
        clickable: true,

        paint: linePaint(SYM.line.irrigationExisting),

        defaultOn: false,

        legend: lineLegend(SYM.line.irrigationExisting),
      },

      {
        id: "catchment",
        nameKey: "l_catchment",
        kind: "fill",
        data: v("catchment"),
        clickable: true,

        paint: fillPaint(SYM.polygon.catchment),

        defaultOn: false,

        opacity: SYM.polygon.catchment.opacity,
        opacityProp: "fill-opacity",

        legend: fillLegend(SYM.polygon.catchment),

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

        paint: fillPaint(SYM.polygon.river),

        defaultOn: false,

        opacity: SYM.polygon.river.opacity,
        opacityProp: "fill-opacity",

        legend: fillLegend(SYM.polygon.river),
      },

      {
        id: "watershed",
        nameKey: "l_watershed",
        kind: "fill",
        data: v("watershed"),
        clickable: true,

        paint: fillPaint(SYM.polygon.watershed),

        defaultOn: false,

        opacity: SYM.polygon.watershed.opacity,
        opacityProp: "fill-opacity",

        legend: fillLegend(SYM.polygon.watershed),
      },
    ],
  },

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
          "line-color": SYM.polygon.protectedForest.outline,
          "line-width": 1.6,
          "line-dasharray": [6, 3],
          "line-opacity": 1,
        },

        defaultOn: false,

        legend: {
          color: SYM.polygon.protectedForest.outline,
          line: true,
          width: 1.6,
          dasharray: [6, 3],
        },
      },

      {
  id: "10irrigationareas",         
  nameKey: "l_10irrigationareas",   
  kind: "fill",
  data: v("10irrigationareas"),
  clickable: true,

  paint: fillPaint(SYM.polygon.irrigationArea),
  defaultOn: false,

  opacity: SYM.polygon.irrigationArea.opacity,
  opacityProp: "fill-opacity",

  legend: fillLegend(SYM.polygon.irrigationArea),

  subProp: "Name",                 // ← nama kolom di GeoJSON, verifikasi dulu (lihat langkah 3)

  sublayers: [
    { id: "akadiru_kede", labelKey: "di_akadiru_kede", filterValue: "AKADIRU KEDE" },
    { id: "beco",         labelKey: "di_beco",         filterValue: "BECO" },
    { id: "buiha",        labelKey: "di_buiha",        filterValue: "BUIHA" },
    { id: "kakeulaku",    labelKey: "di_kakeulaku",    filterValue: "KAKEULAKU" },
    { id: "lias",         labelKey: "di_lias",         filterValue: "LIAS" },
    { id: "luan_kadoe",   labelKey: "di_luan_kadoe",   filterValue: "LUAN KADOE" },
    { id: "paulata",      labelKey: "di_paulata",      filterValue: "PAULATA" },
    { id: "raibere",      labelKey: "di_raibere",      filterValue: "RAIBERE" },
    { id: "raimea",       labelKey: "di_raimea",       filterValue: "RAIMEA" },
    { id: "taz_hilin",    labelKey: "di_taz_hilin",    filterValue: "TAZ HILIN" },
  ],
},

      {
        id: "building",
        nameKey: "l_building",
        kind: "fill",
        data: v("building"),
        clickable: true,

        paint: fillPaint(SYM.polygon.building),

        defaultOn: false,

        opacity: SYM.polygon.building.opacity,
        opacityProp: "fill-opacity",

        legend: fillLegend(SYM.polygon.building),
      },

      {
        id: "lowveg",
        nameKey: "l_lowveg",
        kind: "fill",
        data: v("lowveg"),
        clickable: true,

        paint: fillPaint(SYM.polygon.lowVegetation),

        defaultOn: false,

        opacity: SYM.polygon.lowVegetation.opacity,
        opacityProp: "fill-opacity",

        legend: fillLegend(SYM.polygon.lowVegetation),
      },

      {
        id: "highveg",
        nameKey: "l_highveg",
        kind: "fill",
        data: v("highveg"),
        clickable: true,

        paint: fillPaint(SYM.polygon.highVegetation),

        defaultOn: false,

        opacity: SYM.polygon.highVegetation.opacity,
        opacityProp: "fill-opacity",

        legend: fillLegend(SYM.polygon.highVegetation),
      },

      {
        id: "ground",
        nameKey: "l_ground",
        kind: "fill",
        data: v("ground"),
        clickable: true,

        paint: fillPaint(SYM.polygon.ground),

        defaultOn: false,

        opacity: SYM.polygon.ground.opacity,
        opacityProp: "fill-opacity",

        legend: fillLegend(SYM.polygon.ground),
      },

      {
        id: "palm",
        nameKey: "l_palm",
        kind: "fill",
        data: v("palm"),
        clickable: true,

        paint: fillPaint(SYM.polygon.palm),

        defaultOn: false,

        opacity: SYM.polygon.palm.opacity,
        opacityProp: "fill-opacity",

        legend: fillLegend(SYM.polygon.palm),
      },

      {
        id: "ricefield",
        nameKey: "l_ricefield",
        kind: "fill",
        data: v("ricefield"),
        clickable: true,

        paint: fillPaint(SYM.polygon.ricefield),

        defaultOn: false,

        opacity: SYM.polygon.ricefield.opacity,
        opacityProp: "fill-opacity",

        legend: fillLegend(SYM.polygon.ricefield),
      },

      {
        id: "sugarcane",
        nameKey: "l_sugarcane",
        kind: "fill",
        data: v("sugarcane"),
        clickable: true,

        paint: fillPaint(SYM.polygon.sugarcane),

        defaultOn: false,

        opacity: SYM.polygon.sugarcane.opacity,
        opacityProp: "fill-opacity",

        legend: fillLegend(SYM.polygon.sugarcane),
      },

      {
        id: "urban",
        nameKey: "l_urban",
        kind: "fill",
        data: v("urban"),
        clickable: true,

        paint: fillPaint(SYM.polygon.urban),

        defaultOn: false,

        opacity: SYM.polygon.urban.opacity,
        opacityProp: "fill-opacity",

        legend: fillLegend(SYM.polygon.urban),
      },

      {
        id: "waterbody",
        nameKey: "l_waterbody",
        kind: "fill",
        data: v("waterbody"),
        clickable: true,

        paint: fillPaint(SYM.polygon.water),

        defaultOn: false,

        opacity: SYM.polygon.water.opacity,
        opacityProp: "fill-opacity",

        legend: fillLegend(SYM.polygon.water),
      },
    ],
  },

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
        iconSize: 0.02,
        paint: {},
        defaultOn: false,
        legend: {
          color: SYM.point.drill,
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
        iconSize: 0.02,
        paint: {},
        defaultOn: false,
        legend: {
          color: SYM.point.design,
          svg: "desain",
        },
      },

      {
        id: "genangan_titikkoordinat",
        nameKey: "l_genangan_titikkoordinat",
        kind: "symbol",
        data: v("genangan_titikkoordinat"),
        clickable: true,
        icon: icon("coordinate"),
        iconSize: 0.02,
        paint: {},
        defaultOn: false,
        legend: {
          color: SYM.point.coordinate,
          svg: "coordinate",
        },
      },

      {
        id: "genangan_titikkupasan",
        nameKey: "l_genangan_titikkupasan",
        kind: "symbol",
        data: v("genangan_titikkupasan"),
        clickable: true,
        icon: icon("kupasan"),
        iconSize: 0.02,
        paint: {},
        defaultOn: false,
        legend: {
          color: SYM.point.kupasan,
          svg: "kupasan",
        },
      },

      {
        id: "genangan_garisdesain",
        nameKey: "l_genangan_garisdesain",
        kind: "line",
        data: v("genangan_garisdesain"),

        paint: linePaint(SYM.line.design),

        defaultOn: false,

        legend: lineLegend(SYM.line.design),
      },

      {
        id: "genangan_gariskoordinat",
        nameKey: "l_genangan_gariskoordinat",
        kind: "line",
        data: v("genangan_gariskoordinat"),

        paint: {
          "line-color": SYM.point.coordinate,
          "line-width": 1.5,
          "line-dasharray": [4, 3],
          "line-opacity": 1,
        },

        defaultOn: false,

        legend: {
          color: SYM.point.coordinate,
          line: true,
          width: 1.5,
          dasharray: [4, 3],
        },
      },

      {
        id: "genangan_gariskupasan",
        nameKey: "l_genangan_gariskupasan",
        kind: "line",
        data: v("genangan_gariskupasan"),

        paint: {
          "line-color": SYM.point.kupasan,
          "line-width": 2,
          "line-opacity": 1,
        },

        defaultOn: false,

        legend: {
          color: SYM.point.kupasan,
          line: true,
          width: 2,
        },
      },

      {
        id: "genangan_garissungai",
        nameKey: "l_genangan_garissungai",
        kind: "line",
        data: v("genangan_garissungai"),

        paint: linePaint(SYM.line.river),

        defaultOn: false,

        legend: lineLegend(SYM.line.river),
      },

      {
        id: "genangan_areadesain",
        nameKey: "l_genangan_areadesain",
        kind: "fill",
        data: v("genangan_areadesain"),
        clickable: true,

        paint: fillPaint(SYM.polygon.design),

        defaultOn: false,

        opacity: SYM.polygon.design.opacity,
        opacityProp: "fill-opacity",

        legend: fillLegend(SYM.polygon.design),
      },

      {
        id: "genangan_areagenangan",
        nameKey: "l_genangan_areagenangan",
        kind: "fill",
        data: v("genangan_areagenangan"),
        clickable: true,

        paint: fillPaint(SYM.polygon.inundation),

        defaultOn: false,

        opacity: SYM.polygon.inundation.opacity,
        opacityProp: "fill-opacity",

        legend: fillLegend(SYM.polygon.inundation),
      },

      {
        id: "genangan_areasungai",
        nameKey: "l_genangan_areasungai",
        kind: "fill",
        data: v("genangan_areasungai"),
        clickable: true,

        paint: fillPaint(SYM.polygon.river),

        defaultOn: false,

        opacity: SYM.polygon.river.opacity,
        opacityProp: "fill-opacity",

        legend: fillLegend(SYM.polygon.river),
      },
    ],
  },

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
            kind: "symbol",
            data: v("09_lo_po_asesories"),
            clickable: true,
            lazy: true,
            icon: icon("aksesories"),
            iconSize: 0.02,
            paint: {},

            defaultOn: false,

            legend: {
              color: SYM.point.accessories,
              circle: true,
            },
          },

          {
            id: "lo_po_cp",
            nameKey: "l_lo_po_cp",
            kind: "symbol",
            data: v("09_lo_po_cp"),
            clickable: true,
            lazy: true,
            icon: icon("cp"),
            iconSize: 0.02,
            paint: {},
            defaultOn: false,
            legend: {
              color: SYM.point.cp,
              circle: true,
            },
          },

          {
            id: "lo_po_design",
            nameKey: "l_lo_po_design",
            kind: "symbol",
            data: v("09_lo_po_design"),
            clickable: true,
            lazy: true,
            icon: icon("desain"),
            iconSize: 0.02,
            paint: {},
            defaultOn: false,
            legend: {
              color: SYM.point.design,
              circle: true,
            },
          },

          {
            id: "lo_po_bm",
            nameKey: "l_lo_po_bm",
            kind: "symbol",
            data: v("09_lo_po_bm"),
            clickable: true,
            lazy: true,
            icon: icon("bm"),
            iconSize: 0.02,
            paint: pointPaint(
              "#6A1B9A",
              2.5,
              "#4C136E",
            ),
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

            paint: linePaint(SYM.line.roadAccess),

            defaultOn: false,

            legend: lineLegend(SYM.line.roadAccess),
          },

          {
            id: "lo_li_crossline",
            nameKey: "l_lo_li_crossline",
            kind: "line",
            data: v("09_lo_li_crossline"),
            clickable: true,
            lazy: true,

            paint: linePaint(SYM.line.structure),

            defaultOn: false,

            legend: lineLegend(SYM.line.structure),
          },

          {
            id: "lo_li_desaindrain",
            nameKey: "l_lo_li_desaindrain",
            kind: "line",
            data: v("09_lo_li_desaindrain"),
            clickable: true,
            lazy: true,

            paint: linePaint(SYM.line.drainage),

            defaultOn: false,

            legend: lineLegend(SYM.line.drainage),
          },

          {
            id: "lo_li_jalan",
            nameKey: "l_lo_li_jalan",
            kind: "line",
            data: v("09_lo_li_jalan"),
            clickable: true,
            lazy: true,

            paint: linePaint(SYM.line.road),

            defaultOn: false,

            legend: lineLegend(SYM.line.road),
          },

          {
            id: "lo_li_jembatan",
            nameKey: "l_lo_li_jembatan",
            kind: "line",
            data: v("09_lo_li_jembatan"),
            clickable: true,
            lazy: true,

            paint: linePaint(SYM.line.bridge),

            defaultOn: false,

            legend: lineLegend(SYM.line.bridge),
          },

          {
            id: "lo_li_pembuangutama",
            nameKey: "l_lo_li_pembuangutama",
            kind: "line",
            data: v("09_lo_li_pembuangutama"),
            clickable: true,
            lazy: true,

            paint: linePaint(SYM.line.drainage),

            defaultOn: false,

            legend: lineLegend(SYM.line.drainage),
          },

          {
            id: "lo_li_patoksaluran",
            nameKey: "l_lo_li_patoksaluran",
            kind: "line",
            data: v("09_lo_li_patoksaluran"),
            clickable: true,
            lazy: true,

            paint: {
              "line-color": SYM.point.patokSaluran,
              "line-width": 2,
              "line-dasharray": [2, 3],
              "line-opacity": 1,
            },

            defaultOn: false,

            legend: {
              color: SYM.point.patokSaluran,
              line: true,
              width: 2,
              dasharray: [2, 3],
            },
          },

          {
            id: "lo_li_salexisting",
            nameKey: "l_lo_li_salexisting",
            kind: "line",
            data: v("09_lo_li_salexisting"),
            clickable: true,
            lazy: true,

            paint: linePaint(SYM.line.irrigationExisting),

            defaultOn: false,

            legend: lineLegend(SYM.line.irrigationExisting),
          },

          {
            id: "lo_li_salters",
            nameKey: "l_lo_li_salters",
            kind: "line",
            data: v("09_lo_li_salters"),
            clickable: true,
            lazy: true,

            paint: linePaint(SYM.line.irrigationTertiary),

            defaultOn: false,

            legend: lineLegend(SYM.line.irrigationTertiary),
          },

          {
            id: "lo_ar_areal",
            nameKey: "l_lo_ar_areal",
            kind: "fill",
            data: v("09_lo_ar_areal"),
            clickable: true,
            lazy: true,

            paint: fillPaint(SYM.polygon.areaGeneral),

            defaultOn: false,

            opacity: SYM.polygon.areaGeneral.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.areaGeneral),
          },

          {
            id: "lo_ar_bangsadap",
            nameKey: "l_lo_ar_bangsadap",
            kind: "fill",
            data: v("09_lo_ar_bangsadap"),
            clickable: true,
            lazy: true,

            paint: fillPaint(SYM.polygon.access),

            defaultOn: false,

            opacity: SYM.polygon.access.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.access),
          },

          {
            id: "lo_ar_bangunan",
            nameKey: "l_lo_ar_bangunan",
            kind: "fill",
            data: v("09_lo_ar_bangunan"),
            clickable: true,
            lazy: true,

            paint: fillPaint(SYM.polygon.building),

            defaultOn: false,

            opacity: SYM.polygon.building.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.building),
          },

          {
            id: "lo_ar_box",
            nameKey: "l_lo_ar_box",
            kind: "fill",
            data: v("09_lo_ar_box"),
            clickable: true,
            lazy: true,

            paint: fillPaint(SYM.polygon.water),

            defaultOn: false,

            opacity: SYM.polygon.water.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.water),
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
            kind: "symbol",
            data: v("09_rei_po_asesories"),
            defaultOn: false,
            icon: icon("aksesories"),
            iconSize: 0.02,
            paint: pointPaint(
              SYM.point.accessories,
              2.5,
              "#9B1345",
            ),

            legend: {
              color: SYM.point.accessories,
              circle: true,
            },
          },
          {
            id: "rei09_po_patoksaluran",
            nameKey: "l_rei09_po_patoksaluran",
            kind: "symbol",
            data: v("09_rei_po_patoksaluran"),
            defaultOn: false,
            icon: icon("canal"),
            iconSize: 0.02,
            paint: {},
            legend: {
              color: SYM.point.patokSaluran,
              circle: true,
            },
          },
          {
            id: "rei09_li_bangunan",
            nameKey: "l_rei09_li_bangunan",
            kind: "line",
            data: v("09_rei_li_bangunan"),
            defaultOn: false,

            paint: linePaint(SYM.line.building),

            legend: lineLegend(SYM.line.building),
          },

          {
            id: "rei09_li_cotambah",
            nameKey: "l_rei09_li_cotambah",
            kind: "line",
            data: v("09_rei_li_cotambah"),
            defaultOn: false,

            paint: linePaint(SYM.line.structure),

            legend: lineLegend(SYM.line.structure),
          },

          {
            id: "rei09_li_jalan",
            nameKey: "l_rei09_li_jalan",
            kind: "line",
            data: v("09_rei_li_jalan"),
            defaultOn: false,

            paint: linePaint(SYM.line.road),

            legend: lineLegend(SYM.line.road),
          },

          {
            id: "rei09_li_linepol",
            nameKey: "l_rei09_li_linepol",
            kind: "line",
            data: v("09_rei_li_linepol"),
            defaultOn: false,

            paint: linePaint(SYM.line.boundary),

            legend: lineLegend(SYM.line.boundary),
          },

          {
            id: "rei09_li_salexisting",
            nameKey: "l_rei09_li_salexisting",
            kind: "line",
            data: v("09_rei_li_salexisting"),
            defaultOn: false,

            paint: linePaint(SYM.line.irrigationExisting),

            legend: lineLegend(SYM.line.irrigationExisting),
          },

          {
            id: "rei09_li_saltersier",
            nameKey: "l_rei09_li_saltersier",
            kind: "line",
            data: v("09_rei_li_saltersier"),
            defaultOn: false,

            paint: linePaint(SYM.line.irrigationTertiary),

            legend: lineLegend(SYM.line.irrigationTertiary),
          },

          {
            id: "rei09_li_sungaialur",
            nameKey: "l_rei09_li_sungaialur",
            kind: "line",
            data: v("09_rei_li_sungaialur"),
            defaultOn: false,
            paint: linePaint(SYM.line.river),
            legend: lineLegend(SYM.line.river),
          },
          {
            id: "rei09_li_desain",
            nameKey: "l_rei09_li_desain",
            kind: "line",
            data: v("09_rei_li_desain"),
            defaultOn: false,
            paint: linePaint(SYM.line.design),
            legend: lineLegend(SYM.line.design),
          },

          {
            id: "rei09_ar_0",
            nameKey: "l_rei09_ar_0",
            kind: "fill",
            data: v("09_rei_ar_0"),
            defaultOn: false,

            paint: fillPaint(SYM.polygon.areaGeneral),

            opacity: SYM.polygon.areaGeneral.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.areaGeneral),
          },

          {
            id: "rei09_ar_bangsadap",
            nameKey: "l_rei09_ar_bangsadap",
            kind: "fill",
            data: v("09_rei_ar_bangsadap"),
            defaultOn: false,

            paint: fillPaint(SYM.polygon.access),

            opacity: SYM.polygon.access.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.access),
          },

          {
            id: "rei09_ar_bmcp",
            nameKey: "l_rei09_ar_bmcp",
            kind: "fill",
            data: v("09_rei_ar_bmcp"),
            defaultOn: false,

            paint: fillPaint(SYM.polygon.irrigationArea),

            opacity: SYM.polygon.irrigationArea.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.irrigationArea),
          },

          {
            id: "rei09_ar_boxkwarter",
            nameKey: "l_rei09_ar_boxkwarter",
            kind: "fill",
            data: v("09_rei_ar_boxkwarter"),
            defaultOn: false,

            paint: fillPaint(SYM.polygon.water),

            opacity: SYM.polygon.water.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.water),
          },

          {
            id: "rei09_ar_boxtersier",
            nameKey: "l_rei09_ar_boxtersier",
            kind: "fill",
            data: v("09_rei_ar_boxtersier"),
            defaultOn: false,

            paint: fillPaint(SYM.polygon.canal),

            opacity: SYM.polygon.canal.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.canal),
          },
          {
            id: "rei09_ar_legend",
            nameKey: "l_rei09_ar_legend",
            kind: "fill",
            data: v("09_rei_ar_legend"),
            defaultOn: false,

            paint: fillPaint(SYM.polygon.areaGeneral),

            opacity: SYM.polygon.areaGeneral.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.areaGeneral),
          },

          {
            id: "rei09_ar_salpemb",
            nameKey: "l_rei09_ar_salpemb",
            kind: "fill",
            data: v("09_rei_ar_salpemb"),
            defaultOn: false,

            paint: fillPaint(SYM.polygon.canal),

            opacity: SYM.polygon.canal.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.canal),
          },
        ],
      },


      /* =====================================================
         RAIBERE 2026
      ===================================================== */

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

            paint: fillPaint(SYM.polygon.access),

            opacity: SYM.polygon.access.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.access),
          },

          {
            id: "rei26_ar_crest",
            nameKey: "l_rei26_ar_crest",
            kind: "fill",
            data: v("26_rei_ar_crest"),
            defaultOn: false,

            paint: fillPaint(SYM.polygon.weirBody),

            opacity: SYM.polygon.weirBody.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.weirBody),
          },

          {
            id: "rei26_ar_downstream",
            nameKey: "l_rei26_ar_downstream",
            kind: "fill",
            data: v("26_rei_ar_downstream"),
            defaultOn: false,

            paint: fillPaint(SYM.polygon.downstream),

            opacity: SYM.polygon.downstream.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.downstream),
          },

          {
            id: "rei26_ar_flushingcanal",
            nameKey: "l_rei26_ar_flushingcanal",
            kind: "fill",
            data: v("26_rei_ar_flushingcanal"),
            defaultOn: false,

            paint: fillPaint(SYM.polygon.flushing),

            opacity: SYM.polygon.flushing.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.flushing),
          },

          {
            id: "rei26_ar_flushinggate",
            nameKey: "l_rei26_ar_flushinggate",
            kind: "fill",
            data: v("26_rei_ar_flushinggate"),
            defaultOn: false,

            paint: fillPaint(SYM.polygon.flushingGate),

            opacity: SYM.polygon.flushingGate.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.flushingGate),
          },

          {
            id: "rei26_ar_flushingpier",
            nameKey: "l_rei26_ar_flushingpier",
            kind: "fill",
            data: v("26_rei_ar_flushingpier"),
            defaultOn: false,

            paint: fillPaint(SYM.polygon.flushingPier),

            opacity: SYM.polygon.flushingPier.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.flushingPier),
          },

          {
            id: "rei26_ar_ingate",
            nameKey: "l_rei26_ar_ingate",
            kind: "fill",
            data: v("26_rei_ar_ingate"),
            defaultOn: false,

            paint: fillPaint(SYM.polygon.irrigationStructure),

            opacity: SYM.polygon.irrigationStructure.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.irrigationStructure),
          },

          {
            id: "rei26_ar_intake",
            nameKey: "l_rei26_ar_intake",
            kind: "fill",
            data: v("26_rei_ar_intake"),
            defaultOn: false,

            paint: fillPaint(SYM.polygon.intake),

            opacity: SYM.polygon.intake.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.intake),
          },

          {
            id: "rei26_ar_irrigation",
            nameKey: "l_rei26_ar_irrigation",
            kind: "fill",
            data: v("26_rei_ar_irrigation"),
            defaultOn: false,

            paint: fillPaint(SYM.polygon.irrigationArea),

            opacity: SYM.polygon.irrigationArea.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.irrigationArea),
          },

          {
            id: "rei26_ar_parking",
            nameKey: "l_rei26_ar_parking",
            kind: "fill",
            data: v("26_rei_ar_parking"),
            defaultOn: false,

            paint: fillPaint(SYM.polygon.parking),

            opacity: SYM.polygon.parking.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.parking),
          },

          {
            id: "rei26_ar_primer",
            nameKey: "l_rei26_ar_primer",
            kind: "fill",
            data: v("26_rei_ar_primer"),
            defaultOn: false,

            paint: fillPaint(SYM.polygon.primer),

            opacity: SYM.polygon.primer.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.primer),
          },

          {
            id: "rei26_ar_road",
            nameKey: "l_rei26_ar_road",
            kind: "fill",
            data: v("26_rei_ar_road"),
            defaultOn: false,

            paint: fillPaint(SYM.polygon.road),

            opacity: SYM.polygon.road.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.road),
          },

          {
            id: "rei26_ar_rock",
            nameKey: "l_rei26_ar_rock",
            kind: "fill",
            data: v("26_rei_ar_rock"),
            defaultOn: false,

            paint: fillPaint(SYM.polygon.rock),

            opacity: SYM.polygon.rock.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.rock),
          },

         {
  id: "rei26_ar_silt",
  nameKey: "l_rei26_ar_silt",
  kind: "fill",
  data: v("26_rei_ar_silt"),
  defaultOn: false,

  paint: {
    "fill-color": "#FF0000",
    "fill-opacity": 0.8,
    "fill-outline-color": "#000000",
  },

  opacity: 0.8,
  opacityProp: "fill-opacity",

  legend: {
    color: "#FF0000",
  },
},

          {
            id: "rei26_ar_stilling",
            nameKey: "l_rei26_ar_stilling",
            kind: "fill",
            data: v("26_rei_ar_stilling"),
            defaultOn: false,

            paint: fillPaint(SYM.polygon.stilling),

            opacity: SYM.polygon.stilling.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.stilling),
          },

          {
            id: "rei26_ar_upstream",
            nameKey: "l_rei26_ar_upstream",
            kind: "fill",
            data: v("26_rei_ar_upstream"),
            defaultOn: false,

            paint: fillPaint(SYM.polygon.upstream),

            opacity: SYM.polygon.upstream.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.upstream),
          },

          {
            id: "rei26_ar_weirbody",
            nameKey: "l_rei26_ar_weirbody",
            kind: "fill",
            data: v("26_rei_ar_weirbody"),
            defaultOn: false,

            paint: fillPaint(SYM.polygon.weirBody),

            opacity: SYM.polygon.weirBody.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.weirBody),
          },

          {
            id: "rei26_ar_wing",
            nameKey: "l_rei26_ar_wing",
            kind: "fill",
            data: v("26_rei_ar_wing"),
            defaultOn: false,

            paint: fillPaint(SYM.polygon.wing),

            opacity: SYM.polygon.wing.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.wing),
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
            id: "oe09_po_bm",
            nameKey: "l_oe09_po_bm",
            kind: "symbol",
            data: v("09_oe_po_bm"),
            clickable: true,
            lazy: true,
            icon: icon("bm"),
            iconSize: 0.02,
            paint: {},
            defaultOn: false,
            legend: {
              color: SYM.point.bm,
              circle: true,
            },
          },

          {
            id: "oe09_po_cp",
            nameKey: "l_oe09_po_cp",
            kind: "symbol",
            data: v("09_oe_po_cp"),
            clickable: true,
            lazy: true,
            icon: icon("cp"),
            iconSize: 0.02,
            paint:{},
            defaultOn: false,
            legend: {
              color: SYM.point.cp,
              circle: true,
            },
          },

          {
            id: "oe09_po_patoksaluran",
            nameKey: "l_oe09_po_patoksaluran",
            kind: "symbol",
            data: v("09_oe_po_patoksaluran"),
            clickable: true,
            lazy: true,
            icon: icon("canal"),
            iconSize: 0.02,
            paint: {},
            defaultOn: false,
            legend: {
              color: SYM.point.patokSaluran,
              circle: true,
            },
          },

          {
            id: "oe09_po_profile",
            nameKey: "l_oe09_po_profile",
            kind: "symbol",
            data: v("09_oe_po_profile"),
            clickable: true,
            lazy: true,
            icon: icon("profil"),
            iconSize: 0.02,
            paint: {},
            defaultOn: false,
            legend: {
              color: SYM.point.profile,
              circle: true,
            },
          },

          {
            id: "oe09_li_desainpembuang",
            nameKey: "l_oe09_li_desainpembuang",
            kind: "line",
            data: v("09_oe_li_desainpembuang"),
            clickable: true,
            lazy: true,

            paint: {
              ...linePaint(SYM.line.drainage),
              "line-dasharray": [8, 3],
            },

            defaultOn: false,

            legend: {
              color: SYM.line.drainage.color,
              line: true,
              width: SYM.line.drainage.width,
              dasharray: [8, 3],
            },
          },

          {
            id: "oe09_li_design",
            nameKey: "l_oe09_li_design",
            kind: "line",
            data: v("09_oe_li_design"),
            clickable: true,
            lazy: true,

            paint: linePaint(SYM.line.design),

            defaultOn: false,

            legend: lineLegend(SYM.line.design),
          },

          {
            id: "oe09_li_jalan",
            nameKey: "l_oe09_li_jalan",
            kind: "line",
            data: v("09_oe_li_jalan"),
            clickable: true,
            lazy: true,

            paint: linePaint(SYM.line.road),

            defaultOn: false,

            legend: lineLegend(SYM.line.road),
          },

          {
            id: "oe09_li_linepol",
            nameKey: "l_oe09_li_linepol",
            kind: "line",
            data: v("09_oe_li_linepol"),
            clickable: true,
            lazy: true,

            paint: linePaint(SYM.line.boundary),

            defaultOn: false,

            legend: lineLegend(SYM.line.boundary),
          },

          {
            id: "oe09_li_msalkwarter",
            nameKey: "l_oe09_li_msalkwarter",
            kind: "line",
            data: v("09_oe_li_msalkwarter"),
            clickable: true,
            lazy: true,

            paint: linePaint(SYM.line.flushing),

            defaultOn: false,

            legend: lineLegend(SYM.line.flushing),
          },

          {
            id: "oe09_li_msalpembuang",
            nameKey: "l_oe09_li_msalpembuang",
            kind: "line",
            data: v("09_oe_li_msalpembuang"),
            clickable: true,
            lazy: true,

            paint: linePaint(SYM.line.drainageSecondary),

            defaultOn: false,

            legend: lineLegend(SYM.line.drainageSecondary),
          },

          {
            id: "oe09_li_msaltersier",
            nameKey: "l_oe09_li_msaltersier",
            kind: "line",
            data: v("09_oe_li_msaltersier"),
            clickable: true,
            lazy: true,

            paint: linePaint(SYM.line.irrigationTertiary),

            defaultOn: false,

            legend: lineLegend(SYM.line.irrigationTertiary),
          },

          {
            id: "oe09_li_salexisting",
            nameKey: "l_oe09_li_salexisting",
            kind: "line",
            data: v("09_oe_li_salexisting"),
            clickable: true,
            lazy: true,

            paint: linePaint(SYM.line.irrigationExisting),

            defaultOn: false,

            legend: lineLegend(SYM.line.irrigationExisting),
          },

          {
            id: "oe09_li_sungaialur",
            nameKey: "l_oe09_li_sungaialur",
            kind: "line",
            data: v("09_oe_li_sungaialur"),
            clickable: true,
            lazy: true,

            paint: linePaint(SYM.line.river),

            defaultOn: false,

            legend: lineLegend(SYM.line.river),
          },


          /* ---------------- POLYGON ---------------- */

          {
            id: "oe09_ar_aliranair",
            nameKey: "l_oe09_ar_aliranair",
            kind: "fill",
            data: v("09_oe_ar_aliranair"),
            clickable: true,
            lazy: true,

            paint: fillPaint(SYM.polygon.water),

            defaultOn: false,

            opacity: SYM.polygon.water.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.water),
          },

          {
            id: "oe09_ar_arsir",
            nameKey: "l_oe09_ar_arsir",
            kind: "fill",
            data: v("09_oe_ar_arsir"),
            clickable: true,
            lazy: true,

            paint: fillPaint(SYM.polygon.silt),

            defaultOn: false,

            opacity: SYM.polygon.silt.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.silt),
          },

          {
            id: "oe09_ar_bangbagi",
            nameKey: "l_oe09_ar_bangbagi",
            kind: "fill",
            data: v("09_oe_ar_bangbagi"),
            clickable: true,
            lazy: true,

            paint: fillPaint(SYM.polygon.building),

            defaultOn: false,

            opacity: SYM.polygon.building.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.building),
          },

          {
            id: "oe09_ar_lahanpotensi",
            nameKey: "l_oe09_ar_lahanpotensi",
            kind: "fill",
            data: v("09_oe_ar_lahanpotensi"),
            clickable: true,
            lazy: true,

            paint: fillPaint(SYM.polygon.irrigationArea),

            defaultOn: false,

            opacity: SYM.polygon.irrigationArea.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.irrigationArea),
          },

          {
            id: "oe09_ar_mbangsadap",
            nameKey: "l_oe09_ar_mbangsadap",
            kind: "fill",
            data: v("09_oe_ar_mbangsadap"),
            clickable: true,
            lazy: true,

            paint: fillPaint(SYM.polygon.access),

            defaultOn: false,

            opacity: SYM.polygon.access.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.access),
          },

          {
            id: "oe09_ar_pemukiman",
            nameKey: "l_oe09_ar_pemukiman",
            kind: "fill",
            data: v("09_oe_ar_pemukiman"),
            clickable: true,
            lazy: true,

            paint: fillPaint(SYM.polygon.settlement),

            defaultOn: false,

            opacity: SYM.polygon.settlement.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.settlement),
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
            defaultOn: false,

            paint: linePaint(SYM.line.weir),

            legend: lineLegend(SYM.line.weir),
          },

          {
            id: "oe_downstream",
            nameKey: "l_oe_downstream",
            kind: "line",
            data: v("oe_downstream"),
            clickable: true,
            defaultOn: false,

            paint: linePaint(SYM.line.drainage),

            legend: lineLegend(SYM.line.drainage),
          },

          {
            id: "oe_flushingcanal",
            nameKey: "l_oe_flushingcanal",
            kind: "line",
            data: v("oe_flushingcanal"),
            clickable: true,
            defaultOn: false,

            paint: linePaint(SYM.line.flushing),

            legend: lineLegend(SYM.line.flushing),
          },

          {
            id: "oe_flushingpier",
            nameKey: "l_oe_flushingpier",
            kind: "line",
            data: v("oe_flushingpier"),
            clickable: true,
            defaultOn: false,

            paint: linePaint(SYM.line.pier),

            legend: lineLegend(SYM.line.pier),
          },

          {
            id: "oe_guidewall",
            nameKey: "l_oe_guidewall",
            kind: "line",
            data: v("oe_guidewall"),
            clickable: true,
            defaultOn: false,

            paint: linePaint(SYM.line.guideWall),

            legend: lineLegend(SYM.line.guideWall),
          },

          {
            id: "oe_ingatpier",
            nameKey: "l_oe_ingatpier",
            kind: "line",
            data: v("oe_ingatpier"),
            clickable: true,
            defaultOn: false,

            paint: linePaint(SYM.line.irrigationExisting),

            legend: lineLegend(SYM.line.irrigationExisting),
          },

          {
            id: "oe_irrigationcanal",
            nameKey: "l_oe_irrigationcanal",
            kind: "line",
            data: v("oe_irrigationcanal"),
            clickable: true,
            defaultOn: false,

            paint: linePaint(SYM.line.irrigationExisting),

            legend: lineLegend(SYM.line.irrigationExisting),
          },

          {
            id: "oe_irrigationpier",
            nameKey: "l_oe_irrigationpier",
            kind: "line",
            data: v("oe_irrigationpier"),
            clickable: true,
            defaultOn: false,

            paint: linePaint(SYM.line.irrigationTertiary),

            legend: lineLegend(SYM.line.irrigationTertiary),
          },

          {
            id: "oe_strais",
            nameKey: "l_oe_strais",
            kind: "line",
            data: v("oe_strais"),
            clickable: true,
            defaultOn: false,

            paint: linePaint(SYM.line.structure),

            legend: lineLegend(SYM.line.structure),
          },

          {
            id: "oe_upstream",
            nameKey: "l_oe_upstream",
            kind: "line",
            data: v("oe_upstream"),
            clickable: true,
            defaultOn: false,

            paint: linePaint(SYM.line.upstream),

            legend: lineLegend(SYM.line.upstream),
          },


          {
            id: "oe_intake",
            nameKey: "l_oe_intake",
            kind: "fill",
            data: v("oe_intake"),
            clickable: true,
            defaultOn: false,
          
            paint: fillPaint(SYM.polygon.intake),
          
            opacity: SYM.polygon.intake.opacity,
            opacityProp: "fill-opacity",
          
            legend: fillLegend(SYM.polygon.intake),
          },
          
            {
          id: "oe_irrigationgate",
          nameKey: "l_oe_irrigationgate",
          kind: "fill",
          data: v("oe_irrigationgate"),
          clickable: true,
          defaultOn: false,
        
          paint: fillPaint(SYM.polygon.gate),
        
          opacity: SYM.polygon.gate.opacity,
          opacityProp: "fill-opacity",
        
          legend: fillLegend(SYM.polygon.gate),
        },

          {
            id: "oe_operatinghouse",
            nameKey: "l_oe_operatinghouse",
            kind: "fill",
            data: v("oe_operatinghouse"),
            clickable: true,
            defaultOn: false,

            paint: fillPaint(SYM.polygon.building),

            opacity: SYM.polygon.building.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.building),
          },

          {
            id: "oe_silt",
            nameKey: "l_oe_silt",
            kind: "fill",
            data: v("oe_silt"),
            clickable: true,
            defaultOn: false,

            paint: fillPaint(SYM.polygon.silt),

            opacity: SYM.polygon.silt.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.silt),
          },

          {
            id: "oe_stilling",
            nameKey: "l_oe_stilling",
            kind: "fill",
            data: v("oe_stilling"),
            clickable: true,
            defaultOn: false,

            paint: fillPaint(SYM.polygon.stilling),

            opacity: SYM.polygon.stilling.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.stilling),
          },

          {
            id: "oe_weirbody",
            nameKey: "l_oe_weirbody",
            kind: "fill",
            data: v("oe_weirbody"),
            clickable: true,
            defaultOn: false,

            paint: fillPaint(SYM.polygon.weirBody),

            opacity: SYM.polygon.weirBody.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.weirBody),
          },

          {
            id: "oe_wing",
            nameKey: "l_oe_wing",
            kind: "fill",
            data: v("oe_wing"),
            clickable: true,
            defaultOn: false,

            paint: fillPaint(SYM.polygon.wing),

            opacity: SYM.polygon.wing.opacity,
            opacityProp: "fill-opacity",

            legend: fillLegend(SYM.polygon.wing),
          },
        ],
      },
    ],
  },
];

const flattenLayers = (
  layers: LayerDef[],
): LayerDef[] =>
  layers.flatMap((layer) => [
    ...(layer.data ? [layer] : []),
    ...(layer.children
      ? flattenLayers(layer.children)
      : []),
  ]);


const findLayer = (
  layers: LayerDef[],
  id: string,
): LayerDef | undefined => {
  for (const l of layers) {
    if (l.id === id) return l;

    const hit =
      l.children &&
      findLayer(l.children, id);

    if (hit) return hit;
  }

  return undefined;
};


const collectIds = (
  layers: LayerDef[],
): string[] =>
  layers.flatMap((l) => [
    l.id,
    ...(l.children
      ? collectIds(l.children)
      : []),
  ]);


/* =========================================================
   PUBLIC HELPERS
========================================================= */

/** Semua id turunan secara rekursif dari sebuah layer parent. */
export const getDescendantIds = (
  id: string,
): string[] => {
  const node = findLayer(
    GROUPS.flatMap((g) => g.layers),
    id,
  );

  return node?.children
    ? collectIds(node.children)
    : [];
};

export const isCascadeParent = (
  id: string,
): boolean =>
  findLayer(
    GROUPS.flatMap((g) => g.layers),
    id,
  )?.cascade === true;

export const ALL_LAYERS: LayerDef[] =
  GROUPS.flatMap((g) =>
    flattenLayers(g.layers)
  );

export const LEGEND_LAYERS: LayerDef[] =
  ALL_LAYERS.filter(
    (l) => l.legend
  );
