import React from 'react';
import ReactDOM from 'react-dom/client';
// 1. BrowserRouter 대신 HashRouter를 불러옵니다.
import { HashRouter, Routes, Route } from 'react-router-dom';

import App from './app/App';
import CardStart from './app/components/CardStart';
import DevArchive from './Dev/DevArchive'; 
import ScrollToTop from './app/components/ScrollToTop'
import GraceSeaCaseStudy from './app/components/GraceSeaCaseStudy';
import WebAnalytics from './app/components/WebAnalytics';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <WebAnalytics />
      <ScrollToTop />
      <Routes>
        <Route path="/gracesea" element={<GraceSeaCaseStudy />} />
        <Route path="/" element={<CardStart />} />
        <Route path="/main" element={<App />} />
        <Route path="/dev-archive" element={<DevArchive />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>,
);
