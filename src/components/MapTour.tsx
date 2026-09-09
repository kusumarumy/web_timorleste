"use client";

import { useEffect, useState } from "react";

type TourStep = {
  target: string;
  title: string;
  description: string;
};

const TOUR_STEPS: TourStep[] = [
  {
    target: "tour-menu",
    title: "Explore Data",
    description:
      "Buka kontrol utama untuk menjelajahi layer, data spasial, dan fitur GeoLandscape.",
  },
  {
    target: "tour-language",
    title: "Language",
    description:
      "Pilih bahasa antarmuka GeoLandscape: Indonesia, English, atau Português.",
  },
  {
    target: "tour-navigation",
    title: "Map Navigation",
    description:
      "Gunakan kontrol ini untuk zoom, tilt, dan mengeksplorasi landscape 3D.",
  },
  {
    target: "tour-information",
    title: "Identify",
    description:
      "Gunakan Identify untuk memilih objek pada peta dan melihat informasi serta atribut spasialnya.",
  },
  {
    target: "tour-basemap-button",
    title: "Basemap",
    description:
      "Pilih basemap yang paling sesuai untuk mengeksplorasi wilayah Ainaro–Belulik.",
  },
  {
    target: "tour-legend",
    title: "Legend",
    description:
      "Gunakan legenda untuk memahami simbol, warna, dan klasifikasi layer yang sedang aktif.",
  },
  {
    target: "tour-datum",
    title: "Datum",
    description:
      "Lihat datum dan sistem referensi koordinat yang digunakan pada peta.",
  },
  {
    target: "tour-coordinate",
    title: "Coordinate",
    description:
      "Pantau posisi koordinat longitude dan latitude secara langsung.",
  },
  {
    target: "tour-scale",
    title: "Scale Bar",
    description:
      "Gunakan scale bar untuk mengetahui perkiraan jarak pada tampilan peta.",
  },
];
type MapTourProps = {
  ready?: boolean;
};

export function MapTour({ ready = false }: MapTourProps) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });
const [targetRect, setTargetRect] = useState({
  top: 0,
  left: 0,
  width: 0,
  height: 0,
});
  const current = TOUR_STEPS[step];

useEffect(() => {
  if (!ready) {
    setVisible(false);
    return;
  }

  setVisible(true);
}, [ready]);

  /* ==========================================================
     CALCULATE TARGET POSITION
  ========================================================== */

  useEffect(() => {
    if (!visible) return;

const updatePosition = () => {
  const target = document.getElementById(current.target);

  if (!target) {
    return;
  }

  const rect = target.getBoundingClientRect();
setTargetRect({
  top: rect.top,
  left: rect.left,
  width: rect.width,
  height: rect.height,
});
  const tooltipWidth = 300;
  const tooltipHeight = 175;
  const gap = 18;
  const margin = 16;

  let left = rect.left + rect.width / 2 - tooltipWidth / 2;
  let top = rect.bottom + gap;

  // Legend → tetap di samping kiri karena panel legend ada di kanan
  if (current.target === "tour-legend") {
    left = rect.left - tooltipWidth - gap;
    top = rect.top + rect.height / 2 - tooltipHeight / 2;
  }

  // Jangan keluar kiri
  if (left < margin) {
    left = margin;
  }

  // Jangan keluar kanan
  if (left + tooltipWidth > window.innerWidth - margin) {
    left = window.innerWidth - tooltipWidth - margin;
  }

  // ============================================================
  // SEMUA TARGET NORMAL → TOOLTIP TETAP DI BAWAH
  // ============================================================

  if (current.target !== "tour-legend") {
    const maxTop = window.innerHeight - tooltipHeight - margin;

    if (top > maxTop) {
      top = maxTop;
    }
  }

  // Jangan keluar atas
  if (top < margin) {
    top = margin;
  }

  setPosition({ top, left });
};

    updatePosition();

    window.addEventListener(
      "resize",
      updatePosition
    );

    window.addEventListener(
      "scroll",
      updatePosition,
      true
    );

    const interval = setInterval(
      updatePosition,
      300
    );

    return () => {
      window.removeEventListener(
        "resize",
        updatePosition
      );

      window.removeEventListener(
        "scroll",
        updatePosition,
        true
      );

      clearInterval(interval);
    };
  }, [visible, step, current.target]);

useEffect(() => {
  if (!visible) return;

  let timer: ReturnType<typeof setTimeout> | null = null;
  let cancelled = false;

  const applyHighlight = () => {
    if (cancelled) return;

    const target = document.getElementById(current.target);

    // Target belum tersedia → coba lagi
    if (!target) {
      timer = setTimeout(applyHighlight, 100);
      return;
    }

    console.log(
      "[GEOLANDSCAPE TOUR] TARGET FOUND:",
      current.target,
      target
    );

    target.classList.add("geolandscape-tour-target");

  };

  applyHighlight();

  return () => {
    cancelled = true;

    if (timer) {
      clearTimeout(timer);
    }

    const target = document.getElementById(current.target);

    target?.classList.remove(
      "geolandscape-tour-target"
    );

if (current.target === "tour-information") {
  const button = target as HTMLElement | null;

  const container =
    button?.parentElement as HTMLElement | null;

  const mapControl =
    button?.closest(
      ".maplibregl-ctrl-top-right"
    ) as HTMLElement | null;

  if (button) {
    button.style.position = "";
    button.style.zIndex = "";
    button.style.outline = "";
    button.style.outlineOffset = "";
    button.style.boxShadow = "";
  }

  if (container) {
    container.style.position = "";
    container.style.zIndex = "";
  }

  if (mapControl) {
    mapControl.style.position = "";
    mapControl.style.zIndex = "";
  }
}
  };
}, [visible, current.target]);

  /* ==========================================================
     COMPLETE
  ========================================================== */

