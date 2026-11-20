import type { AboutImageAsset } from "./AboutImage";

const certificate = (file: string, label: string): AboutImageAsset => ({
  source: `credentials/${file}`,
  label,
});
export const degree = certificate("degree_certificate.png", "졸업증명서");
export const credentials = [
  certificate("engineer.png", "정보처리산업기사"),
  certificate("network.png", "네트워크관리사 2급"),
];
export const activities = [
  certificate("facebook_marketing.jpeg", "Facebook Marketing"),
  certificate("MicrosoftAI.png", "Microsoft AI"),
  certificate("sessac.png", "SeSAC"),
  certificate("vr_content_certificate.jpg", "VR 콘텐츠 제작"),
];
export const memoryPhotos: AboutImageAsset[] = [
  "졸업사진.webp",
  "금산_2.webp",
  "버추얼2기_1.jpg",
  "working.png",
  "행사_1.jpg",
  "금산_5.jpg",
  "태안_3.webp",
  "태안_7.jpg",
  "태안_4.webp",
  "금산_6.webp",
  "행사_3.jpg",
  "태안_5.webp",
  "금산_7.jpg",
  "버추얼2기_2.JPG",
  "행사_4.jpg",
].map((file) => ({
  source: file === "working.png" ? "images/working.png" : `coverletter/${file}`,
  label: file.replace(/_/g, " ").replace(/\.[^.]+$/, ""),
}));
