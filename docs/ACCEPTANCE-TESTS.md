# Acceptance Tests

- Two Google users can only view their own creations and publications.
- A user can generate platform drafts without exposing provider keys.
- A user must explicitly publish; generation alone does not send a post.
- LinkedIn, Facebook Pages, and Reddit connections are tenant-scoped and show actionable reconnect errors.
- Facebook publishing requires a selected managed Page; Reddit requires a valid subreddit and title.
- A rejected publication is `failed`; an indeterminate provider response is `unknown` and is not retried automatically.
- Checkout accepts only server allow-listed Stripe price IDs.
- Stripe webhook delivery is signature checked and idempotent by provider event ID.
- Email outbox has one row per deduplication key and Resend requests use the same idempotency key.
- Public routes, blog metadata, JSON-LD, sitemap, robots, `index.md`, and `llms.txt` return their expected content.
