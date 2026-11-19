import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, List, X } from 'lucide-react';
import { PORTFOLIO, type PortfolioGroup } from '../data/portfolio';
import { TRANSLATIONS } from '../i18n/translations';
import './PortfolioStory.css';
import StoryBook3D, { type StoryPrint } from './StoryBook3D';

const titles = TRANSLATIONS.ko.groups;
const descriptions = TRANSLATIONS.ko.groupDescriptions;
const stories: Partial<Record<PortfolioGroup['groupKey'], { title: string; note: string; color: string }>> = {
  devPraynoteGroup: { title: '하루의 기록이,\n하나의 바다가 되기까지.', note: '기록을 남기는 화면에서 끝나지 않도록. 말씀과 기도, 휴대폰을 내려놓는 묵상, 함께하는 공동체를 하나의 흐름으로 연결했습니다.', color: '#dcebf0' },
  devPetChewGroup: { title: '작은 움직임을,\n놀이의 시작으로.', note: '얼굴을 따라 하는 캐릭터에서 출발해, 씹는 동작으로 왁뿌볼을 쪼개는 경험으로 발전시켰습니다. 눈에 보이는 반응이 다음 움직임을 이끕니다.', color: '#e6eab8' },
  jinu: { title: '한 캐릭터의 인상을\n입체로 옮기는 일.', note: '얼굴의 인상, 의상의 실루엣, 표면의 질감. 캐릭터를 이루는 요소를 모델링과 텍스처링으로 하나씩 쌓아 올린 작업입니다.', color: '#d9d2e1' },
  glasses: { title: '매일 쓰는 물건을\n다시 바라보다.', note: '익숙한 안경의 형태를 관찰하고, 소재와 빛이 만나는 방식을 렌더로 표현했습니다. 작은 물건에도 설계할 공간은 충분합니다.', color: '#d9e0da' },
  cafe: { title: '들어가 보고 싶은\n공간을 만들다.', note: '가구와 소품을 배치하고, 조명으로 분위기를 더합니다. 모델링한 공간이 언리얼 엔진 안에서 하나의 장면이 되는 과정을 담았습니다.', color: '#ead9c2' },
  gamingroom: { title: '취향이 모이면,\n공간이 된다.', note: '소품 하나에서 방 전체의 구성까지. 스타일라이즈드 형태와 공간의 배치를 통해 하나의 분위기를 만드는 작업입니다.', color: '#cddce0' },
  stage: { title: '시선이 머무는\n무대의 형태.', note: '무대의 구조와 연출을 3D 공간 안에서 살펴봅니다. 공연을 담는 공간을 설계하고, 한 장면으로 시각화했습니다.', color: '#d8d2df' },
  devManittoGroup: { title: '작은 설렘을\n웹으로 연결하다.', note: '마니또를 만들고 공유하는 과정을 웹 서비스로 구현했습니다. 아이디어를 이용자가 직접 경험할 수 있는 형태로 옮긴 프로젝트입니다.', color: '#efd8d3' },
  devAIGameGroup: { title: '아이디어가\n플레이가 되는 순간.', note: 'Unity에서 AI 요소와 게임 플레이를 연결했습니다. 장면을 만드는 것에서 더 나아가, 사용자의 입력에 반응하는 경험을 구현했습니다.', color: '#d2dfd1' },
  devAIVideoletterGroup: { title: '기술을 통해\n마음을 전하는 방식.', note: '영상과 메시지를 하나의 콘텐츠로 연결했습니다. Unity를 바탕으로 영상 편지를 경험하는 흐름을 구현한 프로젝트입니다.', color: '#e5d5ce' },
  devARContentGroup: { title: '현실 위에\n하나의 장면을 더하다.', note: '카메라로 바라보는 현실 공간에 디지털 콘텐츠를 더했습니다. 화면과 실제 환경 사이의 접점을 고민한 모바일 AR 작업입니다.', color: '#cddfe0' },
  devInteractiveRacingGroup: { title: '몸의 움직임이\n게임의 입력으로.', note: '센서에서 들어오는 입력을 Unity의 레이싱 콘텐츠와 연결했습니다. 손끝의 버튼을 넘어 몸으로 경험하는 상호작용을 구현했습니다.', color: '#e5d8bd' },
  devTaeanGroup: { title: '배움의 공간에\n새로운 경험을.', note: '교육 현장에서 사용하는 체험 콘텐츠와 하드웨어를 연결했습니다. 디지털 화면 안의 경험을 실제 공간으로 확장한 작업입니다.', color: '#d5dfca' },
  devGeumsanGroup: { title: '공공 공간에서\n작동하는 인터랙션.', note: '교육 공간에 맞는 디지털 콘텐츠와 운영 환경을 구현했습니다. 콘텐츠를 사용하는 장소까지 함께 생각한 프로젝트입니다.', color: '#dedacb' },
  devWorkGroup: { title: '완성된 장면 뒤에는\n많은 과정이 있습니다.', note: '아이디어에서 모델링, 엔진 안의 구현까지. 결과물 사이에 놓인 시도와 제작의 과정을 모았습니다.', color: '#ddd5c8' },
};

