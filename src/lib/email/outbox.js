import "server-only";
import { prisma } from "@/lib/prisma";
import { logOperationalEvent } from "@/lib/observability";

const FROM = () => process.env.RESEND_FROM || "Hokvibe <support@mail.hokvibe.com>";

const templates = {
  welcome: {
    subject: "Welcome to Hokvibe",
    text: "Welcome to Hokvibe. Start creating your first social draft at https://hokvibe.com/studio.",
  },
  subscription_activated: {
    subject: "Your Hokvibe access is active",
    text: "Your subscription is active. Open Hokvibe Studio at https://hokvibe.com/studio.",
  },
  invoice_paid: {
    subject: "Your Hokvibe payment was received",
    text: "Your payment was received. Manage your account from Hokvibe Studio at https://hokvibe.com/studio.",
  },
  payment_failed: {
    subject: "Action needed for your Hokvibe payment",
    text: "We could not process your payment. Update your billing details in Hokvibe when billing management is available.",
  },
  support_confirmation: {
    subject: "We received your Hokvibe support request",
    text: "We received your request and will reply through the support channel you used.",
  },
};

export async function enqueueEmail({ userId, recipient, trigger, template, deduplicationKey }) {
  if (!templates[template]) throw new Error("Unknown email template.");
  return prisma.emailOutbox.upsert({
    where: { deduplicationKey },
    create: { userId, recipient, trigger, template, deduplicationKey },
    update: {},
  });
}

export async function enqueueWelcomeEmail(user) {
  if (!user.email) return null;
  return enqueueEmail({
    userId: user.id,
    recipient: user.email,
    trigger: "account_created",
    template: "welcome",
    deduplicationKey: `welcome/${user.id}`,
  });
}

async function send(outbox) {
  const template = templates[outbox.template];
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": outbox.deduplicationKey,
    },
    body: JSON.stringify({ from: FROM(), to: [outbox.recipient], subject: template.subject, text: template.text }),
  });
  if (!response.ok) throw new Error(`Resend returned HTTP ${response.status}`);
  return response.json();
}

export async function processEmailOutbox(limit = 20) {
  if (!process.env.RESEND_API_KEY) return { processed: 0, skipped: "not_configured" };
  const messages = await prisma.emailOutbox.findMany({ where: { status: "pending" }, orderBy: { createdAt: "asc" }, take: limit });
  let processed = 0;
  for (const message of messages) {
    const locked = await prisma.emailOutbox.updateMany({ where: { id: message.id, status: "pending" }, data: { status: "sending", attempts: { increment: 1 }, error: null } });
    if (!locked.count) continue;
    try {
      const result = await send(message);
      await prisma.emailOutbox.update({ where: { id: message.id }, data: { status: "sent", providerMessageId: result.id || null, sentAt: new Date() } });
      logOperationalEvent("email_sent", { outboxId: message.id, template: message.template });
      processed += 1;
    } catch (error) {
      await prisma.emailOutbox.update({ where: { id: message.id }, data: { status: "failed", error: "Delivery attempt failed." } });
      logOperationalEvent("email_failed", { outboxId: message.id, template: message.template });
    }
  }
  return { processed };
}
