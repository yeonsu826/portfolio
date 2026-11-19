import { LangProvider } from "./context/LangContext";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import Works, { type ProjectCategory } from "./components/Works";
import VideoGallery from "./components/VideoGallery";
import Credentials from "./components/Credentials";
import About from "./components/About";
import Footer from "./components/Footer";

export default function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedCategory = searchParams.get("category");
  const category: ProjectCategory = requestedCategory === "Develop" || requestedCategory === "Design" || requestedCategory === "Solo" ? requestedCategory : "all";
  const setCategory = (next: ProjectCategory) => {
    setSearchParams({ category: next }, { replace: true });
  };
  useEffect(() => {
    if (!requestedCategory) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById("projects-heading")?.focus({ preventScroll: true });
      document.getElementById("works")?.scrollIntoView({ behavior: "instant", block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [requestedCategory]);
  return (
    <LangProvider>
      <div className="min-h-screen w-full bg-background" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
        <Nav />
        <Hero />
        <Skills />
        <Works mainTab={category} onCategoryChange={setCategory} />
        <VideoGallery />
        <Credentials />
        <About />
        <Footer />
      </div>
    </LangProvider>
  );
}
