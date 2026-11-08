# ReeferDude — Unified Ecosystem Master Specification

**Flagship:** ReeferDude  
**Commerce and content:** PotGrowHub  
**Conversational intelligence:** GanjaGuru / GanjaGoddessAI  
**Integration layer:** The Socket  
**Constraints:** two-person founding team, $0 initial software budget, preserve existing repositories.

## 1. The unified vision

ReeferDude is an AI-guided ecosystem for adult cannabis culture, hemp, education, design, planning and lawful commerce. It connects discovery, learning, project planning, product creation, supplier research and eligible fulfillment through one conversational intelligence layer.

The north-star journey is:

**Intent → Understand → Plan → Design → Source → Create → Purchase or Publish → Fulfill → Track → Learn**

It is not merely a store, chatbot, blog or 3D demo. The user describes an outcome; the platform coordinates the tools and modules needed to make progress toward it. If a capability is not connected, the interface must say so and offer a saved draft, quote request, waitlist or educational alternative. It must never fake inventory, prices, supplier verification, delivery or completed transactions.

## 2. Brand architecture

| Name | Responsibility |
|---|---|
| ReeferDude | Flagship brand, Cosmic Void, Command Deck and user experience |
| PotGrowHub | Storefront/content ecosystem, catalog, product discovery and grow resources |
| GanjaGuru | Central AI concierge, intent engine, task planning and orchestration |
| GanjaGoddessAI | Central avatar, voice presentation, onboarding and system narration |
| The Socket | Permissioned integrations, workflows, events and external service handoffs |
| Dream-It Studio | 2D/3D design, configuration, product previews and manufacturing handoff |
| Grow Lab | Educational calculators, grow planning and permitted sensor telemetry |
| Blueprint Engine | Requirements, layouts, equipment maps, bills of materials and estimates |
| Knowledge Hub | Evidence-led guides, strain/terpene references, business and sustainability education |
| Marketplace Galaxy | Product catalog, comparisons, creator products and verified external offers |
| KushCoin / Budz | Auditable XP, loyalty points, achievements and transparent redemption rules |

The existing GitHub repository reeferguyai/Reeferdude is the flagship starting point. The existing reeferguyai/Potgrowhubstore repository remains the related commerce/content project. Preserve both; do not discard existing pages or perform a big-bang rewrite.

## 3. Experience and interface

### Cosmic Void and GanjaGoddess

Use an obsidian-black environment, emerald/cannabis greens, earth browns, purple, amber and gold, silver highlights, layered shadows, drifting particles and restrained smoke effects. The Goddess is the visual anchor. Smoke can form navigation nodes, but every action must also exist as a semantic, keyboard-accessible control.

### Command Deck

Persistent gateways: Home, Marketplace, GanjaGuru, Design Studio, Grow Lab, Blueprint Engine, Knowledge Hub, Community, Consultation, Account/User Vault, Favorites, Notifications, Cart and Settings. Cart, notifications and account features must show truthful states and only be enabled when their underlying services work.

### Interaction

Support text, voice input, optional speech output, supported image/document uploads, keyboard, pointer, touch, drag and gestures. Include chat history, clear-chat, saved projects and user-controlled memory. Voice and file permissions must be explicit and visible.

### Spatial motion and responsive behavior

The long-term engine may use Three.js, simplex/Perlin-style drift, spring-damper motion, cursor/touch attraction, collision avoidance, camera interpolation and progressive level of detail. Motion is progressive enhancement, never a requirement. Respect prefers-reduced-motion, provide a static mode, avoid disorienting camera sweeps and keep focus order stable.

- Desktop: full orbital layout and optional 3D scene.
- Tablet: simplified orbit and hybrid DOM/WebGL layout.
- Mobile: stacked cards and thumb-reachable bottom navigation.
- XR: optional capability-detected WebXR; never block the standard web journey.

Target WCAG 2.2 AA. Provide semantic HTML, keyboard operation, visible focus, screen-reader labels, status announcements, contrast, scalable text, captions/transcripts and reduced motion. Treat the source documents' sub-180 KB initial JavaScript and 60 FPS desktop / adaptive 30–60 FPS mobile figures as targets to measure, not promises. Defer 3D, XR, large textures and nonessential scripts until requested.

## 4. GanjaGuru intelligence system

GanjaGuru is one conversational orchestrator with specialist capabilities behind it, not a collection of disconnected bots:

- Budtender: educational product/strain information and catalog matching.
- Grow Master: jurisdiction-aware cultivation education and telemetry interpretation.
- Design AI: product ideation, configuration and visual critique.
- Hustle AI: business planning, content, marketing and monetization analysis.
- Knowledge AI: source-grounded research and myth checking.
- Procurement AI: supplier discovery and quote comparison.
- Logistics AI: eligible shipping/ride coordination through approved partners only.

### Request lifecycle

