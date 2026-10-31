import type { GroupKey } from "../i18n/translations";
import graceseaReadme from "./gracesea/README.md?raw";
import manittoReadme from "./manitto/README.md?raw";
import petChewReadme from "./pet-chew/README.md?raw";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

const numbered = (dir: string, count: number, ext: string, start = 1) =>
  Array.from({ length: count }, (_, i) => asset(`${dir}/${start + i}.${ext}`));

export interface PortfolioItem {
  id: string;
  thumb: string;
  thumbFit?: "cover" | "contain";
  galleryImages?: string[];
  videos?: { src: string; label: string }[];
  isProcess?: boolean;
  link?: string;
  linkLabel?: "github" | "site" | "play" | "video" | "appstore";
}

export interface PortfolioGroup {
  groupKey: GroupKey;
  soloDevelopment?: boolean;
  concept?: string;
  readme?: string;
  tools?: string[];
  emoji: string;
    items: PortfolioItem[];
}

export const TOOL_LOGOS: Record<string, string> = {
  Unity: asset("images/icons/unity.svg"),
  "Unreal Engine": asset("images/icons/unreal.svg"),
  Blender: asset("images/icons/blender.svg"),
  "Substance Painter": asset("images/icons/substance.svg"),
};

export const PORTFOLIO: PortfolioGroup[] = [
  {
    groupKey: "devPraynoteGroup",
    soloDevelopment: true,
    readme: graceseaReadme,
    tools: ["Develop", "React Native", "Expo", "Supabase"],
    emoji: "🌊",
    items: [
      {
        id: "dev_praynote",
        link: "https://apps.apple.com/kr/app/id6822101326",
        linkLabel: "appstore",
        videos: [
          { src: asset("videos/gracesea/guide-01.mp4"), label: "오늘의 기록과 묵상" },
          { src: asset("videos/gracesea/guide-02.mp4"), label: "등대에서 함께 기도하기" },
          { src: asset("videos/gracesea/guide-03.mp4"), label: "커뮤니티 중보기도" },
        ],
        thumb: asset("images/dev/gracesea/project-thumbnail.jpg"),
        thumbFit: "contain",
      },
    ],
  },
  {
    groupKey: "devPetChewGroup",
    soloDevelopment: true,
    readme: petChewReadme,
    concept: "WIP",
    tools: ["Develop", "Unity", "AR Foundation", "C#"],
    emoji: "🐈‍⬛",
    items: [
      {
        id: "dev_pet_chew",
        thumb: asset("images/dev/chapchew/poster.jpg"),
        thumbFit: "contain",
      },
    ],
  },
  {
    groupKey: "jinu",
    tools: ["Design", "Blender", "Substance Painter"],
    emoji: "🎸",
    items: [
      {
        id: "jinu_result_gallery",
        thumb: asset("jinu/14.png"),
        galleryImages: numbered("jinu", 23, "png"),
      },
    ],
  },
  {
    groupKey: "glasses",
    emoji: "👓",
    tools: ["Design", "Blender", "Unreal Engine"],
    items: [
      {
        id: "glasses_result_gallery",
        thumb: asset("images/glasses/1.png"),
        galleryImages: [
          asset("images/glasses/1.png"),
          asset("images/glasses/2.png"),
          asset("images/glasses/4.png"),
          asset("images/glasses/5.png"),
          asset("images/glasses/6.png"),
          asset("images/glasses/3.png"),
          ...numbered("images/glasses", 23, "png", 7),
        ],
      },
      {
        id: "glass_project_process",
        thumb: asset("images/glass_project_process.png"),
        isProcess: true,
        link: asset("glasses_project/index.html"),
      },
    ],
  },
  {
    groupKey: "cafe",
    concept: "Stylized",
    tools: ["Design", "Blender", "Unreal Engine", "Substance Painter"],
    emoji: "☕",
    items: [
      {
        id: "cafe_result_gallery",
        thumb: asset("images/cafe/0.jpeg"),
        galleryImages: numbered("images/cafe", 11, "jpeg", 0),
      },
      {
        id: "cafe_project_process",
        thumb: asset("images/cafe_project_process.png"),
        isProcess: true,
        link: asset("cafe_project/index.html"),
      },
    ],
  },
  {
    groupKey: "gamingroom",
    concept: "Stylized",
    tools: ["Design", "Blender", "Unreal Engine", "Substance Painter"],
    emoji: "🎮",
    items: [
      {
        id: "gamingroom_result_gallery",
        thumb: asset("images/gamingroom/1.jpeg"),
        galleryImages: numbered("images/gamingroom", 12, "jpeg"),
      },
    ],
  },
  {
    groupKey: "stage",
    tools: ["Design", "Blender", "Unreal Engine", "Substance Painter"],
    emoji: "🎭",
    items: [
      {
        id: "stage_result_gallery",
        thumb: asset("images/stage/1.jpeg"),
        galleryImages: numbered("images/stage", 10, "jpeg"),
      },
    ],
  },
  {
    groupKey: "devManittoGroup",
    soloDevelopment: true,
    readme: manittoReadme,
    tools: ["Develop", "Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase"],
    emoji: "💝",
    items: [
      {
        id: "dev_manitto",
        thumb: asset("images/dev/Manitto/web_1.png"),
        thumbFit: "contain",
        galleryImages: [
          asset("images/dev/Manitto/web_1.png"),
          asset("images/dev/Manitto/app_1.png"),
        ],
        link: "https://manitto.site/",
        linkLabel: "site",
      },
    ],
  },
  {
    groupKey: "devUnityWebglGroup",
    soloDevelopment: true,
    tools: ["Develop", "Unity", "WebGL"],
    emoji: "🕹️",
    items: [
      {
        id: "dev_unity_webgl",
        thumb: asset("images/dev/UnityWebGL/1.png"),
        thumbFit: "contain",
        link: asset("unity-webgl-game/index.html"),
        linkLabel: "play",
      },
    ],
  },
  {
    groupKey: "devAIGameGroup",
    tools: ["Develop", "Unity", "C#"],
    emoji: "🎮",
    items: [
      {
        id: "dev_aigame",
        thumb: asset("images/dev/AIGame/1.png"),
        galleryImages: numbered("images/dev/AIGame", 12, "png"),
      },
    ],
  },
  {
    groupKey: "devAIVideoletterGroup",
    tools: ["Develop", "Unity", "C#"],
    emoji: "💌",
    items: [
      {
        id: "dev_aivideoletter",
        thumb: asset("images/dev/AIVideoletter/1.png"),
        galleryImages: numbered("images/dev/AIVideoletter", 17, "png"),
        link: "https://drive.google.com/file/d/1lTUtNlEJCq6MeJ7NayXVOUlt3zRmcbmW/view?usp=drive_link",
        linkLabel: "video",
      },
    ],
  },
  {
    groupKey: "devARContentGroup",
    tools: ["Develop", "Unity", "AR"],
    emoji: "📱",
    items: [
      {
        id: "dev_arcontent",
        thumb: asset("images/dev/ARContent/3.png"),
        galleryImages: [
          asset("images/dev/ARContent/1.jpg"),
          asset("images/dev/ARContent/2.jpg"),
          ...numbered("images/dev/ARContent", 7, "png", 3),
        ],
      },
    ],
  },
  {
    groupKey: "devInteractiveRacingGroup",
    tools: ["Develop", "Unity", "C#"],
    emoji: "🏎️",
    items: [
      {
        id: "dev_interactiveracing",
        thumb: asset("images/dev/InteractiveRacing/1.png"),
        galleryImages: numbered("images/dev/InteractiveRacing", 8, "png"),
      },
    ],
  },
  {
    groupKey: "devTaeanGroup",
    tools: ["Develop", "Hardware"],
    emoji: "🏫",
    items: [
      {
        id: "dev_taean",
        thumb: asset("images/dev/Taean/1.jpg"),
        galleryImages: [
          asset("images/dev/Taean/1.jpg"),
          asset("images/dev/Taean/2.jpg"),
          asset("images/dev/Taean/3.jpg"),
          asset("images/dev/Taean/4.png"),
          asset("images/dev/Taean/5.jpg"),
          asset("images/dev/Taean/6.jpg"),
          asset("images/dev/Taean/7.jpg"),
          asset("images/dev/Taean/8.jpg"),
          asset("images/dev/Taean/9.jpg"),
          asset("images/dev/Taean/10.jpg"),
          asset("images/dev/Taean/11.jpg"),
          asset("images/dev/Taean/12.jpg"),
          asset("images/dev/Taean/13.jpg"),
        ],
      },
    ],
  },
  {
    groupKey: "devGeumsanGroup",
    tools: ["Develop", "Hardware"],
    emoji: "🏢",
    items: [
      {
        id: "dev_geumsan",
        thumb: asset("images/dev/Geumsan/1.jpg"),
        galleryImages: [
          asset("images/dev/Geumsan/1.jpg"),
          asset("images/dev/Geumsan/2.jpg"),
          asset("images/dev/Geumsan/3.jpg"),
          asset("images/dev/Geumsan/4.jpg"),
          asset("images/dev/Geumsan/5.jpg"),
          asset("images/dev/Geumsan/6.png"),
          asset("images/dev/Geumsan/7.jpg"),
        ],
      },
    ],
  },
  {
    groupKey: "devWorkGroup",
    tools: ["Develop", "Process"],
    emoji: "🛠️",
    items: [
      {
        id: "dev_work",
        thumb: asset("images/dev/Work/12.jpg"),
        galleryImages: [
          ...numbered("images/dev/Work", 16, "jpg"),
          asset("images/dev/Work/17.png"),
          asset("images/dev/Work/18.png"),
          asset("images/dev/Work/19.png"),
          asset("images/dev/Work/20.jpg"),
          asset("images/dev/Work/21.jpg"),
          asset("images/dev/Work/22.jpg"),
          asset("images/dev/Work/23.jpg"),
          asset("images/dev/Work/24.jpg"),
        ],
      },
    ],
  },
];

export const HERO_BG_IMAGES = Object.values(
  import.meta.glob("/public/images/*/*.{png,jpg,jpeg}", {
    eager: true,
    query: "?url",
    import: "default",
  }),
) as string[];

export const renderImageCount = PORTFOLIO.reduce(
  (sum, group) =>
    sum + group.items.reduce((inner, item) => inner + (item.galleryImages?.length ?? 0), 0),
  0,
);
