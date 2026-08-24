"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { setToolMode, getToolMode } from "./toolMode";

export default function IdentifyButton({ map }) {
  const controlRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    const control = new IdentifyButtonControl();
    controlRef.current = control;

    map.addControl(control, "top-right");

    return () => {
      try {
        map.removeControl(control);
      } catch {}
      controlRef.current = null;
    };
  }, [map]);

  return null;
}

class IdentifyButtonControl {
  _container = null;
  _button = null;

  onAdd(map) {
    this._map = map;

    const container = document.createElement("div");
    container.className = "maplibregl-ctrl maplibregl-ctrl-group identify-control";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "identify-button";
    button.title = "Identifikasi objek";
    button.setAttribute("aria-label", "Identifikasi objek");

    // Icon i
    button.innerHTML = `
      <span class="identify-icon">i</span>
    `;

    button.addEventListener("click", this._onClick);

    container.appendChild(button);

    this._container = container;
    this._button = button;

    this._updateState();

    return container;
  }

  onRemove() {
    this._button?.removeEventListener("click", this._onClick);
    this._container?.remove();

    this._map = undefined;
    this._container = null;
    this._button = null;
  }

  _onClick = () => {
    const current = getToolMode();

    if (current === "identify") {
      setToolMode(null);
    } else {
      setToolMode("identify");
    }

    this._updateState();
  };

  _updateState = () => {
    if (!this._button) return;

    const active = getToolMode() === "identify";

    this._button.classList.toggle("active", active);
  };
}
