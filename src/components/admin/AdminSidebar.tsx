import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Users,
  FolderOpen,
  MessageSquare,
  Database,
  Share2,
  ChevronLeft,
  ChevronRight,
  Activity,
  Star,
  PenSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "content", label: "Content", icon: FileText },
  { id: "blog", label: "Blog", icon: PenSquare },
  { id: "portfolio", label: "Portfolio", icon: FolderOpen },
  { id: "testimonials", label: "Testimonials", icon: Star },
  { id: "contacts", label: "Contacts", icon: MessageSquare },
  { id: "users", label: "Users", icon: Users },
  { id: "social", label: "Social Links", icon: Share2 },
  { id: "activity", label: "Activity Logs", icon: Activity },
  { id: "database", label: "Database", icon: Database },
];

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-admin-sidebar border-r border-border/30 transition-all duration-300",
        "shadow-[4px_0_24px_-8px_hsl(0_0%_0%/0.5)]",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo / Brand */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border/30">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-info to-info/70 flex items-center justify-center shadow-[0_0_20px_hsl(199_89%_55%/0.3)]">
              <LayoutDashboard className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-base tracking-tight">Admin</span>
              <span className="text-[10px] text-muted-foreground/70 uppercase tracking-widest">Dashboard</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-info to-info/70 flex items-center justify-center mx-auto shadow-[0_0_20px_hsl(199_89%_55%/0.3)]">
            <LayoutDashboard className="h-4 w-4 text-white" />
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <div className="absolute top-[4.5rem] -right-3 z-50">
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6 rounded-full bg-admin-sidebar border-border/50 shadow-md hover:bg-admin-sidebar-hover"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="h-[calc(100vh-4rem)] py-6">
        <nav className="flex flex-col gap-1.5 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",
                  "hover:bg-admin-sidebar-hover group relative",
                  isActive
                    ? "bg-info/15 text-info shadow-[inset_0_0_20px_hsl(199_89%_55%/0.1)]"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-info rounded-r-full shadow-[0_0_10px_hsl(199_89%_55%/0.5)]" />
                )}
                <Icon className={cn(
                  "h-5 w-5 flex-shrink-0 transition-all",
                  isActive ? "text-info" : "group-hover:text-foreground"
                )} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
}
