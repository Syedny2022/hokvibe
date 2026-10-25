import { getServerSession } from "next-auth/next";
import { Composio } from "@composio/core";
import { authOptions } from "@/lib/auth";

const supported = new Set(["linkedin", "facebook", "reddit"]);

export async function POST(request) {
  const user = await getServerSession(authOptions);
  if (!user?.user?.id || user.user.isApiKeyUser) return Response.json({ error: "Sign in with Google." }, { status: 401 });
  const origin = process.env.NEXTAUTH_URL;
  if (!origin || request.headers.get("origin") !== new URL(origin).origin) return Response.json({ error: "Invalid request origin." }, { status: 403 });
  if (!process.env.COMPOSIO_API_KEY) return Response.json({ error: "Social connections are not configured." }, { status: 503 });
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid request." }, { status: 400 }); }
  if (!supported.has(body?.platform)) return Response.json({ error: "Unsupported platform." }, { status: 400 });
  try {
    const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
    const session = await composio.create(user.user.id);
    const connection = await session.authorize(body.platform, { callbackUrl: new URL("/studio", origin).toString() });
    const url = new URL(connection.redirectUrl);
    if (url.protocol !== "https:") throw new Error("Invalid authorization URL");
    return Response.json({ url: url.toString() }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[SOCIAL_CONNECT]", error.message);
    return Response.json({ error: "Could not start the connection." }, { status: 502 });
  }
}
