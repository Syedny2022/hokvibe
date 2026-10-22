import { Composio } from "@composio/core";

export async function socialSession(userId) {
  if (!process.env.COMPOSIO_API_KEY) throw new Error("Social connections are not configured.");
  return new Composio({ apiKey: process.env.COMPOSIO_API_KEY }).create(userId);
}

export async function execute(session, slug, params) {
  const result = await session.execute(slug, params);
  if (result.error || result.data?.successful === false) throw new Error("The social platform rejected the request.");
  return result.data?.data ?? result.data;
}

export async function managedPages(session) {
  let after;
  const pages = [];
  for (let i = 0; i < 20; i++) {
    const data = await execute(session, "FACEBOOK_LIST_MANAGED_PAGES", { fields: "id,name", limit: 100, ...(after ? { after } : {}) });
    const items = Array.isArray(data) ? data : data?.data;
    if (!Array.isArray(items)) throw new Error("Could not read Facebook Pages.");
    pages.push(...items.filter(p => typeof p.id === "string" && typeof p.name === "string").map(p => ({ id: p.id, name: p.name })));
    const next = data?.paging?.next && data?.paging?.cursors?.after;
    if (!next) return pages;
    after = next;
  }
  throw new Error("Too many Facebook Pages to list.");
}
