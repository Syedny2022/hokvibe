import "server-only";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export function billingIsEnabled() {
  return process.env.STRIPE_BILLING_ENABLED === "true" && Boolean(process.env.STRIPE_SECRET_KEY);
}

export function allowedPriceIds() {
  return new Set(
    (process.env.STRIPE_ALLOWED_PRICE_IDS || "")
      .split(",")
      .map((priceId) => priceId.trim())
      .filter(Boolean)
  );
}

export function stripeClient() {
  if (!billingIsEnabled()) throw new Error("Billing is not enabled.");
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function getOrCreateStripeCustomer(user) {
  const existing = await prisma.stripeCustomer.findUnique({ where: { userId: user.id } });
  if (existing) return existing;

  const customer = await stripeClient().customers.create({
    email: user.email || undefined,
    metadata: { hokvibe_user_id: user.id },
  });

  try {
    return await prisma.stripeCustomer.create({
      data: { userId: user.id, stripeCustomerId: customer.id },
    });
  } catch (error) {
    const concurrent = await prisma.stripeCustomer.findUnique({ where: { userId: user.id } });
    if (concurrent) return concurrent;
    throw error;
  }
}

export async function syncSubscription(subscription) {
  const stripeCustomerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id;
  if (!stripeCustomerId) return null;
  const customer = await prisma.stripeCustomer.findUnique({ where: { stripeCustomerId } });
  if (!customer) return null;

  const priceId = subscription.items?.data?.[0]?.price?.id || null;
  const currentPeriodEnd = subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null;
  const saved = await prisma.subscription.upsert({
    where: { stripeSubscriptionId: subscription.id },
    create: {
      userId: customer.userId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      status: subscription.status,
      cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
      currentPeriodEnd,
    },
    update: {
      stripePriceId: priceId,
      status: subscription.status,
      cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
      currentPeriodEnd,
    },
  });

  const active = ["active", "trialing"].includes(subscription.status);
  await prisma.entitlement.upsert({
    where: { userId_capability: { userId: customer.userId, capability: "studio" } },
    create: { userId: customer.userId, capability: "studio", status: active ? "active" : "inactive", subscriptionId: saved.id },
    update: { status: active ? "active" : "inactive", subscriptionId: saved.id },
  });

  return { userId: customer.userId, subscription: saved, active };
}
