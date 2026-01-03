import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Activity,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Pencil,
  Trash2,
  Shield,
  CheckCircle,
  ArrowUpDown,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface ActivityLog {
  id: string;
  user_id: string | null;
  user_email: string | null;
  action_type: string;
  entity_type: string;
  entity_id: string | null;
  entity_name: string | null;
  details: Record<string, any>;
  created_at: string;
}

interface AdminActivityLogsProps {
  activityLogs: ActivityLog[];
  onRefresh: () => void;
}

const actionIcons: Record<string, React.ReactNode> = {
  create: <Plus className="h-3.5 w-3.5" />,
  update: <Pencil className="h-3.5 w-3.5" />,
  delete: <Trash2 className="h-3.5 w-3.5" />,
  role_change: <Shield className="h-3.5 w-3.5" />,
  status_change: <CheckCircle className="h-3.5 w-3.5" />,
  reorder: <ArrowUpDown className="h-3.5 w-3.5" />,
};

const actionColors: Record<string, string> = {
  create: "bg-success/20 text-success border-success/30",
  update: "bg-info/20 text-info border-info/30",
  delete: "bg-destructive/20 text-destructive border-destructive/30",
  role_change: "bg-warning/20 text-warning border-warning/30",
  status_change: "bg-primary/20 text-primary border-primary/30",
  reorder: "bg-muted text-muted-foreground border-border",
};

const entityLabels: Record<string, string> = {
  portfolio_item: "Portfolio",
  contact: "Contact",
  user_role: "User Role",
  site_content: "Content",
  social_link: "Social Link",
  site_setting: "Setting",
};

export function AdminActivityLogs({ activityLogs, onRefresh }: AdminActivityLogsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [entityFilter, setEntityFilter] = useState<string>("all");

  const filteredLogs = activityLogs.filter((log) => {
    const matchesSearch =
      searchQuery === "" ||
      log.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entity_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action_type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = actionFilter === "all" || log.action_type === actionFilter;
    const matchesEntity = entityFilter === "all" || log.entity_type === entityFilter;

    return matchesSearch && matchesAction && matchesEntity;
  });

  const formatActionLabel = (action: string) => {
    return action.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const getActionDescription = (log: ActivityLog) => {
    const action = formatActionLabel(log.action_type);
    const entity = entityLabels[log.entity_type] || log.entity_type;
    const name = log.entity_name ? `"${log.entity_name}"` : "";
    
    if (log.action_type === "role_change" && log.details) {
      return `Changed role from ${log.details.old_role || "user"} to ${log.details.new_role || "admin"}`;
    }
    
    if (log.action_type === "status_change" && log.details) {
      return `Changed status to "${log.details.new_status}"`;
    }

    return `${action} ${entity} ${name}`.trim();
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Activity Logs
            </CardTitle>
            <CardDescription>
              Track all admin actions and changes ({filteredLogs.length} entries)
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by email, action, or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="create">Create</SelectItem>
              <SelectItem value="update">Update</SelectItem>
              <SelectItem value="delete">Delete</SelectItem>
              <SelectItem value="role_change">Role Change</SelectItem>
              <SelectItem value="status_change">Status Change</SelectItem>
              <SelectItem value="reorder">Reorder</SelectItem>
            </SelectContent>
          </Select>
          <Select value={entityFilter} onValueChange={setEntityFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Entity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Entities</SelectItem>
              <SelectItem value="portfolio_item">Portfolio</SelectItem>
              <SelectItem value="contact">Contact</SelectItem>
              <SelectItem value="user_role">User Role</SelectItem>
              <SelectItem value="site_content">Content</SelectItem>
              <SelectItem value="social_link">Social Link</SelectItem>
              <SelectItem value="site_setting">Setting</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Activity Timeline */}
        <ScrollArea className="h-[500px] pr-4">
          {filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Activity className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No activity logs found</p>
              <p className="text-sm">Actions will appear here as they happen</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredLogs.map((log, index) => {
                const initials = log.user_email?.slice(0, 2).toUpperCase() || "??";
                const isLast = index === filteredLogs.length - 1;

                return (
                  <div key={log.id} className="relative flex gap-4 pb-4">
                    {/* Timeline line */}
                    {!isLast && (
                      <div className="absolute left-[18px] top-10 bottom-0 w-px bg-border" />
                    )}

                    {/* Avatar */}
                    <Avatar className="h-9 w-9 shrink-0 border-2 border-background shadow-sm">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                              variant="outline"
                              className={`gap-1 ${actionColors[log.action_type] || ""}`}
                            >
                              {actionIcons[log.action_type]}
                              {formatActionLabel(log.action_type)}
                            </Badge>
                            <Badge variant="secondary" className="font-normal">
                              {entityLabels[log.entity_type] || log.entity_type}
                            </Badge>
                          </div>
                          <p className="text-sm text-foreground">
                            {getActionDescription(log)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            by {log.user_email || "Unknown user"}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                          </p>
                          <p className="text-xs text-muted-foreground/70">
                            {format(new Date(log.created_at), "MMM d, h:mm a")}
                          </p>
                        </div>
                      </div>

                      {/* Details JSON (if any meaningful details) */}
                      {log.details && Object.keys(log.details).length > 0 && (
                        <div className="mt-2 p-2 rounded-md bg-muted/50 text-xs font-mono text-muted-foreground overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
