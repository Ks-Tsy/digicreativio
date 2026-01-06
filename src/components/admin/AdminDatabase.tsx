import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Database, RefreshCw, Trash2, Edit, Save, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ShortId } from "@/components/ShortId";

// Restrict to safe tables only - no user_roles or profiles
type TableName = "contact_submissions" | "portfolio_items" | "site_content" | "site_settings" | "social_links";

const tables: { value: TableName; label: string }[] = [
  { value: "contact_submissions", label: "Contact Submissions" },
  { value: "portfolio_items", label: "Portfolio Items" },
  { value: "site_content", label: "Site Content" },
  { value: "site_settings", label: "Site Settings" },
  { value: "social_links", label: "Social Links" },

];

export function AdminDatabase() {
  const { toast } = useToast();
  const [selectedTable, setSelectedTable] = useState<TableName>("contact_submissions");
  const [tableData, setTableData] = useState<any[]>([]);
  const [tableColumns, setTableColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);

  const loadTableData = async (tableName: TableName) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setTableColumns(Object.keys(data[0]));
        setTableData(data);
      } else {
        setTableColumns([]);
        setTableData([]);
      }
    } catch (error: any) {
      // Generic error message - don't expose internal details
      toast({
        title: "Error",
        description: "Failed to load table data",
        variant: "destructive",
      });
      setTableData([]);
      setTableColumns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTableData(selectedTable);
  }, [selectedTable]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from(selectedTable).delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete record",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Record deleted successfully",
      });
      loadTableData(selectedTable);
    }
  };

  const handleUpdate = async () => {
    if (!editingRecord) return;

    const { id, ...updates } = editingRecord;
    const { error } = await supabase.from(selectedTable).update(updates).eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update record",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Record updated successfully",
      });
      setEditingRecord(null);
      loadTableData(selectedTable);
    }
  };

  const formatCellValue = (value: any) => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "object") return JSON.stringify(value);
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return String(value);
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-info" />
            <div>
              <CardTitle>Database Explorer</CardTitle>
              <CardDescription>View and manage database records directly</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={selectedTable}
              onValueChange={(value: TableName) => setSelectedTable(value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tables.map((table) => (
                  <SelectItem key={table.value} value={table.value}>
                    {table.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => loadTableData(selectedTable)}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  {tableColumns.slice(0, 5).map((col) => (
                    <TableHead key={col} className="whitespace-nowrap">
                      {col}
                    </TableHead>
                  ))}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/20">
                    {tableColumns.slice(0, 5).map((col) => (
                      <TableCell key={col} className="max-w-[200px]">
                        {editingRecord?.id === row.id ? (
                          <Input
                            value={
                              typeof editingRecord[col] === "object"
                                ? JSON.stringify(editingRecord[col])
                                : editingRecord[col] || ""
                            }
                            onChange={(e) => {
                              let value: any = e.target.value;
                              try {
                                value = JSON.parse(value);
                              } catch {}
                              setEditingRecord({ ...editingRecord, [col]: value });
                            }}
                            className="h-8 text-sm"
                          />
                        ) : col === "id" ? (
                          <ShortId id={row.id} />
                        ) : (
                          <span className="text-sm truncate block">
                            {formatCellValue(row[col])}
                          </span>
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {editingRecord?.id === row.id ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={handleUpdate}
                            >
                              <Save className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => setEditingRecord(null)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => setEditingRecord({ ...row })}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(row.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {tableData.length === 0 && !loading && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No records found in this table
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Showing {tableData.length} records • First 5 columns displayed
        </p>
      </CardContent>
    </Card>
  );
}
