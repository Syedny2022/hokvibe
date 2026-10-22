import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { socialSession, execute, managedPages } from "@/lib/social";

export async function POST(request) {
  const auth = await getServerSession(authOptions);
  const userId = auth?.user?.id;
  if (!userId) return Response.json({ error: "Sign in first." }, { status: 401 });
  const origin = process.env.NEXTAUTH_URL;
  if (!origin || request.headers.get("origin") !== new URL(origin).origin) return Response.json({ error: "Invalid request origin." }, { status: 403 });
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid request." }, { status: 400 }); }
  const { creationId, platform, text, pageId, subreddit, title, requestKey } = body;
  if (!["linkedin", "facebook", "reddit"].includes(platform) || typeof text !== "string" || !text.trim() || text.length > 40000 || typeof creationId !== "string" || typeof requestKey !== "string" || !/^[a-f0-9-]{36}$/i.test(requestKey)) return Response.json({ error: "Invalid publication details." }, { status: 400 });
  if (platform === "linkedin" && text.length > 3000) return Response.json({ error: "LinkedIn posts must be 3,000 characters or fewer." }, { status: 400 });
  if (platform === "facebook" && !/^[0-9]+$/.test(pageId || "")) return Response.json({ error: "Select a Facebook Page." }, { status: 400 });
  if (platform === "reddit" && (!/^[A-Za-z0-9_]{3,21}$/.test(subreddit || "") || typeof title !== "string" || !title.trim() || title.length > 300)) return Response.json({ error: "Enter a valid subreddit and title." }, { status: 400 });
  const creation = await prisma.socialPostCreation.findFirst({ where: { id: creationId, userId, status: "completed" } });
  if (!creation) return Response.json({ error: "Draft not found." }, { status: 404 });
  const existing = await prisma.socialPublication.findUnique({ where: { requestKey }, include: { creation: { select: { userId: true } } } });
  if (existing) {
    if (existing.creation.userId !== userId || existing.creationId !== creationId || existing.platform !== platform) return Response.json({ error: "Invalid publication request." }, { status: 409 });
    return Response.json({ status: existing.status, postUrl: existing.postUrl, error: existing.error });
  }
  let session, params, slug;
  try {
    session = await socialSession(userId);
    const states = await session.toolkits({ toolkits: [platform], limit: 10 });
    if (!states.items.some(item => item.slug === platform && item.connection?.isActive)) return Response.json({ error: "Connect this account before publishing." }, { status: 400 });
    if (platform === "linkedin") {
      const profile = await execute(session, "LINKEDIN_GET_MY_INFO", {});
      const id = profile?.sub || profile?.id;
      if (typeof id !== "string" || !/^[A-Za-z0-9_-]+$/.test(id)) throw new Error("Could not identify your LinkedIn account.");
      slug = "LINKEDIN_CREATE_LINKED_IN_POST";
      params = { author: `urn:li:person:${id}`, commentary: text, visibility: "PUBLIC" };
    } else if (platform === "facebook") {
      if (!(await managedPages(session)).some(page => page.id === pageId)) return Response.json({ error: "Choose one of your connected Facebook Pages." }, { status: 400 });
      slug = "FACEBOOK_CREATE_POST";
      params = { page_id: pageId, message: text, published: true };
    } else {
      slug = "REDDIT_CREATE_REDDIT_POST";
      params = { subreddit, title: title.trim(), kind: "self", text };
    }
  } catch {
    return Response.json({ error: "Could not prepare publication. Check your connection and permissions." }, { status: 502 });
  }
  let attempt;
  try {
    attempt = await prisma.socialPublication.create({ data: { creationId, platform, requestKey, status: "pending" } });
    let saved;
    try { saved = JSON.parse(creation.resultText || "{}"); } catch { saved = {}; }
    await prisma.socialPostCreation.update({ where: { id: creationId }, data: { resultText: JSON.stringify({ ...saved, postText: text }) } });
  } catch {
    return Response.json({ error: "Could not record publication. No post was sent." }, { status: 503 });
  }
  try {
    const result = await execute(session, slug, params);
    if (Array.isArray(result?.json?.errors) && result.json.errors.length) throw new Error("Platform rejected the post.");
    const candidate = result?.permalink || result?.url || result?.json?.data?.url;
    const postId = result?.id || result?.post_id || result?.postId || result?.urn || result?.json?.data?.name;
    if (!candidate && !postId) throw new Error("Platform did not return a post identifier.");
    let postUrl = null;
    if (typeof candidate === "string") {
      const parsed = new URL(candidate, "https://www.reddit.com");
      if (parsed.protocol === "https:" && ["reddit.com", "www.reddit.com", "linkedin.com", "www.linkedin.com", "facebook.com", "www.facebook.com"].includes(parsed.hostname)) postUrl = parsed.toString();
    }
    await prisma.socialPublication.update({ where: { id: attempt.id }, data: { status: "published", postUrl } });
    return Response.json({ status: "published", postUrl });
  } catch {
    await prisma.socialPublication.update({ where: { id: attempt.id }, data: { status: "unknown", error: "Check the platform before trying again; publication could not be confirmed." } }).catch(() => {});
    return Response.json({ status: "unknown", error: "Check the platform before trying again; publication could not be confirmed." }, { status: 502 });
  }
}
