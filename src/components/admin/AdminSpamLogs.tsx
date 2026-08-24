import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, Clock, Shield, Trash2, RefreshCw } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface SpamLog {
  id: string;
  ip_address: string;
  reason: string;
  details: Record<string, any>;
  created_at: string;
}

interface SpamStats {
  total: number;
  byReason: Record<string, number>;
  topIPs: { ip: string; count: number }[];
}

export function AdminSpamLogs() {
  const [logs, setLogs] = useState<SpamLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [reasonFilter, setReasonFilter] = useState<string>("all");
  const [stats, setStats] = useState<SpamStats>({
    total: 0,
    byReason: {},
    topIPs: [],
  });

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("spam_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;

      const typedData = (data || []) as SpamLog[];
      setLogs(typedData);

      // Calculate stats
      const byReason: Record<string, number> = {};
      const ipCounts: Record<string, number> = {};

      typedData.forEach((log) => {
        byReason[log.reason] = (byReason[log.reason] || 0) + 1;
        ipCounts[log.ip_address] = (ipCounts[log.ip_address] || 0) + 1;
      });

      const topIPs = Object.entries(ipCounts)
        .map(([ip, count]) => ({ ip, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setStats({
        total: typedData.length,
        byReason,
        topIPs,
      });
    } catch (error) {
      console.error("Error fetching spam logs:", error);
      toast.error("Failed to load spam logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("spam_logs").delete().eq("id", id);
      if (error) throw error;
      toast.success("Log deleted");
      fetchLogs();
    } catch (error) {
      console.error("Error deleting spam log:", error);
      toast.error("Failed to delete log");
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to clear all spam logs?")) return;
    
    try {
      const { error } = await supabase.from("spam_logs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      if (error) throw error;
      toast.success("All logs cleared");
      fetchLogs();
    } catch (error) {
      console.error("Error clearing spam logs:", error);
      toast.error("Failed to clear logs");
    }
  };

  const getReasonBadge = (reason: string) => {
    switch (reason) {
      case "honeypot":
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Honeypot</Badge>;
      case "timing_too_fast":
        return <Badge className="bg-warning/20 text-warning border-warning/30">Too Fast</Badge>;
      case "timing_too_slow":
        return <Badge className="bg-info/20 text-info border-info/30">Expired</Badge>;
      case "rate_limit":
        return <Badge className="bg-purple/20 text-purple border-purple/30">Rate Limit</Badge>;
      default:
        return <Badge variant="secondary">{reason}</Badge>;
    }
  };

  const filteredLogs = logs.filter(
    (log) => reasonFilter === "all" || log.reason === reasonFilter
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Blocked</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.byReason.timing_too_fast || 0}</p>
                <p className="text-xs text-muted-foreground">Too Fast</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.byReason.honeypot || 0}</p>
                <p className="text-xs text-muted-foreground">Honeypot Caught</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-purple" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.byReason.rate_limit || 0}</p>
                <p className="text-xs text-muted-foreground">Rate Limited</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Offending IPs */}
      {stats.topIPs.length > 0 && (
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Top Suspicious IPs</CardTitle>
            <CardDescription>Most frequently blocked IP addresses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.topIPs.map(({ ip, count }) => (
                <Badge key={ip} variant="outline" className="text-sm py-1.5 px-3">
                  <code className="mr-2">{ip}</code>
                  <span className="text-muted-foreground">({count} attempts)</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Logs Table */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Spam Activity Log</CardTitle>
              <CardDescription>
                Recent suspicious contact form submissions ({filteredLogs.length} entries)
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={reasonFilter} onValueChange={setReasonFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="honeypot">Honeypot</SelectItem>
                  <SelectItem value="timing_too_fast">Too Fast</SelectItem>
                  <SelectItem value="timing_too_slow">Expired</SelectItem>
                  <SelectItem value="rate_limit">Rate Limit</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={fetchLogs} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
              {logs.length > 0 && (
                <Button variant="outline" size="sm" onClick={handleClearAll} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>IP Address</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/20">
                    <TableCell>
                      <code className="text-sm bg-muted/50 px-2 py-1 rounded">{log.ip_address}</code>
                    </TableCell>
                    <TableCell>{getReasonBadge(log.reason)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {log.details && Object.keys(log.details).length > 0 ? (
                        <span title={JSON.stringify(log.details, null, 2)}>
                          {Object.entries(log.details)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(", ")}
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <span title={format(new Date(log.created_at), "PPpp")}>
                        {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(log.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredLogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {loading ? "Loading..." : "No spam activity detected"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
