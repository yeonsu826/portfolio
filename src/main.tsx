import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import "./styles/index.css";

const App = React.lazy(() => import("./app/App"));
const CardStart = React.lazy(() => import("./app/components/CardStart"));
const DevArchive = React.lazy(() => import("./Dev/DevArchive"));
import ScrollToTop from "./app/components/ScrollToTop";
const GraceSeaCaseStudy = React.lazy(
  () => import("./app/components/GraceSeaCaseStudy"),
);
const ChapChewCaseStudy = React.lazy(
  () => import("./app/components/ChapChewCaseStudy"),
);
import WebAnalytics from "./app/components/WebAnalytics";
const UnityResume = React.lazy(() => import("./app/components/UnityResume"));
const PortfolioStory = React.lazy(
  () => import("./app/components/PortfolioStory"),
);
const FilePortfolio = React.lazy(
  () => import("./app/components/project-files/FilePortfolio"),
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <WebAnalytics />
      <ScrollToTop />
      <Routes>
        <Route
          path="/resume/unity"
          element={
            <React.Suspense fallback={null}>
              <UnityResume />
            </React.Suspense>
          }
        />
        <Route
          path="/story"
          element={
            <React.Suspense
              fallback={
                <div
                  style={{
                    minHeight: "100vh",
                    background: "#242c29",
                    color: "#f3efdf",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  작업 이야기 펼치는 중…
                </div>
              }
            >
              <PortfolioStory />
            </React.Suspense>
          }
        />
        <Route
          path="/gracesea"
          element={
            <React.Suspense fallback={null}>
              <GraceSeaCaseStudy />
            </React.Suspense>
          }
        />
        <Route
          path="/chapchew"
          element={
            <React.Suspense fallback={null}>
              <ChapChewCaseStudy />
            </React.Suspense>
          }
        />
        <Route
          path="/"
          element={
            <React.Suspense
              fallback={
                <div style={{ minHeight: "100vh", background: "#e9e4dc" }} />
              }
            >
              <FilePortfolio />
            </React.Suspense>
          }
        />
        <Route
          path="/classic"
          element={
            <React.Suspense fallback={null}>
              <CardStart />
            </React.Suspense>
          }
        />
        <Route
          path="/main"
          element={
            <React.Suspense fallback={null}>
              <App />
            </React.Suspense>
          }
        />
        <Route
          path="/dev-archive"
          element={
            <React.Suspense fallback={null}>
              <DevArchive />
            </React.Suspense>
          }
        />
      </Routes>
    </HashRouter>
  </React.StrictMode>,
);
