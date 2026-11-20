import previews from "../data/imagePreviews.json";

const images = previews as Record<
  string,
  { src: string; width: number; height: number }
>;

export function imagePreview(source: string) {
  return images[source];
}

export function previewSrc(source: string) {
  return import.meta.env.BASE_URL + (images[source]?.src ?? source);
}
