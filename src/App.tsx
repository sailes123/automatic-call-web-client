import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/layout/dashboard-layout";
import LiveCalls from "@/pages/LiveCalls";
import Index from "@/pages/Index";
import Campaigns from "@/pages/Campaigns";
import Contacts from "@/pages/Contacts";
import AIAgents from "@/pages/AIAgents";
import CallLogs from "@/pages/CallLogs";
import Analytics from "@/pages/Analytics";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route index element={<Index />} />
            <Route path="/live-calls" element={<LiveCalls />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/ai-agents" element={<AIAgents />} />
            <Route path="/call-logs" element={<CallLogs />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<div>Settings Page</div>} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
