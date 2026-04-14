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
  '.service-card, .why-card, .timeline-item, .highlight-item, .about-visual, .contact-item'
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

// ---------- Circuit board canvas background ----------
(function () {
  const canvas = document.getElementById('circuitCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let nodes = [];
  let animFrame;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    buildNodes();
  }

  function buildNodes() {
    nodes = [];
    const cols = Math.ceil(canvas.width  / 80) + 1;
    const rows = Math.ceil(canvas.height / 80) + 1;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (Math.random() < 0.4) {
          nodes.push({
            x: c * 80 + (Math.random() - 0.5) * 30,
            y: r * 80 + (Math.random() - 0.5) * 30,
            pulse: Math.random(),
            speed: 0.003 + Math.random() * 0.004,
          });
        }
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Lines between nearby nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx   = nodes[j].x - nodes[i].x;
        const dy   = nodes[j].y - nodes[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.35;
          ctx.strokeStyle = `rgba(0,204,255,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);

          // Orthogonal trace style
          const midX = nodes[i].x + (Math.random() > 0.5 ? dx : 0);
          const midY = nodes[j].y - (Math.random() > 0.5 ? 0 : dy);
          ctx.lineTo(midX, midY);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Node dots
    nodes.forEach(n => {
      n.pulse += n.speed;
      const a = 0.3 + 0.5 * Math.abs(Math.sin(n.pulse));
      ctx.beginPath();
      ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,204,255,${a})`;
      ctx.fill();
    });

    animFrame = requestAnimationFrame(draw);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement);

  resize();
  draw();
})();
