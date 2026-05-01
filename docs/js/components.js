/**
 * ChipVerge — Shared header & footer component
 * Dynamically injects nav and footer based on the current URL depth.
 * Place <div id="cv-nav"></div> and <div id="cv-footer"></div> in each page.
 */
(function () {
  /* ── Path prefix ─────────────────────────────────────────── */
  // Use pathname-based detection instead of segment counting so that
  // file:// URLs on Windows (which include the full drive path) work correctly.
  const loc = window.location.pathname.toLowerCase();
  const depth = (loc.includes('/services/') || loc.includes('/blogs/')) ? 1 : 0;
  const p = depth === 1 ? '../' : '';

  /* ── Active state detection ──────────────────────────────── */
  const inSvc      = loc.includes('/services/');
  const inAbout    = loc.includes('/about');
  const inPeople   = loc.includes('/people');
  const inCareer   = loc.includes('/career');
  const inBlogs    = loc.includes('/blogs/');
  const inContact  = loc.includes('/contact');

  /* ── Helpers ─────────────────────────────────────────────── */
  function nl(active) {
    return 'px-3.5 py-5 text-sm ' + (active
      ? 'text-[#00ccff] transition-colors'
      : 'text-slate-400 hover:text-[#00ccff] transition-colors');
  }
  function mnl(active) {
    return 'block py-2.5 text-sm ' + (active
      ? 'text-[#00ccff]'
      : 'text-slate-300 hover:text-[#00ccff] transition-colors');
  }
  function svcItem(file, icon, label) {
    const active = loc.includes(file.toLowerCase().replace('.html', ''));
    return '<a href="' + p + 'services/' + file + '" class="cv-dd-link' + (active ? ' bg-[#00ccff]/5 text-[#00ccff]' : '') + '">'
      + '<i data-lucide="' + icon + '" class="w-4 h-4 ' + (active ? '' : 'text-[#00ccff] ') + 'shrink-0"></i> ' + label + '</a>';
  }
  function mobSvcItem(file, label) {
    const active = loc.includes(file.toLowerCase().replace('.html', ''));
    return '<a href="' + p + 'services/' + file + '" class="block py-1.5 text-sm '
      + (active ? 'text-[#00ccff]' : 'text-slate-400 hover:text-[#00ccff] transition-colors') + '">' + label + '</a>';
  }
  const svcBtn = 'flex items-center gap-1 px-3.5 py-5 text-sm ' + (inSvc
    ? 'text-[#00ccff] transition-colors'
    : 'text-slate-400 hover:text-[#00ccff] transition-colors');
  const mobSvcBtn = 'acc-btn w-full flex items-center justify-between py-2.5 text-sm ' + (inSvc
    ? 'text-[#00ccff]'
    : 'text-slate-300 hover:text-[#00ccff] transition-colors');

  /* ── NAV HTML ────────────────────────────────────────────── */
  const nav = `<nav class="sticky top-0 z-50 border-b border-[#00ccff]/15" style="backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);background:rgba(10,10,10,0.88);">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <a href="${p}index.html" class="flex items-center gap-2.5 shrink-0">
        <img src="${p}logo.png" alt="ChipVerge" class="h-8 w-8 object-contain" />
        <span class="text-[1.1rem] tracking-wide leading-none select-none"><span class="text-white" style="font-weight:600">Chip</span><span class="text-white fw-350">Verge</span></span>
      </a>
      <div class="hidden lg:flex items-center">
        <div class="dropdown group relative">
          <button class="${svcBtn}">Services<i data-lucide="chevron-down" class="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180"></i></button>
          <div class="dropdown-panel hidden group-hover:block absolute top-full left-0 w-72 border border-[#00ccff]/20 bg-[#0d0d0d] shadow-2xl z-50">
            <div class="p-2">
              <p class="px-3 pt-2 pb-1.5 text-[9px] tracking-[0.25em] text-slate-600 uppercase">Active Services</p>
              ${svcItem('asic-design.html',           'cpu',            'ASIC Design')}
              ${svcItem('fpga-design.html',            'circuit-board',  'FPGA Design')}
              ${svcItem('verification.html',           'shield-check',   'Verification')}
              ${svcItem('custom-ip-vip.html',          'layers',         'Custom IP &amp; VIP')}
              ${svcItem('embedded-system.html',        'server',         'Embedded &amp; System-Level')}
              ${svcItem('eda-automation.html',         'terminal',       'EDA Automation')}
              ${svcItem('engineering-consulting.html', 'briefcase',      'Engineering Consulting')}
              ${svcItem('training.html',               'graduation-cap', 'Training')}
            </div>
            <div class="border-t border-[#00ccff]/10 p-2">
              <p class="px-3 pt-2 pb-1.5 text-[9px] tracking-[0.25em] text-slate-700 uppercase flex items-center gap-1.5"><i data-lucide="clock" class="w-3 h-3"></i> Phase 2 — Planned</p>
              <span class="cv-dd-disabled"><i data-lucide="scan-search" class="w-4 h-4 shrink-0"></i> DFT</span>
              <span class="cv-dd-disabled"><i data-lucide="pen-tool"    class="w-4 h-4 shrink-0"></i> Custom Layout</span>
              <span class="cv-dd-disabled"><i data-lucide="map"         class="w-4 h-4 shrink-0"></i> Physical Design Support</span>
              <span class="cv-dd-disabled"><i data-lucide="activity"    class="w-4 h-4 shrink-0"></i> AMS Verification</span>
            </div>
          </div>
        </div>
        <a href="${p}about.html"  class="${nl(inAbout)}">About</a>
        <a href="${p}people.html" class="${nl(inPeople)}">People</a>
        <a href="${p}career.html" class="${nl(inCareer)}">Career</a>
        <a href="${p}blogs/index.html"    class="${nl(inBlogs)}">Blogs</a>
        <a href="${p}contact.html"        class="${nl(inContact)}">Contact</a>
      </div>
      <div class="flex items-center gap-3">
        <button id="mob-toggle" class="lg:hidden p-1 text-slate-400 hover:text-[#00ccff] transition-colors">
          <i data-lucide="menu" class="w-6 h-6" id="mob-icon"></i>
        </button>
      </div>
    </div>
  </div>
  <div id="mob-menu" class="hidden lg:hidden border-t border-[#00ccff]/10 bg-[#0a0a0a]">
    <div class="px-4 py-3 space-y-0.5">
      <div>
        <button data-acc="mob-services" class="${mobSvcBtn}">Services <i data-lucide="chevron-down" class="w-4 h-4 acc-icon transition-transform"></i></button>
        <div id="mob-services" class="hidden pl-4 pb-2 space-y-0.5 border-l border-[#00ccff]/15 ml-1 mt-0.5">
          ${mobSvcItem('asic-design.html',           'ASIC Design')}
          ${mobSvcItem('fpga-design.html',            'FPGA Design')}
          ${mobSvcItem('verification.html',           'Verification')}
          ${mobSvcItem('custom-ip-vip.html',          'Custom IP &amp; VIP')}
          ${mobSvcItem('embedded-system.html',        'Embedded &amp; System-Level')}
          ${mobSvcItem('eda-automation.html',         'EDA Automation')}
          ${mobSvcItem('engineering-consulting.html', 'Engineering Consulting')}
          ${mobSvcItem('training.html',               'Training')}
        </div>
      </div>
      <a href="${p}about.html"  class="${mnl(inAbout)}">About</a>
      <a href="${p}people.html" class="${mnl(inPeople)}">People</a>
      <a href="${p}career.html" class="${mnl(inCareer)}">Career</a>
      <a href="${p}blogs/index.html"    class="${mnl(inBlogs)}">Blogs</a>
      <a href="${p}contact.html"        class="${mnl(inContact)}">Contact</a>
    </div>
  </div>
</nav>`;

  /* ── FOOTER HTML ─────────────────────────────────────────── */
  const yr = new Date().getFullYear();
  const footer = `<footer class="border-t border-[#00ccff]/10 bg-[#060606]">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
      <div class="col-span-2 lg:col-span-1">
        <a href="${p}index.html" class="flex items-center gap-2 mb-4">
          <img src="${p}logo.png" alt="ChipVerge" class="h-7 w-7 object-contain" />
          <span class="text-base tracking-wide"><span class="text-white" style="font-weight:600">Chip</span><span class="fw-350 text-white">Verge</span></span>
        </a>
        <p class="text-xs text-slate-600 leading-relaxed">Silicon-grade engineering. RTL to tape-out, delivered with precision.</p>
      </div>
      <div>
        <h4 class="text-[0.65rem] tracking-[0.2em] text-slate-500 uppercase mb-3">Services</h4>
        <ul class="space-y-1.5">
          <li><a href="${p}services/asic-design.html"           class="cv-footer-link">ASIC Design</a></li>
          <li><a href="${p}services/fpga-design.html"            class="cv-footer-link">FPGA Design</a></li>
          <li><a href="${p}services/verification.html"           class="cv-footer-link">Verification</a></li>
          <li><a href="${p}services/custom-ip-vip.html"          class="cv-footer-link">Custom IP &amp; VIP</a></li>
          <li><a href="${p}services/eda-automation.html"         class="cv-footer-link">EDA Automation</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-[0.65rem] tracking-[0.2em] text-slate-500 uppercase mb-3">Company</h4>
        <ul class="space-y-1.5">
          <li><a href="${p}about.html"  class="cv-footer-link">About Us</a></li>
          <li><a href="${p}people.html" class="cv-footer-link">People</a></li>
          <li><a href="${p}career.html" class="cv-footer-link">Career</a></li>
          <li><a href="${p}blogs/index.html"    class="cv-footer-link">Blogs</a></li>
          <li><a href="${p}contact.html"        class="cv-footer-link">Contact</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-[0.65rem] tracking-[0.2em] text-slate-500 uppercase mb-3">Get in Touch</h4>
        <ul class="space-y-2">
          <li class="flex items-center gap-2"><i data-lucide="mail" class="w-3.5 h-3.5 text-[#00ccff] shrink-0"></i><a href="mailto:info@chipverge.com" class="text-sm text-slate-500 hover:text-[#00ccff] transition-colors">info@chipverge.com</a></li>
          <li class="flex items-center gap-2"><i data-lucide="globe" class="w-3.5 h-3.5 text-[#00ccff] shrink-0"></i><span class="text-sm text-slate-500">chipverge.com</span></li>
        </ul>
      </div>
    </div>
    <div class="border-t border-[#00ccff]/10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p class="text-xs text-slate-700">&copy; ${yr} ChipVerge. All rights reserved.</p>
      <div class="flex items-center gap-4">
        <a href="${p}contact.html" class="text-xs text-slate-700 hover:text-[#00ccff] transition-colors">Contact</a>
      </div>
    </div>
  </div>
</footer>`;

  /* ── Favicon ─────────────────────────────────────────────── */
  const existingFavicon = document.querySelector('link[rel~="icon"]');
  if (!existingFavicon) {
    const favicon = document.createElement('link');
    favicon.rel  = 'icon';
    favicon.type = 'image/png';
    favicon.href = p + 'logo.png';
    document.head.appendChild(favicon);
  }

  /* ── Inject ───────────────────────────────────────────────── */
  const navEl = document.getElementById('cv-nav');
  if (navEl) navEl.outerHTML = nav;

  const ftEl = document.getElementById('cv-footer');
  if (ftEl) ftEl.outerHTML = footer;

  /* ── Mobile menu events ──────────────────────────────────── */
  const mobToggle = document.getElementById('mob-toggle');
  if (mobToggle) {
    mobToggle.addEventListener('click', () => {
      document.getElementById('mob-menu').classList.toggle('hidden');
    });
  }
  document.querySelectorAll('.acc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = document.getElementById(btn.dataset.acc);
      const icon  = btn.querySelector('.acc-icon');
      if (panel) {
        panel.classList.toggle('hidden');
        if (icon) icon.style.transform = panel.classList.contains('hidden') ? '' : 'rotate(180deg)';
      }
    });
  });

  /* ── Init Lucide icons ───────────────────────────────────── */
  if (window.lucide) lucide.createIcons();
})();
