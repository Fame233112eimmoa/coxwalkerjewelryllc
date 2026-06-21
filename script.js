const pages = [
  { title: "Home", href: "index.html" },
  { title: "About Us", href: "about.html" },
  { title: "Our Story", href: "our-story.html" },
  { title: "Leadership Team", href: "leadership-team.html" },
  { title: "Our Stores", href: "our-stores.html" },
  { title: "Our Mines", href: "our-mines.html" },
  { title: "Mining Operations", href: "mining-operations.html" },
  { title: "Exploration Projects", href: "exploration-projects.html" },
  { title: "Equipment & Machinery", href: "equipment-machinery.html" },
  { title: "Processing Plant", href: "processing-plant.html" },
  { title: "Refinery", href: "refinery.html" },
  { title: "Diamond/Gemstone Cutting", href: "diamond-gemstone-cutting.html" },
  { title: "Jewelry Manufacturing", href: "jewelry-manufacturing.html" },
  { title: "Products", href: "products.html" },
  { title: "Jewelry Collections", href: "jewelry-collections.html" },
  { title: "Gemstones", href: "gemstones.html" },
  { title: "Diamond Catalog", href: "diamond-catalog.html" },
  { title: "Auctions", href: "auctions.html" },
  { title: "Sustainability ESG", href: "sustainability-esg.html" },
  { title: "Traceability", href: "traceability.html" },
  { title: "Certifications", href: "certifications.html" },
  { title: "Investors", href: "investors.html" },
  { title: "News & Media", href: "news-media.html" },
  { title: "Careers", href: "careers.html" },
  { title: "Contact", href: "contact.html" },
];

const quickLinks = [
  { title: "About Us", href: "about.html" },
  { title: "Our Stores", href: "our-stores.html" },
  { title: "Our Mines", href: "our-mines.html" },
  { title: "Products", href: "products.html" },
  { title: "FAQ", href: "faq.html" },
  { title: "Investors", href: "investors.html" },
  { title: "Careers", href: "careers.html" },
  { title: "Contact", href: "contact.html" },
];

const legalLinks = [
  { title: "Privacy Policy", href: "privacy-policy.html" },
  { title: "Terms & Conditions", href: "terms-conditions.html" },
  { title: "Cookie Policy", href: "cookie-policy.html" },
  { title: "FAQ", href: "faq.html" },
];

const resolveCurrentPage = () => {
  const path = window.location.pathname.split("/").pop();
  return path || "index.html";
};

const currentPage = document.body.dataset.page || resolveCurrentPage();

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const navMarkup = pages
  .map(
    (page) =>
      `<a class="menu-link" data-nav-link href="${page.href}">${escapeHtml(page.title)}</a>`
  )
  .join("");

const quickLinksMarkup = quickLinks
  .map((page) => `<a href="${page.href}">${escapeHtml(page.title)}</a>`)
  .join("");

const legalLinksMarkup = legalLinks
  .map((page) => `<a href="${page.href}">${escapeHtml(page.title)}</a>`)
  .join("");

const headerHost = document.querySelector('[data-site-shell="header"]');
const menuHost = document.querySelector('[data-site-shell="menu"]');
const footerHost = document.querySelector('[data-site-shell="footer"]');

if (headerHost) {
  headerHost.innerHTML = `
    <header class="site-header">
      <div class="container site-header__inner">
        <a class="brand" href="index.html" aria-label="Go to the homepage">
          <img
            class="brand__mark"
            src="assets/logo-mark.png"
            alt="Cox Walker Jewelry LLC diamond mark"
          />
          <span class="brand__text">
            <span class="brand__name">Cox Walker</span>
            <span class="brand__sub">Jewelry LLC</span>
          </span>
        </a>

        <button
          class="menu-toggle"
          type="button"
          aria-expanded="false"
          aria-controls="site-menu"
          aria-haspopup="dialog"
        >
          <span class="menu-toggle__label">Menu</span>
          <span class="menu-toggle__icon" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>
    </header>
  `;
}

if (menuHost) {
  menuHost.innerHTML = `
    <aside class="menu-panel" id="site-menu" hidden>
      <div class="menu-panel__backdrop" data-menu-close></div>
      <div class="menu-panel__dialog" role="dialog" aria-modal="true" aria-label="Site navigation" tabindex="-1">
        <div class="menu-panel__header">
          <img
            class="menu-panel__logo"
            src="assets/logo-full.png"
            alt="Cox Walker Jewelry LLC logo"
          />
          <button class="menu-close" type="button" data-menu-close aria-label="Close menu">
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <nav class="menu-grid" aria-label="Primary">
          ${navMarkup}
        </nav>
      </div>
    </aside>
  `;
}

