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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Shield, Bell, RefreshCw, Home, LayoutDashboard } from "lucide-react";
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
};

export function AdminHeader({ user, onLogout, onRefresh, sidebarCollapsed, activeTab = "overview" }: AdminHeaderProps) {
  const navigate = useNavigate();
  const initials = user?.email?.slice(0, 2).toUpperCase() || "AD";
  const currentTabLabel = tabLabels[activeTab] || "Dashboard";

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 bg-admin-header/95 backdrop-blur-2xl border-b border-border/30 transition-all duration-300 shadow-[0_4px_24px_-8px_hsl(0_0%_0%/0.4)] ${
        sidebarCollapsed ? "left-16" : "left-64"
      }`}
    >
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Breadcrumb>
            <BreadcrumbList className="gap-1.5">
              <BreadcrumbItem>
                <BreadcrumbLink 
                  href="/" 
                  onClick={(e) => { e.preventDefault(); navigate("/"); }}
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-info transition-colors px-2 py-1 rounded-md hover:bg-muted/50"
                >
                  <Home className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline text-xs font-medium">Home</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-muted-foreground/50" />
              <BreadcrumbItem>
                <BreadcrumbLink 
                  href="/admin"
                  onClick={(e) => { e.preventDefault(); }}
                  className="flex items-center gap-1.5 text-muted-foreground px-2 py-1"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline text-xs font-medium">Admin</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-muted-foreground/50" />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold text-foreground text-sm px-2 py-1 bg-muted/30 rounded-md">
                  {currentTabLabel}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Badge className="hidden md:flex gap-1.5 bg-info/10 text-info border-info/20 hover:bg-info/15 px-3 py-1">
            <Shield className="h-3 w-3" />
            <span className="text-xs font-medium">Administrator</span>
          </Badge>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            className="hover:bg-muted/70 h-9 w-9 rounded-lg transition-all hover:text-info"
            title="Refresh data"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="hover:bg-muted/70 h-9 w-9 rounded-lg transition-all hover:text-info"
            title="Go to website"
          >
            <Home className="h-4 w-4" />
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-muted/70 relative h-9 w-9 rounded-lg transition-all hover:text-info" 
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-info rounded-full animate-pulse shadow-[0_0_8px_hsl(199_89%_55%/0.6)]" />
          </Button>

          <div className="w-px h-6 bg-border/50 mx-1 hidden sm:block" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 hover:ring-2 hover:ring-info/30 transition-all">
                <Avatar className="h-9 w-9 border-2 border-info/20">
                  <AvatarFallback className="bg-gradient-to-br from-info/30 to-info/10 text-info text-sm font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-card/95 backdrop-blur-xl border-border/50" align="end" forceMount>
              <DropdownMenuLabel className="font-normal py-3">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none">Administrator</p>
                  <p className="text-xs leading-none text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer py-2.5">
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
