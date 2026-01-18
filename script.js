// Improved script.js — wrapped in DOMContentLoaded, safer selectors, RAF scrolling, dark-mode persistence
document.addEventListener('DOMContentLoaded', () => {
  const menuIcon = document.querySelector('#menu-icon');
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('header nav a');
  const header = document.querySelector('.header');
  const darkModeIcon = document.querySelector('#darkMode-icon');

  const setMenuAria = (expanded) => {
    if (menuIcon) menuIcon.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  };

  if (menuIcon) {
    menuIcon.setAttribute('role', 'button');
    menuIcon.setAttribute('tabindex', '0');
    menuIcon.setAttribute('aria-label', 'Toggle navigation menu');
    setMenuAria(false);

    menuIcon.addEventListener('click', () => {
      menuIcon.classList.toggle('bx-x');
      if (navbar) navbar.classList.toggle('active');
      const expanded = menuIcon.classList.contains('bx-x');
      setMenuAria(expanded);
    });

    menuIcon.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        menuIcon.click();
      }
    });
  }

  let ticking = false;
  const onScroll = () => {
    const top = window.scrollY;

    sections.forEach(sec => {
      const offset = sec.offsetTop - 150;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (top >= offset && top < offset + height) {
        navLinks.forEach(link => link.classList.remove('active'));
        const selector = `header nav a[href="#${id}"]`;
        const activeLink = document.querySelector(selector);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });

    if (header) header.classList.toggle('sticky', window.scrollY > 100);

    if (menuIcon) menuIcon.classList.remove('bx-x');
    if (navbar) navbar.classList.remove('active');
    setMenuAria(false);
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Dark mode with persistence
  const applyDarkMode = (isDark) => {
    document.body.classList.toggle('dark-mode', isDark);
    if (darkModeIcon) darkModeIcon.classList.toggle('bx-sun', isDark);
  };

  const stored = localStorage.getItem('celeng-dark-mode');
  const prefersDark = stored !== null ? stored === 'true' : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyDarkMode(prefersDark);

  if (darkModeIcon) {
    darkModeIcon.setAttribute('role', 'button');
    darkModeIcon.setAttribute('tabindex', '0');
    darkModeIcon.setAttribute('aria-label', 'Toggle dark mode');
    darkModeIcon.setAttribute('aria-pressed', prefersDark ? 'true' : 'false');

    darkModeIcon.addEventListener('click', () => {
      const isNowDark = !document.body.classList.contains('dark-mode');
      applyDarkMode(isNowDark);
      localStorage.setItem('celeng-dark-mode', String(isNowDark));
      darkModeIcon.setAttribute('aria-pressed', isNowDark ? 'true' : 'false');
    });

    darkModeIcon.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        darkModeIcon.click();
      }
    });
  }

  // initial state
  onScroll();
});
