import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const funnelData = [
  { label: "DIALED", value: 1847, percent: "100%", color: "hsl(220,10%,75%)", width: 100 },
  { label: "CONNECTED", value: 631, percent: "34%", color: "hsl(230,70%,55%)", width: 55 },
  { label: "ENGAGED", value: 221, percent: "12%", color: "hsl(270,60%,55%)", width: 30 },
  { label: "BOOKED", value: 142, percent: "7.7%", color: "hsl(142,60%,45%)", width: 20 },
  { label: "VOICEMAIL", value: 775, percent: "42%", color: "hsl(45,90%,55%)", width: 50 },
  { label: "NO ANSWER", value: 441, percent: "24%", color: "hsl(0,70%,65%)", width: 35 },
];

export function CallOutcomeFunnel() {
  return (
    <Card className="border border-border shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Call Outcome Funnel</CardTitle>
            <p className="text-sm text-muted-foreground">Today's breakdown</p>
          </div>
          <Badge variant="outline" className="text-primary border-primary font-semibold text-xs">
            TODAY
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {funnelData.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground w-24 shrink-0">
                {item.label}
              </span>
              <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${item.width}%`, backgroundColor: item.color }}
                />
              </div>
              <span className="text-sm font-bold text-foreground w-12 text-right">
                {item.value.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground w-10 text-right">
                {item.percent}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}