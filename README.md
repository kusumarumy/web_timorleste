# GeoPortal Spasial — WebGIS (MapLibre + Next.js + Cloudflare R2)

Dashboard WebGIS *serverless* untuk visualisasi **orthophoto 3D + DEM** dan layer vektor
(sungai, jalan, hutan, sawah, kontur). Engine peta **MapLibre GL JS**, UI **Next.js + React +
TailwindCSS**, data disajikan sebagai **tiles/GeoJSON statis dari Cloudflare R2**. Tiga bahasa
(ID / EN / PT) untuk konteks lintas negara.

Aplikasi langsung jalan dengan **data demo** (folder `public/demo`) + terrain publik, sehingga
Anda bisa melihat hasilnya sebelum menyiapkan data asli.

## 1. Menjalankan lokal

```bash
npm install
cp .env.example .env.local     # lalu isi NEXT_PUBLIC_R2_BASE_URL (opsional saat awal)
npm run dev                    # http://localhost:3000
```

Tanpa `NEXT_PUBLIC_R2_BASE_URL`, app memakai data demo + terrain publik (AWS terrarium).
Setelah diisi, app otomatis beralih ke data R2 Anda.

## 2. Struktur data di R2

Buat bucket R2 publik (atau pasang custom domain / CDN di depannya), lalu susun:

```
$R2/ortho/{z}/{x}/{y}.png          orthophoto (piramida raster, dari gdal2tiles)
$R2/dem/{z}/{x}/{y}.png            DEM Terrain-RGB (dari rio-rgbify, encoding "mapbox")
$R2/vector/aoi.geojson
$R2/vector/forest.geojson
$R2/vector/paddy.geojson
$R2/vector/river.geojson
$R2/vector/road.geojson
$R2/vector/contour_mayor.geojson
$R2/vector/contour_minor.geojson
```

`$R2` = nilai `NEXT_PUBLIC_R2_BASE_URL` (mis. `https://pub-xxxx.r2.dev/webgis`).

### Menyiapkan tiles dari data sumber (GDAL)

```bash
# Orthophoto 148 GB TIF -> piramida XYZ (JPEG/PNG)
gdalwarp -t_srs EPSG:3857 ortho.tif ortho_3857.tif
gdal2tiles.py --xyz -z 12-22 -w none ortho_3857.tif tiles_ortho/

# DEM GeoTIFF -> Terrain-RGB (encoding "mapbox")
rio rgbify -b -10000 -i 0.1 dem.tif dem_rgb.tif
gdal2tiles.py --xyz -z 8-15 -w none dem_rgb.tif tiles_dem/

# Kontur 50 cm dari DEM
gdal_contour -a elev -i 0.5 dem.tif contour.gpkg
# klasifikasi mayor/minor lalu ekspor ke GeoJSON (mis. via ogr2ogr / QGIS)
```

Unggah folder `tiles_ortho/`, `tiles_dem/`, dan file GeoJSON ke R2 (mis. `rclone`).

> **CORS:** aktifkan CORS di bucket R2 agar tiles bisa dibaca browser dari domain Vercel Anda.

## 3. Deploy ke Vercel

1. Push repo ini ke GitHub.
2. Di Vercel: **New Project → Import** repo.
3. Tambahkan Environment Variable `NEXT_PUBLIC_R2_BASE_URL`.
4. Deploy. Setiap `git push` akan otomatis build & live.

## 4. Menyesuaikan

- **Titik awal / AOI:** `src/lib/config.ts` → `MAP`.
- **Basemap:** `BASEMAPS` di file yang sama.
- **Menambah / mengubah layer:** cukup tambah objek di `GROUPS` — UI (checkbox, opacity,
  legenda) terbentuk otomatis dari konfigurasi. Tidak perlu menyentuh komponen.
- **Bahasa / teks:** `src/lib/i18n.tsx`.
- **Warna tema:** `tailwind.config.ts`.

## Stack

MapLibre GL JS · Next.js 14 (App Router) · React 18 · TypeScript · TailwindCSS · Zustand ·
Cloudflare R2 (object storage) · Vercel (hosting).

## Struktur folder

```
src/
  app/            layout, page (client entry), globals.css
  components/     MapCanvas (peta), ControlPanel (panel layer), Chrome (topbar/legend/status)
  lib/            config (peta+layer), i18n, store (zustand)
public/demo/      GeoJSON contoh agar app jalan tanpa R2
```
