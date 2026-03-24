import { useState, useCallback, useMemo } from "react";
import { type Label, type BBox } from "@/types/annotation";
import LabelManager from "@/components/LabelManager";
import AnnotationCanvas from "@/components/AnnotationCanvas";
import AnnotationList from "@/components/AnnotationList";
import ExportPanel from "@/components/ExportPanel";
import ImageList, { type ImageItem } from "@/components/ImageList";
import { Upload, ImageIcon } from "lucide-react";

const Index = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const [labels, setLabels] = useState<Label[]>([]);
  const [activeLabel, setActiveLabel] = useState<Label | null>(null);
  // Per-image bboxes: imageId -> BBox[]
  const [allBboxes, setAllBboxes] = useState<Record<string, BBox[]>>({});
  // Per-image natural sizes
  const [naturalSizes, setNaturalSizes] = useState<Record<string, { w: number; h: number }>>({});

  const activeImage = useMemo(() => images.find((img) => img.id === activeImageId) || null, [images, activeImageId]);
  const bboxes = activeImageId ? (allBboxes[activeImageId] || []) : [];
  const naturalSize = activeImageId ? (naturalSizes[activeImageId] || { w: 0, h: 0 }) : { w: 0, h: 0 };

  const setBboxes = useCallback((updater: (prev: BBox[]) => BBox[]) => {
    if (!activeImageId) return;
    setAllBboxes((prev) => ({
      ...prev,
      [activeImageId]: updater(prev[activeImageId] || []),
    }));
  }, [activeImageId]);

  const addImages = useCallback((files: FileList | File[]) => {
    const newImages: ImageItem[] = [];
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      newImages.push({
        id: crypto.randomUUID(),
        file,
        url: URL.createObjectURL(file),
        name: file.name,
      });
    });
    if (newImages.length === 0) return;
    setImages((prev) => [...prev, ...newImages]);
    // Auto-select first new image if none active
    setActiveImageId((prev) => prev || newImages[0].id);
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    addImages(files);
    e.target.value = "";
  }, [addImages]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    addImages(e.dataTransfer.files);
  }, [addImages]);

  const handleRemoveImage = useCallback((id: string) => {
    setImages((prev) => {
      const next = prev.filter((img) => img.id !== id);
      if (activeImageId === id) {
        const idx = prev.findIndex((img) => img.id === id);
        const newActive = next[Math.min(idx, next.length - 1)]?.id || null;
        setActiveImageId(newActive);
      }
      return next;
    });
    setAllBboxes((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setNaturalSizes((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, [activeImageId]);

  const handleAddLabel = (label: Label) => {
    setLabels((prev) => [...prev, label]);
    setActiveLabel(label);
  };

  const handleRemoveLabel = (id: string) => {
    setLabels((prev) => prev.filter((l) => l.id !== id));
    // Remove bboxes with this label from all images
    setAllBboxes((prev) => {
      const next: Record<string, BBox[]> = {};
      for (const [imgId, boxes] of Object.entries(prev)) {
        next[imgId] = boxes.filter((b) => b.labelId !== id);
      }
      return next;
    });
    if (activeLabel?.id === id) setActiveLabel(null);
  };

  const handleClearAll = () => {
    images.forEach((img) => URL.revokeObjectURL(img.url));
    setImages([]);
    setActiveImageId(null);
    setAllBboxes({});
    setNaturalSizes({});
  };

  const annotationCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const [imgId, boxes] of Object.entries(allBboxes)) {
      counts[imgId] = boxes.length;
    }
    return counts;
  }, [allBboxes]);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 shrink-0 flex flex-col border-r border-border bg-card overflow-y-auto">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ImageIcon size={18} className="text-primary" />
            <h1 className="text-sm font-bold tracking-tight">YOLO Annotator</h1>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">YOLOv8 bounding box annotation tool</p>
        </div>

        <div className="p-4 flex flex-col gap-5 flex-1">
          {/* Image upload */}
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Upload</h2>
            <label className="flex items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/50 px-3 py-3 text-xs text-muted-foreground cursor-pointer hover:border-primary hover:text-primary transition-colors">
              <Upload size={14} />
              Upload images...
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
            </label>
            {images.length > 0 && (
              <button onClick={handleClearAll} className="text-[10px] text-destructive hover:underline self-end">
                Clear all
              </button>
            )}
          </div>

          {/* Image list */}
          {images.length > 0 && (
            <ImageList
              images={images}
              activeImageId={activeImageId}
              onSelectImage={setActiveImageId}
              onRemoveImage={handleRemoveImage}
              annotationCounts={annotationCounts}
            />
          )}

          <LabelManager
            labels={labels}
            activeLabel={activeLabel}
            onAddLabel={handleAddLabel}
            onRemoveLabel={handleRemoveLabel}
            onSelectLabel={setActiveLabel}
          />

          <AnnotationList bboxes={bboxes} labels={labels} onDelete={(id) => setBboxes((prev) => prev.filter((b) => b.id !== id))} />

          <ExportPanel
            bboxes={bboxes}
            labels={labels}
            naturalWidth={naturalSize.w}
            naturalHeight={naturalSize.h}
            imageName={activeImage?.name || ""}
          />
        </div>
      </aside>

      {/* Canvas area */}
      <main className="flex-1 flex items-center justify-center bg-canvas">
        {activeImage ? (
          <AnnotationCanvas
            key={activeImage.id}
            imageUrl={activeImage.url}
            bboxes={bboxes}
            labels={labels}
            activeLabel={activeLabel}
            onAddBBox={(bbox) => setBboxes((prev) => [...prev, bbox])}
            onDeleteBBox={(id) => setBboxes((prev) => prev.filter((b) => b.id !== id))}
            onUpdateBBox={(updated) => setBboxes((prev) => prev.map((b) => b.id === updated.id ? updated : b))}
            onImageLoad={(w, h) => setNaturalSizes((prev) => ({ ...prev, [activeImage.id]: { w, h } }))}
          />
        ) : (
          <div
            className="flex flex-col items-center gap-4 p-12 rounded-xl border-2 border-dashed border-border"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <ImageIcon size={28} className="text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm text-foreground font-medium">Drop images here</p>
              <p className="text-xs text-muted-foreground mt-1">or use the upload button in the sidebar</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Supports multiple images</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;