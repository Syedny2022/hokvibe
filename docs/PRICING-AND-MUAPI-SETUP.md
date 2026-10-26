# Hokvibe Pricing And MuAPI Setup

**Research date:** 2026-10-25  
**Scope:** Research and pricing design only. No MuAPI, Vercel, Stripe, database, or application configuration was changed.

## Decision Summary

Launch Hokvibe's text-only social engine around a **generation pack**: one source input transformed into six platform-specific drafts (LinkedIn, X/Twitter, Facebook, Instagram, Reddit, and LINE). MuAPI's current text route supports this economically at a $0.06 direct-model baseline per six independently generated drafts. Do not include image or video generations in subscription allowances until they have their own priced add-on budget.

Recommended launch pricing:

| Plan | Monthly price | Included generation packs | Direct text-model allowance cost | Position |
| --- | ---: | ---: | ---: | --- |
| Free | $0 | 10 | $0.60 | Product evaluation only |
| Solo | $29 | 150 | $9.00 | Active individual builder |
| Scale | $79 | 500 | $30.00 | Heavy use and multiple brands |

The table uses the current $0.01-per-text-generation rate and assumes six separate text calls per pack. At full allowance use, direct model gross margin before payment fees, infrastructure, support, taxes, and abuse is approximately 69% for Solo and 62% for Scale. This is a planning baseline, not a promise that MuAPI pricing will remain unchanged.

## Evidence Collected

### Current MuAPI account observations

- The authenticated MuAPI dashboard records completed `any-llm` requests at **$0.01 per request**. The recent usage view showed nine requests for $0.09, consistent with this rate.
- MuAPI's public `Any LLM` model page states **$0.01 per generation** and presents it as a per-generation product, not token-metered billing.
- The deployed Hokvibe source selects `google/gemini-2.5-flash` with `reasoning: false` and `priority: throughput` for the Any LLM endpoint.
- MuAPI's API reference lists `google/gemini-2.5-flash` as the default model. It says certain named premium models are charged at **10x** the standard rate; do not substitute one of those models into the text engine without recalculating plan economics.
- MuAPI retains displayed generation outputs for 30 days. Hokvibe must persist the customer-approved draft in its own database when it needs longer-term workspace history.
- The Access Keys page showed **no active keys** at the time of this review. This report does not infer whether a separately stored legacy key still works; production setup must create and verify a dedicated key.

### Metering Model

| Work unit | MuAPI route/model | Current basis | Baseline direct cost |
| --- | --- | --- | ---: |
| One text draft | `POST /api/v1/any-llm-models`, standard Any LLM / Gemini Flash | Per generation | $0.01 |
| One six-platform pack | Six independent standard text generations | 6 x $0.01 | $0.06 |
| One image generation | Model-specific | Per generation | Variable; examples range from $0.003 Flux Schnell to $0.15 GPT Image 2.5 |
| One video generation | Model-specific | Per generation or per second | Variable; not safe for an included text-plan allowance |

The $0.06 pack calculation is exact **only** when Hokvibe submits six completed standard Any LLM jobs. If the product uses one successful LLM call to return all six drafts, the direct cost is $0.01; if it retries, uses a premium model, or adds media, cost increases. Billing should record the completed model and observed provider charge for every batch before any final entitlement policy is enabled.

## Recommended Product Meter

### Definition

One **generation pack** equals one explicit customer request that produces up to six text drafts from a single source input. Editing, copying, viewing history, connecting an account, and publishing should not consume a generation pack.

Charge only once a MuAPI request completes. Use one internal request key per pack so an accidental browser retry cannot create multiple paid jobs. A failed or unknown provider state should never be automatically retried; it needs a visible customer action.

### Plan Protections

