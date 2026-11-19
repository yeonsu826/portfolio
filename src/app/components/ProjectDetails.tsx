import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { X } from "lucide-react";
import { useLang } from "../context/LangContext";

import { Readme } from "./Readme";

export default function ProjectDetails({ title, readme, images, videos }: {
  title: string;
  readme: string;
  images: string[];
  videos: { src: string; label: string }[];
}) {
  const { lang } = useLang();
  const logoImages = images.filter(src => /icon/i.test(src.split("/").pop() ?? ""));
  const previewImages = images.filter(src => !/icon/i.test(src.split("/").pop() ?? ""));
  const labels = lang === "ko"
    ? { open: "설명 보기", description: "설명", images: "이미지", videos: "영상", close: "닫기", tabs: "프로젝트 상세" }
    : { open: "View details", description: "README (Korean)", images: "Images", videos: "Videos", close: "Close", tabs: "Project details" };
  const tabClass = "rounded-lg px-4 py-2 text-sm text-white/60 data-[state=active]:bg-primary data-[state=active]:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary";
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button type="button" className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary hover:bg-primary/20">{labels.open}</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100000] bg-black/80 backdrop-blur-sm" />
        <Dialog.Content aria-describedby={undefined} className="fixed left-1/2 top-1/2 z-[100001] flex max-h-[90dvh] w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0d0d13] text-white shadow-2xl">
          <header className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-8">
            <Dialog.Title className="text-xl font-semibold">{title}</Dialog.Title>
            <Dialog.Close aria-label={labels.close} className="rounded-full p-2 hover:bg-white/10"><X size={22} /></Dialog.Close>
          </header>
          <Tabs.Root defaultValue="description" className="flex min-h-0 flex-col">
            <Tabs.List aria-label={labels.tabs} className="flex flex-wrap gap-2 border-b border-white/10 px-5 py-3 sm:px-8">
              <Tabs.Trigger value="description" className={tabClass}>{labels.description}</Tabs.Trigger>
              <Tabs.Trigger value="images" className={tabClass}>{labels.images} ({images.length})</Tabs.Trigger>
              {videos.length > 0 && <Tabs.Trigger value="videos" className={tabClass}>{labels.videos} ({videos.length})</Tabs.Trigger>}
            </Tabs.List>
            <div className="overflow-y-auto overscroll-contain p-5 sm:p-8">
              <Tabs.Content value="description" className="space-y-5 text-sm leading-7 text-white/75"><Readme text={readme} images={images} videos={videos} /></Tabs.Content>
              <Tabs.Content value="images" className="space-y-6">
                {logoImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                    {logoImages.map((src, index) => (
                      <div key={src} className="overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-2">
                        <img src={src} alt={`${title} ${lang === "ko" ? "로고" : "logo"} ${index + 1}`} loading="lazy" className="aspect-square w-full rounded-xl object-contain" />
                      </div>
                    ))}
                  </div>
                )}
                {previewImages.map((src, index) => <img key={src} src={src} alt={`${title} ${labels.images} ${index + 1}`} className="h-auto w-full rounded-lg" />)}
              </Tabs.Content>
              <Tabs.Content value="videos" className="space-y-6">{videos.map(video => <figure key={video.src}><figcaption className="mb-3 text-sm text-white/70">{video.label}</figcaption><video controls playsInline preload="metadata" aria-label={`${title} ${video.label}`} className="max-h-[60vh] w-full rounded-lg bg-black"><source src={video.src} type="video/mp4" /></video></figure>)}</Tabs.Content>
            </div>
          </Tabs.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
