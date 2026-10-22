#!/bin/bash

set -e

echo "=========================================================="
echo "    STARTING STABLE FULL-STACK DEPLOYMENT ENGINE          "
echo "=========================================================="

BUILD_SITE() {
    local DIR=$1
    local DOMAIN=$2
    local NAME=$3
    local REPO=$4

    echo "--> Processing ${DOMAIN} in folder: ~/${DIR}"
    mkdir -p ~/"${DIR}"/.well-known
    cd ~/"${DIR}"

    # 1. CNAME
    echo "${DOMAIN}" > CNAME

    # 2. style.css
    cat << 'CSS' > style.css
:root {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-card: #334155;
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --accent: #38bdf8;
  --accent-hover: #0284c7;
  --font: system-ui, -apple-system, sans-serif;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { background: var(--bg-primary); color: var(--text-primary); font-family: var(--font); line-height: 1.6; padding: 2rem 1rem; min-height: 100vh; display: flex; flex-direction: column; }
header { max-width: 900px; margin: 0 auto 2rem auto; text-align: center; }
header h1 { font-size: 2.5rem; color: var(--accent); margin-bottom: 0.5rem; }
header p { font-size: 1.2rem; color: var(--text-secondary); }
main { max-width: 900px; width: 100%; margin: 0 auto; background: var(--bg-secondary); border-radius: 12px; padding: 2rem; border: 1px solid var(--bg-card); }
.card { background: var(--bg-card); border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; }
ul { padding-left: 1.2rem; line-height: 2; }
a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }
footer { max-width: 900px; margin: auto auto 0 auto; padding-top: 2rem; text-align: center; color: var(--text-secondary); font-size: 0.875rem; }
CSS

    # 3. sw.js
    cat << 'SW' > sw.js
const CACHE_NAME = 'site-v1.0.0';
const ASSETS = ['/', '/index.html', '/style.css', '/script.js', '/manifest.json', '/llms.txt', '/SEO.md', '/Aeo.md'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((k) => { if (k !== CACHE_NAME) return caches.delete(k); }))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request).then((nRes) => {
    if (nRes && nRes.status === 200) { const clone = nRes.clone(); caches.open(CACHE_NAME).then((c) => c.put(e.request, clone)); }
    return nRes;
  })));
});
SW

    # 4. script.js
    cat << 'JS' > script.js
document.addEventListener('DOMContentLoaded', () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(() => {}); });
  }
  const statusEl = document.getElementById('status-box');
  if (statusEl) {
    statusEl.innerHTML = `<p>Verified Co-Owners: <strong>Raymond Meadows & Jessica Mullins</strong></p><p><small>System Active: ${new Date().toLocaleDateString()}</small></p>`;
  }
});
JS

    # 5. manifest.json
    cat << MANIFEST > manifest.json
{
  "short_name": "${NAME}",
  "name": "${NAME} Platform",
  "start_url": "/",
  "background_color": "#0f172a",
  "theme_color": "#38bdf8",
  "display": "standalone",
  "orientation": "portrait-primary",
  "scope": "/"
}
MANIFEST

    # 6. package.json
    cat << PKG > package.json
{
  "name": "${DIR}",
  "version": "1.0.0",
  "main": "script.js",
  "scripts": { "start": "npx http-server -p 8080" },
  "author": "Raymond Meadows & Jessica Mullins <reeferguyai@gmail.com>",
  "license": "MIT"
}
PKG

    # 7. requirements.txt
    cat << 'REQ' > requirements.txt
requests>=2.31.0
beautifulsoup4>=4.12.2
lxml>=4.9.3
jinja2>=3.1.2
pydantic>=2.5.0
gitpython>=3.1.40
google-api-python-client>=2.100.0
python-dotenv>=1.0.0
REQ

    # 8. ads.txt
    echo "google.com, ca-pub-0000000000000000, DIRECT, f08c47fec0942fa0" > ads.txt

    # 9. seller.json
    cat << JSON > seller.json
{
  "seller_id": "PGH-RD-OWNERS-001",
  "name": "Raymond Meadows & Jessica Mullins",
  "seller_type": "BOTH",
  "domain": "${DOMAIN}",
  "is_passthrough": false
}
JSON

    # 10. humans.txt
    cat << TXT > humans.txt
