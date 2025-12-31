import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Shield, User } from "lucide-react";
import { format } from "date-fns";
import { ShortId } from "@/components/ShortId";

interface AdminUsersProps {
  users: any[];
  userRoles: any[];
  onRoleUpdate: (userId: string, role: string) => void;
}

export function AdminUsers({ users, userRoles, onRoleUpdate }: AdminUsersProps) {
  const getUserRole = (userId: string) => {
    const role = userRoles.find((r) => r.user_id === userId);
    return role?.role || "user";
  };

  const getRoleBadge = (role: string) => {
    if (role === "admin") {
      return (
        <Badge className="bg-warning/20 text-warning border-warning/30 gap-1">
          <Shield className="h-3 w-3" />
          Admin
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="gap-1">
        <User className="h-3 w-3" />
        User
      </Badge>
    );
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          Manage all registered users and their roles ({users.length} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Change Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const currentRole = getUserRole(user.id);
                const initials = user.email?.slice(0, 2).toUpperCase() || "??";
                return (
                  <TableRow key={user.id} className="hover:bg-muted/20">
                    <TableCell>
                      <ShortId id={user.id} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-info/10 text-info text-xs">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.full_name || "Unnamed User"}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(currentRole)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(user.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={currentRole}
                        onValueChange={(value) => onRoleUpdate(user.id, value)}
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
