import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Pause, Play, X } from "lucide-react";
import { type PortfolioGroup } from "../../data/portfolio";
import { useLang } from "../../context/LangContext";
import { Readme } from "../Readme";
import { projectDescriptions } from "./projectDescriptions";
import { VIMEO_VIDEOS } from "../../data/videos";
import FileVideoGallery from "./FileVideoGallery";
import "./FileProjectExperience.css";

function projectImages(group: PortfolioGroup) {
  const base = import.meta.env.BASE_URL;
  const extra =
    group.groupKey === "devPraynoteGroup"
      ? [
          "project-thumbnail.jpg",
          "app-preview-01.png",
          "app-preview-02.png",
          "world-preview.jpg",
        ].map((file) => `${base}images/dev/gracesea/${file}`)
      : group.groupKey === "devPetChewGroup"
        ? [
            "poster.jpg",
            "hero.jpg",
            ...Array.from({ length: 7 }, (_, i) => `screen-0${i + 1}.jpg`),
          ].map((file) => `${base}images/dev/chapchew/${file}`)
        : [];
  return [
    ...new Set([
      ...extra,
      ...group.items.flatMap((item) =>
        item.galleryImages?.length ? item.galleryImages : [item.thumb],
      ),
    ]),
  ];
}

function ImageViewer({
  images,
  startIndex,
  origin,
  title,
  onClose,
}: {
  images: string[];
  startIndex: number;
  origin: HTMLImageElement;
  title: string;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const animation = useRef<Animation | null>(null);
  const firstImage = useRef(true);
  const revealedImage = useRef<HTMLImageElement | null>(null);
  const closing = useRef(false);
  const [isClosing, setIsClosing] = useState(false);
  const [index, setIndex] = useState(startIndex);
  const { lang } = useLang();
  const move = (step: number) => {
    if (!closing.current)
      setIndex((current) => (current + step + images.length) % images.length);
  };
  function originTransform() {
    const target = image.current?.getBoundingClientRect();
    const source = origin.getBoundingClientRect();
    if (!target?.width || !target.height || !source.width || !source.height)
      return null;
    const matrix = new DOMMatrixReadOnly(
      getComputedStyle(origin.parentElement ?? origin).transform,
    );
    const angle = (Math.atan2(matrix.b, matrix.a) * 180) / Math.PI;
    return `translate(${source.x + source.width / 2 - target.x - target.width / 2}px, ${source.y + source.height / 2 - target.y - target.height / 2}px) rotate(${angle}deg) scale(${origin.offsetWidth / target.width}, ${origin.offsetHeight / target.height})`;
  }
  function reveal() {
    const element = image.current;
    if (!element || closing.current || revealedImage.current === element)
      return;
    revealedImage.current = element;
    animation.current?.cancel();
    const transform = firstImage.current ? originTransform() : null;
    firstImage.current = false;
    animation.current = element.animate(
      transform
        ? [
            { transform, opacity: 1 },
            { transform: "none", opacity: 1 },
          ]
        : [
            { transform: "scale(.97)", opacity: 0 },
            { transform: "none", opacity: 1 },
          ],
      { duration: transform ? 1100 : 260, easing: "cubic-bezier(.4,0,.2,1)" },
    );
  }
  function close() {
    if (closing.current) return;
    closing.current = true;
    animation.current?.cancel();
    if (!image.current) {
      onClose();
      return;
    }
    setIsClosing(true);
    const transform =
      index === startIndex && origin.isConnected ? originTransform() : null;
    animation.current = image.current.animate(
      [
        { transform: "none", opacity: 1 },
        { transform: transform ?? "scale(.94)", opacity: transform ? 1 : 0 },
      ],
      { duration: 650, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" },
    );
    animation.current.onfinish = onClose;
  }
  useLayoutEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousVisibility = origin.style.visibility;
    element?.showModal();
    origin.style.visibility = "hidden";
    return () => {
      animation.current?.cancel();
      firstImage.current = true;
      revealedImage.current = null;
      origin.style.visibility = previousVisibility;
      element?.close();
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);
  useLayoutEffect(() => {
    if (image.current?.complete && image.current.naturalWidth > 0) reveal();
    // Each displayed image owns its entrance animation; loading images start in onLoad.
  }, [index]);
  return (
    <dialog
      ref={dialog}
      className={`archive-image-viewer ${isClosing ? "is-closing" : ""}`}
      aria-label={`${title} — ${lang === "ko" ? "이미지 확대" : "Image viewer"}`}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          move(event.key === "ArrowRight" ? 1 : -1);
        }
      }}
    >
      <button
        className="archive-viewer-close"
        onClick={close}
        aria-label={lang === "ko" ? "확대 이미지 닫기" : "Close image"}
      >
        <X size={18} />
      </button>
      <figure>
        <img
          ref={image}
          key={images[index]}
          src={images[index]}
          onLoad={() => {
            if (!image.current?.getAnimations().length) reveal();
          }}
          alt={`${title} — ${index + 1}`}
        />
        <figcaption>
          <span>{title}</span>
          <span>
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(images.length).padStart(2, "0")}
          </span>
          <small>
            {lang === "ko"
              ? "정연수 · 프로젝트 아카이브"
              : "Jeong Yeon Su · Project archive"}
          </small>
        </figcaption>
      </figure>
      {images.length > 1 && (
        <div className="archive-viewer-navigation">
          <button onClick={() => move(-1)} aria-label="Previous image">
            <ArrowLeft size={20} />
          </button>
          <span>
            {lang === "ko"
              ? "← → 이미지 이동 · ESC 닫기"
              : "← → Navigate · ESC Close"}
          </span>
          <button onClick={() => move(1)} aria-label="Next image">
            <ArrowRight size={20} />
          </button>
        </div>
      )}
    </dialog>
  );
}