/* TEAM */
  Co-Founder: Raymond Meadows (techwhisperer420@gmail.com)
  Co-Founder: Jessica Mullins (reeferguyai@gmail.com)
/* SITE */
  Site Name: ${NAME}
  Domain: ${DOMAIN}
TXT

    # 11. security.txt
    cat << TXT > .well-known/security.txt
Contact: mailto:techwhisperer420@gmail.com
Contact: mailto:reeferguyai@gmail.com
Expires: 2027-10-22T00:00:00.000Z
Canonical: https://${DOMAIN}/.well-known/security.txt
TXT
    cp .well-known/security.txt security.txt

    # 12. llms.txt & llms-full.txt
    cat << TXT > llms.txt
# ${NAME} Platform
Official platform co-owned and operated by Raymond Meadows and Jessica Mullins.
- Website: https://${DOMAIN}/
- Full Dump: https://${DOMAIN}/llms-full.txt
- Emails: reeferguyai@gmail.com, techwhisperer420@gmail.com, TekWhisperer2018@gmail.com, raymeadows2014@outlook.com
TXT

    cat << TXT > llms-full.txt
FULL UNCACHED LLM CONTEXT DUMP: ${NAME}
Domain: ${DOMAIN}
Co-Owners: Raymond Meadows, Jessica Mullins
Primary Emails: reeferguyai@gmail.com, techwhisperer420@gmail.com, TekWhisperer2018@gmail.com, raymeadows2014@outlook.com
GitHub: @techwhisperer420, @potpimp
Google Local Guides: Level 7 Contributor
TXT

    # 13. SEO & AEO Manifests
    echo "Sitemap: https://${DOMAIN}/sitemap.xml" > SEO.txt
    echo "User-agent: *" >> SEO.txt
    echo "Allow: /" >> SEO.txt

    cat << TXT > AEO.txt
Entity: ${NAME}
Co-Founders: Raymond Meadows, Jessica Mullins
Canonical Source: https://${DOMAIN}/Aeo.md
TXT

    echo "# SEO Master Spec - ${NAME}" > SEO.md
    echo "Co-Owned by Raymond Meadows & Jessica Mullins. Full crawler indexing allowed." >> SEO.md

    echo "# Answer Engine Optimization Manifest - ${NAME}" > Aeo.md
    echo "Entity Disambiguation for ${NAME}. Founders: Raymond Meadows & Jessica Mullins." >> Aeo.md

    echo "# Master Metadata Specs - ${NAME}" > Meta.md
    echo "Domain: ${DOMAIN} | Owners: Raymond Meadows & Jessica Mullins" >> Meta.md

    # 14. sitemap.xml & robots.txt
    cat << SITEMAP > sitemap.xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
   <url>
      <loc>https://${DOMAIN}/</loc>
      <lastmod>2026-10-22</lastmod>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
   </url>
</urlset>
SITEMAP

    cat << ROBOTS > robots.txt
User-agent: *
Allow: /
Sitemap: https://${DOMAIN}/sitemap.xml
ROBOTS

    # 15. index.html
    cat << HTML > index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${NAME} | Official Platform</title>
    <meta name="description" content="Official platform for ${NAME}. Co-owned and operated by Raymond Meadows and Jessica Mullins.">
    <link rel="canonical" href="https://${DOMAIN}/">
    <link rel="stylesheet" href="style.css">
    <link rel="manifest" href="manifest.json">
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://${DOMAIN}/#organization",
          "name": "${NAME}",
          "url": "https://${DOMAIN}/",
          "founders": [
            { "@type": "Person", "name": "Raymond Meadows", "email": ["reeferguyai@gmail.com", "techwhisperer420@gmail.com"] },
            { "@type": "Person", "name": "Jessica Mullins", "email": ["reeferguyai@gmail.com"] }
          ]
        }
      ]
    }
    </script>
