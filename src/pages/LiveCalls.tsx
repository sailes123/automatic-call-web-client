import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Phone } from "lucide-react";

const activeCalls = [
  { initials: "JM", name: "James Mitchell", campaign: "SaaS Outreach Q1", duration: "1:42", color: "bg-primary" },
  { initials: "SR", name: "Sarah Rosenberg", campaign: "Real Estate Leads", duration: "0:54", color: "bg-success" },
  { initials: "DK", name: "David Kim", campaign: "Real Estate Leads", duration: "3:18", color: "bg-purple" },
];

const transcript = [
  { speaker: "AI", text: "Hi James, this is Aria calling from TechFlow Solutions. I noticed your company recently expanded — do you have 90 seconds?" },
  { speaker: "HMN", text: "Yeah, sure. Who is this again?" },
  { speaker: "AI", text: "I'm Aria, an AI assistant at TechFlow. We help SaaS teams reduce customer churn by up to 40% through proactive onboarding. I wanted to ask — what's your biggest retention challenge right now?" },
  { speaker: "HMN", text: "That's actually a fair question. We've been struggling with the onboarding drop-off — people sign up then ghost us..." },
];

const dialerQueue = [
  { position: 4, name: "Maria Chen" },
  { position: 5, name: "Robert Taylor" },
  { position: 6, name: "Lisa Johnson" },
];

const LiveCalls = () => {
  return (
      <div className="p-6 lg:p-8 max-w-[1400px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Live Calls</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Monitor active AI agent calls in real time</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4">
          {/* Left column */}
          <div className="space-y-4">
            {/* Active Calls */}
            <Card className="border border-border shadow-none">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">Active Calls</CardTitle>
                    <p className="text-sm text-muted-foreground">3 agents on calls now</p>
                  </div>
                  <Badge className="bg-success/10 text-success border-0 gap-1.5 font-semibold">
                    <span className="h-2 w-2 rounded-full bg-success" />
                    LIVE
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeCalls.map((call) => (
                  <div
                    key={call.name}
                    className="flex items-center gap-3 rounded-xl bg-success/5 border border-success/20 px-4 py-3"
                  >
                    <div className={`h-9 w-9 rounded-full ${call.color} text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0`}>
                      {call.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{call.name}</p>
                      <p className="text-xs text-muted-foreground">{call.campaign}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-1 rounded-full bg-primary" style={{ height: `${8 + i * 4}px` }} />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-foreground ml-1">{call.duration}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Dialer Queue */}
            <Card className="border border-border shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Dialer Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {dialerQueue.map((item) => (
                    <div key={item.position} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">#{item.position}</span>
                        <span className="text-sm font-medium text-foreground">{item.name}</span>
                      </div>
                      <Badge variant="outline" className="text-warning border-warning/30 bg-warning/10 text-[10px] font-semibold tracking-wider">
                        QUEUED
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Transcript */}
          <Card className="border border-border shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">
                    Live Transcript — James Mitchell
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">SaaS Outreach Q1 · Aria Agent</p>
                </div>
                <Badge className="bg-success/10 text-success border-0 gap-1.5 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                  STREAMING
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {transcript.map((msg, i) => (
                <div key={i} className="flex gap-3">
                  <span className={`text-xs font-bold shrink-0 mt-0.5 ${msg.speaker === "AI" ? "text-primary" : "text-purple"}`}>
                    {msg.speaker}
                  </span>
                  <p className="text-sm text-foreground leading-relaxed">{msg.text}</p>
                </div>
              ))}

              <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground">Sentiment</p>
                  <p className="text-sm font-bold text-success mt-0.5">Positive ↑</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground">Intent Signal</p>
                  <p className="text-sm font-bold text-purple mt-0.5">Meeting Likely</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export default LiveCalls;