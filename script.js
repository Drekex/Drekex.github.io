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

      window.location.href = `mailto:etienneservicepc@outlook.com?subject=${subject}&body=${body}`;
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
      "nav.services": "Services",
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
