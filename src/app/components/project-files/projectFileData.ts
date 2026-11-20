import { videoCollections } from "./videoCollections";

export const fileRows = [
  {
    id: "all",
    color: "#d91618",
    caption: "전체 프로젝트 / All Projects",
    keys: [
      "group-development",
      "group-design",
      "group-independent",
      "group-videos",
    ],
  },
  {
    id: "development",
    color: "#0d7868",
    caption: "개발 / Development",
    keys: [
      "devInteractiveRacingGroup",
      "devAIVideoletterGroup",
      "devARContentGroup",
      "devAIGameGroup",
      "devTaeanGroup",
      "devGeumsanGroup",
      "devWorkGroup",
    ],
  },
  {
    id: "design",
    color: "#581c70",
    caption: "디자인 / Design",
    keys: ["cafe", "gamingroom", "stage", "jinu", "glasses"],
  },
  {
    id: "independent",
    color: "#2349d5",
    caption: "1인 개발 / Independent Development",
    keys: ["devPraynoteGroup", "devPetChewGroup", "devManittoGroup"],
  },
  {
    id: "videos",
    color: "#a65a23",
    caption: "영상 작업 / Video Work",
    keys: ["video-modeling", "video-unreal", "video-unity"],
  },
] as const;
export const tabNames: Record<string, string> = {
  "video-modeling": "모델링",
  "video-unreal": "언리얼",
  "video-unity": "유니티",
  allProjects: "전체 프로젝트",
  allVideos: "영상 작업",
  "group-development": "개발",
  "group-design": "디자인",
  "group-independent": "1인 개발",
  "group-videos": "영상 작업",
  devPraynoteGroup: "은혜의 바다",
  devPetChewGroup: "Chap-Chew",
  devManittoGroup: "Manitto",
  cafe: "Cafe",
  gamingroom: "Gaming Room",
  stage: "Stage Design",
  jinu: "Jinu",
  glasses: "Glasses",
  devARContentGroup: "AR",
  devAIGameGroup: "AI Game",
  devInteractiveRacingGroup: "Racing",
  devAIVideoletterGroup: "AI Letter",
  devTaeanGroup: "Taean",
  devGeumsanGroup: "Geumsan",
  devWorkGroup: "Process",
};
export const tabColors: Record<string, string> = {
  "video-modeling": "#a65a23",
  "video-unreal": "#67723a",
  "video-unity": "#58676f",
  allProjects: "#d91618",
  allVideos: "#a65a23",
  "group-development": "#d91618",
  "group-design": "#581c70",
  "group-independent": "#2349d5",
  "group-videos": "#a65a23",
  devPraynoteGroup: "#2349d5",
  devPetChewGroup: "#c44f3b",
  devManittoGroup: "#4c46bb",
  cafe: "#581c70",
  gamingroom: "#316f45",
  stage: "#147f91",
  jinu: "#80508f",
  glasses: "#9b376a",
  devARContentGroup: "#fff22b",
  devAIGameGroup: "#141716",
  devInteractiveRacingGroup: "#0d7868",
  devAIVideoletterGroup: "#4b77a6",
  devTaeanGroup: "#8a613c",
  devGeumsanGroup: "#aa2945",
  devWorkGroup: "#743846",
};
export type FileRow = (typeof fileRows)[number];
export function fileSelection(key: string) {
  if (
    key === "allVideos" ||
    key.startsWith("film-") ||
    key === "group-videos" ||
    videoCollections[key]
  ) {
    const collectionKey = videoCollections[key]
      ? key
      : (Object.keys(videoCollections).find((collection) =>
          videoCollections[collection].clips.some(
            (clip) => clip.id === key.slice(5),
          ),
        ) ?? "video-modeling");
    return {
      row: fileRows.findIndex((row) => row.id === "videos"),
      key: collectionKey,
    };
  }
  if (
    key === "allProjects" ||
    (fileRows[0].keys as readonly string[]).includes(key)
  )
    return { row: 0, key };
  return {
    row: fileRows.findIndex(
      (row) =>
        row.id !== "all" && (row.keys as readonly string[]).includes(key),
    ),
    key,
  };
}
export const rowTabWidth = (item: { keys: readonly string[] }) =>
  item.keys.length >= 7
    ? `${100 / item.keys.length}%`
    : item.keys.length === 5
      ? "18%"
      : item.keys.length === 4
        ? "18%"
        : "22%";
