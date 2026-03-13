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

    if (lang === "en") {
      if (I18N.en["meta.title"]) document.title = I18N.en["meta.title"];
      if (metaDesc && I18N.en["meta.desc"]) metaDesc.setAttribute("content", I18N.en["meta.desc"]);
    } else {
      document.title = document.documentElement.getAttribute("data-fr-title") || document.title;
      if (metaDesc) metaDesc.setAttribute("content", metaDesc.getAttribute("data-fr-content") || metaDesc.getAttribute("content") || "");
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



  /* ========= PLANNER PAGE ========= */

  Object.assign(I18N.en, {
    "nav.planner": "Planner",
    "planner.back": "Back to main site",
    "planner.title": "Plan your build more easily.",
    "planner.lead": "This page helps you choose your preferences without locking the request to specific parts whose pricing and availability can change often.",
    "planner.b1": "Required: budget, PC tier, and use case",
    "planner.b2": "Optional fields can be left blank if you're unsure",
    "planner.b3": "The final request opens directly in your email app",
    "planner.cardTitle": "Why it works well",
    "planner.cardSubtitle": "Simple for customers, flexible for you.",
    "planner.card1t": "Easy to maintain",
    "planner.card1d": "No live pricing and no inventory list to constantly redo.",
    "planner.card2t": "Easy to fill out",
    "planner.card2d": "Visual choices are easier to recognize for everyone.",
    "planner.card3t": "Clearer requests",
    "planner.card3d": "More information makes it easier to plan the right PC for the user's needs.",
    "planner.formTitle": "Build planner",
    "planner.formSubtitle": "Only the essential items are required. Everything else is optional.",
    "planner.budget": "Budget",
    "planner.budgetPh": "Ex: 1200-1800 CAD",
    "planner.budgetHelp": "Required. Example: 1000-1500, 2000, 2500-3000 CAD",
    "planner.tier": "PC Tier",
    "planner.entry": "Entry",
    "planner.budgetTier": "Budget",
    "planner.mid": "Mid-Range",
    "planner.high": "High-End",
    "planner.maxed": "Maxed Out",
    "planner.useCase": "Use Case",
    "planner.choicePlaceholder": "Choose…",
    "planner.gaming": "Gaming",
    "planner.work": "Work",
    "planner.gamingWork": "Gaming and Work",
    "planner.videoEditing": "Video Editing",
    "planner.ai": "AI",
    "planner.modeling": "3D Modeling",
    "planner.simulations": "Simulations",
    "planner.browsing": "Browsing",
    "planner.otherChoice": "Other",
    "planner.useCasePh": "Ex: streaming + gaming, office work, engineering software...",
    "planner.cpu": "CPU Family",
    "planner.gpu": "GPU Family",
    "planner.unsure": "Unsure",
    "planner.ram": "Memory (RAM)",
    "planner.storage": "Storage",
    "planner.addStorage": "Add another drive",
    "planner.wifi": "Wi-Fi Use",
    "planner.wifiPrimary": "Primarily on Wi-Fi",
    "planner.wifiSometimes": "Occasional Wi-Fi use",
    "planner.ethernetOnly": "Ethernet only",
    "planner.rgb": "RGB",
    "planner.rgbYes": "Yes",
    "planner.rgbNo": "No",
    "planner.rgbIndifferent": "Indifferent",
    "planner.cooling": "CPU Cooling",
    "planner.air": "Air Cooling",
    "planner.liquid": "Liquid Cooling",
    "planner.formFactor": "Case Format",
    "planner.tower": "Tower",
    "planner.miniTower": "Mini Tower",
    "planner.sff": "Small Form Factor",
    "planner.fishTank": "Fish Tank",
    "planner.formFactorOther": "Other case format",
    "planner.formFactorOtherPh": "Ex: open-air, rackmount...",
    "planner.resolution": "Monitor Resolution",
    "planner.other": "Other important elements",
    "planner.otherPh": "Ex: very quiet PC, white theme, lots of USB ports, room for future upgrades...",
    "planner.send": "Prepare email",
    "planner.reset": "Reset",
    "planner.previewTitle": "Request preview",
    "planner.previewSubtitle": "This preview updates while the form is being filled.",
    "planner.emailTitle": "Need another service?",
    "planner.emailText": "If you need an upgrade or troubleshooting instead, the contact section may be a better fit.",
    "planner.emailCta": "Open contact section"
  });

  const plannerForm = document.getElementById("plannerForm");
  if (plannerForm) {
    const previewEl = document.getElementById("plannerPreview");
    const validationEl = document.getElementById("plannerValidation");
    const storageList = document.getElementById("storageList");
    const addStorageBtn = document.getElementById("addStorageBtn");

    const plannerI18n = {
      fr: {
        requiredMsg: "Veuillez remplir le budget, la gamme de PC et l’usage avant de préparer l’e-mail.",
        subject: "[Raymond PC] Planificateur de build",
        fieldLabels: {
          budget: "Budget",
          tier: "Gamme du PC",
          use_case: "Usage",
          cpu_family: "Famille CPU",
          gpu_family: "Famille GPU",
          ram: "Mémoire (RAM)",
          wifi_use: "Utilisation du Wi‑Fi",
          rgb: "RGB",
          cooling: "Refroidissement CPU",
          form_factor: "Format du boîtier",
          resolution: "Résolution écran",
          other: "Autres éléments importants",
          storage: "Stockage"
        },
        valueMap: {
          "Entry": "Entrée",
          "Budget": "Budget",
          "Mid-Range": "Milieu de gamme",
          "High End": "Haut de gamme",
          "High-End": "Haut de gamme",
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
          "Unsure": "Pas sûr",
          "Yes": "Oui",
          "No": "Non",
          "Indifferent": "Indifférent",
          "AMD": "AMD",
          "Intel": "Intel",
          "NVIDIA": "NVIDIA",
          "Will be used primarily over Wi-Fi": "Principalement sur le Wi‑Fi",
          "Will be used occasionally over Wi-Fi": "Parfois sur le Wi‑Fi",
          "Ethernet Only": "Ethernet seulement",
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
          "8K": "8K"
        },
        storageTypePlaceholder: "Type de disque",
        storageCapacityPlaceholder: "Capacité",
        storageNotePlaceholder: "Note optionnelle",
        storageExamples: ["SSD", "NVMe", "HDD", "SSD SATA"],
        remove: "Retirer",
        previewEmpty: "Commencez à remplir le formulaire pour voir l’aperçu.",
        emailBodyIntro: "Bonjour,\n\nVoici ma demande de build :\n"
      },
      en: {
        requiredMsg: "Please fill out the budget, PC tier, and use case before preparing the email.",
        subject: "[Raymond PC] Build planner",
        fieldLabels: {
          budget: "Budget",
          tier: "PC Tier",
          use_case: "Use Case",
          cpu_family: "CPU Family",
          gpu_family: "GPU Family",
          ram: "Memory (RAM)",
          wifi_use: "Wi-Fi Use",
          rgb: "RGB",
          cooling: "CPU Cooling",
          form_factor: "Case Format",
          resolution: "Monitor Resolution",
          other: "Other important elements",
          storage: "Storage"
        },
        valueMap: {
          "Entry": "Entry",
          "Budget": "Budget",
          "Mid-Range": "Mid-Range",
          "High End": "High-End",
          "High-End": "High-End",
          "Maxed Out": "Maxed Out",
          "Gaming": "Gaming",
          "Work": "Work",
          "Gaming + Work": "Gaming and Work",
          "Video Editing": "Video Editing",
          "AI": "AI",
          "3D Modeling": "3D Modeling",
          "Simulations": "Simulations",
          "Browsing": "Browsing",
          "Other": "Other",
          "Unsure": "Unsure",
          "Yes": "Yes",
          "No": "No",
          "Indifferent": "Indifferent",
          "AMD": "AMD",
          "Intel": "Intel",
          "NVIDIA": "NVIDIA",
          "Will be used primarily over Wi-Fi": "Primarily on Wi-Fi",
          "Will be used occasionally over Wi-Fi": "Occasional Wi-Fi use",
          "Ethernet Only": "Ethernet only",
          "Air Cooling": "Air Cooling",
          "Liquid Cooling": "Liquid Cooling",
          "Tower": "Tower",
          "Mini Tower": "Mini Tower",
          "Small Form Factor": "Small Form Factor",
          "Fish Tank": "Fish Tank",
          "720p": "720p",
          "1080p": "1080p",
          "1440p": "1440p",
          "4K": "4K",
          "8K": "8K"
        },
        storageTypePlaceholder: "Drive type",
        storageCapacityPlaceholder: "Capacity",
        storageNotePlaceholder: "Optional note",
        storageExamples: ["SSD", "NVMe", "HDD", "SATA SSD"],
        remove: "Remove",
        previewEmpty: "Start filling out the form to see the preview.",
        emailBodyIntro: "Hello,\n\nHere is my build request:\n"
      }
    };

    function currentPlannerLang() {
      return (localStorage.getItem("raymondpc_lang") || "fr") === "en" ? "en" : "fr";
    }

    function plannerText(path) {
      const lang = currentPlannerLang();
      const parts = path.split(".");
      let value = plannerI18n[lang];
      for (const p of parts) value = value?.[p];
      return value ?? "";
    }

    function translatePlannerValue(value) {
      const str = (value || "").toString().trim();
      if (!str) return "";
      return plannerText("valueMap")[str] || str;
    }

    function syncChoiceStates() {
      plannerForm.querySelectorAll(".pill, .choice-card").forEach(el => {
        const input = el.querySelector('input[type="radio"]');
        el.classList.toggle("is-selected", !!input?.checked);
      });
    }

    function createStorageRow(values = {}) {
      const row = document.createElement("div");
      row.className = "storage-row";
      row.innerHTML = `
        <input type="text" name="storage_type[]" list="storageTypeList" placeholder="${plannerText("storageTypePlaceholder")}" value="${values.type || ""}">
        <input type="text" name="storage_capacity[]" placeholder="${plannerText("storageCapacityPlaceholder")}" value="${values.capacity || ""}">
        <input type="text" name="storage_note[]" placeholder="${plannerText("storageNotePlaceholder")}" value="${values.note || ""}">
        <button class="btn btn-ghost storage-remove" type="button">${plannerText("remove")}</button>
      `;
      row.querySelector(".storage-remove").addEventListener("click", () => {
        row.remove();
        if (!storageList.children.length) storageList.appendChild(createStorageRow());
        updatePlannerPreview();
      });
      row.querySelectorAll("input").forEach(input => input.addEventListener("input", updatePlannerPreview));
      return row;
    }

    function refreshStoragePlaceholders() {
      storageList.querySelectorAll(".storage-row").forEach(row => {
        const inputs = row.querySelectorAll("input");
        if (inputs[0]) inputs[0].placeholder = plannerText("storageTypePlaceholder");
        if (inputs[1]) inputs[1].placeholder = plannerText("storageCapacityPlaceholder");
        if (inputs[2]) inputs[2].placeholder = plannerText("storageNotePlaceholder");
        const btn = row.querySelector(".storage-remove");
        if (btn) btn.textContent = plannerText("remove");
      });
    }

    const storageDatalist = document.createElement("datalist");
    storageDatalist.id = "storageTypeList";
    plannerForm.appendChild(storageDatalist);

    function refreshStorageDatalist() {
      storageDatalist.innerHTML = plannerText("storageExamples").map(item => `<option value="${item}">`).join("");
    }

    function getSelectedValue(name) {
      return plannerForm.querySelector(`[name="${name}"]:checked`)?.value || "";
    }

    function formatStorageItems() {
      const rows = Array.from(storageList.querySelectorAll(".storage-row"));
      return rows.map(row => {
        const [type, capacity, note] = Array.from(row.querySelectorAll("input")).map(input => input.value.trim());
        const main = [capacity, type].filter(Boolean).join(" ").trim();
        if (!main && !note) return "";
        return note ? `${main} — ${note}`.trim() : main;
      }).filter(Boolean);
    }

    function buildPreviewItems() {
      const data = {
        budget: plannerForm.elements["budget"]?.value.trim() || "",
        tier: getSelectedValue("tier"),
        use_case: plannerForm.elements["use_case"]?.value || "",
        cpu_family: getSelectedValue("cpu_family"),
        gpu_family: getSelectedValue("gpu_family"),
        ram: getSelectedValue("ram"),
        wifi_use: getSelectedValue("wifi_use"),
        rgb: getSelectedValue("rgb"),
        cooling: getSelectedValue("cooling"),
        form_factor: plannerForm.elements["form_factor"]?.value || "",
        resolution: getSelectedValue("resolution"),
        other: plannerForm.elements["other"]?.value.trim() || ""
      };

      const items = [];
      Object.entries(data).forEach(([key, value]) => {
        if (!value) return;
        let finalValue = translatePlannerValue(value);

        if (key === "use_case" && value === "Other") {
          finalValue = plannerForm.elements["use_case_other"]?.value.trim() || translatePlannerValue(value);
        }
        if (key === "form_factor" && value === "Other") {
          finalValue = plannerForm.elements["form_factor_other"]?.value.trim() || translatePlannerValue(value);
        }

        items.push({
          label: plannerText(`fieldLabels.${key}`),
          value: finalValue
        });
      });

      const storageItems = formatStorageItems();
      if (storageItems.length) {
        items.push({
          label: plannerText("fieldLabels.storage"),
          value: storageItems.join("\n")
        });
      }

      return items;
    }

    function updatePlannerPreview() {
      syncChoiceStates();
      const items = buildPreviewItems();

      if (!previewEl) return;
      if (!items.length) {
        previewEl.innerHTML = `<div class="summary-item"><div class="summary-value muted">${plannerText("previewEmpty")}</div></div>`;
        return;
      }

      previewEl.innerHTML = items.map(item => `
        <div class="summary-item">
          <div class="summary-label">${item.label}</div>
          <div class="summary-value">${item.value.replace(/\n/g, "<br>")}</div>
        </div>
      `).join("");
    }

    function refreshPlannerLanguage() {
      refreshStorageDatalist();
      refreshStoragePlaceholders();
      updatePlannerPreview();
    }

    if (!storageList.children.length) {
      storageList.appendChild(createStorageRow());
    }

    refreshStorageDatalist();

    addStorageBtn?.addEventListener("click", () => {
      storageList.appendChild(createStorageRow());
      updatePlannerPreview();
    });

    plannerForm.addEventListener("input", updatePlannerPreview);
    plannerForm.addEventListener("change", updatePlannerPreview);

    plannerForm.addEventListener("reset", () => {
      setTimeout(() => {
        storageList.innerHTML = "";
        storageList.appendChild(createStorageRow());
        if (validationEl) validationEl.textContent = "";
        updatePlannerPreview();
      }, 0);
    });

    plannerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const budget = plannerForm.elements["budget"]?.value.trim();
      const tier = getSelectedValue("tier");
      const useCase = plannerForm.elements["use_case"]?.value;

      if (!budget || !tier || !useCase) {
        if (validationEl) validationEl.textContent = plannerText("requiredMsg");
        return;
      }

      if (validationEl) validationEl.textContent = "";
      const items = buildPreviewItems();
      const body = plannerText("emailBodyIntro") + items.map(item => `${item.label}: ${item.value.replace(/\n/g, ", ")}`).join("\n") + "\n";
      const subject = encodeURIComponent(plannerText("subject"));
      window.location.href = `mailto:raymondservicepc@outlook.com?subject=${subject}&body=${encodeURIComponent(body)}`;
    });

    const originalSetLanguage = setLanguage;
    setLanguage = function(lang) {
      originalSetLanguage(lang);
      refreshPlannerLanguage();
    };

    refreshPlannerLanguage();
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
