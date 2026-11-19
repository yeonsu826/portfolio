import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowDown, ArrowUpRight, Box, Code2, Grid2X2, Sparkles } from "lucide-react";
import { useLang } from "../context/LangContext";
import type { ProjectCategory } from "./Works";
import "./CardIntro.css";

const cards = [
  { id: "all", name: "All Works", icon: Grid2X2, caption: "A little bit of everything", color: "#373a32" },
  { id: "Develop", name: "Develop", icon: Code2, caption: "Ideas, brought to life", color: "#303c40" },
  { id: "Design", name: "Design", icon: Box, caption: "Shape a different perspective", color: "#4a3934" },
  { id: "Solo", name: "Indie", icon: Sparkles, caption: "Made from my own curiosity", color: "#4a412e" },
] as const;

export default function CardIntro({ onChoose }: { onChoose: (category: ProjectCategory) => void }) {
  const { lang, t } = useLang();
  const [picked, setPicked] = useState<ProjectCategory | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const picking = useRef(false);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const labels = { all: t.categoryAll, Develop: t.categoryDevelop, Design: t.categoryDesign, Solo: t.categorySolo };
  const choose = (category: ProjectCategory) => {
    if (picking.current) return;
    picking.current = true;
    setPicked(category);
    timer.current = setTimeout(() => onChoose(category), window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 550);
  };

  return (
    <section id="hero" className={`card-intro ${picked ? "is-picking" : ""}`} aria-labelledby="card-intro-title">
      <svg className="card-intro-pattern" width="100%" height="100%" aria-hidden="true">
        <defs>
          <pattern id="portfolio-pattern" width="360" height="300" patternUnits="userSpaceOnUse" patternTransform="rotate(-15)">
            <g fill="none" stroke="currentColor" strokeWidth="1.3">
              <path d="m65 32 31 18v36L65 104 34 86V50Zm0 36 31-18M65 68 34 50m31 18v36" />
              <rect x="220" y="125" width="55" height="78" rx="9" transform="rotate(25 248 164)" />
              <path d="m137 205-17 17 17 17m42-34 17 17-17 17m-19-40-10 46" />
              <path d="m280 32 5 17 17 5-17 5-5 17-5-17-17-5 17-5Z" />
              <circle cx="42" cy="230" r="20" /><ellipse cx="42" cy="230" rx="9" ry="20" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#portfolio-pattern)" />
      </svg>
      <div className="card-intro-topline"><span>PORTFOLIO / SELECTED WORKS</span></div>
      <div className="card-stage">
        <div className="card-hand" role="group" aria-label={lang === "ko" ? "프로젝트 카드 선택" : "Choose a project card"}>
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <button key={card.id} type="button" className={`portfolio-card ${picked === card.id ? "is-chosen" : ""}`} style={{ "--card-index": index, "--card-color": card.color } as CSSProperties} onClick={() => choose(card.id)} aria-label={`${card.name} — ${labels[card.id]}`} disabled={picked !== null}>
                <span className="card-corner">0{index + 1}<ArrowUpRight size={20} /></span>
                <span className="card-name">{card.name}</span>
                <span className="card-emblem"><Icon strokeWidth={1.1} /></span>
                <span className="card-arc" />
                <span className="card-footer"><span className="card-category">{labels[card.id]}</span><span className="card-caption">{card.caption}</span></span>
                <span className="card-bottom-suit">✦</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="card-intro-copy">
        <p className="card-intro-eyebrow">FOUR CARDS. ENDLESS POSSIBILITIES.</p>
        <h1 id="card-intro-title">Pick your <em>perspective.</em></h1>
        {picked && <p className="card-intro-description" aria-live="polite">{lang === "ko" ? `${labels[picked]} 펼치는 중…` : `Opening ${labels[picked]}…`}</p>}
      </div>
      <button type="button" className="card-intro-skip" onClick={() => choose("all")} disabled={picked !== null}>{lang === "ko" ? "전체 작업 둘러보기" : "Explore all projects"}<ArrowDown size={14} /></button>
      <span className="card-intro-edition">DESIGN · DEVELOP · EXPLORE</span>
    </section>
  );
}
