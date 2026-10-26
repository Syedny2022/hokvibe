# Product Contract

Hokvibe is a multi-tenant social-content workspace. A signed-in customer creates and edits platform-specific drafts, then explicitly chooses whether to copy or publish.

- Customer identity comes only from the authenticated server session.
- Every creation and publication is queried through its owning database user ID.
- Provider keys stay server-side. Hokvibe does not persist social OAuth tokens.
- LinkedIn, Facebook Pages, and Reddit are the current publish targets. X/Twitter, Instagram, and LINE are preview/export formats.
- Publication states are `draft`, `approved`, `queued`, `sending`, `published`, `failed`, and `unknown`. An `unknown` result must be checked by the customer before any new attempt; it is never retried automatically.
- Billing access is calculated from server-side Stripe webhook reconciliation, not from client-provided plan data.
