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
    g_genangan: "Layer Genangan",
    g_raibere: "RAIBERE",
    g_oebaba: "OEBABA",
    g_lomea: "LOMEA",

    // Layer RAIBERE / OEBABA / LOMEA
    l_raibere_2009: "RAIBERE 2009",
    l_raibere_2026: "RAIBERE 2026",

    l_oebaba_2009: "OEBABA 2009",
    l_oebaba_2026: "OEBABA 2026",

    l_lomea_2009: "LOMEA 2009",

    // Administration
    l_desa: "Batas Administrasi Desa",
    l_posto: "Batas Administrasi Posto",
    l_kotamadya: "Batas Administrasi Kotamadya",
    l_negara: "Batas Administrasi Negara",

    // Land Cover
    l_sugarcane: "Tebu",
    l_urban: "Permukiman",
    l_ricefield: "Sawah",
    l_ricefield_8di: "8 Daerah Irigasi",

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

    // Genangan
    l_genangan_areadesain: "Area Desain",
    l_genangan_areagenangan: "Area Genangan",
    l_genangan_areasungai: "Area Sungai",
    l_genangan_garidesain: "Garis Desain",
    l_genangan_gariskoordinat: "Garis Koordinat",
    l_genangan_gariskupasan: "Garis Kupasan",
    l_genangan_garissungai: "Garis Sungai",
    l_genangan_titikbor: "Titik Bor",
    l_genangan_titikdesain: "Titik Desain",
    l_genangan_titikkoordinat: "Titik Koordinat",
    l_genangan_titikkupasan: "Titik Kupasan",

    // OEBABA 2026
    l_oe_crest: "Mercu",
    l_oe_downstream: "Hilir",
    l_oe_flushingcanal: "Saluran Penguras",
    l_oe_flushingpier: "Pilar Pintu Penguras",
    l_oe_guidewall: "Dinding Pengarah",
    l_oe_ingatpier: "Pilar Pintu Masuk",
    l_oe_irrigationcanal: "Saluran Irigasi",
    l_oe_irrigationpier: "Pilar Irigasi",
    l_oe_strais: "Tangga",
    l_oe_upstream: "Hulu",
    l_oe_intake: "Bangunan Pengambilan",
    l_oe_irrigationgate: "Pintu Irigasi",
    l_oe_operatinghouse: "Rumah Operasi",
    l_oe_silt: "Sedimen",
    l_oe_stilling: "Kolam Olak",
    l_oe_weirbody: "Badan Bendung",
    l_oe_wing: "Sayap Bendung",
    // LOMEA
    l_lo_ar_00: "Area 00",
    l_lo_ar_areal: "Areal",
    l_lo_ar_asesories: "Asesoris",
    l_lo_ar_bangsadap: "Bangsadap",
    l_lo_ar_bangunan: "Bangunan",
    l_lo_ar_bmcp: "BMCP",
    l_lo_ar_box: "Box",
    l_lo_ar_kodebm: "Kode BM",
    l_lo_ar_salkwater: "Saluran Kwater",
    l_lo_ar_tertiary: "Tertiary",
    l_lo_li_areal: "Areal",
    l_lo_li_asesories: "Asesoris",
    l_lo_li_asjalan: "As Jalan",
    l_lo_li_bataslaut: "Batas Laut",
    l_lo_li_bmcp: "BMCP",
    l_lo_li_box: "Box",
    l_lo_li_crossline: "Crossline",
    l_lo_li_designdrain: "Design Drain",
    l_lo_li_design: "Design",
    l_lo_li_jalan: "Jalan",
    l_lo_li_jalanlain: "Jalan Lain",
    l_lo_li_jembatan: "Jembatan",
    l_lo_li_kodebm: "Kode BM",
    l_lo_li_pembuangutama: "Pembuang Utama",
    l_lo_li_profile: "Profile",
    l_lo_li_salexisting: "Sal Existing",
    l_lo_li_salkwater: "Saluran Kwater",
    l_lo_li_salnodata: "Saluran No Data",
    l_lo_li_salters: "Salters",
    l_lo_li_tertiarycrossline: "Tertiary Crossline",
    l_lo_li_textgcp: "Text GCP",
    l_lo_po_asesories: "Asesoris",
    l_lo_po_bmcp: "BMCP",
    l_lo_po_design: "Design",
    l_lo_po_kodebm: "Kode BM",
    l_lo_po_patoksaluran: "Patok Saluran",
    l_lo_po_salkwater: "Saluran Kwater",
    l_lo_po_tertiarycrosspoint: "Tertiary Cross Point",
    l_lo_po_textcrosstertiary: "Text Cross Tertiary",
    l_lo_po_textgcp: "Text GCP",

    // RAIBERE 2009
    l_rei09_ar_0: "Area 00",
    l_rei09_ar_bangsadap: "Bangsadap",
    l_rei09_ar_bmcp: "BMCP",
    l_rei09_ar_boxkwarter: "Box Kwater",
    l_rei09_ar_boxtersier: "Box Tersier",
    l_rei09_ar_desain: "Desain",
    l_rei09_ar_legend: "Legenda",
    l_rei09_ar_salpemb: "Saluran Pembawa",
    l_rei09_li_bangunan: "Bangunan",
    l_rei09_li_contourmayor: "Kontur Mayor",
    l_rei09_li_contourminor: "Kontur Minor",
    l_rei09_li_cotambah: "Cotambah",
    l_rei09_li_jalan: "Jalan",
    l_rei09_li_linepol: "Garis Pol",
    l_rei09_li_salexisting: "Saluran Existing",
    l_rei09_li_saltersier: "Saluran Tersier",
    l_rei09_li_sungaialur: "Sungai Alur",
    l_rei09_po_asesories: "Asesoris",
    l_rei09_po_crosstersier: "Cross Tersier",
    l_rei09_po_namabang: "Nama Bangunan",
    l_rei09_po_patoksaluran: "Patok Saluran",
    l_rei09_po_text: "Text",
    l_rei09_po_textcrosscanal: "Text Cross Canal",
    l_rei09_po_textcrosstersier: "Text Cross Tersier",
    l_rei09_po_textpol: "Text Pol",
    
    // RAIBERE 2026
    l_rei26_ar_access: "Akses",
    l_rei26_ar_crest: "Mercu",
    l_rei26_ar_downstream: "Hilir",
    l_rei26_ar_flushingcanal: "Saluran Penguras",
    l_rei26_ar_flushinggate: "Pintu Penguras",
    l_rei26_ar_flushingpier: "Pilar Pintu Penguras",
    l_rei26_ar_ingate: "Pintu Masuk",
    l_rei26_ar_intake: "Bangunan Pengambilan",
    l_rei26_ar_irrigation: "Irigasi",
    l_rei26_ar_parking: "Parkir",
    l_rei26_ar_primer: "Primer",
    l_rei26_ar_road: "Jalan",
    l_rei26_ar_rock: "Batuan",
    l_rei26_ar_silt: "Sedimen",
    l_rei26_ar_stilling: "Kolam Olak",
    l_rei26_ar_upstream: "Hulu",
    l_rei26_ar_weirbody: "Badan Bendung",
    l_rei26_ar_wing: "Sayap Bendung",
    
    // Basemap
    bm_map: "OpenStreetMap",
    bm_sat: "Esri World Imagery",
    bm_ortho: "Orthophoto",
    bm_dark: "Carto Dark",
    bm_light: "Carto Light",
    bm_hybrid: "Google Satelit Hybrid",
    bm_streets: "Google Streets",
    bm_opentopo: "OpenTopoMap",

    // Terrain
    terrain: "Terrain 3D",
    exagg: "Elevasi",
    sub_ortho: "Ubin citra dari Cloudflare R2",

    // Control Panel
    terrain_off: "Nonaktif",
    measurement: "Pengukuran",
    distance: "Jarak",
    elevation: "Elevasi",
    slope: "Slope",
    area: "Luas",

    measurement_click: "Klik titik",
    measurement_double_click: "Double klik",
    measurement_finish: "selesai",
    measurement_cancel: "batal",
    measurement_select: "Pilih salah satu alat pengukuran.",

    data_layer: "Data Layer",
    terrain_locked: "Elevasi DTM pengukuran terkunci pada skala asli (1×).",

    // Hasil pengukuran elevasi
    elevation_start: "Elevasi Awal",
    elevation_end: "Elevasi Akhir",
    elevation_diff: "Beda Elevasi",
    slope_percent: "Slope (%)",
    slope_degree: "Slope (°)",

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
    g_genangan: "Flooding Layers",
    g_raibere: "RAIBERE",
    g_oebaba: "OEBABA",
    g_lomea: "LOMEA",

    // Layer RAIBERE / OEBABA / LOMEA
    l_raibere_2009: "RAIBERE 2009",
    l_raibere_2026: "RAIBERE 2026",

    l_oebaba_2009: "OEBABA 2009",
    l_oebaba_2026: "OEBABA 2026",

    l_lomea_2009: "LOMEA 2009",

    // Land Cover
    l_sugarcane: "Sugar Cane",
    l_urban: "Urban Area",
    l_ricefield: "Rice Field",
    l_ricefield_8di: "8 Irrigation Areas",

    di_akadiru_kede: "AKADIRU KEDE",
    di_buiha: "BUIHA",
    di_kakeulaku: "KAKEULAKU",
    di_lias: "LIAS",
    di_luan_kadoe: "LUAN KADOE",
    di_oebaba: "OEBABA",
    di_paulata: "PAULATA",
    di_raibere: "RAIBRE",

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

    // Flooding
    l_genangan_areadesain: "Design Area",
    l_genangan_areagenangan: "Flooded Area",
    l_genangan_areasungai: "River Area",
    l_genangan_garidesain: "Design Line",
    l_genangan_gariskoordinat: "Coordinate Line",
    l_genangan_gariskupasan: "Excavation Line",
    l_genangan_garissungai: "River Line",
    l_genangan_titikbor: "Borehole Point",
    l_genangan_titikdesain: "Design Point",
    l_genangan_titikkoordinat: "Coordinate Point",
    l_genangan_titikkupasan: "Excavation Point",

    // OEBABA 2026
    l_oe_crest: "Crest",
    l_oe_downstream: "Downstream",
    l_oe_flushingcanal: "Flushing Canal",
    l_oe_flushingpier: "Flushing Pier",
    l_oe_guidewall: "Guide Wall",
    l_oe_ingatpier: "Inlet Gate Pier",
    l_oe_irrigationcanal: "Irrigation Canal",
    l_oe_irrigationpier: "Irrigation Pier",
    l_oe_strais: "Stairs",
    l_oe_upstream: "Upstream",
    l_oe_intake: "Intake",
    l_oe_irrigationgate: "Irrigation Gate",
    l_oe_operatinghouse: "Operating House",
    l_oe_silt: "Silt",
    l_oe_stilling: "Stilling Basin",
    l_oe_weirbody: "Weir Body",
    l_oe_wing: "Wing",

    // AREA
    l_lo_ar_00: "Area 00",
    l_lo_ar_areal: "Areal",
    l_lo_ar_asesories: "Accessories",
    l_lo_ar_bangsadap: "Intake Structure",
    l_lo_ar_bangunan: "Building",
    l_lo_ar_bmcp: "BMCP",
    l_lo_ar_box: "Box",
    l_lo_ar_kodebm: "BM Code",
    l_lo_ar_salkwater: "Quaternary Canal",
    l_lo_ar_tertiary: "Tertiary",
    
    // LINE
    l_lo_li_areal: "Areal",
    l_lo_li_asesories: "Accessories",
    l_lo_li_asjalan: "Road Features",
    l_lo_li_bataslaut: "Sea Boundary",
    l_lo_li_bmcp: "BMCP",
    l_lo_li_box: "Box",
    l_lo_li_crossline: "Crossline",
    l_lo_li_designdrain: "Design Drain",
    l_lo_li_design: "Design",
    l_lo_li_jalan: "Road",
    l_lo_li_jalanlain: "Other Road",
    l_lo_li_jembatan: "Bridge",
    l_lo_li_kodebm: "BM Code",
    l_lo_li_pembuangutama: "Main Drain",
    l_lo_li_profile: "Profile",
    l_lo_li_salexisting: "Existing Canal",
    l_lo_li_salkwater: "Quaternary Canal",
    l_lo_li_salnodata: "Canal No Data",
    l_lo_li_salters: "Salters",
    l_lo_li_tertiarycrossline: "Tertiary Crossline",
    l_lo_li_textgcp: "GCP Text",
    
    // POINT
    l_lo_po_asesories: "Accessories",
    l_lo_po_bmcp: "BMCP",
    l_lo_po_design: "Design",
    l_lo_po_kodebm: "BM Code",
    l_lo_po_patoksaluran: "Canal Stake",
    l_lo_po_salkwater: "Quaternary Canal",
    l_lo_po_tertiarycrosspoint: "Tertiary Cross Point",
    l_lo_po_textcrosstertiary: "Tertiary Cross Text",
    l_lo_po_textgcp: "GCP Text",

    // RAIBERE 2009
    l_rei09_ar_0: "Area 00",
    l_rei09_ar_bangsadap: "Intake Structure",
    l_rei09_ar_bmcp: "BMCP",
    l_rei09_ar_boxkwarter: "Quaternary Box",
    l_rei09_ar_boxtersier: "Tertiary Box",
    l_rei09_ar_desain: "Design",
    l_rei09_ar_legend: "Legend",
    l_rei09_ar_salpemb: "Conveyance Canal",
    l_rei09_li_bangunan: "Building",
    l_rei09_li_contourmayor: "Major Contour",
    l_rei09_li_contourminor: "Minor Contour",
    l_rei09_li_cotambah: "Cotambah",
    l_rei09_li_jalan: "Road",
    l_rei09_li_linepol: "Polygon Line",
    l_rei09_li_salexisting: "Existing Canal",
    l_rei09_li_saltersier: "Tertiary Canal",
    l_rei09_li_sungaialur: "River Channel",
    l_rei09_po_asesories: "Accessories",
    l_rei09_po_crosstersier: "Tertiary Cross",
    l_rei09_po_namabang: "Building Name",
    l_rei09_po_patoksaluran: "Canal Stake",
    l_rei09_po_text: "Text",
    l_rei09_po_textcrosscanal: "Cross Canal Text",
    l_rei09_po_textcrosstersier: "Tertiary Cross Text",
    l_rei09_po_textpol: "Polygon Text",
    
    // RAIBERE 2026
    l_rei26_ar_access: "Access",
    l_rei26_ar_crest: "Crest",
    l_rei26_ar_downstream: "Downstream",
    l_rei26_ar_flushingcanal: "Flushing Canal",
    l_rei26_ar_flushinggate: "Flushing Gate",
    l_rei26_ar_flushingpier: "Flushing Pier",
    l_rei26_ar_ingate: "Inlet Gate",
    l_rei26_ar_intake: "Intake",
    l_rei26_ar_irrigation: "Irrigation",
    l_rei26_ar_parking: "Parking",
    l_rei26_ar_primer: "Primary",
    l_rei26_ar_road: "Road",
    l_rei26_ar_rock: "Rock",
    l_rei26_ar_silt: "Silt",
    l_rei26_ar_stilling: "Stilling Basin",
    l_rei26_ar_upstream: "Upstream",
    l_rei26_ar_weirbody: "Weir Body",
    l_rei26_ar_wing: "Wing",
    
    // Basemap
    bm_map: "OpenStreetMap",
    bm_sat: "Esri World Imagery",
    bm_ortho: "Orthophoto",
    bm_dark: "Carto Dark",
    bm_light: "Carto Light",
    bm_hybrid: "Google Satelit Hybrid",
    bm_streets: "Google Streets",
    bm_opentopo: "OpenTopoMap",

    // Terrain
    terrain: "3D Terrain",
    exagg: "Elevation",
    sub_ortho: "Image tiles from Cloudflare R2",

    // Control Panel
    terrain_off: "Off",
    measurement: "Measurement",
    distance: "Horizontal Distance",
    elevation: "Elevation",
    slope: "Slope",
    area: "Area",

    measurement_click: "Click points",
    measurement_double_click: "Double click",
    measurement_finish: "to finish",
    measurement_cancel: "to cancel",
    measurement_select: "Select a measurement tool.",

    elevation_start: "Point 1 Elevation",
