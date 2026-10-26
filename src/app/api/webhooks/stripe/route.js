import { enqueueEmail } from "@/lib/email/outbox";
import { logOperationalEvent } from "@/lib/observability";
import { billingIsEnabled, stripeClient, syncSubscription } from "@/lib/billing/stripe";
import { prisma } from "@/lib/prisma";

async function queueBillingEmail(userId, subscription, type) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
  if (!user?.email) return;
  const template = type === "invoice.payment_failed" ? "payment_failed" : type === "invoice.paid" ? "invoice_paid" : "subscription_activated";
  await enqueueEmail({
    userId,
    recipient: user.email,
    trigger: type,
    template,
    deduplicationKey: `billing/${type}/${subscription.id}`,
  });
}

export async function POST(request) {
  if (!billingIsEnabled() || !process.env.STRIPE_WEBHOOK_SECRET) return Response.json({ error: "Billing webhooks are not configured." }, { status: 503 });
  const signature = request.headers.get("stripe-signature");
  if (!signature) return Response.json({ error: "Missing signature." }, { status: 400 });

  let event;
  try {
    event = stripeClient().webhooks.constructEvent(await request.text(), signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return Response.json({ error: "Invalid signature." }, { status: 400 });
  }

  const existing = await prisma.webhookEvent.findUnique({ where: { provider_providerId: { provider: "stripe", providerId: event.id } } });
  if (existing?.status === "processed") return Response.json({ received: true, duplicate: true });
  const ledger = existing || await prisma.webhookEvent.create({ data: { provider: "stripe", providerId: event.id, type: event.type, status: "processing", attempts: 1 } });

  try {
    let synced = null;
    if (event.type.startsWith("customer.subscription.")) {
      // Fetch current Stripe state so an older delivered event cannot overwrite it.
      synced = await syncSubscription(await stripeClient().subscriptions.retrieve(event.data.object.id));
    }
    if (event.type === "checkout.session.completed" && event.data.object.subscription) {
      const subscriptionId = typeof event.data.object.subscription === "string" ? event.data.object.subscription : event.data.object.subscription.id;
      synced = await syncSubscription(await stripeClient().subscriptions.retrieve(subscriptionId));
    }
    if (event.type === "invoice.paid" || event.type === "invoice.payment_failed") {
      const subscriptionId = typeof event.data.object.subscription === "string" ? event.data.object.subscription : event.data.object.subscription?.id;
      if (subscriptionId) synced = await syncSubscription(await stripeClient().subscriptions.retrieve(subscriptionId));
    }
    if (synced && ["checkout.session.completed", "invoice.paid", "invoice.payment_failed"].includes(event.type)) await queueBillingEmail(synced.userId, synced.subscription, event.type);
    await prisma.webhookEvent.update({ where: { id: ledger.id }, data: { status: "processed", processedAt: new Date(), error: null } });
    logOperationalEvent("stripe_webhook_processed", { eventId: event.id, type: event.type });
    return Response.json({ received: true });
  } catch {
    await prisma.webhookEvent.update({ where: { id: ledger.id }, data: { status: "failed", attempts: { increment: 1 }, error: "Processing failed." } }).catch(() => {});
    logOperationalEvent("stripe_webhook_failed", { eventId: event.id, type: event.type });
    return Response.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
