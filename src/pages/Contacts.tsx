import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Phone, Upload } from "lucide-react";

const contactStats = [
  { label: "Not Called", value: "3,714", color: "text-foreground" },
  { label: "Called — No Answer", value: "2,241", color: "text-foreground" },
  { label: "Connected — No Interest", value: "1,400", color: "text-foreground" },
  { label: "Meeting Booked", value: "345", color: "text-success" },
  { label: "DNC (Do Not Call)", value: "200", color: "text-destructive" },
];

const contacts = [
  {
    name: "James Mitchell",
    phone: "+1 (512) 849-2201",
    company: "Acme Corp",
    campaign: "SaaS Outreach Q1",
    status: "MEETING SET",
    statusColor: "bg-success/10 text-success",
    lastCalled: "Today 2:14pm",
  },
  {
    name: "Sarah Rosenberg",
    phone: "+1 (718) 334-7091",
    company: "Realty Group",
    campaign: "Real Estate Leads",
    status: "ON CALL",
    statusColor: "bg-primary/10 text-primary",
    lastCalled: "Now",
  },
  {
    name: "David Kim",
    phone: "+1 (206) 771-4423",
    company: "Pacific Homes",
    campaign: "Real Estate Leads",
    status: "ON CALL",
    statusColor: "bg-primary/10 text-primary",
    lastCalled: "Now",
  },
];

const Contacts = () => {
  return (
      <div className="p-6 lg:p-8 max-w-[1400px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Contacts</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Upload and manage your contact lists</p>
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

        {/* Upload + Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4 mb-4">
          {/* Upload area */}
          <div className="rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center py-12 px-6 cursor-pointer hover:border-primary/40 transition-colors">
            <Upload className="h-8 w-8 text-muted-foreground mb-3" />
            <p className="text-base font-semibold text-foreground">Upload Contact List</p>
            <p className="text-sm text-muted-foreground mt-1 text-center">
              CSV or Excel · Required columns: name, phone<br />
              Optional: email, company, notes
            </p>
          </div>

          {/* Stats */}
          <Card className="border border-border shadow-none">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-3xl font-bold text-foreground">7,900</p>
                <Badge variant="outline" className="text-primary border-primary font-semibold text-xs">
                  TOTAL CONTACTS
                </Badge>
              </div>
              <div className="space-y-2.5">
                {contactStats.map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{s.label}</span>
                    <span className={`text-sm font-bold ${s.color}`}>{s.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Database */}
        <Card className="border border-border shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Contact Database</CardTitle>
              <div className="flex items-center gap-3">
                <Input placeholder="Search contacts..." className="w-48 h-8 text-sm" />
                <select className="h-8 rounded-md border border-input bg-background px-3 text-sm text-foreground">
                  <option>All Contacts</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">Name</th>
                    <th className="text-left p-4 text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">Phone</th>
                    <th className="text-left p-4 text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">Company</th>
                    <th className="text-left p-4 text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">Campaign</th>
                    <th className="text-left p-4 text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">Status</th>
                    <th className="text-left p-4 text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">Last Called</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c) => (
                    <tr key={c.name} className="border-b last:border-0">
                      <td className="p-4 text-sm font-medium text-foreground">{c.name}</td>
                      <td className="p-4 text-sm text-muted-foreground">{c.phone}</td>
                      <td className="p-4 text-sm text-foreground">{c.company}</td>
                      <td className="p-4 text-sm text-foreground">{c.campaign}</td>
                      <td className="p-4">
                        <Badge className={`${c.statusColor} border-0 text-[10px] font-semibold tracking-wider`}>
                          {c.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{c.lastCalled}</td>
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

export default Contacts;