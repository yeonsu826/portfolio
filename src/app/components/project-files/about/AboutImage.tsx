import { useEffect, useRef } from "react";
import { imagePreview, previewSrc } from "../../../utils/imagePreview";

export type AboutImageAsset = { source: string; label: string };

export function AboutImage({
  image,
  photo = false,
  onOpen,
}: {
  image: AboutImageAsset;
  photo?: boolean;
  onOpen: (image: AboutImageAsset) => void;
}) {
  const preview = imagePreview(image.source);
  return (
    <button
      type="button"
      className={`resume-certificate ${photo ? "is-memory-photo" : ""}`}
      aria-label={`${image.label} 확대 보기`}
      onClick={() => onOpen(image)}
    >
      <img
        src={previewSrc(image.source)}
        alt={image.label}
        width={preview?.width}
        height={preview?.height}
        loading="lazy"
        decoding="async"
      />
      {!photo && <span className="resume-certificate-tape">{image.label}</span>}
    </button>
  );
}

export function AboutImageViewer({
  image,
  onClose,
}: {
  image: AboutImageAsset;
  onClose: () => void;
}) {
  const viewer = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = viewer.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    dialog?.showModal();
    return () => {
      dialog?.close();
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={viewer}
      className="resume-certificate-viewer"
      aria-label={`${image.label} 확대 이미지`}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="resume-certificate-viewer-toolbar">
        <span>{image.label}</span>
        <button type="button" aria-label="확대 이미지 닫기" onClick={onClose}>
          닫기 ×
        </button>
      </div>
      <img
        src={import.meta.env.BASE_URL + image.source}
        alt={image.label}
        decoding="async"
      />
    </dialog>
  );
}
