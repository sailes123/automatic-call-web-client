import { useState } from "react";
import { type Label } from "@/types/annotation";
import { Plus, X } from "lucide-react";

const PRESET_COLORS = [
  "hsl(160, 80%, 45%)",
  "hsl(200, 70%, 50%)",
  "hsl(45, 100%, 60%)",
  "hsl(0, 70%, 55%)",
  "hsl(280, 60%, 55%)",
  "hsl(30, 90%, 55%)",
  "hsl(330, 70%, 55%)",
  "hsl(180, 60%, 45%)",
];

interface LabelManagerProps {
  labels: Label[];
  activeLabel: Label | null;
  onAddLabel: (label: Label) => void;
  onRemoveLabel: (id: string) => void;
  onSelectLabel: (label: Label) => void;
}

const LabelManager = ({ labels, activeLabel, onAddLabel, onRemoveLabel, onSelectLabel }: LabelManagerProps) => {
  const [newName, setNewName] = useState("");

  const handleAdd = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const color = PRESET_COLORS[labels.length % PRESET_COLORS.length];
    onAddLabel({ id: crypto.randomUUID(), name: trimmed, color });
    setNewName("");
  };

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Labels</h2>
      <div className="flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="New label..."
          className="flex-1 rounded-md bg-muted px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring"
        />
        <button onClick={handleAdd} className="rounded-md bg-primary p-1.5 text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus size={16} />
        </button>
      </div>
      <div className="flex flex-col gap-1.5">
        {labels.map((label) => (
          <div
            key={label.id}
            onClick={() => onSelectLabel(label)}
            className={`flex items-center justify-between rounded-md px-3 py-2 text-sm cursor-pointer transition-all ${
              activeLabel?.id === label.id ? "ring-1 ring-ring bg-secondary" : "hover:bg-secondary/50"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: label.color }} />
              <span className="truncate">{label.name}</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onRemoveLabel(label.id); }}
              className="text-muted-foreground hover:text-destructive transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        {labels.length === 0 && (
          <p className="text-xs text-muted-foreground italic">Add a label to start annotating</p>
        )}
      </div>
    </div>
  );
};

export default LabelManager;
