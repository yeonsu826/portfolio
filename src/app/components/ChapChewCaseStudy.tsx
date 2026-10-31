import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Expand, ScanFace } from 'lucide-react';
import Lightbox from './Lightbox';
import './ChapChewCaseStudy.css';

const asset = (name: string) => `${import.meta.env.BASE_URL}images/dev/chapchew/${name}.jpg`;
const screens = Array.from({ length: 7 }, (_, index) => asset(`screen-0${index + 1}`));
const setup = [
  { title: '반가워요, ChapChew!', text: '따뜻한 주방과 작은 고양이가 놀이의 시작을 맞이합니다.' },
  { title: '나만의 목표 정하기', text: '한입에 몇 번 씹을지, 직접 목표를 설정합니다.' },
  { title: '내 움직임에 맞추기', text: '얼굴 위치를 맞추고, 한입 동작과 씹기 기준을 차례로 측정합니다.' },
];
const reactions = [
  { label: '눌리고', title: '작은 움직임이,\n첫 번째 반응으로.', text: '씹는 움직임을 인식하면 공의 표면이 움푹 눌립니다. 내가 움직였다는 사실을 숫자보다 먼저 눈으로 확인합니다.', caption: '씹기 동작에 반응하는 왁뿌볼', screen: 3 },
  { label: '갈라지고', title: '오물오물,\n틈이 생기는 순간.', text: '씹기를 이어가면 눌린 곳 주변으로 균열이 드러납니다. 반복되는 동작을 공의 변화를 발견하는 놀이로 연결했습니다.', caption: '씹기를 이어가며 드러나는 균열', screen: 4 },
  { label: '쪼개지고', title: '한입마다,\n새로운 리듬으로.', text: '눌림과 갈라짐이 쌓이며 공의 표면이 달라집니다. 새로운 한입을 인식하면 처음 상태로 돌아와, 다시 쪼개는 놀이를 이어갑니다.', caption: '눌림과 갈라짐이 쌓인 플레이 화면', screen: 5 },
];

function Screen({ index, onOpen, eager = false }: { index: number; onOpen: (index: number) => void; eager?: boolean }) {
  const label = [...setup.map(item => item.title), ...reactions.map(item => item.caption), '오늘의 식사 리포트'][index];
  return <button type="button" className="cc-screen" onClick={() => onOpen(index)} aria-label={`${label} 크게 보기`}><img src={screens[index]} alt={label} width="750" height="1624" loading={eager ? 'eager' : 'lazy'} /><span><Expand size={16} /> 크게 보기</span></button>;
}

