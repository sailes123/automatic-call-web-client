import { useEffect, useMemo, useState } from "react";

type SectionId =
  | "dashboard"
  | "live"
  | "campaigns"
  | "contacts"
  | "agents"
  | "logs"
  | "analytics"
  | "settings";

type NavItem = {
  id: SectionId;
  label: string;
  section: "Overview" | "Campaigns" | "Reporting" | "Account";
  badge?: { text: string; type: "green" | "gray" };
};

type TranscriptKey = "james" | "sarah" | "david";

type Transcript = {
  name: string;
  campaign: string;
  msgs: Array<["AI" | "HMN", string]>;
};

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", section: "Overview" },
  { id: "live", label: "Live Calls", section: "Overview", badge: { text: "3", type: "green" } },
  { id: "campaigns", label: "All Campaigns", section: "Campaigns", badge: { text: "4", type: "gray" } },
  { id: "contacts", label: "Contacts", section: "Campaigns" },
  { id: "agents", label: "AI Agents", section: "Campaigns" },
  { id: "logs", label: "Call Logs", section: "Reporting" },
  { id: "analytics", label: "Analytics", section: "Reporting" },
  { id: "settings", label: "Settings", section: "Account" },
];

const pageMeta: Record<SectionId, [string, string]> = {
  dashboard: ["Dashboard", "Welcome back - here's what's happening today"],
  live: ["Live Calls", "Monitor active AI agent calls in real time"],
  campaigns: ["Campaigns", "Manage and launch AI cold calling campaigns"],
  contacts: ["Contacts", "Upload and manage your contact lists"],
  agents: ["AI Agents", "Build and configure your AI voice agents"],
  logs: ["Call Logs", "Full call history with transcripts and outcomes"],
  analytics: ["Analytics", "30-day performance across all campaigns"],
  settings: ["Settings", "Configure Retell AI integration and preferences"],
};

const transcripts: Record<TranscriptKey, Transcript> = {
  james: {
    name: "James Mitchell",
    campaign: "SaaS Outreach Q1 - Aria Agent",
    msgs: [
      ["AI", "Hi James, this is Aria from TechFlow. Do you have 90 seconds?"],
      ["HMN", "Sure, what is this about?"],
      ["AI", "We help SaaS companies cut churn by 40%. What's your biggest retention challenge?"],
      ["HMN", "Honestly? Onboarding drop-off. Week two is brutal."],
      ["AI", "That's exactly what we solve. Want a quick 20-min demo Thursday?"],
      ["HMN", "Thursday at 2pm could work..."],
    ],
  },
  sarah: {
    name: "Sarah Rosenberg",
    campaign: "Real Estate Leads - Max Agent",
    msgs: [
      ["AI", "Hi Sarah, this is Max calling about property listings in your area. Quick moment?"],
      ["HMN", "Oh sure, hi."],
      ["AI", "We have off-market properties coming up in Brooklyn - 3BR under $850k. Are you still looking?"],
      ["HMN", "Actually yes, we've been looking for a few months now."],
      ["AI", "Perfect timing. Can I book a quick call with our agent this week?"],
    ],
  },
  david: {
    name: "David Kim",
    campaign: "Real Estate Leads - Max Agent",
    msgs: [
      ["AI", "Hi David, this is Max from Pacific Realty. Are you still interested in investment properties in Seattle?"],
      ["HMN", "Yeah I am. What do you have?"],
      ["AI", "We have a duplex in Capitol Hill, 6.8% cap rate, fully tenanted. Would you like details?"],
      ["HMN", "Definitely. Can you email me the breakdown?"],
      ["AI", "Absolutely - what's the best email?"],
      ["HMN", "david.kim@outlook.com"],
      ["AI", "Got it, sending now. Also - would you like to schedule a walkthrough?"],
    ],
  },
};

const toDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
};

