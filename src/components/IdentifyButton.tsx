"use client";

import { useEffect, useState } from "react";
import {
  setToolMode,
  getToolMode,
  onToolMode,
} from "./toolMode";

export default function IdentifyButton() {
  const [active, setActive] = useState(
    getToolMode() === "identify"
  );

  useEffect(() => {
    const unsubscribe = onToolMode((mode) => {
      setActive(mode === "identify");
    });

    return unsubscribe;
  }, []);

  const handleClick = () => {
    if (getToolMode() === "identify") {
      setToolMode(null);
    } else {
      setToolMode("identify");
    }
  };

  return (
    <button
      type="button"
      className={`identify-button ${
        active ? "active" : ""
      }`}
      onClick={handleClick}
      title="Identifikasi objek"
      aria-label="Identifikasi objek"
    >
      <span className="identify-icon">i</span>
    </button>
  );
}
