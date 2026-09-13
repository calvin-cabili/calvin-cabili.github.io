(function () {
  "use strict";

  /* ---------------------------------------------------
     Projects
     ---------------------------------------------------
     Add real, finished projects here and they'll appear on the
     site automatically. Leave the array empty (as it is now) and
     the whole Projects section stays hidden — no "Coming soon",
     no empty section, nothing for a visitor to see.

     HOW TO ADD A PROJECT:
     1. Save a screenshot to /assets/ (e.g. assets/project-1.jpg)
     2. Add an object to the array below, filling in the fields
        you have. `image`, `liveUrl`, and `githubUrl` are optional —
        leave them as an empty string ("") to skip that part of
        the card (e.g. no Live Demo button if there's no liveUrl).
     3. Save the file. The section un-hides itself automatically.
     4. Open index.html, find the comment above the nav menu that
        starts with "NAV: Add a 'Projects' link here", and add
        that line to both the desktop and mobile nav lists.

     Example:
     {
       title: "Task & Follow-up Tracker",
       image: "assets/project-1.jpg",
       description: "A small browser tool for tracking recurring
         administrative tasks and follow-ups without a spreadsheet.",
       role: "Designer & Developer",
       technologies: ["HTML", "CSS", "JavaScript"],
       highlights: ["Persistent local storage", "Filter by due date"],
       result: "Demonstrates basic front-end structure and data handling.",
       liveUrl: "https://example.com",
       githubUrl: "https://github.com/yourname/project"
     }
  --------------------------------------------------- */
  var projects = [];

  function renderProjects() {
    var section = document.getElementById("projects");
    var grid = document.getElementById("project-grid");
    if (!section || !grid || !projects.length) {
      return; // section stays hidden — nothing to render
    }

    projects.forEach(function (project) {
      var card = document.createElement("article");
      card.className = "card project-card";

      if (project.image) {
        var imageWrap = document.createElement("div");
        imageWrap.className = "project-image-wrap";
        var img = document.createElement("img");
        img.src = project.image;
        img.alt = project.title || "Project screenshot";
        img.loading = "lazy";
        imageWrap.appendChild(img);
        card.appendChild(imageWrap);
      }

      var body = document.createElement("div");
      body.className = "project-body";

      var title = document.createElement("h3");
      title.className = "project-title";
      title.textContent = project.title || "";
      body.appendChild(title);

      if (project.role) {
        var role = document.createElement("p");
        role.className = "project-role";
        role.textContent = "Role: " + project.role;
        body.appendChild(role);
      }

      if (project.description) {
        var description = document.createElement("p");
        description.className = "project-description";
        description.textContent = project.description;
        body.appendChild(description);
      }

      if (project.technologies && project.technologies.length) {
        var tags = document.createElement("div");
        tags.className = "project-tags";
        project.technologies.forEach(function (tech) {
          var tag = document.createElement("span");
          tag.textContent = tech;
          tags.appendChild(tag);
        });
        body.appendChild(tags);
      }

      if (project.highlights && project.highlights.length) {
        var highlights = document.createElement("ul");
        highlights.className = "project-highlights";
        project.highlights.forEach(function (item) {
          var li = document.createElement("li");
          li.textContent = item;
          highlights.appendChild(li);
        });
        body.appendChild(highlights);
      }

      if (project.result) {
        var result = document.createElement("p");
        result.className = "project-result";
        result.textContent = project.result;
        body.appendChild(result);
      }

      if (project.liveUrl || project.githubUrl) {
        var actions = document.createElement("div");
        actions.className = "project-actions";

        if (project.liveUrl) {
          var liveLink = document.createElement("a");
          liveLink.href = project.liveUrl;
          liveLink.target = "_blank";
          liveLink.rel = "noopener";
          liveLink.className = "btn btn-primary";
          liveLink.textContent = "View Site";
          actions.appendChild(liveLink);
        }

        if (project.githubUrl) {
          var codeLink = document.createElement("a");
          codeLink.href = project.githubUrl;
          codeLink.target = "_blank";
          codeLink.rel = "noopener";
          codeLink.className = "btn btn-secondary";
          codeLink.textContent = "View Code";
          actions.appendChild(codeLink);
        }

        body.appendChild(actions);
      }

      card.appendChild(body);
      grid.appendChild(card);
    });

    section.hidden = false;
  }

  renderProjects();

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
    ".skill-card, .cert-card, .project-card, .help-card, .contact-card"
  );

  // Give sibling cards inside the same grid a small staggered delay
  // (capped at 5 steps) so groups of cards settle in one after another
  // instead of all at once — subtle, not a full animation sequence.
  var siblingCounts = new Map();
  revealTargets.forEach(function (el) {
    el.classList.add("reveal");
    var parent = el.parentElement;
    var index = siblingCounts.get(parent) || 0;
    el.style.transitionDelay = Math.min(index, 5) * 70 + "ms";
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
