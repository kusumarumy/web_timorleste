// ============================================================================
// MapTools.example.jsx — contoh integrasi di Next.js 14 / MapLibre
// Sesuaikan `INTERACTIVE_LAYERS` dgn id layer asli di style-mu, lalu
// import file ini di komponen peta. Ini contoh, bukan komponen final.
// ============================================================================
'use client';

import { useEffect, useRef, useState } from 'react';
import { IdentifyControl } from './identify';
import { MeasureControl, fmtLen, fmtArea } from './measure';
import './geo-tools.css';

// GANTI dgn id layer interaktif kamu (lihat di map.getStyle().layers)
const INTERACTIVE_LAYERS = [
  'aoi-foto-udara', 'aoi-lidar',
  'batas-desa', 'batas-posto', 'batas-kotamadya', 'batas-negara',
  'kontur-mayor', 'kontur-minor',
];

// Faktor grid->ground di lokasi Ainaro (k^-1 ~ 0.99959). Pakai 1 utk nilai grid UTM.
const GROUND_K = 1;

export default function MapTools({ map }) {
  const identifyRef = useRef(null);
  const measureRef = useRef(null);
  const [tool, setTool] = useState(null); // 'identify' | 'distance' | 'area' | null
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!map) return;
    identifyRef.current = new IdentifyControl(map, {
      layerIds: INTERACTIVE_LAYERS,
      labelFn: (k) => k.replace(/_/g, ' '),
    });
    measureRef.current = new MeasureControl(map, {
      scaleFactor: GROUND_K,
      onResult: setResult,
    });
    return () => {
      identifyRef.current?.disable();
      measureRef.current?.stop();
      measureRef.current?.clear();
    };
  }, [map]);

  const activate = (next) => {
    identifyRef.current?.disable();
    measureRef.current?.stop();
    measureRef.current?.clear();
    setResult(null);

    if (next === tool) { setTool(null); return; } // klik lagi = matikan
    setTool(next);
    if (next === 'identify') identifyRef.current?.enable();
    if (next === 'distance') measureRef.current?.start('distance');
    if (next === 'area') measureRef.current?.start('area');
  };

  return (
    <div className="geo-toolbar" style={{ display: 'flex', gap: 8 }}>
      <button data-active={tool === 'identify'} onClick={() => activate('identify')}>Identify</button>
      <button data-active={tool === 'distance'} onClick={() => activate('distance')}>Ukur Jarak</button>
      <button data-active={tool === 'area'} onClick={() => activate('area')}>Ukur Luas</button>

      {result && (
        <div className="geo-measure" style={{ position: 'absolute', top: 60, right: 16 }}>
          {result.mode === 'distance' && (
            <>
              <div className="geo-measure__row"><span className="lbl">Panjang total</span><span className="val">{fmtLen(result.total)}</span></div>
              {result.segments?.length > 1 && (
                <div className="geo-measure__row"><span className="lbl">Segmen terakhir</span><span className="val">{fmtLen(result.segments.at(-1))}</span></div>
              )}
            </>
          )}
          {result.mode === 'area' && result.area != null && (
            <>
              <div className="geo-measure__row"><span className="lbl">Luas</span><span className="val">{fmtArea(result.area)}</span></div>
              <div className="geo-measure__row"><span className="lbl">Keliling</span><span className="val">{fmtLen(result.perimeter)}</span></div>
              <div className="geo-measure__row"><span className="lbl">Panjang</span><span className="val">{fmtLen(result.length)}</span></div>
              <div className="geo-measure__row"><span className="lbl">Lebar</span><span className="val">{fmtLen(result.width)}</span></div>
            </>
          )}
          <div className="geo-measure__hint">Klik utk menambah titik · dobel-klik / Enter utk selesai · Esc utk batal</div>
          <div className="geo-measure__crs">EPSG:32751 · {result.k === 1 ? 'nilai grid UTM' : `ground (k=${result.k})`}</div>
        </div>
      )}
    </div>
  );
}
