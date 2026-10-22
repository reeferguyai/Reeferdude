/* ================================================================
   PotGrowHub.store / ReeferDude.com — script.js
   The full engine: SPA router, monetization wiring, Grow Studio,
   Strain Lab, and the GanjaGoddess AI Budtender (local expert
   system — answers from a built-in knowledge base, no cloud AI,
   no API key).
   ================================================================ */
(function () {
"use strict";

/* ================================================================
   MONEY CONFIG — paste your IDs and links between the quotes.
   Leave a value empty ("") and that feature stays inert.
   ================================================================ */
const MONEY = {
  adNetworks: {
    mantisTagUrl: "",       // Mantis publisher tag script URL
    trafficRootsTagUrl: "", // Traffic Roots tag script URL
    adsterraTagUrl: "",     // Adsterra banner script URL
    propellerTagUrl: ""     // PropellerAds script URL
  },
  affiliates: { tent: "", light: "", fan: "", nutrients: "", seeds: "", gear: "" },
  gumroad:    { growBible: "", vpdPack: "", strainJournal: "" },
  calendlyUrl: "",
  formEndpoint: "",   // Formspree endpoint, e.g. https://formspree.io/f/xxxxxxx
  kofiUrl: ""
};

/* ---- house promo shown in any ad slot with no live network tag ---- */
const HOUSE_ADS = [
  { text: "🌿 YOUR BRAND HERE — this spot is for rent. Reach growers daily.", href: "#book" },
  { text: "📖 The Reefer Dude Grow Bible — seed to smoke, $19 instant download.", href: "#digital" },
  { text: "🛒 Gear the Dude vouches for — shop the Hustle Shop.", href: "#shop" }
];

function wireLink(selector, url, soonText) {
  document.querySelectorAll(selector).forEach(function (el) {
    if (url) { el.setAttribute("href", url); }
    else { el.removeAttribute("href"); el.textContent = soonText; el.style.opacity = "0.75"; }
  });
}

function initMoney() {
  document.querySelectorAll("[data-aff]").forEach(function (el) {
    const url = MONEY.affiliates[el.getAttribute("data-aff")] || "";
    if (url) { el.setAttribute("href", url); }
    else { el.removeAttribute("href"); el.textContent = "Deal Dropping Soon"; el.style.opacity = "0.75"; }
  });
  document.querySelectorAll("[data-gum]").forEach(function (el) {
    const url = MONEY.gumroad[el.getAttribute("data-gum")] || "";
    if (url) { el.setAttribute("href", url); }
    else { el.removeAttribute("href"); el.textContent = "Dropping Soon"; el.style.opacity = "0.75"; }
  });
  wireLink("[data-book]", MONEY.calendlyUrl, "Bookings Open Soon");
  wireLink("[data-kofi]", MONEY.kofiUrl, "Support Page Coming Soon");

  const tagUrls = [MONEY.adNetworks.mantisTagUrl, MONEY.adNetworks.trafficRootsTagUrl,
                   MONEY.adNetworks.adsterraTagUrl, MONEY.adNetworks.propellerTagUrl].filter(Boolean);
  document.querySelectorAll(".ad-slot").forEach(function (slot, i) {
    if (tagUrls.length) {
      const s = document.createElement("script");
      s.src = tagUrls[i % tagUrls.length]; s.async = true;
      slot.appendChild(s);
      const label = document.createElement("span");
      label.className = "text-stone-500 text-xs"; label.textContent = "Advertisement";
      slot.appendChild(label);
    } else {
      const ad = HOUSE_ADS[i % HOUSE_ADS.length];
      const a = document.createElement("a");
      a.href = ad.href; a.className = "font-black text-amber-400 text-lg";
      a.textContent = ad.text;
      slot.appendChild(a);
    }
  });

  const leadForm = document.getElementById("lead-form");
  if (leadForm) {
    leadForm.addEventListener("submit", function (ev) {
      ev.preventDefault();
      const status = document.getElementById("lead-status");
      if (!MONEY.formEndpoint) {
        status.textContent = "Form opens soon — check back shortly.";
        return;
      }
      fetch(MONEY.formEndpoint, { method: "POST", body: new FormData(leadForm), headers: { "Accept": "application/json" } })
        .then(function (r) { status.textContent = r.ok ? "Got it — the Dude will be in touch. 🌿" : "Hmm, that didn't send. Try again in a minute."; if (r.ok) leadForm.reset(); })
        .catch(function () { status.textContent = "Network hiccup — try again in a minute."; });
    });
  }
}

/* ================================================================
   SPA ROUTER — hash-based pages, back button friendly
   ================================================================ */
const PAGES = ["home", "studio", "lab", "budtender", "shop", "digital", "book", "join"];
const TITLES = {
  home: "ReeferDude.com | PotGrowHub.store — Hustle Hard. Grow Green.",
  studio: "Grow Studio — PotGrowHub.store",
  lab: "Strain Lab — PotGrowHub.store",
  budtender: "AI Budtender — PotGrowHub.store",
  shop: "Hustle Shop — PotGrowHub.store",
  digital: "Digital Drops — PotGrowHub.store",
  book: "Book / Contact — PotGrowHub.store",
  join: "Join the Grow Circle — PotGrowHub.store"
};
let currentPage = "home";

function showPage(name) {
  if (PAGES.indexOf(name) === -1) name = "home";
  currentPage = name;
  document.querySelectorAll(".spa-page").forEach(function (p) {
    p.hidden = p.getAttribute("data-page") !== name;
  });
  document.querySelectorAll("[data-navlink]").forEach(function (a) {
    const on = a.getAttribute("data-navlink") === name;
    a.classList.toggle("ring-2", on);
    a.classList.toggle("ring-amber-300", on);
    a.classList.toggle("brightness-125", on);
  });
  document.title = TITLES[name] || TITLES.home;
  window.scrollTo(0, 0);
}

function route() {
  const h = (location.hash || "").replace("#", "").split("?")[0].toLowerCase();
  showPage(PAGES.indexOf(h) !== -1 ? h : "home");
}

function goTo(page) {
  if (location.hash === "#" + page) { showPage(page); }
  else { location.hash = page; }
}

function initRouter() {
  window.addEventListener("hashchange", route);
  document.querySelectorAll("[data-goto]").forEach(function (el) {
    el.addEventListener("click", function () { goTo(el.getAttribute("data-goto")); });
  });
  route();
}

/* ================================================================
   GROW STUDIO — room math + live VPD (Tetens formula)
   ================================================================ */
function satVaporPressureKpa(tempC) {
  return 0.6108 * Math.exp((17.27 * tempC) / (tempC + 237.3));
}
function computeVpdKpa(tempF, rhPercent) {
  const airC = (tempF - 32) * 5 / 9;
  const leafC = airC - 1.5; // leaves typically run ~1.5°C cooler than air
  return satVaporPressureKpa(leafC) * (1 - rhPercent / 100);
}
const VPD_TARGETS = {
  seedling: { lo: 0.4, hi: 0.8, label: "seedlings/clones like it gentle: 0.4–0.8 kPa" },
  veg:      { lo: 0.8, hi: 1.2, label: "veg sweet spot: 0.8–1.2 kPa" },
  flower:   { lo: 1.2, hi: 1.6, label: "flower sweet spot: 1.2–1.6 kPa" }
};
const WATTS_PER_SQFT = { seedling: 20, veg: 30, flower: 40 };

function initStudio() {
  const ids = ["st-length", "st-width", "st-height", "st-plants", "st-stage", "st-temp", "st-rh"];
  if (!document.getElementById("st-length")) return;
  function num(id, dflt) { const v = parseFloat(document.getElementById(id).value); return isNaN(v) ? dflt : v; }
  function update() {
    const L = Math.max(0.5, num("st-length", 4)), W = Math.max(0.5, num("st-width", 4)),
          H = Math.max(1, num("st-height", 6.5)), plants = Math.max(1, Math.round(num("st-plants", 4)));
    const stage = document.getElementById("st-stage").value;
    const tempF = num("st-temp", 78), rh = num("st-rh", 55);
    document.getElementById("st-temp-val").textContent = tempF + "°F";
    document.getElementById("st-rh-val").textContent = rh + "%";
    const area = L * W, volume = area * H;
    const watts = Math.round(area * WATTS_PER_SQFT[stage]);
    const wattsHi = Math.round(watts * 1.2);
    const cfmLo = Math.round((volume / 2) * 1.25);          // 2-min exchange + carbon-filter drag
    const cfmHi = Math.round(volume * 1.25);                 // 1-min exchange + filter drag
    const vpd = computeVpdKpa(tempF, rh);
    const t = VPD_TARGETS[stage];
    document.getElementById("out-area").textContent = area.toFixed(0) + " sq ft (" + volume.toFixed(0) + " cu ft)";
    document.getElementById("out-watts").textContent = watts + "–" + wattsHi + " W of quality LED";
    document.getElementById("out-cfm").textContent = cfmLo + "–" + cfmHi + " CFM exhaust (with carbon filter)";
    document.getElementById("out-vpd").textContent = vpd.toFixed(2) + " kPa";
    const status = document.getElementById("out-vpd-status");
    if (vpd < t.lo) status.textContent = "⚠️ Running LOW — plants drink slow, mold risk climbs. Lower humidity or warm the room. (" + t.label + ")";
    else if (vpd > t.hi) status.textContent = "⚠️ Running HIGH — plants transpire hard, tips can crisp. Raise humidity or cool the room. (" + t.label + ")";
    else status.textContent = "✅ In the zone — " + t.label + ". Keep it there and they stack.";
    const sqPerPlant = area / plants;
    document.getElementById("out-note").textContent =
      "≈ " + sqPerPlant.toFixed(1) + " sq ft per plant. " +
      (sqPerPlant < 2 ? "That's tight — expect training (LST/SCROG) or fewer, bigger plants." :
       sqPerPlant > 9 ? "Roomy — you could add plants or spread the canopy wider." :
       "Comfortable spacing for healthy airflow between plants.");
  }
  ids.forEach(function (id) {
    const el = document.getElementById(id);
    el.addEventListener("input", update);
    el.addEventListener("change", update);
  });
  update();
}

/* ================================================================
   STRAIN LAB — built-in vault
   ================================================================ */
const STRAINS = [
  { n:"Northern Lights", t:"indica", thc:"16–21%", cbd:"<1%", eff:["Sleepy","Relaxed","Pain relief","Calm"], fla:["Earthy","Pine","Sweet"], dif:"Easy", flo:"7–9 wks", yld:"High", desc:"The legendary indica — resinous, forgiving, and built for nighttime. A cornerstone strain since the '80s.", grow:"One of the easiest strains alive. Compact, low-odor, handles mistakes. Perfect first grow." },
  { n:"Granddaddy Purple", t:"indica", thc:"17–23%", cbd:"<1%", eff:["Sleepy","Relaxed","Pain relief","Hungry"], fla:["Grape","Berry","Sweet"], dif:"Moderate", flo:"8–11 wks", yld:"Medium", desc:"California royalty — grape-candy buds with purple hues and a heavy, dreamy body stone.", grow:"Loves cooler nights late in flower to pull out the purple. Watch humidity — dense buds can mold." },
  { n:"Blue Dream", t:"hybrid", thc:"17–24%", cbd:"<1%", eff:["Creative","Uplifted","Relaxed","Pain relief"], fla:["Blueberry","Sweet","Vanilla"], dif:"Easy", flo:"9–10 wks", yld:"High", desc:"The people's champion — blueberry sweetness with a balanced, creative high that never floors you.", grow:"Vigorous and forgiving, stretches in flower. Big yields with basic training." },
  { n:"OG Kush", t:"hybrid", thc:"19–26%", cbd:"<1%", eff:["Relaxed","Euphoric","Stress relief","Hungry"], fla:["Fuel","Lemon","Earthy"], dif:"Hard", flo:"8–9 wks", yld:"Medium", desc:"The West Coast blueprint — fuel, lemon, and earth with a heavy-hitting, stress-melting high.", grow:"Picky feeder, stretchy, wants a dialed environment. Rewards skilled growers with top-shelf flower." },
  { n:"Girl Scout Cookies", t:"hybrid", thc:"20–28%", cbd:"<1%", eff:["Euphoric","Relaxed","Creative","Happy"], fla:["Sweet","Mint","Earthy"], dif:"Moderate", flo:"9–10 wks", yld:"Medium", desc:"Dessert-tier potency — sweet, minty, and euphoric. The strain that launched the Cookies empire.", grow:"Medium feeder, dense nugs. Keep airflow strong in late flower." },
  { n:"Sour Diesel", t:"sativa", thc:"19–25%", cbd:"<1%", eff:["Energetic","Creative","Uplifted","Focused"], fla:["Diesel","Citrus","Skunk"], dif:"Moderate", flo:"10–11 wks", yld:"High", desc:"Pure rocket fuel — a fast, heady, talkative high that made diesel a household name.", grow:"Tall stretcher, long flower. Give it height and a carbon filter — it is LOUD." },
  { n:"Pineapple Express", t:"hybrid", thc:"18–25%", cbd:"<1%", eff:["Happy","Energetic","Creative","Uplifted"], fla:["Pineapple","Tropical","Cedar"], dif:"Easy", flo:"7–9 wks", yld:"High", desc:"Tropical and friendly — a buzzing, happy high that cruises like the movie promised.", grow:"Fast, sturdy, beginner-friendly. Great in small tents." },
  { n:"Gorilla Glue #4", t:"hybrid", thc:"25–30%", cbd:"<1%", eff:["Relaxed","Euphoric","Sleepy","Pain relief"], fla:["Chocolate","Coffee","Diesel"], dif:"Moderate", flo:"8–9 wks", yld:"High", desc:"Glue is literal — buds so resinous they gummed up trimmers' scissors. Heavy, couch-friendly power.", grow:"Sticky and vigorous. Support branches late — the colas get heavy." },
  { n:"White Widow", t:"hybrid", thc:"18–25%", cbd:"<1%", eff:["Euphoric","Energetic","Creative","Happy"], fla:["Earthy","Woody","Spicy"], dif:"Easy", flo:"8–9 wks", yld:"High", desc:"Amsterdam coffee-shop royalty — frosty white resin and a social, buzzy high.", grow:"Hardy and mold-resistant for its class. A classic for a reason." },
  { n:"AK-47", t:"hybrid", thc:"13–20%", cbd:"~1%", eff:["Relaxed","Happy","Uplifted","Creative"], fla:["Earthy","Floral","Sour"], dif:"Easy", flo:"7–9 wks", yld:"High", desc:"Don't let the name scare you — it's mellow, steady, and social. Award-winner since the '90s.", grow:"Fast-finishing and easy. Steady feeder, low drama." },
  { n:"Jack Herer", t:"sativa", thc:"18–24%", cbd:"<1%", eff:["Focused","Creative","Energetic","Clear-headed"], fla:["Pine","Spicy","Citrus"], dif:"Moderate", flo:"8–10 wks", yld:"Medium", desc:"Named for the Emperor of Hemp himself — a clear, creative, get-things-done sativa high.", grow:"Loves light and training. Phenotypes vary — pick your favorite mother." },
  { n:"Gelato", t:"hybrid", thc:"20–26%", cbd:"<1%", eff:["Relaxed","Euphoric","Creative","Happy"], fla:["Sweet","Citrus","Berry"], dif:"Moderate", flo:"8–9 wks", yld:"Medium", desc:"Dessert genetics at their finest — smooth, sweet, and heavy without the knockout.", grow:"Clones circulate widely; keep temps moderate and humidity low late in flower." },
  { n:"Wedding Cake", t:"hybrid", thc:"24–27%", cbd:"<1%", eff:["Relaxed","Euphoric","Hungry","Sleepy"], fla:["Vanilla","Sweet","Earthy"], dif:"Moderate", flo:"8–9 wks", yld:"Medium", desc:"Rich vanilla frosting over earthy kush power. A modern heavyweight for winding all the way down.", grow:"Dense buds — defoliate for airflow. Moderate feeder." },
  { n:"Purple Haze", t:"sativa", thc:"14–19%", cbd:"<1%", eff:["Euphoric","Creative","Energetic","Uplifted"], fla:["Berry","Sweet","Earthy"], dif:"Moderate", flo:"9–11 wks", yld:"Medium", desc:"Jimi's strain — a dreamy, psychedelic-tinged sativa with purple-tinted buds.", grow:"Longer flower, airy buds resist mold. Cool nights boost the purple." },
  { n:"Bubba Kush", t:"indica", thc:"15–22%", cbd:"<1%", eff:["Sleepy","Relaxed","Hungry","Pain relief"], fla:["Coffee","Chocolate","Hash"], dif:"Easy", flo:"8–9 wks", yld:"Medium", desc:"Coffee-and-chocolate couch-lock classic. The definition of an evening indica.", grow:"Short, stocky, slow in veg — give it an extra week before flip. Very forgiving." },
  { n:"Green Crack", t:"sativa", thc:"15–25%", cbd:"<1%", eff:["Energetic","Focused","Uplifted","Happy"], fla:["Mango","Citrus","Sweet"], dif:"Easy", flo:"7–9 wks", yld:"High", desc:"Daytime rocket — sharp focus and energy, Snoop's favorite wake-and-bake.", grow:"Fast and hungry. Great yield for a sativa, minimal fuss." },
  { n:"Durban Poison", t:"sativa", thc:"15–25%", cbd:"<1%", eff:["Energetic","Uplifted","Creative","Focused"], fla:["Sweet","Anise","Earthy"], dif:"Moderate", flo:"8–10 wks", yld:"High", desc:"Pure South African landrace sativa — electric, clear, and famously productive.", grow:"Grows tall and wild outdoors; train hard indoors. Very pest-resistant." },
  { n:"Harlequin", t:"hybrid", thc:"4–7%", cbd:"8–16%", eff:["Calm","Pain relief","Clear-headed","Relaxed"], fla:["Mango","Earthy","Citrus"], dif:"Moderate", flo:"8–10 wks", yld:"Medium", desc:"The CBD workhorse — high-CBD, low-THC clarity with real pain-relief chops and no heavy high.", grow:"Needs phenotype hunting for the best CBD:THC ratio. Otherwise standard hybrid care." },
  { n:"ACDC", t:"hybrid", thc:"1–6%", cbd:"15–20%", eff:["Calm","Pain relief","Clear-headed","Focused"], fla:["Earthy","Woody","Sweet"], dif:"Moderate", flo:"9–11 wks", yld:"Medium", desc:"Near-zero high, maximum CBD. The go-to for relief while staying fully functional.", grow:"Clones from a tested mother are key — seed ratios vary. Longer flower." },
  { n:"Zkittlez", t:"indica", thc:"15–23%", cbd:"<1%", eff:["Relaxed","Happy","Sleepy","Euphoric"], fla:["Berry","Grape","Candy"], dif:"Moderate", flo:"7–9 wks", yld:"Medium", desc:"Taste the rainbow — pure candy terps with a mellow, happy indica landing.", grow:"Short and bushy; scrog it for best yields. Terps fade if harvested late." },
  { n:"Trainwreck", t:"hybrid", thc:"18–25%", cbd:"<1%", eff:["Euphoric","Creative","Uplifted","Happy"], fla:["Lemon","Pine","Spicy"], dif:"Moderate", flo:"8–10 wks", yld:"High", desc:"Hits like the name — a soaring sativa rush that settles into hybrid calm.", grow:"Viney and stretchy; trellis early. Resin rails by week 8." },
  { n:"Super Lemon Haze", t:"sativa", thc:"16–25%", cbd:"<1%", eff:["Energetic","Happy","Creative","Uplifted"], fla:["Lemon","Citrus","Candy"], dif:"Moderate", flo:"9–11 wks", yld:"High", desc:"Two-time Cannabis Cup winner — zesty lemon energy in a glass.", grow:"Tall; top it early and often. Long flower, worth the wait." },
  { n:"Hindu Kush", t:"indica", thc:"15–20%", cbd:"<1%", eff:["Sleepy","Relaxed","Calm","Pain relief"], fla:["Earthy","Sandalwood","Pine"], dif:"Easy", flo:"7–9 wks", yld:"Medium", desc:"Pure landrace indica from the mountains — the genetic backbone of half the kushes alive.", grow:"Built by nature for harsh climates. Extremely hardy, short, fast." },
  { n:"Bruce Banner", t:"hybrid", thc:"24–29%", cbd:"<1%", eff:["Euphoric","Creative","Energetic","Relaxed"], fla:["Diesel","Berry","Sweet"], dif:"Moderate", flo:"9–10 wks", yld:"High", desc:"The Hulk — one of the strongest strains ever tested, but the high stays surprisingly creative.", grow:"Hungry feeder, big stretch. Give it light and room." }
];
const STRAIN_ALIASES = { "gsc": "Girl Scout Cookies", "gg4": "Gorilla Glue #4", "gorilla glue": "Gorilla Glue #4", "gdp": "Granddaddy Purple", "cookies": "Girl Scout Cookies", "banner": "Bruce Banner", "zkittlez": "Zkittlez", "skittles": "Zkittlez" };

function strainByName(name) {
  const q = name.toLowerCase();
  for (const s of STRAINS) if (s.n.toLowerCase() === q) return s;
  for (const a in STRAIN_ALIASES) if (q === a) return strainByName(STRAIN_ALIASES[a]);
  for (const s of STRAINS) if (s.n.toLowerCase().indexOf(q) !== -1 && q.length >= 4) return s;
  return null;
}

const labState = { q: "", type: "all" };
function renderLab() {
  const grid = document.getElementById("lab-grid");
  if (!grid) return;
  const q = labState.q.trim().toLowerCase();
  const list = STRAINS.filter(function (s) {
    if (labState.type !== "all" && s.t !== labState.type) return false;
    if (!q) return true;
    const hay = (s.n + " " + s.t + " " + s.eff.join(" ") + " " + s.fla.join(" ") + " " + s.desc).toLowerCase();
    return hay.indexOf(q) !== -1;
  });
  document.getElementById("lab-count").textContent = list.length + " strain" + (list.length === 1 ? "" : "s") + " in the vault";
  grid.innerHTML = list.map(function (s, i) {
    return '<button type="button" class="lab-card neo-box bg-emerald-900/40 rounded-3xl p-5 text-left cursor-pointer" data-strain="' + s.n + '">' +
      '<div class="text-4xl mb-2">' + (s.t === "indica" ? "🌙" : s.t === "sativa" ? "☀️" : "🌗") + '</div>' +
      '<h4 class="text-lg font-black text-amber-400">' + s.n + '</h4>' +
      '<p class="text-xs text-stone-400 uppercase tracking-wide">' + s.t + ' · THC ' + s.thc + ' · ' + s.dif + ' grow</p>' +
      '<p class="text-sm text-stone-300 mt-2">' + s.eff.slice(0, 3).join(" · ") + '</p>' +
      '<p class="text-xs text-emerald-400 mt-2 font-bold">Tap for full lab report →</p></button>';
  }).join("") || '<p class="text-stone-400">No strains match that search — try an effect like "sleep" or "creative".</p>';
}

function showStrainDetail(name) {
  const s = strainByName(name);
  const box = document.getElementById("lab-detail");
  if (!s || !box) return;
  box.hidden = false;
  box.innerHTML =
    '<div class="flex flex-wrap justify-between gap-2 mb-2"><h4 class="text-2xl font-black text-amber-300">' + (s.t === "indica" ? "🌙" : s.t === "sativa" ? "☀️" : "🌗") + " " + s.n + '</h4>' +
    '<button type="button" id="lab-detail-close" class="neo-box px-3 py-1 bg-stone-700 rounded-lg text-sm font-bold">✕ Close</button></div>' +
    '<p class="text-stone-300 mb-3">' + s.desc + '</p>' +
    '<div class="grid md:grid-cols-2 gap-2 text-sm">' +
    '<p>🧬 <b>Type:</b> ' + s.t + '</p><p>🔥 <b>THC:</b> ' + s.thc + ' · <b>CBD:</b> ' + s.cbd + '</p>' +
    '<p>✨ <b>Effects:</b> ' + s.eff.join(", ") + '</p><p>👅 <b>Flavors:</b> ' + s.fla.join(", ") + '</p>' +
    '<p>🌱 <b>Difficulty:</b> ' + s.dif + '</p><p>⏱️ <b>Flowering:</b> ' + s.flo + ' · <b>Yield:</b> ' + s.yld + '</p></div>' +
    '<p class="text-sm text-stone-300 mt-3">🧑‍🌾 <b>Grow note:</b> ' + s.grow + '</p>' +
    '<div class="flex flex-wrap gap-2 mt-4">' +
    '<button type="button" class="neo-box px-4 py-2 bg-green-600 font-bold rounded-xl text-sm" data-ask-strain="' + s.n + '">🧞 Ask the Budtender about ' + s.n + '</button>' +
    '<button type="button" class="neo-box px-4 py-2 bg-amber-500 text-black font-bold rounded-xl text-sm" data-goto="shop">🛒 Gear to grow it</button></div>';
  box.scrollIntoView({ behavior: "smooth", block: "start" });
  const close = document.getElementById("lab-detail-close");
  if (close) close.addEventListener("click", function () { box.hidden = true; });
  box.querySelectorAll("[data-goto]").forEach(function (el) {
    el.addEventListener("click", function () { goTo(el.getAttribute("data-goto")); });
  });
  const ask = box.querySelector("[data-ask-strain]");
  if (ask) ask.addEventListener("click", function () { askBudtender("Tell me about " + s.n); });
}

function initLab() {
  if (!document.getElementById("lab-grid")) return;
  renderLab();
  const search = document.getElementById("lab-search");
  search.addEventListener("input", function () { labState.q = search.value; renderLab(); });
  document.querySelectorAll(".lab-filter").forEach(function (btn) {
    btn.addEventListener("click", function () {
      labState.type = btn.getAttribute("data-filter");
      document.querySelectorAll(".lab-filter").forEach(function (b) {
        const on = b === btn;
        b.classList.toggle("ring-2", on); b.classList.toggle("ring-amber-300", on);
      });
      renderLab();
    });
  });
  document.getElementById("lab-grid").addEventListener("click", function (ev) {
    const card = ev.target.closest("[data-strain]");
    if (card) showStrainDetail(card.getAttribute("data-strain"));
  });
}

/* ================================================================
   AI BUDTENDER — local expert system.
   Intent scoring over a built-in knowledge base. Not a cloud LLM:
   answers are instant, private, and drawn from the vault below.
   ================================================================ */
const BUD_STORE_KEY = "pgh_budtender_v1";
const BUD_CTX = { lastStrain: null, lastIntent: null };
const RESP_NOTE = '<br><span style="font-size:0.8em;color:#a8a29e">Responsible use: effects vary by person and dose — start low, go slow, never drive high, keep it locked away from kids and pets, and if you are treating a medical condition, loop in a real medical professional too.</span>';

const SYNONYMS = {
  yelow: "yellow", leavs: "leaves", leafs: "leaves", humidty: "humidity",
  temprature: "temperature", tempature: "temperature", nutriants: "nutrients",
  nutriens: "nutrients", recomend: "recommend", reccomend: "recommend",
  reccommend: "recommend", strian: "strain", indca: "indica", satva: "sativa",
  hybid: "hybrid", seedz: "seeds", budz: "buds", weed: "cannabis",
  marijuana: "cannabis", ganja: "cannabis", doobie: "cannabis",
  wanna: "want", gonna: "going", im: "i am", cant: "cannot", dont: "do not",
  whats: "what is", didnt: "did not", isnt: "is not", doesnt: "does not",
  alot: "a lot", thanx: "thanks", thx: "thanks", u: "you", ur: "your"
};
function normalizeText(t) {
  const clean = (t || "").toLowerCase().replace(/[‘’]/g, "'").replace(/[^a-z0-9\s]/g, " ");
  return clean.split(/\s+/).filter(Boolean).map(function (w) { return SYNONYMS[w] || w; }).join(" ");
}
function tokenSet(norm) { return new Set(norm.split(/\s+/).filter(Boolean)); }

function normStrainName(n) { return n.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(); }
function findStrainInText(norm) {
  for (const s of STRAINS) { if (norm.indexOf(normStrainName(s.n)) !== -1) return s; }
  for (const a in STRAIN_ALIASES) { if (norm.indexOf(normStrainName(a)) !== -1) return strainByName(STRAIN_ALIASES[a]); }
  return null;
}
function strainsByEffect(tags, limit) {
  const out = [];
  for (const s of STRAINS) {
    const eff = s.eff.map(function (e) { return e.toLowerCase(); });
    if (tags.some(function (t) { return eff.indexOf(t) !== -1; })) out.push(s);
    if (out.length >= (limit || 3)) break;
  }
  return out;
}
function strainProfileAnswer(s) {
  BUD_CTX.lastStrain = s.n;
  return "🌿 <b>" + s.n + "</b> — " + s.t + ", THC " + s.thc + ", CBD " + s.cbd + ".<br>" + s.desc +
    "<br>✨ Effects: " + s.eff.join(", ") + ". 👅 Flavors: " + s.fla.join(", ") + "." +
    "<br>🌱 Grow difficulty: " + s.dif + " · Flowering: " + s.flo + " · Yield: " + s.yld + "." +
    "<br>Want the grow playbook for it? Just ask <i>“how do I grow it?”</i> — or open the Strain Lab page for the full report.";
}
function strainGrowAnswer(s) {
  return "🧑‍🌾 Growing <b>" + s.n + "</b> (" + s.t + ", difficulty: " + s.dif + ", flowering " + s.flo + "):<br>" + s.grow +
    "<br><b>The universal playbook:</b> germinate warm and dark (paper towel or direct in medium, 70–80°F) → veg under 18/6 light with VPD 0.8–1.2 kPa → flip to 12/12 to flower → feed by stage, keep pH 6.0–6.5 in soil (5.8–6.2 hydro/coco) → harvest when trichomes are mostly cloudy with some amber → dry slow at 60°F/60% RH, then cure in jars 2–4 weeks." +
    "<br>Dial your exact light watts and airflow on the Grow Studio page — it does the math for your tent size.";
}
function effectAnswer(title, tags, extra) {
  const picks = strainsByEffect(tags, 3);
  if (picks.length) BUD_CTX.lastStrain = picks[0].n;
  let out = title + "<br>" + picks.map(function (s) {
    return "• <b>" + s.n + "</b> (" + s.t + ", THC " + s.thc + ") — " + s.eff.slice(0, 3).join(", ").toLowerCase() + ".";
  }).join("<br>");
  if (extra) out += "<br>" + extra;
  out += "<br>Tap one in the Strain Lab for the full report, or ask me <i>“how do I grow it?”</i> about the top pick.";
  return out;
}

const INTENTS = [
  { id: "greeting", keys: { hello: 2, hi: 2, hey: 2, yo: 2, sup: 2, howdy: 3, hola: 3, "good morning": 3, "good afternoon": 3, "good evening": 3 },
    answer: function () { return "🌿✌️ Well well — welcome to the garden, friend. The Goddess is in. Ask me for a strain for sleep, focus, pain or pure vibes… or tell me what your plant is doing and I'll diagnose it like a bench tech with a blunt. What's on your mind?"; } },
  { id: "thanks", keys: { thanks: 3, thank: 3, ty: 3, "appreciate it": 3, awesome: 1, "good looking out": 4 },
    answer: function () { return "Anytime, family. 🌿 Knowledge is meant to be passed around — like a joint at a drum circle, or a torque spec on the bench. What else you working on?"; } },
  { id: "bye", keys: { bye: 3, goodbye: 3, later: 2, peace: 2, "see you": 3 },
    answer: function () { return "Stay lifted and stay legal, friend. ✌️ The garden gate is always open — come back when the leaves talk to you."; } },
  { id: "who", keys: { "who are you": 4, "your name": 3, goddess: 2, budtender: 1 },
    answer: function () { return "I'm the <b>GanjaGoddess</b> — the voice of ReeferDude.com and PotGrowHub.store. Part streetwise hustler, part yogi healer, part science nerd, all budtender. 🧞 I answer from a knowledge base baked right into this page — no cloud, no sign-up, just game. Ask me about strains, grows, gear, or prices."; } },
  { id: "help", keys: { help: 3, "what can you do": 4, topics: 3, menu: 2, options: 2, "how does this work": 3 },
    answer: function () { return "Here's my menu, friend:<br>• <b>Strain picks</b> — “best strain for sleep / pain / creativity / focus”<br>• <b>Strain facts</b> — name any strain in the vault<br>• <b>Grow game</b> — germination, veg, flower, harvest, drying & curing<br>• <b>Plant doctor</b> — yellow leaves, spots, wilting, mold, pests<br>• <b>Dial-it-in</b> — VPD, pH, nutrients, lighting, watering<br>• <b>Shop talk</b> — gear, prices, digital guides, booking a consult<br>Pick a lane and let's roll. 🌿"; } },
  { id: "sleep", keys: { sleep: 3, insomnia: 4, "fall asleep": 4, sleepy: 3, bedtime: 3, nighttime: 2, "knock me out": 3, "couch lock": 3, couchlock: 3 },
    answer: function () { return effectAnswer("😴 <b>For sleep, go indica-heavy and dose about an hour before bed:</b>", ["sleepy"], "Heavy landrace indicas like Northern Lights and Hindu Kush are the classic lights-out picks — THC-heavy, body-first, mind-quiet.") + RESP_NOTE; } },
  { id: "pain", keys: { pain: 4, ache: 3, aches: 2, arthritis: 4, backache: 4, cramps: 3, migraine: 4, migraines: 4, inflammation: 3, sore: 2 },
    answer: function () { return effectAnswer("💆 <b>For aches and pain, these carry the strongest relief reputations:</b>", ["pain relief"], "Also look at the CBD squad — <b>Harlequin</b> and <b>ACDC</b> bring real relief with a clear head for daytime.") + RESP_NOTE; } },
  { id: "anxiety", keys: { anxiety: 4, anxious: 4, stress: 3, stressed: 3, calm: 3, relax: 2, relaxing: 2, paranoid: 3, paranoia: 3 },
    answer: function () { return effectAnswer("🕊️ <b>For stress and anxiety, keep THC moderate and CBD in the mix:</b>", ["calm", "relaxed"], "Pro move: high-THC sativas can spin anxiety UP for some folks. CBD-forward picks like <b>Harlequin</b> and <b>ACDC</b> are the gentle lane.") + RESP_NOTE; } },
  { id: "creativity", keys: { creative: 4, creativity: 4, art: 2, music: 2, writing: 2, ideas: 2, artistic: 3 },
    answer: function () { return effectAnswer("🎨 <b>For creativity, you want an uplifted, cerebral buzz — not couch lock:</b>", ["creative"], "Blue Dream and Jack Herer are the studio-session legends — sparks fly, body stays light."); } },
  { id: "energy", keys: { energetic: 3, energy: 3, focus: 3, focused: 3, productive: 3, daytime: 3, "wake and bake": 4, motivation: 3, "get things done": 3 },
    answer: function () { return effectAnswer("⚡ <b>For daytime energy and focus, ride the sativa side:</b>", ["energetic", "focused"], "Green Crack and Durban Poison are pure get-up-and-go. Microdose if you want the focus without the liftoff."); } },
  { id: "appetite", keys: { appetite: 3, munchies: 3, hungry: 2, "stimulate appetite": 4 },
    answer: function () { return effectAnswer("🍔 <b>Munchie-grade picks — keep snacks within arm's reach:</b>", ["hungry"], "Classic indica move: dose 30–60 minutes before the meal you want to enjoy."); } },
  { id: "beginner_gear", keys: { beginner: 3, "first grow": 4, "first time": 3, "what should a beginner buy": 5, "starter kit": 3, "what do i need": 3, equipment: 2, setup: 2, "getting started": 3 },
    answer: function () { return "🎒 <b>Beginner loadout, in buy order:</b><br>1. Tent (2×4 or 4×4) — light-proof and sturdy.<br>2. Quality LED bar — budget 30–40 true watts per sq ft for flower.<br>3. Inline fan + carbon filter sized to your tent (the Studio page calculates CFM).<br>4. Fabric pots + good soil or coco.<br>5. pH pen, thermometer/hygrometer — the two tools that save more grows than any nutrient.<br>6. A simple 2–3 part nutrient line.<br>Then an easy strain — Northern Lights or Pineapple Express forgive beginner mistakes. The Hustle Shop page has the gear cards lined up. 🛒"; } },
  { id: "germination", keys: { germination: 4, germinate: 4, sprout: 3, "pop seeds": 4, "start seeds": 4, taproot: 3 },
    answer: function () { return "🌱 <b>Germination, the reliable way:</b> damp (not soaked) paper towel, seed between the layers, into a sealed bag or covered plate, warm and dark at 70–80°F. Taproots pop in 24–72 hours. Plant root-down, ¼ inch deep, keep the medium moist like a wrung sponge. Alternative that skips transplant shock: sow straight into the final medium. Light comes AFTER the sprout breaks surface — 18/6 from day one above ground."; } },
  { id: "veg", keys: { vegetative: 4, veg: 3, "veg stage": 4, "18 6": 3, "light schedule": 2 },
    answer: function () { return "🌿 <b>Veg stage:</b> 18 hours light / 6 dark, temps 70–82°F, humidity 55–70%, VPD 0.8–1.2 kPa. Feed nitrogen-forward nutrients, train early (topping + LST) to build a flat, even canopy. Veg length is your choice — the plant roughly doubles in flower, so flip when it's about half your target height. Healthy veg = boring veg: steady new growth, no drama."; } },
  { id: "flower", keys: { flowering: 3, flower: 2, bloom: 3, "flip to flower": 4, "12 12": 4, "bud sites": 3 },
    answer: function () { return "🌸 <b>Flowering:</b> switch lights to 12/12 — unbroken darkness matters, light leaks cause hermies. First 2–3 weeks are the stretch. Feed bloom nutrients (lower N, higher P/K), aim VPD 1.2–1.6 kPa, ease humidity down to 40–50% late flower to dodge bud rot. Buds stack and fatten weeks 4–7; most strains finish in 7–11 weeks. Patience in the last two weeks is where the weight lives."; } },
  { id: "harvest", keys: { harvest: 4, "when to chop": 4, chop: 3, trichomes: 4, trichome: 4, "ready to harvest": 4, pistils: 2 },
    answer: function () { return "✂️ <b>Harvest timing is a trichome read, not a calendar read.</b> Get a 60× loupe: clear trichomes = too early, mostly <b>cloudy</b> = peak THC and energy, cloudy + 20–30% <b>amber</b> = the balanced sweet spot, heavy amber = sleepier, sedative flower. Pistils mostly browned and curled is your supporting clue. When in doubt, wait 3 days and look again — early chops cost you weight AND potency."; } },
  { id: "dry_cure", keys: { drying: 4, cure: 4, curing: 4, burping: 3, jars: 2, "dry my buds": 4, "hay smell": 3 },
    answer: function () { return "🏺 <b>Dry slow, cure slower:</b> hang whole plants or branches at ~60°F and 60% RH, dark, gentle airflow (never a fan straight on buds). 10–14 days until small stems snap, not bend. Then trim into glass jars at 62% RH — burp daily for 2 weeks, then weekly. Hay smell = dried too fast or too hot; the cure is where smooth flavor is born. Rush this and you smoke your harvest's potential away."; } },
  { id: "lighting", keys: { lighting: 3, led: 3, ppfd: 4, watts: 3, wattage: 3, hps: 3, "light distance": 4, lumens: 3, light: 2, par: 2 },
    answer: function () { return "💡 <b>Lighting math that actually works:</b> think PPFD, not lumens. Seedlings 200–300, veg 400–600, flower 600–900 µmol/m²/s (up to ~1200 with CO₂). In watts: quality LED at 30–40W per sq ft covers flower. Hanging distance: follow the maker's PPFD map — typically 12–24 in flower for bar LEDs. Photoperiod: 18/6 veg, 12/12 flower. The Grow Studio page turns your tent size into a watt target instantly."; } },
  { id: "nutrients", keys: { nutrients: 3, nutrient: 3, feeding: 3, fertilizer: 3, ppm: 3, npk: 4, deficiency: 3, "nutrient burn": 4, feed: 2 },
    answer: function () { return "🧪 <b>Feeding fundamentals:</b> start at ¼–½ the bottle's strength — more plants die of love (overfeeding) than hunger. Veg wants nitrogen; flower wants phosphorus + potassium. Watch EC/PPM in coco/hydro; soil growers feed lighter and let the medium buffer. Tips of leaves browning and clawing = nutrient burn: back off and flush with plain pH'd water. Feed schedule rule: water, water, feed — never chase a deficiency with a double dose."; } },
  { id: "ph", keys: { ph: 4, "ph level": 4, acidic: 2, alkaline: 2, "lockout": 3 },
    answer: function () { return "🧫 <b>pH — the silent harvest killer:</b> soil 6.0–6.5, coco/hydro 5.8–6.2. Outside the band, nutrients lock out even when they're present — the plant starves at a full table. Measure runoff/solution, adjust in small steps with pH up/down, and calibrate your pen monthly. Half the 'deficiencies' I get asked about are just pH lockout wearing a costume."; } },
  { id: "vpd", keys: { vpd: 5, "vapor pressure": 4 },
    answer: function () { return "🌡️ <b>VPD — vapor pressure deficit — is how the plant feels the room.</b> Targets: seedlings/clones 0.4–0.8 kPa, veg 0.8–1.2, flower 1.2–1.6. Too low = slow drinking, mold risk; too high = stressed stomata, crisp tips. It's temp AND humidity together — slide both around on the <b>Grow Studio</b> page and watch your live VPD readout. The VPD Master Pack in Digital Drops has the full charts."; } },
  { id: "watering", keys: { watering: 4, overwatering: 4, underwatering: 4, "how often": 1, water: 2 },
    answer: function () { return "💧 <b>Watering — the #1 beginner killer is kindness.</b> Lift the pot: light = thirsty, heavy = wait. In soil, water thoroughly until 10–20% runoff, then let the top inch dry before the next round. Droopy + heavy pot = overwatered (roots drowning — let it dry out). Droopy + light pot = thirsty (water now, it perks up in hours). Roots want oxygen as much as water."; } },
  { id: "yellow_leaves", keys: { yellow: 3, yellowing: 4, chlorosis: 4, pale: 2 },
    answer: function () { return "🩺 <b>Yellow leaves — read the pattern:</b><br>• Lower/older leaves yellowing evenly in late veg or flower → usually nitrogen hunger (or natural senescence late in flower).<br>• New growth pale/yellow → iron or sulfur lockout — check pH first.<br>• Yellowing between veins → magnesium; try cal-mag at label strength.<br>• Whole plant pale + slow → underfeeding or root trouble.<br>Always check pH before adding anything — 6.0–6.5 soil, 5.8–6.2 coco/hydro. A photo-worthy diagnosis needs the pattern, so tell me WHERE it's yellow — top or bottom?"; } },
  { id: "spots", keys: { spots: 4, spot: 2, brown: 2, rust: 3, "brown spots": 5, holes: 2, necrotic: 3 },
    answer: function () { return "🩺 <b>Spots on leaves — the usual suspects:</b><br>• Rusty/brown spots mid-leaf, often with yellowing → calcium deficiency or pH lockout (check pH, then cal-mag).<br>• Tiny speckles that multiply, fine webbing underneath → spider mites (flip a leaf and look close).<br>• White powdery patches → powdery mildew, a different beast.<br>• Crispy brown edges only → potassium or light/heat stress.<br>Start with pH and a close look under the leaves — that solves the mystery 8 times out of 10."; } },
  { id: "wilting", keys: { wilting: 4, drooping: 3, droopy: 3, limp: 3, wilt: 4 },
    answer: function () { return "🩺 <b>Wilting triage — one question first: is the pot heavy or light?</b><br>• Light pot + dry soil → underwatered. Water deeply; recovery in hours.<br>• Heavy pot + wet soil → overwatered / root stress. Stop watering, let it dry, boost airflow at the base. Persistent mushy stems = root rot territory.<br>• Wilts only at lights-off, perks up after → normal sleep movement, no panic.<br>Droop is a symptom, not a diagnosis — the pot weight tells the truth."; } },
  { id: "mold", keys: { mold: 4, mildew: 5, "powdery mildew": 5, "bud rot": 5, rot: 3, fuzzy: 2, "white powder": 4 },
    answer: function () { return "🩺 <b>Mold is the emergency room.</b><br>• <b>Powdery mildew</b> (white dusty patches): remove infected leaves, raise airflow, drop humidity under 50%, treat with potassium bicarbonate or a sulfur spray (never on flowers near harvest).<br>• <b>Bud rot</b> (gray/brown mush inside buds): cut it out WIDE — an inch past the visible rot — bag it, don't shake spores around. Infected buds are trash, not smoke.<br>Prevention forever: RH 40–50% in late flower, moving air through the canopy, defoliate the jungle zones."; } },
  { id: "pests", keys: { mites: 4, "spider mites": 5, gnats: 4, aphids: 4, bugs: 3, pests: 4, thrips: 4, webs: 2, insects: 3 },
    answer: function () { return "🩺 <b>Pest control, street-smart:</b><br>• <b>Spider mites</b> — speckled leaves, webs underneath. Blast leaf undersides with water, then neem or insecticidal soap every 3 days × 3 rounds. Never in late flower if you can avoid it.<br>• <b>Fungus gnats</b> — let soil dry deeper, yellow sticky traps for adults, BTI (mosquito bits tea) for larvae.<br>• <b>Aphids</b> — water blast + soap spray; ladybugs if you're fancy.<br>Rule of the garden: quarantine new plants, inspect weekly with a loupe, and treat early — wars are won in week one."; } },
  { id: "curling", keys: { curling: 4, claw: 4, curled: 3, canoeing: 4, taco: 3, "leaf edges": 2 },
    answer: function () { return "🩺 <b>Leaf curl decoder:</b><br>• Downward 'claw', dark green, burnt tips → nitrogen toxicity / overfeeding. Flush with plain pH'd water, ease back to ½ feed.<br>• Edges curling UP like a taco/canoe → heat or light stress, or low humidity. Raise the light, check temps at canopy level, bump RH.<br>• Whole-leaf twisty new growth → check pH drift and broad mites (loupe time).<br>The direction of the curl points at the culprit."; } },
  { id: "stretch", keys: { stretching: 3, stretchy: 3, lanky: 4, leggy: 4, "too tall": 3, "growing tall": 2 },
    answer: function () { return "🩺 <b>Stretchy, lanky plants are begging for light.</b> Long gaps between nodes = the light is too far, too weak, or too blue-poor. Fix: lower/raise intensity to hit veg PPFD 400–600, top the plant to force side branching, add LST to keep the canopy flat. In flower, the first 2–3 weeks of stretch are genetics — plan for a plant that doubles before you flip to 12/12."; } },
  { id: "environment", keys: { temperature: 3, humidity: 4, humidifier: 3, dehumidifier: 3, heat: 3, cold: 2, "too hot": 3 },
    answer: function () { return "🌡️ <b>Environment cheat sheet:</b> day temps 72–82°F (lights on), 5–10° cooler at night. Humidity by stage: seedlings 65–75%, veg 55–70%, early flower 45–55%, late flower 40–50%. Those two numbers together make VPD — seedlings 0.4–0.8, veg 0.8–1.2, flower 1.2–1.6 kPa. Play with your exact combo on the Grow Studio page and it'll score you live."; } },
  { id: "smell", keys: { smell: 3, odor: 4, stealth: 3, "carbon filter": 3, neighbors: 2, discreet: 3 },
    answer: function () { return "🤫 <b>Stealth ops:</b> a properly sized carbon filter + inline fan scrubbing the tent's air is 90% of the game — negative pressure keeps smell IN the tent, filter eats it on the way out. Size the fan with the Studio's CFM readout, seal tent seams, and pick lower-odor genetics (Northern Lights is famously quiet). Ona gel outside the room is backup, never the plan."; } },
  { id: "grow_how", keys: { "how do i grow": 4, "how to grow": 4, "grow it": 3, "grow this": 3, growing: 2, "grow guide": 3 },
    answer: function (ctx) {
        const s = ctx.lastStrain ? strainByName(ctx.lastStrain) : null;
        if (s) return strainGrowAnswer(s);
        return "🌱 <b>The full cycle in one breath:</b> germinate warm/dark → veg 18/6 light, VPD 0.8–1.2, train flat → flip 12/12 for flower, VPD 1.2–1.6 → read trichomes, harvest cloudy/amber → dry 60°F/60% RH for 10–14 days → cure in jars 2–4 weeks. Tell me a strain name and I'll give you its personal playbook — or hit the Strain Lab.";
      } },
  { id: "seeds_clones", keys: { clone: 3, clones: 3, "seed or clone": 5, seeds: 2, "seed bank": 3 },
    answer: function () { return "🌱 <b>Seeds vs clones:</b> seeds give you a taproot, genetic variety, and a clean start (no inherited pests) — but phenotypes vary. Clones are genetic copies: known traits, faster veg, but they carry whatever the mother had — inspect and quarantine. Beginners: feminized seeds from a reputable bank remove the male-hunting chore. The Seed Vault card in the Shop points the way."; } },
  { id: "shop", keys: { price: 3, prices: 3, cost: 2, buy: 2, shop: 2, tent: 2, "grow tent": 3, store: 2 },
    answer: function () { return "🛒 <b>The Hustle Shop</b> (Shop page) lines up six vouched-for picks: Pro Grow Tent Kit, Full-Spectrum LED Bar, Inline Fan + Carbon Filter, Nutrient Power Trio, Premium Seed Vault Picks, and Grinder & Gear Essentials. Buttons carry live prices at the partner stores when the affiliate lanes are on. Want a recommendation for YOUR space? Tell me your tent size, or run it through the Grow Studio first — it sizes your light and fan for free."; } },
  { id: "booking", keys: { book: 3, booking: 4, consult: 4, consultation: 4, appointment: 4, session: 2, "talk to ray": 3, "talk to the dude": 3 },
    answer: function () { return "🎓 <b>1:1 Grow Consultations</b> live on the Book / Contact page — 30 minutes, your grow, your questions: setup planning, troubleshooting, or a full room design. There's also a 'Get Matched Locally' form there if you need a trusted shop near you. If the booking button says 'Bookings Open Soon', the calendar lane is being switched on — the form still reaches the Dude."; } },
  { id: "digital", keys: { ebook: 4, "grow bible": 5, guide: 2, "vpd pack": 5, journal: 3, download: 3, pdf: 3, digital: 2 },
    answer: function () { return "📚 <b>Digital Drops</b> (Digital page) — instant downloads, no shipping: <b>The Reefer Dude Grow Bible</b> $19 (seed-to-smoke playbook), <b>VPD Master Pack</b> $9 (charts + worksheets), <b>Strain Journal Pro</b> $7 (track every strain you grow or smoke). They drop through Gumroad the moment the lane is live — buttons on the page say 'Dropping Soon' until then."; } },
  { id: "membership", keys: { membership: 4, join: 3, subscribe: 3, kofi: 4, "ko fi": 4, tiers: 3, "seed starter": 4, support: 2 },
    answer: function () { return "🌿 <b>The Grow Circle</b> (Join page): Seed Starter $19/mo, Master Grower $49/mo, Ganjapreneur $99/mo — community, game, and the good stuff first. One-time tips ride the same Ko-fi button. If it reads 'Support Page Coming Soon', that lane is mid-ignition — check back right here."; } },
  { id: "shipping", keys: { shipping: 3, ship: 2, delivery: 3, deliver: 2 },
    answer: function () { return "📦 Straight answer: <b>digital products</b> deliver instantly by download — no truck involved. <b>Gear</b> ships from the partner store you check out with, on their terms. We run a zero-inventory ghost marketplace, so nothing ships from a garage — everything routes through the seller who stocks it."; } },
  { id: "legal", keys: { legal: 3, illegal: 3, law: 2, laws: 2, allowed: 1 },
    answer: function () { return "⚖️ Real talk: cannabis and hemp law is a patchwork — federal, state, and local rules all differ, and they move. Hemp-derived products got room from the 2018 Farm Bill, but your state and city have their own say on growing, possession, and sales. I'm a budtender, not a lawyer — check your local rules before you plant or sell, and keep it compliant. The hustle lasts longer when it's legal. 🌿"; } },
  { id: "joke", keys: { joke: 3, funny: 2, "make me laugh": 4, humor: 2 },
    answer: function () { return "😂 Why did the grower break up with the calendar? Too many dates, not enough light cycles. …I'll stick to budtending. Ask me something with leaves on it."; } }
];

const FALLBACKS = [
  "🌿 Hmm — that one's outside my baked-in playbook, and I'd rather tell you straight than freestyle bad advice. I AM sharp on: strain picks (sleep, pain, creativity, focus), plant diagnosis (yellow leaves, spots, wilting, mold, pests), grow stages, VPD, pH, nutrients, lighting, watering, gear, prices, and booking. Rephrase it one of those ways and I'm locked in.",
  "🧞 The Goddess squints… that question lives beyond my built-in vault. Try me with a strain name, a symptom ('yellow leaves', 'spots', 'drooping'), or a stage ('germination', 'flowering', 'harvest') and I'll open the right drawer."
];
let fallbackFlip = false;

function budtenderReply(rawText) {
  const norm = normalizeText(rawText);
  const tokens = tokenSet(norm);

  // follow-up: "how do I grow it?" with a strain in context
  const growPhrase = norm.indexOf("grow it") !== -1 || norm.indexOf("grow that") !== -1 || norm.indexOf("grow this") !== -1 ||
                     norm.indexOf("how do i grow") !== -1 || norm.indexOf("how to grow") !== -1;
  if (growPhrase && BUD_CTX.lastStrain) {
    const s = strainByName(BUD_CTX.lastStrain);
    if (s) { BUD_CTX.lastIntent = "grow_strain"; return { text: strainGrowAnswer(s), chips: ["What light do I need?", "VPD help", "Show me gear"] }; }
  }

  // direct strain mention
  const mentioned = findStrainInText(norm);
  if (mentioned && !/^(best|good|recommend)/.test(norm)) {
    BUD_CTX.lastIntent = "strain";
    return { text: strainProfileAnswer(mentioned), chips: ["How do I grow it?", "Best strain for sleep", "What should a beginner buy?"] };
  }

  // intent scoring
  let best = null, bestScore = 0;
  for (const intent of INTENTS) {
    let score = 0;
    for (const key in intent.keys) {
      if (key.indexOf(" ") !== -1) { if (norm.indexOf(key) !== -1) score += intent.keys[key]; }
      else if (tokens.has(key)) score += intent.keys[key];
    }
    if (score > bestScore) { bestScore = score; best = intent; }
  }
  if (best && bestScore >= 3) {
    BUD_CTX.lastIntent = best.id;
    const chipsByIntent = {
      sleep: ["How do I grow it?", "Best strain for pain", "Strain for creativity"],
      pain: ["Best strain for sleep", "What is ACDC?", "Book a consult"],
      vpd: ["Open the Grow Studio", "Humidity help", "Yellow leaves?"],
      yellow_leaves: ["Brown spots", "Wilting plant", "Pests on my plant"],
      beginner_gear: ["Best strain for a beginner", "Germination help", "Open the Grow Studio"]
    };
    return { text: best.answer(BUD_CTX), chips: chipsByIntent[best.id] || null };
  }
  // a strain was named inside a low-scoring message — still answer it
  if (mentioned) {
    BUD_CTX.lastIntent = "strain";
    return { text: strainProfileAnswer(mentioned), chips: ["How do I grow it?", "Best strain for sleep"] };
  }
  fallbackFlip = !fallbackFlip;
  return { text: FALLBACKS[fallbackFlip ? 0 : 1], chips: null };
}

/* ================================================================
   BUDTENDER CHAT UI — voice in/out (Web Speech), localStorage
   ================================================================ */
const DEFAULT_CHIPS = ["Best strain for sleep", "Yellow leaves?", "VPD help", "What should a beginner buy?", "Tell me about Blue Dream", "How do I germinate seeds?"];
const CHIP_ROUTES = { "Open the Grow Studio": "studio", "Show me gear": "shop" };
const BUD_GREETING = "🌿✌️ Peace, I'm the <b>GanjaGoddess</b> — budtender of this garden. Straight talk before we spark: I'm an expert system answering from a knowledge base built into this page, not a cloud AI — so my game is deep on strains, growing, and gear, and I'll tell you plain when a question lives outside the vault. Ask me anything green.";
let ttsOn = false;

function budLoad() {
  try {
    const raw = localStorage.getItem(BUD_STORE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (data && data.lastStrain) BUD_CTX.lastStrain = data.lastStrain;
    return (data && data.msgs) || [];
  } catch (e) { return []; }
}
function budSave(msgs) {
  try { localStorage.setItem(BUD_STORE_KEY, JSON.stringify({ msgs: msgs.slice(-60), lastStrain: BUD_CTX.lastStrain })); } catch (e) {}
}
function stripForSpeech(html) {
  const d = document.createElement("div");
  d.innerHTML = html;
  return (d.textContent || "").replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, "").replace(/\s+/g, " ").trim();
}
function speak(text) {
  if (!ttsOn || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(stripForSpeech(text));
    u.rate = 1.02;
    window.speechSynthesis.speak(u);
  } catch (e) {}
}
function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function initChat() {
  const log = document.getElementById("chat-log");
  if (!log) return;
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");
  const chipsBox = document.getElementById("chat-chips");
  const micBtn = document.getElementById("chat-mic");
  const ttsBtn = document.getElementById("chat-tts");
  const clearBtn = document.getElementById("chat-clear");
  const voiceNote = document.getElementById("chat-voice-note");
  let msgs = budLoad();

  function bubble(role, html) {
    const wrap = document.createElement("div");
    if (role === "user") {
      wrap.className = "justify-self-end max-w-[85%] bg-amber-600/90 text-white rounded-2xl rounded-br-sm px-4 py-3";
      wrap.textContent = html;
    } else {
      wrap.className = "justify-self-start max-w-[88%] bg-emerald-900/70 border border-emerald-800 rounded-2xl rounded-bl-sm px-4 py-3 text-stone-100";
      wrap.innerHTML = html;
    }
    log.appendChild(wrap);
    log.scrollTop = log.scrollHeight;
    return wrap;
  }
  function renderChips(chips) {
    chipsBox.innerHTML = "";
    (chips || DEFAULT_CHIPS).forEach(function (c) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "neo-box px-3 py-2 bg-stone-800 hover:bg-stone-700 rounded-full text-xs font-bold text-amber-300";
      b.textContent = c;
      b.addEventListener("click", function () {
        if (CHIP_ROUTES[c]) { goTo(CHIP_ROUTES[c]); return; }
        handleUserText(c);
      });
      chipsBox.appendChild(b);
    });
  }
  function handleUserText(text) {
    const clean = (text || "").trim();
    if (!clean) return;
    msgs.push({ role: "user", text: clean });
    bubble("user", clean);
    budSave(msgs);
    const typing = bubble("bot", "🌿 <i>thinking…</i>");
    setTimeout(function () {
      const reply = budtenderReply(clean);
      msgs.push({ role: "bot", text: reply.text });
      typing.innerHTML = reply.text;
      log.scrollTop = log.scrollHeight;
      budSave(msgs);
      renderChips(reply.chips || DEFAULT_CHIPS);
      speak(reply.text);
    }, 420);
  }

  // restore history or greet
  if (msgs.length) {
    msgs.forEach(function (m) { bubble(m.role, m.text); });
  } else {
    msgs.push({ role: "bot", text: BUD_GREETING });
    bubble("bot", BUD_GREETING);
    budSave(msgs);
  }
  renderChips(DEFAULT_CHIPS);

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    const v = input.value;
    input.value = "";
    handleUserText(v);
  });

  clearBtn.addEventListener("click", function () {
    if (!window.confirm("Clear your chat history with the Budtender?")) return;
    msgs = [];
    try { localStorage.removeItem(BUD_STORE_KEY); } catch (e) {}
    log.innerHTML = "";
    msgs.push({ role: "bot", text: BUD_GREETING });
    bubble("bot", BUD_GREETING);
    budSave(msgs);
    renderChips(DEFAULT_CHIPS);
  });

  // ---- voice replies (TTS) ----
  if (!("speechSynthesis" in window)) {
    ttsBtn.disabled = true; ttsBtn.style.opacity = "0.5";
    ttsBtn.title = "Voice replies are not supported in this browser.";
  }
  ttsBtn.addEventListener("click", function () {
    ttsOn = !ttsOn;
    ttsBtn.setAttribute("aria-pressed", ttsOn ? "true" : "false");
    ttsBtn.textContent = ttsOn ? "🔊 Voice replies: ON" : "🔇 Voice replies: OFF";
    if (ttsOn) speak("Voice replies on. Ask me something green.");
    else if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  });

  // ---- voice input (speech recognition) ----
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    micBtn.disabled = true; micBtn.style.opacity = "0.5";
    micBtn.title = "Voice input is not supported in this browser (Chrome works best).";
    voiceNote.textContent = "🎤 Voice input isn't supported in this browser — typing works great. Voice replies need the toggle above.";
  } else {
    const rec = new SR();
    rec.lang = "en-US"; rec.interimResults = false; rec.maxAlternatives = 1;
    let listening = false;
    rec.addEventListener("result", function (ev) {
      const said = ev.results[0][0].transcript;
      input.value = said;
      handleUserText(said);
      input.value = "";
    });
    rec.addEventListener("end", function () { listening = false; micBtn.classList.remove("bg-red-600"); micBtn.classList.add("bg-amber-600"); });
    rec.addEventListener("error", function () { listening = false; micBtn.classList.remove("bg-red-600"); micBtn.classList.add("bg-amber-600"); voiceNote.textContent = "🎤 Didn't catch that — try again or type it."; });
    micBtn.addEventListener("click", function () {
      if (listening) { rec.stop(); return; }
      try { rec.start(); listening = true; micBtn.classList.remove("bg-amber-600"); micBtn.classList.add("bg-red-600"); voiceNote.textContent = "🎤 Listening… speak now."; }
      catch (e) {}
    });
  }

  // entry point used by the Strain Lab
  window.askBudtender = function (q) {
    goTo("budtender");
    setTimeout(function () { handleUserText(q); }, 200);
  };
}

/* ================================================================
   INIT
   ================================================================ */
initMoney();
initRouter();
initStudio();
initLab();
initChat();

})();
