# Foundation Audit

## Implemented

- Next.js App Router marketing pages, Markdown blog routes, sitemap, robots, and machine-readable `llms.txt`.
- Google authentication through NextAuth with the database user ID used as the tenant boundary.
- Six-format draft generation workspace with explicit publishing controls.
- Managed social connection UI and direct publish routes for LinkedIn, Facebook Pages, and Reddit.
- InsForge-oriented RLS policy script is present in `docs/database-rls-lockdown.sql`.

## In Progress

- Billing implementation and durable email outbox are included in the application and require the additive migration in `prisma/migrations/20261025000000_billing_outbox`.
- Billing and email are disabled by default through feature flags.

## Gaps

- Production database RLS enforcement, Stripe products/prices/webhook registration, Resend domain verification, cron scheduling, and end-to-end provider tests require separate authenticated provider verification and action approval.
- Existing legacy `User.credits` and `User.customApiKey` database fields require a reviewed removal migration; no destructive migration is included.
