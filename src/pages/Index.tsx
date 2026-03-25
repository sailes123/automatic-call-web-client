import { StatCard } from "@/components/stat-card";
import { ActiveCampaigns } from "@/components/active-campaigns";
import { CallOutcomeFunnel } from "@/components/call-outcome-funnel";
import { Button } from "@/components/ui/button";
import { Plus, Phone } from "lucide-react";

const stats = [
  {
    label: "Calls Today",
    value: "1,847",
    change: "+12% vs yesterday",
    trend: "up" as const,
    bars: { color: "hsl(230,70%,55%)", heights: [40, 55, 35, 60, 50, 70, 80, 100] },
  },
  {
    label: "Connect Rate",
    value: "34.2%",
    change: "+4.1% this week",
    trend: "up" as const,
    bars: { color: "hsl(142,60%,45%)", heights: [50, 45, 60, 55, 70, 65, 80, 90, 100] },
  },
  {
    label: "Meetings Set",
    value: "142",
    change: "+8 above target",
    trend: "up" as const,
    bars: { color: "hsl(270,60%,55%)", heights: [30, 45, 40, 55, 60, 75, 85, 100] },
  },
  {
    label: "Avg Call Duration",
    value: "2:47",
    change: "-12s vs last week",
    trend: "down" as const,
    bars: { color: "hsl(220,10%,55%)", heights: [80, 70, 60, 65, 55, 50, 45] },
  },
];

const Index = () => {
  return (
      <div className="p-6 lg:p-8 max-w-[1400px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Welcome back — here's what's happening today
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" /> New Campaign
            </Button>
            <Button className="gap-2">
              <Phone className="h-4 w-4" /> Start Calls
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4">
          <ActiveCampaigns />
          <CallOutcomeFunnel />
        </div>
      </div>
  );
};

export default Index;