elevation_end: "Point 2 Elevation",
elevation_diff: "Elevation Difference",
slope_percent: "Slope (%)",
slope_degree: "Angle (°)",

    data_layer: "Data Layer",
    terrain_locked: "The measurement DTM elevation is locked at the original scale (1×).",

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
    g_genangan: "Camadas de Inundação",
    g_raibere: "RAIBERE",
    g_oebaba: "OEBABA",
    g_lomea: "LOMEA",

    // Layer RAIBERE / OEBABA / LOMEA
    l_raibere_2009: "RAIBERE 2009",
    l_raibere_2026: "RAIBERE 2026",

    l_oebaba_2009: "OEBABA 2009",
    l_oebaba_2026: "OEBABA 2026",

    l_lomea_2009: "LOMEA 2009",

    // Land Cover
    l_sugarcane: "Cana-de-açúcar",
    l_urban: "Área Urbana",
    l_ricefield: "Arrozal",
    l_ricefield_8di: "8 Áreas de Irrigação",

    di_akadiru_kede: "AKADIRU KEDE",
    di_buiha: "BUIHA",
    di_kakeulaku: "KAKEULAKU",
    di_lias: "LIAS",
    di_luan_kadoe: "LUAN KADOE",
    di_oebaba: "OEBABA",
    di_paulata: "PAULATA",
    di_raibere: "RAIBRE",

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

    // Administration
    l_desa: "Limite da Suco",
    l_posto: "Limite do Posto Administrativo",
    l_kotamadya: "Limite Municipal",
    l_negara: "Fronteira Internacional",

    // Contour
    l_contour: "Contorno com Intervalo de 5 Metros",

    // AOI
    l_aoi_photo: "AOI de Fotografia Aérea",
    l_aoi_lidar: "AOI LiDAR",

    // Inundação
    l_genangan_areadesain: "Área de Projeto",
    l_genangan_areagenangan: "Área Inundada",
    l_genangan_areasungai: "Área do Rio",
    l_genangan_garidesain: "Linha de Projeto",
    l_genangan_gariskoordinat: "Linha de Coordenadas",
    l_genangan_gariskupasan: "Linha de Escavação",
    l_genangan_garissungai: "Linha do Rio",
    l_genangan_titikbor: "Ponto de Sondagem",
    l_genangan_titikdesain: "Ponto de Projeto",
    l_genangan_titikkoordinat: "Ponto de Coordenadas",
    l_genangan_titikkupasan: "Ponto de Escavação",

    // OEBABA 2026
    l_oe_crest: "Crista",
    l_oe_downstream: "Jusante",
    l_oe_flushingcanal: "Canal de Descarga de Sedimentos",
    l_oe_flushingpier: "Pilar da Comporta de Descarga",
    l_oe_guidewall: "Parede de Orientação",
    l_oe_ingatpier: "Pilar da Comporta de Entrada",
    l_oe_irrigationcanal: "Canal de Irrigação",
    l_oe_irrigationpier: "Pilar de Irrigação",
    l_oe_strais: "Escadas",
    l_oe_upstream: "Montante",
    l_oe_intake: "Tomada de Água",
    l_oe_irrigationgate: "Comporta de Irrigação",
    l_oe_operatinghouse: "Casa de Operação",
    l_oe_silt: "Sedimentos",
    l_oe_stilling: "Bacia de Dissipação",
    l_oe_weirbody: "Corpo da Barragem",
    l_oe_wing: "Ala da Barragem",
    // ÁREA
    l_lo_ar_00: "Área 00",
    l_lo_ar_areal: "Área",
    l_lo_ar_asesories: "Acessórios",
    l_lo_ar_bangsadap: "Estrutura de Tomada",
    l_lo_ar_bangunan: "Edifício",
    l_lo_ar_bmcp: "BMCP",
    l_lo_ar_box: "Caixa",
    l_lo_ar_kodebm: "Código BM",
    l_lo_ar_salkwater: "Canal Quaternário",
    l_lo_ar_tertiary: "Canal Terciário",
    
    // LINHA
    l_lo_li_areal: "Área",
    l_lo_li_asesories: "Acessórios",
    l_lo_li_asjalan: "Elementos Rodoviários",
    l_lo_li_bataslaut: "Limite Marítimo",
    l_lo_li_bmcp: "BMCP",
    l_lo_li_box: "Caixa",
    l_lo_li_crossline: "Linha Transversal",
    l_lo_li_designdrain: "Drenagem de Projeto",
    l_lo_li_design: "Projeto",
    l_lo_li_jalan: "Estrada",
    l_lo_li_jalanlain: "Outra Estrada",
    l_lo_li_jembatan: "Ponte",
    l_lo_li_kodebm: "Código BM",
    l_lo_li_pembuangutama: "Drenagem Principal",
    l_lo_li_profile: "Perfil",
    l_lo_li_salexisting: "Canal Existente",
    l_lo_li_salkwater: "Canal Quaternário",
    l_lo_li_salnodata: "Canal Sem Dados",
    l_lo_li_salters: "Salters",
    l_lo_li_tertiarycrossline: "Linha Transversal Terciária",
    l_lo_li_textgcp: "Texto GCP",
    
    // PONTO
    l_lo_po_asesories: "Acessórios",
    l_lo_po_bmcp: "BMCP",
    l_lo_po_design: "Projeto",
    l_lo_po_kodebm: "Código BM",
    l_lo_po_patoksaluran: "Estaca do Canal",
    l_lo_po_salkwater: "Canal Quaternário",
    l_lo_po_tertiarycrosspoint: "Ponto Transversal Terciário",
    l_lo_po_textcrosstertiary: "Texto Transversal Terciário",
    l_lo_po_textgcp: "Texto GCP",

    // RAIBERE 2009
    l_rei09_ar_0: "Área 00",
    l_rei09_ar_bangsadap: "Estrutura de Tomada",
    l_rei09_ar_bmcp: "BMCP",
    l_rei09_ar_boxkwarter: "Caixa Quaternária",
    l_rei09_ar_boxtersier: "Caixa Terciária",
    l_rei09_ar_desain: "Projeto",
    l_rei09_ar_legend: "Legenda",
    l_rei09_ar_salpemb: "Canal de Condução",
    l_rei09_li_bangunan: "Edifício",
    l_rei09_li_contourmayor: "Curva de Nível Principal",
    l_rei09_li_contourminor: "Curva de Nível Secundária",
    l_rei09_li_cotambah: "Cotambah",
    l_rei09_li_jalan: "Estrada",
    l_rei09_li_linepol: "Linha Poligonal",
    l_rei09_li_salexisting: "Canal Existente",
    l_rei09_li_saltersier: "Canal Terciário",
    l_rei09_li_sungaialur: "Canal do Rio",
    l_rei09_po_asesories: "Acessórios",
    l_rei09_po_crosstersier: "Transversal Terciária",
    l_rei09_po_namabang: "Nome do Edifício",
    l_rei09_po_patoksaluran: "Estaca do Canal",
    l_rei09_po_text: "Texto",
    l_rei09_po_textcrosscanal: "Texto Transversal do Canal",
    l_rei09_po_textcrosstersier: "Texto Transversal Terciário",
    l_rei09_po_textpol: "Texto Poligonal",
    
    // RAIBERE 2026
    l_rei26_ar_access: "Acesso",
    l_rei26_ar_crest: "Crista",
    l_rei26_ar_downstream: "Jusante",
    l_rei26_ar_flushingcanal: "Canal de Descarga",
    l_rei26_ar_flushinggate: "Comporta de Descarga",
    l_rei26_ar_flushingpier: "Pilar da Comporta de Descarga",
    l_rei26_ar_ingate: "Comporta de Entrada",
    l_rei26_ar_intake: "Tomada de Água",
    l_rei26_ar_irrigation: "Irrigação",
    l_rei26_ar_parking: "Estacionamento",
    l_rei26_ar_primer: "Primário",
    l_rei26_ar_road: "Estrada",
    l_rei26_ar_rock: "Rocha",
    l_rei26_ar_silt: "Sedimentos",
    l_rei26_ar_stilling: "Bacia de Dissipação",
    l_rei26_ar_upstream: "Montante",
    l_rei26_ar_weirbody: "Corpo da Barragem",
    l_rei26_ar_wing: "Ala da Barragem",
    
    // Basemap
    bm_map: "OpenStreetMap",
    bm_sat: "Esri World Imagery",
    bm_ortho: "Orthophoto",
    bm_dark: "Carto Dark",
    bm_light: "Carto Light",
    bm_hybrid: "Google Satelit Hybrid",
    bm_streets: "Google Streets",
    bm_opentopo: "OpenTopoMap",

    // Terrain
    terrain: "Terreno 3D",
    exagg: "Elevação",
    sub_ortho: "Ladrilhos de imagem do Cloudflare R2",

    // Control Panel
    terrain_off: "Desativado",
    measurement: "Medição",
    distance: "Distância Horizontal",
    elevation: "Elevação",
    slope: "Declive",
    area: "Área",

    measurement_click: "Clique nos pontos",
    measurement_double_click: "Duplo clique",
    measurement_finish: "para concluir",
    measurement_cancel: "para cancelar",
    measurement_select: "Selecione uma ferramenta de medição.",

    elevation_start: "Elevação do Ponto 1",
elevation_end: "Elevação do Ponto 2",
elevation_diff: "Diferença de Elevação",
slope_percent: "Declive (%)",
slope_degree: "Ângulo (°)",

    data_layer: "Camadas de Dados",
    terrain_locked: "A elevação do DTM de medição está bloqueada na escala original (1×).",

    // Map information
    zoom: "Zoom",
    pitch: "Inclinação",
    bearing: "Direção",
    loading_layer_title: "A carregar camadas",
    loading_layer_text: "estão a carregar...",
  },
};

const Ctx = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: string) => string;
}>({
  lang: "id",
  setLang: () => {},
  t: (k) => k,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("id");
  const t = (k: string) => DICTS[lang][k] ?? k;

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
