import { type BBox, type Label } from "@/types/annotation";
import { Download, Copy, Check } from "lucide-react";
import { useState } from "react";

interface ExportPanelProps {
  bboxes: BBox[];
  labels: Label[];
  naturalWidth: number;
  naturalHeight: number;
  imageName: string;
}

const ExportPanel = ({ bboxes, labels, naturalWidth, naturalHeight, imageName }: ExportPanelProps) => {
  const [copied, setCopied] = useState(false);
  console.log(naturalWidth, naturalHeight);

  const generateYoloTxt = () => {
    const labelIndex = labels.reduce<Record<string, number>>((acc, l, i) => {
      acc[l.id] = i;
      return acc;
    }, {});

    return bboxes
      .map((bbox) => {
        const classId = labelIndex[bbox.labelId] ?? 0;
        const xCenter = bbox.x + bbox.width / 2;
        const yCenter = bbox.y + bbox.height / 2;
        return `${classId} ${xCenter.toFixed(6)} ${yCenter.toFixed(6)} ${bbox.width.toFixed(6)} ${bbox.height.toFixed(6)}`;
      })
      .join("\n");
  };

  const generateClassesTxt = () => labels.map((l) => l.name).join("\n");

  const handleDownload = () => {
    const txt = generateYoloTxt();
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = imageName.replace(/\.[^.]+$/, ".txt");
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadClasses = () => {
    const txt = generateClassesTxt();
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "classes.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generateYoloTxt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const yoloText = generateYoloTxt();

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">YOLOv8 Export</h2>

      {bboxes.length > 0 ? (
        <>
          <pre className="rounded-md bg-canvas p-3 text-[11px] text-foreground overflow-x-auto font-mono max-h-32 overflow-y-auto">
            {yoloText}
          </pre>
          <p className="text-[10px] text-muted-foreground">
            Format: class_id x_center y_center width height (normalized 0-1)
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Download size={12} /> Labels .txt
            </button>
            <button
              onClick={handleDownloadClasses}
              className="flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:opacity-90 transition-opacity"
            >
              <Download size={12} /> classes.txt
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:opacity-90 transition-opacity"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </>
      ) : (
        <p className="text-xs text-muted-foreground italic">Draw annotations to see export</p>
      )}
    </div>
  );
};

export default ExportPanel;
