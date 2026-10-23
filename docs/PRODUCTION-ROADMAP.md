# Hokvibe Production Roadmap

Last reviewed: 2026-10-14

This is the durable operating plan for Hokvibe. It is a roadmap, not evidence
that a provider, feature, or integration is currently live. Provider state must
be checked in the relevant dashboard before work is marked complete.

## 1. Product Decision

Hokvibe is a self-serve Social Content Engine for solo founders and small
brands. A customer supplies one raw idea, a target platform, and a tone.
Hokvibe returns editable platform-specific social copy and an image creative
brief. The first paid unit is a credit pack. Direct publishing, UGC/video, and
an autonomous content CMS are explicitly outside the first launch.

The product promise is not "AI posts." It is: "Turn one useful founder insight
into ready-to-review posts for the channels where your customers already pay
attention."

Success metric for launch: a new user can sign in, generate one useful post,
understand remaining credits, and complete a real purchase without human help.

## 2. Source of Truth and Context Recovery

1. GitHub repository `Syedny2022/hokvibe` and the `main` branch are the source
   of truth for application code and versioned operational documents.
2. Vercel is the source of truth for deployment, production environment
   bindings, build logs, and domain assignments.
3. Cloudflare is the source of truth for DNS records. It is not the deployment
   source for this application.
4. Supabase is the source of truth for production database health and data.
5. Stripe, MuAPI, Google Cloud, and Resend are the sources of truth for their
   respective integrations.
6. Codex memory and chat history are convenience context only. They must never
   be used as proof that a live change succeeded.
7. Before each substantial session, update this file's next-action section and
   add a short dated entry to `docs/OPERATIONS-LOG.md`. Keep secrets out of
   Git, chat logs, and screenshots.

## 3. Required Access Checklist

Mark an item complete only after an authenticated, read-only check. A missing
item is a gate, not an invitation to use a placeholder value.

### Code and delivery

- [ ] GitHub: owner-level or repository-admin access to `Syedny2022/hokvibe`.
- [ ] GitHub: protected `main`, required deployment check, and an explicit PR
      review/merge path.
- [ ] Vercel: access to project `hokvibe` in `syedmohnyc-4944s-projects`.
- [ ] Vercel: production domain assignments for `hokvibe.com` and `www`.
- [ ] Cloudflare: DNS edit access to the `hokvibe.com` zone.
- [ ] Google Search Console: verified property for `https://hokvibe.com/`.
- [ ] GA4: access to the Hokvibe property and a documented measurement ID.

### Runtime and identity

- [ ] Supabase project is active, in the intended United States region, and
      has a documented project reference.
- [ ] Supabase has a dedicated production database or a written isolation plan
      if it is shared. The application tables are `User`, `Account`, `Session`,
      `VerificationToken`, and `SocialPostCreation`.
- [ ] Google Cloud OAuth consent screen is configured for production and the
      exact callback is `https://hokvibe.com/api/auth/callback/google`.
- [ ] `NEXTAUTH_URL` is `https://hokvibe.com` and `NEXTAUTH_SECRET` is a
      production-only secret.

### Revenue and generation

- [ ] Stripe account is live, not test mode, with named Hokvibe credit-pack
      prices. Record price IDs in Vercel, never in the repository.
- [ ] Stripe webhook endpoint is live at `/api/stripe/webhook`, subscribed to
      the exact events implemented by the application, and has a distinct
      production signing secret.
- [ ] MuAPI account has a production API key, scoped and stored only in Vercel
      as `MU_API_KEY`.
- [ ] Production usage limits, failure handling, and credit consumption rules
      are known before customers can pay.

### Email and support

- [ ] Resend verifies `mail.hokvibe.com` in `us-east-1`; public DNS alone is
      insufficient.
- [ ] A least-privilege, domain-scoped Resend sending key is created after
      verification and stored only as Vercel `RESEND_API_KEY`.
- [ ] The from-address, reply-to address, and monitored support destination
      are decided before transactional mail is enabled.

### Agentic operating stack

- [ ] Work from the existing Hokvibe project directory in Codex; do not open a
      new unconnected workspace for production changes.
- [ ] Keep project rules in `AGENTS.md`; use `docs/` for decisions and current
      state. This avoids depending on a long chat surviving a month-long gap.
- [ ] Use Codex `/plan` for investigation before state-changing work and
      `/goal` only for a named, bounded milestone.
- [ ] Enable only the connectors required for the current task: GitHub,
      Vercel, Supabase, and browser access are core. Use Composio only when its
      tested connection supports a required external action.
