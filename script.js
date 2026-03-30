const personalProjects = [
  { slug: "sqli-prevention", title: "Prévention des injections SQL" },
  { slug: "headers-audit", title: "Audit des en-têtes HTTP" },
  { slug: "log-bruteforce", title: "Détection de brute force par analyse de logs" },
  { slug: "mini-soc-lab", title: "Mini-SOC en laboratoire" },
  { slug: "ad-hardening-lab", title: "Durcissement Active Directory" },
  { slug: "openvas-parser", title: "Analyse automatisée de scans OpenVAS" },
  { slug: "tls-audit", title: "Audit TLS / SSL" },
  { slug: "segmentation-checklist", title: "Checklist de segmentation réseau" },
  { slug: "telecom-budget", title: "Calculateur de budget de liaison" },
  { slug: "burp-sqli-notes", title: "Notes de compréhension sur les SQLi" }
];

const universityProjects = [
  { slug: "sae21", title: "Construire un réseau pour une structure" },
  { slug: "sae12", title: "S’initier aux réseaux informatiques" },
  { slug: "sae13", title: "Analyse d’un dispositif de transmission" },
  { slug: "sae14", title: "Se présenter sur Internet" },
  { slug: "sae15", title: "Banc avionique" },
  { slug: "sae25", title: "Portfolio de compétences" },
  { slug: "tp-reseau-compte-rendu", title: "TP Réseau — Compte-rendu" },
  { slug: "tp-transmission-tp1", title: "TP Transmission — TP1" },
  { slug: "tp-transmission-tp2", title: "TP Transmission — TP2" },
  { slug: "tp-transmission-tp3", title: "TP Transmission — TP3" },
  { slug: "projet-dvb", title: "Diffusion TV : DVB-S / DVB-T" },
  { slug: "tp-fluxmedia", title: "Flux média et transmission — GStreamer" },
  { slug: "projet-pentest", title: "Pentest d’une infrastructure pédagogique" }
];

const sectionConfigs = [
  {
    type: "personal",
    pattern: /\/projetpersonnels\/([^/]+)\/index\.html$/,
    projects: personalProjects,
    breadcrumbs: [
      { href: "../../index.html#projets", label: "Accueil" },
      { href: "../index.html", label: "Projets personnels" }
    ],
    quickLinks: [
      { href: "../../index.html#projets", label: "Accueil du portfolio", strong: true },
      { href: "../index.html", label: "Tous les projets personnels" },
      { href: "../../projetscolaire/index.html", label: "Projets universitaires" }
    ],
    footer: {
      leftHref: "../index.html",
      leftLabel: "↩ Retour à la liste des projets personnels",
      rightHref: "../../index.html#projets",
      rightLabel: "🏠 Retour aux sections du portfolio"
    },
    switcherTitle: "Passer facilement d’un projet personnel à un autre",
    homeCard: {
      href: "../../index.html#projets",
      label: "Accueil",
      title: "Revenir à la vue d’ensemble du portfolio"
    },
    startCard: {
      href: "../index.html",
      label: "Liste complète",
      title: "Revenir aux projets personnels"
    },
    endCard: {
      href: "../../index.html#contact",
      label: "Fin de parcours",
      title: "Revenir au contact et aux autres sections"
    }
  },
  {
    type: "university",
    pattern: /\/projetscolaire\/([^/]+)\/index\.html$/,
    projects: universityProjects,
    breadcrumbs: [
      { href: "../../index.html#projets", label: "Accueil" },
      { href: "../index.html", label: "Projets universitaires" }
    ],
    quickLinks: [
      { href: "../../index.html#projets", label: "Accueil du portfolio", strong: true },
      { href: "../index.html", label: "Tous les projets universitaires" },
      { href: "../../monparcours/index.html", label: "Parcours académique" }
    ],
    footer: {
      leftHref: "../index.html",
      leftLabel: "↩ Retour à la liste des projets universitaires",
      rightHref: "../../index.html#projets",
      rightLabel: "🏠 Retour aux sections du portfolio"
    },
    switcherTitle: "Passer rapidement d’un projet universitaire à un autre",
    homeCard: {
      href: "../index.html",
      label: "Liste des projets",
      title: "Revenir à la vue d’ensemble des projets universitaires"
    },
    startCard: {
      href: "../../monparcours/index.html",
      label: "Parcours",
      title: "Revenir au parcours académique"
    },
    endCard: {
      href: "../../index.html#projets",
      label: "Accueil",
      title: "Revenir aux grandes sections du portfolio"
    }
  }
];

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (event) {
      const target = document.querySelector(this.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    });
  });
}

function detectSectionContext() {
  return sectionConfigs.find((config) => config.pattern.test(window.location.pathname));
}

function buildQuickLinks(links) {
  const wrapper = document.createElement("div");
  wrapper.className = "page-quick-links";
  wrapper.innerHTML = links
    .map(
      (link) =>
        `<a href="${link.href}" class="quick-link${link.strong ? " strong" : ""}">${link.label}</a>`
    )
    .join("");
  return wrapper;
}

