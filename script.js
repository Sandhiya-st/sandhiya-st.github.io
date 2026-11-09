// Mark that JavaScript is running so reveal animations only apply when they can work
document.documentElement.classList.add('js');

// ===== Mobile menu =====
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
}));

// ===== Scroll reveal =====
const revealObs = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ===== Active navigation highlighting =====
const links = [...menu.querySelectorAll('a')];
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));

// ===== Back-to-top button =====
const topBtn = document.getElementById('top');
window.addEventListener('scroll', () => topBtn.classList.toggle('show', window.scrollY > 500), { passive: true });
topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== Contact form: validation, then open the visitor's email app =====
const form = document.getElementById('form');
const status = document.getElementById('status');
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function check(field) {
  let msg = '';
  const v = field.value.trim();
  if (!v) msg = 'Please fill in this field.';
  else if (field.type === 'email' && !EMAIL_RE.test(v)) msg = 'Enter a valid email address.';
  else if (field.name === 'message' && v.length < 10) msg = 'Write at least 10 characters.';
  field.setAttribute('aria-invalid', msg ? 'true' : 'false');
  form.querySelector(`.err[data-for="${field.name}"]`).textContent = msg;
  return !msg;
}
form.querySelectorAll('input,textarea').forEach(f => f.addEventListener('blur', () => check(f)));
form.addEventListener('submit', e => {
  e.preventDefault();
  const fields = [...form.querySelectorAll('input,textarea')];
  if (!fields.map(check).every(Boolean)) return;
  const d = Object.fromEntries(fields.map(f => [f.name, f.value.trim()]));
  const body = `${d.message}\n\nFrom: ${d.name} (${d.email})`;
  // To use a real form service instead, replace this line with a fetch() to its endpoint.
  window.location.href = `mailto:sandhiyas12062004@gmail.com?subject=${encodeURIComponent(d.subject)}&body=${encodeURIComponent(body)}`;
  status.textContent = 'Opening your email app. If nothing opens, email me directly at sandhiyas12062004@gmail.com.';
  form.reset();
});

// ===== Footer year =====
document.getElementById('year').textContent = new Date().getFullYear();
