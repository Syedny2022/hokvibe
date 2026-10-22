import { getServerSession } from "next-auth/next";
import { Composio } from "@composio/core";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const user = await getServerSession(authOptions);
  if (!user?.user?.id || user.user.isApiKeyUser) return Response.json({ error: "Sign in with Google." }, { status: 401 });
  if (!process.env.COMPOSIO_API_KEY) return Response.json({ error: "Social connections are not configured." }, { status: 503 });
  try {
    const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
    const session = await composio.create(user.user.id);
    const result = await session.toolkits({ toolkits: ["linkedin", "facebook", "reddit"], limit: 10 });
    return Response.json(result.items.filter(item => ["linkedin", "facebook", "reddit"].includes(item.slug)).map(item => ({ platform: item.slug, connected: Boolean(item.connection?.isActive), status: item.connection?.connectedAccount?.status || "DISCONNECTED" })), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[SOCIAL_ACCOUNTS]", error.message);
    return Response.json({ error: "Could not load connected accounts." }, { status: 502 });
  }
}
