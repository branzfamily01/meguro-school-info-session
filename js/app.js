(() => {
  const root = document.documentElement;
  const motionButton = document.querySelector('[data-motion-toggle]');
  const heroCta = document.querySelector('[data-hero-cta]');
  const sticky = document.querySelector('[data-sticky-application]');
  const hideTargets = [...document.querySelectorAll('[data-hide-sticky-when-visible]')];
  const motionKey = 'meguro-reduce-motion';
  const osReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  const manualReduce = () => {
    try { return localStorage.getItem(motionKey) === 'true'; }
    catch { return false; }
  };

  function reduceMotionEnabled() {
    return osReduce.matches || manualReduce();
  }

  function applyMotionState() {
    const reduced = reduceMotionEnabled();
    root.dataset.reduceMotion = reduced ? 'true' : 'false';
    if (motionButton) {
      motionButton.textContent = reduced ? '動きを標準にする' : '動きを減らす';
      motionButton.setAttribute('aria-pressed', manualReduce() ? 'true' : 'false');
    }
  }

  if (motionButton) {
    motionButton.addEventListener('click', () => {
      try { localStorage.setItem(motionKey, manualReduce() ? 'false' : 'true'); }
      catch {}
      applyMotionState();
    });
  }
  osReduce.addEventListener?.('change', applyMotionState);
  applyMotionState();

  if (sticky && heroCta && 'IntersectionObserver' in window) {
    let heroVisible = true;
    const visibleHideTargets = new Set();

    const updateSticky = () => {
      const shortLandscape = window.innerHeight <= 500;
      const shouldShow = !heroVisible && visibleHideTargets.size === 0 && !shortLandscape;
      sticky.hidden = !shouldShow;
    };

    new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      updateSticky();
    }, { threshold: 0.15 }).observe(heroCta);

    const targetObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleHideTargets.add(entry.target);
        else visibleHideTargets.delete(entry.target);
      });
      updateSticky();
    }, { threshold: 0.18 });
    hideTargets.forEach((target) => targetObserver.observe(target));
    window.addEventListener('resize', updateSticky, { passive: true });
  }

  const heroMedia = document.querySelector('[data-hero-media]');
  const exploreMedia = document.querySelector('[data-explore-media]');
  let raf = 0;
  function updateParallax() {
    raf = 0;
    if (reduceMotionEnabled() || window.innerWidth < 1024) {
      heroMedia?.style.removeProperty('--media-shift');
      exploreMedia?.style.removeProperty('--media-shift');
      return;
    }
    const y = window.scrollY;
    if (heroMedia) heroMedia.style.setProperty('--media-shift', `${Math.min(12, y * 0.018)}px`);
    if (exploreMedia) {
      const rect = exploreMedia.getBoundingClientRect();
      const progress = Math.max(-1, Math.min(1, (window.innerHeight / 2 - rect.top) / window.innerHeight));
      exploreMedia.style.setProperty('--media-shift', `${progress * 24}px`);
    }
  }
  window.addEventListener('scroll', () => {
    if (!raf) raf = requestAnimationFrame(updateParallax);
  }, { passive: true });
  updateParallax();
})();
