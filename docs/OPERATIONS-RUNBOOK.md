# Operations Runbook

## Deploy

Run `npm run build`, commit on `main`, push to GitHub, then verify the Vercel production deployment is built from the pushed commit before checking `https://hokvibe.com` directly.

## Billing

Keep `STRIPE_BILLING_ENABLED=false` until the migration is applied, Stripe price IDs are allow-listed, and a signed test webhook updates the local webhook ledger, subscription, and entitlement.

## Email

Keep `EMAIL_OUTBOX_ENABLED=false` until the migration, Resend sending-domain verification, and protected job trigger are complete. Investigate rows with `status=failed`; do not automatically resend uncertain email attempts.

## Publishing

Treat `unknown` as indeterminate delivery. Inspect the destination platform before creating a new publish request. Never issue an automatic retry.

## Rollback

Roll back application code in Vercel or revert the application commit. Do not drop billing, email, or publication database tables during rollback; disable the feature flags first.
