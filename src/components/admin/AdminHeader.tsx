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
import { LogOut, Shield, Bell, RefreshCw, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AdminHeaderProps {
  user: User | null;
  onLogout: () => void;
  onRefresh: () => void;
  sidebarCollapsed?: boolean;
}

export function AdminHeader({ user, onLogout, onRefresh, sidebarCollapsed }: AdminHeaderProps) {
  const navigate = useNavigate();
  const initials = user?.email?.slice(0, 2).toUpperCase() || "AD";

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 bg-admin-header/80 backdrop-blur-xl border-b border-border/50 transition-all duration-300 ${
        sidebarCollapsed ? "left-16" : "left-64"
      }`}
    >
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-heading font-semibold">Dashboard</h1>
          <Badge variant="outline" className="hidden sm:flex gap-1 text-info border-info/30">
            <Shield className="h-3 w-3" />
            Administrator
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            className="hover:bg-muted"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="hover:bg-muted"
          >
            <Home className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" className="hover:bg-muted relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-destructive rounded-full" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-info/20 text-info">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Administrator</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive">
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