type Position = { x: number; y: number; z: number };

function DraggablePhoto({
  src,
  index,
  title,
  boardHeight,
  onOpen,
}: {
  src: string;
  index: number;
  title: string;
  boardHeight: number;
  onOpen: (image: HTMLImageElement) => void;
}) {
  const [position, setPosition] = useState<Position>(() => ({
    x: [0.72, 0.12, 0.65][index % 3],
    y: Math.floor(index / 3) * 300 + [170, 285, 355][index % 3],
    z: index + 1,
  }));
  const [dragging, setDragging] = useState(false);
  const [angle] = useState(() => Math.random() * 20 - 10);
  const [size] = useState(() => 0.75 + Math.random() * 0.45);
  const [aspectRatio, setAspectRatio] = useState(1);
  const photo = useRef<HTMLButtonElement>(null);
  const [bounds, setBounds] = useState({ width: 0, height: 0, boardWidth: 0 });
  useLayoutEffect(() => {
    const element = photo.current;
    if (!element?.parentElement) return;
    const measure = () =>
      setBounds((previous) => {
        const next = {
          width: element.offsetWidth,
          height: element.offsetHeight,
          boardWidth: element.parentElement!.clientWidth,
        };
        return previous.width === next.width &&
          previous.height === next.height &&
          previous.boardWidth === next.boardWidth
          ? previous
          : next;
      });
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    observer.observe(element.parentElement);
    measure();
    return () => observer.disconnect();
  }, []);
  // Include the white border and tilted corners in the paper-height limit.
  const radians = (Math.abs(angle) * Math.PI) / 180;
  const heightPerWidth = Math.sin(radians) + Math.cos(radians) / aspectRatio;
  const borderHeight = 8 * Math.cos(radians) * (1 - 1 / aspectRatio);
  const widthLimit = `calc(var(--archive-board-paper-height) / ${heightPerWidth} ${borderHeight >= 0 ? "-" : "+"} ${Math.abs(borderHeight / heightPerWidth)}px)`;
  const widthPerWidth = Math.cos(radians) + Math.sin(radians) / aspectRatio;
  const borderWidth = 8 * Math.sin(radians) * (1 - 1 / aspectRatio);
  const boardWidthLimit = bounds.boardWidth
    ? Math.max(1, (bounds.boardWidth - 12 - borderWidth) / widthPerWidth)
    : 10000;
  const insetX =
    Math.max(
      0,
      (bounds.width * Math.cos(radians) +
        bounds.height * Math.sin(radians) -
        bounds.width) /
        2,
    ) + 6;
  const insetY =
    Math.max(
      0,
      (bounds.width * Math.sin(radians) +
        bounds.height * Math.cos(radians) -
        bounds.height) /
        2,
    ) + 6;
  const gesture = useRef<{
    pointer: number;
    startX: number;
    startY: number;
    position: Position;
    width: number;
    height: number;
  } | null>(null);
  const moved = useRef(false);
  const { lang } = useLang();
  const clamp = (n: number, max: number, min = 0) =>
    Math.max(min, Math.min(max, n));
  function start(event: PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0 || !event.isPrimary) return;
    const element = event.currentTarget;
    element.setPointerCapture(event.pointerId);
    moved.current = false;
    gesture.current = {
      pointer: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      position,
      width: Math.max(
        1,
        (element.parentElement?.clientWidth ?? 1) -
          element.offsetWidth -
          2 * insetX,
      ),
      height: Math.max(0, boardHeight - element.offsetHeight - insetY),
    };
    setDragging(true);
    setPosition((previous) => ({ ...previous, z: Date.now() % 1000000000 }));
  }
  function drag(event: PointerEvent<HTMLButtonElement>) {
    const start = gesture.current;
    if (!start || start.pointer !== event.pointerId) return;
    const dx = event.clientX - start.startX;
    const dy = event.clientY - start.startY;
    if (Math.hypot(dx, dy) > 5) moved.current = true;
    if (!moved.current) return;
    setPosition((previous) => ({
      x: clamp(start.position.x + dx / start.width, 1),
      y: clamp(start.position.y + dy, start.height, insetY),
      z: previous.z,
    }));
  }
  function end(event: PointerEvent<HTMLButtonElement>) {
    if (gesture.current?.pointer !== event.pointerId) return;
    gesture.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  }
  return (
    <button
      ref={photo}
      className={`archive-photo ${dragging ? "is-dragging" : ""}`}
      style={
        {
          "--photo-x": position.x,
          "--photo-inset-x": `${insetX}px`,
          "--photo-y": `${clamp(position.y, boardHeight - bounds.height - insetY, insetY)}px`,
          "--photo-angle": `${angle}deg`,
          "--photo-width": `min(90%, calc(var(--card-width) * ${size}), ${widthLimit}, ${boardWidthLimit}px)`,
          zIndex: position.z,
        } as CSSProperties
      }
      onPointerDown={start}
      onPointerMove={drag}
      onPointerUp={end}
      onPointerCancel={end}
      onLostPointerCapture={() => {
        gesture.current = null;
        setDragging(false);
      }}
      onClick={(event) => {
        const image = event.currentTarget.querySelector("img");
        if (!moved.current && image) onOpen(image);
        moved.current = false;
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") moved.current = false;
        if (
          !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(
            event.key,
          )
        )
          return;
        event.preventDefault();
        const element = event.currentTarget;
        const width = Math.max(
          1,
          (element.parentElement?.clientWidth ?? 1) -
            element.offsetWidth -
            2 * insetX,
        );
        const step = event.shiftKey ? 30 : 10;
        setPosition((previous) => ({
          ...previous,
          x: clamp(
            previous.x +
              (event.key === "ArrowLeft"
                ? -step / width
                : event.key === "ArrowRight"
                  ? step / width
                  : 0),
            1,
          ),
          y: clamp(
            previous.y +
              (event.key === "ArrowUp"
                ? -step
                : event.key === "ArrowDown"
                  ? step
                  : 0),
            Math.max(0, boardHeight - element.offsetHeight - insetY),
            insetY,
          ),
        }));
      }}
      aria-label={`${title} — ${index + 1}. ${lang === "ko" ? "드래그로 이동, 클릭으로 확대. 방향키로 위치 이동." : "Drag to move, click to enlarge. Arrow keys reposition."}`}
    >
      <img
        src={src}
        alt={`${title} — ${index + 1}`}
        loading="lazy"
        draggable={false}
        onLoad={(event) => {
          const image = event.currentTarget;
          if (image.naturalWidth && image.naturalHeight)
            setAspectRatio(image.naturalWidth / image.naturalHeight);
        }}
      />
    </button>
  );
}

