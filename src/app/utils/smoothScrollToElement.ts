/** Scroll after the new sheet has settled, with a gentle start and finish. */
export function smoothScrollToElement(element: HTMLElement) {
  let frame = 0;
  let cancelled = false;

  function cancel() {
    cancelled = true;
    cancelAnimationFrame(frame);
    window.removeEventListener('wheel', cancel);
    window.removeEventListener('touchstart', cancel);
    window.removeEventListener('keydown', onKeyDown);
  }

  function onKeyDown(event: KeyboardEvent) {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) cancel();
  }

  window.addEventListener('wheel', cancel, { passive: true });
  window.addEventListener('touchstart', cancel, { passive: true });
  window.addEventListener('keydown', onKeyDown);

  frame = requestAnimationFrame(() => {
    frame = requestAnimationFrame(() => {
      if (cancelled || !element.isConnected) { cancel(); return; }
      let scroller: HTMLElement | null = element.parentElement;
      while (scroller && scroller !== document.documentElement) {
        const overflow = getComputedStyle(scroller).overflowY;
        if (/(auto|scroll)/.test(overflow) && scroller.scrollHeight > scroller.clientHeight + 1) break;
        scroller = scroller.parentElement;
      }
      const container = scroller && scroller !== document.documentElement ? scroller : null;
      const from = container ? container.scrollTop : window.scrollY;
      const margin = parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
      const max = Math.max(0, container ? container.scrollHeight - container.clientHeight : document.documentElement.scrollHeight - window.innerHeight);
      const origin = container && container !== document.body ? container.getBoundingClientRect().top + container.clientTop : 0;
      const to = Math.max(0, Math.min(max, from + element.getBoundingClientRect().top - origin - margin));
      const distance = to - from;
      if (Math.abs(distance) < 1) { cancel(); return; }
      const duration = Math.min(1600, Math.max(1100, Math.abs(distance) * 1.4));
      const started = performance.now();

      function step(now: number) {
        if (cancelled || !element.isConnected) { cancel(); return; }
        const progress = Math.min(1, (now - started) / duration);
        const eased = progress ** 3 * (progress * (progress * 6 - 15) + 10);
        const top = from + distance * eased;
        if (container) container.scrollTo({ top, behavior: 'instant' });
        else window.scrollTo({ top, behavior: 'instant' });
        if (progress < 1) frame = requestAnimationFrame(step);
        else cancel();
      }

      frame = requestAnimationFrame(step);
    });
  });

  return cancel;
}
