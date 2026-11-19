import { useEffect, useRef, useState } from 'react';
import './UnityResume.css';
import portrait from '../../assets/resume/portrait.jpg';
const KEY = 'yeonsu-unity-resume-v1';
const seed = {
 name:'정연수', role:'Unity 개발자', email:'yeonsu826@gmail.com',
 intro:'사용자의 움직임을 콘텐츠의 반응으로 연결하는 Unity 개발자입니다.\n교육·체험 콘텐츠를 개발하고 현장 설치와 유지보수까지 참여했습니다.\nAR·모션 인식·외부 AI API 연동을 맡을 수 있으며,\n개인 앱 출시와 3D 공간 제작으로 구현 경험을 이어가고 있습니다.',
 career:'이앤오즈 개발팀 / 선임연구원', period:'2024.04–2025.10 · 1년 7개월',
 work:'Unity·C# 기반 교육·체험 콘텐츠 개발 및 기존 콘텐츠 수정. AR·모션 인식·외부 AI API 연동과 체험관 프로그램 설치·세팅·유지보수 수행. 태안·금산·양주·괴산 체험관 프로젝트 참여.',
 taean:'태블릿 카메라로 벽면 마커를 인식하면 해양 생물을 확인하는 AR Walk 앱 개발. MediaPipe 손동작 인식 기반 레이싱 콘텐츠 작업 및 이미지 인식 기반 바다 청소 게임 설계·개발 참여.',
 taeanResult:'카메라·마커·사용자 동작을 콘텐츠 입력으로 연결. 현장 설치·세팅·유지보수에 참여했으며, 관계자 시연과 체험관 구축·납품 완료.',
 geumsan:'주요 콘텐츠 4종 중 AI 다국어 영상편지 프로그램 1종 전체 개발. 한국어 음성 입력을 선택 언어의 영상편지로 만드는 사용자 흐름 구현.',
 geumsanResult:'외부 음성 인식·번역·음성 합성 API를 Unity 프로그램에 연결. 사용자 입력부터 결과물 생성까지 처리 단계를 연동하고, 교육청 대상 시연 및 현장 설치·유지보수 참여.',
 grace:'묵상 기록과 공동 기도를 위한 앱을 직접 제작·출시. 앱과 연결되는 3D 공간을 제작·운영하며, 해당 공간에 사용하는 모델을 모두 직접 제작.',
 graceResult:'기록·묵상·공동 기도 흐름을 앱으로 구성하고 App Store·Google Play에 공개. 앱의 경험을 웹 3D 공간으로 연결하며 모델 제작·배치와 공간 내 결과 확인 수행.',
 craft:'카페·게이밍룸의 소품부터 공간 구성까지 직접 제작. 카페 과제에서는 약 한 달 안에 스타일라이즈드 공간을 완성하고, Unreal Engine 5에서 재질·조명을 적용했습니다.',
 ai:'Codex·Cursor를 개인 프로젝트 기획·구현·디버깅에 활용합니다. 생성된 코드를 검토·수정하고 실행 결과를 확인하며 작업합니다.',
 unity:'Unity · C# — 교육·체험 클라이언트, 마커 기반 AR, MediaPipe 모션 인식 연동, 외부 AI API 연동, 기존 콘텐츠 수정',
 model:'Blender · Substance Painter · Unreal Engine 5 — 소품·공간 모델링, UV 구성, 스타일라이즈드 텍스처, 에셋 배치·재질·조명',
 other:'React Native · Expo · Supabase — 은혜의 바다 공개 프로젝트에 기재된 앱 구성\nArduino — 센서 데이터 활용 하드웨어 제어 및 시리얼 통신 경험',
 school:'명지대학교 컴퓨터공학과\n2021.03–2023.02 · 편입 후 졸업',
 education:'버추얼 플랫폼 테크 전문가 과정\n2025.12.29–2026.07.08',
 certificates:'정보처리산업기사 · 네트워크관리사 2급'
};
type Data=typeof seed;
function valid(x: unknown): x is Data {return !!x && typeof x==='object' && Object.keys(seed).every(k=>typeof (x as Record<string,unknown>)[k]==='string' && (x as Record<string,string>)[k].length<12000);}
export default function UnityResume(){
 const [data,setData]=useState<Data>(()=>{try{const x=JSON.parse(localStorage.getItem(KEY)||'null');return valid(x)?x:seed;}catch{return seed;}});
 const [proof,setProof]=useState(false); const [edit,setEdit]=useState(false),[status,setStatus]=useState('');const file=useRef<HTMLInputElement>(null);
 useEffect(()=>{const before=document.title;document.title='정연수 | Unity 개발자 이력서';return()=>{document.title=before;};},[]);
 const text=(key:keyof Data)=><span className="ur-editable" role={edit?'textbox':undefined} aria-label={edit?key:undefined} contentEditable={edit} suppressContentEditableWarning onBlur={e=>{const value=e.currentTarget.innerText;setData(d=>({...d,[key]:value}));}}>{data[key]}</span>;
 const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(data));setStatus('이 브라우저에 저장했습니다.');}catch{setStatus('브라우저 저장이 불가능합니다. 파일로 백업해 주세요.');}};
 const backup=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='정연수-이력서-문구.json';a.click();URL.revokeObjectURL(url);};
 const restore=async(f?:File)=>{if(!f)return;try{const x=JSON.parse(await f.text());if(!valid(x))throw Error();setData(Object.fromEntries(Object.keys(seed).map(k=>[k,x[k as keyof Data]])) as Data);setStatus('파일을 복원했습니다. 브라우저 저장을 누르면 유지됩니다.');}catch{setStatus('올바른 이력서 백업 파일을 선택해 주세요.');}if(file.current)file.current.value='';};
 const link=(href:string,label:string)=><a href={href} target="_blank" rel="noreferrer">{label} ↗</a>;
 return <main className={`ur-root${proof ? " ur-proof" : ""}`}><nav className="ur-toolbar" aria-label="이력서 도구"><a href="#/main?category=all">포트폴리오로</a><button onClick={()=>setEdit(!edit)}>{edit?'편집 마치기':'문구 편집'}</button><button onClick={save}>브라우저 저장</button><button onClick={backup}>파일 백업</button><button onClick={()=>file.current?.click()}>파일 복원</button><button onClick={()=>setProof(!proof)}>{proof?"일반 화면":"A4 화면 확인"}</button><button onClick={()=>window.print()}>인쇄 / PDF</button><input ref={file} type="file" accept="application/json,.json" hidden onChange={e=>restore(e.target.files?.[0])}/></nav>
 <p className="ur-help">{edit?'점선 영역을 눌러 문구를 수정하세요. 수정 후 저장하거나 파일로 백업하세요.':'지원용 이력서 · 문구 편집과 저장은 이 페이지에서만 적용됩니다.'} <span role="status">{status}</span></p>
 <section className="ur-sheet"><aside className="ur-profile"><p className="ur-kicker">APPLICATION / 01</p><img className="ur-portrait" src={portrait} alt="정연수 증명사진" width={300} height={400} /><h1>{text('name')}</h1><p className="ur-role">{text('role')}</p><p className="ur-target">패러블<br/>테크개발팀 지원</p><div className="ur-contact"><small>CONTACT</small><a href={`mailto:${data.email}`}>{text('email')}</a><small>PORTFOLIO</small>{link('https://yeonsu-portfoilo.vercel.app/','yeonsu-portfoilo.vercel.app')}<small>GITHUB</small>{link('https://github.com/yeonsu826','github.com/yeonsu826')}</div></aside>
 <div className="ur-content"><header><p className="ur-kicker">UNITY CLIENT DEVELOPER</p><h2>사용자의 행동을<br/>작동하는 경험으로.</h2><p className="ur-intro">{text('intro')}</p></header><section className="ur-section"><h3><b>01</b> 개발 경력</h3><h4>{text('career')}</h4><p className="ur-meta">{text('period')}</p><p>{text('work')}</p></section><section className="ur-section"><h3><b>02</b> 대표 프로젝트</h3><article className="ur-project"><div className="ur-project-head"><h4>태안 교육·체험 콘텐츠</h4><span>회사 업무</span></div><p className="ur-meta">2024.09–2025.01 · 이앤오즈</p><p>{text('taean')}</p><p>{text('taeanResult')}</p><p className="ur-tech">Unity · C# · AR · MediaPipe</p>{link('https://yeonsu-portfoilo.vercel.app/#/main?category=Develop','포트폴리오 / 태안 교육청')}</article><article className="ur-project"><div className="ur-project-head"><h4>금산 AI 다국어 영상편지</h4><span>회사 업무</span></div><p className="ur-meta">2025.02–2025.07 · 이앤오즈</p><p>{text('geumsan')}</p><p>{text('geumsanResult')}</p><p className="ur-tech">Unity · C# · 외부 음성 인식·번역·음성 합성 API</p>{link('https://yeonsu-portfoilo.vercel.app/#/main?category=Develop','포트폴리오 / 금산 교육청')}</article></section></div><footer className="ur-folio">JEONG YEON SU <span>UNITY DEVELOPER / 01</span></footer></section>
 <section className="ur-sheet"><aside className="ur-profile"><p className="ur-kicker">EXPERIENCE / 02</p><h2 className="ur-side-title">구현에서<br/>출시까지.</h2><p className="ur-margin-note">개발을 중심에 두고,<br/>직접 만드는 경험을<br/>넓혀갑니다.</p></aside><div className="ur-content"><section className="ur-section ur-first"><h3><b>02</b> 대표 프로젝트 · 계속</h3><article className="ur-project"><div className="ur-project-head"><h4>은혜의 바다 · 앱과 3D 공간</h4><span>개인 프로젝트</span></div><p>{text('grace')}</p><p>{text('graceResult')}</p><p className="ur-tech">React Native · Expo · Supabase (앱)</p><div className="ur-links">{link('https://yeonsu-portfoilo.vercel.app/#/gracesea','프로젝트 소개')}{link('https://gracesea.vercel.app/world/','3D 공간')}{link('https://apps.apple.com/kr/app/id6822101326','App Store')}{link('https://play.google.com/store/apps/details?id=com.gallbug.gracesea','Google Play')}</div></article></section><section className="ur-section"><h3><b>03</b> 개발을 보완하는 제작 경험</h3><h4>3D 소품·공간 제작 <small>학습·제작</small></h4><p>{text('craft')}</p>{link('https://yeonsu-portfoilo.vercel.app/cafe_project/index.html','카페 제작 과정')}<h4 className="ur-subtitle">AI를 활용한 개발 <small>개인 프로젝트</small></h4><p>{text('ai')}</p></section><section className="ur-section"><h3><b>04</b> 기술과 도구</h3><p>{text('unity')}</p><p>{text('model')}</p><p>{text('other')}</p></section><section className="ur-section"><h3><b>05</b> 학력 · 교육 · 자격증</h3><dl className="ur-credentials"><dt>학력</dt><dd>{text('school')}</dd><dt>교육</dt><dd>{text('education')}</dd><dt>자격증</dt><dd>{text('certificates')}</dd></dl></section></div><footer className="ur-folio">JEONG YEON SU <span>UNITY DEVELOPER / 02</span></footer></section></main>;
}
