import { ImageIcon, X, ChevronLeft, ChevronRight } from "lucide-react";

export interface ImageItem {
  id: string;
  file: File;
  url: string;
  name: string;
}

interface ImageListProps {
  images: ImageItem[];
  activeImageId: string | null;
  onSelectImage: (id: string) => void;
  onRemoveImage: (id: string) => void;
  annotationCounts: Record<string, number>;
}

const ImageList = ({ images, activeImageId, onSelectImage, onRemoveImage, annotationCounts }: ImageListProps) => {
  const activeIndex = images.findIndex((img) => img.id === activeImageId);

  const goPrev = () => {
    if (activeIndex > 0) onSelectImage(images[activeIndex - 1].id);
  };

  const goNext = () => {
    if (activeIndex < images.length - 1) onSelectImage(images[activeIndex + 1].id);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Images ({images.length})
        </h2>
        {images.length > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={goPrev}
              disabled={activeIndex <= 0}
              className="p-0.5 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-[10px] text-muted-foreground">
              {activeIndex + 1}/{images.length}
            </span>
            <button
              onClick={goNext}
              disabled={activeIndex >= images.length - 1}
              className="p-0.5 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
        {images.map((img) => {
          const isActive = img.id === activeImageId;
          const count = annotationCounts[img.id] || 0;
          return (
            <div
              key={img.id}
              onClick={() => onSelectImage(img.id)}
              className={`flex items-center justify-between rounded-md px-2 py-1.5 text-xs cursor-pointer transition-all ${
                isActive ? "ring-1 ring-ring bg-secondary" : "hover:bg-secondary/50"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <ImageIcon size={12} className="shrink-0 text-muted-foreground" />
                <span className="truncate">{img.name}</span>
                {count > 0 && (
                  <span className="shrink-0 rounded-full bg-primary/20 text-primary px-1.5 py-0.5 text-[9px] font-medium">
                    {count}
                  </span>
                )}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onRemoveImage(img.id); }}
                className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImageList;
