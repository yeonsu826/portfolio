import { useLayoutEffect, useRef, useState } from 'react';
import { Play, X } from 'lucide-react';
import { useLang } from '../../context/LangContext';
import type { VideoItem } from '../../data/videos';
import previews from '../../data/videoPreviews.json';
import './FileVideoGallery.css';

type Film = { id: string; label: string; href: string; embed: string; ratio: number; poster?: string };

function VideoViewer({ film, onClose }: { film: Film; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const { lang } = useLang();
  useLayoutEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);
  return <dialog ref={dialog} className="archive-video-viewer" aria-label={film.label}
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <header><h2>{film.label}</h2><button onClick={onClose} aria-label={lang === 'ko' ? '영상 닫기' : 'Close video'}><X size={22} /></button></header>
    <div className="archive-video-player" style={{ aspectRatio: film.ratio, width: `min(100%, ${72 * film.ratio}dvh)` }}>
      <iframe src={film.embed} title={film.label} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
    </div>
    <a href={film.href} target="_blank" rel="noreferrer">{lang === 'ko' ? '원본 영상 열기' : 'Open original video'} ↗</a>
  </dialog>;
}

export default function FileVideoGallery({ videos, external = [] }: { videos: VideoItem[]; external?: { url: string; label: string }[] }) {
  const { lang } = useLang();
  const [active, setActive] = useState<Film | null>(null);
  const films: Film[] = videos.map(video => {
    const preview = previews[video.id as keyof typeof previews];
    return { id: video.id, label: preview?.title ?? `Video ${video.id}`, href: `https://vimeo.com/${video.id}`, embed: `https://player.vimeo.com/video/${video.id}?autoplay=1&dnt=1`, ratio: preview ? preview.width / preview.height : 16 / 9, poster: preview?.poster };
  });
  external.forEach(video => {
    const id = video.url.match(/^https:\/\/drive\.google\.com\/file\/d\/([^/]+)/)?.[1];
    if (id) films.push({ id, label: video.label, href: video.url, embed: `https://drive.google.com/file/d/${id}/preview`, ratio: 16 / 9 });
  });
  if (!films.length) return null;
  return <section className="archive-film-section" aria-label={lang === 'ko' ? '영상 작업' : 'Video work'}>
    <header><span className="archive-kicker">MOTION / VIDEO ARCHIVE</span><h3>{lang === 'ko' ? '영상 작업' : 'Video work'}</h3><p>{lang === 'ko' ? '영상을 누르면 크게 볼 수 있습니다.' : 'Select a video to watch it larger.'}</p></header>
    <div className="archive-film-grid">{films.map(film => <button key={film.id} className="archive-film-card" onClick={() => setActive(film)} aria-label={`${film.label} — ${lang === 'ko' ? '영상 재생' : 'Play video'}`}>
      <span className="archive-film-preview">{film.poster && <img src={film.poster} alt="" loading="lazy" />}<span className="archive-film-play"><Play size={22} fill="currentColor" /></span></span>
      <span className="archive-film-label">{film.label}<span>↗</span></span>
    </button>)}</div>
    {active && <VideoViewer film={active} onClose={() => setActive(null)} />}
  </section>;
}
