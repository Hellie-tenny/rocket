import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const CLIENT_ID = import.meta.env.VITE_ADSENSE_CLIENT_ID as string | undefined;
const SLOT_ID = import.meta.env.VITE_ADSENSE_SLOT_ID as string | undefined;

let scriptLoaded = false;

function loadAdSenseScript(clientId: string) {
  if (scriptLoaded) return;
  scriptLoaded = true;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
  script.crossOrigin = "anonymous";
  document.head.appendChild(script);
}

// Renders nothing until AdSense credentials are configured — avoids showing
// broken/empty ad slots before the site is approved.
export default function AdSlot() {
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!CLIENT_ID || !SLOT_ID) return;
    loadAdSenseScript(CLIENT_ID);
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // AdSense script may not have finished loading yet — safe to ignore.
    }
  }, []);

  if (!CLIENT_ID || !SLOT_ID) return null;

  return (
    <div className="my-8">
      <ins
        ref={insRef}
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={SLOT_ID}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
