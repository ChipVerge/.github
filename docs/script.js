/* ============================================================
   SQUARED STUDIO — JavaScript
   ============================================================ */

// ---------- Navbar scroll effect ----------
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// ---------- Hamburger menu ----------
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
  });

  // Close mobile nav when a link is tapped
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });
}

// ---------- Scroll-reveal animations ----------
const fadeEls = document.querySelectorAll(
  '.service-card, .why-card, .timeline-item, .highlight-item, .about-visual, .contact-item, .person-card, .case-card'
);

fadeEls.forEach(el => el.classList.add('fade-up'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => revealObserver.observe(el));

// ---------- Horizontal sliders ----------
function initHorizontalSlider({ slider, itemSelector, prevButton, nextButton }) {
  const sliderShell = slider ? slider.closest('.slider-shell') : null;
  const interactiveSelector = 'a, button, input, textarea, select, summary, label, [role="button"], [data-slider-ignore-drag]';

  if (!slider || !sliderShell) {
    return;
  }

  let isDragging = false;
  let hasDragged = false;
  let dragPointerId = null;
  let dragStartX = 0;
  let dragStartScrollLeft = 0;

  const isInteractiveTarget = (target) => target instanceof Element && Boolean(target.closest(interactiveSelector));

  const getStep = () => {
    const firstCard = slider.querySelector(itemSelector);

    if (!firstCard) {
      return slider.clientWidth * 0.85;
    }

    const sliderStyles = window.getComputedStyle(slider);
    const gap = parseFloat(sliderStyles.columnGap || sliderStyles.gap || '0');

    return firstCard.getBoundingClientRect().width + gap;
  };

  const updateSliderState = () => {
    const maxScroll = Math.max(0, slider.scrollWidth - slider.clientWidth);
    const scrollLeft = slider.scrollLeft;
    const atStart = scrollLeft <= 4;
    const atEnd = scrollLeft >= maxScroll - 4;

    if (prevButton) {
      prevButton.disabled = atStart;
    }

    if (nextButton) {
      nextButton.disabled = atEnd;
    }

    sliderShell.classList.toggle('is-at-start', atStart);
    sliderShell.classList.toggle('is-at-end', atEnd);
  };

  const endDrag = () => {
    if (!isDragging) {
      return;
    }

    isDragging = false;
    dragPointerId = null;
    slider.classList.remove('is-dragging');
  };

  const scrollSlider = (direction) => {
    slider.scrollBy({
      left: direction * getStep(),
      behavior: 'smooth'
    });
  };

  if (prevButton) {
    prevButton.addEventListener('click', () => scrollSlider(-1));
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => scrollSlider(1));
  }

  slider.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || event.pointerType === 'touch' || isInteractiveTarget(event.target)) {
      return;
    }

    isDragging = true;
    hasDragged = false;
    dragPointerId = event.pointerId;
    dragStartX = event.clientX;
    dragStartScrollLeft = slider.scrollLeft;
    slider.classList.add('is-dragging');
    slider.setPointerCapture(event.pointerId);
  });

  slider.addEventListener('pointermove', (event) => {
    if (!isDragging || event.pointerId !== dragPointerId) {
      return;
    }

    const deltaX = event.clientX - dragStartX;

    if (Math.abs(deltaX) > 6) {
      hasDragged = true;
    }

    slider.scrollLeft = dragStartScrollLeft - deltaX;
    event.preventDefault();
  });

  slider.addEventListener('pointerup', (event) => {
    if (event.pointerId !== dragPointerId) {
      return;
    }

    if (slider.hasPointerCapture(event.pointerId)) {
      slider.releasePointerCapture(event.pointerId);
    }

    endDrag();
  });

  slider.addEventListener('pointercancel', endDrag);
  slider.addEventListener('lostpointercapture', endDrag);

  slider.addEventListener('click', (event) => {
    if (!hasDragged) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    hasDragged = false;
  }, true);

  slider.addEventListener('dragstart', (event) => {
    event.preventDefault();
  });

  slider.addEventListener('wheel', (event) => {
    const mostlyVertical = Math.abs(event.deltaY) > Math.abs(event.deltaX);
    const maxScroll = Math.max(0, slider.scrollWidth - slider.clientWidth);
    const atStart = slider.scrollLeft <= 1;
    const atEnd = slider.scrollLeft >= maxScroll - 1;

    if (!mostlyVertical || maxScroll === 0) {
      return;
    }

    if ((event.deltaY < 0 && atStart) || (event.deltaY > 0 && atEnd)) {
      return;
    }

    event.preventDefault();
    slider.scrollBy({ left: event.deltaY, behavior: 'auto' });
  }, { passive: false });

  slider.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      scrollSlider(1);
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollSlider(-1);
    }
  });

  slider.addEventListener('scroll', updateSliderState, { passive: true });
  window.addEventListener('resize', updateSliderState);

  updateSliderState();
}

