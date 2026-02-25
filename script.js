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
      "nav.services": "Services",
      "nav.pricing": "Pricing",
      "nav.proof": "Why me",
      "nav.work": "Work",
      "nav.reviews": "Reviews",
      "nav.faq": "FAQ",
      "nav.cta": "Get a quote",

      "hero.eyebrow": "Local • Reliable • Optimized",
      "hero.title": "Custom PC builds, upgrades, and troubleshooting without the stress.",
      "hero.lead": "Gaming or productivity: I help pick parts, build clean, stress test, and optimize noise and temperatures for a stable PC long-term.",
      "hero.b1": "50+ builds completed",
      "hero.b2": "Verified 5★ reviews (Facebook Marketplace)",
      "hero.b3": "BIOS, Windows, drivers, stability and temps",
      "hero.cta1": "Request a quote",
      "hero.cta2": "See pricing",
      "hero.micro": "Fast reply by SMS/email. Based in Blainville near Fontainebleau. Service around Laval/Montreal North depending on the project.",

      "services.title": "Services",
      "services.subtitle": "Pick a package, or request something custom.",
      "services.s1t": "Custom PC build",
      "services.s1d": "Gaming/work. Clean build, ready to use.",
      "services.s2t": "Upgrades & maintenance",
      "services.s2d": "GPU/CPU/RAM/SSD upgrades, cleaning, airflow improvements.",
      "services.s3t": "Troubleshooting",
      "services.s3d": "Blue screens, crashes, temps, instability, boot issues.",

      "pricing.title": "Simple pricing",
      "reviews.title": "Customer reviews",
      "work.title": "Builds",
      "contact.title": "Contact / Quote",
      "contact.direct": "Direct contact",
      "footer.top": "Back to top"
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