| Plan | Protection | Why it exists |
| --- | --- | --- |
| Free | 10 packs/month; no rollover; one active generation at a time; standard text model only | Caps the direct API exposure at $0.60 per active account per month |
| Solo | 150 packs/month; no rollover; two active generations at a time; standard text model only | Supports regular distribution without allowing unbounded automated bulk generation |
| Scale | 500 packs/month; no rollover; five active generations at a time; standard text model only | Supports multiple brands while retaining a direct-model margin buffer |

Apply a server-side monthly allowance, a per-user concurrency limit, input-length and output-token caps, and request idempotency. Never use the client's reported plan, price, customer ID, or generation count as the authorization source.

### Add-ons And Exclusions

- Image, video, music, upscaling, and other media models are excluded from the three text plans.
- Add those later as separately priced credit packs based on the specific MuAPI model price plus a margin buffer. For example, a $0.15 image model cannot be safely treated as a $0.01 text draft.
- Publishing is not a model-cost unit. Keep it separate from generation allowances and do not use it to justify plan usage without measuring provider cost and support burden.

## MuAPI Production Setup Checklist

Complete these items in MuAPI before enabling Hokvibe billing. This is a configuration checklist, not evidence that the items have been completed.

1. In **Access Keys**, create one named production key, such as `hokvibe-production`. Do not select the sandbox/mock-data key option.
2. Save the secret only in Hokvibe's server-side production environment. Do not place it in browser code, a client-exposed environment variable, Git, screenshots, or customer settings.
3. If MuAPI's key interface supports an IP allowlist, use it only with stable Vercel egress IPs. Do not enable an allowlist with dynamic serverless egress because it can break production calls.
4. Set a low-balance operating threshold and a monthly budget alert in MuAPI if the current billing interface offers them. Assign an owner and a funding procedure before launch.
5. Use the standard `any-llm` route with `google/gemini-2.5-flash`, `reasoning: false`, `priority: throughput`, and a bounded `max_tokens` value appropriate to the plan. Start with 700 output tokens per individual draft and measure actual quality and spend.
6. Do not select a premium model until its charge multiplier, output quality, latency, and completed-request cost have been recorded in a controlled test. MuAPI documents a 10x rate for certain premium choices.
7. Keep the submit-and-poll lifecycle: submit `POST /api/v1/any-llm-models`, store the returned request ID against the authenticated Hokvibe tenant, then poll the prediction result. The reviewed Any LLM documentation did not establish a MuAPI webhook requirement for text generation.
8. Persist Hokvibe's approved drafts and publication state in Hokvibe's database; do not depend on MuAPI's 30-day output history as the customer workspace.
9. Review the MuAPI usage page weekly during beta: completed request count, per-request cost, failed requests, model mix, wallet balance, and any unexpected premium-model use.
10. Rotate the production key on suspected exposure. Create a replacement, update the server secret, verify a controlled generation, then revoke the old key after verification.

## Operational Acceptance Before Stripe Is Enabled

1. Run 20 controlled standard-text packs and record the provider cost for each completed request.
2. Confirm a six-draft pack costs $0.06 in the MuAPI usage ledger, or revise the meter if the final engine makes fewer or more provider calls.
3. Test input length, timeout, provider failure, duplicate submit, and low-balance behavior without customer billing enabled.
4. Confirm no output, prompt, or provider secret is exposed in browser logs, analytics, or public error responses.
5. Set the final monthly allowances only after the observed 95th-percentile cost and failure rate preserve the desired gross margin.

## Sources

- [MuAPI dashboard](https://muapi.ai/dashboard) — authenticated usage observations and 30-day output retention notice.
- [MuAPI Any LLM model page](https://muapi.ai/playground/any-llm) — $0.01 per-generation model pricing.
- [MuAPI Any LLM API reference](https://muapi.ai/playground/any-llm/api) — endpoint, default model, model choices, submit-and-poll lifecycle, and premium-model pricing note.
- [MuAPI pricing comparison](https://muapi.ai/pricing) — model-specific media prices.
- [MuAPI Access Keys](https://muapi.ai/access-keys) — production versus sandbox key controls and optional key management surfaces.
