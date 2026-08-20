"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { I18nProvider } from "@/lib/i18n";
import ControlPanel from "@/components/ControlPanel";
import { TopBar, Legend, StatusBar, Loader } from "@/components/Chrome";

// MapLibre touches `window`, so load the map only on the client.
const MapCanvas = dynamic(() => import("@/components/MapCanvas"), { ssr: false });

export default function Page() {
  const [ready, setReady] = useState(false);
  return (
    <I18nProvider>
      <main className="relative h-screen w-screen">
        <MapCanvas onReady={() => setReady(true)} />
        <TopBar />
        <ControlPanel />
        <Legend />
        <StatusBar />
        <Loader hidden={ready} />
      </main>
    </I18nProvider>
  );
}