- [ ] Review Codex `/mcp`, `/plugins`, `/skills`, and `/hooks` before relying
      on any automation. Hooks are for repeatable local checks, not a substitute
      for production review or an unattended deployment mechanism.

## 4. Repository Structure

```text
hokvibe/
  AGENTS.md                     Project rules and non-negotiable constraints
  README.md                     Setup instructions only; no unverified claims
  docs/
    PRODUCTION-ROADMAP.md        This plan
    OPERATIONS-LOG.md            Dated decisions, checks, and next action
    INTEGRATIONS.md              Variable names, owner, scope, validation method
    RELEASE-CHECKLIST.md         Repeatable pre-production and post-production tests
    SEO-STRATEGY.md              Query clusters, briefs, source evidence, results
  prisma/
    schema.prisma                Application data model and migrations
  src/
    app/
      (marketing)/               Landing, pricing, gallery, FAQ, legal, contact
      (app)/studio/              Authenticated generation workspace
      api/auth/                  Google OAuth / NextAuth routes
      api/creations/             Creation submission, status, history
      api/billing/               Checkout session creation
      api/stripe/webhook/        Verified credit grants and idempotency
      robots.txt/ sitemap.xml/   Crawl directives generated from one source
      llms.txt/ index.md/        Machine-readable public documents
    components/                  Reusable interface and accessibility components
    lib/
      auth/                      Session and user identity boundary
      billing/                   Stripe server-only logic
      generation/                MuAPI client, validation, polling, timeouts
      credits/                   Atomic credit balance operations
      seo/                       Metadata, JSON-LD, canonicals, page schema
      analytics/                 Named, consent-aware event definitions
      validation/                Shared request schemas
  public/                        Static public assets only
  tests/
    unit/ integration/ e2e/     Tests isolated by type
```

Do not put service credentials, production exports, screenshots containing
secrets, or generated user content in the repository.

## 5. Launch Features, in Delivery Order

1. **Foundation**: one canonical domain, HTTPS, redirect policy, production
   environment variables, database connectivity, and a passing Vercel build.
2. **Identity**: Google sign-in, safe callback handling, account creation,
   session persistence, sign-out, and clear error states.
3. **Onboarding**: first-login credit grant, one short product walkthrough,
   platform/tone defaults, and a route to Studio.
4. **Studio**: idea input, platform selection, tone, desired output length,
   image-brief toggle, submit state, cancellation, retry, and accessible error
   messaging.
5. **Generation service**: server-side MuAPI requests, validation, polling or
   callback handling, timeouts, rate limits, and saved provenance for every
   result.
6. **Output review**: editable result, copy button, regenerate option, platform
   formatting, image creative brief, and a clear statement that the user must
   review before publishing.
7. **Library**: private history, search/filter, copy, duplicate, delete, and
   a public Gallery containing only deliberately approved examples.
8. **Credits and billing**: transparent credit balance, one generation cost,
   credit-pack selection, Stripe Checkout, signed webhook verification,
   idempotent credit grant, receipt/confirmation state, and refund-safe rules.
9. **Transactional email**: welcome email after verified account creation and
   purchase email only after a verified Stripe webhook grants credits.
10. **Observability**: request IDs, error monitoring, Vercel logs, database
    failure signals, Stripe webhook delivery monitoring, and a weekly metric
    review.

Phase Two candidates are scheduled publishing via approved platform APIs,
content calendar, team seats, and a programmatic content engine. Do not add
them until Phase One has real activation and paid conversion evidence.

## 6. Data and Security Rules

1. Derive the current user from the authenticated server session, never from a
   client-supplied user ID.
2. Debit credits and save a generation in one transaction or otherwise use a
   durable idempotency key. A retry must never charge twice.
3. Verify Stripe signatures before altering a balance. Do not trust browser
   success pages as payment proof.
4. Keep MuAPI, Stripe, Google, Resend, database, and webhook secrets server
   side. Only explicitly public keys may use the `NEXT_PUBLIC_` prefix.
5. Store only the minimum prompt and output needed for history; publish neither
   without the user's deliberate action.
6. Add rate limiting and abuse controls before paid traffic. Log failures with
   a request ID, not secrets or raw credentials.
7. Maintain a deletion path for user data and a backup/recovery procedure for
   the production database.

## 7. SEO, AEO, and GEO Program

SEO, AEO, and GEO are distribution infrastructure, not a substitute for a
useful product. No credible process can promise a ranking or an AI-answer
citation. The goal is to make accurate, original, useful Hokvibe material easy
for people and crawlers to find, understand, and cite.

