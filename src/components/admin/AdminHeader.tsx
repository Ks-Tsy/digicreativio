import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LogOut,
  RefreshCw,
  Home,
  Search,
  Bell,
  Sparkles,
  PanelLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

interface AdminHeaderProps {
  user: User | null;
  onLogout: () => void;
  onRefresh: () => void;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  activeTab?: string;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export function AdminHeader({
  user,
  onLogout,
  onRefresh,
  sidebarCollapsed,
  onToggleSidebar,
  searchQuery = "",
  onSearchChange,
}: AdminHeaderProps) {
  const navigate = useNavigate();
  const [internalSearch, setInternalSearch] = useState(searchQuery);
  const [refreshing, setRefreshing] = useState(false);

const [notifications, setNotifications] = useState<any[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<any | null>(null);

  useEffect(() => {
    fetchNotifications();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'contact_submissions' },
        (payload) => {
          const newNotif = {
            id: payload.new.id,
            email: payload.new.email,
            message: payload.new.message,
            title: `New message from ${payload.new.name}`,
            isNew: payload.new.status === 'new',
            time: 'Just now'
          };
          setNotifications(prev => [newNotif, ...prev].slice(0, 5));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNotifications = async () => {
    const { data } = await supabase
      .from('contact_submissions')
      .select('id, name, email, message, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (data) {
      setNotifications(data.map(item => ({
        id: item.id,
        email: item.email,
        message: item.message,
        title: `New message from ${item.name}`,
        isNew: item.status === 'new',
        time: new Date(item.created_at).toLocaleDateString()
      })));
    }
  };

  const hasUnread = notifications.some(n => n.isNew);

  const markAllAsRead = async () => {
    setNotifications(notifications.map(n => ({ ...n, isNew: false })));
    await supabase
      .from('contact_submissions')
      .update({ status: 'read' })
      .eq('status', 'new');
  };

  const markAsRead = async (notification: any) => {
    setSelectedNotification(notification);
    if (notification.isNew) {
      setNotifications(notifications.map(n => n.id === notification.id ? { ...n, isNew: false } : n));
      await supabase
        .from('contact_submissions')
        .update({ status: 'read' })
        .eq('id', notification.id);
    }
  };

  const initials = user?.email?.slice(0, 2).toUpperCase() || "AD";
  const userDisplayName = user?.email
    ? user.email.split("@")[0].replace(/[._-]/g, " ")
    : "Administrator";

  const todayFormatted = format(new Date(), "EEEE, MMM do, yyyy");

  const handleRefreshClick = async () => {
    setRefreshing(true);
    await onRefresh();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalSearch(e.target.value);
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 bg-[#0B0D14]/90 backdrop-blur-md border-b border-[#1C2030] transition-all duration-300 ${
        sidebarCollapsed ? "left-[72px]" : "left-64"
      }`}
    >
      <div className="flex h-full items-center justify-between px-6 gap-4">
        {/* Left: Sidebar Toggle + Greeting & Date */}
        <div className="flex items-center gap-3 min-w-0">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="h-8 w-8 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors md:hidden"
              title="Toggle sidebar"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          )}

          <div className="flex flex-col min-w-0">
            {/* The welcome text has been moved to the sidebar */}
          </div>
        </div>

        {/* Center: Floating Pill Search Bar (In dark mode) */}
        <div className="flex-1 max-w-md mx-4 hidden sm:block">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={internalSearch}
              onChange={handleSearchInput}
              placeholder="Find something..."
              className="w-full h-9 pl-9 pr-12 rounded-full bg-[#141824] hover:bg-[#181D2C] focus:bg-[#181D2C] border border-[#20273B] focus:border-[#5B4FF5] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#5B4FF5]/30 transition-all"
            />
            <div className="absolute right-2.5 flex items-center gap-0.5 pointer-events-none">
              <kbd className="px-1.5 py-0.5 text-[9px] font-semibold text-slate-400 bg-[#1D2233] border border-[#2B334B] rounded shadow-2xs">
                ⌘ K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full text-slate-400 hover:text-white hover:bg-white/5"
                  title="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  {hasUnread && (
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#5B4FF5] ring-2 ring-[#0B0D14]" />
                  )}
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 bg-[#141824] border border-[#20273B] text-slate-200 shadow-2xl mr-4" align="end">
              <div className="flex justify-between items-center py-2 px-3">
                <DropdownMenuLabel className="font-semibold text-white p-0">Notifications</DropdownMenuLabel>
                {hasUnread && (
                  <button onClick={markAllAsRead} className="text-xs text-purple-400 hover:text-purple-300">
                    Mark all as read
                  </button>
                )}
              </div>
              <DropdownMenuSeparator className="bg-[#20273B]" />
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-400">No notifications</div>
              ) : (
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.map((n) => (
                    <DropdownMenuItem 
                      key={n.id} 
                      className={`flex flex-col items-start gap-1 p-3 cursor-pointer focus:bg-[#1E2538] ${n.isNew ? 'bg-purple-900/10' : ''}`}
                      onClick={() => {
                        markAsRead(n.id);
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-sm ${n.isNew ? 'text-white font-medium' : 'text-slate-300'}`}>{n.title}</span>
                        {n.isNew && <span className="h-2 w-2 rounded-full bg-purple-500" />}
                      </div>
                      <span className="text-xs text-slate-500">{n.time}</span>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Refresh Data */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefreshClick}
            className="h-9 w-9 rounded-full text-slate-400 hover:text-white hover:bg-white/5"
            title="Refresh dashboard"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin text-purple-400" : ""}`}
            />
          </Button>

          {/* Visit Live Website */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="h-9 w-9 rounded-full text-slate-400 hover:text-white hover:bg-white/5"
            title="View live website"
          >
            <Home className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-[#1C2030] mx-1 hidden sm:block" />

          {/* Admin Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative h-9 w-9 rounded-full ring-2 ring-purple-500/20 hover:ring-purple-400/50 transition-all flex items-center justify-center p-0 overflow-hidden">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-gradient-to-tr from-[#5B4FF5] to-[#8B5CF6] text-white font-bold text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#141824] border border-[#20273B] text-slate-200 shadow-2xl" align="end">
              <DropdownMenuLabel className="font-normal py-2.5">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-white">Administrator</p>
                    <span className="text-[10px] bg-purple-950/80 text-purple-300 border border-purple-800/50 px-1.5 py-0.2 rounded font-semibold">
                      Full Access
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#20273B]" />
              <DropdownMenuItem
                onClick={() => navigate("/")}
                className="text-xs text-slate-300 hover:text-white cursor-pointer focus:bg-[#1E2538]"
              >
                <Sparkles className="mr-2 h-3.5 w-3.5 text-purple-400" />
                <span>Live Website</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onLogout}
                className="text-xs text-rose-400 focus:text-rose-300 cursor-pointer focus:bg-rose-950/30"
              >
                <LogOut className="mr-2 h-3.5 w-3.5 text-rose-400" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    
      <Dialog open={!!selectedNotification} onOpenChange={(open) => !open && setSelectedNotification(null)}>
        <DialogContent className="bg-[#141824] border-[#20273B] text-white">
          <DialogHeader>
            <DialogTitle>{selectedNotification?.title}</DialogTitle>
            <DialogDescription className="text-slate-400 mt-2">
              <span className="block mb-4 text-white font-medium">From: {selectedNotification?.email}</span>
              <span className="block whitespace-pre-wrap">{selectedNotification?.message}</span>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </header>
  );
}
