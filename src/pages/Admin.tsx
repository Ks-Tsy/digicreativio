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
import { Loader2, Plus, Trash2, Upload, Users, FileText, Database, BarChart3, Shield, LogOut, Eye, Edit, RefreshCw, Settings, FileEdit, Save, X, Share2 } from "lucide-react";
import { ShortId } from "@/components/ShortId";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DraggableSocialLinks } from "@/components/admin/DraggableSocialLinks";
import { DraggablePortfolioItems } from "@/components/admin/DraggablePortfolioItems";

export default function Admin() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<any[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [userRoles, setUserRoles] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [stats, setStats] = useState({
    totalContacts: 0,
    newContacts: 0,
    totalPortfolio: 0,
    totalUsers: 0
  });
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    image_url: "",
    category: "image",
    project_url: "",
  });
  
  // Database management state
  const [selectedTable, setSelectedTable] = useState<"contact_submissions" | "portfolio_items" | "profiles" | "user_roles" | "site_content" | "site_settings">("contact_submissions");
  const [tableData, setTableData] = useState<any[]>([]);
  const [tableColumns, setTableColumns] = useState<string[]>([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [showAddRecordForm, setShowAddRecordForm] = useState(false);
  
  // Content management state
  const [siteContent, setSiteContent] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any[]>([]);
  const [editingContent, setEditingContent] = useState<any>(null);
  
  // Social links management state
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [showAddSocialForm, setShowAddSocialForm] = useState(false);
  const [newSocialLink, setNewSocialLink] = useState({
    platform: "",
    url: "",
    icon_name: "",
    display_order: 0,
    is_active: true
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
    
    // Load contact submissions
    const { data: contactData } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    
    // Load portfolio items
    const { data: portfolioData } = await supabase
      .from("portfolio_items")
      .select("*")
      .order("display_order", { ascending: true });
    
    // Load profiles (users)
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    // Load user roles
    const { data: rolesData } = await supabase
      .from("user_roles")
      .select("*");
    
    // Load site content
    const { data: contentData } = await supabase
      .from("site_content")
      .select("*")
      .order("page_name", { ascending: true });
    
    // Load site settings
    const { data: settingsData } = await supabase
      .from("site_settings")
      .select("*")
      .order("setting_type", { ascending: true });
    
    // Load social links
    const { data: socialData } = await supabase
      .from("social_links")
      .select("*")
      .order("display_order", { ascending: true });
    
    setContacts(contactData || []);
    setPortfolioItems(portfolioData || []);
    setUsers(profilesData || []);
    setUserRoles(rolesData || []);
    setSiteContent(contentData || []);
    setSiteSettings(settingsData || []);
    setSocialLinks(socialData || []);

    // Calculate stats
    setStats({
      totalContacts: contactData?.length || 0,
      newContacts: contactData?.filter(c => c.status === 'new').length || 0,
      totalPortfolio: portfolioData?.length || 0,
      totalUsers: profilesData?.length || 0
    });
    
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

  const handleDeleteContact = async (id: string) => {
    const { error } = await supabase
      .from("contact_submissions")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete contact",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Contact deleted successfully",
      });
      loadData();
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    // First, delete existing role
    await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId);

    // Then insert new role
    const { error } = await supabase
      .from("user_roles")
      .insert([{ user_id: userId, role: newRole as any }]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      loadData();
    }
  };

  const getUserRole = (userId: string) => {
    const role = userRoles.find(r => r.user_id === userId);
    return role?.role || 'user';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAddPortfolioItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let fileUrl = newItem.image_url;

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio-files')
          .upload(filePath, selectedFile);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('portfolio-files')
          .getPublicUrl(filePath);

        fileUrl = publicUrl;
      }

      const { error } = await supabase
        .from("portfolio_items")
        .insert([{ ...newItem, image_url: fileUrl }]);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Portfolio item added successfully",
      });
      
      setNewItem({
        title: "",
        description: "",
        image_url: "",
        category: "image",
        project_url: "",
      });
      setSelectedFile(null);
      setShowAddForm(false);
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
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

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  // Content management functions
  const handleUpdateContent = async (id: string, newData: any) => {
    const { error } = await supabase
      .from("site_content")
      .update({ content_data: newData, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Content updated successfully",
      });
      setEditingContent(null);
      loadData();
    }
  };
  
  const handleUpdateSetting = async (id: string, newValue: any) => {
    const { error } = await supabase
      .from("site_settings")
      .update({ setting_value: newValue, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update setting",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Setting updated successfully",
      });
      loadData();
    }
  };
  
  // Social links management functions
  const handleAddSocialLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase
      .from("social_links")
      .insert([newSocialLink]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add social link",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Social link added successfully",
      });
      setNewSocialLink({
        platform: "",
        url: "",
        icon_name: "",
        display_order: 0,
        is_active: true
      });
      setShowAddSocialForm(false);
      loadData();
    }
  };
  
  const handleUpdateSocialLink = async (id: string, updates: any) => {
    const { error } = await supabase
      .from("social_links")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update social link",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Social link updated successfully",
      });
      loadData();
    }
  };
  
  const handleDeleteSocialLink = async (id: string) => {
    const { error } = await supabase
      .from("social_links")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete social link",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Social link deleted successfully",
      });
      loadData();
    }
  };

  // Database management functions
  const loadTableData = async (tableName: "contact_submissions" | "portfolio_items" | "profiles" | "user_roles" | "site_content" | "site_settings") => {
    setLoadingTable(true);
    setSelectedTable(tableName);
    
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
      toast({
        title: "Error",
        description: `Failed to load table data: ${error.message}`,
        variant: "destructive",
      });
      setTableData([]);
      setTableColumns([]);
    } finally {
      setLoadingTable(false);
    }
  };

  const handleDeleteRecord = async (tableName: "contact_submissions" | "portfolio_items" | "profiles" | "user_roles" | "site_content" | "site_settings", id: string) => {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq("id", id);

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
      loadTableData(tableName);
      loadData();
    }
  };

  const handleUpdateRecord = async (tableName: "contact_submissions" | "portfolio_items" | "profiles" | "user_roles" | "site_content" | "site_settings", id: string, updates: any) => {
    const { error } = await supabase
      .from(tableName)
      .update(updates)
      .eq("id", id);

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
      loadTableData(tableName);
      loadData();
    }
  };

  useEffect(() => {
    if (selectedTable && user && isAdmin) {
      loadTableData(selectedTable);
    }
  }, [selectedTable, user, isAdmin]);

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* User Info Header */}
      <Card className="mb-6 bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Logged in as</p>
              <p className="text-lg font-semibold">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="default" className="text-base px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              Administrator
            </Badge>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Complete control center for your website</p>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-8 max-w-full mb-8">
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="content">
            <FileEdit className="h-4 w-4 mr-2" />
            Content
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="social">
            <Share2 className="h-4 w-4 mr-2" />
            Social
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="portfolio">
            <Database className="h-4 w-4 mr-2" />
            Portfolio
          </TabsTrigger>
          <TabsTrigger value="contacts">
            <FileText className="h-4 w-4 mr-2" />
            Contacts
          </TabsTrigger>
          <TabsTrigger value="database">
            <Database className="h-4 w-4 mr-2" />
            Database
          </TabsTrigger>
        </TabsList>

        {/* Content Management Tab */}
        <TabsContent value="content" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Content Management</CardTitle>
              <CardDescription>Edit page content for Home, About, Services, and Contact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {siteContent.map((content) => (
                  <Card key={content.id} className="border-border/50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg capitalize">{content.page_name} - {content.section_name}</CardTitle>
                          <CardDescription>
                            <ShortId id={content.id} prefix="Content" />
                          </CardDescription>
                        </div>
                        {editingContent?.id === content.id ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleUpdateContent(content.id, editingContent.content_data)}
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingContent(null)}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingContent(content)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {editingContent?.id === content.id ? (
                        <Textarea
                          value={JSON.stringify(editingContent.content_data, null, 2)}
                          onChange={(e) => {
                            try {
                              const parsed = JSON.parse(e.target.value);
                              setEditingContent({ ...editingContent, content_data: parsed });
                            } catch (err) {
                              // Invalid JSON, keep editing
                            }
                          }}
                          className="font-mono text-sm min-h-[200px]"
                          placeholder="JSON content"
                        />
                      ) : (
                        <div className="bg-muted/30 p-4 rounded-md">
                          <pre className="text-sm overflow-auto">
                            {JSON.stringify(content.content_data, null, 2)}
                          </pre>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Settings</CardTitle>
              <CardDescription>Configure global site settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {siteSettings.map((setting) => (
                  <Card key={setting.id} className="border-border/50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">{setting.setting_key}</CardTitle>
                          <CardDescription className="mt-1">
                            <ShortId id={setting.id} prefix="Setting" />
                            <span className="ml-2">• {setting.description}</span>
                          </CardDescription>
                        </div>
                        <Badge variant="outline">{setting.setting_type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={JSON.stringify(setting.setting_value, null, 2)}
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            handleUpdateSetting(setting.id, parsed);
                          } catch (err) {
                            // Invalid JSON
                          }
                        }}
                        className="font-mono text-sm min-h-[100px]"
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalContacts}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.newContacts} new submissions
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Portfolio Items</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPortfolio}</div>
                <p className="text-xs text-muted-foreground">
                  Active projects
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Registered accounts
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userRoles.filter(r => r.role === 'admin').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  With full access
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest changes across your website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">New contact submission</p>
                    <p className="text-xs text-muted-foreground">
                      {contacts[0]?.name || 'No recent contacts'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Latest portfolio item</p>
                    <p className="text-xs text-muted-foreground">
                      {portfolioItems[0]?.title || 'No portfolio items'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Links Management Tab */}
        <TabsContent value="social" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Manage your social media links displayed in the footer</CardDescription>
              <Button onClick={() => setShowAddSocialForm(true)} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Social Link
              </Button>
            </CardHeader>
            <CardContent>
              {showAddSocialForm && (
                <Card className="mb-6 bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Add New Social Link</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddSocialLink} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="platform">Platform Name</Label>
                          <Input
                            id="platform"
                            value={newSocialLink.platform}
                            onChange={(e) => setNewSocialLink({ ...newSocialLink, platform: e.target.value })}
                            placeholder="Facebook, Instagram, etc."
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="icon_name">Icon Name (Lucide)</Label>
                          <Input
                            id="icon_name"
                            value={newSocialLink.icon_name}
                            onChange={(e) => setNewSocialLink({ ...newSocialLink, icon_name: e.target.value })}
                            placeholder="Facebook, Instagram, Linkedin, etc."
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="url">URL</Label>
                        <Input
                          id="url"
                          type="url"
                          value={newSocialLink.url}
                          onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })}
                          placeholder="https://facebook.com/yourpage"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="display_order">Display Order</Label>
                          <Input
                            id="display_order"
                            type="number"
                            value={newSocialLink.display_order}
                            onChange={(e) => setNewSocialLink({ ...newSocialLink, display_order: parseInt(e.target.value) })}
                            min="0"
                          />
                        </div>
                        <div className="flex items-center space-x-2 pt-6">
                          <input
                            type="checkbox"
                            id="is_active"
                            checked={newSocialLink.is_active}
                            onChange={(e) => setNewSocialLink({ ...newSocialLink, is_active: e.target.checked })}
                            className="rounded"
                          />
                          <Label htmlFor="is_active">Active</Label>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit">Add Social Link</Button>
                        <Button type="button" variant="outline" onClick={() => setShowAddSocialForm(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {socialLinks.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No social links found. Add one to get started.
                </div>
              ) : (
                <DraggableSocialLinks
                  socialLinks={socialLinks}
                  onReorder={loadData}
                  onUpdate={handleUpdateSocialLink}
                  onDelete={handleDeleteSocialLink}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Management Tab */}
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage all registered users and their roles</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <ShortId id={user.id} prefix="User" />
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.full_name || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={getUserRole(user.id) === 'admin' ? 'default' : 'secondary'}>
                          {getUserRole(user.id)}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Select
                          value={getUserRole(user.id)}
                          onValueChange={(value) => handleRoleUpdate(user.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Portfolio Management Tab */}
        <TabsContent value="portfolio" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Portfolio Items</CardTitle>
                <CardDescription>Manage your portfolio projects, images, and videos</CardDescription>
              </div>
              <Button onClick={() => setShowAddForm(!showAddForm)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              {showAddForm && (
                <form onSubmit={handleAddPortfolioItem} className="space-y-4 mb-6 p-4 border rounded-lg bg-muted/50">
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
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newItem.category}
                      onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="web">Web</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="file">Upload File (Image/Video)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="file"
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        className="flex-1"
                      />
                      {selectedFile && (
                        <span className="text-sm text-muted-foreground">
                          {selectedFile.name}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Or enter a URL below instead
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image_url">File URL (optional if file uploaded)</Label>
                    <Input
                      id="image_url"
                      value={newItem.image_url}
                      onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
                      placeholder="https://example.com/image.jpg"
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
                    <Button type="submit" disabled={uploading}>
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Add Item
                        </>
                      )}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
              
              {portfolioItems.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No portfolio items found. Add one to get started.
                </div>
              ) : (
                <DraggablePortfolioItems
                  portfolioItems={portfolioItems}
                  onReorder={loadData}
                  onDelete={handleDeletePortfolioItem}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Contact Submissions Tab */}
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
                    <TableHead>ID</TableHead>
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
                      <TableCell>
                        <ShortId id={contact.id} prefix="Contact" />
                      </TableCell>
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell className="max-w-xs truncate">{contact.message}</TableCell>
                      <TableCell>
                        <Badge variant={contact.status === "new" ? "default" : "secondary"}>
                          {contact.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(contact.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="space-x-2">
                        <Select
                          value={contact.status}
                          onValueChange={(value) => handleStatusUpdate(contact.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteContact(contact.id)}
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

        {/* Database Management Tab */}
        <TabsContent value="database" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={() => loadTableData("contact_submissions")}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Contact Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalContacts}</div>
                <p className="text-xs text-muted-foreground">records</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={() => loadTableData("portfolio_items")}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Portfolio Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPortfolio}</div>
                <p className="text-xs text-muted-foreground">records</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={() => loadTableData("profiles")}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">User Profiles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">records</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={() => loadTableData("user_roles")}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">User Roles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userRoles.length}</div>
                <p className="text-xs text-muted-foreground">records</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Table: {selectedTable}</CardTitle>
                  <CardDescription>View and manage all records in this table</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => loadTableData(selectedTable)}
                  disabled={loadingTable}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loadingTable ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingTable ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : tableData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No records found in this table
                </div>
              ) : (
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {tableColumns.map((col) => (
                          <TableHead key={col} className="font-semibold">
                            {col}
                          </TableHead>
                        ))}
                        <TableHead className="font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tableData.map((record) => (
                        <TableRow key={record.id}>
                          {tableColumns.map((col) => (
                            <TableCell key={col} className="max-w-xs">
                              {editingRecord?.id === record.id ? (
                                <Input
                                  value={(editingRecord as any)[col] || ''}
                                  onChange={(e) => setEditingRecord({
                                    ...(editingRecord as any),
                                    [col]: e.target.value
                                  })}
                                  className="min-w-[100px]"
                                />
                              ) : (
                                <div className="truncate" title={String(record[col])}>
                                  {col.includes('created_at') || col.includes('updated_at')
                                    ? new Date(record[col]).toLocaleString()
                                    : String(record[col] || 'N/A')}
                                </div>
                              )}
                            </TableCell>
                          ))}
                          <TableCell>
                            <div className="flex gap-2">
                              {editingRecord?.id === record.id ? (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleUpdateRecord(selectedTable, record.id, editingRecord)}
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingRecord(null)}
                                  >
                                    Cancel
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingRecord(record)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDeleteRecord(selectedTable, record.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Storage Buckets</CardTitle>
              <CardDescription>Manage file storage buckets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">portfolio-files</p>
                  <p className="text-sm text-muted-foreground">Images & Videos storage</p>
                </div>
                <Badge variant="outline">Public</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
