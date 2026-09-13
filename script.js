(function () {
  "use strict";

  /* ---------------------------------------------------
     Mobile hamburger menu
  --------------------------------------------------- */
  var hamburger = document.getElementById("hamburger");
  var mobileNav = document.getElementById("mobile-nav");

  function closeMobileNav() {
    hamburger.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Open menu");
    mobileNav.classList.remove("is-open");
  }

  function toggleMobileNav() {
    var isOpen = hamburger.classList.toggle("is-open");
    hamburger.setAttribute("aria-expanded", String(isOpen));
    hamburger.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    mobileNav.classList.toggle("is-open", isOpen);
  }

  hamburger.addEventListener("click", toggleMobileNav);

  mobileNav.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", closeMobileNav);
  });

  /* ---------------------------------------------------
     Dark / light mode toggle (persisted)
  --------------------------------------------------- */
  var themeToggle = document.getElementById("theme-toggle");
  var root = document.documentElement;
  var STORAGE_KEY = "portfolio-theme";

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      themeToggle.setAttribute("aria-label", "Switch to light mode");
    } else {
      root.removeAttribute("data-theme");
      themeToggle.setAttribute("aria-label", "Switch to dark mode");
    }
  }

  var storedTheme = null;
  try {
    storedTheme = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    /* localStorage unavailable — fall back to system preference each load */
  }

  if (storedTheme) {
    applyTheme(storedTheme);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    applyTheme("dark");
  }

  themeToggle.addEventListener("click", function () {
    var isDark = root.getAttribute("data-theme") === "dark";
    var next = isDark ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {
      /* ignore if storage is blocked */
    }
  });

  /* ---------------------------------------------------
     Active navigation highlighting on scroll
  --------------------------------------------------- */
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll(".nav-link");

  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      var match = link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", match);
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  /* ---------------------------------------------------
     Reveal sections as they enter the viewport
  --------------------------------------------------- */
  var revealTargets = document.querySelectorAll(
    ".section-head, .about-grid, .experience-card, .education-current, " +
    ".previous-studies, .skill-card, .cert-card, .help-card, .contact-card"
  );

  revealTargets.forEach(function (el) {
    el.classList.add("reveal");
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
    revealTargets.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------------------------------------------------
     Scroll-to-top button
  --------------------------------------------------- */
  var scrollTopBtn = document.getElementById("scroll-top");

  function toggleScrollTop() {
    scrollTopBtn.classList.toggle("is-visible", window.scrollY > 480);
  }

  window.addEventListener("scroll", toggleScrollTop, { passive: true });
  toggleScrollTop();

  scrollTopBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
