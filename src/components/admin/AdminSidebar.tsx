import { useState } from "react";
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
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
  { id: "spam", label: "Spam Activity", icon: ShieldAlert },
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
        "fixed left-0 top-0 z-40 h-screen bg-card/95 backdrop-blur-xl border-r border-border/40 transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo / Brand */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border/40">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <LayoutDashboard className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-sm">Admin Panel</span>
              <span className="text-[10px] text-muted-foreground">DigiCreativio</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
            <LayoutDashboard className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-[4.5rem] -right-3 z-50 h-6 w-6 rounded-full bg-card border border-border/50 shadow-md hover:bg-muted"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      {/* Navigation */}
      <ScrollArea className="h-[calc(100vh-4rem)] py-4">
        <nav className="flex flex-col gap-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            const buttonContent = (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  "hover:bg-muted/50",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn(
                  "h-[18px] w-[18px] flex-shrink-0",
                  isActive ? "text-primary" : ""
                )} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.id} delayDuration={0}>
                  <TooltipTrigger asChild>
                    {buttonContent}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return buttonContent;
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
}