type BookPage = { kind: 'cover' } | { kind: 'project'; group: PortfolioGroup; index: number } | { kind: 'closing' };
const pages: BookPage[] = [{ kind: 'cover' }, ...PORTFOLIO.map((group, index): BookPage => ({ kind: 'project', group, index })), { kind: 'closing' }];
const chapterName = (page: BookPage) => page.kind === 'cover' ? '표지' : page.kind === 'closing' ? '마지막 인사' : titles[page.group.groupKey];
const printedPages: StoryPrint[] = pages.map(page => page.kind === 'project' ? {
  title: stories[page.group.groupKey]?.title ?? titles[page.group.groupKey], subtitle: titles[page.group.groupKey], text: descriptions[page.group.groupKey], note: stories[page.group.groupKey]?.note ?? '', image: page.group.items[0].thumb, color: stories[page.group.groupKey]?.color ?? '#dce2d7', number: String(page.index + 1).padStart(2, '0'),
} : page.kind === 'cover' ? { title: '만들어 온 것들,\n그리고 그 사이의 이야기.', subtitle: 'A COLLECTION OF THINGS I MAKE', text: '화면을 만들고, 공간을 빚고, 움직임을 경험으로 연결합니다.', note: '한 장에 하나의 프로젝트. 종이를 넘기며 15개의 작업을 만나보세요.', color: '#adbd91', number: 'PROLOGUE' } : { title: '함께 만들 다음 이야기를 기다립니다.', subtitle: 'THANK YOU FOR READING', text: '끝까지 살펴봐 주셔서 감사합니다.', note: '더 많은 작업과 연락처는 기존 포트폴리오에서 확인할 수 있습니다.', color: '#c9d1bb', number: 'EPILOGUE' });
const projectRoute = (group: PortfolioGroup) => group.groupKey === 'devPraynoteGroup' ? '/gracesea' : group.groupKey === 'devPetChewGroup' ? '/chapchew' : `/main?category=${group.soloDevelopment ? 'Solo' : group.tools?.includes('Design') ? 'Design' : 'Develop'}`;

