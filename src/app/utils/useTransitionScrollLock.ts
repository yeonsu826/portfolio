import { useLayoutEffect } from "react";

const scrollKeys = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " ",
  "Spacebar",
]);
let locks = 0;
let restore: (() => void) | null = null;

/** Shared by the departing card and arriving page so their locks can overlap. */
export function acquirePageScrollLock(
  page: Document = document,
  view: Window = window,
) {
  if (locks++ === 0) {
    const root = page.documentElement;
    const body = page.body;
    const saved = [root, body].map((element) => ({
      element,
      overflow: element.style.getPropertyValue("overflow-y"),
      overflowPriority: element.style.getPropertyPriority("overflow-y"),
    }));
    const gutter = root.style.getPropertyValue("scrollbar-gutter");
    const gutterPriority = root.style.getPropertyPriority("scrollbar-gutter");
    // Preserve the file widths while hiding the scrollbar, including during snapshots.
    if (root.scrollHeight > root.clientHeight)
      root.style.setProperty("scrollbar-gutter", "stable");
    saved.forEach(({ element }) =>
      element.style.setProperty("overflow-y", "hidden", "important"),
    );
    const prevent = (event: Event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (scrollKeys.has(event.key)) prevent(event);
    };
    view.addEventListener("wheel", prevent, { passive: false, capture: true });
    view.addEventListener("touchmove", prevent, {
      passive: false,
      capture: true,
    });
    view.addEventListener("keydown", onKeyDown, { capture: true });
    restore = () => {
      saved.forEach(({ element, overflow, overflowPriority }) => {
        if (overflow)
          element.style.setProperty("overflow-y", overflow, overflowPriority);
        else element.style.removeProperty("overflow-y");
      });
      if (gutter)
        root.style.setProperty("scrollbar-gutter", gutter, gutterPriority);
      else root.style.removeProperty("scrollbar-gutter");
      view.removeEventListener("wheel", prevent, { capture: true });
      view.removeEventListener("touchmove", prevent, { capture: true });
      view.removeEventListener("keydown", onKeyDown, { capture: true });
    };
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--locks === 0) {
      restore?.();
      restore = null;
    }
  };
}

export function useTransitionScrollLock(locked: boolean) {
  useLayoutEffect(() => {
    if (locked) return acquirePageScrollLock();
  }, [locked]);
}
