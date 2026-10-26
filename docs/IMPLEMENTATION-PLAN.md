# Implementation Plan

1. Apply the reviewed additive Prisma migration in a production maintenance window.
2. Configure Stripe allowed price IDs, webhook endpoint, and webhook signing secret; enable `STRIPE_BILLING_ENABLED` only after test events reconcile correctly.
3. Verify `mail.hokvibe.com` in Resend, configure `RESEND_API_KEY`, configure a protected scheduler for `/api/email/process`, then enable `EMAIL_OUTBOX_ENABLED`.
4. Apply and verify database RLS policies using the active InsForge database role model.
5. Run authenticated acceptance tests for separate tenant workspaces, social connections, generation, publication success/failure/unknown states, Checkout, webhook idempotency, and email delivery.
6. Add operational alerts for failed webhook events, failed outbox rows, provider connection failures, and unknown publications.
