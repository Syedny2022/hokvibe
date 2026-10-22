"use client";
import { useCallback, useEffect, useState } from "react";

const slugs = { LinkedIn: "linkedin", Facebook: "facebook", Reddit: "reddit" };
export default function Publishing({ creation, text }) {
  const platform = slugs[creation.platform];
  const [connection, setConnection] = useState("unknown");
  const [pages, setPages] = useState([]);
  const [pageId, setPageId] = useState("");
  const [subreddit, setSubreddit] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [requestKey, setRequestKey] = useState(null);
  const refresh = useCallback(async () => {
    if (!platform) return;
    try {
      const response = await fetch("/api/social/accounts");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      const item = data.find(x => x.platform === platform);
      setConnection(item?.connected ? "connected" : item?.status === "EXPIRED" ? "expired" : "disconnected");
    } catch (e) { setConnection("error"); setMessage(e.message); }
  }, [platform]);
  useEffect(() => { refresh(); }, [refresh]);
  const connect = async () => {
    setBusy(true); setMessage("");
    try {
      const res = await fetch("/api/social/connect", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ platform }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.assign(data.url);
    } catch (e) { setMessage(e.message); setBusy(false); }
  };
  const loadPages = async () => {
    setBusy(true); setMessage("");
    try {
      const res = await fetch("/api/social/pages");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPages(data.pages);
      if (!data.pages.length) setMessage("No managed Pages found. Check Facebook permissions.");
    } catch (e) { setMessage(e.message); } finally { setBusy(false); }
  };
  const publish = async () => {
    const key = requestKey || crypto.randomUUID();
    setRequestKey(key); setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/social/publish", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ creationId: creation.id, platform, text, pageId, subreddit: subreddit.toLowerCase().startsWith("r/") ? subreddit.slice(2) : subreddit, title, requestKey: key }) });
      const data = await response.json();
      if (!response.ok || data.status !== "published") throw new Error(data.error || "Publication could not be confirmed. Check the platform before trying again.");
      setMessage(data.postUrl ? "Published: " + data.postUrl : "Published.");
      setRequestKey(null);
    } catch (e) { setMessage(e.message); } finally { setBusy(false); }
  };
  if (!platform) return <p className="text-sm text-zinc-400">{creation.platform} is preview-only. Copy your draft to publish it manually.</p>;
  return <section className="mt-4 space-y-3">
    <p className="text-sm text-zinc-300">{creation.platform}: {connection}</p>
    <button type="button" onClick={connect} disabled={busy} className="rounded border border-zinc-600 px-3 py-2 text-sm">{connection === "connected" ? "Reconnect" : "Connect"} {creation.platform}</button>
    {platform === "facebook" && <div className="space-y-2"><button type="button" onClick={loadPages} disabled={busy} className="block rounded border border-zinc-600 px-3 py-2 text-sm">Load Facebook Pages</button><label className="block text-sm">Page<select value={pageId} onChange={e => setPageId(e.target.value)} className="block w-full bg-zinc-900 border border-zinc-600 p-2"><option value="">Select a Page</option>{pages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label></div>}
    {platform === "reddit" && <div className="space-y-2"><label className="block text-sm">Subreddit<input value={subreddit} onChange={e => setSubreddit(e.target.value)} className="block w-full bg-zinc-900 border border-zinc-600 p-2" /></label><label className="block text-sm">Title<input maxLength={300} value={title} onChange={e => setTitle(e.target.value)} className="block w-full bg-zinc-900 border border-zinc-600 p-2" /></label></div>}
    <button type="button" onClick={publish} disabled={busy || connection !== "connected" || !text.trim() || (platform === "facebook" && !pageId) || (platform === "reddit" && (!subreddit.trim() || !title.trim()))} className="rounded bg-blue-700 px-4 py-2 text-sm disabled:opacity-40">Publish</button>
    {message && <p role="status" className="text-sm text-zinc-300">{message}</p>}
    {creation.publications?.filter(item => item.platform === platform).map((item, index) => <p key={item.createdAt + index} className="text-sm text-zinc-400">{item.status}{item.error ? ": " + item.error : ""}{item.postUrl && <> <a href={item.postUrl} target="_blank" rel="noreferrer">View post</a></>}</p>)}
  </section>;
}
