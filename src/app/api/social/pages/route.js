import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { socialSession, managedPages } from "@/lib/social";

export async function GET() {
  const auth = await getServerSession(authOptions);
  if (!auth?.user?.id) return Response.json({ error: "Sign in first." }, { status: 401 });
  try {
    const pages = await managedPages(await socialSession(auth.user.id));
    return Response.json({ pages }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Could not load Facebook Pages. Check your connection and permissions." }, { status: 502 });
  }
}
