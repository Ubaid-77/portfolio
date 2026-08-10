/** Handles the mobile menu and subtle reveal animations. */
const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.primary-nav');
const navigationLinks = document.querySelectorAll('.primary-nav a');

function setMenuState(isOpen) {
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.querySelector('.sr-only').textContent = isOpen ? 'Close navigation' : 'Open navigation';
  navigation.classList.toggle('is-open', isOpen);
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  setMenuState(!isOpen);
});

navigationLinks.forEach((link) => link.addEventListener('click', () => setMenuState(false)));

// Keep the navigation in sync with the section currently in view.
const sections = document.querySelectorAll('main section[id]');
const linkBySection = new Map(
  [...navigationLinks].map((link) => [link.getAttribute('href').slice(1), link]),
);

const navigationObserver = new IntersectionObserver(
  (entries) => entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navigationLinks.forEach((link) => link.classList.remove('is-active'));
    linkBySection.get(entry.target.id)?.classList.add('is-active');
  }),
  { rootMargin: '-35% 0px -55% 0px', threshold: 0 },
);

sections.forEach((section) => navigationObserver.observe(section));

const revealItems = document.querySelectorAll('.reveal');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }),
    { threshold: 0.12 },
  );
  revealItems.forEach((item) => observer.observe(item));
}
