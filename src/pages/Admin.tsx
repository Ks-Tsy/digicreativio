import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2 } from "lucide-react";

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<any[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    image_url: "",
    category: "",
    project_url: "",
  });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/auth");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      loadData();
    }
  }, [user, isAdmin]);

  const loadData = async () => {
    setLoadingData(true);
    
    const { data: contactData } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    
    const { data: portfolioData } = await supabase
      .from("portfolio_items")
      .select("*")
      .order("display_order", { ascending: true });
    
    setContacts(contactData || []);
    setPortfolioItems(portfolioData || []);
    setLoadingData(false);
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    const { error } = await supabase
      .from("contact_submissions")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Status updated successfully",
      });
      loadData();
    }
  };

  const handleAddPortfolioItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase
      .from("portfolio_items")
      .insert([newItem]);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Portfolio item added successfully",
      });
      setNewItem({
        title: "",
        description: "",
        image_url: "",
        category: "",
        project_url: "",
      });
      setShowAddForm(false);
      loadData();
    }
  };

  const handleDeletePortfolioItem = async (id: string) => {
    const { error } = await supabase
      .from("portfolio_items")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Portfolio item deleted successfully",
      });
      loadData();
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs defaultValue="contacts" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="contacts">Contact Submissions</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio Items</TabsTrigger>
        </TabsList>
        
        <TabsContent value="contacts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Submissions</CardTitle>
              <CardDescription>Manage inquiries from the contact form</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell>{contact.name}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell className="max-w-xs truncate">{contact.message}</TableCell>
                      <TableCell>
                        <Badge variant={contact.status === "new" ? "default" : "secondary"}>
                          {contact.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(contact.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <select
                          value={contact.status}
                          onChange={(e) => handleStatusUpdate(contact.id, e.target.value)}
                          className="rounded-md border border-border bg-background px-2 py-1"
                        >
                          <option value="new">New</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="portfolio" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Portfolio Items</CardTitle>
                <CardDescription>Manage your portfolio projects</CardDescription>
              </div>
              <Button onClick={() => setShowAddForm(!showAddForm)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              {showAddForm && (
                <form onSubmit={handleAddPortfolioItem} className="space-y-4 mb-6 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newItem.title}
                      onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      value={newItem.image_url}
                      onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project_url">Project URL (optional)</Label>
                    <Input
                      id="project_url"
                      value={newItem.project_url}
                      onChange={(e) => setNewItem({ ...newItem, project_url: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">Add Item</Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {portfolioItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <img src={item.image_url} alt={item.title} className="h-12 w-12 object-cover rounded" />
                      </TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>
                        <Badge>{item.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeletePortfolioItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