export default function ChapChewCaseStudy() {
  const [active, setActive] = useState(0);
  const [gallery, setGallery] = useState<number | null>(null);
  const reaction = reactions[active];
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });

  useEffect(() => {
    const previous = document.title;
    document.title = 'ChapChew — 프로젝트 소개 | 연수';
    return () => { document.title = previous; };
  }, []);

  return <main className="cc-page">
    <nav className="cc-nav" aria-label="프로젝트 메뉴">
      <Link to="/main?category=Solo"><ArrowLeft size={16} /> PORTFOLIO</Link>
      <a className="cc-wordmark" href="#/chapchew" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>ChapChew</a>
      <button type="button" onClick={() => scrollTo('cc-play')}>플레이 살펴보기 <ArrowUpRight size={17} /></button>
    </nav>

    <header className="cc-hero">
      <div className="cc-eyebrow"><span>FACE-TRACKING PLAY</span><span>개인 프로젝트 · 디자인 & 개발</span></div>
      <div className="cc-hero-title"><h1>Chap<span>Chew</span><i aria-hidden="true">✳</i></h1><div><p>오물오물,<br />움직임이 놀이가 되는 시간.</p><button className="cc-round-link" onClick={() => scrollTo('cc-about')} aria-label="ChapChew 소개로 이동"><ArrowDown size={24} /></button></div></div>
      <div className="cc-hero-art"><img src={asset('hero')} alt="따뜻한 주방 속 ChapChew 고양이와 갈라지는 주황색 왁뿌볼" width="2000" height="857" fetchPriority="high" /><span className="cc-art-label">A LITTLE CHEW. A LITTLE CRACK.</span></div>
      <div className="cc-hero-caption"><span>얼굴과 입의 움직임으로 즐기는 인터랙티브 게임</span><span>UNITY / AR FOUNDATION / C#</span></div>
    </header>

    <section id="cc-about" className="cc-about cc-section">
      <div className="cc-kicker">01 / THE IDEA</div>
      <div className="cc-about-body"><h2>따라 하는 캐릭터에서,<br /><span>직접 쪼개는 즐거움으로.</span></h2><div className="cc-about-copy"><p>카메라 앞에서 오물오물. 화면 속 왁뿌볼이 눌리고, 틈이 생기고, 조금씩 갈라집니다. ChapChew는 씹는 움직임을 작은 놀이로 바꾸는 얼굴인식 게임입니다.</p><p>처음에는 사용자의 얼굴 움직임을 캐릭터가 따라 하는 방식이었습니다. 이제는 내가 움직일 때마다 왁뿌볼이 변합니다. 움직임을 보여주는 데서, 변화를 만들어 내는 경험으로 방향을 바꿨습니다.</p></div></div>
      <div className="cc-facts"><div><span>PROJECT</span><p>얼굴 움직임 인터랙티브 게임</p></div><div><span>ROLE</span><p>기획 · UI 디자인 · Unity 개발</p></div><div><span>CORE EXPERIENCE</span><p>씹기 인식 → 왁뿌볼 반응</p></div></div>
    </section>

    <section id="cc-play" className="cc-play">
      <div className="cc-play-top"><span className="cc-kicker">02 / CHEW & CRACK</span><span>작은 움직임, 눈에 보이는 변화.</span></div>
      <div className="cc-play-layout"><div className="cc-play-copy"><span className="cc-giant-number" aria-hidden="true">0{active + 1}<i>✳</i></span><h2>{reaction.title}</h2><p>{reaction.text}</p><div className="cc-reaction-tabs" role="tablist" aria-label="왁뿌볼 플레이 단계">{reactions.map((item, index) => <button key={item.label} id={`cc-reaction-${index}`} role="tab" aria-selected={active === index} aria-controls="cc-reaction-panel" tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (active + (event.key === 'ArrowRight' ? 1 : 2)) % 3;
        setActive(next); document.getElementById(`cc-reaction-${next}`)?.focus();
      }}><span>0{index + 1}</span>{item.label}</button>)}</div><div className="cc-play-note"><ScanFace size={18} /><span>터치 대신, 내 움직임으로 플레이.</span></div></div><div className="cc-play-screen" id="cc-reaction-panel" role="tabpanel" aria-labelledby={`cc-reaction-${active}`}><div className="cc-orbit" aria-hidden="true" /><Screen index={reaction.screen} onOpen={setGallery} eager /><span className="cc-screen-caption">{reaction.caption}</span></div></div>
      <div className="cc-play-marquee" aria-hidden="true">CHEW. CRACK. REPEAT. <span>✳</span> CHEW. CRACK. REPEAT.</div>
    </section>

    <section className="cc-setup cc-section">
      <div className="cc-section-heading"><span className="cc-kicker">03 / READY TO PLAY</span><h2>시작은 가볍게.<br /><span>기준은 나에게 맞게.</span></h2><p>목표를 고르고, 내 움직임을 측정하면 준비 끝.<br />익숙한 주방에서 놀이가 시작됩니다.</p></div>
      <div className="cc-setup-grid">{setup.map((item, index) => <figure key={item.title}><div className={`cc-setup-stage cc-setup-stage-${index}`}><span className="cc-stage-number" aria-hidden="true">0{index + 1}</span><Screen index={index} onOpen={setGallery} /></div><figcaption><span>0{index + 1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></figcaption></figure>)}</div>
    </section>

    <section className="cc-report"><div className="cc-report-art"><Screen index={6} onOpen={setGallery} /><span className="cc-report-stamp" aria-hidden="true">ONE BITE<br /><b>AT A TIME.</b><i>✳</i></span></div><div className="cc-report-copy"><span className="cc-kicker">04 / LOOKING BACK</span><h2>오늘의 오물오물,<br /><span>한눈에 돌아보기.</span></h2><p>놀이를 마치면 한입별 씹기 기록을 확인합니다. 총 횟수뿐 아니라 한입마다 얼마나 씹었는지, 처음과 끝의 흐름은 어땠는지 보여줍니다.</p><ul><li><span>01</span><div><h3>오늘의 기록</h3><p>먹은 한입 수, 총 씹은 횟수, 설정한 목표.</p></div></li><li><span>02</span><div><h3>한입씩, 그래프로</h3><p>목표선과 한입별 기록을 함께 비교합니다.</p></div></li><li><span>03</span><div><h3>흐름을 읽는 한 문장</h3><p>식사 초반과 후반의 차이를 짧은 문장으로.</p></div></li></ul></div></section>

    <section className="cc-design cc-section"><div className="cc-section-heading"><span className="cc-kicker">05 / VISUAL LANGUAGE</span><h2>따뜻한 공간,<br /><span>장난스러운 반응.</span></h2><p>햇살이 드는 주방, 옆을 지키는 작은 고양이,<br />그리고 자꾸 쪼개 보고 싶은 주황색 공.</p></div><div className="cc-design-board"><figure><img src={asset('poster')} alt="ChapChew 캐릭터와 왁뿌볼의 비주얼 콘셉트" width="1400" height="933" loading="lazy" /><figcaption>THE WORLD OF CHAPCHEW</figcaption></figure><div className="cc-palette"><div style={{ background: '#31533B', color: '#FFF9E9' }}><b>Garden green</b><span>#31533B</span></div><div style={{ background: '#E8EF76' }}><b>Playful lime</b><span>#E8EF76</span></div><div style={{ background: '#F37D52' }}><b>Wax orange</b><span>#F37D52</span></div><div style={{ background: '#FFF9E9' }}><b>Kitchen cream</b><span>#FFF9E9</span></div></div></div></section>

    <section className="cc-build cc-section"><div><span className="cc-kicker">06 / BEHIND THE PLAY</span><h2>보이는 반응 뒤의<br /><span>작은 연결들.</span></h2></div><div className="cc-build-items"><article><span>01 / TRACK</span><h3>움직임을 인식하고</h3><p>AR Foundation으로 얼굴 움직임을 추적하고, 개인별 측정값을 기준으로 한입과 씹기 동작을 구분합니다.</p></article><article><span>02 / REACT</span><h3>왁뿌볼에 전달하고</h3><p>씹기 이벤트마다 표면의 눌림과 균열을 표현합니다. 새 한입에는 공을 초기화해 다음 놀이를 준비합니다.</p></article><article><span>03 / RECORD</span><h3>기록으로 이어집니다</h3><p>한입별 카운트를 저장하고, 목표선과 비교한 그래프와 식사 흐름 요약으로 연결합니다.</p></article></div><div className="cc-stack"><span>Unity</span><span>AR Foundation</span><span>C#</span><span>3D Interaction</span></div></section>

    <section className="cc-ending"><span className="cc-kicker">A LITTLE CHEW. A LITTLE CRACK.</span><h2>오물오물.<br />한 번 더, ChapChew<i aria-hidden="true">✳</i></h2><Link to="/main?category=Solo">다른 프로젝트 보기 <ArrowRight size={20} /></Link></section>
    <footer className="cc-footer"><span>CHAPCHEW / PROJECT STORY</span><span>DESIGN & DEVELOPMENT BY 연수</span><button onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>BACK TO TOP ↑</button></footer>
    {gallery !== null && <Lightbox images={screens} index={gallery} onChange={setGallery} onClose={() => setGallery(null)} caption={`ChapChew 앱 화면 ${gallery + 1} / 7`} />}
  </main>;
}