function injectBreadcrumbs(main, config, currentTitle) {
  const intro = main?.querySelector(".intro");
  if (!intro || intro.querySelector(".page-breadcrumbs")) return;

  const nav = document.createElement("nav");
  nav.className = "page-breadcrumbs";
  nav.setAttribute("aria-label", "Fil d’Ariane");
  nav.innerHTML = `
    <a href="${config.breadcrumbs[0].href}" class="breadcrumb-link">${config.breadcrumbs[0].label}</a>
    <span class="breadcrumb-sep">/</span>
    <a href="${config.breadcrumbs[1].href}" class="breadcrumb-link">${config.breadcrumbs[1].label}</a>
    <span class="breadcrumb-sep">/</span>
    <span class="breadcrumb-current">${currentTitle}</span>
  `;
  intro.prepend(nav);
}

function ensureQuickLinks(main, config) {
  const intro = main?.querySelector(".intro");
  if (!intro || intro.querySelector(".page-quick-links")) return;
  intro.appendChild(buildQuickLinks(config.quickLinks));
}

function rewriteFooter(main, config) {
  const footer = main?.querySelector(".page-footer");
  if (!footer) return;

  const left = footer.querySelector(".footer-left-button");
  const right = footer.querySelector(".footer-right-button");

  if (left) {
    left.href = config.footer.leftHref;
    left.textContent = config.footer.leftLabel;
  }

  if (right) {
    right.href = config.footer.rightHref;
    right.textContent = config.footer.rightLabel;
  }
}

function injectProjectNavigation(main, config, currentSlug, currentTitle) {
  const footer = main?.querySelector(".page-footer");
  if (!footer || main.querySelector(".project-switcher")) return;

  const currentIndex = config.projects.findIndex((project) => project.slug === currentSlug);
  if (currentIndex === -1) return;

  const previousProject = config.projects[currentIndex - 1];
  const nextProject = config.projects[currentIndex + 1];

  const navSection = document.createElement("section");
  navSection.className = "project-card project-switcher";
  navSection.setAttribute("aria-label", "Navigation entre projets");
  navSection.innerHTML = `
    <p class="section-kicker">Navigation</p>
    <h2>${config.switcherTitle}</h2>
    <p class="switcher-current">Page actuelle : <strong>${currentTitle}</strong></p>
    <div class="project-switcher-grid">
      ${
        previousProject
          ? `<a class="switch-card" href="../${previousProject.slug}/index.html">
              <span class="switch-card-label">Projet précédent</span>
              <span class="switch-card-title">${previousProject.title}</span>
            </a>`
          : `<a class="switch-card switch-card-home" href="${config.startCard.href}">
              <span class="switch-card-label">${config.startCard.label}</span>
              <span class="switch-card-title">${config.startCard.title}</span>
            </a>`
      }
      <a class="switch-card switch-card-home" href="${config.homeCard.href}">
        <span class="switch-card-label">${config.homeCard.label}</span>
        <span class="switch-card-title">${config.homeCard.title}</span>
      </a>
      ${
        nextProject
          ? `<a class="switch-card" href="../${nextProject.slug}/index.html">
              <span class="switch-card-label">Projet suivant</span>
              <span class="switch-card-title">${nextProject.title}</span>
            </a>`
          : `<a class="switch-card switch-card-home" href="${config.endCard.href}">
              <span class="switch-card-label">${config.endCard.label}</span>
              <span class="switch-card-title">${config.endCard.title}</span>
            </a>`
      }
    </div>
  `;

  footer.before(navSection);
}

function enhanceSectionRedirects() {
  const config = detectSectionContext();
  if (!config) return;

  const match = window.location.pathname.match(config.pattern);
  const currentSlug = match?.[1];
  if (!currentSlug) return;

  const main = document.querySelector(".projects-school");
  const title = config.projects.find((project) => project.slug === currentSlug)?.title
    || main?.querySelector(".intro h1")?.textContent?.trim()
    || "Projet";

  injectBreadcrumbs(main, config, title);
  ensureQuickLinks(main, config);
  rewriteFooter(main, config);
  injectProjectNavigation(main, config, currentSlug, title);
}

function groupStandaloneProjectImages() {
  const main = document.querySelector(".projects-school");
  const match = window.location.pathname.match(/\/projetpersonnels\/([^/]+)\/index\.html$/);
  if (!main || !match) return;

  const standaloneImages = Array.from(main.children).filter(
    (node) => node.classList?.contains("project-img-container")
  );
  if (!standaloneImages.length || main.querySelector(".standalone-media-row")) return;

  const sections = Array.from(main.children).filter(
    (node) => node.matches?.("section.project-card")
  );
  const supportsSection = sections.find((section) =>
    section.querySelector("h2")?.textContent?.trim().toLowerCase().includes("supports")
  );
  const footer = main.querySelector(".page-footer");

  const wrapper = document.createElement("section");
  wrapper.className = "project-card standalone-media-row";
  wrapper.id = "outils-environnements";
  wrapper.innerHTML = `
    <h2>Repères visuels</h2>
    <div class="project-gallery"></div>
  `;

  const gallery = wrapper.querySelector(".project-gallery");
  standaloneImages.forEach((imageBlock) => gallery.appendChild(imageBlock));

  (supportsSection || footer)?.before(wrapper);
}

document.addEventListener("DOMContentLoaded", () => {
  initSmoothScroll();
  groupStandaloneProjectImages();
  enhanceSectionRedirects();
});