1. Accept text, voice transcript, image or document.
2. Detect intent and the requested outcome.
3. Check age/jurisdiction and permissions where relevant.
4. Retrieve current approved knowledge and connected records.
5. Prepare a plan and identify required tools.
6. Ask approval before consequential actions.
7. Execute only authorized and available tools.
8. Validate results and label uncertainty and data freshness.
9. Return a readable response and next action.
10. Save only permitted conversation/project memory.

### AI gateway and memory

Use a provider-independent server-side adapter. Never expose API keys in browser code. Support cloud AI, an optional local model adapter, and the existing deterministic knowledge fallback.

The existing local knowledge bot remains available without a paid key. Cloud AI is an enhancement. Offline mode may provide cached knowledge, saved plans and drafts, but must not claim cloud AI, live inventory or checkout is available.

The gateway needs streaming, timeouts, request IDs, rate limits, structured tool requests, usage logging and safe fallback responses.

Separate current conversation context, saved history, user-approved preferences, project/design history and knowledge retrieval. Make memory transparent and user-controlled. Do not infer sensitive personal characteristics or use behavioral profiling to manipulate purchases.

## 5. Product modules

### Marketplace Galaxy

Categories: glass/accessories, apparel and creator collections, grow gear, hemp products/packaging, eco home goods, digital downloads, guides, templates, courses, AI-generated and creator-exclusive products.

Every offer needs a real title, seller, price/currency, availability timestamp, shipping expectation, specifications, returns/support details and a working destination. Sustainability claims need evidence and a review date. Start with curated affiliate/external offers or quote requests; direct checkout and procurement automation come later.

### Dream-It Studio / 3DPoD + PoD

Configurable templates, 2D decals, 3D previews, dimensions, materials, compatibility checks, saved versions, validated STL/3MF export, quote requests, manufacturing handoff, optional AR preview and VR review. Start with one or two lawful, non-controlled accessory/novelty templates. Never claim printability, material safety or food-contact suitability without validated specifications.

### Grow Lab

Room/equipment planner, lighting/ventilation/water/budget calculators, environmental dashboard, grow logs, tasks, educational troubleshooting and eventually secured IoT telemetry. Tools are educational, jurisdiction-aware and do not guarantee yield, safety or legal permission.

### Blueprint Engine

Inputs: project type, dimensions, goals, constraints, budget and jurisdiction when relevant. Outputs: requirements, layout, equipment map, bill of materials, cost ranges, energy considerations, supplier options and downloadable plans. Clearly distinguish estimates from quotes. Flag electrical, structural, fire, plumbing and other safety-critical work for qualified review.

### Knowledge Hub

Topics: strains, terpenes, cannabinoids, cultivation, business, equipment, genetics, sustainability, extraction education and compliance. Every reference needs sources, author/reviewer, update date and jurisdiction where relevant. Strain matching is educational preference discovery, not medical diagnosis or treatment advice.

### Community and User Vault

Profiles, creator pages, saved guides/designs/blueprints, project sharing with privacy controls, moderated discussions, challenges, order history when real commerce exists, XP and an auditable rewards ledger.

### Logistics

Start with ordinary lawful merchandise parcel shipping and manual partner handoffs. Regulated cannabis delivery requires licensed operators, jurisdiction-specific authorization, age/identity controls and legal review. A generic rideshare integration does not make regulated delivery lawful.

## 6. The Socket

The Socket is a permissioned workflow layer, not an unrestricted autonomous agent. It needs a connector registry, health status, typed contracts, validated payloads, event/job handling, idempotency keys, audit logs, approval gates, retries/backoff, dead-letter handling, supplier/price freshness checks and webhook signature verification.

Initial automation is assistive: gather, compare, draft, calculate and prepare. Users authorize money movement, order placement, publication, messages and other irreversible actions.

## 7. Commerce and monetization

Potential channels: affiliate commissions; digital guides/templates/blueprints; consultations and project assessments; memberships; 3DPoD/PoD commissions; creator marketplace fees; eligible physical-goods margin; clearly labeled sponsorships/advertising; business services and lead generation.

Launch order: useful free tools/content → permissioned leads/consultations → verified affiliate offers → digital products → memberships → creator/print fulfillment → deeper commerce automation.

Do not launch pay-per-click/time gimmicks, opaque dynamic pricing, fake scarcity, undisclosed affiliates or unreviewed header bidding. Measure real unit economics.

KushCoin/Budz starts as non-transferable XP/loyalty points with a clear ledger. Publish earning, expiry, redemption, refund reversal and abuse rules. Do not describe points as cash, investment, cryptocurrency or a financial asset without separate review.

## 8. Technical architecture

### Incremental strategy

