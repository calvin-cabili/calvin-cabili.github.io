(function () {
  "use strict";

  /* Mark JS availability — CSS only hides reveal elements when this
     class exists, so the site stays fully visible without JavaScript. */
  document.documentElement.classList.add("js");

  /* =========================================================
     1. PROJECTS DATA
     ---------------------------------------------------------
     This is the only place you need to edit to add a real
     project. Each entry becomes a polished card automatically,
     with category filtering and (optionally) the featured layout.

     HOW TO ADD A PROJECT:
     1. Save a screenshot to /assets/ (e.g. assets/project-1.jpg)
     2. Add an object below. Every field except `title` is
        optional — leave out what you don't have yet.
     3. Remove the matching placeholder card in index.html
        (search for "PLACEHOLDER").
     4. Save. Filters pick up new categories automatically.

     Fields:
       title        (required) project name
       category     one of: web | javascript | automation |
                    productivity | ecommerce | ai  (drives filters)
       status       short label, e.g. "In Development",
                    "Coming Soon", "Live"
       image        screenshot path in /assets/
       description  1–2 factual sentences
       technologies array of strings (shown as chips)
       liveUrl      deployed site URL  → "Live Demo" button
       githubUrl    repository URL      → "Source Code" button
       caseStudyUrl optional write-up  → "Case Study" button
       featured     true → full-width featured layout

     Example (fill in with YOUR real project — don't publish
     fictional results):
     {
       title: "Task & Follow-up Tracker",
       category: "productivity",
       status: "Live",
       image: "assets/project-1.jpg",
       description: "A browser tool for tracking recurring
         administrative tasks and follow-ups without a spreadsheet.",
       technologies: ["HTML", "CSS", "JavaScript"],
       liveUrl: "https://calvin-cabili.github.io/task-tracker/",
       githubUrl: "https://github.com/calvin-cabili/task-tracker"
     }
  ========================================================= */
  var projects = [
    // Add your real projects here ↓
  ];

  /* Category labels for filter buttons. Add a label here if you
     introduce a new `category` value in a project above. */
  var CATEGORY_LABELS = {
    web: "Web",
    javascript: "JavaScript",
    automation: "Automation",
    productivity: "Productivity",
    ecommerce: "E-commerce",
    ai: "AI"
  };

  /* Show filter buttons only when they're useful: once at least one
     real project exists, or the static grid grows beyond the current
     placeholders. Flip to `true` to always show them. */
  var SHOW_FILTERS_ALWAYS = false;

  /* =========================================================
     2. PROJECT RENDERING
  ========================================================= */
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function buildProjectCard(project) {
    var card = el("article", "card project-card");
    card.dataset.category = project.category || "web";

    var imageWrap = el("div", "project-image-wrap");
    if (project.image) {
      var img = document.createElement("img");
      img.src = project.image;
      img.alt = (project.title || "Project") + " screenshot";
      img.loading = "lazy";
      img.decoding = "async";
      imageWrap.appendChild(img);
    } else {
      imageWrap.setAttribute("aria-hidden", "true");
      imageWrap.innerHTML =
        '<div class="project-placeholder">' +
        '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" ' +
        'stroke="currentColor" stroke-width="1.4">' +
        '<rect x="2.5" y="4" width="19" height="14" rx="2"/>' +
        '<path d="M8.5 21h7M12 18v3M6.5 9l2.5 2-2.5 2M12.5 13h4"/>' +
        '</svg></div>';
    }
    card.appendChild(imageWrap);

    var body = el("div", "project-body");

    if (project.featured) {
      card.classList.add("project-card--featured");
      body.appendChild(el("span", "project-flag", "Featured Project"));
    }
    body.appendChild(el("h3", "project-title", project.title || "Untitled project"));

    if (project.status) {
      var status = el("span", "project-status");
      status.appendChild(el("span", "project-status-dot"));
      status.appendChild(document.createTextNode(project.status));
      body.appendChild(status);
    }

    if (project.description) {
      body.appendChild(el("p", "project-description", project.description));
    }

    if (project.technologies && project.technologies.length) {
      var tags = el("div", "project-tags");
      project.technologies.forEach(function (tech) {
        tags.appendChild(el("span", null, tech));
      });
      body.appendChild(tags);
    }

    if (project.liveUrl || project.githubUrl || project.caseStudyUrl) {
      var actions = el("div", "project-actions");
      if (project.liveUrl) {
        actions.appendChild(buildLink(project.liveUrl, "Live Demo", "btn btn-primary btn-sm"));
      }
      if (project.githubUrl) {
        actions.appendChild(buildLink(project.githubUrl, "Source Code", "btn btn-secondary btn-sm"));
      }
      if (project.caseStudyUrl) {
        actions.appendChild(buildLink(project.caseStudyUrl, "Case Study", "btn btn-ghost btn-sm"));
      }
      body.appendChild(actions);
    }

    card.appendChild(body);
    return card;
  }

  function buildLink(href, label, className) {
    var link = el("a", className, label);
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener";
    return link;
  }

  function renderProjects() {
    var section = document.getElementById("projects");
    var grid = document.getElementById("project-grid");
    if (!section || !grid || !projects.length) return;

    // Real projects render before the static placeholder cards.
    var placeholder = grid.querySelector("[data-static]");
    projects.forEach(function (project) {
      var card = buildProjectCard(project);
      card.classList.add("reveal");
      grid.insertBefore(card, placeholder);
    });

    setupFilters();
  }

  /* =========================================================
     3. PROJECT FILTERS
  ========================================================= */
  function setupFilters() {
    var filterBar = document.getElementById("project-filters");
    var grid = document.getElementById("project-grid");
    if (!filterBar || !grid) return;

    var cards = Array.prototype.slice.call(
      grid.querySelectorAll(".project-card[data-category]")
    );

    // Collect categories actually present, in CATEGORY_LABELS order.
    var present = [];
    cards.forEach(function (card) {
      var c = card.dataset.category;
      if (c && present.indexOf(c) === -1) present.push(c);
    });
    var ordered = Object.keys(CATEGORY_LABELS).filter(function (key) {
      return present.indexOf(key) !== -1;
    });

    // Show filters only once they're actually useful: when real
    // projects exist, or enough categorized cards fill the grid.
    var categorizedStatic = grid.querySelectorAll(
      ".project-card[data-static][data-category]"
    ).length;
    var showFilters =
      SHOW_FILTERS_ALWAYS || projects.length > 0 || categorizedStatic > 4;
    if (!ordered.length || !showFilters) return;

    filterBar.hidden = false;
    filterBar.innerHTML = "";

    var allBtn = el("button", "filter-btn is-active", "All");
    allBtn.type = "button";
    allBtn.dataset.filter = "all";
    filterBar.appendChild(allBtn);

    ordered.forEach(function (key) {
      var btn = el("button", "filter-btn", CATEGORY_LABELS[key]);
      btn.type = "button";
      btn.dataset.filter = key;
      filterBar.appendChild(btn);
    });

    filterBar.addEventListener("click", function (event) {
      var btn = event.target.closest(".filter-btn");
      if (!btn) return;

      filterBar.querySelectorAll(".filter-btn").forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
      });

      var filter = btn.dataset.filter;

      cards.forEach(function (card) {
        var match = filter === "all" || card.dataset.category === filter;
        card.hidden = !match;
      });
    });
  }

  renderProjects();

  /* =========================================================
     4. MOBILE NAVIGATION
  ========================================================= */
  var hamburger = document.getElementById("hamburger");
  var mobileNav = document.getElementById("mobile-nav");

  function closeMobileNav() {
    hamburger.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Open menu");
    mobileNav.classList.remove("is-open");
  }

  hamburger.addEventListener("click", function () {
    var isOpen = hamburger.classList.toggle("is-open");
    hamburger.setAttribute("aria-expanded", String(isOpen));
    hamburger.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    mobileNav.classList.toggle("is-open", isOpen);
  });

  mobileNav.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", closeMobileNav);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && mobileNav.classList.contains("is-open")) {
      closeMobileNav();
      hamburger.focus();
    }
  });

  /* =========================================================
     5. THEME — dark by default, light optional, persisted
  ========================================================= */
  var themeToggle = document.getElementById("theme-toggle");
  var root = document.documentElement;
  var STORAGE_KEY = "portfolio-theme";

  function applyTheme(theme) {
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
      themeToggle.setAttribute("aria-label", "Switch to dark mode");
    } else {
      root.removeAttribute("data-theme");
      themeToggle.setAttribute("aria-label", "Switch to light mode");
    }
  }

  var storedTheme = null;
  try {
    storedTheme = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    /* localStorage unavailable — fall back to system preference */
  }

  if (storedTheme === "light" || storedTheme === "dark") {
    applyTheme(storedTheme);
  } else if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches
  ) {
    applyTheme("light");
  }

  themeToggle.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {
      /* ignore if storage is blocked */
    }
  });

  /* =========================================================
     6. HEADER STATE ON SCROLL
  ========================================================= */
  var header = document.getElementById("site-header");

  function updateHeader() {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  /* =========================================================
     7. ACTIVE NAV LINK WHILE SCROLLING
  ========================================================= */
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll(".nav-link");

  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  /* =========================================================
     8. SCROLL-REVEAL WITH STAGGERED CARD ENTRANCE
  ========================================================= */
  var revealTargets = document.querySelectorAll(
    ".section-head, .about-copy, .about-highlight, .timeline-item, " +
    ".skill-card, .project-card, .help-card, .education-card, " +
    ".cert-card, .contact-cta, .contact-card, .projects-notice, .skill-legend"
  );

  // Cards in the same grid get a small capped delay so they settle
  // one after another instead of all at once.
  var siblingCounts = new Map();
  revealTargets.forEach(function (node) {
    node.classList.add("reveal");
    var parent = node.parentElement;
    var index = siblingCounts.get(parent) || 0;
    node.style.transitionDelay = Math.min(index, 5) * 70 + "ms";
    siblingCounts.set(parent, index + 1);
  });

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealTargets.forEach(function (node) {
      revealObserver.observe(node);
    });
  } else {
    revealTargets.forEach(function (node) {
      node.classList.add("is-visible");
    });
  }

  /* =========================================================
     9. SCROLL TO TOP
  ========================================================= */
  var scrollTopBtn = document.getElementById("scroll-top");

  function toggleScrollTop() {
    scrollTopBtn.classList.toggle("is-visible", window.scrollY > 480);
  }
  window.addEventListener("scroll", toggleScrollTop, { passive: true });
  toggleScrollTop();

  scrollTopBtn.addEventListener("click", function () {
    var reduce = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });

  /* =========================================================
     10. FOOTER YEAR
  ========================================================= */
  var yearNode = document.getElementById("year");
  if (yearNode) yearNode.textContent = String(new Date().getFullYear());
})();