const Index = () => {
  const [activeSection, setActiveSection] = useState<SectionId>("dashboard");
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [showCreateCampaignModal, setShowCreateCampaignModal] = useState(false);
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);
  const [showAgentModal, setShowAgentModal] = useState(false);

  const [timers, setTimers] = useState([102, 54, 198]);
  const [dots, setDots] = useState(1);
  const [activeTranscriptKey, setActiveTranscriptKey] = useState<TranscriptKey>("james");

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimers((prev) => prev.map((t) => t + 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const typing = window.setInterval(() => {
      setDots((d) => ((d + 1) % 4) || 1);
    }, 500);

    return () => window.clearInterval(typing);
  }, []);

  const liveTranscript = useMemo(() => transcripts[activeTranscriptKey], [activeTranscriptKey]);

  return (
    <>
      <style>{`
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      :root {
        --bg: #f8f9fb; --surface: #ffffff; --surface2: #f3f4f6; --border: #e5e7eb; --border2: #d1d5db;
        --text: #111827; --text2: #6b7280; --text3: #9ca3af; --accent: #2563eb; --accent-light: #eff6ff;
        --accent-hover: #1d4ed8; --green: #16a34a; --green-light: #f0fdf4; --green-border: #bbf7d0;
        --amber: #d97706; --amber-light: #fffbeb; --amber-border: #fde68a; --red: #dc2626;
        --red-light: #fef2f2; --red-border: #fecaca; --purple: #7c3aed; --purple-light: #f5f3ff;
        --shadow-sm: 0 1px 2px rgba(0,0,0,0.05); --radius: 8px; --radius-lg: 12px;
      }
      body { font-family: Inter, sans-serif; background: var(--bg); color: var(--text); font-size: 14px; line-height: 1.5; }
      .va-app { display: flex; height: 100vh; overflow: hidden; }
      .va-sidebar { width: 240px; background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; }
      .va-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
      .va-logo { padding: 20px 16px 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; }
      .va-logo-icon { width: 32px; height: 32px; background: var(--accent); border-radius: 8px; display: grid; place-items: center; color: #fff; }
      .va-logo-name { font-size: 15px; font-weight: 700; }
      .va-logo-tag { font-size: 10px; color: var(--text3); letter-spacing: 0.5px; font-family: monospace; }
      .va-nav { flex: 1; padding: 12px 8px; overflow-y: auto; }
      .va-label { font-size: 10px; font-weight: 600; color: var(--text3); letter-spacing: 0.8px; padding: 8px 10px 4px; text-transform: uppercase; }
      .va-nav-item { display:flex; align-items:center; gap:10px; padding:9px 10px; border-radius:var(--radius); font-size:13px; font-weight:500; color:var(--text2); cursor:pointer; }
      .va-nav-item:hover { background: var(--surface2); color: var(--text); }
      .va-nav-item.active { background: var(--accent-light); color: var(--accent); }
      .va-badge { margin-left:auto; font-size:10px; font-weight:600; padding:2px 7px; border-radius:20px; }
      .va-badge.green { background: var(--green-light); color: var(--green); }
      .va-badge.gray { background: var(--surface2); color: var(--text2); }
      .va-footer { padding:12px 16px; border-top:1px solid var(--border); }
      .status-pill { display:flex; align-items:center; gap:8px; background:var(--green-light); border:1px solid var(--green-border); border-radius:20px; padding:6px 12px; }
      .status-dot { width:7px; height:7px; border-radius:50%; background:var(--green); }
      .status-text { font-size:11px; color:var(--green); font-weight:700; font-family: monospace; }
      .va-topbar { display:flex; justify-content:space-between; align-items:center; padding:16px 24px; border-bottom:1px solid var(--border); background:#fff; }
      .btn { display:inline-flex; align-items:center; justify-content:center; gap:6px; border-radius:var(--radius); padding:8px 14px; border:none; cursor:pointer; font-size:13px; }
      .btn-primary { background:var(--accent); color:#fff; }
      .btn-primary:hover { background:var(--accent-hover); }
      .btn-outline { background:#fff; border:1px solid var(--border2); }
      .btn-outline:hover { background: var(--surface2); }
      .btn-ghost { background:transparent; color:var(--text2); }
      .btn-ghost:hover { background:var(--surface2); color:var(--text); }
      .content { flex:1; overflow:auto; padding:24px; }
      .stats-grid { display:grid; grid-template-columns:repeat(4, 1fr); gap:16px; margin-bottom:20px; }
      .stat-card, .card { background:#fff; border:1px solid var(--border); border-radius:var(--radius-lg); box-shadow: var(--shadow-sm); }
      .stat-card { padding:18px 20px; }
      .stat-label { font-size:11px; color:var(--text3); text-transform:uppercase; font-weight:600; margin-bottom:8px; }
      .stat-value { font-size:26px; font-weight:700; line-height:1; margin-bottom:6px; }
      .grid-2 { display:grid; grid-template-columns: 1fr 1fr; gap:16px; }
      .card-header { display:flex; justify-content:space-between; align-items:center; padding:16px 20px; border-bottom:1px solid var(--border); }
      .card-title { font-size:13px; font-weight:600; }
      .card-subtitle { font-size:12px; color:var(--text3); }
      .card-body { padding:20px; }
      .table-wrap { overflow:auto; }
      table { width:100%; border-collapse:collapse; }
      th { text-align:left; font-size:11px; color:var(--text3); text-transform:uppercase; padding:10px 16px; background:var(--surface2); border-bottom:1px solid var(--border); }
      td { padding:13px 16px; border-bottom:1px solid var(--border); font-size:13px; vertical-align: middle; }
      .badge { font-size:11px; padding:3px 8px; border-radius:20px; font-family: monospace; font-weight:700; }
      .badge-green { background: var(--green-light); color: var(--green); border:1px solid var(--green-border); }
      .badge-amber { background: var(--amber-light); color: var(--amber); border:1px solid var(--amber-border); }
      .badge-purple { background: var(--purple-light); color: var(--purple); border:1px solid #ddd6fe; }
      .badge-gray { background: var(--surface2); color: var(--text2); border:1px solid var(--border); }
      .badge-blue { background: var(--accent-light); color: var(--accent); border:1px solid #bfdbfe; }
      .progress-wrap { background: var(--surface2); border-radius: 4px; height: 6px; overflow: hidden; }
      .progress-fill { height: 100%; border-radius: 4px; }
      .funnel-row { display:flex; align-items:center; gap:12px; margin-bottom:10px; }
      .funnel-label { width:90px; font-size:11px; color:var(--text2); font-weight:700; font-family:monospace; }
      .funnel-bar-wrap { flex:1; background:var(--surface2); border-radius:4px; height:8px; overflow:hidden; }
      .funnel-count { width:45px; text-align:right; font-size:12px; font-weight:700; font-family:monospace; }
      .funnel-pct { width:36px; text-align:right; font-size:11px; color:var(--text3); font-family:monospace; }
      .live-card { display:flex; justify-content:space-between; align-items:center; padding:14px 16px; border:1px solid var(--border); border-radius:var(--radius-lg); }
      .active-call { border-color:#bbf7d0; background:#f0fdf4; }
      .avatar { width:34px; height:34px; border-radius:8px; display:grid; place-items:center; font-size:12px; font-weight:700; }
      .wave { display:flex; align-items:center; gap:2px; height:18px; }
      .wave > span { width:3px; border-radius:2px; background:var(--green); height:10px; }
      .section { display:none; }
      .section.active { display:block; }
      .text-sm { font-size: 12px; }
      .text-muted { color:var(--text3); }
      .font-mono { font-family: monospace; }
      .mb-4 { margin-bottom: 16px; }
      .mb-5 { margin-bottom: 20px; }
      .mt-4 { margin-top: 16px; }
      .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.4); display:none; z-index:99; align-items:center; justify-content:center; }
      .modal-overlay.open { display:flex; }
      .modal { background:#fff; width:600px; max-width:95vw; max-height:85vh; overflow:auto; border-radius:var(--radius-lg); }
      .modal-header,.modal-footer { padding:16px 24px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; }
      .modal-footer { border-top:1px solid var(--border); border-bottom:none; justify-content:flex-end; gap:10px; }
      .modal-body { padding:24px; }
      .modal-close { border:none; background:transparent; cursor:pointer; font-size:18px; color:var(--text3); }
      .transcript-box { background: var(--surface2); border:1px solid var(--border); border-radius:var(--radius-lg); padding:16px; max-height:320px; overflow:auto; display:flex; flex-direction:column; gap:12px; }
      .msg { display:flex; gap:10px; }
      .msg-role { width:36px; font-size:10px; font-weight:700; padding-top:3px; font-family: monospace; }
      .msg-role.ai { color: var(--accent); }
      .msg-role.human { color: var(--purple); }
      .form-group { margin-bottom: 16px; }
      .form-label { display:block; margin-bottom:6px; font-size:12px; font-weight:600; }
      input, select, textarea { width:100%; padding:9px 12px; border:1px solid var(--border2); border-radius:var(--radius); font-size:13px; }
      textarea { min-height:100px; resize:vertical; }
      @media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(2, 1fr);} .grid-2 { grid-template-columns:1fr;} .va-sidebar { width:200px; } }
      `}</style>

      <div className="va-app">
        <aside className="va-sidebar">
          <div className="va-logo">
            <div className="va-logo-icon">VA</div>
            <div>
              <div className="va-logo-name">VoiceAgent</div>
              <div className="va-logo-tag">POWERED BY RETELL AI</div>
            </div>
          </div>

          <nav className="va-nav">
            {(["Overview", "Campaigns", "Reporting", "Account"] as const).map((section) => (
              <div key={section}>
                <div className="va-label">{section}</div>
                {navItems
                  .filter((item) => item.section === section)
                  .map((item) => (
                    <div
                      key={item.id}
                      className={`va-nav-item ${activeSection === item.id ? "active" : ""}`}
                      onClick={() => setActiveSection(item.id)}
                    >
                      {item.label}
                      {item.badge ? <span className={`va-badge ${item.badge.type}`}>{item.badge.text}</span> : null}
                    </div>
                  ))}
              </div>
            ))}
          </nav>

          <div className="va-footer">
            <div className="status-pill">
              <div className="status-dot" />
              <div className="status-text">3 CALLS LIVE</div>
            </div>
          </div>
        </aside>

        <main className="va-main">
          <div className="va-topbar">
            <div>
              <div style={{ fontSize: 17, fontWeight: 700 }}>{pageMeta[activeSection][0]}</div>
              <div style={{ fontSize: 12, color: "var(--text3)" }}>{pageMeta[activeSection][1]}</div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-outline" onClick={() => setActiveSection("campaigns")}>New Campaign</button>
              <button className="btn btn-primary" onClick={() => setShowLaunchModal(true)}>Start Calls</button>
            </div>
          </div>

          <div className="content">
            <section className={`section ${activeSection === "dashboard" ? "active" : ""}`}>
              <div className="stats-grid">
                <div className="stat-card"><div className="stat-label">Calls Today</div><div className="stat-value">1,847</div><div style={{ color: "var(--green)", fontSize: 11 }}>+12% vs yesterday</div></div>
                <div className="stat-card"><div className="stat-label">Connect Rate</div><div className="stat-value" style={{ color: "var(--green)" }}>34.2%</div><div style={{ color: "var(--green)", fontSize: 11 }}>+4.1% this week</div></div>
                <div className="stat-card"><div className="stat-label">Meetings Set</div><div className="stat-value" style={{ color: "var(--purple)" }}>142</div><div style={{ color: "var(--green)", fontSize: 11 }}>+8 above target</div></div>
                <div className="stat-card"><div className="stat-label">Avg Call Duration</div><div className="stat-value">2:47</div><div style={{ color: "var(--red)", fontSize: 11 }}>-12s vs last week</div></div>
              </div>

              <div className="grid-2 mb-4">
                <div className="card">
                  <div className="card-header"><div><div className="card-title">Active Campaigns</div><div className="card-subtitle">Running right now</div></div></div>
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Campaign</th><th>Progress</th><th>Status</th><th>Booked</th></tr></thead>
                      <tbody>
                        <tr><td><div style={{ fontWeight: 500 }}>SaaS Outreach Q1</div><div className="text-sm text-muted">842 / 2,400 contacts</div></td><td style={{ width: 120 }}><div className="progress-wrap"><div className="progress-fill" style={{ width: "35%", background: "var(--accent)" }} /></div></td><td><span className="badge badge-green">LIVE</span></td><td><b style={{ color: "var(--purple)" }}>58</b></td></tr>
                        <tr><td><div style={{ fontWeight: 500 }}>Real Estate Leads</div><div className="text-sm text-muted">1,201 / 1,500 contacts</div></td><td style={{ width: 120 }}><div className="progress-wrap"><div className="progress-fill" style={{ width: "80%", background: "var(--green)" }} /></div></td><td><span className="badge badge-green">LIVE</span></td><td><b style={{ color: "var(--purple)" }}>84</b></td></tr>
                        <tr><td><div style={{ fontWeight: 500 }}>Insurance Renewal</div><div className="text-sm text-muted">Scheduled 9:00 AM</div></td><td style={{ width: 120 }}><div className="progress-wrap"><div className="progress-fill" style={{ width: "0%", background: "var(--amber)" }} /></div></td><td><span className="badge badge-amber">QUEUED</span></td><td>-</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header"><div><div className="card-title">Call Outcome Funnel</div><div className="card-subtitle">Today's breakdown</div></div><span className="badge badge-blue">TODAY</span></div>
                  <div className="card-body">
                    {[ ["DIALED", 100, "#e5e7eb", "1,847", "100%"], ["CONNECTED", 34, "var(--accent)", "631", "34%"], ["ENGAGED", 12, "var(--purple)", "221", "12%"], ["BOOKED", 7.7, "var(--green)", "142", "7.7%"] ].map((row) => (
                      <div key={String(row[0])} className="funnel-row">
                        <div className="funnel-label">{row[0] as string}</div>
                        <div className="funnel-bar-wrap"><div style={{ width: `${row[1]}%`, height: "100%", background: row[2] as string }} /></div>
                        <div className="funnel-count">{row[3] as string}</div>
                        <div className="funnel-pct">{row[4] as string}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header"><div><div className="card-title">Live Calls</div><div className="card-subtitle">3 AI agents currently on calls</div></div></div>
                <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    ["JM", "James Mitchell", "+1 (512) 849-2201 - SaaS Outreach Q1", timers[0], "#dcfce7", "#15803d", "badge-green"],
                    ["SR", "Sarah Rosenberg", "+1 (718) 334-7091 - Real Estate Leads", timers[1], "#ede9fe", "#6d28d9", "badge-purple"],
                    ["DK", "David Kim", "+1 (206) 771-4423 - Real Estate Leads", timers[2], "#dbeafe", "#1d4ed8", "badge-blue"],
                  ].map((x) => (
                    <div key={String(x[1])} className="live-card active-call">
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div className="avatar" style={{ background: String(x[4]), color: String(x[5]) }}>{x[0] as string}</div>
                        <div><div style={{ fontWeight: 500 }}>{x[1] as string}</div><div className="text-sm text-muted font-mono">{x[2] as string}</div></div>
                      </div>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <div className="wave"><span /><span /><span /><span /><span /></div>
                        <span className="font-mono text-sm">{toDuration(x[3] as number)}</span>
                        <span className={`badge ${x[6] as string}`}>TALKING</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className={`section ${activeSection === "live" ? "active" : ""}`}>
              <div className="grid-2">
                <div className="card">
                  <div className="card-header"><div><div className="card-title">Active Calls</div><div className="card-subtitle">3 agents on calls now</div></div></div>
                  <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {(["james", "sarah", "david"] as TranscriptKey[]).map((k) => (
                      <div key={k} className="live-card active-call" style={{ cursor: "pointer" }} onClick={() => setActiveTranscriptKey(k)}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{transcripts[k].name}</div>
                        <div className="font-mono text-sm">{k === "james" ? toDuration(timers[0]) : k === "sarah" ? toDuration(timers[1]) : toDuration(timers[2])}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <div className="card-header"><div><div className="card-title">Live Transcript - {liveTranscript.name}</div><div className="card-subtitle">{liveTranscript.campaign}</div></div></div>
                  <div className="card-body">
                    <div className="transcript-box">
                      {liveTranscript.msgs.map(([role, text], idx) => (
                        <div className="msg" key={`${role}-${idx}`}>
                          <div className={`msg-role ${role === "AI" ? "ai" : "human"}`}>{role}</div>
                          <div>{text}</div>
                        </div>
                      ))}
                      <div className="msg"><div className="msg-role ai">AI</div><div style={{ color: "var(--accent)" }}>Aria is typing{".".repeat(dots)}</div></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className={`section ${activeSection === "campaigns" ? "active" : ""}`}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 8 }}><span className="badge badge-gray">4 Total</span><span className="badge badge-green">2 Live</span><span className="badge badge-amber">1 Queued</span></div>
                <button className="btn btn-primary" onClick={() => setShowCreateCampaignModal(true)}>Create Campaign</button>
              </div>
              <div className="card"><div className="table-wrap"><table><thead><tr><th>Campaign Name</th><th>Contacts</th><th>Progress</th><th>Connect Rate</th><th>Meetings</th><th>Status</th></tr></thead><tbody>
                <tr><td>SaaS Outreach Q1</td><td>2,400</td><td>842 / 2,400</td><td>36.2%</td><td>58</td><td><span className="badge badge-green">LIVE</span></td></tr>
                <tr><td>Real Estate Leads</td><td>1,500</td><td>1,201 / 1,500</td><td>31.5%</td><td>84</td><td><span className="badge badge-green">LIVE</span></td></tr>
                <tr><td>Insurance Renewal</td><td>800</td><td>0 / 800</td><td>-</td><td>-</td><td><span className="badge badge-amber">QUEUED</span></td></tr>
              </tbody></table></div></div>
            </section>

            <section className={`section ${activeSection === "contacts" ? "active" : ""}`}>
              <div className="card"><div className="card-header"><div className="card-title">Contact Database</div></div><div className="table-wrap"><table><thead><tr><th>Name</th><th>Phone</th><th>Company</th><th>Status</th></tr></thead><tbody>
                <tr><td>James Mitchell</td><td className="font-mono">+1 (512) 849-2201</td><td>Acme Corp</td><td><span className="badge badge-purple">MEETING SET</span></td></tr>
                <tr><td>Sarah Rosenberg</td><td className="font-mono">+1 (718) 334-7091</td><td>Realty Group</td><td><span className="badge badge-green">ON CALL</span></td></tr>
              </tbody></table></div></div>
            </section>

            <section className={`section ${activeSection === "agents" ? "active" : ""}`}>
              <div className="card"><div className="card-header"><div className="card-title">AI Agents</div></div><div className="card-body">Aria, Max, and custom agent builder are ready. Use this section to tune scripts and personas.</div></div>
            </section>

            <section className={`section ${activeSection === "logs" ? "active" : ""}`}>
              <div className="card"><div className="card-header"><div className="card-title">Call Log & Transcripts</div><button className="btn btn-outline" onClick={() => setShowTranscriptModal(true)}>View Transcript</button></div><div className="table-wrap"><table><thead><tr><th>Contact</th><th>Campaign</th><th>Duration</th><th>Outcome</th></tr></thead><tbody><tr><td>James Mitchell</td><td>SaaS Outreach Q1</td><td>2:47</td><td><span className="badge badge-purple">MEETING SET</span></td></tr></tbody></table></div></div>
            </section>

            <section className={`section ${activeSection === "analytics" ? "active" : ""}`}>
              <div className="stats-grid">
                <div className="stat-card"><div className="stat-label">Total Calls (30d)</div><div className="stat-value">24,182</div></div>
                <div className="stat-card"><div className="stat-label">Avg Connect Rate</div><div className="stat-value" style={{ color: "var(--green)" }}>33.8%</div></div>
                <div className="stat-card"><div className="stat-label">Meetings Booked</div><div className="stat-value" style={{ color: "var(--purple)" }}>1,842</div></div>
                <div className="stat-card"><div className="stat-label">Cost Per Meeting</div><div className="stat-value">$3.12</div></div>
              </div>
            </section>

            <section className={`section ${activeSection === "settings" ? "active" : ""}`}>
              <div className="grid-2">
                <div className="card"><div className="card-header"><div className="card-title">Retell AI Integration</div><span className="badge badge-green">CONNECTED</span></div><div className="card-body"><div className="form-group"><label className="form-label">API Key</label><input defaultValue="ret_live_xxxxxxxxxxxxxxxxx" /></div><button className="btn btn-primary">Test Connection</button></div></div>
                <div className="card"><div className="card-header"><div className="card-title">Compliance & DNC</div></div><div className="card-body">VoiceAgent auto-removes contacts who request DNC from future campaigns.</div></div>
              </div>
            </section>
          </div>
        </main>
      </div>

      <div className={`modal-overlay ${showLaunchModal ? "open" : ""}`}>
        <div className="modal">
          <div className="modal-header"><div>Start AI Calling Campaign</div><button className="modal-close" onClick={() => setShowLaunchModal(false)}>x</button></div>
          <div className="modal-body"><div className="form-group"><label className="form-label">Select Campaign</label><select><option>SaaS Outreach Q1</option></select></div></div>
          <div className="modal-footer"><button className="btn btn-outline" onClick={() => setShowLaunchModal(false)}>Cancel</button><button className="btn btn-primary" onClick={() => setShowLaunchModal(false)}>Launch Campaign</button></div>
        </div>
      </div>

      <div className={`modal-overlay ${showCreateCampaignModal ? "open" : ""}`}>
        <div className="modal">
          <div className="modal-header"><div>Create New Campaign</div><button className="modal-close" onClick={() => setShowCreateCampaignModal(false)}>x</button></div>
          <div className="modal-body"><div className="form-group"><label className="form-label">Campaign Name</label><input placeholder="e.g. SaaS Outreach Q2" /></div></div>
          <div className="modal-footer"><button className="btn btn-outline" onClick={() => setShowCreateCampaignModal(false)}>Cancel</button><button className="btn btn-primary" onClick={() => setShowCreateCampaignModal(false)}>Create</button></div>
        </div>
      </div>

      <div className={`modal-overlay ${showTranscriptModal ? "open" : ""}`}>
        <div className="modal">
          <div className="modal-header"><div>Call Transcript - James Mitchell</div><button className="modal-close" onClick={() => setShowTranscriptModal(false)}>x</button></div>
          <div className="modal-body"><div className="transcript-box"><div className="msg"><div className="msg-role ai">AI</div><div>Hi James, this is Aria calling from TechFlow Solutions.</div></div><div className="msg"><div className="msg-role human">HMN</div><div>Yeah, sure. Who is this again?</div></div></div></div>
          <div className="modal-footer"><button className="btn btn-primary" onClick={() => setShowTranscriptModal(false)}>Close</button></div>
        </div>
      </div>

      <div className={`modal-overlay ${showAgentModal ? "open" : ""}`}>
        <div className="modal">
          <div className="modal-header"><div>Build New AI Agent</div><button className="modal-close" onClick={() => setShowAgentModal(false)}>x</button></div>
          <div className="modal-body"><div className="form-group"><label className="form-label">Agent Name</label><input placeholder="e.g. Luna" /></div></div>
          <div className="modal-footer"><button className="btn btn-outline" onClick={() => setShowAgentModal(false)}>Cancel</button><button className="btn btn-primary" onClick={() => setShowAgentModal(false)}>Create Agent</button></div>
        </div>
      </div>
    </>
  );
};

export default Index;
