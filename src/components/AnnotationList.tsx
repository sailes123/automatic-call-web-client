import { type BBox, type Label } from "@/types/annotation";
import { Trash2 } from "lucide-react";

interface AnnotationListProps {
  bboxes: BBox[];
  labels: Label[];
  onDelete: (id: string) => void;
}

const AnnotationList = ({ bboxes, labels, onDelete }: AnnotationListProps) => {
  const getLabel = (id: string) => labels.find((l) => l.id === id);

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Annotations ({bboxes.length})
      </h2>
      <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
        {bboxes.map((bbox, i) => {
          const label = getLabel(bbox.labelId);
          return (
            <div key={bbox.id} className="flex items-center justify-between rounded-md bg-secondary/50 px-2 py-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: label?.color }} />
                <span className="text-muted-foreground">#{i + 1}</span>
                <span className="truncate">{label?.name}</span>
              </div>
              <button onClick={() => onDelete(bbox.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 size={12} />
              </button>
            </div>
          );
        })}
        {bboxes.length === 0 && <p className="text-xs text-muted-foreground italic">No annotations yet</p>}
      </div>
    </div>
  );
};

export default AnnotationList;