const finishTour = () => {
  setVisible(false);
};

  const nextStep = () => {
    if (step >= TOUR_STEPS.length - 1) {
      finishTour();
      return;
    }

    setStep((prev) => prev + 1);
  };

  const previousStep = () => {
    if (step === 0) return;

    setStep((prev) => prev - 1);
  };

  if (!visible) return null;

  return (
    <>
      {/* ======================================================
          DARK SPOTLIGHT
      ====================================================== */}

<div
  className="
    pointer-events-none
    fixed inset-0
    z-[9990]
    bg-black/35
    backdrop-blur-[1px]
  "
/>

{/* TOUR SPOTLIGHT */}
<div
  className="
    pointer-events-none
    fixed
    z-[9991]
    rounded-[7px]
    border-[2px]
    border-cyan-400
  "
  style={{
    top: targetRect.top - 6,
    left: targetRect.left - 6,
    width: targetRect.width + 12,
    height: targetRect.height + 12,

    background: "transparent",

    boxShadow: `
      0 0 0 2px rgba(34,211,238,.45),
      0 0 18px 4px rgba(34,211,238,.75),
      0 0 0 9999px rgba(0,0,0,0)
    `,
  }}
/>

      {/* ======================================================
          TOOLTIP
      ====================================================== */}

      <div
        className="
          fixed
          z-[10000]
          w-[300px]
          overflow-hidden
          rounded-[16px]
          border border-teal/30
          bg-[#071A24]/95
          shadow-[0_20px_70px_rgba(0,0,0,.55),0_0_35px_rgba(47,166,160,.08)]
          backdrop-blur-xl
        "
        style={{
          top: position.top,
          left: position.left,
          transition:
            "top 420ms cubic-bezier(.22,1,.36,1), left 420ms cubic-bezier(.22,1,.36,1)",
        }}
      >
        {/* TOP ACCENT */}

        <div className="absolute inset-x-[12%] top-0 h-px bg-teal/70 shadow-[0_0_8px_rgba(47,166,160,.7)]" />

        {/* CONTENT */}

        <div className="px-5 pt-5">

          <div className="flex items-start justify-between">

            <div>
              <div className="text-[8px] font-bold uppercase tracking-[0.22em] text-teal">
                GeoLandscape Guide
              </div>

              <h3 className="mt-1.5 text-[15px] font-semibold tracking-[-0.02em] text-white">
                {current.title}
              </h3>
            </div>

            <div className="text-[9px] font-medium tracking-[0.12em] text-white/35">
              {String(step + 1).padStart(2, "0")}
              {" / "}
              {String(TOUR_STEPS.length).padStart(2, "0")}
            </div>

          </div>

          <p className="mt-2.5 text-[11px] leading-[1.7] text-white/55">
            {current.description}
          </p>

        </div>

        {/* PROGRESS */}

        <div className="mt-4 px-5">

          <div className="h-px overflow-hidden rounded-full bg-white/[0.08]">

            <div
              className="h-full rounded-full bg-teal shadow-[0_0_8px_rgba(47,166,160,.7)]"
              style={{
                width: `${
                  ((step + 1) /
                    TOUR_STEPS.length) *
                  100
                }%`,
                transition: "width 400ms ease",
              }}
            />

          </div>

        </div>

        {/* ACTIONS */}

        <div className="flex items-center justify-between px-5 pb-4 pt-4">

          <button
            onClick={finishTour}
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.14em]
              text-white/35
              transition-colors
              hover:text-white/70
            "
          >
            Skip
          </button>

          <div className="flex items-center gap-2">

            {step > 0 && (
              <button
                onClick={previousStep}
                className="
                  rounded-[8px]
                  border border-white/10
                  px-3 py-1.5
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.1em]
                  text-white/50
                  transition-all
                  hover:border-teal/30
                  hover:text-white
                "
              >
                Back
              </button>
            )}

            <button
              onClick={nextStep}
              className="
                rounded-[8px]
                border border-teal/40
                bg-teal/[0.12]
                px-3.5 py-1.5
                text-[9px]
                font-bold
                uppercase
                tracking-[0.1em]
                text-teal
                transition-all
                hover:bg-teal/20
                hover:shadow-[0_0_15px_rgba(47,166,160,.15)]
              "
            >
              {step === TOUR_STEPS.length - 1
                ? "Explore Map"
                : "Next →"}
            </button>

          </div>

        </div>

      </div>
    </>
  );
}
