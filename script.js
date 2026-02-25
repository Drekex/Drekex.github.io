// Basic UI helpers (menu + year) + Lightbox (with arrows/keyboard)

(() => {
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

    // Close menu after clicking a link (mobile)
    links.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        if (links.classList.contains("open")) {
          links.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    });

    // Close menu on outside click (mobile)
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

  // Optional: lead form -> mailto (keeps it simple; no backend needed)
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

      // Opens user email client
      window.location.href = `mailto:etienneservicepc@outlook.com?subject=${subject}&body=${body}`;
    });
  }

  // Lightbox with arrows + keyboard
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightboxImg");
  const lbCaption = document.getElementById("lightboxCaption");
  const btnPrev = lb?.querySelector("[data-prev]");
  const btnNext = lb?.querySelector("[data-next]");

  const thumbs = Array.from(document.querySelectorAll(".img-btn"));
  let currentIndex = -1;

  if (lb && lbImg && thumbs.length) {
    function openAt(index) {
      if (index < 0) index = thumbs.length - 1;
      if (index >= thumbs.length) index = 0;

      currentIndex = index;
      const btn = thumbs[currentIndex];
      const img = btn.querySelector("img");
      const src = btn.getAttribute("data-full") || img?.getAttribute("src");
      const alt = img?.getAttribute("alt") || "Image en grand";

      lb.classList.add("open");
      lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      lbImg.src = src;
      lbImg.alt = alt;
      if (lbCaption) lbCaption.textContent = alt;

      // Disable nav buttons if only 1 image
      const disabled = thumbs.length <= 1;
      if (btnPrev) btnPrev.disabled = disabled;
      if (btnNext) btnNext.disabled = disabled;
    }

    function closeLightbox() {
      lb.classList.remove("open");
      lb.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      lbImg.src = "";
      lbImg.alt = "";
      if (lbCaption) lbCaption.textContent = "";
      currentIndex = -1;
    }

    function next() { if (currentIndex !== -1) openAt(currentIndex + 1); }
    function prev() { if (currentIndex !== -1) openAt(currentIndex - 1); }

    thumbs.forEach((btn, idx) => {
      btn.addEventListener("click", () => openAt(idx));
    });

    btnNext?.addEventListener("click", next);
    btnPrev?.addEventListener("click", prev);

    // Click backdrop / close button
    lb.addEventListener("click", (e) => {
      if (e.target.matches("[data-close]")) closeLightbox();
    });

    // Keyboard controls
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    });

    // Optional: click image to go next (feels nice)
    lbImg.addEventListener("click", () => {
      if (thumbs.length > 1) next();
    });
  }
})();
