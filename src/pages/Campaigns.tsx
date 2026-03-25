
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, Phone } from "lucide-react";

const filters = [
  { label: "4 Total", active: true, color: "text-foreground" },
  { label: "2 Live", active: false, color: "text-success" },
  { label: "1 Queued", active: false, color: "text-warning" },
  { label: "1 Done", active: false, color: "text-muted-foreground" },
];

const campaigns = [
  {
    name: "SaaS Outreach Q1",
    agent: "Aria",
    date: "Created Mar 1",
    contacts: 2400,
    current: 842,
    total: 2400,
    progress: 35,
    progressColor: "bg-primary",
    connectRate: "36.2%",
    meetings: 58,
    status: "LIVE",
    statusColor: "bg-success/10 text-success",
    action: "Pause",
  },
  {
    name: "Real Estate Leads",
    agent: "Max",
    date: "Created Mar 10",
    contacts: 1500,
    current: 1201,
    total: 1500,
    progress: 80,
    progressColor: "bg-success",
    connectRate: "31.5%",
    meetings: 84,
    status: "LIVE",
    statusColor: "bg-success/10 text-success",
    action: "Pause",
  },
  {
    name: "Insurance Renewal",
    agent: "Aria",
    date: "Starts today 9AM",
    contacts: 800,
    current: 0,
    total: 800,
    progress: 0,
    progressColor: "bg-muted-foreground",
    connectRate: "—",
    meetings: "—",
    status: "QUEUED",
    statusColor: "bg-warning/10 text-warning",
    action: "Edit",
  },
  {
    name: "E-comm Re-engage",
    agent: "Luna",
    date: "Ended Mar 18",
    contacts: 3200,
    current: 3200,
    total: 3200,
    progress: 100,
    progressColor: "bg-muted-foreground",
    connectRate: "28.4%",
    meetings: 203,
    status: "DONE",
    statusColor: "bg-muted text-muted-foreground",
    action: "Report",
  },
];

const Campaigns = () => {
  return (
      <div className="p-6 lg:p-8 max-w-[1400px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Campaigns</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage and launch AI cold calling campaigns</p>
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

        {/* Filters + Create */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {filters.map((f) => (
              <Badge key={f.label} variant="outline" className={`${f.color} font-semibold text-xs px-3 py-1`}>
                {f.label}
              </Badge>
            ))}
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Create Campaign
          </Button>
        </div>

        {/* Table */}
        <Card className="border border-border shadow-none">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">Campaign Name</th>
                    <th className="text-left p-4 text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">Contacts</th>
                    <th className="text-left p-4 text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">Progress</th>
                    <th className="text-left p-4 text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">Connect Rate</th>
                    <th className="text-left p-4 text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">Meetings</th>
                    <th className="text-left p-4 text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">Status</th>
                    <th className="text-left p-4 text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c) => (
                    <tr key={c.name} className="border-b last:border-0">
                      <td className="p-4">
                        <p className="text-sm font-semibold text-foreground">{c.name}</p>
                        <p className="text-xs text-muted-foreground">Agent: {c.agent} · {c.date}</p>
                      </td>
                      <td className="p-4 text-sm font-semibold text-foreground">{c.contacts.toLocaleString()}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 w-32">
                          <Progress value={c.progress} className="h-1.5 flex-1" />
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {c.current.toLocaleString()} / {c.total.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-sm font-semibold text-success">{c.connectRate}</td>
                      <td className="p-4 text-sm font-bold text-primary">{c.meetings}</td>
                      <td className="p-4">
                        <Badge className={`${c.statusColor} border-0 text-[10px] font-semibold tracking-wider`}>
                          {c.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground hover:text-foreground cursor-pointer">{c.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default Campaigns;
