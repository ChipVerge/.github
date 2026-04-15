/* ============================================================
   SQUARED STUDIO — JavaScript
   ============================================================ */

// ---------- Navbar scroll effect ----------
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ---------- Hamburger menu ----------
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

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

// ---------- Scroll-reveal animations ----------
const fadeEls = document.querySelectorAll(
  '.service-card, .why-card, .timeline-item, .highlight-item, .about-visual, .contact-item, .person-card'
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

// ---------- Contact form ----------
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name  = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const msg   = document.getElementById('message').value.trim();

  if (!name || !email || !msg) {
    showToast('Please fill in all required fields.', false);
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showToast('Please enter a valid email address.', false);
    return;
  }

  // Simulate form submission (replace with real endpoint / EmailJS / Formspree, etc.)
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  setTimeout(() => {
    contactForm.reset();
    btn.textContent = 'Send Message';
    btn.disabled = false;
    showToast('Message sent! We\'ll be in touch within 24 hours.', true);
  }, 1200);
});

function showToast(message, success = true) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.borderColor = success ? 'var(--green)' : '#f87171';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

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
