import { useEffect } from 'react';

export const useMobileViewport = () => {
  useEffect(() => {
    // Prevent zoom on input focus (iOS Safari)
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        target.setAttribute('inputmode', 'text');
      }
    };

    // Prevent double-tap zoom
    let lastTouchEnd = 0;
    const handleTouchEnd = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    // Handle viewport height changes (iOS Safari)
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Set initial values
    setVH();

    // Add event listeners
    document.addEventListener('focus', handleFocus, true);
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    return () => {
      document.removeEventListener('focus', handleFocus, true);
      document.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);
};