export default function FileProjectExperience({
  group,
}: {
  group: PortfolioGroup;
}) {
  const { t, lang } = useLang();
  const [images] = useState(() => projectImages(group));
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [viewer, setViewer] = useState<{
    index: number;
    origin: HTMLImageElement;
  } | null>(null);

  const title = t.groups[group.groupKey];
  const description =
    projectDescriptions[group.groupKey]?.[lang === "ko" ? "ko" : "en"];
  const descriptionPaper = useRef<HTMLDivElement>(null);
  const [paperHeight, setPaperHeight] = useState(470);
  useLayoutEffect(() => {
    const paper = descriptionPaper.current;
    if (!paper) return;
    const observer = new ResizeObserver(() =>
      setPaperHeight(paper.offsetHeight),
    );
    observer.observe(paper);
    return () => observer.disconnect();
  }, []);
  const videos = group.items.flatMap((item) => item.videos ?? []);
  const boardHeight = Math.max(
    850,
    Math.ceil(images.length / 3) * 300 + 550,
    paperHeight + 120,
  );
  useEffect(() => {
    if (paused || hovering || viewer !== null || images.length < 2) return;
    const timer = window.setInterval(() => {
      if (!document.hidden)
        setSlide((current) => (current + 1) % images.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [paused, hovering, viewer, images.length]);
  const caseStudy =
    group.groupKey === "devPraynoteGroup"
      ? "/gracesea"
      : group.groupKey === "devPetChewGroup"
        ? "/chapchew"
        : null;
  return (
    <article className="project-experience">
      <section
        className="archive-editorial"
        aria-label={lang === "ko" ? "프로젝트 소개" : "Project overview"}
      >
        <div className="archive-editorial-visual">
          <span className="archive-kicker">
            PROJECT FILE / {String(images.length).padStart(2, "0")} IMAGES
          </span>
          <h2>{title}</h2>
          <div
            className="archive-slideshow"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            onFocusCapture={() => setHovering(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget))
                setHovering(false);
            }}
            aria-roledescription="carousel"
            aria-label={
              lang === "ko"
                ? "자동 이미지 슬라이드"
                : "Automatic image slideshow"
            }
          >
            <button
              className="archive-slide-image"
              onClick={(event) => {
                const origin = event.currentTarget.querySelector("img");
                if (origin) setViewer({ index: slide, origin });
              }}
              aria-label={`${title} ${slide + 1} — ${t.viewLarge}`}
            >
              <img
                key={images[slide]}
                src={images[slide]}
                alt={`${title} — ${slide + 1}`}
                draggable={false}
              />
            </button>
            <div className="archive-slide-controls">
              <button
                onClick={() =>
                  setSlide(
                    (current) => (current + images.length - 1) % images.length,
                  )
                }
                aria-label="Previous slide"
                disabled={images.length < 2}
              >
                <ArrowLeft size={16} />
              </button>
              <span aria-live={paused || hovering ? "polite" : "off"}>
                {String(slide + 1).padStart(2, "0")} /{" "}
                {String(images.length).padStart(2, "0")}
              </span>
              <button
                onClick={() =>
                  setSlide((current) => (current + 1) % images.length)
                }
                aria-label="Next slide"
                disabled={images.length < 2}
              >
                <ArrowRight size={16} />
              </button>
              {images.length > 1 && (
                <button
                  onClick={() => setPaused((value) => !value)}
                  aria-label={paused ? "Play slideshow" : "Pause slideshow"}
                >
                  {paused ? <Play size={14} /> : <Pause size={14} />}
                </button>
              )}
            </div>
          </div>
          <p className="archive-image-credit">
            {title}
            <br />
            Jeong Yeon Su / Portfolio Archive
          </p>
        </div>
        <div className="archive-editorial-copy">
          <span className="archive-kicker">DESIGN NOTES</span>
          <p className="archive-project-lead">
            {t.groupDescriptions[group.groupKey]}
          </p>
          <dl>
            <dt>{lang === "ko" ? "분야" : "Field"}</dt>
            <dd>
              {group.soloDevelopment
                ? lang === "ko"
                  ? "1인 기획 · 디자인 · 개발"
                  : "Independent planning, design & development"
                : group.tools?.includes("Develop")
                  ? "Interactive Development"
                  : "3D & Visual Design"}
            </dd>
            <dt>{lang === "ko" ? "사용 도구" : "Tools"}</dt>
            <dd>
              {group.tools
                ?.filter((tool) => tool !== "Design" && tool !== "Develop")
                .join(" · ")}
            </dd>
          </dl>
          {caseStudy && (
            <Link className="archive-editorial-link" to={caseStudy}>
              {lang === "ko" ? "전체 프로젝트 소개" : "Full case study"} ↗
            </Link>
          )}
          {group.items
            .filter((item) => item.link)
            .map((item) => (
              <a
                key={item.id}
                className="archive-editorial-link"
                href={item.link}
                target="_blank"
                rel="noreferrer"
              >
                {item.linkLabel === "github"
                  ? "GitHub"
                  : item.linkLabel === "play"
                    ? "Play"
                    : item.linkLabel === "video"
                      ? "Video"
                      : item.linkLabel === "site"
                        ? "Website"
                        : "Process"}{" "}
                ↗
              </a>
            ))}
          <p className="archive-editorial-signature">
            Jeong Yeon Su<span>Designer & Developer</span>
          </p>
        </div>
      </section>
      {group.readme && !description && (
        <details className="archive-project-notes">
          <summary>
            {lang === "ko" ? "기획과 제작 과정 읽기" : "Read the project notes"}{" "}
            ↗
          </summary>
          <div>
            <Readme text={group.readme} images={images} videos={videos} />
          </div>
        </details>
      )}
      <section
        className="archive-pinboard-section"
        aria-labelledby={`pinboard-${group.groupKey}`}
      >
        <header>
          <div>
            <span className="archive-kicker">
              VISUAL RESEARCH / CONTACT SHEETS
            </span>
            <h3 id={`pinboard-${group.groupKey}`}>
              {lang === "ko" ? "프로젝트 설명" : "Project description"}
            </h3>
          </div>
          <p>
            {lang === "ko" ? (
              <>
                이미지를 드래그해 자유롭게 펼쳐보세요.
                <br />
                클릭하면 크게 볼 수 있습니다.
              </>
            ) : (
              <>
                Drag the images to rearrange.
                <br />
                Click any image to look closer.
              </>
            )}
          </p>
        </header>
        <div className="archive-pinboard" style={{ height: boardHeight }}>
          <div
            ref={descriptionPaper}
            className={`archive-board-paper ${description ? "is-detailed" : ""}`}
            aria-hidden={description ? undefined : true}
          >
            <span>{title}</span>
            {(description ?? [t.groupDescriptions[group.groupKey]]).map(
              (paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ),
            )}
            <small>COLLECTED MATERIAL / JEONG YEON SU</small>
          </div>
          {images.map((src, index) => (
            <DraggablePhoto
              key={src}
              src={src}
              index={index}
              title={title}
              boardHeight={boardHeight}
              onOpen={(origin) => setViewer({ index, origin })}
            />
          ))}
        </div>
      </section>
      <FileVideoGallery
        videos={VIMEO_VIDEOS.filter(
          (video) => video.groupKey === group.groupKey,
        )}
        external={group.items
          .filter((item) => item.linkLabel === "video" && item.link)
          .map((item) => ({
            url: item.link!,
            label: `${title} — ${lang === "ko" ? "프로젝트 영상" : "Project video"}`,
          }))}
      />
      {videos.length > 0 && (
        <section
          className="archive-project-videos"
          aria-label={lang === "ko" ? "프로젝트 영상" : "Project videos"}
        >
          {videos.map((video) => (
            <figure key={video.src}>
              <video
                controls
                playsInline
                preload="none"
                aria-label={video.label}
              >
                <source src={video.src} type="video/mp4" />
              </video>
              <figcaption>{video.label}</figcaption>
            </figure>
          ))}
        </section>
      )}
      {viewer !== null && (
        <ImageViewer
          images={images}
          startIndex={viewer.index}
          origin={viewer.origin}
          title={title}
          onClose={() => setViewer(null)}
        />
      )}
    </article>
  );
}
