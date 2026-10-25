"use client";

import { useCallback, useEffect, useState } from "react";

const publishablePlatforms = [
  { slug: "linkedin", label: "LinkedIn" },
  { slug: "facebook", label: "Facebook Pages" },
  { slug: "reddit", label: "Reddit" },
];

const previewOnlyPlatforms = ["X / Twitter", "Instagram", "LINE"];

export default function ConnectionOverview() {
  const [connections, setConnections] = useState({});
  const [state, setState] = useState("loading");

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/social/accounts", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load connections.");
      setConnections(Object.fromEntries(data.map((item) => [item.platform, item])));
      setState("ready");
    } catch {
      setState("unavailable");
    }
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [refresh]);

  return (
    <section className="rounded border border-zinc-800 bg-zinc-900 p-4" aria-live="polite">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-zinc-200">Publishing connections</h2>
        <button type="button" onClick={refresh} className="text-xs text-emerald-400 hover:text-emerald-300">Refresh</button>
      </div>
      <div className="mt-3 space-y-2 text-xs">
        {publishablePlatforms.map(({ slug, label }) => {
          const connection = connections[slug];
          const connected = connection?.connected;
          const expired = connection?.status === "EXPIRED";
          const labelText = state === "loading" ? "Checking" : state === "unavailable" ? "Unavailable" : connected ? "Connected" : expired ? "Reconnect" : "Not connected";
          const color = connected ? "text-emerald-400" : "text-zinc-400";
          return <div key={slug} className="flex items-center justify-between gap-3"><span className="text-zinc-300">{label}</span><span className={color}>{labelText}</span></div>;
        })}
        {previewOnlyPlatforms.map((platform) => <div key={platform} className="flex items-center justify-between gap-3"><span className="text-zinc-300">{platform}</span><span className="text-zinc-500">Preview only</span></div>)}
      </div>
    </section>
  );
}
