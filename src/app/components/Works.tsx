import { useEffect, useState } from "react";
import { ArrowUpRight, Box, Check, Code2, Grid2X2, Images, UserRound } from "lucide-react";
import { useLang } from "../context/LangContext";
import { PORTFOLIO } from "../data/portfolio";
import Lightbox from "./Lightbox";
import LoadingImage from "./LoadingImage";
import ToolTags from "./ToolTags";
import ProjectDetails from "./ProjectDetails";
import { Link } from "react-router-dom";

export type ProjectCategory = "all" | "Solo" | "Design" | "Develop";

export default function Works({ mainTab, onCategoryChange }: {
  mainTab: ProjectCategory;
  onCategoryChange: (category: ProjectCategory) => void;
}) {
  const [activeGroup, setActiveGroup] = useState<"all" | (typeof PORTFOLIO)[number]["groupKey"]>("all");
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);
  const { t, lang } = useLang();
  const developmentGroups = PORTFOLIO.filter((group) =>
    group.tools?.includes("Develop") && (
      !group.soloDevelopment ||
      group.groupKey === "devPraynoteGroup" ||
      group.groupKey === "devPetChewGroup"
    )
  );

  const filteredByMainTab = PORTFOLIO.filter((group) => {
    if (mainTab === "all") return true;
    if (mainTab === "Solo") return group.soloDevelopment;
    if (mainTab === "Develop") return developmentGroups.includes(group);
    return group.tools?.includes(mainTab);
  });

  const displayGroups =
    activeGroup === "all"
      ? filteredByMainTab
      : filteredByMainTab.filter((group) => group.groupKey === activeGroup);

  const mainTabs = [
    { id: "all" as const, label: t.categoryAll, icon: Grid2X2, count: PORTFOLIO.length },
    {
      id: "Solo" as const,
      label: t.categorySolo,
      icon: UserRound,
      count: PORTFOLIO.filter((group) => group.soloDevelopment).length,
    },
    {
      id: "Develop" as const,
      label: t.categoryDevelop,
      icon: Code2,
      count: developmentGroups.length,
    },
    {
      id: "Design" as const,
      label: t.categoryDesign,
      icon: Box,
      count: PORTFOLIO.filter((group) => group.tools?.includes("Design")).length,
    },
  ];

  useEffect(() => {
    setActiveGroup("all");
  }, [mainTab]);

  return (
    <section id="works" className="scroll-mt-20 bg-background pt-16 pb-32">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 md:px-16">
        <div className="mb-12 relative">
          <span className="font-['JetBrains_Mono'] text-[10px] md:text-xs tracking-[0.28em] text-primary uppercase">
            {t.projectsEyebrow}
          </span>
          <h2
            id="projects-heading"
            tabIndex={-1}
            className="font-['Fraunces'] font-light text-foreground leading-tight mt-3 mb-4"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
          >
            {t.projects}
          </h2>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <p className="max-w-2xl text-base md:text-lg leading-relaxed text-white/60">{t.projectsIntro}</p>
            <span className="font-['JetBrains_Mono'] text-xs tracking-wider text-white/40 whitespace-nowrap">
              {filteredByMainTab.length} {t.projectCount}
            </span>
          </div>

          <div className="rounded-2xl border border-primary/30 bg-white/[0.04] p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
              <p id="project-category-label" className="text-base font-semibold text-white">{t.projectCategory}</p>
              <p className="text-sm text-white/65">{t.projectCategoryHint}</p>
            </div>
            <div role="group" aria-labelledby="project-category-label" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {mainTabs.map((tab) => {
                const isActive = mainTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onCategoryChange(tab.id)}
                    aria-pressed={isActive}
                    className={`relative min-h-24 px-4 py-4 rounded-xl border-2 flex items-center gap-3 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background ${
                      isActive
                        ? "bg-primary border-primary text-black shadow-[0_10px_30px_rgba(212,168,83,0.22)]"
                        : "bg-[#15151c] text-white border-white/25 hover:bg-primary/10 hover:border-primary/70"
                    }`}
                  >
                    <span className={`grid shrink-0 place-items-center w-11 h-11 rounded-xl ${isActive ? "bg-black/10" : "bg-primary/10 text-primary"}`}>
                      <Icon size={24} strokeWidth={2} aria-hidden="true" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-lg font-semibold">{tab.label}</span>
                      <span className={`block mt-1 text-xs ${isActive ? "text-black/75" : "text-white/65"}`}>
                        {tab.count} {t.projectCount}
                      </span>
                    </span>
                    {isActive && (
                      <span className="flex shrink-0 flex-col items-center gap-1 text-[10px] font-semibold">
                        <Check size={18} strokeWidth={3} aria-hidden="true" />
                        {t.categorySelected}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-7">
            <p className="mb-3 font-['JetBrains_Mono'] text-[10px] tracking-[0.2em] uppercase text-white/40">{t.projectFilter}</p>
            <div className="flex flex-wrap gap-2 pb-3">
            <button
              type="button"
              onClick={() => setActiveGroup("all")}
              className={`font-['JetBrains_Mono'] text-xs tracking-wider px-5 py-3 rounded-xl transition-all duration-300 ${
                activeGroup === "all"
                  ? "bg-white text-black shadow-lg font-semibold"
                  : "bg-white/[0.04] text-white/60 border border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              {t.all}
            </button>
            {filteredByMainTab.map((group) => {
              const groupName = t.groups[group.groupKey];
              return (
                <button
                  key={group.groupKey}
                  type="button"
                  onClick={() => setActiveGroup(group.groupKey)}
                  className={`font-['JetBrains_Mono'] text-xs tracking-wide px-5 py-3 rounded-xl transition-all duration-300 ${
                    activeGroup === group.groupKey
                      ? "bg-white text-black shadow-lg font-semibold"
                      : "bg-white/[0.04] text-white/60 border border-white/10 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {group.emoji} {groupName} {group.concept ? `(${group.concept})` : ""}
                </button>
              );
            })}
            </div>
          </div>
        </div>

        {displayGroups.length === 0 ? (
          <div className="text-white/40 font-['JetBrains_Mono'] py-20 text-center">{t.emptyProjects}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 pt-4">
            {displayGroups.map((group) => {
              const groupName = t.groups[group.groupKey];
              const mainGalleryItem = group.items.find((item) => item.galleryImages?.length);
              const linkItem = group.items.find((item) => item.link);
              const allImages = mainGalleryItem?.galleryImages ?? [];
              const videos = group.items.flatMap((item) => item.videos ?? []);
              const coverItem = mainGalleryItem || linkItem || group.items[0];
              const coverImage = coverItem?.thumb || "";
              const coverFit = coverItem?.thumbFit ?? "cover";

              return (
                <article key={group.groupKey} className="group overflow-hidden rounded-[1.5rem] bg-[#0d0d13] border border-white/10 hover:border-primary/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
                  <div
                    onClick={() => allImages.length > 0 && setLightbox({ images: allImages, index: 0 })}
                    className={`relative w-full aspect-[16/10] overflow-hidden bg-[#0a0a10] ${
                      allImages.length > 0 || linkItem ? "cursor-pointer" : ""
                    }`}
                  >
                    {linkItem && allImages.length === 0 && (
                      <a
                        href={linkItem.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${groupName} ${
                          linkItem.linkLabel === "appstore"
                            ? (lang === 'en' ? 'View on App Store' : 'App Store에서 보기')
                            : linkItem.linkLabel === "github"
                            ? t.viewGithub
                            : linkItem.linkLabel === "site"
                              ? t.viewSite
                              : linkItem.linkLabel === "play"
                                ? t.playGame
                                : linkItem.linkLabel === "video"
                                  ? t.viewVideo
                                : t.viewProcess
                        }`}
                        className="absolute inset-0 z-10"
                      />
                    )}
                    {coverImage && (
                      <LoadingImage
                        src={coverImage}
                        alt={groupName}
                        className="w-full h-full transition-transform duration-700 group-hover:scale-[1.03] opacity-90 group-hover:opacity-100"
                        imageClassName={coverFit === "contain" ? "object-contain" : "object-cover"}
                      />
                    )}
                    {allImages.length > 0 && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                        <span className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm shadow-xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          {t.viewLarge} <span className="font-normal opacity-50">({allImages.length})</span>
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0d0d13] to-transparent pointer-events-none" />
                    <span className="absolute left-5 top-5 z-20 font-['JetBrains_Mono'] text-[10px] tracking-[0.18em] uppercase text-white/80 bg-black/60 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full">
                      {group.soloDevelopment ? t.categorySolo : group.tools?.includes("Develop") ? "Development" : "3D Art"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-4 px-5 pb-6 sm:px-7 sm:pb-7 -mt-3 relative z-10">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-['Fraunces'] font-medium text-foreground text-2xl md:text-[1.75rem] leading-tight flex items-center gap-2">
                        {group.emoji} {groupName}
                      </h3>
                      {linkItem && (
                        <a
                          href={linkItem.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 flex items-center gap-1 text-[10px] sm:text-xs font-['JetBrains_Mono'] text-primary hover:text-black hover:bg-primary transition-colors bg-primary/10 px-3 py-2 rounded-full border border-primary/20"
                        >
                          {linkItem.linkLabel === "appstore"
                            ? (lang === 'en' ? 'View on App Store' : 'App Store에서 보기')
                            : linkItem.linkLabel === "github"
                            ? t.viewGithub
                            : linkItem.linkLabel === "site"
                              ? t.viewSite
                              : linkItem.linkLabel === "play"
                                ? t.playGame
                              : linkItem.linkLabel === "video"
                                ? t.viewVideo
                              : t.viewProcess}{" "}
                          <ArrowUpRight size={14} />
                        </a>
                      )}
                    </div>
                    <p className="text-sm sm:text-[15px] leading-6 text-white/58 min-h-12">
                      {t.groupDescriptions[group.groupKey]}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      {group.concept && (
                        <span className="text-[10px] sm:text-xs font-['JetBrains_Mono'] tracking-widest text-white/50 bg-white/5 px-2 py-1 rounded-md border border-white/10">
                          {group.concept}
                        </span>
                      )}
                      <ToolTags tools={group.tools} />
                    </div>
                    {(group.groupKey === 'devPraynoteGroup' || group.groupKey === 'devPetChewGroup') && (
                      <Link to={group.groupKey === 'devPetChewGroup' ? '/chapchew' : '/gracesea'} className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary hover:bg-primary/20">{lang === 'en' ? 'Explore project' : '프로젝트 소개 보기'}<ArrowUpRight size={18} /></Link>
                    )}
                    {group.readme && group.groupKey !== 'devPraynoteGroup' && group.groupKey !== 'devPetChewGroup' && (
                      <ProjectDetails title={groupName} readme={group.readme} images={allImages} videos={videos} />
                    )}
                    {videos.length > 0 && !group.readme && (
                      <details className="border-t border-white/10 pt-4">
                        <summary className="cursor-pointer text-sm text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                          {t.viewVideo} ({videos.length})
                        </summary>
                        <div className="mt-4 grid gap-5">
                          {videos.map((video) => (
                            <figure key={video.src}>
                              <figcaption className="mb-2 text-xs text-white/60">
                                {groupName} · {video.label}
                              </figcaption>
                              <video
                                controls
                                playsInline
                                preload="none"
                                aria-label={`${groupName} ${video.label}`}
                                className="w-full max-h-[65vh] rounded-xl bg-black object-contain"
                              >
                                <source src={video.src} type="video/mp4" />
                                <a href={video.src}>{t.viewVideo} · {video.label}</a>
                              </video>
                            </figure>
                          ))}
                        </div>
                      </details>
                    )}
                    {allImages.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setLightbox({ images: allImages, index: 0 })}
                        className="mt-1 flex items-center justify-between w-full pt-4 border-t border-white/10 text-xs font-['JetBrains_Mono'] tracking-wider text-white/50 hover:text-primary transition-colors"
                      >
                        <span className="flex items-center gap-2"><Images size={15} /> {allImages.length} {t.imageCount}</span>
                        <span className="flex items-center gap-1">{t.viewLarge} <ArrowUpRight size={14} /></span>
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {lightbox && (
        <Lightbox
          images={lightbox.images}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onChange={(index) => setLightbox({ ...lightbox, index })}
        />
      )}
    </section>
  );
}
