# Release Evidence

## Local evidence

- `npm run build` must pass before this release is merged or deployed.
- Prisma schema formatting and client generation must pass without applying a database migration.

## External evidence required after deployment

- Confirm Vercel production deployment commit matches GitHub `main`.
- Request public pages, `robots.txt`, `sitemap.xml`, `llms.txt`, and representative blog pages from `https://hokvibe.com`.
- Provider-dependent behavior remains unverified until its database migration and provider configuration are approved and tested.
