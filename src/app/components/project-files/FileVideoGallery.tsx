import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play, X } from "lucide-react";
import { useLang } from "../../context/LangContext";
import type { VideoItem } from "../../data/videos";
import previews from "../../data/videoPreviews.json";
import type { VideoCollection } from "./videoCollections";
import "./FileVideoGallery.css";

type Film = {
  id: string;
  label: string;
  href: string;
  embed: string;
  ratio: number;
  poster?: string;
  preview?: string;
  tools?: string[];
};

function VideoViewer({ film, onClose }: { film: Film; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const { lang } = useLang();
  useLayoutEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);
  return (
    <dialog
      ref={dialog}
      className="archive-video-viewer"
      aria-label={film.label}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <header>
        <h2>{film.label}</h2>
        <button
          onClick={onClose}
          aria-label={lang === "ko" ? "영상 닫기" : "Close video"}
        >
          <X size={22} />
        </button>
      </header>
      <div
        className="archive-video-player"
        style={{
          aspectRatio: film.ratio,
          width: `min(100%, ${60 * film.ratio}dvh, calc((86dvh - 160px) * ${film.ratio}))`,
        }}
      >
        <iframe
          src={film.embed}
          title={film.label}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
      <a href={film.href} target="_blank" rel="noreferrer">
        {lang === "ko" ? "원본 영상 열기" : "Open original video"} ↗
      </a>
    </dialog>
  );
}

