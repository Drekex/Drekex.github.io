/* =========================================================
   Raymond PC : boutique
   Une seule source de donnees (data/products.json), modifiee avec
   l'editeur de boutique. Ce fichier sert les trois pages :
   boutique.html (catalogue), produit.html (fiche) et commande.html.
   ========================================================= */
(() => {
  const DATA_URL = "/data/products.json";
  const SITE_URL = "https://raymondpc.ca";
  const PLACEHOLDER = "assets/store/placeholder.svg";

  // Meme cle publique Web3Forms que script.js (sans danger cote client).
  const WEB3FORMS_KEY = "6a913f0b-3127-4563-ba95-920b98ade156";
  const WEB3FORMS_URL = "https://api.web3forms.com/submit";
  const CONTACT_EMAIL = "raymondservicepc@outlook.com";
  const CONTACT_PHONE = "+15147178283";

  const CATEGORIES = [
    ["cpu",     "Processeur (CPU)"],
    ["cooler",  "Refroidisseur CPU"],
    ["motherboard", "Carte mère"],
    ["memory",  "Mémoire (RAM)"],
    ["storage", "Stockage"],
    ["gpu",     "Carte graphique (GPU)"],
    ["case",    "Boîtier"],
    ["psu",     "Bloc d'alimentation"],
    ["pc",      "PC complet"],
    ["os",      "Système d'exploitation"]
  ];
  const CAT_LABEL = Object.fromEntries(CATEGORIES);

  const CONDITIONS = [
    ["new",         "Neuf",          "L'article n'a jamais été ouvert, ou il s'agit d'un PC monté ici avec des composants neufs."],
    ["like_new",    "Comme neuf",    "L'article a servi une seule fois ou quelques fois, ou a été testé fonctionnel comme neuf, sans aucun dommage visible."],
    ["light_wear",  "Usure légère",  "L'article a été utilisé pendant un certain temps sans changement notable. Il peut présenter ou non des marques visibles."],
    ["refurbished", "Remis à neuf",  "L'article est composé d'une ou de plusieurs pièces usagées qui ont toutes été testées."]
  ];
  const COND = Object.fromEntries(CONDITIONS.map(([id, label, desc]) => [id, { label, desc }]));
  const SCHEMA_COND = {
    new: "https://schema.org/NewCondition",
    like_new: "https://schema.org/UsedCondition",
    light_wear: "https://schema.org/UsedCondition",
    refurbished: "https://schema.org/RefurbishedCondition"
  };

  /* ---------- Utilitaires ---------- */
  const $ = (s, root = document) => root.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const moneyFmt = new Intl.NumberFormat("fr-CA", { style: "currency", currency: "CAD" });
  const money = (n) => moneyFmt.format(Number(n) || 0);
  const kg = (n) => `${String(n).replace(".", ",")} kg`;
  const today = () => new Date().toISOString().slice(0, 10);
  const fmtDate = (iso) => {
    const d = new Date(iso + "T12:00:00");
    return isNaN(d) ? iso : d.toLocaleDateString("fr-CA", { day: "numeric", month: "long", year: "numeric" });
  };
  const paragraphs = (text) => String(text || "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    .map((p) => `<p>${esc(p).replace(/\n/g, "<br>")}</p>`).join("");

  function promoActive(p) {
    const pr = p.promo;
    if (!pr || !pr.active) return false;
    if (pr.ends && pr.ends < today()) return false;
    return true;
  }
  const hasPromoPrice = (p) => promoActive(p) && Number(p.promo.price) > 0 && Number(p.promo.price) < Number(p.price);
  const finalPrice = (p) => (hasPromoPrice(p) ? Number(p.promo.price) : Number(p.price));
  const isBuyable = (p) => (p.status || "available") === "available";
  const thumbOf = (p) => p.thumb || (p.images && p.images[0]) || PLACEHOLDER;
  const imagesOf = (p) => (p.images && p.images.length ? p.images : [p.thumb || PLACEHOLDER]);
  const productUrl = (p) => `produit.html?id=${encodeURIComponent(p.id)}`;

  function condBadge(c) {
    const cond = COND[c];
    return cond ? `<span class="badge-cond cond-${esc(c)}">${esc(cond.label)}</span>` : "";
  }
  function statusLabel(p) {
    if (p.status === "sold") return "Vendu";
    if (p.status === "reserved") return "Réservé";
    return "";
  }
  function priceHtml(p) {
    if (hasPromoPrice(p)) {
      return `<span class="price-now is-promo">${money(p.promo.price)}</span><span class="price-old">${money(p.price)}</span>`;
    }
    return `<span class="price-now">${money(p.price)}</span>`;
  }

  async function loadProducts() {
    const res = await fetch(DATA_URL, { cache: "no-cache" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    const list = Array.isArray(data) ? data : (data.products || []);
    return list.filter((p) => p && p.id && p.status !== "draft");
  }

  function loadError(target) {
    target.innerHTML = `<div class="card shop-empty"><h3>Boutique momentanément indisponible</h3>
      <p class="muted">La liste des articles n'a pas pu être chargée. Réessayez dans un instant ou écrivez-moi par
      <a class="v" href="sms:${CONTACT_PHONE}">SMS</a> ou <a class="v" href="mailto:${CONTACT_EMAIL}">courriel</a>.</p></div>`;
  }

  const page = document.body.dataset.page;
  if (page === "store") initStore();
  if (page === "product") initProduct();
  if (page === "order") initOrder();

  /* =========================================================
     CATALOGUE
     ========================================================= */
  async function initStore() {
    const grid = $("#productGrid");
    const countEl = $("#resultCount");
    const chipsEl = $("#catChips");
    const catBox = $("#filterCats");
    const condBox = $("#filterConds");
    const promoCb = $("#filterPromo");
    const soldCb = $("#filterSold");
    const minEl = $("#priceMin");
    const maxEl = $("#priceMax");
    const searchEl = $("#shopSearch");
    const sortEl = $("#shopSort");
    const resetBtn = $("#filterReset");
    const filtersDetails = $("#shopFilters");

    let all = [];
    try { all = await loadProducts(); }
    catch (e) { loadError(grid); countEl.textContent = ""; return; }

    // Etat initial depuis l'URL (liens partageables : boutique.html?cat=gpu&etat=new)
    const params = new URLSearchParams(location.search);
    const listParam = (k) => (params.get(k) || "").split(",").map((s) => s.trim()).filter(Boolean);
    const state = {
      cats: new Set(listParam("cat").filter((c) => CAT_LABEL[c])),
      conds: new Set(listParam("etat").filter((c) => COND[c])),
      promo: params.get("promo") === "1",
      sold: params.get("vendus") === "1",
      min: params.get("min") || "",
      max: params.get("max") || "",
      q: params.get("q") || "",
      sort: params.get("tri") || "recent"
    };

    const countBy = (key) => all.reduce((m, p) => {
      if (p.status === "sold" && !state.sold) return m;
      m[p[key]] = (m[p[key]] || 0) + 1; return m;
    }, {});

    function checkRow(name, value, label, n, dotColor) {
      return `<label class="check">
        <input type="checkbox" name="${name}" value="${esc(value)}" ${n ? "" : "disabled"}>
        ${dotColor ? `<span class="dot" style="background:${dotColor}"></span>` : ""}
        <span class="lbl">${esc(label)}</span><span class="n">${n || 0}</span>
      </label>`;
    }

    function buildFilters() {
      const cc = countBy("category");
      const cd = countBy("condition");
      catBox.innerHTML = CATEGORIES.map(([id, label]) => checkRow("cat", id, label, cc[id])).join("");
      const dots = { new: "var(--c-new)", like_new: "var(--c-like-new)", light_wear: "var(--c-light-wear)", refurbished: "var(--c-refurb)" };
      condBox.innerHTML = CONDITIONS.map(([id, label]) => checkRow("cond", id, label, cd[id], dots[id])).join("");
      const total = Object.values(cc).reduce((a, b) => a + b, 0);
      chipsEl.innerHTML = `<button type="button" class="cat-chip" data-cat="">Tous <span class="n">${total}</span></button>` +
        CATEGORIES.filter(([id]) => cc[id]).map(([id, label]) =>
          `<button type="button" class="cat-chip" data-cat="${id}">${esc(label)} <span class="n">${cc[id]}</span></button>`).join("");
      syncControls();
    }

    function syncControls() {
      catBox.querySelectorAll("input").forEach((i) => { i.checked = state.cats.has(i.value); if (i.checked) i.disabled = false; });
      condBox.querySelectorAll("input").forEach((i) => { i.checked = state.conds.has(i.value); if (i.checked) i.disabled = false; });
      chipsEl.querySelectorAll(".cat-chip").forEach((b) => {
        const c = b.dataset.cat;
        b.classList.toggle("is-active", c ? (state.cats.size === 1 && state.cats.has(c)) : state.cats.size === 0);
      });
      promoCb.checked = state.promo;
      soldCb.checked = state.sold;
      minEl.value = state.min;
      maxEl.value = state.max;
      searchEl.value = state.q;
      sortEl.value = state.sort;
    }

    function writeUrl() {
      const p = new URLSearchParams();
      if (state.cats.size) p.set("cat", [...state.cats].join(","));
      if (state.conds.size) p.set("etat", [...state.conds].join(","));
      if (state.promo) p.set("promo", "1");
      if (state.sold) p.set("vendus", "1");
      if (state.min) p.set("min", state.min);
      if (state.max) p.set("max", state.max);
      if (state.q) p.set("q", state.q);
      if (state.sort !== "recent") p.set("tri", state.sort);
      const qs = p.toString();
      history.replaceState(null, "", location.pathname + (qs ? "?" + qs : ""));
    }

    const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

    function render() {
      const min = parseFloat(String(state.min).replace(",", "."));
      const max = parseFloat(String(state.max).replace(",", "."));
      const q = norm(state.q).trim();
      let list = all.filter((p) => {
        if (p.status === "sold" && !state.sold) return false;
        if (state.cats.size && !state.cats.has(p.category)) return false;
        if (state.conds.size && !state.conds.has(p.condition)) return false;
        if (state.promo && !promoActive(p)) return false;
        const price = finalPrice(p);
        if (!isNaN(min) && price < min) return false;
        if (!isNaN(max) && price > max) return false;
        if (q) {
          const hay = norm([p.name, p.summary, CAT_LABEL[p.category], (p.specs || []).map((s) => s.join(" ")).join(" ")].join(" "));
          if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
        }
        return true;
      });

      const rank = (p) => (p.status === "sold" ? 2 : p.status === "reserved" ? 1 : 0);
      const sorters = {
        recent: (a, b) => String(b.date_added || "").localeCompare(String(a.date_added || "")),
        prix_asc: (a, b) => finalPrice(a) - finalPrice(b),
        prix_desc: (a, b) => finalPrice(b) - finalPrice(a),
        promo: (a, b) => (promoActive(b) - promoActive(a)) || String(b.date_added || "").localeCompare(String(a.date_added || ""))
      };
      list.sort((a, b) => (rank(a) - rank(b)) || (sorters[state.sort] || sorters.recent)(a, b));

      countEl.textContent = list.length === 1 ? "1 article" : `${list.length} articles`;

      if (!list.length) {
        grid.innerHTML = `<div class="card shop-empty" style="grid-column:1/-1">
          <h3>Aucun article ne correspond à ces filtres</h3>
          <p class="muted">Essayez d'enlever un filtre, ou écrivez-moi : je peux souvent trouver la pièce recherchée.</p>
          <div class="inline-links" style="justify-content:center"><button class="btn btn-secondary" type="button" data-reset>Effacer les filtres</button>
          <a class="btn btn-ghost" href="/#contact">Faire une demande</a></div></div>`;
        return;
      }

      grid.innerHTML = list.map((p) => {
        const st = statusLabel(p);
        return `<a class="card product-card${st ? " is-unavailable" : ""}" href="${productUrl(p)}">
          <div class="product-thumb">
            <img src="${esc(thumbOf(p))}" alt="${esc(p.name)}" loading="lazy" onerror="this.onerror=null;this.src='${PLACEHOLDER}'">
            <div class="product-badges">${condBadge(p.condition)}${promoActive(p) ? `<span class="badge-promo">Promo</span>` : ""}</div>
            ${st ? `<div class="status-ribbon">${st}</div>` : ""}
          </div>
          <div class="product-body">
            <div class="product-cat">${esc(CAT_LABEL[p.category] || "")}</div>
            <h3 class="product-name">${esc(p.name)}</h3>
            ${p.summary ? `<p class="product-summary">${esc(p.summary)}</p>` : ""}
            <div class="product-price">${priceHtml(p)}<span class="price-tax">taxes incl.</span></div>
          </div>
        </a>`;
      }).join("");
    }

    function update() { syncControls(); writeUrl(); render(); }

    catBox.addEventListener("change", (e) => {
      if (e.target.checked) state.cats.add(e.target.value); else state.cats.delete(e.target.value);
      update();
    });
    condBox.addEventListener("change", (e) => {
      if (e.target.checked) state.conds.add(e.target.value); else state.conds.delete(e.target.value);
      update();
    });
    chipsEl.addEventListener("click", (e) => {
      const b = e.target.closest(".cat-chip"); if (!b) return;
      state.cats = new Set(b.dataset.cat ? [b.dataset.cat] : []);
      update();
    });
    promoCb.addEventListener("change", () => { state.promo = promoCb.checked; update(); });
    soldCb.addEventListener("change", () => { state.sold = soldCb.checked; buildFilters(); update(); });
    let priceTimer;
    [minEl, maxEl].forEach((el) => el.addEventListener("input", () => {
      clearTimeout(priceTimer);
      priceTimer = setTimeout(() => { state.min = minEl.value.trim(); state.max = maxEl.value.trim(); writeUrl(); render(); }, 250);
    }));
    let qTimer;
    searchEl.addEventListener("input", () => {
      clearTimeout(qTimer);
      qTimer = setTimeout(() => { state.q = searchEl.value; writeUrl(); render(); }, 200);
    });
    sortEl.addEventListener("change", () => { state.sort = sortEl.value; update(); });
    function resetAll() {
      Object.assign(state, { cats: new Set(), conds: new Set(), promo: false, min: "", max: "", q: "" });
      update();
    }
    resetBtn.addEventListener("click", resetAll);
    grid.addEventListener("click", (e) => { if (e.target.closest("[data-reset]")) resetAll(); });

    // Les filtres restent ouverts sur grand ecran, repliés sur telephone.
    if (filtersDetails && window.matchMedia) {
      const narrow = window.matchMedia("(max-width:980px)");
      const sync = () => { filtersDetails.open = !narrow.matches; };
      sync();
      if (narrow.addEventListener) narrow.addEventListener("change", sync);
    }

    buildFilters();
    render();
  }

  /* =========================================================
     FICHE PRODUIT
     ========================================================= */
  async function initProduct() {
    const root = $("#productRoot");
    const id = new URLSearchParams(location.search).get("id");
    let all = [];
    try { all = await loadProducts(); }
    catch (e) { loadError(root); return; }
    const p = all.find((x) => x.id === id);
    if (!p) {
      root.innerHTML = `<div class="card shop-empty"><h3>Article introuvable</h3>
        <p class="muted">Cet article a peut-être été vendu ou retiré de la boutique.</p>
        <div class="inline-links" style="justify-content:center"><a class="btn btn-primary" href="boutique.html">Voir la boutique</a></div></div>`;
      return;
    }

    document.title = `${p.name} | Boutique Raymond PC`;
    const metaDesc = $('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", (p.summary || p.name) + " Prix taxes incluses, livraison partout au Canada.");
    const canon = $('link[rel="canonical"]');
    if (canon) canon.setAttribute("href", `${SITE_URL}/${productUrl(p)}`);

    const imgs = imagesOf(p);
    const st = statusLabel(p);
    const promo = promoActive(p);
    const save = hasPromoPrice(p) ? Number(p.price) - Number(p.promo.price) : 0;
    const specs = (p.specs || []).filter((s) => s && (s[0] || s[1]));
    const askText = `Bonjour, j'ai une question sur l'article « ${p.name} » (${SITE_URL}/${productUrl(p)}).`;

    root.innerHTML = `
      <a class="back-link" href="boutique.html${p.category ? "?cat=" + encodeURIComponent(p.category) : ""}">Retour à la boutique</a>
      <div class="product-layout">
        <div class="product-gallery">
          <button class="gallery-main" type="button" id="galleryMain" aria-label="Agrandir l'image">
            <img src="${esc(imgs[0])}" alt="${esc(p.name)}" onerror="this.onerror=null;this.src='${PLACEHOLDER}'">
          </button>
          ${imgs.length > 1 ? `<div class="gallery-thumbs" id="galleryThumbs">${imgs.map((src, i) =>
            `<button type="button" data-i="${i}" class="${i ? "" : "is-active"}" aria-label="Image ${i + 1}"><img src="${esc(src)}" alt="" loading="lazy" onerror="this.onerror=null;this.src='${PLACEHOLDER}'"></button>`).join("")}</div>` : ""}
        </div>

        <div class="product-info">
          <p class="eyebrow">${esc(CAT_LABEL[p.category] || "Boutique")}</p>
          <h1>${esc(p.name)}</h1>
          <div class="badges-row">${condBadge(p.condition)}${promo ? `<span class="badge-promo">Promo</span>` : ""}${st ? `<span class="badge-status">${st}</span>` : ""}</div>

          <div class="card glass price-block">
            <div class="price-line">${priceHtml(p)}${save > 0 ? `<span class="save">Économisez ${money(save)}</span>` : ""}</div>
            <ul class="price-meta">
              <li><span class="k muted">Taxes</span><span class="v">Incluses dans le prix</span></li>
              <li><span class="k muted">Livraison</span><span class="v">Calculée à la commande (Canada)</span></li>
              <li><span class="k muted">Paiement</span><span class="v">Virement Interac</span></li>
              <li><span class="k muted">Référence</span><span class="v">${esc(p.id)}</span></li>
            </ul>
          </div>

          ${promo ? `<div class="promo-box">
            <strong>${esc(p.promo.label || "Promotion")}</strong>
            ${p.promo.details ? `<p>${esc(p.promo.details)}</p>` : ""}
            ${p.promo.ends ? `<p class="micro muted">Jusqu'au ${esc(fmtDate(p.promo.ends))} inclusivement.</p>` : ""}
          </div>` : ""}

          <div class="buy-row">
            ${isBuyable(p)
              ? `<a class="btn btn-primary btn-full" href="commande.html?id=${encodeURIComponent(p.id)}">Acheter</a>`
              : `<button class="btn btn-secondary btn-full" type="button" disabled>${st === "Vendu" ? "Cet article est vendu" : "Article réservé pour le moment"}</button>`}
            <div class="lead-alt-actions">
              <a class="btn btn-secondary" href="sms:${CONTACT_PHONE}?&body=${encodeURIComponent(askText)}">Question par SMS</a>
              <a class="btn btn-secondary" href="mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("[Raymond PC] Question : " + p.name)}&body=${encodeURIComponent(askText)}">Par courriel</a>
            </div>
          </div>
        </div>
      </div>

      <div class="product-details">
        <div style="display:grid;gap:18px">
          <article class="card product-desc">
            <h2 style="margin:0 0 12px;font-size:1.25rem">Description</h2>
            ${paragraphs(p.description) || `<p class="muted">${esc(p.summary || "")}</p>`}
          </article>
          ${specs.length ? `<article class="card">
            <h2 style="margin:0 0 8px;font-size:1.25rem">Caractéristiques</h2>
            <table class="spec-table"><tbody>${specs.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}</tbody></table>
          </article>` : ""}
        </div>

        <div style="display:grid;gap:18px">
          <article class="card">
            <h2 style="margin:0 0 4px;font-size:1.25rem">État de l'article</h2>
            <div class="cond-scale">${CONDITIONS.map(([id, label, desc]) =>
              `<div class="cond-step${id === p.condition ? " is-current" : ""}">${condBadge(id)}<p>${esc(desc)}</p></div>`).join("")}</div>
            ${p.condition_note ? `<div class="note cond-note"><strong>Pour cet article :</strong> ${esc(p.condition_note)}</div>` : ""}
          </article>
          <article class="card">
            <h2 style="margin:0 0 4px;font-size:1.25rem">Comment se passe l'achat</h2>
            <ol class="how-steps">
              <li>Vous remplissez le formulaire de commande avec votre adresse de livraison.</li>
              <li>Je vous envoie le total, livraison incluse, avec les coordonnées pour le virement Interac.</li>
              <li>Vous envoyez le virement. L'article est réservé à votre nom.</li>
              <li>J'expédie le colis et vous recevez le numéro de suivi.</li>
            </ol>
          </article>
        </div>
      </div>`;

    // Donnees structurees Product pour Google (rendues par JS, lues au rendu).
    const ld = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.name,
      description: p.summary || p.description || p.name,
      image: imgs.filter((s) => s !== PLACEHOLDER).map((s) => `${SITE_URL}/${s.replace(/^\//, "")}`),
      sku: p.id,
      category: CAT_LABEL[p.category] || "",
      itemCondition: SCHEMA_COND[p.condition] || "https://schema.org/UsedCondition",
      offers: {
        "@type": "Offer",
        url: `${SITE_URL}/${productUrl(p)}`,
        priceCurrency: "CAD",
        price: finalPrice(p).toFixed(2),
        availability: p.status === "sold" ? "https://schema.org/SoldOut" : p.status === "reserved" ? "https://schema.org/LimitedAvailability" : "https://schema.org/InStock",
        itemCondition: SCHEMA_COND[p.condition] || "https://schema.org/UsedCondition",
        seller: { "@type": "Organization", name: "Raymond PC" }
      }
    };
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(ld);
    document.head.appendChild(s);

    setupGallery(imgs, p.name);
  }

  function setupGallery(imgs, name) {
    const main = $("#galleryMain");
    const mainImg = main.querySelector("img");
    const thumbs = $("#galleryThumbs");
    const lb = $("#shopLightbox");
    const lbImg = $("#shopLightboxImg");
    const lbCap = $("#shopLightboxCaption");
    let cur = 0;

    function show(i) {
      cur = (i + imgs.length) % imgs.length;
      mainImg.src = imgs[cur];
      thumbs?.querySelectorAll("button").forEach((b) => b.classList.toggle("is-active", +b.dataset.i === cur));
      if (lb.classList.contains("open")) { lbImg.src = imgs[cur]; lbCap.textContent = `${name} (${cur + 1}/${imgs.length})`; }
    }
    function open() {
      lb.classList.add("open"); lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      lbImg.src = imgs[cur]; lbImg.alt = name;
      lbCap.textContent = imgs.length > 1 ? `${name} (${cur + 1}/${imgs.length})` : name;
      lb.querySelectorAll("[data-prev],[data-next]").forEach((b) => { b.hidden = imgs.length < 2; });
    }
    function close() {
      lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true");
      document.body.style.overflow = ""; lbImg.src = "";
    }
    thumbs?.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) show(+b.dataset.i); });
    main.addEventListener("click", open);
    lb.addEventListener("click", (e) => {
      if (e.target.closest("[data-close]")) close();
      if (e.target.closest("[data-prev]")) show(cur - 1);
      if (e.target.closest("[data-next]")) show(cur + 1);
    });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") show(cur + 1);
      if (e.key === "ArrowLeft") show(cur - 1);
    });
  }

  /* =========================================================
     COMMANDE
     ========================================================= */
  const PROVINCES = [
    ["QC", "Québec"], ["ON", "Ontario"], ["NB", "Nouveau-Brunswick"], ["NS", "Nouvelle-Écosse"],
    ["PE", "Île-du-Prince-Édouard"], ["NL", "Terre-Neuve-et-Labrador"], ["MB", "Manitoba"],
    ["SK", "Saskatchewan"], ["AB", "Alberta"], ["BC", "Colombie-Britannique"],
    ["YT", "Yukon"], ["NT", "Territoires du Nord-Ouest"], ["NU", "Nunavut"]
  ];
  // Premiere lettre du code postal -> province(s) possibles (Postes Canada).
  const POSTAL_PROV = {
    A: ["NL"], B: ["NS"], C: ["PE"], E: ["NB"], G: ["QC"], H: ["QC"], J: ["QC"],
    K: ["ON"], L: ["ON"], M: ["ON"], N: ["ON"], P: ["ON"], R: ["MB"], S: ["SK"],
    T: ["AB"], V: ["BC"], X: ["NT", "NU"], Y: ["YT"]
  };
  const POSTAL_RE = /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z] ?\d[ABCEGHJ-NPRSTV-Z]\d$/;
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const deaccent = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z]/g, "");
  const PROV_BY_NAME = {};
  PROVINCES.forEach(([code, name]) => { PROV_BY_NAME[deaccent(name)] = code; PROV_BY_NAME[code.toLowerCase()] = code; });
  Object.assign(PROV_BY_NAME, {
    quebec: "QC", newbrunswick: "NB", novascotia: "NS", princeedwardisland: "PE",
    newfoundlandandlabrador: "NL", britishcolumbia: "BC", northwestterritories: "NT"
  });

  const formatPostal = (v) => {
    const s = String(v || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
    return s.length > 3 ? `${s.slice(0, 3)} ${s.slice(3)}` : s;
  };
  const phoneDigits = (v) => {
    let d = String(v || "").replace(/\D/g, "");
    if (d.length === 11 && d[0] === "1") d = d.slice(1);
    return d;
  };
  const formatPhone = (d) => (d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : d);

  async function initOrder() {
    const root = $("#orderRoot");
    const id = new URLSearchParams(location.search).get("id");
    let all = [];
    try { all = await loadProducts(); }
    catch (e) { loadError(root); return; }
    const p = all.find((x) => x.id === id);
    if (!p) {
      root.innerHTML = `<div class="card shop-empty"><h3>Aucun article sélectionné</h3>
        <p class="muted">Choisissez d'abord un article dans la boutique, puis appuyez sur Acheter.</p>
        <div class="inline-links" style="justify-content:center"><a class="btn btn-primary" href="boutique.html">Voir la boutique</a></div></div>`;
      return;
    }
    if (!isBuyable(p)) {
      root.innerHTML = `<div class="card shop-empty"><h3>${p.status === "sold" ? "Cet article est vendu" : "Cet article est réservé"}</h3>
        <p class="muted">Il n'est plus disponible à la commande pour le moment.</p>
        <div class="inline-links" style="justify-content:center"><a class="btn btn-primary" href="boutique.html">Voir les autres articles</a>
        <a class="btn btn-ghost" href="${productUrl(p)}">Revoir la fiche</a></div></div>`;
      return;
    }

    document.title = `Commander : ${p.name} | Boutique Raymond PC`;
    const promo = promoActive(p);

    root.innerHTML = `
      <a class="back-link" href="${productUrl(p)}">Retour à l'article</a>
      <div class="order-layout">
        <form class="card order-form" id="orderForm" novalidate>
          <h2 style="margin:0 0 6px;font-size:1.45rem">Informations de livraison</h2>
          <p class="muted" style="margin:0">Les champs marqués <span class="required">*</span> sont obligatoires. Rien n'est payé à cette étape.</p>

          <div class="fieldset-title">Destinataire</div>
          <div class="form-row">
            <label class="field"><span>Nom complet <span class="req">*</span></span>
              <input name="fullname" autocomplete="name" placeholder="Prénom et nom" maxlength="80">
              <span class="err" data-err="fullname" hidden></span></label>
            <label class="field"><span>Entreprise <span class="opt">(facultatif)</span></span>
              <input name="company" autocomplete="organization" placeholder="Nom de l'entreprise" maxlength="80"></label>
          </div>

          <div class="fieldset-title">Adresse</div>
          <label class="field"><span>Pays</span>
            <select name="country" disabled><option selected>Canada</option></select>
            <span class="hint">Livraison au Canada seulement.</span></label>

          <div class="field" id="addrField">
            <label for="addrStreet"><span>Adresse (numéro civique et rue) <span class="req">*</span></span></label>
            <input id="addrStreet" name="street" autocomplete="off" placeholder="Commencez à taper, ex. : 1000 boul. du Curé-Labelle" maxlength="120"
              role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="addrSuggest">
            <div class="addr-suggest" id="addrSuggest" role="listbox" hidden></div>
            <span class="hint" id="addrHint">Choisissez une suggestion pour remplir la ville, la province et le code postal automatiquement.</span>
            <span class="err" data-err="street" hidden></span>
          </div>

          <label class="field"><span>Appartement, bureau, unité <span class="opt">(facultatif)</span></span>
            <input name="unit" autocomplete="address-line2" placeholder="Ex. : app. 4" maxlength="40"></label>

          <div class="form-row three">
            <label class="field"><span>Ville <span class="req">*</span></span>
              <input name="city" autocomplete="address-level2" maxlength="60">
              <span class="err" data-err="city" hidden></span></label>
            <label class="field"><span>Province <span class="req">*</span></span>
              <select name="province" autocomplete="address-level1">
                <option value="">Choisir…</option>
                ${PROVINCES.map(([c, n]) => `<option value="${c}">${esc(n)}</option>`).join("")}
              </select>
              <span class="err" data-err="province" hidden></span></label>
            <label class="field"><span>Code postal <span class="req">*</span></span>
              <input name="postal" autocomplete="postal-code" placeholder="A1A 1A1" maxlength="7" style="text-transform:uppercase">
              <span class="err" data-err="postal" hidden></span></label>
          </div>

          <div class="fieldset-title">Pour vous joindre</div>
          <div class="form-row">
            <label class="field"><span>Téléphone <span class="opt">(facultatif)</span></span>
              <input name="phone" type="tel" inputmode="tel" autocomplete="tel-national" placeholder="(514) 555-1234" maxlength="20">
              <span class="hint">10 chiffres, avec l'indicatif régional.</span>
              <span class="err" data-err="phone" hidden></span></label>
            <label class="field"><span>Courriel <span class="req">*</span></span>
              <input name="email" type="email" autocomplete="email" placeholder="vous@exemple.com" maxlength="120">
              <span class="hint">C'est là que je vous envoie le total avec la livraison et le suivi du colis.</span>
              <span class="err" data-err="email" hidden></span></label>
          </div>

          <label class="field"><span>Note <span class="opt">(facultatif)</span></span>
            <textarea name="note" rows="3" maxlength="800" placeholder="Une question, une précision pour la livraison…"></textarea></label>

          <input class="hp-field" type="checkbox" name="botcheck" tabindex="-1" autocomplete="off" aria-hidden="true">

          <button class="btn btn-primary btn-full send-btn" type="submit" id="sendBtn" disabled>Envoyer la commande</button>
          <div class="send-state" id="sendState" aria-live="polite"></div>
          <div class="form-status" id="orderStatus" role="status" aria-live="polite" hidden></div>
          <p class="micro muted" style="margin-top:14px">Le formulaire est acheminé par Web3Forms, qui me transmet votre commande par courriel. Vos coordonnées servent uniquement à cette commande.</p>
        </form>

        <aside class="order-summary">
          <div class="card glass">
            <div class="order-item">
              <img src="${esc(thumbOf(p))}" alt="" onerror="this.onerror=null;this.src='${PLACEHOLDER}'">
              <div><h3>${esc(p.name)}</h3><div>${condBadge(p.condition)}</div></div>
            </div>
            <ul class="order-lines">
              <li><span class="muted">Prix (taxes incluses)</span><span>${hasPromoPrice(p) ? `<span class="price-old" style="margin-right:6px">${money(p.price)}</span>` : ""}${money(finalPrice(p))}</span></li>
              ${promo ? `<li><span class="muted">Promotion</span><span style="color:#ff8a8d">${esc(p.promo.label || "Promo")}</span></li>` : ""}
              <li><span class="muted">Livraison</span><span>Calculée après la commande</span></li>
            </ul>
          </div>
          <div class="card" style="margin-top:16px">
            <h3 style="font-size:1.05rem">Après l'envoi</h3>
            <ol class="how-steps">
              <li>Je calcule la livraison vers votre adresse.</li>
              <li>Vous recevez le total, livraison incluse, avec le courriel ou le numéro pour le virement Interac.</li>
              <li>Le colis part dès la réception du virement.</li>
            </ol>
          </div>
        </aside>
      </div>`;

    setupOrderForm(p);
  }

  function setupOrderForm(p) {
    const form = $("#orderForm");
    const f = form.elements;
    const sendBtn = $("#sendBtn");
    const sendState = $("#sendState");
    const statusEl = $("#orderStatus");
    const street = $("#addrStreet");
    const box = $("#addrSuggest");
    const hint = $("#addrHint");
    const touched = new Set();
    let verified = false; // adresse choisie dans les suggestions et non modifiee depuis

    function validate() {
      const e = {};
      const name = f.fullname.value.trim();
      if (name.length < 2) e.fullname = "Entrez votre nom complet.";
      const st = f.street.value.trim();
      if (!st) e.street = "Entrez votre adresse.";
      else if (!/\d/.test(st)) e.street = "Incluez le numéro civique (ex. : 123 rue Principale).";
      if (!f.city.value.trim()) e.city = "Entrez la ville.";
      const prov = f.province.value;
      if (!prov) e.province = "Choisissez la province.";
      const postal = f.postal.value.trim().toUpperCase();
      if (!postal) e.postal = "Entrez le code postal.";
      else if (!POSTAL_RE.test(postal)) e.postal = "Format attendu : A1A 1A1.";
      else if (prov && !(POSTAL_PROV[postal[0]] || []).includes(prov)) {
        const guess = (POSTAL_PROV[postal[0]] || []).map((c) => PROVINCES.find((x) => x[0] === c)?.[1]).join(" ou ");
        e.postal = `Ce code postal ne correspond pas à la province choisie (${postal[0]}… : ${guess}).`;
      }
      const phone = f.phone.value.trim();
      const email = f.email.value.trim();
      if (phone) {
        const d = phoneDigits(phone);
        if (d.length !== 10) e.phone = "Le numéro doit contenir 10 chiffres, indicatif régional compris.";
        else if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(d)) e.phone = "Indicatif régional ou numéro invalide.";
      }
      if (!email) e.email = "Entrez votre courriel : c'est par là que je vous envoie le total et le suivi.";
      else if (!EMAIL_RE.test(email)) e.email = "Adresse courriel invalide.";
      return e;
    }

    const LABELS = { fullname: "nom complet", street: "adresse", city: "ville", province: "province", postal: "code postal", phone: "téléphone", email: "courriel" };

    function refresh() {
      const errs = validate();
      form.querySelectorAll("[data-err]").forEach((el) => {
        const k = el.dataset.err;
        const show = errs[k] && touched.has(k);
        el.textContent = show ? errs[k] : "";
        el.hidden = !show;
        const input = f[k];
        if (input && input.classList) {
          input.classList.toggle("is-invalid", !!show);
          input.classList.toggle("is-valid", !errs[k] && touched.has(k) && !!String(input.value).trim());
        }
      });
      const missing = Object.keys(errs);
      sendBtn.disabled = missing.length > 0;
      if (missing.length) {
        sendState.className = "send-state";
        sendState.textContent = "À compléter : " + [...new Set(missing.map((k) => LABELS[k]))].join(", ") + ".";
      } else {
        sendState.className = "send-state is-ready";
        sendState.textContent = "Tout est prêt, vous pouvez envoyer la commande.";
      }
      return errs;
    }

    form.addEventListener("input", (e) => {
      if (e.target.name === "postal") {
        const pos = e.target.value.length;
        e.target.value = formatPostal(e.target.value);
        if (pos >= e.target.value.length) e.target.selectionStart = e.target.selectionEnd = e.target.value.length;
      }
      if (["street", "city", "province", "postal"].includes(e.target.name) && verified) setVerified(false);
      refresh();
    });
    form.addEventListener("change", (e) => {
      if (e.target.name) touched.add(e.target.name);
      if (e.target.name === "province" && verified) setVerified(false);
      refresh();
    });
    form.addEventListener("focusout", (e) => {
      const n = e.target.name; if (!n) return;
      touched.add(n);
      if (n === "phone") { const d = phoneDigits(e.target.value); if (d.length === 10) e.target.value = formatPhone(d); }
      if (n === "fullname" || n === "city") e.target.value = e.target.value.trim().replace(/\s+/g, " ");
      refresh();
    });

    function setVerified(v) {
      verified = v;
      hint.className = v ? "ok-msg" : "hint";
      hint.textContent = v
        ? "Adresse trouvée et remplie. Vérifiez le numéro d'appartement au besoin."
        : "Choisissez une suggestion pour remplir la ville, la province et le code postal automatiquement.";
    }

    /* ----- Suggestions d'adresse (Photon, base OpenStreetMap, sans cle) ----- */
    const cache = new Map();
    let timer, reqId = 0, results = [], focusIdx = -1;

    async function lookup(q) {
      if (cache.has(q)) return cache.get(q);
      const url = "https://photon.komoot.io/api/?" + new URLSearchParams({
        q, limit: "8", lang: "fr", lat: "45.67", lon: "-73.87", bbox: "-141.1,41.6,-52.5,83.2"
      }) + "&layer=house&layer=street";
      const r = await fetch(url);
      if (!r.ok) throw new Error("HTTP " + r.status);
      const j = await r.json();
      const seen = new Set();
      const out = (j.features || []).map((ft) => ft.properties || {})
        .filter((a) => a.countrycode === "CA" && (a.street || a.type === "street"))
        .map((a) => {
          const road = a.street || a.name || "";
          const line1 = [a.housenumber, road].filter(Boolean).join(" ");
          const city = a.city || a.town || a.village || a.locality || a.district || a.county || "";
          const prov = PROV_BY_NAME[deaccent(a.state)] || "";
          const postal = a.postcode && POSTAL_RE.test(formatPostal(a.postcode)) ? formatPostal(a.postcode) : "";
          return { line1, city, prov, postal, hasNumber: !!a.housenumber };
        })
        .filter((a) => {
          const key = [a.line1, a.city, a.postal].join("|").toLowerCase();
          if (!a.line1 || seen.has(key)) return false;
          seen.add(key); return true;
        })
        .slice(0, 6);
      cache.set(q, out);
      return out;
    }

    function closeBox() { box.hidden = true; box.innerHTML = ""; street.setAttribute("aria-expanded", "false"); focusIdx = -1; }
    function drawBox() {
      if (!results.length) { closeBox(); return; }
      box.innerHTML = results.map((a, i) => `<button type="button" role="option" data-i="${i}" class="${i === focusIdx ? "is-focus" : ""}">
          ${esc(a.line1)}<span class="sub">${esc([a.city, a.prov, a.postal].filter(Boolean).join(", "))}${a.hasNumber ? "" : " · ajoutez le numéro civique"}</span></button>`).join("") +
        `<div class="foot">Suggestions : OpenStreetMap. Votre adresse n'y est pas? Remplissez les champs vous-même.</div>`;
      box.hidden = false; street.setAttribute("aria-expanded", "true");
    }
    function pick(a) {
      const typedNum = (f.street.value.match(/^\s*(\d+[A-Za-z]?)\b/) || [])[1];
      f.street.value = a.hasNumber || !typedNum ? a.line1 : `${typedNum} ${a.line1}`;
      if (a.city) f.city.value = a.city;
      if (a.prov) f.province.value = a.prov;
      if (a.postal) f.postal.value = a.postal;
      ["street", "city", "province", "postal"].forEach((k) => { if (f[k].value) touched.add(k); });
      closeBox();
      refresh();
      setVerified(a.hasNumber || /\d/.test(f.street.value));
      if (!a.postal) { f.postal.focus(); hint.textContent = "Adresse trouvée. Ajoutez le code postal, il n'est pas connu pour cette rue."; }
      else if (!a.hasNumber && !/\d/.test(f.street.value)) { street.focus(); }
      else f.unit.focus();
    }

    street.addEventListener("input", () => {
      clearTimeout(timer);
      const q = street.value.trim();
      if (q.length < 5) { closeBox(); return; }
      timer = setTimeout(async () => {
        const my = ++reqId;
        try {
          const r = await lookup(q);
          if (my !== reqId) return;
          results = r; focusIdx = -1; drawBox();
        } catch (err) { if (my === reqId) closeBox(); } // service indisponible : on garde la saisie manuelle
      }, 350);
    });
    street.addEventListener("keydown", (e) => {
      if (box.hidden) return;
      if (e.key === "ArrowDown") { e.preventDefault(); focusIdx = Math.min(focusIdx + 1, results.length - 1); drawBox(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); focusIdx = Math.max(focusIdx - 1, 0); drawBox(); }
      else if (e.key === "Enter" && focusIdx >= 0) { e.preventDefault(); pick(results[focusIdx]); }
      else if (e.key === "Escape") closeBox();
    });
    box.addEventListener("mousedown", (e) => e.preventDefault()); // garde le focus pendant le clic
    box.addEventListener("click", (e) => { const b = e.target.closest("button[data-i]"); if (b) pick(results[+b.dataset.i]); });
    document.addEventListener("click", (e) => { if (!e.target.closest("#addrField")) closeBox(); });

    /* ----- Envoi ----- */
    function orderData() {
      const g = (k) => (f[k].value || "").trim();
      const d = phoneDigits(g("phone"));
      return {
        fullname: g("fullname"), company: g("company"), street: g("street"), unit: g("unit"),
        city: g("city"), province: g("province"), postal: formatPostal(g("postal")),
        phone: d.length === 10 ? formatPhone(d) : g("phone"), email: g("email"), note: g("note"),
        botcheck: f.botcheck.checked
      };
    }
    function recap(o, forSeller) {
      const pk = p.package || {};
      const dims = [pk.length_cm, pk.width_cm, pk.height_cm].every((n) => Number(n) > 0)
        ? `${pk.length_cm} x ${pk.width_cm} x ${pk.height_cm} cm` : "à mesurer";
      const lines = [
        "ARTICLE",
        p.name,
        `Réf. : ${p.id}`,
        `État : ${COND[p.condition]?.label || p.condition}`,
        `Prix affiché : ${money(finalPrice(p))} (taxes incluses)` + (hasPromoPrice(p) ? `, prix régulier ${money(p.price)}` : ""),
        ...(promoActive(p) ? [`Promo : ${p.promo.label || "oui"}${p.promo.details ? " : " + p.promo.details : ""}`] : []),
        `Lien : ${SITE_URL}/${productUrl(p)}`,
        "",
        "EXPÉDIER À",
        o.fullname,
        ...(o.company ? [o.company] : []),
        o.street + (o.unit ? `, ${o.unit}` : ""),
        `${o.city} ${o.province}  ${o.postal}`,
        "CANADA",
        ...(o.phone ? [`Tél. : ${o.phone}`] : []),
        ...(o.email ? [`Courriel : ${o.email}`] : []),
        ...(forSeller ? [`Adresse choisie dans les suggestions : ${verified ? "oui" : "non, saisie manuelle"}`] : [])
      ];
      if (forSeller) {
        lines.push("", "COLIS",
          `Poids total : ${pk.weight_kg ? kg(pk.weight_kg) : "à peser"}`,
          `Dimensions : ${dims}${pk.box ? ` (${pk.box})` : ""}`,
          ...(pk.notes ? [`Notes d'emballage : ${pk.notes}`] : []));
      }
      if (o.note) lines.push("", "NOTE DU CLIENT", o.note);
      return lines.join("\n");
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      ["fullname", "street", "city", "province", "postal", "phone", "email"].forEach((k) => touched.add(k));
      if (Object.keys(refresh()).length) return;
      const o = orderData();
      if (o.botcheck) return;

      sendBtn.disabled = true;
      sendBtn.textContent = "Envoi en cours…";
      statusEl.hidden = true;

      const pk = p.package || {};
      const subject = `[Raymond PC] Commande boutique : ${p.name}`;
      const body = recap(o, true);
      try {
        const res = await fetch(WEB3FORMS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject,
            from_name: `${o.fullname} - Boutique raymondpc.ca`,
            ...(EMAIL_RE.test(o.email) ? { email: o.email } : {}),
            article: p.name,
            reference: p.id,
            prix: `${money(finalPrice(p))} taxes incluses`,
            nom: o.fullname,
            entreprise: o.company || "-",
            telephone: o.phone || "-",
            courriel: o.email || "-",
            adresse: `${o.street}${o.unit ? ", " + o.unit : ""}\n${o.city} ${o.province}  ${o.postal}\nCANADA`,
            colis_poids: pk.weight_kg ? kg(pk.weight_kg) : "à peser",
            colis_dimensions: [pk.length_cm, pk.width_cm, pk.height_cm].every((n) => Number(n) > 0) ? `${pk.length_cm} x ${pk.width_cm} x ${pk.height_cm} cm` : "à mesurer",
            message: body
          })
        });
        const out = await res.json().catch(() => ({}));
        if (!res.ok || out.success === false) throw new Error(out.message || "Envoi refusé");
        showDone(o);
      } catch (err) {
        statusEl.className = "form-status is-error";
        statusEl.textContent = "L'envoi automatique a échoué. Votre application courriel va s'ouvrir avec la commande déjà écrite : il suffit d'appuyer sur Envoyer.";
        statusEl.hidden = false;
        sendBtn.textContent = "Envoyer la commande";
        refresh();
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(recap(o, false))}`;
      }
    });

    function showDone(o) {
      const how = o.phone ? "par courriel, ou par texto si c'est plus rapide," : "par courriel";
      $("#orderRoot").innerHTML = `
        <div class="card glass order-done" style="max-width:760px">
          <p class="eyebrow">Commande reçue</p>
          <h2 style="margin-top:14px">Merci ${esc(o.fullname.split(" ")[0])}, votre commande est envoyée.</h2>
          <p class="muted">Je calcule la livraison vers votre adresse et je vous écris ${how} avec le total, livraison incluse,
          et les coordonnées pour le virement Interac. Le colis part dès la réception du paiement.</p>
          <div class="order-recap">${esc(recap(o, false))}</div>
          <div class="inline-links" style="margin-top:18px">
            <a class="btn btn-primary" href="boutique.html">Retour à la boutique</a>
            <a class="btn btn-secondary" href="sms:${CONTACT_PHONE}">Une question? SMS</a>
          </div>
        </div>`;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    refresh();
  }
})();