function PagePane({ page, side, ghost = false }: { page: BookPage; side: 'left' | 'right'; ghost?: boolean }) {
  if (page.kind === 'cover') {
    if (side === 'left') return <div className="ps-cover-art"><div className="ps-cover-rule"><span>COLLECTED WORKS</span><span>VOL. 01</span></div><div className="ps-cover-mark" aria-hidden="true"><span>Y</span><span>S</span><i>✳</i></div><div className="ps-cover-collage" aria-hidden="true">{PORTFOLIO.slice(0, 3).map((group, index) => <img key={group.groupKey} src={group.items[0].thumb} alt="" style={{ '--photo': index } as CSSProperties} />)}</div><div className="ps-cover-foot">DESIGN. DEVELOP. EXPLORE.</div></div>;
    return <div className="ps-copy ps-cover-copy"><span className="ps-eyebrow">JEONG YEON SU / PORTFOLIO</span><p className="ps-small-title">A collection of things I make.</p><h1>만들어 온 것들,<br /><em>그리고 그 사이의<br />이야기.</em></h1><p>화면을 만들고, 공간을 빚고,<br />움직임을 경험으로 연결합니다.</p><p>한 장에 하나의 프로젝트.<br />천천히 넘기며 만나보세요.</p><div className="ps-signature">연수 <span>DESIGN & DEVELOPMENT</span></div><span className="ps-page-number">PROLOGUE / {PORTFOLIO.length} PROJECTS</span></div>;
  }
  if (page.kind === 'closing') {
    if (side === 'left') return <div className="ps-closing-art"><span className="ps-eyebrow">THE NEXT CHAPTER</span><span className="ps-closing-symbol" aria-hidden="true">✳</span><p>다음 장은,<br /><em>아직 쓰는 중.</em></p><span>KEEP MAKING. KEEP EXPLORING.</span></div>;
    return <div className="ps-copy ps-closing-copy"><span className="ps-eyebrow">THANK YOU FOR READING</span><h2>함께 만들<br /><em>다음 이야기를<br />기다립니다.</em></h2><p>끝까지 살펴봐 주셔서 감사합니다.<br />더 많은 작업과 연락처는 기존 포트폴리오에서 확인할 수 있습니다.</p>{!ghost && <Link className="ps-detail-link" to="/main?category=all">전체 포트폴리오 보기 <ArrowUpRight size={17} /></Link>}<span className="ps-page-number">END OF THIS BOOK, START OF SOMETHING NEW.</span></div>;
  }
  const { group, index } = page;
  const story = stories[group.groupKey];
  if (side === 'left') return <div className="ps-project-art" style={{ '--page-tint': story?.color ?? '#dce2d7' } as CSSProperties}><div className="ps-art-top"><span>PROJECT {String(index + 1).padStart(2, '0')}</span><span>{group.soloDevelopment ? 'INDEPENDENT' : group.tools?.includes('Design') ? 'DESIGN' : 'DEVELOPMENT'}</span></div><span className="ps-art-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div className={`ps-image-mat ${group.groupKey === 'devPraynoteGroup' || group.groupKey === 'devPetChewGroup' ? 'ps-image-app' : ''}`}><img src={group.items[0].thumb} alt={`${titles[group.groupKey]} 대표 이미지`} loading={index < 2 ? 'eager' : 'lazy'} draggable={false} /></div><div className="ps-art-bottom"><span>{titles[group.groupKey]}</span><i aria-hidden="true">↗</i></div></div>;
  return <div className="ps-copy"><span className="ps-eyebrow">{String(index + 1).padStart(2, '0')} / {titles[group.groupKey]}</span><h2>{story?.title ?? titles[group.groupKey]}</h2><p className="ps-lead">{descriptions[group.groupKey]}</p><div className="ps-story-note"><span>BEHIND THE PROJECT</span><p>{story?.note ?? descriptions[group.groupKey]}</p></div><div className="ps-tools">{group.tools?.filter(tool => !['Develop', 'Design'].includes(tool)).map(tool => <span key={tool}>{tool}</span>)}</div>{!ghost && <Link className="ps-detail-link" to={projectRoute(group)}>프로젝트 더 살펴보기 <ArrowUpRight size={17} /></Link>}<span className="ps-page-number">{String(index * 2 + 1).padStart(2, '0')} — {String(index * 2 + 2).padStart(2, '0')} <i>JEONG YEON SU.</i></span></div>;
}

