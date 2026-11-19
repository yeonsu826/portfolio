import { Link, useNavigate } from "react-router-dom";
import { LangProvider } from "../context/LangContext";
import CardIntro from "./CardIntro";

export default function CardStart() {
  const navigate = useNavigate();
  return (
    <LangProvider>
      <main style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
        <div className="absolute left-6 top-8 z-10 font-['Fraunces'] text-lg text-[#eee9d9] sm:left-12">
          JEONG YEON SU.
        </div>
        <Link to="/story" className="absolute right-6 top-8 z-10 rounded-full border border-[#eee9d9]/30 px-4 py-2 text-sm text-[#eee9d9] transition-colors hover:bg-[#eee9d9]/10 sm:right-12">스토리로 보기 ↗</Link>
        <CardIntro onChoose={(category) => navigate(`/main?category=${category}`)} />
      </main>
    </LangProvider>
  );
}
