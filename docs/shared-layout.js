/* ============================================================
   ChipVerge — Shared Layout
   ============================================================ */

(function () {
  const navbarHost = document.querySelector('[data-shared-navbar]');
  const footerHost = document.querySelector('[data-shared-footer]');

  if (!navbarHost && !footerHost) {
    return;
  }

  const currentScript = document.currentScript;
  const scriptSrc = currentScript ? currentScript.getAttribute('src') || '' : '';
  const rootPrefix = scriptSrc
    .replace(/shared-layout\.js(?:\?.*)?$/, '')
    .replace(/^\.\//, '');

  const pagePath = window.location.pathname.replace(/\\/g, '/');
  const pageName = pagePath.split('/').pop() || 'index.html';
  const isHomePage = pageName === 'index.html' || pageName === '';
  const isContactPage = pageName === 'contact.html';
  const isServicesPage = pagePath.includes('/services/');
  const isWorkPage = pagePath.includes('/work/');
  const isPeoplePage = pagePath.includes('/people/');

  const withRoot = (relativePath) => `${rootPrefix}${relativePath}`;
  const homeHref = isHomePage ? '#home' : withRoot('index.html');
  const sectionHref = (sectionId) => isHomePage ? `#${sectionId}` : `${withRoot('index.html')}#${sectionId}`;
  const contactHref = withRoot('contact.html');

  const navItems = [
    { label: 'About', href: sectionHref('about'), current: false },
    { label: 'Services', href: sectionHref('services'), current: isServicesPage },
    { label: 'Work', href: sectionHref('work'), current: isWorkPage },
    { label: 'People', href: sectionHref('people'), current: isPeoplePage },
    { label: 'Contact', href: contactHref, current: isContactPage }
  ];

  const navLinksMarkup = navItems
    .map(({ label, href, current }) => `<a href="${href}"${current ? ' aria-current="page"' : ''}>${label}</a>`)
    .join('');

  const navbarMarkup = `
  <header class="navbar" id="navbar">
    <div class="container nav-inner">
      <a href="${homeHref}" class="logo">
        <img src="${withRoot('logo.png')}" alt="ChipVerge" class="logo-img" />
        <span class="logo-text">ChipVerge</span>
      </a>
      <nav class="nav-links" id="navLinks">
        ${navLinksMarkup}
      </nav>
      <a class="nav-cta" href="${contactHref}">Get in Touch</a>
      <button class="hamburger" id="hamburger" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>`;

  const footerMarkup = `
  <footer class="footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <a href="${homeHref}" class="logo">
          <img src="${withRoot('logo.png')}" alt="ChipVerge" class="logo-img" />
          <span class="logo-text">ChipVerge</span>
        </a>
        <p>Semiconductor Service Provider<br />Full-Spectrum Semiconductor Engineering</p>
      </div>
      <div class="footer-links">
        <div class="footer-col">
          <h5>Company</h5>
          <a href="${sectionHref('about')}">About</a>
          <a href="${sectionHref('work')}">Our Work</a>
          <a href="${contactHref}">Contact</a>
        </div>
        <div class="footer-col">
          <h5>Services</h5>
          <a href="${withRoot('services/asic-design.html')}">ASIC Design</a>
          <a href="${withRoot('services/verification.html')}">Verification</a>
          <a href="${withRoot('services/engineering-consulting.html')}">Consulting</a>
          <a href="${withRoot('services/fpga-design.html')}">FPGA Design</a>
        </div>
        <div class="footer-col">
          <h5>Connect</h5>
          <a href="https://github.com/ChipVerge" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/company/ChipVerge" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="mailto:info@chipverge.com">Email Us</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <span>&copy; 2026 ChipVerge. All rights reserved.</span>
      </div>
    </div>
  </footer>`;

  if (navbarHost) {
    navbarHost.outerHTML = navbarMarkup;
  }

  if (footerHost) {
    footerHost.outerHTML = footerMarkup;
  }
})();