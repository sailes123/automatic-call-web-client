import {
  LayoutDashboard,
  Radio,
  List,
  Users,
  Bot,
  FileText,
  TrendingUp,
  Settings,
} from "lucide-react";
// import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar-context";
import { Badge } from "@/components/ui/badge";
import { NavLink } from "./nav-link";

const overviewItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Live Calls", url: "/live-calls", icon: Radio, badge: "3" },
];

const campaignItems = [
  { title: "All Campaigns", url: "/campaigns", icon: List, badge: "4" },
  { title: "Contacts", url: "/contacts", icon: Users },
  { title: "AI Agents", url: "/ai-agents", icon: Bot },
];

const reportingItems = [
  { title: "Call Logs", url: "/call-logs", icon: FileText },
  { title: "Analytics", url: "/analytics", icon: TrendingUp },
];

const accountItems = [{ title: "Settings", url: "/settings", icon: Settings }];

interface NavGroupProps {
  label: string;
  items: typeof overviewItems;
  collapsed: boolean;
}

function NavGroup({ label, items, collapsed }: NavGroupProps) {
//   const location = useLocation();
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[11px] font-semibold tracking-wider uppercase text-sidebar-muted">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  end
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span className="flex-1">{item.title}</span>}
                  {!collapsed && item.badge && (
                    <Badge
                      variant="secondary"
                      className="ml-auto h-5 min-w-5 rounded-full bg-primary/10 text-primary text-[11px] font-semibold px-1.5"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <div className="flex items-center gap-2.5 px-4 py-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Settings className="h-4 w-4" />
        </div>
        {!collapsed && (
          <div>
            <h2 className="text-sm font-bold text-foreground leading-none">
              VoiceAgent
            </h2>
            <p className="text-[10px] font-medium tracking-wider uppercase text-sidebar-muted mt-0.5">
              Powered by Retell AI
            </p>
          </div>
        )}
      </div>

      <SidebarContent className="px-2">
        <NavGroup
          label="Overview"
          items={overviewItems}
          collapsed={collapsed}
        />
        <NavGroup
          label="Campaigns"
          items={campaignItems}
          collapsed={collapsed}
        />
        <NavGroup
          label="Reporting"
          items={reportingItems}
          collapsed={collapsed}
        />
        <NavGroup label="Account" items={accountItems} collapsed={collapsed} />
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && (
          <div className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-semibold tracking-wider uppercase text-success">
              3 Calls Live
            </span>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
