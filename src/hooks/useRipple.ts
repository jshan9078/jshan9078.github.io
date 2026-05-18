import { useEffect, useCallback } from 'react';

export function useRipple() {
  const createRipple = useCallback((event: MouseEvent) => {
    const target = event.currentTarget as HTMLElement;
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    const rippleEl = ripple as HTMLElement;
    rippleEl.className = 'ripple';
    rippleEl.style.width = rippleEl.style.height = `${size}px`;
    rippleEl.style.left = `${x}px`;
    rippleEl.style.top = `${y}px`;
    rippleEl.style.marginLeft = '0px';
    rippleEl.style.marginTop = '0px';

    target.style.position = 'relative';
    target.style.overflow = 'hidden';
    target.appendChild(ripple);

    const removeRipple = () => {
      rippleEl.remove();
    };

    rippleEl.addEventListener('animationend', removeRipple);
  }, []);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target) return;

      const interactive = target.closest('button, a, [data-ripple]') as HTMLElement | null;
      if (interactive) {
        createRipple(event);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [createRipple]);
}
