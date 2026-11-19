import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './styles/index.css';

import App from './app/App';
import CardStart from './app/components/CardStart';
import DevArchive from './Dev/DevArchive';
import ScrollToTop from './app/components/ScrollToTop';
import GraceSeaCaseStudy from './app/components/GraceSeaCaseStudy';
import ChapChewCaseStudy from './app/components/ChapChewCaseStudy';
import WebAnalytics from './app/components/WebAnalytics';
const UnityResume = React.lazy(() => import('./app/components/UnityResume'));
const PortfolioStory = React.lazy(() => import('./app/components/PortfolioStory'));
const FilePortfolio = React.lazy(() => import('./app/components/project-files/FilePortfolio'));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <WebAnalytics />
      <ScrollToTop />
      <Routes>
        <Route path="/resume/unity" element={<React.Suspense fallback={null}><UnityResume /></React.Suspense>} />
        <Route path="/story" element={<React.Suspense fallback={<div style={{ minHeight: '100vh', background: '#242c29', color: '#f3efdf', display: 'grid', placeItems: 'center' }}>작업 이야기 펼치는 중…</div>}><PortfolioStory /></React.Suspense>} />
        <Route path="/gracesea" element={<GraceSeaCaseStudy />} />
        <Route path="/chapchew" element={<ChapChewCaseStudy />} />
        <Route path="/" element={<React.Suspense fallback={<div style={{ minHeight: '100vh', background: '#e9e4dc' }} />}><FilePortfolio /></React.Suspense>} />
        <Route path="/classic" element={<CardStart />} />
        <Route path="/main" element={<App />} />
        <Route path="/dev-archive" element={<DevArchive />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>,
);
