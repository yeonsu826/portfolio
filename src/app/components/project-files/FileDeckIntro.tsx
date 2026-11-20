import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import { motion, useAnimationControls } from "motion/react";
import { previewSrc } from "../../utils/imagePreview";
import {
  fileRows,
  fileSelection,
  rowTabWidth,
  tabColors,
  tabNames,
} from "./projectFileData";

const titles = [
  "ALL PROJECTS",
  "DEVELOPMENT",
  "DESIGN",
  "INDEPENDENT",
  "VIDEO WORK",
];
const groupTitles = [
  "전체 프로젝트",
  "개발",
  "디자인",
  "1인 개발",
  "영상 작업",
];
const deckOrder = [
  fileRows.findIndex((row) => row.id === "videos"),
  ...fileRows
    .map((_, index) => index)
    .filter((index) => index !== 0 && fileRows[index].id !== "videos"),
  0,
];
const deckRows = fileRows;
const groupPreviews = [
  "images/cafe/0.jpeg",
  "images/dev/InteractiveRacing/1.png",
  "jinu/14.png",
  "images/dev/gracesea/project-thumbnail.jpg",
  "images/gamingroom/1.jpeg",
];
const groupDescriptions = [
  {
    ko: "앱과 웹 서비스부터 3D 공간, 캐릭터, 인터랙티브 콘텐츠까지. 디자인과 개발 사이에서 아이디어를 직접 만들고 경험으로 완성한 작업들을 모았습니다.",
    en: "Apps, web services, 3D spaces, characters, and interactive experiences. A collection of ideas brought to life through design and code.",
  },
  {
    ko: "Unity와 웹 기술을 바탕으로 아이디어를 실제로 작동하는 경험으로 구현합니다. 사용자와 콘텐츠가 상호작용하는 과정을 설계하고 개발한 프로젝트입니다.",
    en: "Working experiences built with Unity and web technologies, exploring how people interact with digital content.",
  },
  {
    ko: "공간과 사물, 캐릭터의 형태와 분위기를 설계합니다. 3D 모델링과 재질, 조명, 렌더링을 통해 장면을 완성하고 시각적인 경험을 만들어갑니다.",
    en: "Spaces, objects, and characters shaped through 3D modeling, materials, lighting, and rendering.",
  },
  {
    ko: "일상에서 발견한 작은 아이디어를 서비스로 만듭니다. 기획과 디자인, 개발을 직접 이어가며 하나의 프로젝트를 완성해가는 과정을 담았습니다.",
    en: "Everyday ideas turned into independent projects, connecting planning, design, and development from start to finish.",
  },
  {
    ko: "3D 공간과 캐릭터 제작, Unity 인터랙션과 시각 효과를 영상으로 모았습니다. 각 인덱스에서 작업의 움직임과 제작 과정을 살펴볼 수 있습니다.",
    en: "Videos of 3D scenes, characters, Unity interactions, and visual effects. Choose an index to watch each project in motion.",
  },
];
export type DeckSelection = {
  row: number;
  key: string;
  source: { left: number; top: number; width: number; height: number };
  angle: number;
  snapshot?: {
    html: string;
    color: string;
    rowHeight: string;
    tabHeight: string;
    tabFont: string;
  };
};

