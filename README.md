<a id="top"></a>

<div align="center">

# 🌿 ReeferDude

**A learning-first hemp and cannabis-culture platform, supported by clear brand systems, useful digital tools, and trust-focused operations.**

[![Website](https://img.shields.io/badge/Website-reeferdude.com-00C853?style=for-the-badge&logo=googlechrome&logoColor=white)](https://reeferdude.com/)
[![Repository](https://img.shields.io/badge/GitHub-ReeferDude-24292F?style=for-the-badge&logo=github&logoColor=white)](https://github.com/reeferguyai/Reeferdude)
[![Platform](https://img.shields.io/badge/Platform-Vite%20%7C%20React-646CFF?style=for-the-badge&logo=vite&logoColor=white)](package.json)

[Overview](#overview) · [Capabilities](#strategic-pillars) · [Local development](#local-development) · [Manifests](#system-manifests) · [Contributing](#contributing)

</div>

---

## Overview

ReeferDude is a digital ecosystem combining brand architecture, educational resources, search and AI discoverability, commerce-oriented experiences, and founder-led operations. This repository contains the website and its supporting content, metadata, and platform assets.

The project is organized around ownership, trust, systems architecture, digital identity, and responsible visibility across search, AI, and commerce ecosystems. The live website is [reeferdude.com](https://reeferdude.com/).

> **Audience and compliance:** The site covers hemp and cannabis culture. Visitors and contributors are responsible for following applicable age requirements and local laws. Website content is informational and is not legal or medical advice.

## Strategic pillars

- **Intelligent brand architecture** — consistent positioning, identity, and digital presentation.
- **Trust and compliance** — transparent disclosures, security reporting, and documented operating practices.
- **Search and AI visibility** — structured content and discoverability for people, search engines, and answer-oriented systems.
- **Marketplace readiness** — commerce-oriented information and paths designed to support clarity and trust.
- **Co-owned innovation** — collaborative leadership and operational clarity.

## Platform architecture

The project uses a Vite-based web toolchain with React. It brings together the public website, supporting page/content directories, shared frontend assets, and root-level discovery and disclosure files. The repository also contains supporting Python requirements for optional data and service workflows; those packages are not needed to run the frontend locally.

### Operating principles

| Area | Intent |
| :--- | :--- |
| Strategy | Purpose-driven growth and clear positioning |
| Security | Trust-centered systems and responsible disclosure |
| Visibility | Search and AI discoverability |
| Systems | Operational clarity and maintainable workflows |
| Collaboration | Shared leadership and co-owned execution |
| Optimization | Measured, iterative digital performance |

## Local development

### Prerequisites

- Node.js **20 or newer**
- npm **10 or newer**
- Git

The supported runtime versions are also declared in [`package.json`](package.json).

### Install and run

```bash
git clone https://github.com/reeferguyai/Reeferdude.git
cd Reeferdude
npm install
npm run dev
```

Vite prints the local development URL in the terminal when the server starts. Open that URL in a browser. Use `Ctrl+C` to stop the server.

### Useful commands

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Start the local Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally after building |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run the TypeScript checks configured by the project |
| `npm run verify` | Run lint, type checks, and the production build |

Before submitting a change, run:

```bash
npm run verify
```

### Configuration and secrets

The repository's frontend setup is defined in `package.json` and the Vite configuration. If a feature you are working on needs an external service or credentials, follow that service's setup instructions and use local environment configuration where supported. **Never commit credentials, private keys, or production secrets.** No environment-variable template is documented here, so check the relevant feature's existing code and documentation before adding configuration.

## Repository guide

This is a content-rich site with many top-level directories, generally grouped by page or feature. Common areas include:

- `app/`, `api/`, and `services/` — application and service-related code.
- `shop/`, `marketplace/`, and `product-*` — commerce and product experiences.
- `ai-budtender/`, `strain-*`, `grow-*`, and `terpene-*` — discovery, education, and interactive content areas.
- `data/` — datasets and their accompanying notes; see [`data/README.md`](data/README.md).
- Root-level HTML, CSS, JavaScript, and configuration files — shared site entry points and assets.
- Root-level text, JSON, and XML files — search, AI discovery, seller, and security manifests.

Use the repository's directory and filenames as the source of truth; this overview is intentionally selective rather than a complete file inventory.

## System manifests and documentation

These files support site discovery, advertising/seller transparency, and security reporting:

| Resource | Purpose |
| :--- | :--- |
| [`ads.txt`](ads.txt) | Authorized digital sellers declaration |
| [`seller.json`](seller.json) | Seller identity information |
| [`.well-known/security.txt`](.well-known/security.txt) | Security contact and disclosure information (RFC 9116 format) |
| [`llms.txt`](llms.txt) and [`llms-full.txt`](llms-full.txt) | Structured summaries for AI systems and crawlers |
| [`SEO.md`](SEO.md), [`SEO.txt`](SEO.txt) | Search-engine discovery information |
| [`Aeo.md`](Aeo.md), [`AEO.txt`](AEO.txt) | Answer-engine visibility and entity information |
| [`robots.txt`](robots.txt), [`sitemap.xml`](sitemap.xml) | Crawler guidance and URL discovery |
| [`humans.txt`](humans.txt), [`Meta.md`](Meta.md) | Team credits and metadata notes |

Keep these resources accurate and consistent with the website. Do not treat a manifest as proof of certification, legal compliance, or service availability.

## Ownership and founders

ReeferDude is co-owned and operated by **Raymond Meadows** and **Jessica Mullins**.

| Founder | Role and credentials |
| :--- | :--- |
| **Raymond Meadows** | Co-Founder, Lead Software Architect, Level 7 Google Local Guide |
| **Jessica Mullins** | Co-Founder, Operations Manager, Google Local Guide |

The original project materials identify collaborative leadership, operational excellence, and shared ownership as core parts of the ReeferDude identity. For current public information, visit the [official website](https://reeferdude.com/) or the [about page](https://reeferdude.com/about/).

## Website and ecosystem

- **Official domain:** [reeferdude.com](https://reeferdude.com/)
- **GitHub profile:** [techwhisperer420](https://github.com/techwhisperer420)
- **Organization:** [@potpimp](https://github.com/potpimp)

ReeferDude's focus includes brand identity, digital trust, search authority, AI discoverability, commerce systems, and co-owned execution.

## Contributing

Contributions that improve the code, documentation, accessibility, reliability, or discoverability are welcome. Before opening a pull request:

1. Check the existing implementation and repository conventions.
2. Keep changes focused and avoid adding secrets or unverified claims.
3. Run `npm run verify` and include relevant test or validation details in the pull request.
4. Describe the user-facing impact and any setup changes.

For security-sensitive issues, use the contact information in [`.well-known/security.txt`](.well-known/security.txt) rather than publishing exploit details in a public issue.

## License

Review the licensing information in [`package.json`](package.json) and any applicable notices or third-party licenses in the repository before reusing or distributing code and content. This README does not grant additional rights.

---

<div align="center">

**Co-owned and operated with pride by Raymond Meadows and Jessica Mullins.**  
Brand systems · Trust · Search and AI visibility · Commerce · Collaboration

[Back to top](#top) · [Visit reeferdude.com](https://reeferdude.com/)

</div>
