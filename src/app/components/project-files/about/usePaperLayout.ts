import { useLayoutEffect, useRef, useState } from "react";

type Rectangle = { left: number; top: number; right: number; bottom: number };
export type PhotoPosition = {
  left: number;
  top: number;
  width: number;
  angle: number;
};

export function arrangePhotos(
  papers: Rectangle[],
  boardWidth: number,
  boardHeight: number,
  count: number,
): PhotoPosition[] {
  const placed: PhotoPosition[] = [];
  const width = Math.min(154, Math.max(94, boardWidth * 0.17));
  const height = width * 0.76;
  for (
    let top = 16;
    top < boardHeight - height - 140 && placed.length < count;
    top += 18
  ) {
    for (
      let left = 8;
      left < boardWidth - width - 8 && placed.length < count;
      left += 18
    ) {
      const overlaps = (r: Rectangle) =>
        left < r.right + 6 &&
        left + width > r.left - 6 &&
        top < r.bottom + 6 &&
        top + height > r.top - 6;
      if (
        papers.some(overlaps) ||
        placed.some((photo) =>
          overlaps({
            left: photo.left,
            top: photo.top,
            right: photo.left + width,
            bottom: photo.top + height,
          }),
        )
      )
        continue;
      placed.push({
        left,
        top,
        width,
        angle: [-7, 5, -4, 8, -6, 3][placed.length % 6],
      });
    }
  }
  if (boardWidth > 650)
    placed.forEach((photo, index) => {
      if (index === 4 || index === 5) photo.top += 32;
    });
  return placed;
}

export function usePaperLayout(photoCount: number) {
  const desk = useRef<HTMLElement>(null);
  const [photos, setPhotos] = useState<PhotoPosition[]>([]);
  useLayoutEffect(() => {
    const element = desk.current;
    const frame = element?.closest<HTMLElement>(".archive-frame");
    if (!element || !frame) return;
    let request = 0;
    let previousLayout = "";
    const update = () => {
      request = 0;
      // Read layout together before writing styles, and skip unchanged geometry.
      const width = element.clientWidth;
      const height = element.offsetHeight;
      const offset = element.offsetTop;
      const papers = Array.from(
        element.querySelectorAll<HTMLElement>(":scope > .resume-paper"),
      ).map((paper) => ({
        left: paper.offsetLeft + 4,
        top: paper.offsetTop + 4,
        right: paper.offsetLeft + paper.offsetWidth - 4,
        bottom: paper.offsetTop + paper.offsetHeight - 4,
      }));
      const signature = JSON.stringify([width, height, offset, papers]);
      if (signature === previousLayout) return;
      previousLayout = signature;
      frame.style.setProperty(
        "--resume-desk-height",
        `${offset + height + 50}px`,
      );
      const next = arrangePhotos(papers, width, height, photoCount);
      setPhotos((previous) =>
        previous.length === next.length &&
        previous.every(
          (photo, index) =>
            photo.left === next[index].left &&
            photo.top === next[index].top &&
            photo.width === next[index].width,
        )
          ? previous
          : next,
      );
    };
    const schedule = () => {
      if (!request) request = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(element);
    element
      .querySelectorAll(":scope > .resume-paper")
      .forEach((paper) => observer.observe(paper));
    update();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(request);
      frame.style.removeProperty("--resume-desk-height");
    };
  }, [photoCount]);
  return { desk, photos };
}
