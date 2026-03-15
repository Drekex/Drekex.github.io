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

  /* ========= FRENCH-ONLY MODE ========= */

  function setLanguage() {
    document.documentElement.lang = "fr";
  }

  setLanguage();

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
        emailSubject: "[Raymond PC] Demande de montage pc"
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


    const getLang = () => "fr";
    const t = () => P[getLang()];
    const plannerEmail = "raymondservicepc@outlook.com";
    const plannerPhone = "+15147178283";

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
      const lines = [
        "Bonjour,",
        "",
        "Voici ma demande de montage PC :",
        ""
      ];
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
      lines.push('', 'Merci.');
      return lines.join("\n");
    }

    function openPlannerRequest(mode) {
      const budget = (new FormData(plannerForm).get("budget") || "").toString().trim();
      if (!validBudget(budget)) {
        validationEl.textContent = t().misc.budgetRule;
        return;
      }

      validationEl.textContent = "";
      const subject = t().emailSubject;
      const body = plannerMailBody();
      const encodedSubject = encodeURIComponent(subject);
      const encodedBody = encodeURIComponent(body);

      if (mode === "email") {
        window.location.href = `mailto:${plannerEmail}?subject=${encodedSubject}&body=${encodedBody}`;
        return;
      }

      if (mode === "sms") {
        window.location.href = `sms:${plannerPhone}?&body=${encodedBody}`;
        return;
      }

      if (mode === "whatsapp") {
        const text = encodeURIComponent(`${subject}\n\n${body}`);
        window.open(`https://wa.me/${plannerPhone.replace(/\D/g, "")}?text=${text}`, "_blank", "noopener");
        return;
      }

      if (mode === "copy") {
        const textToCopy = `${subject}\n\n${body}`;
        const onSuccess = () => {
          validationEl.textContent = "Le texte de la demande a été copié.";
        };
        const onFailure = () => {
          validationEl.textContent = "Impossible de copier automatiquement. Sélectionnez puis copiez l'aperçu.";
        };

        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(textToCopy).then(onSuccess).catch(onFailure);
        } else {
          onFailure();
        }
      }
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
      openPlannerRequest("email");
    });

    plannerForm.querySelectorAll('[data-send-mode]').forEach((btn) => {
      btn.addEventListener('click', () => {
        openPlannerRequest(btn.getAttribute('data-send-mode'));
      });
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
