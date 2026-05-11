import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import OverlayPortal from "./OverlayPortal";

type ImageType = {
  id: string;
  url: string;
};

type Props = {
  images: ImageType[] | string;
  index?: number;
  onClose: () => void;
  onChange?: (index: number) => void;
};

const ImageViewer = ({ images, index, onClose, onChange }: Props) => {
  const normalizedImages: ImageType[] =
    typeof images === "string"
      ? [{ id: "single", url: images }]
      : images;

  const safeIndex = Math.max(0, Math.min((index ?? 0), normalizedImages.length - 1));
  const image = normalizedImages[safeIndex];

  useLockBodyScroll(true);

  return (
    <OverlayPortal>
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/55 backdrop-blur-2xl">
        <div className="fixed bottom-10 z-[121] flex h-10 w-20 items-center justify-center overflow-hidden rounded-full bg-black/20 text-black backdrop-blur-md dark:bg-white/10 dark:text-white">
          {safeIndex + 1}/{normalizedImages.length}
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[121] flex h-12 w-12 items-center justify-center rounded-full bg-black/20 text-black backdrop-blur-md hover:bg-black/50 hover:opacity-80 active:scale-90 dark:bg-white/10 dark:text-white dark:hover:bg-white/50"
        >
          <X size={28} />
        </button>

        {normalizedImages.length > 1 && safeIndex > 0 && (
          <button
            onClick={() => onChange?.(safeIndex - 1)}
            className="absolute left-4 z-[121] flex h-12 w-12 items-center justify-center rounded-full bg-black/20 text-black backdrop-blur-md hover:bg-black/50 hover:opacity-80 active:scale-90 dark:bg-white/10 dark:text-white dark:hover:bg-white/50"
          >
            <ChevronLeft size={36} />
          </button>
        )}

        <div className="relative h-dvh w-dvw">
          <Image
            src={image.url}
            alt="viewer"
            fill
            className="object-contain"
            priority
          />
        </div>

        {normalizedImages.length > 1 &&
          safeIndex < normalizedImages.length - 1 && (
            <button
              onClick={() => onChange?.(safeIndex + 1)}
              className="absolute right-4 z-[121] flex h-12 w-12 items-center justify-center rounded-full bg-black/20 text-black backdrop-blur-md hover:bg-black/50 hover:opacity-80 active:scale-90 dark:bg-white/10 dark:text-white dark:hover:bg-white/50"
            >
              <ChevronRight size={36} />
            </button>
          )}
      </div>
    </OverlayPortal>
  );
};

export default ImageViewer;