export default function PortfolioStory() {
  const [index, setIndex] = useState(0);
  const [turn, setTurn] = useState<{ from: number; to: number; direction: 'next' | 'prev' } | null>(null);
  const [contentsOpen, setContentsOpen] = useState(false);
  const busy = useRef(false);
  const book = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const contentsButton = useRef<HTMLButtonElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const page = pages[index];

  const go = (target: number) => {
    if (busy.current || target < 0 || target >= pages.length || target === index) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) { busy.current = true; setTurn({ from: index, to: target, direction: target > index ? 'next' : 'prev' }); }
    setIndex(target);
    if (window.matchMedia('(max-width: 760px)').matches) book.current?.scrollIntoView({ behavior: 'instant', block: 'start' });
  };

  useEffect(() => {
    const title = document.title;
    document.title = '만들어 온 것들 — 연수의 포트폴리오 스토리';
    document.body.scrollTo(0, 0);
    window.scrollTo(0, 0);
    return () => { document.title = title; };
  }, []);

  useEffect(() => {
    if (!turn) return;
    const timer = window.setTimeout(() => { setTurn(null); busy.current = false; }, 1950);
    return () => window.clearTimeout(timer);
  }, [turn]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (contentsOpen || event.altKey || event.ctrlKey || event.metaKey || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) return;
      const next = ['ArrowRight', 'PageDown'].includes(event.key) ? index + 1 : ['ArrowLeft', 'PageUp'].includes(event.key) ? index - 1 : event.key === 'Home' ? 0 : event.key === 'End' ? pages.length - 1 : null;
      if (next !== null) { event.preventDefault(); go(next); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  useEffect(() => {
    if (contentsOpen) dialog.current?.showModal();
    else if (dialog.current?.open) dialog.current.close();
  }, [contentsOpen]);

  return <main className="ps-page">
    <header className="ps-header"><Link to="/" className="ps-wordmark">JEONG YEON SU<span>PORTFOLIO / STORY EDITION</span></Link><div><Link to="/main?category=all" className="ps-list-view">기존 포트폴리오 <ArrowUpRight size={15} /></Link><button type="button" ref={contentsButton} className="ps-contents-button" onClick={() => setContentsOpen(true)}><List size={17} /> 목차</button></div></header>
    <div className="ps-intro-line"><span><BookOpen size={14} /> A PORTFOLIO, ONE CHAPTER AT A TIME.</span><span>한 장씩, 천천히.</span></div>
    <div className="ps-book ps-book-3d" ref={book} role="region" aria-label="3D 포트폴리오 이야기 책" onPointerDown={event => { if (event.button === 0) touch.current = { x: event.clientX, y: event.clientY }; }} onPointerCancel={() => { touch.current = null; }} onPointerUp={event => {
      if (!touch.current || event.target instanceof Element && event.target.closest('a,button')) { touch.current = null; return; }
      const dx = event.clientX - touch.current.x; const dy = event.clientY - touch.current.y;
      touch.current = null;
      if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.3) go(index + (dx < 0 ? 1 : -1));
    }}>
      <StoryBook3D current={printedPages[index]} previous={turn ? printedPages[turn.from] : undefined} direction={turn?.direction} />
    </div>
    <nav className="ps-controls" aria-label="이야기 페이지 이동"><button type="button" onClick={() => go(index - 1)} disabled={index === 0 || !!turn} aria-label="이전 장"><ArrowLeft size={19} /><span>이전 장</span></button><div className="ps-reading-status"><span aria-live="polite" aria-atomic="true">{chapterName(page)} <b>{String(index + 1).padStart(2, '0')} <i>/ {String(pages.length).padStart(2, '0')}</i></b></span><div className="ps-progress" aria-hidden="true"><span style={{ width: `${((index + 1) / pages.length) * 100}%` }} /></div></div><button type="button" className="ps-next" onClick={() => go(index + 1)} disabled={index === pages.length - 1 || !!turn} aria-label={index === 0 ? '책 펼치기' : '다음 장'}><span>{index === 0 ? '책 펼치기' : '다음 장'}</span><ArrowRight size={19} /></button></nav>
    <div className="ps-book-links">{page.kind === 'project' && <Link to={projectRoute(page.group)}>이 프로젝트 자세히 보기 <ArrowUpRight size={15} /></Link>}<details className="ps-readable" key={index}><summary>내용 읽기</summary><article className="ps-spread" aria-label={chapterName(page)}><div className="ps-pane ps-left"><PagePane page={page} side="left" /></div><div className="ps-pane ps-right"><PagePane page={page} side="right" /></div></article></details></div>
    <footer className="ps-footer"><span>← → 키 또는 책을 좌우로 밀어 넘겨보세요.</span><span>REAL-TIME 3D / THREE.JS</span></footer>
    <dialog ref={dialog} className="ps-contents" aria-labelledby="ps-contents-title" onCancel={() => setContentsOpen(false)} onClose={() => { setContentsOpen(false); contentsButton.current?.focus(); }} onClick={event => { if (event.target === event.currentTarget) setContentsOpen(false); }}><div className="ps-contents-inner"><div className="ps-contents-heading"><div><span className="ps-eyebrow">TABLE OF CONTENTS</span><h2 id="ps-contents-title">어느 이야기부터<br /><em>펼쳐볼까요?</em></h2></div><button type="button" onClick={() => setContentsOpen(false)} aria-label="목차 닫기"><X size={22} /></button></div><ol>{pages.map((item, chapter) => <li key={chapter}><button type="button" aria-current={index === chapter ? 'page' : undefined} onClick={() => { setContentsOpen(false); go(chapter); }} disabled={!!turn}><span>{String(chapter).padStart(2, '0')}</span>{chapterName(item)}<ArrowUpRight size={16} /></button></li>)}</ol></div></dialog>
  </main>;
}