The existing ReeferDude site is a Vite/static HTML-CSS-JavaScript project with a local knowledge-base budtender, Strain Lab, Grow Studio and chat/voice UI. Preserve these working surfaces. Add a modular server/API and introduce typed feature modules progressively. Use React/TypeScript for new complex modules only where useful; existing public pages remain functional during migration.

### Coherent stack

| Layer | Choice |
|---|---|
| Public frontend | Existing HTML/CSS/JavaScript + Vite |
| New complex UI | React + TypeScript, incrementally |
| Styling | Existing CSS tokens; Tailwind only where already configured/needed |
| Motion | CSS first; GSAP for advanced transitions |
| 3D / 2D | Three.js; Fabric.js for decals |
| Backend | Node.js 20+ and modular Express API |
| Validation | Zod |
| Local database | SQLite through Prisma |
| Production database | PostgreSQL through Prisma |
| Search | PostgreSQL full-text initially |
| Offline | PWA, Service Worker and IndexedDB |
| Realtime | REST first; SSE/WebSocket for streaming and live events |
| AI | Provider adapter; server-side credentials; optional local adapter |
| Testing | Vitest and Playwright |
| Deployment | Provider-neutral static frontend plus API server |

The source files propose competing MongoDB, Firebase, Supabase, PostgreSQL, Next.js and microservice stacks. Choose one path: Prisma with local SQLite and PostgreSQL as the production target. Avoid Redis, Docker, Kubernetes, microservices or vector databases until a measured requirement justifies them.

### Runtime boundaries

Public web app; API server; later background worker; database/migrations; shared contracts; AI gateway/retrieval; commerce/supplier adapters; XR/design assets; admin/moderation; analytics/audit.

### Data domains

Users/sessions/roles/consent; minimal age/jurisdiction verification status; conversations/messages/opt-in memory; knowledge/citations; strains/terpenes; products/categories/suppliers/sustainability evidence; offers/prices/availability snapshots; designs/assets/materials/exports; blueprints/requirements/estimates; carts/orders/payment references/fulfillment events; loyalty ledger/XP; consultations/leads/communications consent; audit/security/analytics events.

Use ownership checks, least privilege, encrypted secrets, secure sessions, rate limits, CSRF protection where applicable, validation, output encoding, webhook verification, backups and retention rules.

## 9. Trust, legal and safety

The source materials conflict on age (18+ in some places, 21+ in others) and sometimes suggest responsibility can be shifted entirely to the customer. That is not a safe operating assumption.

Before enabling a feature, define product category, target jurisdictions, age threshold, operator obligations, supplier eligibility, advertising restrictions, payment-provider rules and shipping restrictions. Use configurable jurisdiction policies, not a universal age claim. Obtain legal review before regulated commerce or delivery.

Initial commercial boundary: education, design tools, digital products, hemp/ordinary accessories and verified lawful goods; no direct cannabis flower sales. This preserves the current repository's stated no-flower-sales boundary.

Additional rules:
- No medical diagnosis or treatment claims.
- No legal conclusions from AI.
- No fake inventory, prices, certifications, reviews or shipping estimates.
- No identity-document collection unless a verified provider and lawful need require it.
- Explicit consent for email/SMS, analytics and optional memory.
- Clear affiliate, advertising, sponsored-content and seller disclosures.
- Human approval for money movement and irreversible actions.
- Moderation, abuse reporting, privacy controls and security disclosure route.

## 10. SEO, AEO and discoverability

Build discoverability around useful, indexable content, not metadata volume: one canonical domain; crawlable HTML and real links; accurate titles/descriptions/canonicals/sitemap; valid structured data matching visible content; robots.txt, llms.txt and security.txt where useful; original sourced guides, comparisons and calculators; author/reviewer and update dates; affiliate disclosures; Search Console and analytics verification.

Track query → landing page → tool use → offer click → lead/order. Do not promise search dominance, indexing, rankings or AI citations. Do not generate fake backlinks or mass low-value pages.

## 11. Operating constraints and success measures

Starting constraints: two people, $0 software budget, existing public repositories and Windows/PowerShell local development. Use free local tools first. External providers, payments, verification, email/SMS, supplier APIs, maps and hosting may add costs or require approval; do not activate them until pricing and terms are known.

Measure page/route health; AI success/latency/fallback/user feedback; guide and calculator completion; saved projects and blueprint exports; qualified leads and bookings; verified affiliate clicks/commissions; offer freshness; supplier response; conversion/repeat use; accessibility, performance, security and error rates.

Revenue is a goal, not a guarantee. The first proof is one trustworthy, measurable user journey.

## 12. Definition of done

A feature is complete only when users can discover it; the workflow succeeds with real data; empty/offline/denied/error states work; server-side permissions and validation exist; actions are auditable where appropriate; accessibility/mobile are tested; documentation and automated checks exist; and public copy accurately describes what is live.

**Guiding principle:** The interface can feel like a living universe. The underlying business must be transparent, testable, permissioned and dependable.
