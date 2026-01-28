import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";

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
    <div className="fixed inset-0 z-80 backdrop-blur-2xl flex items-center justify-center">
      <div className="fixed bottom-10 z-90 backdrop-blur-md bg-black/10 dark:bg-white/10 rounded-full overflow-hidden w-20 h-10 flex justify-center items-center text-black dark:text-white">{safeIndex+1}/{normalizedImages.length}</div>
      <button
        onClick={onClose}
        className="absolute z-90 top-4 right-4 backdrop-blur-md bg-black/10 dark:bg-white/10 w-12 h-12 flex items-center justify-center hover:bg-black/50 dark:hover:bg-white/50 rounded-full text-black dark:text-white hover:opacity-80 active:scale-90"
      >
        <X size={28} />
      </button>

      {normalizedImages.length > 1 && safeIndex > 0 && (
        <button
          onClick={() => onChange?.(safeIndex - 1)}
          className="absolute z-90 left-4 backdrop-blur-md bg-black/10 dark:bg-white/10 w-12 h-12 flex items-center justify-center hover:bg-black/50 dark:hover:bg-white/50 rounded-full text-black dark:text-white hover:opacity-80 active:scale-90"
        >
          <ChevronLeft size={36} />
        </button>
      )}

      <div className="relative w-dvw h-dvh">
        <Image
          src={image.url}
          alt="viewer"
          fill
          className="object-contain"
          priority
        />
      </div>

      {normalizedImages.length > 1 && safeIndex < normalizedImages.length - 1 && (
        <button
          onClick={() => onChange?.(safeIndex + 1)}
          className="absolute z-90 right-4 backdrop-blur-md bg-black/10 dark:bg-white/10 w-12 h-12 flex items-center justify-center hover:bg-black/50 dark:hover:bg-white/50 rounded-full text-black dark:text-white hover:opacity-80 active:scale-90"
        >
          <ChevronRight size={36} />
        </button>
      )}
    </div>
  );
};

export default ImageViewer;