export default function FileVideoGallery({
  videos,
  external = [],
  panel = false,
  collection,
}: {
  videos: VideoItem[];
  external?: { url: string; label: string }[];
  panel?: boolean;
  collection?: VideoCollection;
}) {
  const { lang } = useLang();
  const [active, setActive] = useState<Film | null>(null);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const films: Film[] = videos.map((video) => {
    const preview = previews[video.id as keyof typeof previews];
    return {
      id: video.id,
      label:
        collection?.clips.find((clip) => clip.id === video.id)?.title ??
        preview?.title ??
        `Video ${video.id}`,
      href: `https://vimeo.com/${video.id}`,
      embed: `https://player.vimeo.com/video/${video.id}?autoplay=1&dnt=1`,
      preview: `https://player.vimeo.com/video/${video.id}?background=1&autoplay=1&loop=1&muted=1&dnt=1`,
      ratio: preview ? preview.width / preview.height : 16 / 9,
      poster: preview?.poster,
      tools: video.tools,
    };
  });
  external.forEach((video) => {
    const id = video.url.match(
      /^https:\/\/drive\.google\.com\/file\/d\/([^/]+)/,
    )?.[1];
    if (id)
      films.push({
        id,
        label: video.label,
        href: video.url,
        embed: `https://drive.google.com/file/d/${id}/preview`,
        ratio: 16 / 9,
      });
  });
  useEffect(() => {
    if (!panel || films.length < 2 || active || paused || hovering) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setSlide((current) => (current + 1) % films.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [panel, films.length, active, paused, hovering]);
  if (!films.length) return null;
  if (panel) {
    const film = films[slide % films.length];
    const notes = collection?.clips.find(
      (clip) => clip.id === film.id,
    )?.description;
    return (
      <section
        className="archive-editorial archive-video-editorial is-project-video"
        aria-label={
          lang === "ko" ? "영상 프로젝트 소개" : "Video project overview"
        }
      >
        <div className="archive-editorial-visual">
          <span className="archive-kicker">
            VIDEO FILE / {films.length} VIDEOS
          </span>
          <h2>
            {collection?.title[lang === "ko" ? "ko" : "en"] ??
              (lang === "ko" ? "영상 작업" : "Video work")}
          </h2>
          <div
            className="archive-slideshow"
            aria-roledescription="carousel"
            aria-label={lang === "ko" ? "영상 슬라이드" : "Video slideshow"}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            onFocusCapture={() => setHovering(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget))
                setHovering(false);
            }}
          >
            <button
              className="archive-video-slide"
              style={{
                width: `min(100%, ${280 * film.ratio}px, ${38 * film.ratio}dvh)`,
              }}
              onClick={() => setActive(film)}
              aria-label={`${film.label} — ${lang === "ko" ? "영상 재생" : "Play video"}`}
            >
              <span
                className="archive-film-preview"
                style={{ aspectRatio: film.ratio }}
              >
                {film.poster && <img src={film.poster} alt="" />}
                {film.preview && (
                  <iframe
                    key={film.id}
                    src={film.preview}
                    title={`${film.label} — ${lang === "ko" ? "미리보기" : "Preview"}`}
                    tabIndex={-1}
                    allow="autoplay"
                    aria-hidden="true"
                  />
                )}
              </span>
            </button>
            <div className="archive-slide-controls">
              <button
                onClick={() =>
                  setSlide(
                    (current) => (current + films.length - 1) % films.length,
                  )
                }
                aria-label={lang === "ko" ? "이전 영상" : "Previous video"}
                disabled={films.length < 2}
              >
                <ArrowLeft size={16} />
              </button>
              <span>
                {String(slide + 1).padStart(2, "0")} /{" "}
                {String(films.length).padStart(2, "0")}
              </span>
              <button
                onClick={() =>
                  setSlide((current) => (current + 1) % films.length)
                }
                aria-label={lang === "ko" ? "다음 영상" : "Next video"}
                disabled={films.length < 2}
              >
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => setPaused((value) => !value)}
                aria-label={paused ? "Play slideshow" : "Pause slideshow"}
              >
                {paused ? <Play size={14} /> : <Pause size={14} />}
              </button>
            </div>
          </div>
          <p className="archive-image-credit">
            {film.label}
            <br />
            Jeong Yeon Su / Video Archive
          </p>
        </div>
        <div className="archive-editorial-copy">
          <span className="archive-kicker">PROJECT NOTES</span>
          <h3 className="archive-video-title">{film.label}</h3>
          <p className="archive-project-lead">
            {notes?.[lang === "ko" ? "ko" : "en"]}
          </p>
          <dl>
            <dt>{lang === "ko" ? "사용 도구" : "Tools"}</dt>
            <dd>{film.tools?.join(" · ")}</dd>
          </dl>
          <a
            className="archive-editorial-link"
            href={film.href}
            target="_blank"
            rel="noreferrer"
          >
            {lang === "ko" ? "원본 영상 열기" : "Open original video"} ↗
          </a>
          <p className="archive-editorial-signature">
            Jeong Yeon Su<span>Designer & Developer</span>
          </p>
        </div>
        {active && (
          <VideoViewer film={active} onClose={() => setActive(null)} />
        )}
      </section>
    );
  }
  return (
    <section
      className={`archive-film-section ${panel ? "is-project-video" : ""}`}
      aria-label={lang === "ko" ? "영상 작업" : "Video work"}
    >
      <header>
        <span className="archive-kicker">MOTION / VIDEO ARCHIVE</span>
        <h3>{lang === "ko" ? "영상 작업" : "Video work"}</h3>
        <p>
          {lang === "ko"
            ? "영상을 누르면 크게 볼 수 있습니다."
            : "Select a video to watch it larger."}
        </p>
      </header>
      <div className="archive-film-grid">
        {films.map((film) => (
          <button
            key={film.id}
            className="archive-film-card"
            style={
              panel
                ? {
                    width: `min(100%, ${320 * film.ratio}px, ${42 * film.ratio}dvh)`,
                  }
                : undefined
            }
            onClick={() => setActive(film)}
            aria-label={`${film.label} — ${lang === "ko" ? "영상 재생" : "Play video"}`}
          >
            <span
              className="archive-film-preview"
              style={panel ? { aspectRatio: film.ratio } : undefined}
            >
              {film.poster && <img src={film.poster} alt="" loading="lazy" />}
              {panel && film.preview && (
                <iframe
                  src={film.preview}
                  title={`${film.label} — ${lang === "ko" ? "미리보기" : "Preview"}`}
                  tabIndex={-1}
                  allow="autoplay"
                  aria-hidden="true"
                />
              )}
            </span>
            <span className="archive-film-label">
              {film.label}
              <span>↗</span>
            </span>
          </button>
        ))}
      </div>
      {active && <VideoViewer film={active} onClose={() => setActive(null)} />}
    </section>
  );
}
