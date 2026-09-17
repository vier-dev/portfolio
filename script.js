const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Reveal sections as they scroll into view
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length){
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
}

// Rail fills as you scroll down the page
const railFill = document.getElementById('railFill');
function updateRail(){
  if (!railFill) return;
  const doc = document.documentElement;
  const scrolled = doc.scrollTop || document.body.scrollTop;
  const height = doc.scrollHeight - doc.clientHeight;
  const pct = height > 0 ? Math.min(100, (scrolled / height) * 100) : 0;
  railFill.style.height = pct + '%';
}
document.addEventListener('scroll', updateRail, { passive: true });
window.addEventListener('resize', updateRail);
updateRail();
 
// Smooth-scroll to any #section link without leaving the hash in the URL
document.querySelectorAll('a[href*="#"]').forEach(link => {
  const [path, hash] = link.getAttribute('href').split('#');
  if (!hash) return;
  // Only intercept links pointing at THIS page (no path, or path === current page)
  const samePage = !path || path === '' || path === window.location.pathname.split('/').pop();
  if (!samePage) return;
 
  link.addEventListener('click', (e) => {
    const target = hash === 'top' ? document.body : document.getElementById(hash);
    if (!target) return; // let it behave normally if the target doesn't exist here
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: hash === 'top' ? 'start' : 'start' });
    history.pushState(null, '', window.location.pathname);
  });
});

// Testimonial slider
const track = document.querySelector('.testimonial-track');
const slides = document.querySelectorAll('.t-slide');
const dotsWrap = document.getElementById('tDots');
const prevBtn = document.getElementById('tPrev');
const nextBtn = document.getElementById('tNext');

if (track && slides.length){
  let current = 0;
  track.style.setProperty('--slide-count', slides.length);

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 't-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = document.querySelectorAll('.t-dot');

  function goTo(i){
    current = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * (100 / slides.length)}%)`;
    dots.forEach((d, idx) => d.classList.toggle('active', idx === current));
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  let autoplay = setInterval(() => goTo(current + 1), 6000);
  track.closest('.testimonial-slider').addEventListener('mouseenter', () => clearInterval(autoplay));
  track.closest('.testimonial-slider').addEventListener('mouseleave', () => {
    autoplay = setInterval(() => goTo(current + 1), 6000);
  });
}
