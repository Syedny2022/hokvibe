import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { billingIsEnabled, stripeClient } from "@/lib/billing/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return Response.json({ error: "Sign in with Google first." }, { status: 401 });
  if (!billingIsEnabled()) return Response.json({ error: "Billing is not available yet." }, { status: 503 });
  const origin = process.env.NEXTAUTH_URL;
  if (!origin || request.headers.get("origin") !== new URL(origin).origin) return Response.json({ error: "Invalid request origin." }, { status: 403 });

  const customer = await prisma.stripeCustomer.findUnique({ where: { userId: session.user.id } });
  if (!customer) return Response.json({ error: "No billing account was found." }, { status: 404 });
  try {
    const portal = await stripeClient().billingPortal.sessions.create({ customer: customer.stripeCustomerId, return_url: new URL("/studio", origin).toString() });
    return Response.json({ url: portal.url });
  } catch {
    return Response.json({ error: "Could not open billing management." }, { status: 502 });
  }
}
