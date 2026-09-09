"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { I18nProvider } from "@/lib/i18n";
import ControlPanel from "@/components/ControlPanel";
import { TopBar, Legend, StatusBar, Loader } from "@/components/Chrome";
import { MapTour } from "@/components/MapTour";

const MapCanvas = dynamic(() => import("@/components/MapCanvas"), {
  ssr: false,
});

export default function Page() {
  const [mapReady, setMapReady] = useState(false);
  const [loaderFinished, setLoaderFinished] = useState(false);

  return (
    <I18nProvider>
      <main className="relative h-screen w-screen">
        
        <MapCanvas
          onReady={() => setMapReady(true)}
        />

        <TopBar />
        <ControlPanel />
        <Legend />
        <StatusBar />

        <Loader
          hidden={mapReady}
          onFinished={() => setLoaderFinished(true)}
        />

        <MapTour
          ready={mapReady && loaderFinished}
        />

      </main>
    </I18nProvider>
  );
}
