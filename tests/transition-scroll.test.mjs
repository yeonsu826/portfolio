import assert from "node:assert/strict";
import test from "node:test";
import { acquirePageScrollLock } from "../src/app/utils/useTransitionScrollLock.ts";

class InlineStyle {
  values = new Map();
  getPropertyValue(name) {
    return this.values.get(name)?.value ?? "";
  }
  getPropertyPriority(name) {
    return this.values.get(name)?.priority ?? "";
  }
  setProperty(name, value, priority = "") {
    this.values.set(name, { value, priority });
  }
  removeProperty(name) {
    this.values.delete(name);
  }
}

test("overlapping transitions keep scrolling locked until the last animation ends", () => {
  const root = {
    style: new InlineStyle(),
    scrollHeight: 2000,
    clientHeight: 800,
  };
  const body = { style: new InlineStyle() };
  const page = { documentElement: root, body };
  const view = new EventTarget();
  root.style.setProperty("overflow-y", "auto", "important");
  root.style.setProperty("scrollbar-gutter", "stable both-edges");
  const releaseCard = acquirePageScrollLock(page, view);
  const releaseCover = acquirePageScrollLock(page, view);
  try {
    assert.equal(root.style.getPropertyValue("overflow-y"), "hidden");
    assert.equal(body.style.getPropertyValue("overflow-y"), "hidden");
    const wheel = new Event("wheel", { cancelable: true });
    view.dispatchEvent(wheel);
    assert.equal(wheel.defaultPrevented, true);
    releaseCard();
    releaseCard(); // Duplicate cleanup must not release another transition's lock.
    assert.equal(root.style.getPropertyValue("overflow-y"), "hidden");
    releaseCover();
    assert.equal(root.style.getPropertyValue("overflow-y"), "auto");
    assert.equal(root.style.getPropertyPriority("overflow-y"), "important");
    assert.equal(
      root.style.getPropertyValue("scrollbar-gutter"),
      "stable both-edges",
    );
    assert.equal(body.style.getPropertyValue("overflow-y"), "");
    const nextWheel = new Event("wheel", { cancelable: true });
    view.dispatchEvent(nextWheel);
    assert.equal(nextWheel.defaultPrevented, false);
  } finally {
    releaseCard();
    releaseCover();
  }
});

test("scroll keys and touch scrolling are blocked without blocking other keys", () => {
  const page = {
    documentElement: {
      style: new InlineStyle(),
      scrollHeight: 800,
      clientHeight: 800,
    },
    body: { style: new InlineStyle() },
  };
  const view = new EventTarget();
  const release = acquirePageScrollLock(page, view);
  try {
    for (const [key, blocked] of [
      ["PageDown", true],
      ["ArrowDown", true],
      [" ", true],
      ["Escape", false],
      ["Tab", false],
    ]) {
      const event = new Event("keydown", { cancelable: true });
      Object.defineProperty(event, "key", { value: key });
      view.dispatchEvent(event);
      assert.equal(event.defaultPrevented, blocked, key);
    }
    const touch = new Event("touchmove", { cancelable: true });
    view.dispatchEvent(touch);
    assert.equal(touch.defaultPrevented, true);
  } finally {
    release();
  }
});