export function FileDeckIntro({
  onChoose,
  lang,
  returning = false,
  onReady,
  contact = false,
  startParked = false,
  onParked,
  onResume,
}: {
  onChoose: (selection: DeckSelection) => void;
  lang: string;
  returning?: boolean;
  onReady?: () => void;
  contact?: boolean;
  startParked?: boolean;
  onParked?: () => void;
  onResume?: () => void;
}) {
  const [parking, setParking] = useState<
    "none" | "gather" | "lower" | "parked" | "restore"
  >(startParked ? "parked" : "none");
  const [dockOrigin, setDockOrigin] = useState<{
    left: number;
    top: number;
    width: number;
  } | null>(null);
  const [arrival, setArrival] = useState<"rising" | "spread" | "done">(
    returning ? "rising" : "done",
  );
  const [previewAngles] = useState(() =>
    deckRows.map(() => Math.random() * 20 - 10),
  );
  const [stackAngles] = useState(() =>
    Array.from({ length: 3 }, () => Math.random() * 40 - 20),
  );
  const [stackSizes] = useState(() =>
    Array.from({ length: 3 }, () => 0.8 + Math.random() * 0.4),
  );
  const [previewSizes] = useState(() =>
    deckRows.map(() => 0.8 + Math.random() * 0.4),
  );
  const [size] = useState(() => ({
    viewport: window.innerWidth,
    width: Math.min(
      720,
      Math.max(560, document.documentElement.clientWidth * 0.78676 * 0.65),
    ),
    rowHeight: Math.min(58, Math.max(36, window.innerWidth * 0.0378)),
    height:
      Math.min(520, Math.max(340, window.innerHeight * 0.46)) +
      Math.min(58, Math.max(36, window.innerWidth * 0.0378)),
  }));
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [hovered, setHovered] = useState<number | null>(null);
  const [choice, setChoice] = useState<{
    row: number;
    key: string;
    lift: number;
    sideTravel: number;
  } | null>(null);
  const [phase, setPhase] = useState<"idle" | "extract" | "collect">("idle");
  const collectionComplete = useRef({
    outer: false,
    inner: false,
    committed: false,
  });
  const fan = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (startParked && fan.current) {
      const rect = fan.current.getBoundingClientRect();
      setDockOrigin({ left: rect.left, top: rect.top, width: rect.width });
      onParked?.();
    }
  }, []);
  useEffect(() => {
    if (contact && parking === "none") {
      setHovered(null);
      setParking("gather");
    }
    if (!contact && parking === "parked") setParking("restore");
  }, [contact, parking]);
  function parkingComplete(slot: number) {
    if (slot !== deckRows.length - 1) return;
    if (parking === "gather" && fan.current) {
      const rect = fan.current.getBoundingClientRect();
      setDockOrigin({ left: rect.left, top: rect.top, width: rect.width });
      setParking("lower");
    } else if (parking === "lower") {
      setParking("parked");
      onParked?.();
    } else if (parking === "restore") {
      setDockOrigin(null);
      setParking("none");
      setArrival("spread");
    }
  }
  useLayoutEffect(() => {
    const element = fan.current;
    if (!element) return;
    const context = document.createElement("canvas").getContext("2d");
    if (!context) return;
    let disposed = false;
    const tabs = Array.from(
      element.querySelectorAll<HTMLElement>(".mosby-tab"),
    );
    function fitTabLabels() {
      if (disposed) return;
      const baseSize = parseFloat(
        getComputedStyle(element!).getPropertyValue("--deck-tab-font"),
      );
      tabs.forEach((tab) => {
        const style = getComputedStyle(tab);
        context!.font = `${style.fontWeight} ${baseSize}px ${style.fontFamily}`;
        const textWidth = context!.measureText(tab.textContent ?? "").width;
        // Leave space for both curved shoulders of the folder tab.
        const available = Math.max(1, tab.clientWidth * 0.76 - 10);
        tab.style.setProperty(
          "--deck-tab-font-fit",
          `${Math.min(baseSize, (baseSize * available) / Math.max(1, textWidth))}px`,
        );
      });
    }
    const observer = new ResizeObserver(fitTabLabels);
    tabs.forEach((tab) => observer.observe(tab));
    fitTabLabels();
    void document.fonts.ready.then(fitTabLabels);
    return () => {
      disposed = true;
      observer.disconnect();
    };
  }, []);
  useLayoutEffect(() => {
    const photos = Array.from(
      fan.current?.querySelectorAll<HTMLElement>(".archive-fan-preview") ?? [],
    );
    function keepPhotosInside() {
      const corrections = photos.map((photo) => {
        const angle =
          (parseFloat(photo.style.getPropertyValue("--preview-angle")) *
            Math.PI) /
          180;
        const scale =
          parseFloat(photo.style.getPropertyValue("--preview-scale")) || 1;
        const width = photo.offsetWidth;
        const rotatedWidth =
          (width * Math.abs(Math.cos(angle)) +
            photo.offsetHeight * Math.abs(Math.sin(angle))) *
          scale;
        const available = Math.max(1, photo.parentElement!.clientWidth - 20);
        const fit =
          rotatedWidth > 0 ? Math.min(1, available / rotatedWidth) : 1;
        const halfWidth = (rotatedWidth * fit) / 2;
        const center = photo.offsetLeft + width / 2;
        const minShift = 10 + halfWidth - center;
        const maxShift =
          photo.parentElement!.clientWidth - 10 - halfWidth - center;
        return { fit, shift: Math.min(maxShift, Math.max(minShift, -18)) };
      });
      photos.forEach((photo, index) => {
        photo.style.setProperty(
          "--preview-shift",
          `${corrections[index].shift}px`,
        );
        photo.style.setProperty("--preview-fit", `${corrections[index].fit}`);
      });
    }
    const observer = new ResizeObserver(keepPhotosInside);
    const images = photos.flatMap((photo) =>
      Array.from(photo.querySelectorAll("img")),
    );
    photos.forEach((photo) => {
      observer.observe(photo);
      observer.observe(photo.parentElement!);
    });
    images.forEach((image) => image.addEventListener("load", keepPhotosInside));
    keepPhotosInside();
    return () => {
      observer.disconnect();
      images.forEach((image) =>
        image.removeEventListener("load", keepPhotosInside),
      );
    };
  }, []);
  useEffect(() => {
    const resize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  const spread = Math.max(0, Math.min(1, (viewportWidth - 600) / 600));
  const angles = deckRows.map(
    (_, slot) => 90 + ((slot / (deckRows.length - 1)) * 24 - 12) * spread,
  );
  const resized = viewportWidth !== size.viewport;
  function choose(row: number, key: string, element: HTMLElement) {
    if (choice || arrival !== "done" || parking !== "none") return;
    const file = element.closest<HTMLElement>(".archive-fan-file");
    if (!file) return;
    const surface = file.querySelector<HTMLElement>(".archive-fan-surface");
    const matrix = surface
      ? new DOMMatrixReadOnly(getComputedStyle(surface).transform)
      : new DOMMatrixReadOnly();
    const angle = (angles[deckOrder.indexOf(row)] * Math.PI) / 180;
    const lift = Math.max(
      0,
      -(matrix.m41 * Math.sin(angle) + matrix.m42 * Math.cos(angle)),
    );
    const slot = deckOrder.indexOf(row);
    const frontEdges = Array.from(
      file.parentElement!.querySelectorAll<HTMLElement>(".archive-fan-file"),
    )
      .filter((card) => deckOrder.indexOf(Number(card.dataset.deckRow)) > slot)
      .map((card) => card.getBoundingClientRect().left);
    const rect = file.getBoundingClientRect();
    const peakAngle =
      ((angles[slot] - 24 + (90 - angles[slot]) * 0.25) * Math.PI) / 180;
    const peakWidth =
      size.width * Math.abs(Math.cos(peakAngle)) +
      size.height * Math.abs(Math.sin(peakAngle));
    const sideTravel = Math.max(
      size.height * 0.45,
      frontEdges.length
        ? rect.left +
            rect.width / 2 +
            peakWidth / 2 -
            Math.min(...frontEdges) +
            28
        : 0,
    );
    collectionComplete.current = {
      outer: false,
      inner: false,
      committed: false,
    };
    setHovered(null);
    setChoice({ row, key, lift, sideTravel });
    setPhase(row === deckOrder[deckOrder.length - 1] ? "collect" : "extract");
  }
  function completeCollection(part: "outer" | "inner", index: number) {
    if (phase !== "collect" || choice?.row !== index) return;
    const completed = collectionComplete.current;
    completed[part] = true;
    if (!completed.outer || !completed.inner || completed.committed) return;
    const element = document.querySelector<HTMLElement>(
      `[data-deck-row="${index}"]`,
    );
    if (!element) return;
    completed.committed = true;
    finishCollection(element);
  }
  function finishCollection(element: HTMLElement) {
    if (!choice) return;
    const { key } = choice;
    const file = element.closest<HTMLElement>(".archive-fan-file");
    if (!file) return;
    const surface = file.querySelector<HTMLElement>(".archive-fan-surface");
    const rect = (surface ?? file).getBoundingClientRect();
    const parent = file.parentElement!;
    const scale = parent.getBoundingClientRect().width / parent.offsetWidth;
    const width = file.offsetWidth * scale;
    const height = file.offsetHeight * scale;
    const transform = new DOMMatrixReadOnly(getComputedStyle(file).transform);
    const inner = surface
      ? new DOMMatrixReadOnly(getComputedStyle(surface).transform)
      : new DOMMatrixReadOnly();
    const angle =
      ((Math.atan2(transform.b, transform.a) + Math.atan2(inner.b, inner.a)) *
        180) /
      Math.PI;
    const target = fileSelection(key);
    const style = getComputedStyle(file);
    // Freeze our rendered file, including its fitted labels and randomized photos.
    const snapshot = {
      html: surface?.innerHTML ?? "",
      color: deckRows[choice.row].color,
      rowHeight: style.getPropertyValue("--row-height"),
      tabHeight: style.getPropertyValue("--tab-height"),
      tabFont: style.getPropertyValue("--deck-tab-font"),
    };
    onChoose({
      ...target,
      source: {
        left: rect.left + (rect.width - width) / 2,
        top: rect.top + (rect.height - height) / 2,
        width,
        height,
      },
      angle,
      snapshot,
    });
  }
  return (
    <section
      data-deck-parking={parking}
      data-deck-phase={phase}
      data-deck-arrival={arrival}
      aria-busy={
        !!choice ||
        arrival !== "done" ||
        (parking !== "none" && parking !== "parked")
      }
      className={`archive-deck-intro ${parking !== "none" ? "is-parked-contact" : ""}`}
      aria-label={lang === "ko" ? "그룹 파일 선택" : "Choose a group file"}
    >
      <p className="archive-deck-hint">
        {lang === "ko"
          ? "하나의 파일을 골라 작업을 펼쳐보세요."
          : "Pick a file. Explore the work inside."}
      </p>
      <div
        ref={fan}
        aria-hidden={parking === "parked" ? true : undefined}
        className={`archive-fan ${choice || arrival !== "done" || parking !== "none" ? "is-choosing" : ""}`}
        style={
          {
            ...(dockOrigin
              ? {
                  position: "fixed",
                  left: dockOrigin.left,
                  top: dockOrigin.top,
                  width: dockOrigin.width,
                  margin: 0,
                  zIndex: 60,
                }
              : {}),
            "--deck-file-width": `${size.width}px`,
            "--deck-file-height": `${size.height}px`,
            "--row-height": `${size.rowHeight}px`,
            "--tab-height": `${size.rowHeight * 0.76}px`,
            "--deck-stack-rise": `${(deckRows.length - 1) * 60 * (1 - spread)}px`,
            "--deck-tab-font": `${Math.min(19, Math.max(11, size.viewport * 0.013))}px`,
          } as CSSProperties
        }
      >
        {deckRows.map((row, index) => {
          const slot = deckOrder.indexOf(index);
          const baseAngle = angles[slot];
          const lift = choice?.lift ?? 0;
          const peak = lift + Math.min(size.width * 0.5, 300);
          const sideTravel = choice?.sideTravel ?? size.height * 0.45;
          const lean = -24 + (90 - baseAngle) * 0.25;
          const parked = parking === "lower" || parking === "parked";
          const dockY =
            window.innerHeight -
            size.rowHeight -
            20 -
            (dockOrigin?.top ?? 0) -
            ((size.width - size.height) / 2 + 45);
          return (
            <motion.div
              key={row.id}
              className="archive-fan-file"
              role="group"
              aria-label={row.caption}
              initial={
                startParked
                  ? false
                  : {
                      x: 0,
                      y: returning ? window.innerHeight + size.width : 40,
                      rotate: 90,
                      opacity: returning ? 1 : 0,
                    }
              }
              animate={{
                x:
                  parking !== "none" ||
                  phase === "collect" ||
                  arrival === "rising"
                    ? 0
                    : ((slot / (deckRows.length - 1)) * 270 - 135) * spread,
                y: parked
                  ? dockY
                  : parking !== "none" ||
                      phase === "collect" ||
                      arrival === "rising"
                    ? 0
                    : Math.abs((slot / (deckRows.length - 1)) * 2 - 1) *
                        30 *
                        spread +
                      slot * 60 * (1 - spread),
                rotate: parked
                  ? 0
                  : parking !== "none" ||
                      phase === "collect" ||
                      arrival === "rising"
                    ? 90
                    : baseAngle,
                opacity: 1,
                zIndex:
                  choice?.row === index
                    ? phase === "extract"
                      ? slot + 1
                      : 20
                    : slot + 1,
              }}
              transition={{
                duration:
                  parking === "parked"
                    ? 0
                    : parking !== "none"
                      ? 1.05
                      : arrival === "rising"
                        ? 0.8
                        : arrival === "spread"
                          ? 0.85
                          : phase === "collect"
                            ? 0.95
                            : resized
                              ? 0.65
                              : 1.2,
                delay:
                  parking !== "none"
                    ? 0
                    : arrival === "rising"
                      ? 0
                      : arrival === "spread"
                        ? slot * 0.06
                        : phase !== "idle" || resized
                          ? 0
                          : 0.15 + slot * 0.08,
                ease:
                  phase === "collect"
                    ? [0.4, 0, 0.2, 1]
                    : [0.22, 0.61, 0.36, 1],
                zIndex: { duration: 0, delay: 0 },
              }}
              data-deck-row={index}
              onAnimationComplete={() => {
                if (parking !== "none") {
                  parkingComplete(slot);
                  return;
                }
                if (arrival === "rising" && slot === deckRows.length - 1)
                  setArrival("spread");
                else if (arrival === "spread" && slot === deckRows.length - 1) {
                  setArrival("done");
                  onReady?.();
                }
                completeCollection("outer", index);
              }}
              onPointerEnter={(event) => {
                if (parking === "none" && event.pointerType !== "touch")
                  setHovered(index);
              }}
              onPointerLeave={() => setHovered(null)}
              onFocusCapture={() => {
                if (parking === "none") setHovered(index);
              }}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget))
                  setHovered(null);
              }}
              style={
                {
                  "--fan-color": row.color,
                  "--row-color": row.color,
                  "--tab-width": rowTabWidth(row),
                  zIndex: slot + 1,
                } as CSSProperties
              }
            >
              <motion.div
                className="archive-fan-surface"
                initial={false}
                animate={
                  phase === "extract" && choice?.row === index
                    ? {
                        x: [
                          -lift * Math.sin((baseAngle * Math.PI) / 180),
                          -sideTravel * Math.cos((baseAngle * Math.PI) / 180) -
                            peak * Math.sin((baseAngle * Math.PI) / 180),
                        ],
                        y: [
                          -lift * Math.cos((baseAngle * Math.PI) / 180),
                          sideTravel * Math.sin((baseAngle * Math.PI) / 180) -
                            peak * Math.cos((baseAngle * Math.PI) / 180),
                        ],
                        rotate: [0, lean],
                      }
                    : {
                        x:
                          parking === "none" && !choice && hovered === index
                            ? -160 * Math.sin((baseAngle * Math.PI) / 180)
                            : 0,
                        y:
                          parking === "none" && !choice && hovered === index
                            ? -160 * Math.cos((baseAngle * Math.PI) / 180)
                            : 0,
                        rotate: 0,
                      }
                }
                transition={{
                  duration:
                    phase === "extract" && choice?.row === index
                      ? 0.75
                      : phase === "collect"
                        ? 0.95
                        : 0.24,
                  ease: [0.4, 0, 0.2, 1],
                }}
                onAnimationComplete={() => {
                  if (phase === "extract" && choice?.row === index)
                    setPhase("collect");
                  else completeCollection("inner", index);
                }}
              >
                <div className="mosby-row">
                  <div className="mosby-tabs">
                    {row.keys.map((key) => (
                      <button
                        key={key}
                        tabIndex={parking !== "none" ? -1 : undefined}
                        className="mosby-tab"
                        aria-label={tabNames[key]}
                        style={
                          {
                            "--tab-color": tabColors[key],
                            "--tab-ink":
                              key === "devARContentGroup"
                                ? "#191a18"
                                : "#f8f1e4",
                          } as CSSProperties
                        }
                        onClick={(event) =>
                          choose(index, key, event.currentTarget)
                        }
                      >
                        <svg
                          viewBox="0 0 240 40"
                          preserveAspectRatio="none"
                          aria-hidden="true"
                        >
                          <path d="M0 40 C24 40 23 0 52 0 H188 C217 0 216 40 240 40 Z" />
                        </svg>
                        <span>{tabNames[key]}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  tabIndex={parking !== "none" ? -1 : undefined}
                  className="archive-fan-cover"
                  aria-label={
                    lang === "ko"
                      ? titles[index] + " 그룹 파일 열기"
                      : "Open " + titles[index] + " group file"
                  }
                  onClick={(event) =>
                    choose(
                      index,
                      index === 0 ? "allProjects" : row.keys[0],
                      event.currentTarget,
                    )
                  }
                >
                  <strong className="archive-fan-group-title">
                    {lang === "ko" ? groupTitles[index] : titles[index]}
                  </strong>
                  <span className="archive-fan-group-summary">
                    {lang === "ko"
                      ? groupDescriptions[index].ko
                      : groupDescriptions[index].en}
                  </span>
                  {index === 0 ? (
                    <span className="archive-fan-preview-mount is-photo-stack">
                      {[
                        groupPreviews[0],
                        groupPreviews[1],
                        groupPreviews[3],
                      ].map((src, photoIndex) => (
                        <span
                          key={src}
                          className="archive-fan-preview"
                          style={
                            {
                              "--preview-angle": `${stackAngles[photoIndex]}deg`,
                              "--preview-scale": stackSizes[photoIndex],
                              top: `${photoIndex * 44}px`,
                              left: `${[26, 38, 24][photoIndex]}px`,
                              zIndex: photoIndex + 1,
                            } as CSSProperties
                          }
                        >
                          <img
                            src={previewSrc(src)}
                            decoding="async"
                            alt={
                              lang === "ko"
                                ? `전체 프로젝트 대표 작업 ${photoIndex + 1}`
                                : `Featured project ${photoIndex + 1}`
                            }
                            draggable={false}
                          />
                        </span>
                      ))}
                      <svg
                        className="archive-fan-preview-clip"
                        style={{ top: "50%", zIndex: 5 }}
                        viewBox="0 0 100 34"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M66 6H16C1 6 1 28 16 28H94"
                          stroke="#41413b"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />
                        <path
                          d="M66 5.6H16C1 5.6 1 27.6 16 27.6H94"
                          stroke="#dedbd1"
                          strokeWidth=".5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  ) : (
                    <span className="archive-fan-preview-mount">
                      <span
                        className="archive-fan-preview"
                        style={
                          {
                            "--preview-angle": `${previewAngles[index]}deg`,
                            "--preview-scale": previewSizes[index],
                          } as CSSProperties
                        }
                      >
                        <img
                          src={previewSrc(groupPreviews[index])}
                          decoding="async"
                          alt={`${lang === "ko" ? groupTitles[index] : titles[index]} ${lang === "ko" ? "대표 작업" : "featured project"}`}
                          draggable={false}
                        />
                      </span>
                      <svg
                        className="archive-fan-preview-clip"
                        viewBox="0 0 100 34"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M66 6H16C1 6 1 28 16 28H94"
                          stroke="#41413b"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />
                        <path
                          d="M66 5.6H16C1 5.6 1 27.6 16 27.6H94"
                          stroke="#dedbd1"
                          strokeWidth=".5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  )}
                </button>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
      {parking === "parked" && (
        <>
          <p className="archive-contact-stack-hint">
            프로젝트 파일 다시 펼치기
          </p>
          <button
            className="archive-contact-stack-button"
            aria-label="프로젝트 파일 다시 펼치기"
            onClick={onResume}
          />
        </>
      )}
    </section>
  );
}

export function OpeningDeckFile({
  selection,
  section,
  onReveal,
  onDone,
}: {
  selection: DeckSelection;
  section: RefObject<HTMLElement | null>;
  onReveal: (height: number) => void;
  onDone: () => void;
}) {
  const card = useAnimationControls();
  const cover = useAnimationControls();
  const files = useAnimationControls();
  const [showSource, setShowSource] = useState(!!selection.snapshot);
  const [arrived, setArrived] = useState(false);
  const [spreading, setSpreading] = useState(false);
  const row = fileRows[selection.row];
  const color = tabColors[selection.key] ?? row.color;
  useLayoutEffect(() => {
    card.set({
      x: selection.source.left,
      y: selection.source.top,
      width: selection.source.width,
      height: selection.source.height,
      rotate: selection.angle,
      scale: 1,
      rotateX: 0,
    });
  }, [card]);
  useEffect(() => {
    let cancelled = false;
    async function open() {
      const target = section.current;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const rowHeight = parseFloat(
        getComputedStyle(target.querySelector(".mosby-row")!).height,
      );
      const tabHeight =
        parseFloat(getComputedStyle(target).getPropertyValue("--tab-height")) ||
        rowHeight * 0.76;
      const height = Math.max(
        240,
        window.innerHeight -
          Math.max(0, rect.top + rowHeight * fileRows.length) -
          24,
      );
      const destinationY = rect.top + rowHeight * (fileRows.length - 1);
      const lowerY =
        window.innerHeight -
        Math.min(
          tabHeight,
          parseFloat(selection.snapshot?.tabHeight ?? "") || tabHeight,
        ) -
        20;
      const loweredX = rect.left + (rect.width - selection.source.width) / 2;
      // Keep the original cover intact until it is fully below the viewport.
      await card.start({
        x: loweredX,
        y: lowerY,
        rotate: 0,
        rotateX: 0,
        scale: 1,
        filter: "drop-shadow(0px 6px 10px #0002)",
        transition: {
          duration: 1.1,
          ease: "easeInOut",
        },
      });
      if (cancelled) return;
      setShowSource(false);
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => resolve()),
      );
      if (cancelled) return;
      await card.start({
        x: rect.left,
        width: rect.width,
        height: height + rowHeight,
        transition: { duration: 0.4, ease: "easeInOut" },
      });
      if (cancelled) return;
      setSpreading(true);
      await Promise.all([
        card.start({
          y: destinationY,
          transition: { duration: 1.1, ease: [0.4, 0, 0.2, 1] },
        }),
        files.start((slot: number) => ({
          y: -(fileRows.length - 1 - slot) * rowHeight,
          transition: { duration: 1.1, ease: [0.4, 0, 0.2, 1] },
        })),
      ]);
      if (cancelled) return;
      setArrived(true);
      onReveal(height);
      await cover.start({
        rotateX: [0, -78, -180],
        transition: {
          duration: 1.55,
          delay: 1.25,
          times: [0, 0.5, 1],
          ease: [0.4, 0, 0.2, 1],
        },
      });
      if (!cancelled) onDone();
    }
    void open();
    return () => {
      cancelled = true;
      card.stop();
      cover.stop();
      files.stop();
    };
  }, [card, cover, files]);
  return (
    <motion.div
      className="archive-deck-flight"
      animate={card}
      aria-hidden="true"
      style={
        {
          transformPerspective: 1400,
          "--row-color": color,
          "--flight-color": color,
          "--tab-width": rowTabWidth(row),
        } as CSSProperties
      }
    >
      {!arrived &&
        fileRows
          .filter((item) => item.id !== row.id)
          .map((item, slot) => (
            <motion.div
              key={item.id}
              className="archive-entry-file"
              custom={slot}
              initial={{ y: 0 }}
              animate={files}
              style={
                {
                  visibility: spreading ? "visible" : "hidden",
                  zIndex: slot + 1,
                  "--row-color": item.color,
                  "--tab-width": rowTabWidth(item),
                } as CSSProperties
              }
            >
              <div className="mosby-row">
                <div className="mosby-tabs">
                  {item.keys.map((key) => (
                    <span
                      key={key}
                      className="mosby-tab"
                      style={
                        {
                          "--tab-color": tabColors[key],
                          "--tab-ink":
                            key === "devARContentGroup" ? "#191a18" : "#f8f1e4",
                        } as CSSProperties
                      }
                    >
                      <svg viewBox="0 0 240 40" preserveAspectRatio="none">
                        <path d="M0 40 C24 40 23 0 52 0 H188 C217 0 216 40 240 40 Z" />
                      </svg>
                      <span>{tabNames[key]}</span>
                    </span>
                  ))}
                </div>
              </div>
              <div
                className="archive-entry-file-cover"
                style={{ background: item.color }}
              />
            </motion.div>
          ))}
      <div className="archive-entry-selected">
        {showSource && selection.snapshot && (
          <div
            className="archive-fan-file archive-deck-source"
            style={
              {
                "--fan-color": selection.snapshot.color,
                "--row-color": selection.snapshot.color,
                "--row-height": selection.snapshot.rowHeight,
                "--tab-height": selection.snapshot.tabHeight,
                "--deck-tab-font": selection.snapshot.tabFont,
                "--deck-file-height": `${selection.source.height}px`,
                "--tab-width": rowTabWidth(row),
              } as CSSProperties
            }
            dangerouslySetInnerHTML={{ __html: selection.snapshot.html }}
          />
        )}
        <div className="mosby-row">
          <div className="mosby-tabs">
            {row.keys.map((key) => (
              <span
                key={key}
                className="mosby-tab"
                style={
                  {
                    "--tab-color": tabColors[key],
                    "--tab-ink":
                      key === "devARContentGroup" ? "#191a18" : "#f8f1e4",
                  } as CSSProperties
                }
              >
                <svg viewBox="0 0 240 40" preserveAspectRatio="none">
                  <path d="M0 40 C24 40 23 0 52 0 H188 C217 0 216 40 240 40 Z" />
                </svg>
                <span>{tabNames[key]}</span>
              </span>
            ))}
          </div>
        </div>
        <motion.div
          className="mosby-flight-cover"
          initial={{ rotateX: 0 }}
          animate={cover}
        >
          <div className="mosby-cover-front">
            <div className="mosby-flight-paper" />
          </div>
          <div className="mosby-cover-back" />
        </motion.div>
      </div>
    </motion.div>
  );
}
