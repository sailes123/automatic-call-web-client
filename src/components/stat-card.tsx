import { ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  bars: { color: string; heights: number[] };
}

export function StatCard({ label, value, change, trend, bars }: StatCardProps) {
  return (
    <Card className="border border-border shadow-none">
      <CardContent className="p-5">
        <p className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground mb-1">
          {label}
        </p>
        <p className="text-3xl font-bold text-foreground leading-tight">{value}</p>
        <div className="flex items-center gap-1 mt-1">
          {trend === "up" ? (
            <ArrowUp className="h-3 w-3 text-success" />
          ) : (
            <ArrowDown className="h-3 w-3 text-destructive" />
          )}
          <span className={`text-xs font-medium ${trend === "up" ? "text-success" : "text-destructive"}`}>
            {change}
          </span>
        </div>
        <div className="flex items-end gap-1 mt-3 h-6">
          {bars.heights.map((h, i) => (
            <div
              key={i}
              className="w-3 rounded-sm"
              style={{
                height: `${h}%`,
                backgroundColor: bars.color,
                opacity: 0.4 + (i / bars.heights.length) * 0.6,
              }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}