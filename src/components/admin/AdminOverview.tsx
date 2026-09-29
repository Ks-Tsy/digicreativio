import { useState } from "react";
import {
  FileText,
  FolderOpen,
  Users,
  Shield,
  Clock,
  ArrowRight,
  Plus,
  SlidersHorizontal,
  MoreHorizontal,
  MessageSquare,
  ThumbsUp,
  CheckCircle2,
  Circle,
  Calendar,
  Sparkles,
  ChevronDown,
  LayoutGrid,
  Kanban,
  Star,
  PenSquare,
  Mail,
  Trash2,
  ExternalLink,
  Eye,
  Check,
  Search,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { StatCard } from "./StatCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface AdminOverviewProps {
  stats: {
    totalContacts: number;
    newContacts: number;
    totalPortfolio: number;
    totalUsers: number;
  };
  userRoles: any[];
  contacts: any[];
  portfolioItems: any[];
  blogPosts?: any[];
  testimonials?: any[];
  users?: any[];
  user?: any;
  onNavigate: (tab: string) => void;
  onStatusUpdate?: (id: string, status: string) => Promise<void>;
  onDeleteContact?: (id: string) => Promise<void>;
  onRefresh?: () => Promise<void>;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

// Luminous progress dots component
function ProgressDots({ percent, color = "indigo" }: { percent: number; color?: string }) {
  const totalDots = 10;
  const filledDots = Math.round((percent / 100) * totalDots);

  const dotColors: Record<string, { filled: string; empty: string; text: string }> = {
    indigo: { filled: "bg-[#6366F1] shadow-[0_0_8px_rgba(99,102,241,0.6)]", empty: "bg-[#25283D]", text: "text-[#818CF8]" },
    blue: { filled: "bg-[#3B82F6] shadow-[0_0_8px_rgba(59,130,246,0.6)]", empty: "bg-[#1E293B]", text: "text-[#60A5FA]" },
    amber: { filled: "bg-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.6)]", empty: "bg-[#332415]", text: "text-[#FBBF24]" },
    emerald: { filled: "bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.6)]", empty: "bg-[#16332C]", text: "text-[#34D399]" },
    rose: { filled: "bg-[#F43F5E] shadow-[0_0_8px_rgba(244,63,94,0.6)]", empty: "bg-[#331C24]", text: "text-[#FB7185]" },
    purple: { filled: "bg-[#8B5CF6] shadow-[0_0_8px_rgba(139,92,246,0.6)]", empty: "bg-[#282142]", text: "text-[#A78BFA]" },
    teal: { filled: "bg-[#14B8A6] shadow-[0_0_8px_rgba(20,184,166,0.6)]", empty: "bg-[#153235]", text: "text-[#2DD4BF]" },
  };

  const scheme = dotColors[color] || dotColors.indigo;

  return (
    <div className="flex items-center justify-between mt-3 pt-2">
      <div className="flex items-center gap-1">
        {Array.from({ length: totalDots }).map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full transition-all ${
              i < filledDots ? scheme.filled : scheme.empty
            }`}
          />
        ))}
      </div>
      <span className={`text-[11px] font-bold ${scheme.text}`}>{percent}%</span>
    </div>
  );
}

export function AdminOverview({
  stats,
  userRoles,
  contacts,
  portfolioItems,
  blogPosts = [],
  testimonials = [],
  users = [],
  user,
  onNavigate,
  onStatusUpdate,
  onDeleteContact,
  onRefresh,
  searchQuery = "",
  onSearchChange,
}: AdminOverviewProps) {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"board" | "analytics">("board");
  const [filterType, setFilterType] = useState<string>("all");
  const [activeModalCard, setActiveModalCard] = useState<any | null>(null);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [teamModalOpen, setTeamModalOpen] = useState(false);

  // Interactive Checklist states (allows user to check/uncheck items live!)
  const [checklistGinee, setChecklistGinee] = useState([
    { id: 1, text: "Create user flow & sitemap", done: true },
    { id: 2, text: "Make wireframes in Figma", done: true },
    { id: 3, text: "Design onboarding screens", done: false },
    { id: 4, text: "Make interactive prototype", done: false },
  ]);

  const [checklistService, setChecklistService] = useState([
    { id: 1, text: "Branding & Visual Identity", done: true },
    { id: 2, text: "Mobile app design & development", done: true },
    { id: 3, text: "Landing page design & development", done: true },
    { id: 4, text: "Dashboard design & development", done: true },
    { id: 5, text: "Marketing & Launch Strategy", done: true },
  ]);

  // Interactive likes state
  const [cardLikes, setCardLikes] = useState<Record<string, number>>({});

  const handleToggleLike = (cardId: string, initialCount: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCardLikes((prev) => ({
      ...prev,
      [cardId]: (prev[cardId] ?? initialCount) + 1,
    }));
  };

  const toggleChecklistGinee = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setChecklistGinee((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const toggleChecklistService = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setChecklistService((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const adminCount = userRoles.filter((r) => r.role === "admin").length;
  const currentMonth = format(new Date(), "MMMM");
  const todayFormatted = format(new Date(), "EEEE, MMM do, yyyy");

  // Filter contacts by status
  const newContacts = contacts.filter((c) => c.status === "new" || !c.status);
  const inProgressContacts = contacts.filter((c) => c.status === "in_progress");
  const resolvedContacts = contacts.filter(
    (c) => c.status === "resolved" || c.status === "contacted" || c.status === "archived"
  );

  // Filter based on search query
  const query = searchQuery.toLowerCase().trim();

  const filteredContacts = contacts.filter((c) => {
    if (!query) return true;
    return (
      c.name?.toLowerCase().includes(query) ||
      c.email?.toLowerCase().includes(query) ||
      c.subject?.toLowerCase().includes(query) ||
      c.message?.toLowerCase().includes(query)
    );
  });

  const filteredPortfolio = portfolioItems.filter((p) => {
    if (!query) return true;
    return (
      p.title?.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query) ||
      p.category?.toLowerCase().includes(query)
    );
  });

  const filteredBlogPosts = blogPosts.filter((b) => {
    if (!query) return true;
    return (
      b.title?.toLowerCase().includes(query) ||
      b.category?.toLowerCase().includes(query) ||
      b.excerpt?.toLowerCase().includes(query)
    );
  });

  const filteredTestimonials = testimonials.filter((t) => {
    if (!query) return true;
    return (
      t.name?.toLowerCase().includes(query) ||
      t.company?.toLowerCase().includes(query) ||
      t.content?.toLowerCase().includes(query)
    );
  });

  // Action handlers
  const handleUpdateContactStatus = async (id: string, newStatus: string) => {
    if (onStatusUpdate) {
      await onStatusUpdate(id, newStatus);
    }
    if (activeModalCard?.data?.id === id) {
      setActiveModalCard((prev: any) => ({
        ...prev,
        data: { ...prev.data, status: newStatus },
      }));
    }
  };

  const handleDeleteContactItem = async (id: string) => {
    if (confirm("Are you sure you want to delete this contact submission?")) {
      if (onDeleteContact) {
        await onDeleteContact(id);
      }
      setActiveModalCard(null);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans text-slate-100">
      {/* ============================================================
          TOP BOARD BAR (Month, View switcher, Team stack, Filter, + Create)
          ============================================================ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#121522]/90 backdrop-blur-md p-4 rounded-3xl border border-[#1E2336] shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
        {/* Left Side: Month & View dropdown */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h2 className="text-xl font-extrabold text-white tracking-tight leading-tight">
              {currentMonth}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Calendar className="h-3 w-3 text-slate-400" />
              <span>Today is {todayFormatted}</span>
            </div>
          </div>

          <div className="h-8 w-px bg-[#20273C] hidden sm:block mx-1" />

          {/* View Switcher Pill */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#181D2C] hover:bg-[#20273A] border border-[#273046] text-xs font-bold text-white transition-colors">
                {viewMode === "board" ? (
                  <>
                    <Kanban className="h-3.5 w-3.5 text-[#5B4FF5]" />
                    <span>Board &bull; Daily Tasks</span>
                  </>
                ) : (
                  <>
                    <LayoutGrid className="h-3.5 w-3.5 text-[#5B4FF5]" />
                    <span>Metrics &bull; Analytics</span>
                  </>
                )}
                <ChevronDown className="h-3 w-3 text-slate-400 ml-1" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-[#141824] border-[#222A40] text-slate-200 shadow-xl">
              <DropdownMenuItem
                onClick={() => setViewMode("board")}
                className="text-xs font-medium cursor-pointer hover:text-white focus:bg-[#1E2538]"
              >
                <Kanban className="h-3.5 w-3.5 mr-2 text-[#5B4FF5]" />
                Board &bull; Daily Tasks
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setViewMode("analytics")}
                className="text-xs font-medium cursor-pointer hover:text-white focus:bg-[#1E2538]"
              >
                <LayoutGrid className="h-3.5 w-3.5 mr-2 text-indigo-400" />
                Metrics &bull; Analytics
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right Side: Team Avatars, Filters, + Create Task Button */}
        <div className="flex items-center gap-3 self-end md:self-center flex-wrap">
          {/* Real Team Avatar Stack (Connected to users database!) */}
          <div className="flex items-center -space-x-2">
            {(users.length > 0 ? users.slice(0, 4) : [user]).map((u: any, idx: number) => {
              const email = u?.email || "Admin";
              const initial = email.charAt(0).toUpperCase();
              const colors = [
                "bg-purple-950/80 text-purple-300 border-[#121522]",
                "bg-blue-950/80 text-blue-300 border-[#121522]",
                "bg-emerald-950/80 text-emerald-300 border-[#121522]",
                "bg-amber-950/80 text-amber-300 border-[#121522]",
              ];
              return (
                <Tooltip key={idx} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setTeamModalOpen(true)}
                      className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-bold shadow-2xs hover:scale-105 transition-transform ${
                        colors[idx % colors.length]
                      }`}
                    >
                      {initial}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#141824] border border-[#222A40] text-white text-xs">
                    {email} ({userRoles.find((r) => r.user_id === u?.id)?.role || "User"})
                  </TooltipContent>
                </Tooltip>
              );
            })}

            <button
              onClick={() => onNavigate("users")}
              className="h-8 w-8 rounded-full bg-[#1A1F30] hover:bg-[#232A42] border-2 border-[#121522] flex items-center justify-center text-xs font-bold text-slate-300 transition-colors shadow-2xs"
              title="Manage Team & Users"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Filters Pill Button (Actually filters the board cards!) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#181D2C] hover:bg-[#20273A] border border-[#273046] text-xs font-semibold text-slate-200 shadow-2xs transition-colors">
                <SlidersHorizontal className="h-3 w-3 text-slate-400" />
                <span>Filters</span>
                {filterType !== "all" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#5B4FF5]" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#141824] border-[#222A40] text-slate-200 shadow-xl">
              <DropdownMenuItem
                onClick={() => setFilterType("all")}
                className={`text-xs cursor-pointer ${filterType === "all" ? "font-bold text-[#5B4FF5]" : ""}`}
              >
                All Cards
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilterType("contacts")}
                className={`text-xs cursor-pointer ${filterType === "contacts" ? "font-bold text-[#5B4FF5]" : ""}`}
              >
                Contacts Only ({contacts.length})
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilterType("portfolio")}
                className={`text-xs cursor-pointer ${filterType === "portfolio" ? "font-bold text-[#5B4FF5]" : ""}`}
              >
                Portfolio Only ({portfolioItems.length})
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilterType("blog")}
                className={`text-xs cursor-pointer ${filterType === "blog" ? "font-bold text-[#5B4FF5]" : ""}`}
              >
                Blog Posts ({blogPosts.length})
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilterType("testimonials")}
                className={`text-xs cursor-pointer ${filterType === "testimonials" ? "font-bold text-[#5B4FF5]" : ""}`}
              >
                Testimonials ({testimonials.length})
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* High-contrast + Create task pill button */}
          <button
            onClick={() => setQuickCreateOpen(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold shadow-lg shadow-white/5 transition-transform active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create task</span>
          </button>
        </div>
      </div>

      {/* ============================================================
          METRICS STRIP (Connected Stat Cards)
          ============================================================ */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Contacts"
          value={stats.totalContacts}
          subtitle={`${stats.newContacts} new inquiries`}
          icon={FileText}
          variant="info"
          onClick={() => onNavigate("contacts")}
        />
        <StatCard
          title="Portfolio Items"
          value={stats.totalPortfolio}
          subtitle="Active showcase works"
          icon={FolderOpen}
          variant="warning"
          onClick={() => onNavigate("portfolio")}
        />
        <StatCard
          title="Registered Users"
          value={stats.totalUsers}
          subtitle="Workspace team accounts"
          icon={Users}
          variant="purple"
          onClick={() => onNavigate("users")}
        />
        <StatCard
          title="Administrators"
          value={adminCount}
          subtitle="Full access control"
          icon={Shield}
          variant="success"
          onClick={() => onNavigate("users")}
        />
      </div>

      {/* ============================================================
          MAIN CONTENT AREA (Board View OR Analytics View)
          ============================================================ */}
      {viewMode === "board" ? (
        /* ================= KANBAN BOARD VIEW (CONNECTED DATA) ================= */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
          {/* ---------------- COLUMN 1: TO-DO LIST ---------------- */}
          {(filterType === "all" || filterType === "contacts") && (
            <div className="space-y-4">
              {/* Column Header */}
              <div className="flex items-center justify-between px-2 py-1">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#5B4FF5]" />
                  <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-300">
                    To-do list
                  </h3>
                  <span className="text-[11px] font-bold text-slate-300 bg-[#1E2436] px-2 py-0.5 rounded-full border border-[#2B334B]">
                    {newContacts.length + inProgressContacts.length}
                  </span>
                </div>
                <button
                  onClick={() => onNavigate("contacts")}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
                  title="View all contacts"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>

              {/* REAL CONTACT CARDS (Mapped dynamically!) */}
              {filteredContacts
                .filter((c) => c.status === "new" || !c.status || c.status === "in_progress")
                .map((contact, cIdx) => {
                  const cardId = `contact-${contact.id}`;
                  const currentLikes = cardLikes[cardId] ?? (cIdx === 0 ? 4 : 2);
                  const isNew = contact.status === "new" || !contact.status;

                  return (
                    <div
                      key={contact.id}
                      onClick={() =>
                        setActiveModalCard({
                          type: "contact",
                          title: contact.name || "Contact Submission",
                          data: contact,
                        })
                      }
                      className="group relative rounded-[22px] bg-[#11172A] border border-[#1E2B4B] p-4.5 shadow-lg hover:border-blue-500/50 hover:shadow-[0_8px_24px_rgba(59,130,246,0.12)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                    >
                      {/* Badges & 3-dots Menu */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            Contacts
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isNew
                                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            }`}
                          >
                            {isNew ? "New Inquiry" : "In Progress"}
                          </span>
                        </div>

                        {/* Connected 3-Dots Action Dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="h-6 w-6 rounded-lg text-blue-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
                            >
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-[#141824] border border-[#222A40] text-slate-200 shadow-xl"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <DropdownMenuItem
                              onClick={() =>
                                setActiveModalCard({
                                  type: "contact",
                                  title: contact.name,
                                  data: contact,
                                })
                              }
                              className="text-xs cursor-pointer"
                            >
                              <Eye className="mr-2 h-3.5 w-3.5 text-blue-400" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleUpdateContactStatus(contact.id, "in_progress")}
                              className="text-xs cursor-pointer"
                            >
                              <Clock className="mr-2 h-3.5 w-3.5 text-amber-400" />
                              Mark as In Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleUpdateContactStatus(contact.id, "resolved")}
                              className="text-xs cursor-pointer"
                            >
                              <CheckCircle2 className="mr-2 h-3.5 w-3.5 text-emerald-400" />
                              Mark as Resolved
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                window.location.href = `mailto:${contact.email}?subject=Regarding your message on DigiCreativio`;
                              }}
                              className="text-xs cursor-pointer"
                            >
                              <Mail className="mr-2 h-3.5 w-3.5 text-purple-400" />
                              Reply via Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-[#20273B]" />
                            <DropdownMenuItem
                              onClick={() => handleDeleteContactItem(contact.id)}
                              className="text-xs text-rose-400 focus:text-rose-300 cursor-pointer"
                            >
                              <Trash2 className="mr-2 h-3.5 w-3.5 text-rose-400" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Title */}
                      <h4 className="font-bold text-sm text-white leading-snug line-clamp-2">
                        {contact.name}: {contact.subject || "Website Inquiry"}
                      </h4>

                      {/* Note snippet */}
                      <p className="text-xs text-slate-300/80 mt-2 line-clamp-2">
                        {contact.message
                          ? `Note: ${contact.message}`
                          : "Note: Inquired via website contact form."}
                      </p>

                      {/* Progress Dots */}
                      <ProgressDots percent={isNew ? 40 : 70} color="blue" />

                      {/* Footer row with Avatars, Message click, and Like click */}
                      <div className="flex items-center justify-between mt-3.5 pt-2 border-t border-[#1C2642]">
                        <div className="flex items-center -space-x-1.5">
                          <div className="h-6 w-6 rounded-full bg-blue-900 border border-[#11172A] flex items-center justify-center text-[10px] font-bold text-blue-200">
                            {contact.name?.slice(0, 2).toUpperCase() || "CT"}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-slate-400 text-xs">
                          <div className="flex items-center gap-1" title="Inquiry message">
                            <MessageSquare className="h-3 w-3 text-blue-400" />
                            <span className="text-[11px] font-medium text-slate-300">
                              {contact.created_at
                                ? formatDistanceToNow(new Date(contact.created_at), { addSuffix: false })
                                : "1h"}
                            </span>
                          </div>
                          <button
                            onClick={(e) => handleToggleLike(cardId, 4, e)}
                            className="flex items-center gap-1 hover:text-blue-300 transition-colors"
                            title="Upvote / Like"
                          >
                            <ThumbsUp className="h-3 w-3 text-blue-400" />
                            <span className="text-[11px] font-medium text-slate-300">
                              {currentLikes}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

              {/* INTERACTIVE CHECKLIST CARD (Ginee Mobile App Design) */}
              <div
                onClick={() => onNavigate("portfolio")}
                className="group relative rounded-[22px] bg-[#171329] border border-[#2B1F48] p-4.5 shadow-lg hover:border-purple-500/50 hover:shadow-[0_8px_24px_rgba(139,92,246,0.12)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Mobile App
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                      Action
                    </span>
                  </div>
                  <MoreHorizontal className="h-3.5 w-3.5 text-purple-400 group-hover:text-purple-300" />
                </div>

                <h4 className="font-bold text-sm text-white leading-snug">
                  Ginee mobile app design
                </h4>

                {/* Interactive Checklist (Clicking toggles item!) */}
                <div className="mt-2.5 space-y-1.5 text-xs text-slate-200 font-medium">
                  {checklistGinee.map((item) => (
                    <div
                      key={item.id}
                      onClick={(e) => toggleChecklistGinee(item.id, e)}
                      className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors"
                    >
                      {item.done ? (
                        <div className="h-3.5 w-3.5 rounded-full bg-purple-600 flex items-center justify-center text-white flex-shrink-0">
                          <Check className="h-2.5 w-2.5" />
                        </div>
                      ) : (
                        <div className="h-3.5 w-3.5 rounded-full border border-purple-400 bg-transparent flex-shrink-0" />
                      )}
                      <span className={item.done ? "text-slate-100" : "text-slate-400 line-through"}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-purple-300 mt-2.5 font-medium">
                  Note: Client onboarding meeting scheduled 10:00 AM
                </p>

                <ProgressDots
                  percent={Math.round(
                    (checklistGinee.filter((i) => i.done).length / checklistGinee.length) * 100
                  )}
                  color="purple"
                />

                <div className="flex items-center justify-between mt-3.5 pt-2 border-t border-[#251D3D]">
                  <div className="flex items-center -space-x-1.5">
                    <div className="h-6 w-6 rounded-full bg-purple-900 border border-[#171329] flex items-center justify-center text-[10px] font-bold text-purple-200">
                      JD
                    </div>
                    <div className="h-6 w-6 rounded-full bg-pink-900 border border-[#171329] flex items-center justify-center text-[10px] font-bold text-pink-200">
                      AL
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-slate-400 text-xs">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3 text-purple-400" />
                      <span className="text-[11px] font-medium text-slate-300">7</span>
                    </div>
                    <button
                      onClick={(e) => handleToggleLike("ginee-task", 2, e)}
                      className="flex items-center gap-1 hover:text-purple-300"
                    >
                      <ThumbsUp className="h-3 w-3 text-purple-400" />
                      <span className="text-[11px] font-medium text-slate-300">
                        {cardLikes["ginee-task"] ?? 2}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---------------- COLUMN 2: IN PROGRESS ---------------- */}
          {(filterType === "all" || filterType === "portfolio") && (
            <div className="space-y-4">
              {/* Column Header */}
              <div className="flex items-center justify-between px-2 py-1">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
                  <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-300">
                    In Progress
                  </h3>
                  <span className="text-[11px] font-bold text-slate-300 bg-[#1E2436] px-2 py-0.5 rounded-full border border-[#2B334B]">
                    {filteredPortfolio.length > 0 ? filteredPortfolio.length : 2}
                  </span>
                </div>
                <button
                  onClick={() => onNavigate("portfolio")}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
                  title="View all portfolio items"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>

              {/* REAL PORTFOLIO CARDS */}
              {filteredPortfolio.map((item, pIdx) => {
                const cardId = `portfolio-${item.id}`;
                const currentLikes = cardLikes[cardId] ?? (pIdx === 0 ? 6 : 3);

                return (
                  <div
                    key={item.id}
                    onClick={() =>
                      setActiveModalCard({
                        type: "portfolio",
                        title: item.title,
                        data: item,
                      })
                    }
                    className="group relative rounded-[22px] bg-[#1C160F] border border-[#382615] p-4.5 shadow-lg hover:border-amber-500/50 hover:shadow-[0_8px_24px_rgba(245,158,11,0.12)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {item.category || "Website app"}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                          Sprint {pIdx + 1}
                        </span>
                      </div>

                      {/* Dropdown Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="h-6 w-6 rounded-lg text-amber-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
                          >
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-[#141824] border border-[#222A40] text-slate-200 shadow-xl"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DropdownMenuItem
                            onClick={() =>
                              setActiveModalCard({
                                type: "portfolio",
                                title: item.title,
                                data: item,
                              })
                            }
                            className="text-xs cursor-pointer"
                          >
                            <Eye className="mr-2 h-3.5 w-3.5 text-amber-400" />
                            View Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onNavigate("portfolio")}
                            className="text-xs cursor-pointer"
                          >
                            <PenSquare className="mr-2 h-3.5 w-3.5 text-blue-400" />
                            Edit in Portfolio
                          </DropdownMenuItem>
                          {item.project_url && (
                            <DropdownMenuItem
                              onClick={() => window.open(item.project_url, "_blank")}
                              className="text-xs cursor-pointer"
                            >
                              <ExternalLink className="mr-2 h-3.5 w-3.5 text-emerald-400" />
                              Open Live Project
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <h4 className="font-bold text-sm text-white leading-snug">
                      {item.title}
                    </h4>

                    {/* Image Thumbnail Preview */}
                    <div className="mt-2.5 rounded-xl overflow-hidden border border-white/10 shadow-md bg-black/40 h-28 relative">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-amber-950/60 via-amber-900/30 to-black/80 flex flex-col items-center justify-center p-3 text-center">
                          <Sparkles className="h-6 w-6 text-amber-400 mb-1" />
                          <span className="text-[11px] font-bold text-amber-200">
                            {item.title}
                          </span>
                          <span className="text-[9px] text-amber-400/80">Active Showcase</span>
                        </div>
                      )}
                    </div>

                    <p className="text-[11px] text-amber-300/80 mt-2 font-medium line-clamp-1">
                      {item.description || "Active production showcase on live website"}
                    </p>

                    <ProgressDots percent={Math.min(60 + pIdx * 15, 95)} color="amber" />

                    <div className="flex items-center justify-between mt-3.5 pt-2 border-t border-[#2F2113]">
                      <div className="flex items-center -space-x-1.5">
                        <div className="h-6 w-6 rounded-full bg-amber-900 border border-[#1C160F] flex items-center justify-center text-[10px] font-bold text-amber-200">
                          {item.title?.slice(0, 2).toUpperCase() || "PF"}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-slate-400 text-xs">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3 text-amber-400" />
                          <span className="text-[11px] font-medium text-slate-300">
                            {item.category ? 4 : 2}
                          </span>
                        </div>
                        <button
                          onClick={(e) => handleToggleLike(cardId, 4, e)}
                          className="flex items-center gap-1 hover:text-amber-300"
                        >
                          <ThumbsUp className="h-3 w-3 text-amber-400" />
                          <span className="text-[11px] font-medium text-slate-300">
                            {currentLikes}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Template Mint Card if portfolio has fewer than 2 items */}
              {filteredPortfolio.length < 2 && (
                <div
                  onClick={() => onNavigate("portfolio")}
                  className="group relative rounded-[22px] bg-[#0D1C1A] border border-[#153630] p-4.5 shadow-lg hover:border-emerald-500/50 hover:shadow-[0_8px_24px_rgba(16,185,129,0.12)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Agencies app
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                        Action
                      </span>
                    </div>
                    <MoreHorizontal className="h-3.5 w-3.5 text-emerald-400 group-hover:text-emerald-300" />
                  </div>

                  <h4 className="font-bold text-sm text-white leading-snug">
                    Design CRM shop product page responsive website
                  </h4>

                  <p className="text-xs text-slate-300/80 mt-2 line-clamp-2">
                    Clean UI components, fluid responsive layout and high performance
                  </p>

                  <ProgressDots percent={80} color="emerald" />

                  <div className="flex items-center justify-between mt-3.5 pt-2 border-t border-[#132A26]">
                    <div className="flex items-center -space-x-1.5">
                      <div className="h-6 w-6 rounded-full bg-emerald-900 border border-[#0D1C1A] flex items-center justify-center text-[10px] font-bold text-emerald-200">
                        SC
                      </div>
                      <div className="h-6 w-6 rounded-full bg-teal-900 border border-[#0D1C1A] flex items-center justify-center text-[10px] font-bold text-teal-200">
                        MK
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-slate-400 text-xs">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3 text-emerald-400" />
                        <span className="text-[11px] font-medium text-slate-300">12</span>
                      </div>
                      <button
                        onClick={(e) => handleToggleLike("crm-portfolio", 4, e)}
                        className="flex items-center gap-1 hover:text-emerald-300"
                      >
                        <ThumbsUp className="h-3 w-3 text-emerald-400" />
                        <span className="text-[11px] font-medium text-slate-300">
                          {cardLikes["crm-portfolio"] ?? 4}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ---------------- COLUMN 3: IN REVIEW ---------------- */}
          {(filterType === "all" || filterType === "blog" || filterType === "testimonials") && (
            <div className="space-y-4">
              {/* Column Header */}
              <div className="flex items-center justify-between px-2 py-1">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#EC4899]" />
                  <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-300">
                    In Review
                  </h3>
                  <span className="text-[11px] font-bold text-slate-300 bg-[#1E2436] px-2 py-0.5 rounded-full border border-[#2B334B]">
                    {filteredBlogPosts.length + filteredTestimonials.length || 3}
                  </span>
                </div>
                <button
                  onClick={() => onNavigate("blog")}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
                  title="View all blog articles"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>

              {/* REAL BLOG POST CARDS */}
              {filteredBlogPosts.map((post, bIdx) => {
                const cardId = `blog-${post.id}`;
                const currentLikes = cardLikes[cardId] ?? 5;

                return (
                  <div
                    key={post.id}
                    onClick={() =>
                      setActiveModalCard({
                        type: "blog",
                        title: post.title,
                        data: post,
                      })
                    }
                    className="group relative rounded-[22px] bg-[#20131B] border border-[#3B1F31] p-4.5 shadow-lg hover:border-pink-500/50 hover:shadow-[0_8px_24px_rgba(236,72,153,0.12)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                          {post.category || "Documentation"}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                          Review
                        </span>
                      </div>

                      {/* Dropdown Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="h-6 w-6 rounded-lg text-pink-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
                          >
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-[#141824] border border-[#222A40] text-slate-200 shadow-xl"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DropdownMenuItem
                            onClick={() => onNavigate("blog")}
                            className="text-xs cursor-pointer"
                          >
                            <PenSquare className="mr-2 h-3.5 w-3.5 text-pink-400" />
                            Edit Article
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => window.open(`/blog/${post.slug || post.id}`, "_blank")}
                            className="text-xs cursor-pointer"
                          >
                            <ExternalLink className="mr-2 h-3.5 w-3.5 text-blue-400" />
                            Read on Website
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <h4 className="font-bold text-sm text-white leading-snug">
                      {post.title}
                    </h4>

                    <p className="text-xs text-slate-300/80 mt-2 line-clamp-2">
                      {post.excerpt || post.content?.slice(0, 80) || "Editorial article review before live publication"}
                    </p>

                    <ProgressDots percent={70} color="rose" />

                    <div className="flex items-center justify-between mt-3.5 pt-2 border-t border-[#311A29]">
                      <div className="flex items-center -space-x-1.5">
                        <div className="h-6 w-6 rounded-full bg-rose-900 border border-[#20131B] flex items-center justify-center text-[10px] font-bold text-rose-200">
                          {post.author?.slice(0, 2).toUpperCase() || "ED"}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-slate-400 text-xs">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3 text-pink-400" />
                          <span className="text-[11px] font-medium text-slate-300">
                            {post.read_time ? `${post.read_time}m` : "4m"}
                          </span>
                        </div>
                        <button
                          onClick={(e) => handleToggleLike(cardId, 5, e)}
                          className="flex items-center gap-1 hover:text-pink-300"
                        >
                          <ThumbsUp className="h-3 w-3 text-pink-400" />
                          <span className="text-[11px] font-medium text-slate-300">
                            {currentLikes}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* REAL TESTIMONIAL CARDS */}
              {filteredTestimonials.map((t) => (
                <div
                  key={t.id}
                  onClick={() =>
                    setActiveModalCard({
                      type: "testimonial",
                      title: `${t.name} (${t.company || "Client"})`,
                      data: t,
                    })
                  }
                  className="group relative rounded-[22px] bg-[#11172A] border border-[#1E2B4B] p-4.5 shadow-lg hover:border-blue-500/50 hover:shadow-[0_8px_24px_rgba(59,130,246,0.12)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {t.company || "Client Review"}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Verified
                      </span>
                    </div>
                    <MoreHorizontal className="h-3.5 w-3.5 text-blue-400 group-hover:text-blue-300" />
                  </div>

                  <h4 className="font-bold text-sm text-white leading-snug">
                    {t.name}: &ldquo;{t.content?.slice(0, 50)}...&rdquo;
                  </h4>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mt-2 text-amber-400">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-400" />
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-3.5 pt-2 border-t border-[#1C2642]">
                    <div className="flex items-center -space-x-1.5">
                      <div className="h-6 w-6 rounded-full bg-blue-900 border border-[#11172A] flex items-center justify-center text-[10px] font-bold text-blue-200">
                        {t.name?.slice(0, 2).toUpperCase() || "CL"}
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleToggleLike(`test-${t.id}`, 8, e)}
                      className="flex items-center gap-1 hover:text-blue-300"
                    >
                      <ThumbsUp className="h-3 w-3 text-blue-400" />
                      <span className="text-[11px] font-medium text-slate-300">
                        {cardLikes[`test-${t.id}`] ?? 8}
                      </span>
                    </button>
                  </div>
                </div>
              ))}

              {/* Fallback Template Card if no blogs/testimonials */}
              {filteredBlogPosts.length === 0 && filteredTestimonials.length === 0 && (
                <div
                  onClick={() => onNavigate("content")}
                  className="group relative rounded-[22px] bg-[#1C1A0F] border border-[#383215] p-4.5 shadow-lg hover:border-amber-500/50 hover:shadow-[0_8px_24px_rgba(245,158,11,0.12)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Content
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                        Action
                      </span>
                    </div>
                    <MoreHorizontal className="h-3.5 w-3.5 text-amber-400 group-hover:text-amber-300" />
                  </div>

                  <h4 className="font-bold text-sm text-white leading-snug">
                    Redesign grain website landing and login pages
                  </h4>

                  <p className="text-[11px] text-amber-300 mt-2 font-medium">
                    Note: Team alignment meeting 10:30 AM
                  </p>

                  <div className="flex items-center justify-between mt-3.5 pt-2 border-t border-[#2F2913]">
                    <div className="h-6 w-6 rounded-full bg-amber-900 border border-[#1C1A0F] flex items-center justify-center text-[10px] font-bold text-amber-200">
                      SC
                    </div>

                    <button
                      onClick={(e) => handleToggleLike("grain-task", 12, e)}
                      className="flex items-center gap-1 hover:text-amber-300"
                    >
                      <ThumbsUp className="h-3 w-3 text-amber-400" />
                      <span className="text-[11px] font-medium text-slate-300">
                        {cardLikes["grain-task"] ?? 12}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ---------------- COLUMN 4: DONE ---------------- */}
          {(filterType === "all" || filterType === "contacts") && (
            <div className="space-y-4">
              {/* Column Header */}
              <div className="flex items-center justify-between px-2 py-1">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#10B981]" />
                  <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-300">
                    Done
                  </h3>
                  <span className="text-[11px] font-bold text-slate-300 bg-[#1E2436] px-2 py-0.5 rounded-full border border-[#2B334B]">
                    {resolvedContacts.length + 1}
                  </span>
                </div>
                <button
                  onClick={() => onNavigate("contacts")}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
                  title="View processed inquiries"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>

              {/* REAL RESOLVED CONTACT CARDS */}
              {resolvedContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() =>
                    setActiveModalCard({
                      type: "contact",
                      title: contact.name,
                      data: contact,
                    })
                  }
                  className="group relative rounded-[22px] bg-[#0E1E20] border border-[#17393D] p-4.5 shadow-lg hover:border-teal-500/50 hover:shadow-[0_8px_24px_rgba(20,184,166,0.12)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                        {contact.status || "Resolved"}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                        Completed
                      </span>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="h-6 w-6 rounded-lg text-teal-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-[#141824] border border-[#222A40] text-slate-200 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenuItem
                          onClick={() => handleUpdateContactStatus(contact.id, "new")}
                          className="text-xs cursor-pointer"
                        >
                          <Clock className="mr-2 h-3.5 w-3.5 text-blue-400" />
                          Reopen Inquiry
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            window.location.href = `mailto:${contact.email}`;
                          }}
                          className="text-xs cursor-pointer"
                        >
                          <Mail className="mr-2 h-3.5 w-3.5 text-purple-400" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteContactItem(contact.id)}
                          className="text-xs text-rose-400 focus:text-rose-300 cursor-pointer"
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5 text-rose-400" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <h4 className="font-bold text-sm text-white leading-snug">
                    {contact.name}: {contact.subject || "Processed Inquiry"}
                  </h4>

                  <p className="text-xs text-slate-300/80 mt-2 line-clamp-2">
                    {contact.message}
                  </p>

                  <ProgressDots percent={100} color="teal" />

                  <div className="flex items-center justify-between mt-3.5 pt-2 border-t border-[#162D30]">
                    <div className="flex items-center -space-x-1.5">
                      <div className="h-6 w-6 rounded-full bg-teal-900 border border-[#0E1E20] flex items-center justify-center text-[10px] font-bold text-teal-200">
                        {contact.name?.slice(0, 2).toUpperCase() || "CT"}
                      </div>
                    </div>

                    <span className="text-[11px] text-teal-400 font-semibold">Done</span>
                  </div>
                </div>
              ))}

              {/* FULL SERVICE CHECKLIST CARD (Matches Screenshot!) */}
              <div
                onClick={() => onNavigate("services")}
                className="group relative rounded-[22px] bg-[#0E1E20] border border-[#17393D] p-4.5 shadow-lg hover:border-teal-500/50 hover:shadow-[0_8px_24px_rgba(20,184,166,0.12)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      Brand app
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                      Action
                    </span>
                  </div>
                  <MoreHorizontal className="h-3.5 w-3.5 text-teal-400 group-hover:text-teal-300" />
                </div>

                <h4 className="font-bold text-sm text-white leading-snug">
                  Affitio product full service
                </h4>

                {/* Interactive Cyan Checklist */}
                <div className="mt-2.5 space-y-1.5 text-xs text-slate-200 font-medium">
                  {checklistService.map((item) => (
                    <div
                      key={item.id}
                      onClick={(e) => toggleChecklistService(item.id, e)}
                      className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors"
                    >
                      <span
                        className={`h-2 w-2 rounded-full transition-all ${
                          item.done
                            ? "bg-teal-400 shadow-[0_0_6px_rgba(45,212,191,0.6)]"
                            : "border border-teal-500/50 bg-transparent"
                        }`}
                      />
                      <span className={item.done ? "text-slate-100" : "text-slate-400 line-through"}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-3.5 pt-2 border-t border-[#162D30]">
                  <div className="flex items-center -space-x-1.5">
                    <div className="h-6 w-6 rounded-full bg-teal-900 border border-[#0E1E20] flex items-center justify-center text-[10px] font-bold text-teal-200">
                      MK
                    </div>
                    <div className="h-6 w-6 rounded-full bg-blue-900 border border-[#0E1E20] flex items-center justify-center text-[10px] font-bold text-blue-200">
                      BS
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-slate-400 text-xs">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3 text-teal-400" />
                      <span className="text-[11px] font-medium text-slate-300">1</span>
                    </div>
                    <button
                      onClick={(e) => handleToggleLike("affitio-task", 2, e)}
                      className="flex items-center gap-1 hover:text-teal-300"
                    >
                      <ThumbsUp className="h-3 w-3 text-teal-400" />
                      <span className="text-[11px] font-medium text-slate-300">
                        {cardLikes["affitio-task"] ?? 2}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ================= ANALYTICS & TABLES VIEW (CONNECTED ACTIONS) ================= */
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Contacts Table / List with real Action Buttons! */}
            <div className="rounded-3xl bg-[#121522] border border-[#1E2336] p-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-[#1E2336]">
                <div>
                  <h3 className="text-base font-bold text-white">Recent Contacts</h3>
                  <p className="text-xs text-slate-400">Manage client submissions</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate("contacts")}
                  className="text-xs font-semibold text-[#818CF8] hover:bg-purple-950/40"
                >
                  View all ({contacts.length})
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="divide-y divide-[#1A2033] mt-2">
                {contacts.slice(0, 6).map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between py-3.5 hover:bg-white/5 px-2 rounded-xl transition-colors"
                  >
                    <div
                      onClick={() =>
                        setActiveModalCard({
                          type: "contact",
                          title: contact.name,
                          data: contact,
                        })
                      }
                      className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                    >
                      <div className="h-9 w-9 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800/40 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {contact.name?.slice(0, 2).toUpperCase() || "CT"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">
                          {contact.name}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {contact.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <select
                        value={contact.status || "new"}
                        onChange={(e) => handleUpdateContactStatus(contact.id, e.target.value)}
                        className="text-[11px] bg-[#161B2B] text-slate-200 border border-[#252E46] rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
                      >
                        <option value="new">New</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="archived">Archived</option>
                      </select>

                      <button
                        onClick={() => handleDeleteContactItem(contact.id)}
                        className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                        title="Delete contact"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {contacts.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-6">
                    No contact submissions yet
                  </p>
                )}
              </div>
            </div>

            {/* Recent Portfolio Items */}
            <div className="rounded-3xl bg-[#121522] border border-[#1E2336] p-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-[#1E2336]">
                <div>
                  <h3 className="text-base font-bold text-white">Portfolio Items</h3>
                  <p className="text-xs text-slate-400">Featured agency showcase</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate("portfolio")}
                  className="text-xs font-semibold text-[#818CF8] hover:bg-purple-950/40"
                >
                  Manage ({portfolioItems.length})
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="divide-y divide-[#1A2033] mt-2">
                {portfolioItems.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    onClick={() =>
                      setActiveModalCard({
                        type: "portfolio",
                        title: item.title,
                        data: item,
                      })
                    }
                    className="flex items-center gap-3 py-3 hover:bg-white/5 px-2 rounded-xl transition-colors cursor-pointer"
                  >
                    <div className="h-11 w-11 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0 border border-white/10">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-slate-500 bg-slate-900">
                          <FolderOpen className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {item.description || item.category}
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold bg-amber-950/50 text-amber-300 border border-amber-800/40 px-2 py-0.5 rounded-full flex-shrink-0">
                      {item.category || "Project"}
                    </span>
                  </div>
                ))}

                {portfolioItems.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-6">
                    No portfolio items yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          QUICK ACTIONS BAR (Connected Shortcuts)
          ============================================================ */}
      <div className="rounded-3xl bg-[#121522] border border-[#1E2336] p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Quick Actions</h3>
            <p className="text-xs text-slate-400">Direct shortcuts to admin modules</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button
            onClick={() => onNavigate("portfolio")}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#1C160F] hover:bg-[#271E15] border border-[#382615] transition-all text-left group"
          >
            <div className="h-10 w-10 rounded-xl bg-amber-950/80 border border-amber-800/40 flex items-center justify-center text-amber-400 flex-shrink-0 group-hover:scale-105 transition-transform">
              <FolderOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Portfolio</p>
              <p className="text-[11px] text-slate-400">Add or manage projects</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate("blog")}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#201217] hover:bg-[#2C1920] border border-[#3B1C27] transition-all text-left group"
          >
            <div className="h-10 w-10 rounded-xl bg-rose-950/80 border border-rose-800/40 flex items-center justify-center text-rose-400 flex-shrink-0 group-hover:scale-105 transition-transform">
              <PenSquare className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Blog Posts</p>
              <p className="text-[11px] text-slate-400">Publish articles &amp; news</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate("content")}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#11172A] hover:bg-[#18213B] border border-[#1E2B4B] transition-all text-left group"
          >
            <div className="h-10 w-10 rounded-xl bg-blue-950/80 border border-blue-800/40 flex items-center justify-center text-blue-400 flex-shrink-0 group-hover:scale-105 transition-transform">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Site Content</p>
              <p className="text-[11px] text-slate-400">Edit sections &amp; copy</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate("settings")}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#171329] hover:bg-[#201B3A] border border-[#2B1F48] transition-all text-left group"
          >
            <div className="h-10 w-10 rounded-xl bg-purple-950/80 border border-purple-800/40 flex items-center justify-center text-purple-400 flex-shrink-0 group-hover:scale-105 transition-transform">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Site Settings</p>
              <p className="text-[11px] text-slate-400">Theme, SEO &amp; metadata</p>
            </div>
          </button>
        </div>
      </div>

      {/* ============================================================
          QUICK CREATE TASK MODAL
          ============================================================ */}
      <Dialog open={quickCreateOpen} onOpenChange={setQuickCreateOpen}>
        <DialogContent className="sm:max-w-md bg-[#131724] border border-[#232B40] text-slate-100">
          <DialogHeader>
            <DialogTitle className="text-white text-lg font-bold">
              Create New Item
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Select an administrative task or entry to create
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2.5 py-3">
            <button
              onClick={() => {
                setQuickCreateOpen(false);
                onNavigate("portfolio");
              }}
              className="flex items-center justify-between p-3 rounded-xl bg-[#1C160F] hover:bg-[#261E15] border border-[#382615] text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <FolderOpen className="h-4 w-4 text-amber-400" />
                <div>
                  <p className="text-xs font-bold text-white">New Portfolio Project</p>
                  <p className="text-[10px] text-slate-400">Add screenshot, tags &amp; details</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-amber-400" />
            </button>

            <button
              onClick={() => {
                setQuickCreateOpen(false);
                onNavigate("blog");
              }}
              className="flex items-center justify-between p-3 rounded-xl bg-[#201217] hover:bg-[#2B1920] border border-[#3B1C27] text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <PenSquare className="h-4 w-4 text-rose-400" />
                <div>
                  <p className="text-xs font-bold text-white">New Blog Post</p>
                  <p className="text-[10px] text-slate-400">Write an article with rich editor</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-rose-400" />
            </button>

            <button
              onClick={() => {
                setQuickCreateOpen(false);
                onNavigate("testimonials");
              }}
              className="flex items-center justify-between p-3 rounded-xl bg-[#11172A] hover:bg-[#18213B] border border-[#1E2B4B] text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-blue-400" />
                <div>
                  <p className="text-xs font-bold text-white">New Client Testimonial</p>
                  <p className="text-[10px] text-slate-400">Add feedback with rating stars</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-blue-400" />
            </button>

            <button
              onClick={() => {
                setQuickCreateOpen(false);
                onNavigate("contacts");
              }}
              className="flex items-center justify-between p-3 rounded-xl bg-[#171329] hover:bg-[#201B3A] border border-[#2B1F48] text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 text-purple-400" />
                <div>
                  <p className="text-xs font-bold text-white">Review Inquiries</p>
                  <p className="text-[10px] text-slate-400">Respond to client leads</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-purple-400" />
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ============================================================
          TEAM MEMBERS MODAL
          ============================================================ */}
      <Dialog open={teamModalOpen} onOpenChange={setTeamModalOpen}>
        <DialogContent className="sm:max-w-md bg-[#131724] border border-[#232B40] text-slate-100">
          <DialogHeader>
            <DialogTitle className="text-white text-lg font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-400" />
              Workspace Team Members
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Users registered in this system with their access roles
            </DialogDescription>
          </DialogHeader>

          <div className="divide-y divide-[#1F2538] max-h-60 overflow-y-auto py-2">
            {(users.length > 0 ? users : [user]).map((u: any, idx: number) => {
              const uRole = userRoles.find((r) => r.user_id === u?.id)?.role || "User";
              return (
                <div key={idx} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                      {u?.email?.slice(0, 2).toUpperCase() || "AD"}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{u?.email || "Admin"}</p>
                      <p className="text-[10px] text-slate-400">{uRole.toUpperCase()}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      uRole === "admin"
                        ? "bg-purple-950/80 text-purple-300 border border-purple-800/40"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {uRole}
                  </span>
                </div>
              );
            })}
          </div>

          <DialogFooter>
            <Button
              size="sm"
              onClick={() => {
                setTeamModalOpen(false);
                onNavigate("users");
              }}
              className="w-full bg-[#5B4FF5] hover:bg-[#4E41F3] text-white text-xs"
            >
              Open Users Management Tab
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============================================================
          INTERACTIVE CARD DETAIL MODAL (Fully Connected!)
          ============================================================ */}
      <Dialog open={!!activeModalCard} onOpenChange={() => setActiveModalCard(null)}>
        <DialogContent className="sm:max-w-lg bg-[#131724] border border-[#232B40] text-slate-100">
          <DialogHeader>
            <DialogTitle className="text-white text-base font-bold flex items-center gap-2">
              {activeModalCard?.type === "contact" && <MessageSquare className="h-4 w-4 text-blue-400" />}
              {activeModalCard?.type === "portfolio" && <FolderOpen className="h-4 w-4 text-amber-400" />}
              {activeModalCard?.type === "blog" && <PenSquare className="h-4 w-4 text-rose-400" />}
              {activeModalCard?.type === "testimonial" && <Star className="h-4 w-4 text-yellow-400" />}
              <span>{activeModalCard?.title || "Item Details"}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              {activeModalCard?.type === "contact" && "Client submission message and actions"}
              {activeModalCard?.type === "portfolio" && "Portfolio project details and preview"}
              {activeModalCard?.type === "blog" && "Blog post summary and options"}
              {activeModalCard?.type === "testimonial" && "Client testimonial review"}
            </DialogDescription>
          </DialogHeader>

          {/* CONTACT DETAILS */}
          {activeModalCard?.type === "contact" && activeModalCard?.data && (
            <div className="space-y-3 py-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-[#181D2C] border border-[#242C42] rounded-xl space-y-1">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Email</p>
                  <p className="font-medium text-white truncate">{activeModalCard.data.email}</p>
                </div>
                <div className="p-3 bg-[#181D2C] border border-[#242C42] rounded-xl space-y-1">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Status</p>
                  <select
                    value={activeModalCard.data.status || "new"}
                    onChange={(e) =>
                      handleUpdateContactStatus(activeModalCard.data.id, e.target.value)
                    }
                    className="w-full bg-[#121522] border border-[#2A344E] text-white rounded p-1 text-xs focus:ring-1 focus:ring-purple-500 cursor-pointer"
                  >
                    <option value="new">New Inquiry</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {activeModalCard.data.subject && (
                <div className="p-3 bg-[#181D2C] border border-[#242C42] rounded-xl space-y-1">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Subject</p>
                  <p className="font-medium text-white">{activeModalCard.data.subject}</p>
                </div>
              )}

              <div className="p-3 bg-[#181D2C] border border-[#242C42] rounded-xl space-y-1">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Message</p>
                <p className="font-normal text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {activeModalCard.data.message}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>Received: {activeModalCard.data.created_at ? format(new Date(activeModalCard.data.created_at), "PPP p") : "Recent"}</span>
              </div>
            </div>
          )}

          {/* PORTFOLIO DETAILS */}
          {activeModalCard?.type === "portfolio" && activeModalCard?.data && (
            <div className="space-y-3 py-2 text-xs">
              {activeModalCard.data.image_url && (
                <div className="rounded-xl overflow-hidden border border-white/10 max-h-48 bg-black/60">
                  <img
                    src={activeModalCard.data.image_url}
                    alt={activeModalCard.data.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-3 bg-[#181D2C] border border-[#242C42] rounded-xl space-y-1">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Category</p>
                <p className="font-bold text-amber-300">{activeModalCard.data.category || "General"}</p>
              </div>

              <div className="p-3 bg-[#181D2C] border border-[#242C42] rounded-xl space-y-1">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Description</p>
                <p className="text-slate-200 leading-relaxed">{activeModalCard.data.description}</p>
              </div>
            </div>
          )}

          {/* BLOG DETAILS */}
          {activeModalCard?.type === "blog" && activeModalCard?.data && (
            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 bg-[#181D2C] border border-[#242C42] rounded-xl space-y-1">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Category / Read Time</p>
                <p className="font-bold text-rose-300">{activeModalCard.data.category} &bull; {activeModalCard.data.read_time || "5"} min read</p>
              </div>
              <div className="p-3 bg-[#181D2C] border border-[#242C42] rounded-xl space-y-1">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Excerpt</p>
                <p className="text-slate-200 leading-relaxed">{activeModalCard.data.excerpt || activeModalCard.data.content?.slice(0, 200)}</p>
              </div>
            </div>
          )}

          {/* TESTIMONIAL DETAILS */}
          {activeModalCard?.type === "testimonial" && activeModalCard?.data && (
            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 bg-[#181D2C] border border-[#242C42] rounded-xl space-y-1">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Rating &amp; Company</p>
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: activeModalCard.data.rating || 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                  ))}
                  <span className="text-slate-300 ml-2 font-semibold">{activeModalCard.data.company}</span>
                </div>
              </div>
              <div className="p-3 bg-[#181D2C] border border-[#242C42] rounded-xl space-y-1">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Client Review</p>
                <p className="text-slate-200 leading-relaxed italic">&ldquo;{activeModalCard.data.content}&rdquo;</p>
              </div>
            </div>
          )}

          {/* Modal Footer Actions */}
          <DialogFooter className="flex items-center justify-between sm:justify-between w-full pt-2">
            <div>
              {activeModalCard?.type === "contact" && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteContactItem(activeModalCard.data.id)}
                  className="text-xs bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/40"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  Delete
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveModalCard(null)}
                className="text-xs border-[#252C42] text-slate-300 hover:bg-white/5"
              >
                Close
              </Button>

              {activeModalCard?.type === "contact" && (
                <Button
                  size="sm"
                  onClick={() => {
                    window.location.href = `mailto:${activeModalCard.data.email}?subject=Regarding your message on DigiCreativio`;
                  }}
                  className="text-xs bg-purple-600 hover:bg-purple-500 text-white"
                >
                  <Mail className="h-3.5 w-3.5 mr-1.5" />
                  Reply via Email
                </Button>
              )}

              {activeModalCard?.type === "portfolio" && (
                <Button
                  size="sm"
                  onClick={() => {
                    setActiveModalCard(null);
                    onNavigate("portfolio");
                  }}
                  className="text-xs bg-amber-600 hover:bg-amber-500 text-white"
                >
                  Edit in Portfolio
                </Button>
              )}

              {activeModalCard?.type === "blog" && (
                <Button
                  size="sm"
                  onClick={() => {
                    setActiveModalCard(null);
                    onNavigate("blog");
                  }}
                  className="text-xs bg-rose-600 hover:bg-rose-500 text-white"
                >
                  Edit in Blog
                </Button>
              )}

              {activeModalCard?.type === "testimonial" && (
                <Button
                  size="sm"
                  onClick={() => {
                    setActiveModalCard(null);
                    onNavigate("testimonials");
                  }}
                  className="text-xs bg-blue-600 hover:bg-blue-500 text-white"
                >
                  Manage Testimonials
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
