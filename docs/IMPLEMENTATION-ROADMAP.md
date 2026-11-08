# ReeferDude Implementation Roadmap

This roadmap turns the three source specifications into a staged build for a two-person team starting with no software budget. Preserve both existing repositories and prove one working loop before adding expensive infrastructure.

## Phase 0 — Baseline and protect existing work

- Inventory ReeferDude and PotGrowHubstore repositories.
- Record branch, deployment target, domain mapping and existing routes.
- Run install, lint, typecheck and production build; capture failures before changes.
- Verify live pages and public metadata files.
- Identify working pages, scripts, age gate, consent UI, analytics and forms.
- Create backup/tag and feature branch before implementation.
- Reconcile brand names, canonical URLs, age rules and claims across both repositories.

**Acceptance:** reproducible local setup, baseline test/build report, route inventory and no lost content.

## Phase 1 — GanjaGuru concierge (first real product)

- Keep the local knowledge base as an offline fallback.
- Add a server-side AI gateway; never expose provider keys in browser code.
- Add /api/health, /api/ready and a validated chat endpoint.
- Stream responses to the existing chat UI.
- Preserve history, clear-chat, voice input and TTS.
- Add request IDs, timeouts, rate limits, safe errors and usage logging.
- Route intents to Knowledge, Grow Lab, Blueprint, Studio and Marketplace.
- Use source-grounded retrieval and show uncertainty.
- Require approval before external actions.

**Acceptance:** no API key means local expert mode still works; valid server key means cloud AI responds; API offline means the UI explains and falls back cleanly. No key appears in browser bundles or Git history.

## Phase 2 — Command Deck and module navigation

- Consolidate global navigation and route names.
- Add Cosmic Void and GanjaGoddess anchor.
- Add accessible orbital navigation with keyboard/mobile alternatives.
- Implement module states and deep links.
- Add saved-project/User Vault foundations.
- Respect reduced motion and provide a static mode.
- Keep existing content pages reachable.

**Acceptance:** every visible control works; direct links and browser back/forward work; mobile and keyboard journeys are usable.

## Phase 3 — Knowledge Hub and useful tools

- Organize guides/references with sources and update dates.
- Audit strain data and remove unsupported medical claims.
- Improve calculators and save/load workflows.
- Add search across guides, tools and catalog.
- Add user feedback and correction workflow.

**Acceptance:** every published reference has provenance; tools validate inputs; estimates are labeled.

## Phase 4 — Blueprint Engine

- Guided intake: purpose, dimensions, constraints, budget and jurisdiction.
- Generate requirements, floor-plan concepts, bill of materials and estimate ranges.
- Export PDF/JSON and save to User Vault.
- Link only to verified offers.
- Flag electrical, structural, fire and plumbing work for qualified review.

**Acceptance:** repeatable plans, editable saved projects, traceable assumptions and no invented supplier prices.

## Phase 5 — Dream-It Studio

- Begin with one or two lawful, non-controlled templates.
- Add 3D preview, dimensions, materials and configuration validation.
- Add 2D decals with Fabric.js.
- Save/load design versions.
- Add STL/3MF export only after geometry validation.
- Add quote request and manual manufacturing handoff.
- Add AR after capability and permission UX are tested.

**Acceptance:** user can create, save, reopen and export a valid supported design; unsupported configurations are blocked or labeled.

## Phase 6 — Marketplace and supplier network

- Start with a small curated catalog.
- Store supplier identity, product data, source URL, price/stock timestamps and shipping terms.
- Verify environmental claims with evidence.
- Start with disclosed affiliate links or quote requests.
- Add supplier APIs only after contracts and sandbox tests.
- Add order status and refund/support workflows before checkout.

**Acceptance:** stale offers are not shown as live; paid placements are disclosed; each product has a real seller and destination.

## Phase 7 — Accounts, community and loyalty

- Secure accounts/sessions and role-based permissions.
- Saved projects, guides, designs and preferences.
- Community profiles, moderation and reporting.
- XP and non-transferable points ledger with published terms.
- Email capture with explicit consent and unsubscribe.
- Memberships only when recurring value and cancellation work.

**Acceptance:** user data is isolated; rewards are auditable; consent and opt-out are honored.

## Phase 8 — Logistics, IoT and advanced automation

- Parcel tracking for eligible goods.
- Supplier/fulfillment webhooks with signature validation.
- IoT read-only telemetry first; write controls later with safeguards.
- Optional rideshare/consultation routing through approved providers.
- Background jobs, retries, idempotency and audit trails.
- Human confirmation for purchases, payments, publication and dispatch.

**Acceptance:** failures are recoverable and traceable; regulated services remain disabled without verified legal/provider approvals.

## Phase 9 — Spatial expansion and optimization

- Physics-based floating islands and smoke-formed navigation.
- Advanced shaders, particles and progressive LOD.
- Cross-device project continuity.
- VR design lab and multi-user sessions.
- Performance budgets, adaptive resolution and battery-aware rendering.
- SEO/AEO and conversion optimization from actual data.

**Acceptance:** spatial effects are optional; reduced-motion users have an equivalent experience; mobile remains usable; performance is measured.

## First 14-day work plan

**Days 1–2: baseline**
- Clone/pull both repos locally.
- Confirm Node/npm versions.
- Run current verification scripts.
- Record broken routes/assets and console/network errors.
- Confirm which repository deploys to which domain.

**Days 3–5: API foundation**
- Add server-side API boundary.
- Add health/readiness endpoints and request validation.
- Add environment examples without credentials.
- Add safe logging, request IDs and rate limits.
- Add local mock provider for repeatable tests.

**Days 6–9: GanjaGuru**
- Connect existing chat UI to API.
- Stream assistant responses.
- Preserve local fallback, history, clear-chat, voice input and TTS.
- Classify server offline, missing/invalid key, rate limit and provider outage.

**Days 10–12: test and harden**
- Unit tests for validation/routing.
- API tests for health/chat/failures.
- Browser tests for send/history/clear/fallback.
- Verify secrets are absent from frontend bundles and commits.
- Test mobile, keyboard and reduced motion.

**Days 13–14: release candidate**
- Update README/setup instructions.
- Run full verification.
- Review production configuration.
- Deploy only after build and smoke tests pass.
- Measure the first user journey and capture issues.

## First milestone

A dependable ReeferDude portal with existing pages preserved; Cosmic Void/Command Deck entry; GanjaGuru chat with real server-side AI when configured; local fallback; streaming and voice where supported; saved history; health diagnostics; and clear boundaries between live and planned capabilities.

## Team rhythm

- One person owns product, content, supplier research, partner outreach and compliance coordination.
- One person owns architecture, implementation, testing, deployment and security.
- Both review public claims, payments, supplier commitments and production releases.
- Work in small pull requests; keep a changelog and decision log.
- Never put API keys, private tokens, customer identity documents or production secrets in Git.

## Budget rule

Use local tools and existing accounts first. Do not add paid APIs, databases, AI, automation, hosting, ad networks or supplier services until the feature has a measurable reason to exist and provider pricing/terms have been reviewed.
