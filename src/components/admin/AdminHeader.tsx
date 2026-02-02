import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Shield, RefreshCw, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AdminHeaderProps {
  user: User | null;
  onLogout: () => void;
  onRefresh: () => void;
  sidebarCollapsed?: boolean;
  activeTab?: string;
}

const tabLabels: Record<string, string> = {
  overview: "Overview",
  contacts: "Contacts",
  portfolio: "Portfolio",
  users: "Users",
  content: "Content",
  social: "Social Links",
  activity: "Activity Logs",
  testimonials: "Testimonials",
  blog: "Blog",
  database: "Database",
  settings: "Settings",
  spam: "Spam Activity",
};

export function AdminHeader({ user, onLogout, onRefresh, sidebarCollapsed, activeTab = "overview" }: AdminHeaderProps) {
  const navigate = useNavigate();
  const initials = user?.email?.slice(0, 2).toUpperCase() || "AD";
  const currentTabLabel = tabLabels[activeTab] || "Dashboard";

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 bg-background/95 backdrop-blur-md border-b border-border/40 transition-all duration-300 ${
        sidebarCollapsed ? "left-[72px]" : "left-64"
      }`}
    >
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-lg font-semibold">{currentTabLabel}</h1>
            <p className="text-xs text-muted-foreground">Manage your website</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="hidden md:flex gap-1.5 border-primary/30 text-primary">
            <Shield className="h-3 w-3" />
            <span className="text-xs">Admin</span>
          </Badge>

          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            className="h-9 w-9 rounded-lg hover:bg-muted"
            title="Refresh data"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="h-9 w-9 rounded-lg hover:bg-muted"
            title="Go to website"
          >
            <Home className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border/50 mx-1" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 hover:ring-2 hover:ring-primary/30">
                <Avatar className="h-9 w-9 border border-border">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel className="font-normal py-3">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Administrator</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
