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
      "contact.plannerLink": "Or use the guided build planner.",
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
      "hero.cta3": "Plan my build",
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

    // Update <title> + meta description + OG tags
    const metaDesc = document.querySelector('meta[name="description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const isPlannerPage = document.body?.dataset?.page === "planner";
    const pageMeta = isPlannerPage
      ? {
          enTitle: "Raymond PC - Guided Build Planner",
          enDesc: "A guided build planner to send a clear request based on your budget, PC tier, use case, and part preferences."
        }
      : {
          enTitle: I18N.en["meta.title"],
          enDesc: I18N.en["meta.desc"]
        };

    if (!document.documentElement.hasAttribute("data-fr-title")) {
      document.documentElement.setAttribute("data-fr-title", document.title || "");
    }
    if (metaDesc && !metaDesc.hasAttribute("data-fr-content")) {
      metaDesc.setAttribute("data-fr-content", metaDesc.getAttribute("content") || "");
    }
    if (ogTitle && !ogTitle.hasAttribute("data-fr-content")) {
      ogTitle.setAttribute("data-fr-content", ogTitle.getAttribute("content") || "");
    }
    if (ogDesc && !ogDesc.hasAttribute("data-fr-content")) {
      ogDesc.setAttribute("data-fr-content", ogDesc.getAttribute("content") || "");
    }

    if (lang === "en") {
      if (pageMeta.enTitle) document.title = pageMeta.enTitle;
      if (metaDesc && pageMeta.enDesc) metaDesc.setAttribute("content", pageMeta.enDesc);
      if (ogTitle && pageMeta.enTitle) ogTitle.setAttribute("content", pageMeta.enTitle);
      if (ogDesc && pageMeta.enDesc) ogDesc.setAttribute("content", pageMeta.enDesc);
    } else {
      document.title = document.documentElement.getAttribute("data-fr-title") || document.title;
      if (metaDesc) metaDesc.setAttribute("content", metaDesc.getAttribute("data-fr-content") || metaDesc.getAttribute("content") || "");
      if (ogTitle) ogTitle.setAttribute("content", ogTitle.getAttribute("data-fr-content") || ogTitle.getAttribute("content") || "");
      if (ogDesc) ogDesc.setAttribute("content", ogDesc.getAttribute("data-fr-content") || ogDesc.getAttribute("content") || "");
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

  /* ========= PLANNER PAGE ========= */

  const plannerForm = document.getElementById("plannerForm");
  if (plannerForm) {
    const storageList = document.getElementById("storageList");
    const addStorageBtn = document.getElementById("addStorageBtn");
    const previewEl = document.getElementById("plannerPreview");
    const validationEl = document.getElementById("plannerValidation");

    const P = {
      fr: {
        labels: {
          budget: "Budget",
          tier: "Gamme du PC",
          use_case: "Usage",
          cpu_family: "Famille CPU",
          gpu_family: "Famille GPU",
          ram: "Mémoire (RAM)",
          storage: "Stockage",
          wifi_use: "Utilisation du Wi‑Fi",
          rgb: "RGB",
          cooling: "Refroidissement CPU",
          form_factor: "Format du boîtier",
          resolution: "Résolution écran",
          other: "Autres éléments importants"
        },
        values: {
          entry: "Entrée",
          budget: "Budget",
          mid: "Milieu de gamme",
          high: "Haut de gamme",
          maxed: "Maximisé",
          gaming: "Gaming",
          work: "Travail",
          gaming_work: "Gaming et travail",
          video_editing: "Montage vidéo",
          ai: "IA",
          modeling: "Modélisation 3D",
          simulations: "Simulations",
          browsing: "Navigation",
          other: "Autre",
          amd: "AMD",
          intel: "Intel",
          nvidia: "NVIDIA",
          unsure: "Pas sûr",
          primary: "Surtout sur Wi‑Fi",
          occasional: "Parfois sur Wi‑Fi",
          ethernet: "Ethernet",
          yes: "Oui",
          no: "Non",
          indifferent: "Indifférent",
          air: "Air",
          liquid: "Liquide",
          tower: "Tour",
          mini_tower: "Mini-tour",
          sff: "Petit format (SFF)",
          fish_tank: "Boîtier vitré",
          p720: "720p",
          p1080: "1080p",
          p1440: "1440p",
          p4k: "4K",
          p8k: "8K",
          hdd: "HDD",
          sata_ssd: "SSD SATA",
          nvme: "NVMe",
          hybrid: "Hybride",
          c500gb: "500 Go",
          c1tb: "1 To",
          c2tb: "2 To",
          c4tb: "4 To",
          c8tb: "8 To",
          c12tb: "12 To",
          c16tb: "16 To",
          c20tb: "20 To",
          c24tb: "24 To",
          c28tb: "28 To",
          c32tb: "32 To",
          c36tb: "36 To"
        },
        misc: {
          otherLabel: "Autre",
          driveType: "Type de disque",
          capacity: "Capacité",
          optionalNote: "Note optionnelle",
          choose: "Choisir…",
          exampleStorage: "Ex : 1 To NVMe + 8 To HDD pour médias",
          storageEmpty: "Remplissez le formulaire pour voir un aperçu en direct.",
          removeRow: "Supprimer cette ligne de stockage",
          budgetRule: "Le budget doit contenir 1 montant ou une plage, par exemple 1200 ou 1200-1800."
        },
        emailSubject: "[Raymond PC] Préférences de build"
      },
      en: {
        labels: {
          budget: "Budget",
          tier: "PC Tier",
          use_case: "Use Case",
          cpu_family: "CPU Family",
          gpu_family: "GPU Family",
          ram: "RAM",
          storage: "Storage",
          wifi_use: "Wi‑Fi Use",
          rgb: "RGB",
          cooling: "CPU Cooling",
          form_factor: "Case Form Factor",
          resolution: "Monitor Resolution",
          other: "Other Important Elements"
        },
        values: {
          entry: "Entry",
          budget: "Budget",
          mid: "Mid-Range",
          high: "High-End",
          maxed: "Maxed Out",
          gaming: "Gaming",
          work: "Work",
          gaming_work: "Gaming and Work",
          video_editing: "Video Editing",
          ai: "AI",
          modeling: "3D Modeling",
          simulations: "Simulations",
          browsing: "Browsing",
          other: "Other",
          amd: "AMD",
          intel: "Intel",
          nvidia: "NVIDIA",
          unsure: "Unsure",
          primary: "Primarily",
          occasional: "On occasion",
          ethernet: "Ethernet only",
          yes: "Yes",
          no: "No",
          indifferent: "Indifferent",
          air: "Air",
          liquid: "Liquid",
          tower: "Tower",
          mini_tower: "Mini Tower",
          sff: "Small Form Factor",
          fish_tank: "Fish Tank",
          p720: "720p",
          p1080: "1080p",
          p1440: "1440p",
          p4k: "4K",
          p8k: "8K",
          hdd: "HDD",
          sata_ssd: "SATA SSD",
          nvme: "NVMe",
          hybrid: "Hybrid",
          c500gb: "500GB",
          c1tb: "1TB",
          c2tb: "2TB",
          c4tb: "4TB",
          c8tb: "8TB",
          c12tb: "12TB",
          c16tb: "16TB",
          c20tb: "20TB",
          c24tb: "24TB",
          c28tb: "28TB",
          c32tb: "32TB",
          c36tb: "36TB"
        },
        misc: {
          otherLabel: "Other",
          driveType: "Drive Type",
          capacity: "Capacity",
          optionalNote: "Optional note",
          choose: "Choose…",
          exampleStorage: "Ex: 1TB NVMe + 8TB HDD for media",
          storageEmpty: "Fill out the form to see a live preview.",
          removeRow: "Remove this storage row",
          budgetRule: "Budget must contain 1 amount or a range, for example 1200 or 1200-1800."
        },
        emailSubject: "[Raymond PC] Build preferences"
      }
    };

    Object.assign(I18N.en, {
      "planner.tier": "PC Tier",
      "planner.entry": "Entry",
      "planner.budgetTier": "Budget",
      "planner.mid": "Mid-Range",
      "planner.high": "High-End",
      "planner.maxed": "Maxed Out",
      "planner.useCase": "Use Case",
      "planner.useCaseOther": "Other",
      "planner.choicePlaceholder": "Choose…",
      "planner.work": "Work",
      "planner.gamingWork": "Gaming and Work",
      "planner.videoEditing": "Video Editing",
      "planner.ai": "AI",
      "planner.modeling": "3D Modeling",
      "planner.otherChoice": "Other",
      "planner.storage": "Storage",
      "planner.addStorage": "Add another drive",
      "planner.wifi": "Wi‑Fi Use",
      "planner.wifiPrimary": "Primarily",
      "planner.wifiSometimes": "On occasion",
      "planner.ethernetOnly": "Ethernet only",
      "planner.rgbYes": "Yes",
      "planner.rgbNo": "No",
      "planner.rgbIndifferent": "Indifferent",
      "planner.cooling": "CPU Cooling",
      "planner.air": "Air",
      "planner.liquid": "Liquid",
      "planner.formFactor": "Case Form Factor",
      "planner.tower": "Tower",
      "planner.miniTower": "Mini Tower",
      "planner.sff": "Small Form Factor",
      "planner.fishTank": "Fish Tank",
      "planner.formFactorOther": "Other case form factor",
      "planner.formFactorOtherPh": "Ex: open-air, rackmount...",
      "planner.resolution": "Monitor Resolution",
      "planner.other": "Other Important Elements",
      "planner.otherPh": "Ex: very quiet PC, white theme, lots of USB ports, room for future upgrades...",
      "planner.previewTitle": "Request Preview",
      "planner.previewSubtitle": "This preview updates while the form is being filled.",
      "planner.emailTitle": "Need something simpler?",
      "planner.emailText": "You can still use the normal contact form if you prefer to describe everything manually.",
      "planner.emailCta": "Open contact section",
      "planner.formTitle": "Build Planner",
      "planner.formSubtitle": "Only the essential elements are required. Everything else is optional.",
      "planner.send": "Prepare email",
      "planner.reset": "Reset",
      "planner.budgetHelp": "Required. Example: 1000-1500, 2000, 2500-3000 CAD",
      "planner.budgetPh": "Ex: 1200-1800 CAD"
    });



    Object.assign(I18N.en, {
      "nav.planner": "Build Planner",
      "planner.back": "Back to main site",
      "planner.eyebrow": "Guided • Clear • Bilingual",
      "planner.title": "Plan your build easily.",
      "planner.lead": "This planner helps you describe the PC you want without needing to choose exact parts. Simply select your preferences and your request will be prepared automatically.",
      "planner.b1": "Only a few fields are required",
      "planner.b2": "Most options can be left blank if you are unsure",
      "planner.b3": "Your request is automatically prepared in an email",
      "planner.micro": "This tool takes less than a minute to complete.",
      "planner.cardTitle": "Why use the planner",
      "planner.cardSubtitle": "A simple and fast way to prepare your request.",
      "planner.card1t": "Faster",
      "planner.card1d": "Quicker than writing a long message.",
      "planner.card2t": "Clearer",
      "planner.card2d": "Helps define the type of PC you want.",
      "planner.card3t": "More accurate quote",
      "planner.card3d": "Makes it easier to prepare the right build.",
      "planner.budget": "Budget",
      "planner.gaming": "Gaming",
      "planner.browsing": "Browsing",
      "planner.simulations": "Simulations",
      "planner.cpu": "CPU Family",
      "planner.gpu": "GPU Family",
      "planner.ram": "RAM",
      "planner.unsure": "Unsure",
      "planner.p720": "720p",
      "planner.p1080": "1080p",
      "planner.p1440": "1440p",
      "planner.p4k": "4K",
      "planner.p8k": "8K"
    });

    const getLang = () => (localStorage.getItem("raymondpc_lang") || "fr") === "en" ? "en" : "fr";
    const t = () => P[getLang()];

    const normalizeValue = (name, raw) => {
      const v = (raw || "").toString();
      const maps = {
        use_case: {
          "Gaming": "gaming", "Work": "work", "Gaming + Work": "gaming_work", "Video Editing": "video_editing",
          "AI": "ai", "3D Modeling": "modeling", "Simulations": "simulations", "Browsing": "browsing", "Other": "other", "other": "other"
        },
        resolution: {"720p":"p720","1080p":"p1080","1440p":"p1440","4K":"p4k","8K":"p8k","Unsure":"unsure","unsure":"unsure"}
      };
      return (maps[name] && maps[name][v]) || v;
    };

    function createStorageRow() {
      const lang = getLang();
      const row = document.createElement("div");
      row.className = "storage-row";
      row.innerHTML = `
        <div class="storage-grid">
          <label class="field-stack">
            <span class="sr-only">${P[lang].misc.driveType}</span>
            <select name="storage_type[]" data-storage-type>
              <option value="" selected>${P[lang].misc.choose}</option>
              <option value="hdd">${P[lang].values.hdd}</option>
              <option value="sata_ssd">${P[lang].values.sata_ssd}</option>
              <option value="nvme">${P[lang].values.nvme}</option>
              <option value="hybrid">${P[lang].values.hybrid}</option>
              <option value="other">${P[lang].misc.otherLabel}</option>
              <option value="unsure">${P[lang].values.unsure}</option>
            </select>
          </label>
          <label class="field-stack">
            <span class="sr-only">${P[lang].misc.capacity}</span>
            <select name="storage_capacity[]" data-storage-capacity>
              <option value="" selected>${P[lang].misc.choose}</option>
              <option value="c500gb">${P[lang].values.c500gb}</option>
              <option value="c1tb">${P[lang].values.c1tb}</option>
              <option value="c2tb">${P[lang].values.c2tb}</option>
              <option value="c4tb">${P[lang].values.c4tb}</option>
              <option value="c8tb">${P[lang].values.c8tb}</option>
              <option value="c12tb">${P[lang].values.c12tb}</option>
              <option value="c16tb">${P[lang].values.c16tb}</option>
              <option value="c20tb">${P[lang].values.c20tb}</option>
              <option value="c24tb">${P[lang].values.c24tb}</option>
              <option value="c28tb">${P[lang].values.c28tb}</option>
              <option value="c32tb">${P[lang].values.c32tb}</option>
              <option value="c36tb">${P[lang].values.c36tb}</option>
              <option value="other">${P[lang].misc.otherLabel}</option>
              <option value="unsure">${P[lang].values.unsure}</option>
            </select>
          </label>
          <label class="field-stack storage-note-wrap">
            <span class="sr-only">${P[lang].misc.optionalNote}</span>
            <input type="text" name="storage_note[]" data-storage-note placeholder="${P[lang].misc.exampleStorage}">
          </label>
          <button class="btn btn-ghost btn-small storage-remove" type="button" aria-label="${P[lang].misc.removeRow}" title="${P[lang].misc.removeRow}">×</button>
        </div>`;
      row.querySelector(".storage-remove").addEventListener("click", () => {
        row.remove();
        if (!storageList.children.length) storageList.appendChild(createStorageRow());
        updatePlannerLanguageBits();
        updatePreview();
      });
      return row;
    }

    function ensureStorageRow() {
      if (!storageList.children.length) storageList.appendChild(createStorageRow());
    }

    function updatePlannerLanguageBits() {
      const lang = getLang();
      storageList.querySelectorAll(".storage-row").forEach((row) => {
        const type = row.querySelector("[data-storage-type]");
        const cap = row.querySelector("[data-storage-capacity]");
        const note = row.querySelector("[data-storage-note]");
        const typeVal = type.value, capVal = cap.value, noteVal = note.value;
        const newRow = createStorageRow();
        type.replaceWith(newRow.querySelector("[data-storage-type]"));
        cap.replaceWith(newRow.querySelector("[data-storage-capacity]"));
        note.replaceWith(newRow.querySelector("[data-storage-note]"));
        row.querySelector("[data-storage-type]").value = typeVal;
        row.querySelector("[data-storage-capacity]").value = capVal;
        row.querySelector("[data-storage-note]").value = noteVal;
      });
      syncSelectedPills();
      updatePreview();
    }

    function syncSelectedPills() {
      plannerForm.querySelectorAll(".pill, .choice-card").forEach((el) => {
        const input = el.querySelector("input");
        if (input) el.classList.toggle("is-selected", input.checked);
      });
    }

    function storageSummary() {
      const items = [];
      storageList.querySelectorAll(".storage-row").forEach((row) => {
        const type = row.querySelector("[data-storage-type]").value;
        const cap = row.querySelector("[data-storage-capacity]").value;
        const note = row.querySelector("[data-storage-note]").value.trim();
        if (!type && !cap && !note) return;
        const pieces = [];
        if (cap) pieces.push(t().values[cap] || cap);
        if (type) pieces.push(t().values[type] || (type === "other" ? t().misc.otherLabel : type));
        let line = pieces.join(" ").trim();
        if (!line) line = t().misc.otherLabel;
        if (note) line += ` — ${note}`;
        items.push(line);
      });
      return items;
    }

    function addPreviewItem(label, value, multiline=false) {
      if (!value) return;
      const item = document.createElement("div");
      item.className = "summary-item";
      const labelEl = document.createElement("div");
      labelEl.className = "summary-label";
      labelEl.textContent = label;
      const valueEl = document.createElement("div");
      valueEl.className = "summary-value";
      if (Array.isArray(value) && multiline) {
        const ul = document.createElement("ul");
        ul.className = "summary-storage";
        value.forEach(v => {
          const li = document.createElement("li");
          li.textContent = v;
          ul.appendChild(li);
        });
        valueEl.appendChild(ul);
      } else {
        valueEl.textContent = value;
      }
      item.append(labelEl, valueEl);
      previewEl.appendChild(item);
    }

    function updatePreview() {
      previewEl.innerHTML = "";
      const fd = new FormData(plannerForm);
      const values = {
        budget: (fd.get("budget") || "").toString().trim(),
        tier: normalizeValue("tier", fd.get("tier")),
        use_case: normalizeValue("use_case", fd.get("use_case")),
        cpu_family: normalizeValue("cpu_family", fd.get("cpu_family")),
        gpu_family: normalizeValue("gpu_family", fd.get("gpu_family")),
        ram: normalizeValue("ram", fd.get("ram")),
        wifi_use: normalizeValue("wifi_use", fd.get("wifi_use")),
        rgb: normalizeValue("rgb", fd.get("rgb")),
        cooling: normalizeValue("cooling", fd.get("cooling")),
        form_factor: normalizeValue("form_factor", fd.get("form_factor")),
        resolution: normalizeValue("resolution", fd.get("resolution")),
        other: (fd.get("other") || "").toString().trim(),
        use_case_other: (fd.get("use_case_other") || "").toString().trim(),
        form_factor_other: (fd.get("form_factor_other") || "").toString().trim(),
      };
      addPreviewItem(t().labels.budget, values.budget);
      addPreviewItem(t().labels.tier, t().values[values.tier] || values.tier);
      let useText = t().values[values.use_case] || values.use_case;
      if (values.use_case === "other" && values.use_case_other) useText = `${t().misc.otherLabel} — ${values.use_case_other}`;
      addPreviewItem(t().labels.use_case, useText);
      addPreviewItem(t().labels.cpu_family, t().values[values.cpu_family] || values.cpu_family);
      addPreviewItem(t().labels.gpu_family, t().values[values.gpu_family] || values.gpu_family);
      addPreviewItem(t().labels.ram, t().values[values.ram] || values.ram);
      const storage = storageSummary();
      if (storage.length) addPreviewItem(t().labels.storage, storage, true);
      addPreviewItem(t().labels.wifi_use, t().values[values.wifi_use] || values.wifi_use);
      addPreviewItem(t().labels.rgb, t().values[values.rgb] || values.rgb);
      addPreviewItem(t().labels.cooling, t().values[values.cooling] || values.cooling);
      let formText = t().values[values.form_factor] || values.form_factor;
      if (values.form_factor === "other" && values.form_factor_other) formText = `${t().misc.otherLabel} — ${values.form_factor_other}`;
      addPreviewItem(t().labels.form_factor, formText);
      addPreviewItem(t().labels.resolution, t().values[values.resolution] || values.resolution);
      addPreviewItem(t().labels.other, values.other);
      if (!previewEl.children.length) {
        const empty = document.createElement("div");
        empty.className = "muted";
        empty.textContent = t().misc.storageEmpty;
        previewEl.appendChild(empty);
      }
    }


    function toggleConditionalFields() {
      const useCaseSelect = plannerForm.querySelector('#useCaseSelect');
      const useCaseOtherInput = plannerForm.querySelector('#useCaseOtherInput');
      const formFactorSelect = plannerForm.querySelector('select[name="form_factor"]');
      const formFactorOtherInput = plannerForm.querySelector('input[name="form_factor_other"]');

      const toggleField = (input, show) => {
        const wrapper = input?.closest('.field-stack');
        if (!wrapper || !input) return;
        wrapper.hidden = !show;
        input.disabled = !show;
        if (!show) input.value = '';
      };

      toggleField(useCaseOtherInput, useCaseSelect?.value === 'other');
      toggleField(formFactorOtherInput, formFactorSelect?.value === 'other');
    }

    function validBudget(value) {
      return /^\s*\$?\d+[\d\s,]*(\s*[-–]\s*\$?\d+[\d\s,]*)?\s*([A-Za-z]{3})?\s*$/.test(value);
    }

    function plannerMailBody() {
      const lines = [];
      previewEl.querySelectorAll('.summary-item').forEach((item) => {
        const label = item.querySelector('.summary-label')?.textContent || '';
        const list = item.querySelectorAll('li');
        if (list.length) {
          lines.push(`${label}:`);
          list.forEach(li => lines.push(`- ${li.textContent}`));
        } else {
          const value = item.querySelector('.summary-value')?.textContent || '';
          lines.push(`${label}: ${value}`);
        }
      });
      return lines.join("\n");
    }

    plannerForm.addEventListener("input", () => { syncSelectedPills(); toggleConditionalFields(); updatePreview(); });
    plannerForm.addEventListener("change", () => { syncSelectedPills(); toggleConditionalFields(); updatePreview(); });
    plannerForm.addEventListener("reset", () => {
      setTimeout(() => {
        storageList.innerHTML = "";
        ensureStorageRow();
        validationEl.textContent = "";
        syncSelectedPills();
        updatePreview();
      }, 0);
    });
    plannerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const budget = (new FormData(plannerForm).get("budget") || "").toString().trim();
      if (!validBudget(budget)) {
        validationEl.textContent = t().misc.budgetRule;
        return;
      }
      validationEl.textContent = "";
      const subject = encodeURIComponent(t().emailSubject);
      const body = encodeURIComponent(plannerMailBody());
      window.location.href = `mailto:raymondservicepc@outlook.com?subject=${subject}&body=${body}`;
    });

    addStorageBtn?.addEventListener("click", () => {
      storageList.appendChild(createStorageRow());
      updatePreview();
    });

    const originalSetLanguage = setLanguage;
    setLanguage = function(lang) {
      originalSetLanguage(lang);
      updatePlannerLanguageBits();
      toggleConditionalFields();
    };

    ensureStorageRow();
    setLanguage(getLang());
    syncSelectedPills();
    toggleConditionalFields();
    updatePlannerLanguageBits();
  }

})();
