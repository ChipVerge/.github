(function () {
  const body = document.body;
  const page = body.dataset.page || '';

  function getPathPrefix() {
    const path = window.location.pathname.toLowerCase();
    return path.includes('/services/') || path.includes('/blogs/') ? '../' : '';
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function resolveLink(path) {
    if (!path) {
      return '#';
    }
    if (/^(https?:|mailto:|tel:|#)/i.test(path)) {
      return path;
    }
    return getPathPrefix() + path.replace(/^\.\//, '');
  }

  function getDataUrl(fileName) {
    return resolveLink('data/' + fileName);
  }

  function createIcon(name, classes) {
    return '<i data-lucide="' + name + '" class="' + classes + '"></i>';
  }

  async function readJson(fileName) {
    const response = await fetch(getDataUrl(fileName));
    if (!response.ok) {
      throw new Error('Failed to load ' + fileName + ': ' + response.status);
    }
    return response.json();
  }

  function initIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function renderMountError(mountId, title, description) {
    const mount = document.getElementById(mountId);
    if (!mount) {
      return;
    }

    mount.innerHTML = '<section class="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">'
      + '<div class="border border-[#00ccff]/15 bg-[#070707] p-8">'
      + '<p class="text-sm font-semibold text-white mb-2">' + escapeHtml(title) + '</p>'
      + '<p class="text-sm text-slate-400 leading-relaxed">' + escapeHtml(description) + '</p>'
      + '</div>'
      + '</section>';
    initIcons();
  }

  function renderServiceCard(service) {
    return '<a href="' + resolveLink('services/' + service.file) + '" class="cv-svc-card">'
      + createIcon(service.icon, 'cv-svc-icon')
      + '<h3 class="cv-svc-title">' + escapeHtml(service.title) + '</h3>'
      + '<p class="cv-svc-body">' + escapeHtml(service.shortDescription) + '</p>'
      + '</a>';
  }

  function renderHomeServices(services) {
    const grid = document.getElementById('services-grid');
    if (!grid) {
      return;
    }

    grid.innerHTML = services.map(renderServiceCard).join('');
    initIcons();
  }

  function renderServicesError() {
    const grid = document.getElementById('services-grid');
    if (!grid) {
      return;
    }

    grid.innerHTML = '<div class="bg-[#0a0a0a] p-6 sm:col-span-2 lg:col-span-4 border border-[#00ccff]/10">'
      + '<p class="text-sm font-medium text-white mb-1">Service data unavailable</p>'
      + '<p class="text-xs text-slate-500">Refresh the page or try again shortly.</p>'
      + '</div>';
  }

  function renderServiceHighlight(highlight) {
    return '<div class="bg-[#0a0a0a] p-6">'
      + createIcon(highlight.icon, 'w-6 h-6 text-[#00ccff] mb-3')
      + '<h3 class="text-sm font-semibold text-white mb-1.5">' + escapeHtml(highlight.title) + '</h3>'
      + '<p class="text-xs text-slate-500 leading-relaxed">' + escapeHtml(highlight.description) + '</p>'
      + '</div>';
  }

  function renderServicePage(services) {
    const mount = document.getElementById('service-page');
    if (!mount) {
      return;
    }

    const slug = body.dataset.serviceSlug;
    const service = services.find(function (item) {
      return item.slug === slug;
    });

    if (!service) {
      renderMountError('service-page', 'Service not found', 'The requested service could not be loaded.');
      return;
    }

    mount.innerHTML = '<section class="cv-page-hero">'
      + '<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">'
      + '<div class="flex items-center gap-2 text-xs text-slate-600 mb-6">'
      + '<a href="' + resolveLink('index.html') + '" class="hover:text-[#00ccff] transition-colors">Home</a>'
      + '<span>&rsaquo;</span><span class="text-slate-500">Services</span><span>&rsaquo;</span>'
      + '<span class="text-[#00ccff]">' + escapeHtml(service.title) + '</span>'
      + '</div>'
      + '<p class="text-[#00ccff] text-[0.65rem] tracking-[0.35em] uppercase mb-3 font-medium">Services</p>'
      + '<div class="flex items-start gap-4">'
      + createIcon(service.icon, 'w-10 h-10 text-[#00ccff] shrink-0 mt-1')
      + '<div>'
      + '<h1 class="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-3">' + escapeHtml(service.title) + '</h1>'
      + '<p class="text-slate-400 max-w-2xl leading-relaxed text-base">' + escapeHtml(service.heroDescription) + '</p>'
      + '</div>'
      + '</div>'
      + '</div>'
      + '</section>'
      + '<main class="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">'
      + '<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#00ccff]/10 mb-16">'
      + service.highlights.map(renderServiceHighlight).join('')
      + '</div>'
      + '<div class="cv-placeholder">'
      + createIcon(service.icon, 'w-14 h-14 text-[#00ccff]/15 mx-auto mb-4')
      + '<p class="text-slate-500 text-sm mb-1">' + escapeHtml(service.placeholderTitle) + '</p>'
      + '<p class="text-slate-600 text-xs mb-6">' + escapeHtml(service.placeholderDescription) + '</p>'
      + '<a href="' + resolveLink('contact.html') + '" class="inline-flex items-center gap-2 text-sm text-[#00ccff] hover:text-[#00ffcc] transition-colors border border-[#00ccff]/30 px-5 py-2 hover:border-[#00ccff]/60">'
      + createIcon('mail', 'w-4 h-4')
      + escapeHtml(service.ctaLabel)
      + '</a>'
      + '</div>'
      + '</main>';
    initIcons();
  }

  function renderPeopleCard(profile) {
    return '<article class="bg-[#0a0a0a] p-6 flex flex-col items-start">'
      + '<div class="w-12 h-12 bg-[#00ccff]/5 border border-[#00ccff]/20 flex items-center justify-center mb-4">'
      + createIcon(profile.icon, 'w-6 h-6 text-[#00ccff]/40')
      + '</div>'
      + '<p class="text-sm font-semibold text-white mb-0.5">' + escapeHtml(profile.title) + '</p>'
      + '<p class="text-[0.65rem] tracking-[0.15em] text-[#00ccff] uppercase mb-2">' + escapeHtml(profile.discipline) + '</p>'
      + '<p class="text-xs text-slate-600">' + escapeHtml(profile.summary) + '</p>'
      + '</article>';
  }

  function renderPeoplePage(data) {
    const mount = document.getElementById('people-page');
    if (!mount) {
      return;
    }

    mount.innerHTML = '<section class="cv-page-hero">'
      + '<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">'
      + '<div class="flex items-center gap-2 text-xs text-slate-600 mb-6">'
      + '<a href="' + resolveLink('index.html') + '" class="hover:text-[#00ccff] transition-colors">Home</a>'
      + '<span>&rsaquo;</span><span class="text-slate-500">Company</span><span>&rsaquo;</span>'
      + '<span class="text-[#00ccff]">' + escapeHtml(data.title) + '</span>'
      + '</div>'
      + '<p class="text-[#00ccff] text-[0.65rem] tracking-[0.35em] uppercase mb-3 font-medium">' + escapeHtml(data.eyebrow) + '</p>'
      + '<div class="flex items-start gap-4">'
      + createIcon('users', 'w-10 h-10 text-[#00ccff] shrink-0 mt-1')
      + '<div>'
      + '<h1 class="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-3">' + escapeHtml(data.title) + '</h1>'
      + '<p class="text-slate-400 max-w-2xl leading-relaxed">' + escapeHtml(data.description) + '</p>'
      + '</div>'
      + '</div>'
      + '</div>'
      + '</section>'
      + '<main class="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">'
      + '<div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-[#00ccff]/10 mb-16">'
      + data.profiles.map(renderPeopleCard).join('')
      + '</div>'
      + '<div class="cv-placeholder">'
      + createIcon('users', 'w-14 h-14 text-[#00ccff]/15 mx-auto mb-4')
      + '<p class="text-slate-500 text-sm mb-1">' + escapeHtml(data.placeholderTitle) + '</p>'
      + '<p class="text-slate-600 text-xs mb-6">' + escapeHtml(data.placeholderDescription) + '</p>'
      + '<a href="' + resolveLink(data.ctaHref) + '" class="inline-flex items-center gap-2 text-sm text-[#00ccff] hover:text-[#00ffcc] transition-colors border border-[#00ccff]/30 px-5 py-2 hover:border-[#00ccff]/60">'
      + createIcon('briefcase', 'w-4 h-4')
      + escapeHtml(data.ctaLabel)
      + '</a>'
      + '</div>'
      + '</main>';
    initIcons();
  }

  function renderBlogFilter(topic, activeTopic) {
    const isActive = topic === activeTopic;
    return '<button type="button" data-blog-topic="' + escapeHtml(topic) + '" class="px-3 py-1 text-xs border '
      + (isActive
        ? 'border-[#00ccff]/30 text-[#00ccff]'
        : 'border-[#00ccff]/10 text-slate-500 hover:border-[#00ccff]/30 hover:text-slate-400 transition-colors')
      + '">' + escapeHtml(topic) + '</button>';
  }

  function renderBlogCard(post) {
    const wrapperTag = post.url ? 'a' : 'article';
    const hrefAttribute = post.url ? ' href="' + resolveLink(post.url) + '"' : '';
    const interactiveClass = post.url ? ' block hover:bg-[#00ccff]/[0.02] transition-colors' : '';
    return '<' + wrapperTag + hrefAttribute + ' class="bg-[#0a0a0a] p-6 flex flex-col' + interactiveClass + '">'
      + '<span class="text-[0.6rem] tracking-[0.2em] text-[#00ccff] uppercase mb-3">' + escapeHtml(post.category) + '</span>'
      + '<h3 class="text-sm font-semibold text-white mb-2 leading-snug">' + escapeHtml(post.title) + '</h3>'
      + '<p class="text-xs text-slate-500 leading-relaxed flex-1">' + escapeHtml(post.excerpt) + '</p>'
      + '<div class="flex items-center gap-3 mt-4 pt-4 border-t border-[#00ccff]/10">'
      + createIcon(post.url ? 'arrow-up-right' : 'clock', 'w-3.5 h-3.5 text-slate-700')
      + '<span class="text-[0.65rem] text-slate-700">' + escapeHtml(post.statusLabel || 'Read article') + '</span>'
      + '</div>'
      + '</' + wrapperTag + '>';
  }

  function renderBlogsPage(data) {
    const mount = document.getElementById('blogs-page');
    if (!mount) {
      return;
    }

    mount.innerHTML = '<section class="cv-page-hero">'
      + '<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">'
      + '<div class="flex items-center gap-2 text-xs text-slate-600 mb-6">'
      + '<a href="' + resolveLink('index.html') + '" class="hover:text-[#00ccff] transition-colors">Home</a>'
      + '<span>&rsaquo;</span><span class="text-[#00ccff]">' + escapeHtml(data.title) + '</span>'
      + '</div>'
      + '<p class="text-[#00ccff] text-[0.65rem] tracking-[0.35em] uppercase mb-3 font-medium">' + escapeHtml(data.eyebrow) + '</p>'
      + '<div class="flex items-start gap-4">'
      + createIcon('newspaper', 'w-10 h-10 text-[#00ccff] shrink-0 mt-1')
      + '<div>'
      + '<h1 class="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-3">' + escapeHtml(data.title) + '</h1>'
      + '<p class="text-slate-400 max-w-2xl leading-relaxed">' + escapeHtml(data.description) + '</p>'
      + '</div>'
      + '</div>'
      + '</div>'
      + '</section>'
      + '<main class="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">'
      + '<div id="blog-filters"></div>'
      + '<div id="blog-list" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#00ccff]/10 mb-16"></div>'
      + '<div class="cv-placeholder">'
      + createIcon('rss', 'w-14 h-14 text-[#00ccff]/15 mx-auto mb-4')
      + '<p class="text-slate-500 text-sm mb-1">' + escapeHtml(data.placeholderTitle) + '</p>'
      + '<p class="text-slate-600 text-xs mb-6">' + escapeHtml(data.placeholderDescription) + '</p>'
      + '<a href="' + resolveLink(data.ctaHref) + '" class="inline-flex items-center gap-2 text-sm text-[#00ccff] hover:text-[#00ffcc] transition-colors border border-[#00ccff]/30 px-5 py-2 hover:border-[#00ccff]/60">'
      + createIcon('mail', 'w-4 h-4')
      + escapeHtml(data.ctaLabel)
      + '</a>'
      + '</div>'
      + '</main>';

    const filtersEl = document.getElementById('blog-filters');
    const listEl = document.getElementById('blog-list');
    let activeTopic = 'All';

    function paint() {
      const topics = ['All'].concat(data.topics || []);
      filtersEl.innerHTML = '<div class="flex flex-wrap gap-2 mb-12">'
        + '<span class="text-[0.65rem] tracking-[0.2em] text-slate-600 uppercase self-center mr-2">Topics:</span>'
        + topics.map(function (topic) {
          return renderBlogFilter(topic, activeTopic);
        }).join('')
        + '</div>';

      const posts = activeTopic === 'All'
        ? data.posts
        : data.posts.filter(function (post) {
            return post.category === activeTopic;
          });

      listEl.innerHTML = posts.map(renderBlogCard).join('');
      initIcons();
    }

    filtersEl.addEventListener('click', function (event) {
      const button = event.target.closest('[data-blog-topic]');
      if (!button) {
        return;
      }
      activeTopic = button.dataset.blogTopic;
      paint();
    });

    paint();
  }

  function renderCheckList(items) {
    return items.map(function (item) {
      return '<li class="flex items-start gap-2">'
        + createIcon('check', 'w-3.5 h-3.5 text-[#00ccff] mt-0.5 shrink-0')
        + escapeHtml(item)
        + '</li>';
    }).join('');
  }

  function renderJobCard(job) {
    return '<article class="job-card p-6" data-job-card="' + escapeHtml(job.slug) + '">'
      + '<button type="button" class="job-card-toggle w-full text-left" data-job-toggle="' + escapeHtml(job.slug) + '">'
      + '<span class="flex items-start justify-between gap-4">'
      + '<span class="flex items-start gap-4">'
      + createIcon(job.icon, 'w-5 h-5 text-[#00ccff] shrink-0 mt-0.5')
      + '<span>'
      + '<span class="block text-base font-semibold text-white">' + escapeHtml(job.title) + '</span>'
      + '<span class="block text-xs text-slate-500 mt-0.5">' + escapeHtml(job.team) + ' · ' + escapeHtml(job.location) + ' · ' + escapeHtml(job.employmentType) + '</span>'
      + '</span>'
      + '</span>'
      + createIcon('chevron-down', 'w-5 h-5 text-slate-600 shrink-0 mt-0.5 job-toggle-icon transition-transform duration-200')
      + '</span>'
      + '</button>'
      + '<div class="job-detail mt-5 pt-5 border-t border-[#00ccff]/10">'
      + '<p class="text-sm text-slate-400 leading-relaxed mb-5">' + escapeHtml(job.summary) + '</p>'
      + '<div class="grid sm:grid-cols-2 gap-6 mb-6">'
      + '<div><p class="text-[0.6rem] tracking-[0.25em] text-slate-600 uppercase mb-2">Responsibilities</p><ul class="space-y-1.5 text-xs text-slate-400">' + renderCheckList(job.responsibilities) + '</ul></div>'
      + '<div><p class="text-[0.6rem] tracking-[0.25em] text-slate-600 uppercase mb-2">Requirements</p><ul class="space-y-1.5 text-xs text-slate-400">' + renderCheckList(job.requirements) + '</ul></div>'
      + '</div>'
      + '<button type="button" data-apply-role="' + escapeHtml(job.slug) + '" class="inline-flex items-center gap-2 text-sm text-[#0a0a0a] font-medium bg-[#00ccff] px-5 py-2 hover:bg-[#00ccff]/90 transition-colors">'
      + createIcon('send', 'w-4 h-4')
      + 'Apply for This Role'
      + '</button>'
      + '</div>'
      + '</article>';
  }

  function buildRoleOptions(jobs) {
    return jobs.map(function (job) {
      return '<option value="' + escapeHtml(job.slug) + '">' + escapeHtml(job.title) + '</option>';
    }).join('')
      + '<option value="open-application">Open Application</option>';
  }

  function bindCareerInteractions() {
    const pageEl = document.getElementById('career-page');
    if (!pageEl) {
      return;
    }

    pageEl.addEventListener('click', function (event) {
      const toggle = event.target.closest('[data-job-toggle]');
      if (toggle) {
        const card = toggle.closest('.job-card');
        const shouldOpen = !card.classList.contains('open');
        document.querySelectorAll('.job-card').forEach(function (item) {
          item.classList.remove('open');
        });
        if (shouldOpen) {
          card.classList.add('open');
        }
        return;
      }

      const apply = event.target.closest('[data-apply-role]');
      if (!apply) {
        return;
      }

      const select = document.getElementById('app-role');
      if (select) {
        select.value = apply.dataset.applyRole;
      }

      const formSection = document.getElementById('apply-form');
      if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    const form = document.getElementById('apply-form-el');
    if (form) {
      form.addEventListener('submit', function (event) {
        if (!document.getElementById('app-consent').checked) {
          event.preventDefault();
          alert('Please confirm the consent checkbox before submitting.');
        }
      });
    }

    if (new URLSearchParams(window.location.search).get('submitted') === '1') {
      const formEl = document.getElementById('apply-form-el');
      const successEl = document.getElementById('apply-success');
      if (formEl && successEl) {
        formEl.classList.add('hidden');
        successEl.classList.remove('hidden');
        document.getElementById('apply-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  function renderCareerPage(data) {
    const mount = document.getElementById('career-page');
    if (!mount) {
      return;
    }

    mount.innerHTML = '<section class="cv-page-hero">'
      + '<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">'
      + '<div class="flex items-center gap-2 text-xs text-slate-600 mb-6">'
      + '<a href="' + resolveLink('index.html') + '" class="hover:text-[#00ccff] transition-colors">Home</a>'
      + '<span>&rsaquo;</span><span class="text-slate-500">Company</span><span>&rsaquo;</span>'
      + '<span class="text-[#00ccff]">' + escapeHtml(data.title) + '</span>'
      + '</div>'
      + '<p class="text-[#00ccff] text-[0.65rem] tracking-[0.35em] uppercase mb-3 font-medium">' + escapeHtml(data.eyebrow) + '</p>'
      + '<div class="flex items-start gap-4">'
      + createIcon('briefcase', 'w-10 h-10 text-[#00ccff] shrink-0 mt-1')
      + '<div>'
      + '<h1 class="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-3">' + escapeHtml(data.title) + '</h1>'
      + '<p class="text-slate-400 max-w-2xl leading-relaxed">' + escapeHtml(data.description) + '</p>'
      + '</div>'
      + '</div>'
      + '<div class="flex items-center gap-6 mt-8">'
      + '<div class="text-center"><p class="text-2xl font-semibold text-[#00ccff]">' + data.jobs.length + '</p><p class="text-[0.65rem] tracking-[0.2em] text-slate-600 uppercase mt-0.5">Open Roles</p></div>'
      + '<div class="w-px h-10 bg-[#00ccff]/15"></div>'
      + '<div class="text-center"><p class="text-2xl font-semibold text-[#00ccff]">' + escapeHtml(data.settings.workModel) + '</p><p class="text-[0.65rem] tracking-[0.2em] text-slate-600 uppercase mt-0.5">Work Model</p></div>'
      + '<div class="w-px h-10 bg-[#00ccff]/15"></div>'
      + '<div class="text-center"><p class="text-2xl font-semibold text-[#00ccff]">' + escapeHtml(data.settings.contractType) + '</p><p class="text-[0.65rem] tracking-[0.2em] text-slate-600 uppercase mt-0.5">Contract Type</p></div>'
      + '</div>'
      + '</div>'
      + '</section>'
      + '<main class="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">'
      + '<p class="text-[0.65rem] tracking-[0.35em] text-slate-600 uppercase mb-6">Open Positions</p>'
      + '<div class="space-y-3" id="job-list">' + data.jobs.map(renderJobCard).join('') + '</div>'
      + '<div class="mt-16 border border-[#00ccff]/20 bg-[#00ccff]/[0.03] p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">'
      + '<div><p class="text-sm font-semibold text-white mb-1">' + escapeHtml(data.openApplicationTitle) + '</p><p class="text-xs text-slate-500">' + escapeHtml(data.openApplicationDescription) + '</p></div>'
      + '<button type="button" data-apply-role="open-application" class="shrink-0 inline-flex items-center gap-2 text-sm text-[#00ccff] border border-[#00ccff]/40 px-5 py-2.5 hover:bg-[#00ccff]/10 transition-colors">'
      + createIcon('mail', 'w-4 h-4')
      + escapeHtml(data.openApplicationLabel)
      + '</button>'
      + '</div>'
      + '<section id="apply-form" class="mt-20 border-t border-[#00ccff]/15 pt-16">'
      + '<p class="text-[#00ccff] text-[0.65rem] tracking-[0.35em] uppercase mb-3 font-medium">Apply Now</p>'
      + '<h2 class="text-2xl font-semibold text-white mb-2">Submit Your Application</h2>'
      + '<p class="text-slate-400 text-sm mb-10 max-w-xl">Fill in your details below. All applications are reviewed by our engineering leads within ' + escapeHtml(data.settings.reviewWindow) + '.</p>'
      + '<form action="https://formsubmit.co/info@chipverge.com" method="POST" id="apply-form-el" class="max-w-2xl space-y-5" enctype="multipart/form-data" novalidate>'
      + '<input type="hidden" name="_subject" value="Job Application - ChipVerge" />'
      + '<input type="hidden" name="_captcha" value="false" />'
      + '<input type="hidden" name="_template" value="table" />'
      + '<input type="hidden" name="_next" value="https://chipverge.com/career.html?submitted=1" />'
      + '<div>'
      + '<label class="block text-xs text-slate-500 mb-1.5 tracking-wide uppercase">Position <span class="text-[#00ccff]">*</span></label>'
      + '<select id="app-role" name="role" class="cv-input" required>'
      + '<option value="" disabled selected>Select a role...</option>'
      + buildRoleOptions(data.jobs)
      + '</select>'
      + '</div>'
      + '<div class="grid sm:grid-cols-2 gap-5">'
      + '<div><label class="block text-xs text-slate-500 mb-1.5 tracking-wide uppercase">Full Name <span class="text-[#00ccff]">*</span></label><input type="text" name="name" class="cv-input" placeholder="Your full name" required /></div>'
      + '<div><label class="block text-xs text-slate-500 mb-1.5 tracking-wide uppercase">Email <span class="text-[#00ccff]">*</span></label><input type="email" name="email" class="cv-input" placeholder="you@example.com" required /></div>'
      + '</div>'
      + '<div class="grid sm:grid-cols-2 gap-5">'
      + '<div><label class="block text-xs text-slate-500 mb-1.5 tracking-wide uppercase">Phone <span class="text-slate-700">(optional)</span></label><input type="tel" name="phone" class="cv-input" placeholder="+1 555 000 0000" /></div>'
      + '<div><label class="block text-xs text-slate-500 mb-1.5 tracking-wide uppercase">LinkedIn / Portfolio <span class="text-slate-700">(optional)</span></label><input type="url" name="linkedin" class="cv-input" placeholder="https://linkedin.com/in/..." /></div>'
      + '</div>'
      + '<div><label class="block text-xs text-slate-500 mb-1.5 tracking-wide uppercase">Cover Note <span class="text-[#00ccff]">*</span></label><textarea name="cover_note" class="cv-input" placeholder="Tell us about your experience, why ChipVerge, and what you would bring to the team..." required></textarea></div>'
      + '<div><label class="block text-xs text-slate-500 mb-1.5 tracking-wide uppercase">Resume / CV <span class="text-[#00ccff]">*</span></label><input type="file" name="resume" accept=".pdf,.doc,.docx" class="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:border file:border-[#00ccff]/40 file:text-xs file:text-[#00ccff] file:bg-transparent file:cursor-pointer hover:file:border-[#00ccff] hover:file:bg-[#00ccff]/5 transition-colors" required /><p class="text-[0.65rem] text-slate-700 mt-1.5">PDF, DOC or DOCX - max 10 MB</p></div>'
      + '<div class="flex items-start gap-3 pt-1"><input id="app-consent" type="checkbox" class="mt-0.5 w-4 h-4 accent-[#00ccff] shrink-0" required /><label for="app-consent" class="text-xs text-slate-500 leading-relaxed">I confirm my details are accurate and I consent to ChipVerge processing my application data for recruitment purposes. All information is handled under strict confidentiality.</label></div>'
      + '<button type="submit" id="apply-submit-btn" class="inline-flex items-center gap-2 px-7 py-3 bg-[#00ccff] text-[#0a0a0a] text-sm font-semibold tracking-wide hover:bg-[#00ffcc] transition-colors">'
      + createIcon('send', 'w-4 h-4')
      + 'Submit Application'
      + '</button>'
      + '</form>'
      + '<div id="apply-success" class="hidden mt-8 flex items-start gap-4 border border-[#00ccff]/30 bg-[#00ccff]/[0.05] p-6 max-w-2xl">'
      + createIcon('check-circle', 'w-6 h-6 text-[#00ccff] shrink-0 mt-0.5')
      + '<div><p class="text-sm font-semibold text-white mb-1">Application submitted successfully</p><p class="text-xs text-slate-400">Thank you for applying. Our engineering leads will review your application within ' + escapeHtml(data.settings.reviewWindow) + '.</p></div>'
      + '</div>'
      + '</section>'
      + '</main>';

    bindCareerInteractions();
    initIcons();
  }

  async function init() {
    try {
      const needsServices = page === 'service' || !!document.getElementById('services-grid');
      const requests = [];

      if (needsServices) {
        requests.push(readJson('services.json').then(function (data) {
          return { key: 'services', data: data };
        }));
      }
      if (page === 'people') {
        requests.push(readJson('people.json').then(function (data) {
          return { key: 'people', data: data };
        }));
      }
      if (page === 'career') {
        requests.push(readJson('jobs.json').then(function (data) {
          return { key: 'jobs', data: data };
        }));
      }
      if (page === 'blogs') {
        requests.push(readJson('blogs.json').then(function (data) {
          return { key: 'blogs', data: data };
        }));
      }

      const loaded = await Promise.all(requests);
      const content = {};
      loaded.forEach(function (entry) {
        content[entry.key] = entry.data;
      });

      if (needsServices && content.services) {
        renderHomeServices(content.services.services || []);
        if (page === 'service') {
          renderServicePage(content.services.services || []);
        }
      }
      if (page === 'people' && content.people) {
        renderPeoplePage(content.people);
      }
      if (page === 'career' && content.jobs) {
        renderCareerPage(content.jobs);
      }
      if (page === 'blogs' && content.blogs) {
        renderBlogsPage(content.blogs);
      }
    } catch (error) {
      console.error(error);
      if (document.getElementById('services-grid')) {
        renderServicesError();
      }
      if (page === 'service') {
        renderMountError('service-page', 'Service data unavailable', 'Refresh the page or try again shortly.');
      }
      if (page === 'people') {
        renderMountError('people-page', 'People data unavailable', 'Refresh the page or try again shortly.');
      }
      if (page === 'career') {
        renderMountError('career-page', 'Career data unavailable', 'Refresh the page or try again shortly.');
      }
      if (page === 'blogs') {
        renderMountError('blogs-page', 'Blog data unavailable', 'Refresh the page or try again shortly.');
      }
    }
  }

  init();
})();