### Technical baseline

- [ ] One canonical URL per indexable page, consistent `www` redirect, HTTPS,
      200 responses, and no accidental `noindex`.
- [ ] Unique title, meta description, H1, and social preview image per public
      page. Do not manufacture metadata from keyword lists.
- [ ] Valid `Organization`, `SoftwareApplication`, `WebSite`, and relevant
      `FAQPage` JSON-LD only where visible page content supports it.
- [ ] Accurate `robots.txt`, XML sitemap, `llms.txt`, and Markdown alternate
      endpoints. Keep these documents descriptive; they do not guarantee AI
      crawler inclusion or rankings.
- [ ] Search Console and GA4 are verified, linked in the operating log, and
      monitored for indexing, query impressions, activation, and checkout
      conversion.

### Content system

1. Build a keyword map from Search Console queries, GA4 landing-page outcomes,
   customer language, and current search results. Never rely on model-memory
   keywords alone.
2. Prioritize buyer-intent clusters: `linkedin post generator for founders`,
   `turn product update into social posts`, `social content workflow for solo
   founders`, and comparison/problem pages only after validating the exact
   query and intent.
3. Create one evidence-backed page per real question. Each brief records:
   audience, query, intent, answer, original example, source links, author,
   CTA, internal links, and the conversion event to measure.
4. Prefer worked examples, templates, measured customer outcomes, and product
   walkthroughs over high-volume generic AI content. Edit every published page
   for factual accuracy and a distinct point of view.
5. Review performance monthly. Keep, improve, consolidate, or remove pages
   based on impressions, qualified visits, activation, and revenue rather than
   word count or publication volume.

## 8. Distribution System

The current solo-founder signal is consistent: narrow offers and a durable
distribution habit outperform a broad feature catalog and founder-to-founder
content. Hokvibe's initial loop is therefore:

1. Publish a genuine founder workflow or useful social-post transformation.
2. Turn it into an example page on Hokvibe with the input, output, and
   constraints disclosed.
3. Share the useful insight where solo founders and small brands already work,
   directing readers to one relevant product action.
4. Capture the source, landing page, activation, and purchase outcome.
5. Improve the workflow and the underlying product from observed friction.

Do not use fabricated revenue claims, synthetic testimonials, fake case
studies, or bulk AI pages designed only to manipulate rankings.

## 9. Release Gates

A release is complete only when all applicable checks pass:

- [ ] Pull request reviewed and merged to `main`; production deployment maps
      to that exact commit.
- [ ] Vercel build is successful and production logs have no startup/runtime
      configuration failures.
- [ ] Browser test covers public routes, Google sign-in, Studio generation,
      credit balance, Checkout initiation, and logged-in history.
- [ ] Stripe test/live verification matches the intended environment and a
      webhook delivery is signature-verified and idempotent.
- [ ] Error states are readable and do not expose secrets.
- [ ] Mobile and desktop layouts are checked for the landing page, Studio,
      pricing, and authentication.
- [ ] Crawl files, canonical tags, schema, and response headers are checked
      against the production domain.
- [ ] A dated operations-log entry names the deployed commit, verifier,
      test evidence, known limitations, and next action.

## 10. Operating Cadence

- **Each work session:** read this roadmap, the newest operations-log entry,
  GitHub status, Vercel deployment state, and the current user request before
  changing anything.
- **Weekly:** inspect errors, sign-in success, generation success, credit
  failures, checkout completion, Search Console coverage, and GA4 activation.
- **Monthly:** update the query map, remove weak content, review provider
  costs, rotate/revoke unused keys, test restore/runbook steps, and choose one
  product improvement from real user evidence.
- **Before any production-side change:** name the exact resource, action,
  rollback path, and verification check. Ask only when a credential, account
  permission, or business decision is truly required.

## 11. Next Actions

1. Reconcile the production baseline directly in GitHub and Vercel, including
   the reported commit, active deployment, domains, and public routes.
2. Verify Resend's provider-side status for `mail.hokvibe.com`. Do not create a
   broad sending key while its domain-scoped option is unavailable.
3. Produce a redacted Vercel variable inventory: variable name, environment,
   owner, and validation method, with no values displayed.
4. Run the authenticated end-to-end release-gate test. Record actual failures
   before changing product code or marketing copy.
5. Create `OPERATIONS-LOG.md`, `INTEGRATIONS.md`, `RELEASE-CHECKLIST.md`, and
   `SEO-STRATEGY.md` from verified live evidence, then implement the first
   failed gate in a focused pull request.
