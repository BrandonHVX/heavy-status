"use client";

import { useEffect } from "react";

export default function OneSignalInit() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
    if (appId) {
      const w = window as any;
      w.OneSignalDeferred = w.OneSignalDeferred || [];
      w.OneSignalDeferred.push(async function(OneSignal: any) {
        await OneSignal.init({
          appId,
          allowLocalhostAsSecureOrigin: true,
          notifyButton: { enable: true },
        });
      });
    }
  }, []);

  return null;
}
