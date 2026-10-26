import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { allowedPriceIds, billingIsEnabled, getOrCreateStripeCustomer, stripeClient } from "@/lib/billing/stripe";
import { logOperationalEvent } from "@/lib/observability";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.email) return Response.json({ error: "Sign in with Google first." }, { status: 401 });
  if (!billingIsEnabled()) return Response.json({ error: "Billing is not available yet." }, { status: 503 });

  const origin = process.env.NEXTAUTH_URL;
  if (!origin || request.headers.get("origin") !== new URL(origin).origin) return Response.json({ error: "Invalid request origin." }, { status: 403 });

  let body;
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid request." }, { status: 400 }); }
  if (typeof body?.priceId !== "string" || !allowedPriceIds().has(body.priceId)) return Response.json({ error: "This plan is not available." }, { status: 400 });

  try {
    const customer = await getOrCreateStripeCustomer(session.user);
    const checkout = await stripeClient().checkout.sessions.create({
      mode: "subscription",
      customer: customer.stripeCustomerId,
      client_reference_id: session.user.id,
      line_items: [{ price: body.priceId, quantity: 1 }],
      success_url: new URL("/studio?billing=success", origin).toString(),
      cancel_url: new URL("/studio?billing=cancelled", origin).toString(),
      metadata: { hokvibe_user_id: session.user.id },
      subscription_data: { metadata: { hokvibe_user_id: session.user.id } },
    });
    if (!checkout.url) throw new Error("Stripe did not return a Checkout URL.");
    logOperationalEvent("billing_checkout_started", { checkoutId: checkout.id });
    return Response.json({ url: checkout.url });
  } catch {
    return Response.json({ error: "Could not start Checkout." }, { status: 502 });
  }
}
