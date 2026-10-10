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
  Activity,
  Star,
  PenSquare,
  ShieldAlert,
  Sparkles,
  Settings,
  ExternalLink,
  LogOut,
  ChevronRight,
  PanelLeft,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  user?: any;
  onLogout?: () => void;
  newContactsCount?: number;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  badge?: string | number;
  badgeColor?: string;
}

interface MenuSection {
  title?: string;
  items: MenuItem[];
}

export function AdminSidebar({
  activeTab,
  onTabChange,
  collapsed: controlledCollapsed,
  onToggleCollapse,
  user,
  onLogout,
  newContactsCount = 0,
}: AdminSidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const collapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  const handleToggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };

  const sections: MenuSection[] = [
    {
      items: [
        {
          id: "overview",
          label: "Tasks & Board",
          icon: LayoutDashboard,
          badge: newContactsCount > 0 ? newContactsCount : undefined,
          badgeColor: "bg-[#5B4FF5] text-white",
        },
        { id: "activity", label: "Activities", icon: Activity },
      ],
    },
    {
      title: "MAIN",
      items: [
        {
          id: "contacts",
          label: "Contacts",
          icon: MessageSquare,
          badge: newContactsCount > 0 ? newContactsCount : undefined,
          badgeColor: "bg-rose-500 text-white",
        },
        { id: "portfolio", label: "Portfolio", icon: FolderOpen },
        { id: "blog", label: "Blog Posts", icon: PenSquare },
        { id: "testimonials", label: "Testimonials", icon: Star },
        { id: "content", label: "Content Editor", icon: FileText },
      ],
    },
    {
      title: "RECORDS",
      items: [
        { id: "users", label: "Team & Users", icon: Users },
        { id: "social", label: "Social Links", icon: Share2 },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        { id: "spam", label: "Spam Activity", icon: ShieldAlert },
        { id: "database", label: "Database", icon: Database },
        { id: "settings", label: "Settings", icon: Settings },
      ],
    },
  ];

  const userInitial = user?.email?.charAt(0)?.toUpperCase() || "A";
  const userDisplayName = user?.email?.split("@")[0] || "Admin";

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-[#0E111A]/95 backdrop-blur-xl border-r border-[#1C2030] transition-all duration-300 flex flex-col justify-between shadow-[2px_0_24px_rgba(0,0,0,0.4)]",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Top Header & Brand */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex h-16 items-center justify-between px-4 border-b border-[#1C2030]">
          {!collapsed ? (
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-slate-400 font-medium">Welcome,</span>
              <h1 className="text-base font-bold text-white capitalize truncate">
                {userDisplayName}
              </h1>
            </div>
          ) : (
            <div className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center text-white shadow-md mx-auto">
              <span className="font-bold text-sm">{userInitial}</span>
            </div>
          )}

          {/* Dock / Collapse toggle (Matches the second picture model) */}
          <button
            onClick={handleToggle}
            className={cn(
              "h-8 w-8 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-all",
              collapsed && "hidden"
            )}
            title="Collapse sidebar"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        </div>

        {/* Collapsed toggle button header (Matches second picture model!) */}
        {collapsed && (
          <div className="px-3 py-2 flex justify-center border-b border-[#1C2030]/60">
            <button
              onClick={handleToggle}
              className="h-8 w-8 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-all"
              title="Expand sidebar"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 board-scroll">
          {sections.map((sec, secIdx) => (
            <div key={secIdx} className="space-y-1">
              {sec.title && !collapsed && (
                <div className="px-3 pt-2 pb-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  {sec.title}
                </div>
              )}
              {sec.title && collapsed && (
                <div className="my-2 border-t border-[#1C2030] mx-2" />
              )}

              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                const itemBtn = (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150 relative group",
                      isActive
                        ? "bg-[#5B4FF5] text-white shadow-lg shadow-[#5B4FF5]/30 font-semibold"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 flex-shrink-0 transition-transform group-hover:scale-105",
                        isActive ? "text-white" : "text-slate-400"
                      )}
                    />
                    {!collapsed && (
                      <span className="truncate text-left flex-1 text-[13px]">
                        {item.label}
                      </span>
                    )}

                    {!collapsed && item.badge && (
                      <span
                        className={cn(
                          "text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none",
                          isActive
                            ? "bg-white/20 text-white"
                            : item.badgeColor || "bg-slate-800 text-slate-300 border border-slate-700"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );

                if (collapsed) {
                  return (
                    <Tooltip key={item.id} delayDuration={0}>
                      <TooltipTrigger asChild>{itemBtn}</TooltipTrigger>
                      <TooltipContent side="right" className="font-medium bg-[#161A28] border border-[#23293D] text-white">
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return itemBtn;
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Footer User Profile */}
      <div className="p-3 border-t border-[#1C2030] bg-[#0E111A]">
        {!collapsed ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center justify-between p-2 rounded-2xl bg-[#141824] hover:bg-[#1A2030] border border-[#20273B] transition-colors text-left group">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#5B4FF5] to-[#8B5CF6] text-white font-bold text-xs flex items-center justify-center ring-2 ring-purple-500/20 flex-shrink-0">
                    {userInitial}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-white truncate capitalize">
                      {userDisplayName}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate">
                      {user?.email || "Admin Workspace"}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-slate-300 flex-shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#141824] border border-[#222A40] text-slate-200 shadow-xl mb-2" align="start">
              <DropdownMenuLabel className="text-xs text-slate-400 font-semibold">
                Administrator
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#20273B]" />
              <DropdownMenuItem
                onClick={() => onTabChange("settings")}
                className="text-xs text-slate-300 hover:text-white cursor-pointer focus:bg-[#1E2538]"
              >
                <Settings className="mr-2 h-3.5 w-3.5 text-slate-400" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => window.open("/", "_blank")}
                className="text-xs text-slate-300 hover:text-white cursor-pointer focus:bg-[#1E2538]"
              >
                <ExternalLink className="mr-2 h-3.5 w-3.5 text-slate-400" />
                View Live Website
              </DropdownMenuItem>
              {onLogout && (
                <>
                  <DropdownMenuSeparator className="bg-[#20273B]" />
                  <DropdownMenuItem
                    onClick={onLogout}
                    className="text-xs text-rose-400 focus:text-rose-300 cursor-pointer focus:bg-rose-950/30"
                  >
                    <LogOut className="mr-2 h-3.5 w-3.5 text-rose-400" />
                    Sign Out
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex justify-center">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#5B4FF5] to-[#8B5CF6] text-white font-bold text-xs flex items-center justify-center ring-2 ring-purple-500/20">
              {userInitial}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
