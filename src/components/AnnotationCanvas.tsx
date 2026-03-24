import { useRef, useState, useEffect, useCallback } from "react";
import { type BBox, type Label } from "@/types/annotation";

type DragMode = "none" | "draw" | "move" | "resize";
type ResizeHandle = "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w";

interface AnnotationCanvasProps {
  imageUrl: string;
  bboxes: BBox[];
  labels: Label[];
  activeLabel: Label | null;
  onAddBBox: (bbox: BBox) => void;
  onDeleteBBox: (id: string) => void;
  onUpdateBBox: (bbox: BBox) => void;
  onImageLoad: (w: number, h: number) => void;
}

const HANDLE_SIZE = 8;

const AnnotationCanvas = ({ imageUrl, bboxes, labels, activeLabel, onAddBBox, onDeleteBBox, onUpdateBBox, onImageLoad }: AnnotationCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [dragMode, setDragMode] = useState<DragMode>("none");
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [current, setCurrent] = useState({ x: 0, y: 0 });
  const [imgRect, setImgRect] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const [hoveredBBox, setHoveredBBox] = useState<string | null>(null);
  const [selectedBBox, setSelectedBBox] = useState<string | null>(null);
  const [dragTarget, setDragTarget] = useState<{ bboxId: string; originalBBox: BBox } | null>(null);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle | null>(null);

  const updateImgRect = useCallback(() => {
    if (imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      const container = containerRef.current?.getBoundingClientRect();
      if (container) {
        setImgRect({
          left: rect.left - container.left,
          top: rect.top - container.top,
          width: rect.width,
          height: rect.height,
        });
      }
    }
  }, []);

  useEffect(() => {
    updateImgRect();
    window.addEventListener("resize", updateImgRect);
    return () => window.removeEventListener("resize", updateImgRect);
  }, [updateImgRect, imageUrl]);

  const getRelPos = (e: React.MouseEvent) => {
    const container = containerRef.current?.getBoundingClientRect();
    if (!container) return { x: 0, y: 0 };
    return {
      x: Math.max(0, Math.min(1, (e.clientX - container.left - imgRect.left) / imgRect.width)),
      y: Math.max(0, Math.min(1, (e.clientY - container.top - imgRect.top) / imgRect.height)),
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // If clicking on a bbox handle or body, don't draw
    if (dragMode !== "none") return;
    if (!activeLabel) return;
    const pos = getRelPos(e);
    setStart(pos);
    setCurrent(pos);
    setDragMode("draw");
    setSelectedBBox(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const pos = getRelPos(e);
    if (dragMode === "draw") {
      setCurrent(pos);
    } else if (dragMode === "move" && dragTarget) {
      const dx = pos.x - start.x;
      const dy = pos.y - start.y;
      const ob = dragTarget.originalBBox;
      // Clamp to image bounds
      const newX = Math.max(0, Math.min(1 - ob.width, ob.x + dx));
      const newY = Math.max(0, Math.min(1 - ob.height, ob.y + dy));
      onUpdateBBox({ ...ob, x: newX, y: newY });
    } else if (dragMode === "resize" && dragTarget && resizeHandle) {
      const ob = dragTarget.originalBBox;
      const dx = pos.x - start.x;
      const dy = pos.y - start.y;
      let { x, y, width, height } = ob;

      if (resizeHandle.includes("w")) { x = Math.max(0, ob.x + dx); width = ob.width - (x - ob.x); }
      if (resizeHandle.includes("e")) { width = Math.max(0.01, Math.min(1 - x, ob.width + dx)); }
      if (resizeHandle.includes("n")) { y = Math.max(0, ob.y + dy); height = ob.height - (y - ob.y); }
      if (resizeHandle.includes("s")) { height = Math.max(0.01, Math.min(1 - y, ob.height + dy)); }

      if (width > 0.005 && height > 0.005) {
        onUpdateBBox({ ...ob, x, y, width, height });
      }
    }
  };

  const handleMouseUp = () => {
    if (dragMode === "draw" && activeLabel) {
      const x = Math.min(start.x, current.x);
      const y = Math.min(start.y, current.y);
      const w = Math.abs(current.x - start.x);
      const h = Math.abs(current.y - start.y);
      if (w > 0.005 && h > 0.005) {
        onAddBBox({ id: crypto.randomUUID(), labelId: activeLabel.id, x, y, width: w, height: h });
      }
    }
    setDragMode("none");
    setDragTarget(null);
    setResizeHandle(null);
  };

  const startMove = (e: React.MouseEvent, bbox: BBox) => {
    e.stopPropagation();
    const pos = getRelPos(e);
    setStart(pos);
    setDragTarget({ bboxId: bbox.id, originalBBox: { ...bbox } });
    setDragMode("move");
    setSelectedBBox(bbox.id);
  };

  const startResize = (e: React.MouseEvent, bbox: BBox, handle: ResizeHandle) => {
    e.stopPropagation();
    const pos = getRelPos(e);
    setStart(pos);
    setDragTarget({ bboxId: bbox.id, originalBBox: { ...bbox } });
    setResizeHandle(handle);
    setDragMode("resize");
    setSelectedBBox(bbox.id);
  };

  const getLabelForBBox = (bbox: BBox) => labels.find((l) => l.id === bbox.labelId);

  const isNearBBoxEdge = (pos: { x: number; y: number }, bbox: BBox) => {
    // Make the edit/resize hitbox consistent in normalized coordinates.
    // (HANDLE_SIZE pixels -> normalized by current rendered image size)
    if (imgRect.width <= 0 || imgRect.height <= 0) return false;
    const thresholdX = HANDLE_SIZE / (imgRect.width || 1);
    const thresholdY = HANDLE_SIZE / (imgRect.height || 1);

    const distLeft = pos.x - bbox.x;
    const distRight = bbox.x + bbox.width - pos.x;
    const distTop = pos.y - bbox.y;
    const distBottom = bbox.y + bbox.height - pos.y;

    return (
      distLeft <= thresholdX ||
      distRight <= thresholdX ||
      distTop <= thresholdY ||
      distBottom <= thresholdY
    );
  };

  const getHandleCursor = (handle: ResizeHandle): string => {
    const map: Record<ResizeHandle, string> = {
      nw: "nw-resize", ne: "ne-resize", sw: "sw-resize", se: "se-resize",
      n: "n-resize", s: "s-resize", e: "e-resize", w: "w-resize",
    };
    return map[handle];
  };

  const renderHandles = (bbox: BBox) => {
    // CVAT-style separation: show resize handles only when the bbox is selected,
    // not just on hover. This avoids confusion while drawing.
    // When drawing (activeLabel is selected), hide handles entirely.
    if (activeLabel) return null;
    if (selectedBBox !== bbox.id) return null;
    const label = getLabelForBBox(bbox);
    const color = label?.color || "hsl(45,100%,60%)";
    const hs = HANDLE_SIZE;
    const half = hs / 2;

    const positions: { handle: ResizeHandle; style: React.CSSProperties }[] = [
      { handle: "nw", style: { top: -half, left: -half } },
      { handle: "ne", style: { top: -half, right: -half } },
      { handle: "sw", style: { bottom: -half, left: -half } },
      { handle: "se", style: { bottom: -half, right: -half } },
      { handle: "n", style: { top: -half, left: "50%", marginLeft: -half } },
      { handle: "s", style: { bottom: -half, left: "50%", marginLeft: -half } },
      { handle: "w", style: { top: "50%", left: -half, marginTop: -half } },
      { handle: "e", style: { top: "50%", right: -half, marginTop: -half } },
    ];

    return positions.map(({ handle, style }) => (
      <div
        key={handle}
        className="absolute"
        style={{
          ...style,
          width: hs,
          height: hs,
          backgroundColor: color,
          border: "1px solid hsl(220, 20%, 10%)",
          cursor: getHandleCursor(handle),
          zIndex: 10,
        }}
        onMouseDown={(e) => startResize(e, bbox, handle)}
      />
    ));
  };

  const getCursor = () => {
    if (dragMode === "move") return "grabbing";
    if (dragMode === "resize" && resizeHandle) return getHandleCursor(resizeHandle);
    if (activeLabel) return "crosshair";
    return "default";
  };

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full h-full bg-canvas overflow-hidden select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => dragMode !== "none" && handleMouseUp()}
      style={{ cursor: getCursor() }}
    >
      <img
        ref={imgRef}
        src={imageUrl}
        alt="Annotating"
        className="max-w-full max-h-full object-contain"
        onLoad={(e) => {
          const img = e.currentTarget;
          onImageLoad(img.naturalWidth, img.naturalHeight);
          setTimeout(updateImgRect, 50);
        }}
        draggable={false}
      />

      {/* Existing bboxes */}
      {bboxes.map((bbox) => {
        const label = getLabelForBBox(bbox);
        const isSelected = selectedBBox === bbox.id;
        return (
          <div
            key={bbox.id}
            className="absolute group"
            style={{
              left: imgRect.left + bbox.x * imgRect.width,
              top: imgRect.top + bbox.y * imgRect.height,
              width: bbox.width * imgRect.width,
              height: bbox.height * imgRect.height,
              border: `2px solid ${label?.color || "hsl(45, 100%, 60%)"}`,
              backgroundColor: hoveredBBox === bbox.id || isSelected ? `${label?.color}22` : "transparent",
              cursor: activeLabel ? "crosshair" : "grab",
              boxShadow: isSelected ? `0 0 0 1px ${label?.color}88` : "none",
            }}
            onMouseEnter={() => setHoveredBBox(bbox.id)}
            onMouseLeave={() => setHoveredBBox(null)}
            onMouseDown={(e) => {
              const pos = getRelPos(e);

              // While drawing (activeLabel is set), prioritize creating a new bbox.
              // Only start move when user clicks near bbox edges (or holds Alt).
              // When no label is selected, allow move from anywhere inside the bbox.
              if (activeLabel) {
                if (!e.altKey && !isNearBBoxEdge(pos, bbox)) return;
              }
              startMove(e, bbox);
            }}
          >
            <span
              className="absolute -top-5 left-0 text-[10px] font-bold px-1 rounded-sm whitespace-nowrap"
              style={{ backgroundColor: label?.color, color: "hsl(220, 20%, 10%)" }}
            >
              {label?.name}
            </span>
            <button
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] leading-none hidden group-hover:flex items-center justify-center z-20"
              onClick={(e) => { e.stopPropagation(); onDeleteBBox(bbox.id); }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              ×
            </button>
            {renderHandles(bbox)}
          </div>
        );
      })}

      {/* Drawing bbox */}
      {dragMode === "draw" && (
        <div
          className="absolute border-2 border-dashed pointer-events-none"
          style={{
            left: imgRect.left + Math.min(start.x, current.x) * imgRect.width,
            top: imgRect.top + Math.min(start.y, current.y) * imgRect.height,
            width: Math.abs(current.x - start.x) * imgRect.width,
            height: Math.abs(current.y - start.y) * imgRect.height,
            borderColor: activeLabel?.color || "hsl(160, 80%, 45%)",
          }}
        />
      )}

      {!activeLabel && bboxes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-muted-foreground text-sm">Select a label, then draw bounding boxes</p>
        </div>
      )}
    </div>
  );
};

export default AnnotationCanvas;