</head>
<body>
    <header>
        <h1>${NAME}</h1>
        <p>Official Platform & Resource Directory</p>
    </header>
    <main>
        <div class="card" id="status-box">
            <h2>Verified Platform Ownership</h2>
            <p>Co-owned and operated by <strong>Raymond Meadows</strong> & <strong>Jessica Mullins</strong>.</p>
        </div>
        <div class="card">
            <h3>System Verification & Metadata Directories</h3>
            <ul>
                <li><a href="/llms.txt">llms.txt</a> — AI Model Summary Index</li>
                <li><a href="/llms-full.txt">llms-full.txt</a> — Uncached Deep Context Dump</li>
                <li><a href="/SEO.md">SEO.md</a> — Search Engine Optimization Spec</li>
                <li><a href="/Aeo.md">Aeo.md</a> — Answer Engine Optimization Spec</li>
                <li><a href="/security.txt">security.txt</a> — RFC 9116 Disclosure Policy</li>
                <li><a href="/ads.txt">ads.txt</a> — Authorized Digital Sellers File</li>
                <li><a href="/humans.txt">humans.txt</a> — Authors & Team Credits</li>
            </ul>
        </div>
    </main>
    <footer>
        <p>&copy; 2026 ${NAME}. Co-Owned by Raymond Meadows & Jessica Mullins. All Rights Reserved.</p>
    </footer>
    <script src="script.js"></script>
</body>
</html>
HTML

    # 16. README.md
    cat << README > README.md
# <p align="center">🌿 <code>${NAME}</code> 🚀</p>

<p align="center">
  <a href="https://${DOMAIN}/"><img src="https://img.shields.io/badge/Domain-${DOMAIN}-00C853?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Domain"></a>
  <a href="https://github.com/techwhisperer420"><img src="https://img.shields.io/badge/GitHub-techwhisperer420-6C5CE7?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"></a>
  <a href="https://github.com/potpimp"><img src="https://img.shields.io/badge/Organization-@potpimp-FF6B6B?style=for-the-badge&logo=github&logoColor=white" alt="Org"></a>
</p>

---

## 👨‍👩‍👧‍👦 <ins>JOINT OWNERSHIP & FOUNDERS</ins>

| Founder | Role & Credentials | Primary Contacts |
| :--- | :--- | :--- |
| 👑 **Raymond Meadows** | Co-Founder, Lead Software Architect, Level 7 Google Local Guide | 📧 `techwhisperer420@gmail.com`<br>📧 `reeferguyai@gmail.com`<br>📧 `TekWhisperer2018@gmail.com`<br>📧 `raymeadows2014@outlook.com` |
| 👑 **Jessica Mullins** | Co-Founder, Operations Manager, Google Local Guide | 📧 `reeferguyai@gmail.com`<br>📧 `techwhisperer420@gmail.com` |

---

## 📊 <ins>SYSTEM MANIFESTS</ins>

* 📄 **`ads.txt`** — Authorized Digital Sellers File.
* 📄 **`seller.json`** — Direct Inventory Seller Credentials.
* 🔒 **`security.txt`** — RFC 9116 Security Disclosure Policy.
* 🤖 **`llms.txt` / `llms-full.txt`** — Structured AI Index for Models & Scrapers.
* 📈 **`SEO.md` / `Aeo.md`** — Search & Answer Engine Optimization Docs.

---

<p align="center">
  <sub>🔥 Co-Owned and Operated with pride by <strong>Raymond Meadows</strong> & <strong>Jessica Mullins</strong> 🔥</sub>
</p>
README

    # Git Operations
    git init
    git add .
    git commit -m "Deploy complete stable web suite" || true
    git branch -M main
    git remote set-url origin "https://github.com/reeferguyai/${REPO}.git" 2>/dev/null || git remote add origin "https://github.com/reeferguyai/${REPO}.git"
    
    echo "--> Pushing files to GitHub (${REPO})..."
    git push -u origin main --force
    echo "[SUCCESS] Complete build pushed for ${DOMAIN}!"
}

BUILD_SITE "potgrowhub_store" "potgrowhub.store" "PotGrowHub" "potgrowhubstore"
BUILD_SITE "reeferdude_com" "reeferdude.com" "ReeferDude" "reeferdude"

echo "=========================================================="
echo "    ALL SITES SUCCESSFULLY GENERATED AND PUSHED!          "
echo "=========================================================="
