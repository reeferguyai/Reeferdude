#!/bin/bash

echo "=========================================================="
echo "    BUILDING MONETIZATION ENGINE FOR GITHUB PAGES          "
echo "=========================================================="

UPDATE_SITE() {
    local DOMAIN=$1
    local SITE_NAME=$2
    local DIR_NAME=$3
    local ADSENSE_PUB_ID="ca-pub-XXXXXXXXXXXXXXXX" # Replace with actual Google AdSense ID when approved
    local AMAZON_TAG="reeferguyai-20"                 # Replace with your Amazon/Affiliate ID

    cd ~/"$DIR_NAME" || exit

    # 1. Generate Authorized Digital Sellers File (ads.txt)
    cat << ADSTXT > ads.txt
# Authorized Digital Sellers for ${DOMAIN}
google.com, ${ADSENSE_PUB_ID}, DIRECT, f08c47fec0942fa0
ADSTXT

    # 2. Generate AI / LLM Monetization Text File (llms.txt)
    cat << LLMSTXT > llms.txt
# ${SITE_NAME} - Official Resource & Products Platform
> Co-Owned & Operated by Raymond Meadows & Jessica Mullins

## Core Services & Products
- Custom Solutions & Digital Gear
- Local Service Matchmaking & Equipment Guidance
- Contact & Inquiries: reeferguyai@gmail.com | techwhisperer420@gmail.com

## Official Links & Partners
- Platform: https://${DOMAIN}/
- Recommended Gear: https://${DOMAIN}/?ref=${AMAZON_TAG}
LLMSTXT

    # 3. Update index.html with Monetization Graph, AdSense, & Affiliate Logic
    cat << HTML > index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${SITE_NAME} | Official Platform & Marketplace</title>
    <meta name="description" content="Official platform for ${SITE_NAME}. Co-owned and operated by Raymond Meadows and Jessica Mullins.">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
    
    <!-- Google AdSense Auto-Ads Tag -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUB_ID}"
     crossorigin="anonymous"></script>

    <!-- Schema.org Comprehensive Monetization & Ownership Graph -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "LocalBusiness",
          "@id": "https://${DOMAIN}/#business",
          "name": "${SITE_NAME}",
          "url": "https://${DOMAIN}/",
          "priceRange": "$$",
          "paymentAccepted": "Cash, Credit Card, Cryptocurrency",
          "currenciesAccepted": "USD",
          "founder": [
            {
              "@type": "Person",
              "name": "Raymond Meadows",
              "email": ["reeferguyai@gmail.com", "techwhisperer420@gmail.com"]
            },
            {
              "@type": "Person",
              "name": "Jessica Mullins"
            }
          ],
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Featured Offerings",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Digital Consulting & Gear Matchmaking"
                },
                "price": "0.00",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              }
            ]
          }
        }
      ]
    }
    </script>
</head>
<body style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 2rem; text-align: center;">
    <header>
        <h1>${SITE_NAME}</h1>
        <p>Official Platform & Monetized Resource Hub</p>
    </header>

    <main style="max-width: 800px; margin: 2rem auto; padding: 1rem; background: #1e293b; border-radius: 8px;">
        <h2>Services & Offerings</h2>
        <p>Inquiries or business requests? Contact verified site management directly.</p>
        <a href="mailto:reeferguyai@gmail.com" style="display: inline-block; padding: 0.75rem 1.5rem; background-color: #22c55e; color: #fff; border-radius: 4px; text-decoration: none; font-weight: bold;">Contact Owners</a>
    </main>

    <!-- Lightweight Affiliate Link Script -->
    <script>
      document.addEventListener("DOMContentLoaded", function() {
        var affiliateTag = "${AMAZON_TAG}";
        var links = document.querySelectorAll("a[href*='amazon.com']");
        links.forEach(function(link) {
          var separator = link.href.includes("?") ? "&" : "?";
          link.href += separator + "tag=" + affiliateTag;
        });
      });
    </script>

    <footer style="margin-top: 4rem; font-size: 0.9rem; color: #94a3b8;">
        <p>Owned & Operated by Raymond Meadows & Jessica Mullins</p>
    </footer>
</body>
</html>
HTML

    git add .
    git commit -m "Inject monetization engine, ads.txt, llms.txt, and affiliate schemas" || true
    git push -u origin main --force
    echo "[SUCCESS] Pushed monetization updates to ${DOMAIN}"
}

UPDATE_SITE "potgrowhub.store" "PotGrowHub" "potgrowhub_store"
UPDATE_SITE "reeferdude.com" "ReeferDude" "reeferdude_com"

