import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const campaigns = [
  {
    name: "SaaS Outreach Q1",
    progress: 35,
    current: 842,
    total: 2400,
    status: "LIVE",
    booked: 58,
    color: "hsl(230, 70%, 55%)",
  },
  {
    name: "Real Estate Leads",
    progress: 80,
    current: 1201,
    total: 1500,
    status: "LIVE",
    booked: 84,
    color: "hsl(142, 60%, 45%)",
  },
];

export function ActiveCampaigns() {
  return (
    <Card className="border border-border shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Active Campaigns</CardTitle>
            <p className="text-sm text-muted-foreground">Running right now</p>
          </div>
          <button className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            View all →
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 text-[11px] font-semibold tracking-wider uppercase text-muted-foreground border-b pb-2 mb-3">
          <span>Campaign</span>
          <span>Progress</span>
          <span>Status</span>
          <span>Booked</span>
        </div>
        <div className="space-y-5">
          {campaigns.map((c) => (
            <div key={c.name} className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 items-center">
              <div>
                <p className="text-sm font-medium text-foreground">{c.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {c.current.toLocaleString()} / {c.total.toLocaleString()} contacts
                </p>
              </div>
              <div className="flex items-center gap-2 w-28">
                <Progress value={c.progress} className="h-1.5 flex-1" />
                <span className="text-xs text-muted-foreground">{c.progress}%</span>
              </div>
              <Badge className="bg-success/10 text-success border-0 text-[10px] font-semibold tracking-wider">
                {c.status}
              </Badge>
              <span className="text-lg font-bold text-foreground text-right w-10">{c.booked}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}