initHorizontalSlider({
  slider: document.getElementById('casesSlider'),
  itemSelector: '.case-card',
  prevButton: document.querySelector('[data-case-slider-prev]'),
  nextButton: document.querySelector('[data-case-slider-next]')
});

initHorizontalSlider({
  slider: document.getElementById('peopleSlider'),
  itemSelector: '.person-card',
  prevButton: document.querySelector('[data-people-slider-prev]'),
  nextButton: document.querySelector('[data-people-slider-next]')
});

// ---------- Auto-scroll for cases slider ----------
(function () {
  const slider = document.getElementById('casesSlider');
  if (!slider) return;

  const computeStep = () => {
    const firstCard = slider.querySelector('.case-card');
    if (!firstCard) return slider.clientWidth * 0.85;
    const sliderStyles = window.getComputedStyle(slider);
    const gap = parseFloat(sliderStyles.columnGap || sliderStyles.gap || '0');
    return firstCard.getBoundingClientRect().width + gap;
  };

  let autoTimer = null;
  const intervalMs = 3800;

  const stopAuto = () => {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  };

  const startAuto = () => {
    stopAuto();
    autoTimer = setInterval(() => {
      const maxScroll = Math.max(0, slider.scrollWidth - slider.clientWidth);
      const step = computeStep();
      if (slider.scrollLeft >= maxScroll - 4) {
        slider.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        slider.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, intervalMs);
  };

  // Pause when user interacts
  ['pointerenter', 'focusin', 'pointerdown'].forEach(ev => slider.addEventListener(ev, stopAuto, { passive: true }));
  ['pointerleave', 'focusout'].forEach(ev => slider.addEventListener(ev, startAuto, { passive: true }));

  // Pause when user uses nav buttons
  const prevBtn = document.querySelector('[data-case-slider-prev]');
  const nextBtn = document.querySelector('[data-case-slider-next]');
  [prevBtn, nextBtn].forEach(btn => {
    if (!btn) return;
    btn.addEventListener('pointerdown', stopAuto, { passive: true });
    btn.addEventListener('click', () => setTimeout(startAuto, 2000));
  });

  // Start auto-scroll when ready
  // delay a moment to allow layout/measurements
  setTimeout(startAuto, 600);
  // keep measurements updated on resize
  window.addEventListener('resize', () => {
    // restart to recalc step
    if (autoTimer) {
      stopAuto();
      startAuto();
    }
  });
})();

// ---------- High-speed data transmission canvas ----------
(function () {
  const canvas = document.getElementById('circuitCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  let channels = [], packets = [], nodes = [];
  let frame = 0;

  const CYAN  = [0, 204, 255];
  const GREEN = [0, 255, 204];

  function rand(min, max) { return Math.random() * (max - min) + min; }
  function randInt(min, max) { return Math.floor(rand(min, max + 1)); }

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    buildLayout();
  }

  function buildLayout() {
    channels = []; nodes = []; packets = [];

    const hCount = Math.max(6, Math.floor(H / 52));
    const laneH  = H / (hCount + 1);
    for (let i = 1; i <= hCount; i++) {
      channels.push({ type:'h', y: i * laneH, x1:0, x2:W,
        speed: rand(1.8, 4.5), burstTimer: rand(0, 150),
        burstInterval: rand(70, 200), active: Math.random() > 0.15 });
    }

    const vCount = Math.max(3, Math.floor(W / 150));
    const laneV  = W / (vCount + 1);
    for (let i = 1; i <= vCount; i++) {
      channels.push({ type:'v', x: i * laneV, y1:0, y2:H,
        speed: rand(1, 2.8), burstTimer: rand(0, 200),
        burstInterval: rand(110, 280), active: Math.random() > 0.3 });
    }

    const hCh = channels.filter(c => c.type === 'h');
    const vCh = channels.filter(c => c.type === 'v');
    hCh.forEach(h => vCh.forEach(v => {
      if (Math.random() < 0.6)
        nodes.push({ x: v.x, y: h.y, pulse: 0, decay: rand(0.03, 0.07) });
    }));
  }

  function spawnPacket(ch) {
    if (!ch.active) return;
    const color = Math.random() < 0.58 ? CYAN : GREEN;
    if (ch.type === 'h') {
      const dir = Math.random() < 0.55 ? 1 : -1;
      packets.push({ type:'h', y: ch.y, x: dir > 0 ? -8 : W + 8,
        dir, speed: ch.speed * rand(0.8, 1.3), length: rand(22, 90), color });
    } else {
      const dir = Math.random() < 0.55 ? 1 : -1;
      packets.push({ type:'v', x: ch.x, y: dir > 0 ? -8 : H + 8,
        dir, speed: ch.speed * rand(0.8, 1.3), length: rand(14, 48), color });
    }
  }

  function nudgeNodes(px, py) {
    nodes.forEach(n => {
      if (Math.abs(n.x - px) < 36 && Math.abs(n.y - py) < 36)
        n.pulse = Math.min(1, n.pulse + 0.55);
    });
  }

  function drawPacket(p) {
    const [r, g, b] = p.color;
    ctx.save();
    if (p.type === 'h') {
      const tx = p.x - p.dir * p.length;
      const grd = ctx.createLinearGradient(tx, p.y, p.x, p.y);
      grd.addColorStop(0, `rgba(${r},${g},${b},0)`);
      grd.addColorStop(0.55, `rgba(${r},${g},${b},0.3)`);
      grd.addColorStop(1,  `rgba(${r},${g},${b},0.92)`);
      ctx.strokeStyle = grd; ctx.lineWidth = 1.6;
      ctx.shadowColor = `rgba(${r},${g},${b},0.65)`; ctx.shadowBlur = 9;
      ctx.beginPath(); ctx.moveTo(tx, p.y); ctx.lineTo(p.x, p.y); ctx.stroke();
      ctx.shadowBlur = 14;
      ctx.fillStyle = `rgba(${r},${g},${b},1)`;
      ctx.beginPath(); ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2); ctx.fill();
    } else {
      const ty = p.y - p.dir * p.length;
      const grd = ctx.createLinearGradient(p.x, ty, p.x, p.y);
      grd.addColorStop(0, `rgba(${r},${g},${b},0)`);
      grd.addColorStop(0.55, `rgba(${r},${g},${b},0.22)`);
      grd.addColorStop(1,  `rgba(${r},${g},${b},0.78)`);
      ctx.strokeStyle = grd; ctx.lineWidth = 1;
      ctx.shadowColor = `rgba(${r},${g},${b},0.5)`; ctx.shadowBlur = 7;
      ctx.beginPath(); ctx.moveTo(p.x, ty); ctx.lineTo(p.x, p.y); ctx.stroke();
      ctx.shadowBlur = 10;
      ctx.fillStyle = `rgba(${r},${g},${b},0.9)`;
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.7, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    frame++;

    // background traces
    channels.forEach(ch => {
      ctx.lineWidth = 0.8;
      if (ch.type === 'h') {
        ctx.strokeStyle = 'rgba(0,204,255,0.055)';
        ctx.beginPath(); ctx.moveTo(ch.x1, ch.y); ctx.lineTo(ch.x2, ch.y); ctx.stroke();
      } else {
        ctx.strokeStyle = 'rgba(0,204,255,0.035)';
        ctx.beginPath(); ctx.moveTo(ch.x, ch.y1); ctx.lineTo(ch.x, ch.y2); ctx.stroke();
      }
    });

    // burst spawning
    channels.forEach(ch => {
      if (!ch.active) return;
      ch.burstTimer++;
      if (ch.burstTimer >= ch.burstInterval) {
        ch.burstTimer = 0;
        ch.burstInterval = rand(55, 210);
        const count = randInt(1, 4);
        for (let i = 0; i < count; i++)
          setTimeout(() => spawnPacket(ch), i * rand(50, 170));
      }
    });

    // update / draw packets
    packets = packets.filter(p => {
      if (p.type === 'h') {
        p.x += p.dir * p.speed;
        nudgeNodes(p.x, p.y);
        drawPacket(p);
        return p.dir > 0 ? p.x < W + 110 : p.x > -110;
      } else {
        p.y += p.dir * p.speed;
        nudgeNodes(p.x, p.y);
        drawPacket(p);
        return p.dir > 0 ? p.y < H + 70 : p.y > -70;
      }
    });

    // intersection nodes
    nodes.forEach(n => {
      if (n.pulse > 0.02) {
        const r = 2 + n.pulse * 5;
        ctx.save();
        ctx.fillStyle = `rgba(0,255,204,${n.pulse * 0.85})`;
        ctx.shadowColor = 'rgba(0,255,204,0.9)'; ctx.shadowBlur = 14 * n.pulse;
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        n.pulse = Math.max(0, n.pulse - n.decay);
      } else {
        ctx.fillStyle = 'rgba(0,204,255,0.1)';
        ctx.beginPath(); ctx.arc(n.x, n.y, 1.4, 0, Math.PI * 2); ctx.fill();
      }
    });

    requestAnimationFrame(draw);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement);
  resize();
  draw();
})();
