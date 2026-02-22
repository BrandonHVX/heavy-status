"use client";

import { useEffect } from "react";

export default function OneSignalInit() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/OneSignalSDKWorker.js").catch(() => {});
    }
  }, []);

  return null;
}
