import { StatCard } from "./StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, FolderOpen, Users, Shield, Clock, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

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
  onNavigate: (tab: string) => void;
}

export function AdminOverview({ stats, userRoles, contacts, portfolioItems, onNavigate }: AdminOverviewProps) {
  const adminCount = userRoles.filter((r) => r.role === "admin").length;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Contacts"
          value={stats.totalContacts}
          subtitle={`${stats.newContacts} new submissions`}
          icon={FileText}
          variant="info"
        />
        <StatCard
          title="Portfolio Items"
          value={stats.totalPortfolio}
          subtitle="Active projects"
          icon={FolderOpen}
          variant="success"
        />
        <StatCard
          title="Registered Users"
          value={stats.totalUsers}
          subtitle="Total accounts"
          icon={Users}
          variant="default"
        />
        <StatCard
          title="Administrators"
          value={adminCount}
          subtitle="With full access"
          icon={Shield}
          variant="warning"
        />
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Contacts */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Contacts</CardTitle>
              <CardDescription>Latest form submissions</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("contacts")}>
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contacts.slice(0, 4).map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between rounded-lg bg-muted/30 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-info/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-info">
                        {contact.name?.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">{contact.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={contact.status === "new" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {contact.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(contact.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              ))}
              {contacts.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No contact submissions yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Portfolio Items */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Portfolio Items</CardTitle>
              <CardDescription>Your latest work</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("portfolio")}>
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {portfolioItems.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-lg bg-muted/30 p-3"
                >
                  <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.description}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                    {item.category}
                  </Badge>
                </div>
              ))}
              {portfolioItems.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No portfolio items yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2"
              onClick={() => onNavigate("portfolio")}
            >
              <FolderOpen className="h-5 w-5" />
              <span>Add Portfolio Item</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2"
              onClick={() => onNavigate("content")}
            >
              <FileText className="h-5 w-5" />
              <span>Edit Content</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2"
              onClick={() => onNavigate("users")}
            >
              <Users className="h-5 w-5" />
              <span>Manage Users</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2"
              onClick={() => onNavigate("settings")}
            >
              <Shield className="h-5 w-5" />
              <span>Site Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
