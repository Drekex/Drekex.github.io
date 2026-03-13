(() => {
  /* ========= BASIC UI ========= */

  // Year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const links = document.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    links.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        if (links.classList.contains("open")) {
          links.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    });

    document.addEventListener("click", (e) => {
      if (!links.classList.contains("open")) return;
      const withinNav = e.target.closest(".nav");
      const withinToggle = e.target.closest(".nav-toggle");
      if (!withinNav && !withinToggle) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Lead form -> mailto (no backend)
  const form = document.getElementById("leadForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get("name") || "").toString().trim();
      const reply = (data.get("reply") || "").toString().trim();
      const service = (data.get("service") || "").toString().trim();
      const message = (data.get("message") || "").toString().trim();

      const subject = encodeURIComponent(`[Raymond PC] Demande - ${service || "Service"}`);
      const body = encodeURIComponent(
        `Nom: ${name}\nContact: ${reply}\nService: ${service}\n\nDétails:\n${message}\n`
      );

      window.location.href = `mailto:raymondservicepc@outlook.com?subject=${subject}&body=${body}`;
    });
  }

  /* ========= LANGUAGE TOGGLE (FIXED) ========= */

  const langBtn = document.getElementById("langToggle");

  // Minimal EN translations for key sections (keeps your FR as default)
  const I18N = {
    fr: {}, // FR is already written in HTML
    en: {
      "contact.addr": "Address",
      "contact.direct": "Direct contact",
      "contact.email": "Email",
      "contact.facebookText": "Message me on Facebook",
      "contact.fb": "Facebook",
      "contact.formTitle": "Send a request",
      "contact.msg": "Details (budget, parts, symptoms)",
      "contact.name": "Name",
      "contact.opt1": "Basic build",
      "contact.opt2": "Gaming build",
      "contact.opt3": "Upgrade / maintenance",
      "contact.opt4": "Troubleshooting",
      "contact.opt5": "SFF / custom",
      "contact.phMsg": "e.g., Budget $1200, 1440p, quiet PC. Or: game crashes, GPU temps 90°C…",
      "contact.phName": "Your name",
      "contact.phReply": "e.g., 514-000-0000 or email@example.com",
      "contact.pick": "Choose…",
      "contact.privacy": "By sending, you agree to be contacted about this request. No spam.",
      "contact.reply": "Phone or email",
      "contact.send": "Send",
      "contact.sms": "SMS",
      "contact.subtitle": "Describe your project (budget, goals, parts list). Usually replies within 24h.",
      "contact.tipD": "Copy/paste your parts list (PCPartPicker) or your budget + goals.",
      "contact.tipT": "Tip:",
      "contact.title": "Contact / Quote",
      "contact.type": "Service type",
      "contact.whatsappText": "Message on WhatsApp (fast)",
      "faq.a1": "Yes! Share your budget, resolution/games, and goals — I’ll suggest a balanced, compatible build.",
      "faq.a2": "By default, PCs can be delivered with Windows installed and activated. On request, I can also install Linux or leave Windows unactivated.",
      "faq.a3": "Yes, on request. Compact builds often need more planning (clearances, airflow, cables). For mini-PCs, I can sometimes improve an existing model if possible.",
      "faq.a4": "Either your parts list (cart link or PCPartPicker), or your budget + goals. For troubleshooting: symptoms + photos.",
      "faq.q1": "Can you recommend parts within my budget?",
      "faq.q2": "Is Windows included?",
      "faq.q3": "Do you do SFF / mini-PC?",
      "faq.q4": "What should I send for a quick quote?",
      "faq.subtitle": "The most common questions.",
      "faq.title": "FAQ",
      "footer.area": "Blainville, QC",
      "service_area_title": "Service area",
      "service_area_text": "Blainville, Laval, Mirabel & surrounding areas",
      "service_area_option1": "Local delivery available",
      "service_area_option2": "In-person pickup by appointment",
      "service_area_note": "Address shared after service confirmation.",
      "footer.top": "Back to top",
      "hero.b1": "50+ builds completed",
      "hero.b2": "Verified 5★ reviews (Facebook Marketplace)",
      "hero.b3": "BIOS, Windows, drivers, stability & temperatures",
      "hero.c1d": "Part selection, clearance checks, PSU sizing, airflow.",
      "hero.c1t": "Compatibility checked",
      "hero.c2d": "Temps, CPU/GPU load, RAM, storage.",
      "hero.c2t": "Stability testing",
      "hero.c3d": "Fan curves + simple tweaks to reduce noise.",
      "hero.c3t": "Quieter setup",
      "hero.cardCta": "Describe my project",
      "hero.cardNote": "SFF / retro / troubleshooting: price on request.",
      "hero.cardSubtitle": "A clean, reliable PC that’s ready to use.",
      "hero.cardTitle": "What you get",
      "hero.cta1": "Request a quote",
      "hero.cta2": "See pricing",
      "hero.eyebrow": "Local • Reliable • Optimized",
      "hero.lead": "Gaming or productivity: I help pick parts, build clean, stress test, and optimize noise and temperatures for a stable PC long-term.",
      "hero.micro": "Fast reply by SMS/email. Based in Blainville near Fontainebleau. Service around Laval/Montreal North depending on the project.",
      "hero.title": "Custom PC builds, upgrades, and troubleshooting without the stress.",
      "meta.desc": "Custom PC builds, upgrades and troubleshooting. 50+ builds completed, verified 5★ reviews. Windows install, BIOS, stress tests, noise/temp optimization.",
      "meta.title": "Raymond PC - Builds, upgrades & troubleshooting (Blainville / Laval / Montréal)",
      "nav.cta": "Get a quote",
      "nav.faq": "FAQ",
      "nav.pricing": "Pricing",
      "nav.proof": "Why me",
      "nav.reviews": "Reviews",
      "nav.process": "How it works",
      "nav.services": "Services",
      "nav.fit": "Best fit",
      "nav.qa": "Before handoff",
      "nav.how": "How it works",
      "nav.work": "Builds",
      "pricing.badge": "Most popular",
      "pricing.cta": "I want this package",
      "pricing.cta2": "Get a quote",
      "pricing.cta3": "Describe my issue",
      "pricing.footer": "Tip: send a parts list / budget / photos (for troubleshooting) for a faster estimate.",
      "pricing.p1b1": "Full assembly",
      "pricing.p1b2": "Windows install (not activated if needed)",
      "pricing.p1b3": "BIOS update",
      "pricing.p1b4": "Stability testing",
      "pricing.p1b5": "Essential drivers",
      "pricing.p1d": "For a standard, fast, clean build.",
      "pricing.p1t": "Basic build",
      "pricing.p2b1": "Everything in Basic build",
      "pricing.p2b2": "Cable management",
      "pricing.p2b3": "Quieter & cooler setup",
      "pricing.p2b4": "Basic GPU tuning (on request)",
      "pricing.p2b5": "RGB setup (on request)",
      "pricing.p2b6": "Gaming drivers",
      "pricing.p2d": "Extra finishing + optimization for a quieter, cleaner PC.",
      "pricing.p2t": "Gaming build",
      "pricing.p3b1": "Needs assessment",
      "pricing.p3b2": "Action plan",
      "pricing.p3b3": "Fix / upgrade",
      "pricing.p3b4": "Cleaning and dust removal",
      "pricing.p3d": "Ideal for mini-PC, SFF, retro-PC, or complex cases.",
      "pricing.p3price": "Price on request",
      "pricing.p3t": "Custom / SFF / troubleshooting",
      "pricing.subtitle": "Transparent. Prices may vary depending on complexity.",
      "pricing.title": "Simple pricing",
      "pricing.unit": "CAD",
      "proof.aB1": "Stability & temperatures validated",
      "proof.aB2": "Clean, sensible settings",
      "proof.aB3": "Easy explanations (no jargon)",
      "proof.aD": "Tests, checks, and clear configuration to avoid surprises.",
      "proof.aT": "Full testing",
      "proof.bB1": "Clear, justified pricing",
      "proof.bB2": "Parts/compatibility advice",
      "proof.bB3": "Noise/performance tuning on request",
      "proof.bD": "You know what’s done, why, and how much it costs. No surprises.",
      "proof.bT": "Local & transparent",
      "proof.subtitle": "Goal: a stable, quiet PC that’s ready to use and lasts.",
      "proof.title": "Why choose me",
      "reviews.note": "Privacy: names & profile photos may be blurred.",
      "reviews.title": "Customer reviews",
      "services.noteD": "GPU undervolt, light optimization, compact PC (SFF), retro PC.",
      "services.noteT": "Available on request:",
      "services.s1b1": "Full assembly",
      "services.s1b2": "BIOS & basic setup",
      "services.s1b3": "Essential drivers",
      "services.s1d": "Gaming/work. Clean build, ready to use.",
      "services.s1t": "Custom PC build",
      "services.s2b1": "Compatibility & best choices",
      "services.s2b2": "Quieter & cooler setup",
      "services.s2b3": "Stability tests after upgrade",
      "services.s2d": "GPU/CPU/RAM/SSD upgrades, cleaning, airflow improvements.",
      "services.s2t": "Upgrades & maintenance",
      "services.s3b1": "Clear diagnosis",
      "services.s3b2": "Parts replacement & recovery",
      "services.s3b3": "Advice to prevent it coming back",
      "services.s3d": "Blue screens, crashes, temps, instability, boot issues. If it can’t be fixed immediately, you still get a clear diagnosis and next steps.",
      "services.s3t": "Troubleshooting",
      "services.subtitle": "Pick a package, or request something custom.",
      "services.title": "Services",
      
"process.title": "How it works",
"process.subtitle": "Simple, clear, no surprises.",
"process.s1t": "Contact",
"process.s1d": "SMS / WhatsApp / form. Share your budget, goals, or symptoms.",
"process.s2t": "Quote",
"process.s2d": "I confirm compatibility, the plan, and the price before starting.",
"process.s3t": "Build / Fix",
"process.s3d": "Clean assembly, cables, cleaning/upgrade if needed.",
"process.s4t": "Tests & handoff",
"process.s4d": "Stability tests, temps, drivers. Ready to use.",
"process.tip": "Tip: a PCPartPicker link or photos (for troubleshooting) speeds up the estimate.",

"fit.title": "Best fit",
"fit.subtitle": "So it stays simple and pleasant on both sides.",
"fit.goodTitle": "Great fit if",
"fit.g1": "You want a stable, quiet PC with good airflow",
"fit.g2": "You like clear, honest communication",
"fit.g3": "You want to avoid surprises (tests, checks, QA)",
"fit.g4": "You want a clean build that’s ready to use",
"fit.badTitle": "Maybe not ideal if",
"fit.b1": "You’re chasing the absolute lowest price no matter the quality",
"fit.b2": "You want a quick build with no testing",
"fit.b3": "You want extreme overclocking with no compromises",
"fit.b4": "You don’t want to confirm the plan and budget before starting",

"qa.title": "Before handoff",
"qa.subtitle": "What I verify before handing you the PC.",
"qa.c1t": "Stability & temperatures",
"qa.c1b1": "Stability tests (CPU/GPU/RAM)",
"qa.c1b2": "Temperatures and airflow checked",
"qa.c1b3": "Essential drivers installed",
"qa.c1b4": "Boot and operation validated",
"qa.c2t": "Setup & cleanliness",
"qa.c2b1": "BIOS updated (if needed)",
"qa.c2b2": "Clean & safe cabling",
"qa.c2b3": "Simple fan curves (less noise)",
"qa.c2b4": "Basic maintenance tips",
      "trust.a": "PCs built",
      "trust.b": "Verified reviews",
      "trust.c": "Rigorous approach",
      "trust.d": "No fluff",
      "work.title": "Builds",
      "how.title": "How it works",
      "how.subtitle": "Simple, clear, no surprises.",
      "how.s1t": "Contact",
      "how.s1d": "SMS, WhatsApp, or the form. Share your budget / needs / symptoms.",
      "how.s2t": "Plan & quote",
      "how.s2d": "We confirm parts, compatibility, and pricing. No ambiguity.",
      "how.s3t": "Build / repair",
      "how.s3d": "Clean assembly, BIOS/Windows updates, drivers, and sensible settings.",
      "how.s4t": "Testing & handoff",
      "how.s4d": "Stability + temperature checks. Pickup by appointment or local delivery.",

      "fit.title": "Who this is best for",
      "fit.subtitle": "To avoid mismatched expectations, here’s the best fit.",
      "fit.goodT": "Great fit if you want:",
      "fit.g1": "A stable, quiet PC that lasts",
      "fit.g2": "Honest parts advice",
      "fit.g3": "Controlled temps + stress testing",
      "fit.badT": "Maybe not ideal if you:",
      "fit.b1": "Want the absolute cheapest no matter the quality",
      "fit.b2": "Expect same-day builds with no planning",
      "fit.b3": "Want extreme overclocking with zero compromise",

      "handover.title": "Before I hand over the PC",
      "handover.subtitle": "A quick QA checklist — to avoid surprises.",
      "handover.c1t": "Stability",
      "handover.c1b1": "CPU/GPU stress tests",
      "handover.c1b2": "RAM verified (XMP/EXPO)",
      "handover.c1b3": "No crashes/errors during testing",
      "handover.c2t": "Temps & noise",
      "handover.c2b1": "Temperatures kept under control",
      "handover.c2b2": "Clean fan curves",
      "handover.c2b3": "Airflow checked + cables tidy",
      "handover.c3t": "Setup",
      "handover.c3b1": "BIOS updated when relevant",
      "handover.c3b2": "Essential drivers installed",
      "handover.c3b3": "Windows ready (or unactivated on request)",
      "handover.noteT": "Troubleshooting:",
      "handover.noteD": "if something can’t be fixed on the spot, you still get a clear diagnosis + next steps."
,
      "planner.meta.title": "Raymond PC - Guided Build Planner",
      "planner.meta.desc": "A guided PC build planner to help you send a clear request based on your budget, PC tier, use case, and preferences.",
      "planner.back": "Back to main site",
      "planner.title": "Plan your build more easily.",
      "planner.lead": "This page helps you choose your preferences without locking you to exact parts whose pricing and availability can change.",
      "planner.b1": "Required: budget, PC tier, and use case",
      "planner.b2": "Optional fields can be left blank if you are unsure",
      "planner.b3": "The final request opens directly in your email app",
      "planner.cardTitle": "Why this works well",
      "planner.cardSubtitle": "Simple for customers, flexible for you.",
      "planner.card1t": "Easy to fill out",
      "planner.card1d": "Just enter your budget, PC tier, and use case if you do not know the parts listed.",
      "planner.card2t": "More visual",
      "planner.card2d": "Visual choices are easier for everyone to recognize.",
      "planner.card3t": "Clearer requests",
      "planner.card3d": "Having as much information as possible helps determine the perfect PC for your use case.",
      "planner.formTitle": "Build planner",
      "planner.formSubtitle": "Only the essentials are required. Everything else is optional.",
      "planner.budget": "Budget range",
      "planner.budgetHelp": "Required. Examples: 1000-1500, 2000, 2500-3000 CAD",
      "planner.budgetPh": "e.g. 1200-1800 CAD",
      "planner.tier": "PC tier",
      "planner.entry": "Entry",
      "planner.budgetTier": "Budget",
      "planner.mid": "Mid-Range",
      "planner.high": "High-End",
      "planner.maxed": "Maxed Out",
      "planner.useCase": "Use case",
      "planner.useCaseOther": "Other use case (if needed)",
      "planner.choicePlaceholder": "Choose…",
      "planner.gaming": "Gaming",
      "planner.work": "Work",
      "planner.gamingWork": "Gaming and work",
      "planner.videoEditing": "Video editing",
      "planner.ai": "AI",
      "planner.modeling": "3D modeling",
      "planner.simulations": "Simulations",
      "planner.browsing": "Browsing",
      "planner.otherChoice": "Other",
      "planner.useCasePh": "e.g. streaming + gaming, office work, engineering software...",
      "planner.cpu": "CPU family",
      "planner.gpu": "GPU family",
      "planner.ram": "Memory (RAM)",
      "planner.storage": "Storage",
      "planner.addStorage": "Add another drive",
      "planner.storageType": "Drive type",
      "planner.storageCapacity": "Capacity",
      "planner.storageNotes": "Optional note",
      "planner.storageNotesPh": "e.g. 1TB NVMe + 8TB HDD for media",
      "planner.wifi": "Wi-Fi usage",
      "planner.wifiPrimary": "Mostly over Wi-Fi",
      "planner.wifiSometimes": "Sometimes over Wi-Fi",
      "planner.ethernetOnly": "Ethernet only",
      "planner.rgb": "RGB",
      "planner.rgbYes": "Yes",
      "planner.rgbNo": "No",
      "planner.rgbIndifferent": "Indifferent",
      "planner.cooling": "CPU cooling",
      "planner.air": "Air Cooling",
      "planner.liquid": "Liquid Cooling",
      "planner.formFactor": "Case form factor",
      "planner.tower": "Tower",
      "planner.miniTower": "Mini Tower",
      "planner.sff": "Small Form Factor",
      "planner.fishTank": "Fish Tank",
      "planner.formFactorOther": "Other case form factor",
      "planner.formFactorOtherPh": "e.g. open-air, rackmount...",
      "planner.resolution": "Monitor resolution",
      "planner.p720": "720p",
      "planner.p1080": "1080p",
      "planner.p1440": "1440p",
      "planner.p4k": "4K",
      "planner.p8k": "8K",
      "planner.other": "Other important details",
      "planner.otherPh": "e.g. very quiet PC, white theme, lots of USB ports, room for future upgrades...",
      "planner.previewTitle": "Submission preview",
      "planner.previewSubtitle": "This preview updates while the form is being filled out.",
      "planner.emailTitle": "Need another service?",
      "planner.emailText": "If you need an upgrade or troubleshooting, the contact section may be a better fit.",
      "planner.emailCta": "Open contact section",
      "planner.send": "Prepare email",
      "planner.reset": "Reset",
      "planner.validation": "Please fill in the required fields: budget range, PC tier, and use case.",
      "planner.subject": "Build planner request",
      "planner.unsure": "Unsure",
      "planner.optional": "Optional",
      "planner.remove": "Remove",
      "planner.driveUnspecified": "No storage added yet",
      "planner.storageDefault": "Main drive",
      "planner.typeSSD": "SSD",
      "planner.typeNVME": "NVMe",
      "planner.typeSATA": "SATA SSD",
      "planner.typeHDD": "HDD",
      "planner.typeMixed": "Unsure / mixed"
    }
  };

  function setLanguage(lang) {
    document.documentElement.lang = (lang === "en") ? "en" : "fr";

    // Update all nodes with data-i18n
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      const enText = I18N.en[key];

      if (lang === "en" && enText) {
        el.textContent = enText;
      } else {
        // restore French from data-fr-original (saved once)
        const original = el.getAttribute("data-fr-original");
        if (original != null) el.textContent = original;
      }
    });


    // Update placeholders (inputs/textarea) with data-i18n-placeholder
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      const enText = I18N.en[key];

      if (!el.hasAttribute("data-fr-placeholder")) {
        el.setAttribute("data-fr-placeholder", el.getAttribute("placeholder") || "");
      }

      if (lang === "en" && enText) {
        el.setAttribute("placeholder", enText);
      } else {
        el.setAttribute("placeholder", el.getAttribute("data-fr-placeholder") || "");
      }
    });

    // Update <title> + meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (!document.documentElement.hasAttribute("data-fr-title")) {
      document.documentElement.setAttribute("data-fr-title", document.title || "");
    }
    if (metaDesc && !metaDesc.hasAttribute("data-fr-content")) {
      metaDesc.setAttribute("data-fr-content", metaDesc.getAttribute("content") || "");
    }

    const isPlannerPage = document.body?.dataset?.page === "planner";
    const titleKey = isPlannerPage ? "planner.meta.title" : "meta.title";
    const descKey = isPlannerPage ? "planner.meta.desc" : "meta.desc";

    if (lang === "en") {
      if (I18N.en[titleKey]) document.title = I18N.en[titleKey];
      if (metaDesc && I18N.en[descKey]) metaDesc.setAttribute("content", I18N.en[descKey]);
    } else {
      document.title = document.documentElement.getAttribute("data-fr-title") || document.title;
      if (metaDesc) metaDesc.setAttribute("content", metaDesc.getAttribute("data-fr-content") || metaDesc.getAttribute("content") || "");
    }

    if (typeof window.updatePlannerLanguage === "function") {
      window.updatePlannerLanguage(lang);
    }

    // Button label
    if (langBtn) langBtn.textContent = (lang === "en") ? "EN / FR" : "FR / EN";

    localStorage.setItem("raymondpc_lang", lang);
  }

  // Save original FR text once
  document.querySelectorAll("[data-i18n]").forEach(el => {
    if (!el.hasAttribute("data-fr-original")) {
      el.setAttribute("data-fr-original", el.textContent);
    }
  });

  // Init
  const savedLang = localStorage.getItem("raymondpc_lang") || "fr";
  setLanguage(savedLang);

  // Toggle click
  if (langBtn) {
    langBtn.addEventListener("click", () => {
      const current = localStorage.getItem("raymondpc_lang") || "fr";
      setLanguage(current === "fr" ? "en" : "fr");
    });
  }


  /* ========= PLANNER ========= */

  const plannerForm = document.getElementById("plannerForm");

  function currentLang() {
    return localStorage.getItem("raymondpc_lang") || "fr";
  }

  function t(key, fallback = "") {
    const lang = currentLang();
    if (lang === "en" && I18N.en[key]) return I18N.en[key];
    const node = document.querySelector(`[data-i18n="${key}"]`);
    if (node?.getAttribute("data-fr-original")) return node.getAttribute("data-fr-original");
    if (node) return node.textContent.trim();
    return fallback || key;
  }

  function valueMap(lang) {
    const fr = {
      "Entry": "Entrée",
      "Budget": "Budget",
      "Mid-Range": "Milieu de gamme",
      "High End": "Haut de gamme",
      "Maxed Out": "Maximisé",
      "Gaming": "Gaming",
      "Work": "Travail",
      "Gaming + Work": "Gaming et travail",
      "Video Editing": "Montage vidéo",
      "AI": "IA",
      "3D Modeling": "Modélisation 3D",
      "Simulations": "Simulations",
      "Browsing": "Navigation",
      "Other": "Autre",
      "AMD": "AMD",
      "Intel": "Intel",
      "NVIDIA": "NVIDIA",
      "Unsure": "Pas sûr",
      "Will be used primarily over Wi-Fi": "Surtout sur le Wi-Fi",
      "Will be used occasionally over Wi-Fi": "Parfois sur le Wi-Fi",
      "Ethernet Only": "Ethernet seulement",
      "Yes": "Oui",
      "No": "Non",
      "Indifferent": "Indifférent",
      "Air Cooling": "Refroidissement à air",
      "Liquid Cooling": "Refroidissement liquide",
      "Tower": "Tour",
      "Mini Tower": "Mini-tour",
      "Small Form Factor": "Petit format (SFF)",
      "Fish Tank": "Boîtier vitré",
      "720p": "720p",
      "1080p": "1080p",
      "1440p": "1440p",
      "4K": "4K",
      "8K": "8K",
      "SSD": "SSD",
      "NVMe": "NVMe",
      "SATA SSD": "SSD SATA",
      "HDD": "HDD",
      "Unsure / mixed": "Pas sûr / mixte"
    };
    return lang === "en" ? {} : fr;
  }

  function localizeValue(value) {
    const map = valueMap(currentLang());
    return map[value] || value;
  }

  function createStorageItem() {
    const storageList = document.getElementById("storageList");
    if (!storageList) return;

    const item = document.createElement("div");
    item.className = "storage-item";
    item.innerHTML = `
      <div class="storage-grid">
        <label class="field-stack">
          <span class="storage-type-label">${t("planner.storageType", "Type de disque")}</span>
          <select name="storage_type[]">
            <option value="" selected>${t("planner.choicePlaceholder", "Choisir…")}</option>
            <option value="SSD">${localizeValue("SSD")}</option>
            <option value="NVMe">${localizeValue("NVMe")}</option>
            <option value="SATA SSD">${localizeValue("SATA SSD")}</option>
            <option value="HDD">${localizeValue("HDD")}</option>
            <option value="Unsure / mixed">${localizeValue("Unsure / mixed")}</option>
          </select>
        </label>
        <label class="field-stack">
          <span class="storage-capacity-label">${t("planner.storageCapacity", "Capacité")}</span>
          <select name="storage_capacity[]">
            <option value="" selected>${t("planner.choicePlaceholder", "Choisir…")}</option>
            <option value="500GB">500GB</option>
            <option value="1TB">1TB</option>
            <option value="2TB">2TB</option>
            <option value="4TB">4TB</option>
            <option value="8TB">8TB</option>
            <option value="12TB">12TB</option>
            <option value="16TB">16TB</option>
            <option value="20TB">20TB</option>
            <option value="24TB">24TB</option>
            <option value="28TB">28TB</option>
            <option value="32TB">32TB</option>
            <option value="36TB">36TB</option>
            <option value="Unsure">${localizeValue("Unsure")}</option>
          </select>
        </label>
        <label class="field-stack storage-note">
          <span class="storage-notes-label">${t("planner.storageNotes", "Note optionnelle")}</span>
          <input type="text" name="storage_note[]" placeholder="${t("planner.storageNotesPh", "Ex. : 1 To NVMe + 8 To HDD pour médias")}">
        </label>
      </div>
      <button class="btn btn-ghost btn-small storage-remove" type="button">${t("planner.remove", "Retirer")}</button>
    `;
    storageList.appendChild(item);

    item.querySelectorAll("input, select").forEach(el => {
      el.addEventListener("input", updatePlannerPreview);
      el.addEventListener("change", updatePlannerPreview);
    });
    item.querySelector(".storage-remove")?.addEventListener("click", () => {
      item.remove();
      updatePlannerPreview();
    });
  }

  function renderPlannerPreviewItem(label, value) {
    return `<div class="summary-row"><span class="summary-label">${label}</span><span class="summary-value">${value}</span></div>`;
  }

  function getSelectedRadio(form, name) {
    return form.querySelector(`input[name="${name}"]:checked`)?.value || "";
  }

  function getLabelMap() {
    return {
      budget: t("planner.budget", "Budget"),
      tier: t("planner.tier", "Gamme de PC"),
      use_case: t("planner.useCase", "Usage"),
      cpu_family: t("planner.cpu", "Famille CPU"),
      gpu_family: t("planner.gpu", "Famille GPU"),
      ram: t("planner.ram", "Mémoire (RAM)"),
      storage: t("planner.storage", "Stockage"),
      wifi_use: t("planner.wifi", "Utilisation du Wi-Fi"),
      rgb: t("planner.rgb", "RGB"),
      cooling: t("planner.cooling", "Refroidissement CPU"),
      form_factor: t("planner.formFactor", "Format du boîtier"),
      resolution: t("planner.resolution", "Résolution écran"),
      other: t("planner.other", "Autres éléments importants")
    };
  }

  function collectPlannerData() {
    if (!plannerForm) return null;
    const data = new FormData(plannerForm);
    const obj = {
      budget: (data.get("budget") || "").toString().trim(),
      tier: getSelectedRadio(plannerForm, "tier"),
      use_case: (data.get("use_case") || "").toString(),
      use_case_other: (data.get("use_case_other") || "").toString().trim(),
      cpu_family: getSelectedRadio(plannerForm, "cpu_family"),
      gpu_family: getSelectedRadio(plannerForm, "gpu_family"),
      ram: getSelectedRadio(plannerForm, "ram"),
      wifi_use: getSelectedRadio(plannerForm, "wifi_use"),
      rgb: getSelectedRadio(plannerForm, "rgb"),
      cooling: getSelectedRadio(plannerForm, "cooling"),
      form_factor: (data.get("form_factor") || "").toString(),
      form_factor_other: (data.get("form_factor_other") || "").toString().trim(),
      resolution: getSelectedRadio(plannerForm, "resolution"),
      other: (data.get("other") || "").toString().trim(),
      storage: []
    };

    const types = data.getAll("storage_type[]");
    const capacities = data.getAll("storage_capacity[]");
    const notes = data.getAll("storage_note[]");
    for (let i = 0; i < Math.max(types.length, capacities.length, notes.length); i += 1) {
      const type = (types[i] || "").toString();
      const capacity = (capacities[i] || "").toString();
      const note = (notes[i] || "").toString().trim();
      if (type || capacity || note) obj.storage.push({ type, capacity, note });
    }

    return obj;
  }

  function updatePlannerPreview() {
    if (!plannerForm) return;
    const preview = document.getElementById("plannerPreview");
    if (!preview) return;

    const data = collectPlannerData();
    const labels = getLabelMap();
    const rows = [];

    if (data.budget) rows.push(renderPlannerPreviewItem(labels.budget, data.budget));
    if (data.tier) rows.push(renderPlannerPreviewItem(labels.tier, localizeValue(data.tier)));

    let useCaseValue = localizeValue(data.use_case);
    if (data.use_case === "Other" && data.use_case_other) useCaseValue = data.use_case_other;
    else if (data.use_case_other) useCaseValue = `${useCaseValue} — ${data.use_case_other}`;
    if (useCaseValue) rows.push(renderPlannerPreviewItem(labels.use_case, useCaseValue));

    ["cpu_family","gpu_family","ram","wifi_use","rgb","cooling","resolution"].forEach(key => {
      if (data[key]) rows.push(renderPlannerPreviewItem(labels[key], localizeValue(data[key])));
    });

    let formFactorValue = localizeValue(data.form_factor);
    if (data.form_factor === "Other" && data.form_factor_other) formFactorValue = data.form_factor_other;
    else if (data.form_factor_other) formFactorValue = formFactorValue ? `${formFactorValue} — ${data.form_factor_other}` : data.form_factor_other;
    if (formFactorValue) rows.push(renderPlannerPreviewItem(labels.form_factor, formFactorValue));

    if (data.storage.length) {
      const storageText = data.storage.map((drive, index) => {
        const bits = [];
        if (drive.capacity) bits.push(drive.capacity);
        if (drive.type) bits.push(localizeValue(drive.type));
        let line = bits.join(" ");
        if (!line) line = `${t("planner.storageDefault", "Disque principal")} ${index + 1}`;
        if (drive.note) line += ` — ${drive.note}`;
        return line;
      }).join("<br>");
      rows.push(renderPlannerPreviewItem(labels.storage, storageText));
    } else {
      rows.push(renderPlannerPreviewItem(labels.storage, t("planner.driveUnspecified", "Aucun stockage ajouté pour le moment")));
    }

    if (data.other) rows.push(renderPlannerPreviewItem(labels.other, data.other));

    preview.innerHTML = rows.join("");
  }

  function refreshStorageLanguage() {
    document.querySelectorAll(".storage-item").forEach(item => {
      const typeLabel = item.querySelector(".storage-type-label");
      const capacityLabel = item.querySelector(".storage-capacity-label");
      const notesLabel = item.querySelector(".storage-notes-label");
      const removeBtn = item.querySelector(".storage-remove");
      const typeSelect = item.querySelector('select[name="storage_type[]"]');
      const capSelect = item.querySelector('select[name="storage_capacity[]"]');
      const noteInput = item.querySelector('input[name="storage_note[]"]');

      if (typeLabel) typeLabel.textContent = t("planner.storageType", "Type de disque");
      if (capacityLabel) capacityLabel.textContent = t("planner.storageCapacity", "Capacité");
      if (notesLabel) notesLabel.textContent = t("planner.storageNotes", "Note optionnelle");
      if (removeBtn) removeBtn.textContent = t("planner.remove", "Retirer");
      if (noteInput) noteInput.placeholder = t("planner.storageNotesPh", "Ex. : 1 To NVMe + 8 To HDD pour médias");

      if (typeSelect) {
        const current = typeSelect.value;
        typeSelect.innerHTML = `
          <option value="">${t("planner.choicePlaceholder", "Choisir…")}</option>
          <option value="SSD">${localizeValue("SSD")}</option>
          <option value="NVMe">${localizeValue("NVMe")}</option>
          <option value="SATA SSD">${localizeValue("SATA SSD")}</option>
          <option value="HDD">${localizeValue("HDD")}</option>
          <option value="Unsure / mixed">${localizeValue("Unsure / mixed")}</option>
        `;
        typeSelect.value = current;
      }

      if (capSelect) {
        const current = capSelect.value;
        capSelect.innerHTML = `
          <option value="">${t("planner.choicePlaceholder", "Choisir…")}</option>
          <option value="500GB">500GB</option>
          <option value="1TB">1TB</option>
          <option value="2TB">2TB</option>
          <option value="4TB">4TB</option>
          <option value="8TB">8TB</option>
          <option value="12TB">12TB</option>
          <option value="16TB">16TB</option>
          <option value="20TB">20TB</option>
          <option value="24TB">24TB</option>
          <option value="28TB">28TB</option>
          <option value="32TB">32TB</option>
          <option value="36TB">36TB</option>
          <option value="Unsure">${localizeValue("Unsure")}</option>
        `;
        capSelect.value = current;
      }
    });

    updatePlannerPreview();
  }

  window.updatePlannerLanguage = function updatePlannerLanguage() {
    if (!plannerForm) return;
    const addStorageBtn = document.getElementById("addStorageBtn");
    if (addStorageBtn) addStorageBtn.textContent = t("planner.addStorage", "Ajouter un autre disque");
    refreshStorageLanguage();
  };

  if (plannerForm) {
    if (!document.getElementById("storageList")?.children.length) {
      createStorageItem();
    }

    document.getElementById("addStorageBtn")?.addEventListener("click", createStorageItem);

    plannerForm.addEventListener("input", updatePlannerPreview);
    plannerForm.addEventListener("change", updatePlannerPreview);
    plannerForm.addEventListener("reset", () => {
      setTimeout(() => {
        const list = document.getElementById("storageList");
        if (list) {
          list.innerHTML = "";
          createStorageItem();
        }
        const note = document.getElementById("plannerValidation");
        if (note) note.textContent = "";
        updatePlannerPreview();
      }, 0);
    });

    plannerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = collectPlannerData();
      const validation = document.getElementById("plannerValidation");
      const missing = [];

      if (!data.budget) missing.push(t("planner.budget", "Budget"));
      if (!data.tier) missing.push(t("planner.tier", "Gamme de PC"));
      if (!data.use_case) missing.push(t("planner.useCase", "Usage"));

      if (missing.length) {
        if (validation) validation.textContent = t("planner.validation", "Veuillez remplir les champs obligatoires : budget, gamme de PC et usage.");
        return;
      }

      if (validation) validation.textContent = "";

      const labels = getLabelMap();
      const lines = [];
      lines.push(`${labels.budget}: ${data.budget}`);
      lines.push(`${labels.tier}: ${localizeValue(data.tier)}`);

      let useCaseValue = localizeValue(data.use_case);
      if (data.use_case === "Other" && data.use_case_other) useCaseValue = data.use_case_other;
      else if (data.use_case_other) useCaseValue = `${useCaseValue} — ${data.use_case_other}`;
      lines.push(`${labels.use_case}: ${useCaseValue}`);

      [["cpu_family", data.cpu_family],["gpu_family", data.gpu_family],["ram", data.ram],["wifi_use", data.wifi_use],["rgb", data.rgb],["cooling", data.cooling],["resolution", data.resolution]].forEach(([key, value]) => {
        if (value) lines.push(`${labels[key]}: ${localizeValue(value)}`);
      });

      let formFactorValue = localizeValue(data.form_factor);
      if (data.form_factor === "Other" && data.form_factor_other) formFactorValue = data.form_factor_other;
      else if (data.form_factor_other) formFactorValue = formFactorValue ? `${formFactorValue} — ${data.form_factor_other}` : data.form_factor_other;
      if (formFactorValue) lines.push(`${labels.form_factor}: ${formFactorValue}`);

      if (data.storage.length) {
        lines.push(`${labels.storage}:`);
        data.storage.forEach((drive, index) => {
          const parts = [];
          if (drive.capacity) parts.push(drive.capacity);
          if (drive.type) parts.push(localizeValue(drive.type));
          let line = parts.join(" ");
          if (!line) line = `${t("planner.storageDefault", "Disque principal")} ${index + 1}`;
          if (drive.note) line += ` — ${drive.note}`;
          lines.push(`- ${line}`);
        });
      }

      if (data.other) lines.push(`${labels.other}: ${data.other}`);

      const subjectPrefix = currentLang() === "en" ? "Build Planner Request" : "Demande - Planificateur de build";
      const subject = encodeURIComponent(`[Raymond PC] ${subjectPrefix}`);
      const body = encodeURIComponent(lines.join("\n"));
      window.location.href = `mailto:raymondservicepc@outlook.com?subject=${subject}&body=${body}`;
    });

    updatePlannerPreview();
  }


  /* ========= SHARED LIGHTBOX (BUILDS + REVIEWS) ========= */

  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightboxImg");
  const lbCaption = document.getElementById("lightboxCaption");
  const btnPrev = lb?.querySelector("[data-prev]");
  const btnNext = lb?.querySelector("[data-next]");

  // Two separate galleries
  const galleries = {
    builds: Array.from(document.querySelectorAll('[data-lightbox="builds"] button')),
    reviews: Array.from(document.querySelectorAll('[data-lightbox="reviews"] button'))
  };

  let activeGallery = "builds";
  let currentIndex = -1;

  function openAt(galleryName, index) {
    const list = galleries[galleryName] || [];
    if (!lb || !lbImg || list.length === 0) return;

    activeGallery = galleryName;

    if (index < 0) index = list.length - 1;
    if (index >= list.length) index = 0;
    currentIndex = index;

    const btn = list[currentIndex];
    const img = btn.querySelector("img");
    const src = btn.getAttribute("data-full") || img?.getAttribute("src");
    const alt = img?.getAttribute("alt") || "Image";

    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    lbImg.src = src;
    lbImg.alt = alt;
    if (lbCaption) lbCaption.textContent = alt;

    const disabled = list.length <= 1;
    if (btnPrev) btnPrev.disabled = disabled;
    if (btnNext) btnNext.disabled = disabled;
  }

  function closeLightbox() {
    if (!lb || !lbImg) return;
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lbImg.src = "";
    lbImg.alt = "";
    if (lbCaption) lbCaption.textContent = "";
    currentIndex = -1;
  }

  function next() {
    const list = galleries[activeGallery] || [];
    if (currentIndex === -1 || list.length === 0) return;
    openAt(activeGallery, currentIndex + 1);
  }

  function prev() {
    const list = galleries[activeGallery] || [];
    if (currentIndex === -1 || list.length === 0) return;
    openAt(activeGallery, currentIndex - 1);
  }

  // Attach click handlers for builds
  galleries.builds.forEach((btn, idx) => {
    btn.addEventListener("click", () => openAt("builds", idx));
  });

  // Attach click handlers for reviews
  galleries.reviews.forEach((btn, idx) => {
    btn.addEventListener("click", () => openAt("reviews", idx));
  });

  btnNext?.addEventListener("click", next);
  btnPrev?.addEventListener("click", prev);

  // Close on backdrop/close button
  lb?.addEventListener("click", (e) => {
    if (e.target.matches("[data-close]")) closeLightbox();
  });

  // Keyboard controls
  document.addEventListener("keydown", (e) => {
    if (!lb?.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

  // Click image to go next
  lbImg?.addEventListener("click", () => {
    const list = galleries[activeGallery] || [];
    if (list.length > 1) next();
  });
})();
