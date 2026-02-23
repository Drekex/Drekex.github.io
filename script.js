// Mobile nav toggle
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.getElementById("nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close menu when clicking a link (mobile)
  navLinks.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Language (FR/EN) toggle with minimal i18n
const i18n = {
  fr: {
    "nav.services":"Services",
    "nav.pricing":"Tarifs",
    "nav.proof":"Pourquoi moi",
    "nav.work":"Réalisations",
    "nav.reviews":"Avis",
    "nav.faq":"FAQ",
    "nav.cta":"Obtenir une soumission",

    "hero.eyebrow":"Local • Fiable • Optimisé",
    "hero.title":"Montage de PC sur mesure, upgrades et dépannage — sans stress.",
    "hero.lead":"Gaming ou productivité : je sélectionne les pièces, j’assemble proprement, je teste en charge, et j’optimise le bruit/les températures pour un PC stable à long terme.",
    "hero.b1":"50+ montages complétés",
    "hero.b2":"Avis 5★ vérifiés (Facebook Marketplace)",
    "hero.b3":"BIOS, Windows, drivers, stabilité & températures",
    "hero.cta1":"Demander une soumission",
    "hero.cta2":"Voir les tarifs",
    "hero.micro":"Réponse rapide par SMS / e-mail. Blainville (Rive-Nord) — service possible autour de Laval/Montréal selon le projet.",

    "hero.cardTitle":"Ce que vous obtenez",
    "hero.cardSubtitle":"Un PC prêt à utiliser, propre, performant et fiable.",
    "hero.c1t":"Compatibilité vérifiée",
    "hero.c1d":"Choix des pièces, vérif. clearance, alimentation, airflow.",
    "hero.c2t":"Tests de stabilité",
    "hero.c2d":"Températures, charge CPU/GPU, RAM, stockage.",
    "hero.c3t":"Optimisation du bruit",
    "hero.c3d":"Courbes de ventilateurs + réglages simples pour réduire le bruit.",
    "hero.cardCta":"Décrire mon projet",
    "hero.cardNote":"Montage SFF / rétro / dépannage : prix sur demande.",

    "trust.a":"PC montés",
    "trust.b":"Avis vérifiés",
    "trust.c":"Approche rigoureuse",
    "trust.d":"Bla-bla inutile",

    "services.title":"Services",
    "services.subtitle":"Choisissez un forfait — ou demandez un service sur mesure.",
    "services.s1t":"Montage sur mesure",
    "services.s1d":"Gaming / travail. Assemblage propre, prêt à utiliser.",
    "services.s1b1":"Assemblage complet",
    "services.s1b2":"BIOS & configuration de base",
    "services.s1b3":"Drivers essentiels",

    "services.s2t":"Mise à niveau & maintenance",
    "services.s2d":"Upgrade GPU/CPU/RAM/SSD, nettoyage, amélioration airflow.",
    "services.s2b1":"Compatibilité & meilleurs choix",
    "services.s2b2":"Optimisation ventilateurs / bruit",
    "services.s2b3":"Tests de stabilité après upgrade",

    "services.s3t":"Dépannage",
    "services.s3d":"Écrans bleus, crash, températures, instabilité, démarrage.",
    "services.s3b1":"Diagnostic clair",
    "services.s3b2":"Solutions pragmatiques",
    "services.s3b3":"Conseils pour éviter le retour du problème",

    "services.noteT":"Inclus sur demande :",
    "services.noteD":"undervolt GPU, optimisation légère, PC compact (SFF), mini-PC, rétro-PC.",

    "pricing.title":"Tarifs simples",
    "pricing.subtitle":"Transparents — les prix peuvent varier selon la complexité.",
    "pricing.unit":"CAD",
    "pricing.p1t":"Montage de base",
    "pricing.p1d":"Pour un montage standard, rapide et propre.",
    "pricing.p1b1":"Assemblage complet",
    "pricing.p1b2":"Installation Windows (non activé si nécessaire)",
    "pricing.p1b3":"Mise à jour BIOS",
    "pricing.p1b4":"Tests de stabilité",
    "pricing.p1b5":"Drivers essentiels",
    "pricing.cta":"Je veux ce forfait",

    "pricing.badge":"Le plus populaire",
    "pricing.p2t":"Montage gaming",
    "pricing.p2d":"Optimisation + finition pour un PC plus silencieux et propre.",
    "pricing.p2b1":"Tout du montage de base",
    "pricing.p2b2":"Gestion des câbles",
    "pricing.p2b3":"Optimisation ventilateurs / bruit",
    "pricing.p2b4":"Ajustement GPU de base (sur demande)",
    "pricing.cta2":"Obtenir une soumission",

    "pricing.p3t":"Sur mesure / SFF / dépannage",
    "pricing.p3price":"Prix sur demande",
    "pricing.p3d":"Idéal pour mini-PC, SFF, rétro-PC, ou cas complexe.",
    "pricing.p3b1":"Analyse du besoin",
    "pricing.p3b2":"Plan d’action",
    "pricing.p3b3":"Résolution / upgrade",
    "pricing.cta3":"Décrire mon problème",

    "pricing.footer":"Astuce : envoyez une liste de pièces / un budget / des photos (si dépannage) pour une estimation plus rapide.",

    "proof.title":"Pourquoi me choisir",
    "proof.subtitle":"Le but : un PC stable, silencieux, facile à vivre.",
    "proof.aT":"Approche “QA”",
    "proof.aD":"Tests, vérifications, et configuration claire — pour éviter les mauvaises surprises et les retours.",
    "proof.aB1":"Stabilité & températures validées",
    "proof.aB2":"Réglages simples et propres",
    "proof.aB3":"Explications faciles (pas de jargon)",
    "proof.bT":"Local & transparent",
    "proof.bD":"Vous savez ce qui est fait, pourquoi, et combien ça coûte. Pas de surprise.",
    "proof.bB1":"Tarifs clairs",
    "proof.bB2":"Conseils pièces / compatibilité",
    "proof.bB3":"Optimisation bruit/perf sur demande",

    "work.title":"Réalisations",
    "work.subtitle":"Ajoutez vos photos (builds) dans le dossier assets/.",
    "work.c1":"Build gaming — airflow optimisé",
    "work.c2":"Câbles propres — facile à entretenir",
    "work.c3":"Système stable — testé en charge",
    "work.c4":"Upgrade — meilleur perf / bruit",

    "reviews.title":"Avis clients",
    "reviews.subtitle":"Exemples — vous pouvez mettre des screenshots floutés comme sur Carrd.",
    "reviews.q1":"Super service, PC silencieux et vraiment propre.",
    "reviews.w1":"— Client Marketplace (nom flouté)",
    "reviews.q2":"A réglé mon problème de crash rapidement. Explications claires.",
    "reviews.w2":"— Client (nom flouté)",
    "reviews.q3":"Très bon conseil sur les pièces. Aucun souci après montage.",
    "reviews.w3":"— Client (nom flouté)",
    "reviews.note":"Confidentialité : noms & photos de profil peuvent être floutés.",

    "faq.title":"FAQ",
    "faq.subtitle":"Les questions qui reviennent le plus.",
    "faq.q1":"Est-ce que tu peux recommander des pièces selon mon budget?",
    "faq.a1":"Oui. Budget, résolution/jeux, objectifs (silence, perf, petit boîtier) — je propose un build équilibré et compatible.",
    "faq.q2":"Est-ce que Windows est inclus?",
    "faq.a2":"Installation possible (Windows non activé si nécessaire). Vous pouvez activer plus tard avec une clé.",
    "faq.q3":"Tu fais du SFF / mini-PC?",
    "faq.a3":"Oui, sur demande. Les builds compacts demandent parfois plus de planification (clearances, airflow, câbles).",
    "faq.q4":"Quoi envoyer pour une soumission rapide?",
    "faq.a4":"Soit votre liste de pièces (ou lien panier), soit votre budget + objectifs, et pour dépannage : symptômes + photos.",

    "contact.title":"Contact / Soumission",
    "contact.subtitle":"Décrivez votre projet (budget, objectifs, liste de pièces). Réponse rapide.",
    "contact.direct":"Contact direct",
    "contact.sms":"SMS",
    "contact.email":"E-mail",
    "contact.fb":"Facebook",
    "contact.addr":"Adresse",
    "contact.tipT":"Tip:",
    "contact.tipD":"Copiez/collez votre liste de pièces ou votre budget + objectifs.",
    "contact.formTitle":"Envoyer une demande",
    "contact.name":"Nom",
    "contact.reply":"Téléphone ou e-mail",
    "contact.type":"Type de service",
    "contact.pick":"Choisir…",
    "contact.opt1":"Montage de base",
    "contact.opt2":"Montage gaming",
    "contact.opt3":"Upgrade / maintenance",
    "contact.opt4":"Dépannage",
    "contact.opt5":"SFF / sur mesure",
    "contact.msg":"Détails (budget, pièces, symptômes)",
    "contact.send":"Envoyer",
    "contact.privacy":"En envoyant, vous acceptez d’être contacté pour cette demande. Pas de spam.",

    "footer.area":"Blainville, QC",
    "footer.top":"Retour en haut"
  },

  en: {
    "nav.services":"Services",
    "nav.pricing":"Pricing",
    "nav.proof":"Why me",
    "nav.work":"Work",
    "nav.reviews":"Reviews",
    "nav.faq":"FAQ",
    "nav.cta":"Get a quote",

    "hero.eyebrow":"Local • Reliable • Optimized",
    "hero.title":"Custom PC builds, upgrades & troubleshooting — stress-free.",
    "hero.lead":"Gaming or productivity: I help pick compatible parts, build cleanly, stress-test, and tune noise/temps so your PC stays stable long-term.",
    "hero.b1":"50+ completed builds",
    "hero.b2":"Verified 5★ reviews (Facebook Marketplace)",
    "hero.b3":"BIOS, Windows, drivers, stability & temperatures",
    "hero.cta1":"Request a quote",
    "hero.cta2":"See pricing",
    "hero.micro":"Fast reply by text/email. Based in Blainville (North Shore) — service around Laval/Montréal depending on the project.",

    "hero.cardTitle":"What you get",
    "hero.cardSubtitle":"A clean, high-performing, reliable PC ready to use.",
    "hero.c1t":"Compatibility checked",
    "hero.c1d":"Part selection, clearance, PSU sizing, airflow planning.",
    "hero.c2t":"Stability testing",
    "hero.c2d":"Temps, CPU/GPU load, RAM, storage checks.",
    "hero.c3t":"Noise tuning",
    "hero.c3d":"Fan curves + simple tweaks to cut noise.",
    "hero.cardCta":"Describe my project",
    "hero.cardNote":"SFF / retro / troubleshooting: quote on request.",

    "trust.a":"PC builds",
    "trust.b":"Verified reviews",
    "trust.c":"QA mindset",
    "trust.d":"No fluff",

    "services.title":"Services",
    "services.subtitle":"Pick a package — or request a custom service.",
    "services.s1t":"Custom PC builds",
    "services.s1d":"Gaming / work PCs. Clean build, ready to use.",
    "services.s1b1":"Full assembly",
    "services.s1b2":"BIOS & base setup",
    "services.s1b3":"Essential drivers",

    "services.s2t":"Upgrades & maintenance",
    "services.s2d":"GPU/CPU/RAM/SSD upgrades, cleaning, airflow improvements.",
    "services.s2b1":"Best-value compatibility advice",
    "services.s2b2":"Fan / noise optimization",
    "services.s2b3":"Post-upgrade stability testing",

    "services.s3t":"Troubleshooting",
    "services.s3d":"Blue screens, crashes, high temps, boot issues, instability.",
    "services.s3b1":"Clear diagnosis",
    "services.s3b2":"Practical solutions",
    "services.s3b3":"Tips to prevent it coming back",

    "services.noteT":"Available on request:",
    "services.noteD":"GPU undervolt, light tuning, compact PCs (SFF), mini PCs, retro PCs.",

    "pricing.title":"Simple pricing",
    "pricing.subtitle":"Transparent — price may vary with complexity.",
    "pricing.unit":"CAD",
    "pricing.p1t":"Basic build",
    "pricing.p1d":"For a standard, clean build done right.",
    "pricing.p1b1":"Full assembly",
    "pricing.p1b2":"Windows install (unactivated if needed)",
    "pricing.p1b3":"BIOS update",
    "pricing.p1b4":"Stability tests",
    "pricing.p1b5":"Essential drivers",
    "pricing.cta":"I want this package",

    "pricing.badge":"Most popular",
    "pricing.p2t":"Gaming build",
    "pricing.p2d":"Extra polish + tuning for a quieter, cleaner build.",
    "pricing.p2b1":"Everything in Basic build",
    "pricing.p2b2":"Cable management",
    "pricing.p2b3":"Fan/noise optimization",
    "pricing.p2b4":"Basic GPU tuning (on request)",
    "pricing.cta2":"Get a quote",

    "pricing.p3t":"Custom / SFF / troubleshooting",
    "pricing.p3price":"Quote on request",
    "pricing.p3d":"Best for mini-PCs, SFF, retro PCs, or complex cases.",
    "pricing.p3b1":"Needs analysis",
    "pricing.p3b2":"Action plan",
    "pricing.p3b3":"Fix / upgrade",
    "pricing.cta3":"Describe my issue",

    "pricing.footer":"Tip: send your parts list / budget / photos (for troubleshooting) for a faster estimate.",

    "proof.title":"Why choose me",
    "proof.subtitle":"Goal: stable, quiet, easy-to-live-with PCs.",
    "proof.aT":"QA-style approach",
    "proof.aD":"Checks, tests, and clean configuration to avoid surprises and rework.",
    "proof.aB1":"Stability & temps validated",
    "proof.aB2":"Clean, simple settings",
    "proof.aB3":"Easy explanations (no jargon)",
    "proof.bT":"Local & transparent",
    "proof.bD":"You know what’s being done, why, and what it costs.",
    "proof.bB1":"Clear pricing",
    "proof.bB2":"Part/compatibility guidance",
    "proof.bB3":"Noise/performance tuning on request",

    "work.title":"Work",
    "work.subtitle":"Add your build photos in the assets/ folder.",
    "work.c1":"Gaming build — airflow optimized",
    "work.c2":"Clean cables — easier maintenance",
    "work.c3":"Stable system — stress tested",
    "work.c4":"Upgrade — better perf / noise",

    "reviews.title":"Customer reviews",
    "reviews.subtitle":"Examples — you can add blurred screenshots like on Carrd.",
    "reviews.q1":"Awesome service — quiet PC and very clean build.",
    "reviews.w1":"— Marketplace client (blurred)",
    "reviews.q2":"Fixed my crashes fast. Clear explanations.",
    "reviews.w2":"— Client (blurred)",
    "reviews.q3":"Great parts advice. No issues after the build.",
    "reviews.w3":"— Client (blurred)",
    "reviews.note":"Privacy: names/profile photos can be blurred.",

    "faq.title":"FAQ",
    "faq.subtitle":"Most common questions.",
    "faq.q1":"Can you recommend parts based on my budget?",
    "faq.a1":"Yes. Budget, games/resolution, goals (quiet, performance, small case) — I’ll propose a balanced compatible build.",
    "faq.q2":"Is Windows included?",
    "faq.a2":"Installation is possible (unactivated if needed). You can activate later with a key.",
    "faq.q3":"Do you do SFF / mini PCs?",
    "faq.a3":"Yes, on request. Compact builds require extra planning (clearance, airflow, cabling).",
    "faq.q4":"What should I send for a fast quote?",
    "faq.a4":"Either your parts list (or cart link), or your budget + goals; for troubleshooting: symptoms + photos.",

    "contact.title":"Contact / Quote",
    "contact.subtitle":"Describe your project (budget, goals, parts list). Fast reply.",
    "contact.direct":"Direct contact",
    "contact.sms":"Text",
    "contact.email":"Email",
    "contact.fb":"Facebook",
    "contact.addr":"Address",
    "contact.tipT":"Tip:",
    "contact.tipD":"Paste your parts list or budget + goals.",
    "contact.formTitle":"Send a request",
    "contact.name":"Name",
    "contact.reply":"Phone or email",
    "contact.type":"Service type",
    "contact.pick":"Choose…",
    "contact.opt1":"Basic build",
    "contact.opt2":"Gaming build",
    "contact.opt3":"Upgrades / maintenance",
    "contact.opt4":"Troubleshooting",
    "contact.opt5":"SFF / custom",
    "contact.msg":"Details (budget, parts, symptoms)",
    "contact.send":"Send",
    "contact.privacy":"By sending, you agree to be contacted about this request. No spam.",

    "footer.area":"Blainville, QC",
    "footer.top":"Back to top"
  }
};

let currentLang = "fr";
const langToggle = document.getElementById("langToggle");

function applyLang(lang){
  currentLang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (i18n[lang] && i18n[lang][key]) el.textContent = i18n[lang][key];
  });
}

if (langToggle) {
  langToggle.addEventListener("click", () => {
    applyLang(currentLang === "fr" ? "en" : "fr");
  });
}

// Default FR
applyLang("fr");

// Lead form: mailto fallback (easy hosting)
const leadForm = document.getElementById("leadForm");
if (leadForm) {
  leadForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(leadForm);
    const name = (data.get("name") || "").toString().trim();
    const reply = (data.get("reply") || "").toString().trim();
    const service = (data.get("service") || "").toString().trim();
    const message = (data.get("message") || "").toString().trim();

    const subject = encodeURIComponent(`[Raymond PC] Demande — ${service || "Service"}`);
    const body = encodeURIComponent(
`Nom: ${name}
Contact: ${reply}
Service: ${service}

Détails:
${message}
`
    );

    // Change this email if needed
    window.location.href = `mailto:raymondpcbuild@gmail.com?subject=${subject}&body=${body}`;
    leadForm.reset();
  });
}