if (footerHost) {
  footerHost.innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <img
              class="footer-logo"
              src="assets/logo-full.png"
              alt="Cox Walker Jewelry LLC logo"
            />
            <p class="footer-copy">
              Cox Walker Jewelry LLC is a premium gemstone mining and jewelry
              company shaped around responsible sourcing, refined production, and
              elegant presentation.
            </p>
          </div>

          <div>
            <p class="footer-title">Quick Links</p>
            <nav class="footer-links" aria-label="Footer quick links">
              ${quickLinksMarkup}
            </nav>
          </div>

          <div>
            <p class="footer-title">Contact</p>
            <div class="footer-links">
              <a href="mailto:info@coxwalkerjewelryllc.com">info@coxwalkerjewelryllc.com</a>
              <a href="tel:+14165550184">+1 (416) 555-0184</a>
              <span>Toronto Flagship &amp; North America Enquiries</span>
            </div>
          </div>

          <div>
            <p class="footer-title">Follow</p>
            <div class="social-links">
              <a href="contact.html">Instagram</a>
              <a href="contact.html">LinkedIn</a>
              <a href="contact.html">Facebook</a>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <span>&copy; <span data-year></span> Cox Walker Jewelry LLC.</span>
          <nav class="legal-links" aria-label="Legal">
            ${legalLinksMarkup}
          </nav>
        </div>
      </div>
    </footer>
  `;
}

if (!document.querySelector(".back-to-top")) {
  document.body.insertAdjacentHTML(
    "afterbegin",
    `
      <button class="back-to-top" type="button" aria-label="Back to top">
        <span aria-hidden="true">↑</span>
      </button>
    `
  );
}

const body = document.body;
const menuPanel = document.getElementById("site-menu");
const menuToggle = document.querySelector(".menu-toggle");
const menuDialog = menuPanel?.querySelector(".menu-panel__dialog");
const menuCloseTriggers = document.querySelectorAll("[data-menu-close]");
const navLinks = document.querySelectorAll("[data-nav-link]");
const backToTopButton = document.querySelector(".back-to-top");
let lastFocusedElement = null;

const normalizeHref = (href) => href.replace("./", "") || "index.html";

const setActiveLink = () => {
  navLinks.forEach((link) => {
    const isActive = normalizeHref(link.getAttribute("href")) === currentPage;
    link.classList.toggle("active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
      return;
    }

    link.removeAttribute("aria-current");
  });
};

const openMenu = () => {
  if (!menuPanel || !menuToggle) {
    return;
  }

  lastFocusedElement = document.activeElement;
  menuPanel.hidden = false;
  body.classList.add("menu-open");
  menuToggle.setAttribute("aria-expanded", "true");
  menuDialog?.focus();
};

const closeMenu = () => {
  if (!menuPanel || !menuToggle) {
    return;
  }

  menuPanel.hidden = true;
  body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  if (lastFocusedElement instanceof HTMLElement) {
    lastFocusedElement.focus();
  } else {
    menuToggle.focus();
  }
};

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    if (expanded) {
      closeMenu();
      return;
    }

    openMenu();
  });
}

menuCloseTriggers.forEach((trigger) => {
  trigger.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuPanel && !menuPanel.hidden) {
    closeMenu();
  }
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

const imageFallbacks = document.querySelectorAll("img[data-fallback]");
imageFallbacks.forEach((image) => {
  image.addEventListener("error", () => {
    const fallback = image.dataset.fallback;
    if (fallback && image.getAttribute("src") !== fallback) {
      image.setAttribute("src", fallback);
    }
  });
});

if (backToTopButton) {
  const toggleBackToTop = () => {
    backToTopButton.classList.toggle("is-visible", window.scrollY > 600);
  };

  window.addEventListener("scroll", toggleBackToTop, { passive: true });
  toggleBackToTop();

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const yearNode = document.querySelector("[data-year]");
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const contactForms = document.querySelectorAll(".contact-form");
contactForms.forEach((form) => {
  const note = form.querySelector("[data-form-note]");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (note) {
      note.hidden = false;
      note.textContent =
        "Thank you. This demo form is ready to connect to your email or backend workflow.";
    }
    form.reset();
  });
});

setActiveLink();
