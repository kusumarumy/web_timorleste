"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "id" | "en" | "pt";

type Dict = Record<string, string>;

export const DICTS: Record<Lang, Dict> = {
  id: {
    title: "Ainaro-Belulik GeoLandscape",
    sub: "Informasi Spasial Lanskap Ainaro-Belulik",

    eyebrow: "Panel Layer",
    panelsub: "Nyalakan atau matikan layer sesuai kebutuhan analisis.",
    legend: "Legenda",
    crs: "EPSG:32751 (WGS 84 / UTM 51S)",

    load: "Memuat GeoLandscape",
    load2: "Menyiapkan terrain & layer spasial",

    // Group
    g_aoi: "Area of Interest",
    g_admin: "Batas Administrasi",
    g_net: "Jaringan",
    g_contour: "Kontur",
    g_hydro: "Hidrologi",
    g_land: "Tutupan Lahan",

    // Administration
    l_desa: "Batas Administrasi Desa",
    l_posto: "Batas Administrasi Posto",
    l_kotamadya: "Batas Administrasi Kotamadya",
    l_negara: "Batas Administrasi Negara",
    // Land Cover 
    l_sugarcane: "Tebu",
    l_urban: "Permukiman",
    l_ricefield: "Sawah",
    l_ricefield_8di: "8 Sawah Irigasi",
    di_akadiru_kede: "AKADIRU KEDE",
di_buiha: "BUIHA",
di_kakeulaku: "KAKEULAKU",
di_lias: "LIAS",
di_luan_kadoe: "LUAN KADOE",
di_oebaba: "OEBABA",
di_paulata: "PAULATA",
di_raibere: "RAIBRE",
    l_waterbody: "Badan Air",
    l_ground: "Lahan Terbuka",
    l_palm: "Kelapa Sawit",
    l_highveg: "Vegetasi Tinggi",
    l_lowveg: "Vegetasi Rendah",
    l_building: "Bangunan",
    l_forestprotected: "Hutan Lindung",
    // Hydrology
    l_river: "Sungai",
    l_weir: "Bendungan",
    l_rainfall: "Stasiun Pencatatan Curah Hujan",
    l_irrigation_point: "Titik Irigasi",
    l_irrigation: "Irigasi",
    l_catchment: "Daerah Tangkapan Air",
    l_watershed: "Daerah Aliran Sungai",
    // Transportation
    l_road: "Jalan",
    // Contour
    l_contour: "Kontur Interval 5 Meter",
    // AOI 
    l_aoi_photo: "AOI Foto Udara",
    l_aoi_lidar: "AOI LiDAR",

    // Basemap
    "bm_map": "OpenStreetMap",
    "bm_sat": "Esri World Imagery",
    "bm_ortho": "Orthophoto",
    "bm_dark": "Carto Dark",
    "bm_light": "Carto Light",
    "bm_hybrid": "Google Satelit Hybrid",
    "bm_streets": "Google Streets",
    "bm_opentopo": "OpenTopoMap",

    // Terrain
    terrain: "Terrain 3D",
    exagg: "Elevasi",
    sub_ortho: "Ubin citra dari Cloudflare R2",

    // Map information
    zoom: "Zoom",
    pitch: "Kemiringan",
    bearing: "Arah",
    loading_layer_title: "Memuat Layer",
loading_layer_text: "sedang dimuat...",
  },

  en: {
    title: "Ainaro-Belulik GeoLandscape",
    sub: "Ainaro-Belulik Landscape Spatial Information",

    eyebrow: "Layer Panel",
    panelsub: "Toggle layers on or off to fit your analysis.",
    legend: "Legend",
    crs: "EPSG:32751 (WGS 84 / UTM 51S)",

    load: "Loading GeoLandscape",
    load2: "Preparing terrain & spatial layers",

    // Group
    g_aoi: "Area of Interest",
    g_admin: "Administration",
    g_net: "Networks",
    g_contour: "Contours",
    g_hydro: "Hydrology",
    g_land: "Land Cover",

    // Land Cover 
    l_sugarcane: "Sugar Cane",
    l_urban: "Urban Area",
    l_ricefield: "Rice Field",
    l_ricefield_8di: "8 Irrigation Rice Fields",
    l_waterbody: "Water Body",
    l_ground: "Ground",
    l_palm: "Palm Tree",
    l_highveg: "High Vegetation",
    l_lowveg: "Low Vegetation",
    l_building: "Building",
    l_forestprotected: "Protected Forest Boundary",
    // Hydrology
    l_river: "River",
    l_weir: "Weir",
    l_rainfall: "Rainfall Record Station",
    l_irrigation_point: "Irrigation Point",
    l_irrigation: "Irrigation",
    l_catchment: "Catchment Area",
    l_watershed: "Watershed",
    // Network
    l_road: "Road",
    // Administration
    l_desa: "Village Boundary",
    l_posto: "Administrative Post Boundary",
    l_kotamadya: "Municipal Boundary",
    l_negara: "International Boundary",
    // Contour
    l_contour: "Interval Contour 5 Meter",
    // AOI 
    l_aoi_photo: "Aerial Photography AOI",
    l_aoi_lidar: "LiDAR AOI",

    // Basemap
    "bm_map": "OpenStreetMap",
    "bm_sat": "Esri World Imagery",
    "bm_ortho": "Orthophoto",
    "bm_dark": "Carto Dark",
    "bm_light": "Carto Light",
    "bm_hybrid": "Google Satelit Hybrid",
    "bm_streets": "Google Streets",
    "bm_opentopo": "OpenTopoMap",

    // Terrain
    terrain: "3D Terrain",
    exagg: "Elevation",
    sub_ortho: "Image tiles from Cloudflare R2",

    // Map information
    zoom: "Zoom",
    pitch: "Pitch",
    bearing: "Bearing",
    loading_layer_title: "Loading Layers",
loading_layer_text: "are loading...",
  },

  pt: {
    title: "Ainaro-Belulik GeoLandscape",
    sub: "Informação Espacial da Paisagem de Ainaro-Belulik",

    eyebrow: "Painel de Camadas",
    panelsub: "Ative ou desative camadas conforme a sua análise.",
    legend: "Legenda",
    crs: "EPSG:32751 (WGS 84 / UTM 51S)",

    load: "A carregar o GeoLandscape",
    load2: "A preparar o terreno e as camadas espaciais",

    // Group
    g_aoi: "Área de Interesse",
    g_admin: "Administração",
    g_net: "Redes",
    g_contour: "Curvas de Nível",
    g_hydro: "Hidrologia",
    g_land: "Cobertura do Solo",

    // Land Cover 
    l_sugarcane: "Cana-de-açúcar",
    l_urban: "Área Urbana",
    l_ricefield: "Arrozal",
    l_ricefield_8di: "8 Arrozais de Irrigação",
    l_waterbody: "Corpo de Água",
    l_ground: "Solo Exposto",
    l_palm: "Palmeiras",
    l_highveg: "Vegetação Alta",
    l_lowveg: "Vegetação Baixa",
    l_building: "Edifício",
    l_forestprotected: "Limite da Floresta Protegida",
    // Hydrology
    l_river: "Rio",
    l_weir: "Poço",
    l_rainfall: "Estação de Registo de Precipitação",
    l_irrigation_point: "Ponto de Irrigação",
    l_irrigation: "Irrigação",
    l_catchment: "Bacia de Drenagem",
    l_watershed: "Bacia Hidrográfica",
    // Network 
    l_road: "Estrada",
    // Administração
    l_desa: "Limite da Suco",
    l_posto: "Limite do Posto Administrativo",
    l_kotamadya: "Limite Municipal",
    l_negara: "Fronteira Internacional",
    // Contour
    l_contour: "Contorno com Intervalo de 5 Metros",
    // AOI 
    l_aoi_photo: "AOI de Fotografia Aérea",
    l_aoi_lidar: "AOI LiDAR",

    // Basemap
    "bm_map": "OpenStreetMap",
    "bm_sat": "Esri World Imagery",
    "bm_ortho": "Orthophoto",
    "bm_dark": "Carto Dark",
    "bm_light": "Carto Light",
    "bm_hybrid": "Google Satelit Hybrid",
    "bm_streets": "Google Streets",
    "bm_opentopo": "OpenTopoMap",

    // Terrain
    terrain: "Terreno 3D",
    exagg: "Elevação",
    sub_ortho: "Ladrilhos de imagem do Cloudflare R2",

    // Map information
    zoom: "Zoom",
    pitch: "Inclinação",
    bearing: "Direção",
    loading_layer_title: "A carregar camadas",
loading_layer_text: "estão a carregar...",
  },
};

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string }>({
  lang: "id", setLang: () => { }, t: (k) => k,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("id");
  const t = (k: string) => DICTS[lang][k] ?? k;
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
