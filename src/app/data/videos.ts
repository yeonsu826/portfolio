import type { GroupKey } from '../i18n/translations';

export type VideoItem = {
  id: string;
  type: "portrait" | "landscape";
  tools?: string[];
  groupKey?: GroupKey;
};

export const VIMEO_VIDEOS: VideoItem[] = [
  { id: "1220354350", groupKey: "jinu", type: "portrait", tools: ["Blender", "Unreal Engine", "Substance Painter"] },
  { id: "1211900105", groupKey: "gamingroom", type: "portrait", tools: ["Blender", "Unreal Engine", "Substance Painter"] },
  { id: "1211900103", groupKey: "stage", type: "portrait", tools: ["Blender", "Unreal Engine", "Substance Painter"] },
  { id: "1211900047", type: "portrait", tools: ["Blender", "Unreal Engine", "Substance Painter"] },
  { id: "1211900004", type: "portrait", tools: ["Blender", "Unreal Engine", "Substance Painter"] },
  { id: "1211913186", groupKey: "cafe", type: "portrait", tools: ["Blender", "Unreal Engine", "Substance Painter"] },
  { id: "1221433562", groupKey: "devWorkGroup", type: "landscape", tools: ["Unity", "UI Particle"] },
  { id: "1211907156", groupKey: "devWorkGroup", type: "landscape", tools: ["Unity", "C#", "Particle System"] },
  { id: "1211907154", groupKey: "devWorkGroup", type: "landscape", tools: ["Unity", "C#", "Shader"] },
  { id: "1211907153", groupKey: "devWorkGroup", type: "landscape", tools: ["Unity", "C#", "UI Particle"] },
  { id: "1211907155", groupKey: "devWorkGroup", type: "landscape", tools: ["Unity", "C#", "UI Particle"] },
];
