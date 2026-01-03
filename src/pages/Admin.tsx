import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useActivityLog } from "@/hooks/useActivityLog";
import { Loader2 } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { AdminContacts } from "@/components/admin/AdminContacts";
import { AdminPortfolio } from "@/components/admin/AdminPortfolio";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminContent } from "@/components/admin/AdminContent";
import { AdminSettings } from "@/components/admin/AdminSettings";
import { AdminSocial } from "@/components/admin/AdminSocial";
import { AdminDatabase } from "@/components/admin/AdminDatabase";
import { AdminActivityLogs } from "@/components/admin/AdminActivityLogs";

export default function Admin() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logActivity } = useActivityLog();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [contacts, setContacts] = useState<any[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [userRoles, setUserRoles] = useState<any[]>([]);
  const [siteContent, setSiteContent] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any[]>([]);
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const [stats, setStats] = useState({
    totalContacts: 0,
    newContacts: 0,
    totalPortfolio: 0,
    totalUsers: 0
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
    
    const [contactData, portfolioData, profilesData, rolesData, contentData, settingsData, socialData, logsData] = await Promise.all([
      supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("portfolio_items").select("*").order("display_order", { ascending: true }),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("*"),
      supabase.from("site_content").select("*").order("page_name", { ascending: true }),
      supabase.from("site_settings").select("*").order("setting_type", { ascending: true }),
      supabase.from("social_links").select("*").order("display_order", { ascending: true }),
      supabase.from("activity_logs").select("*").order("created_at", { ascending: false }).limit(100),
    ]);
    
    setContacts(contactData.data || []);
    setPortfolioItems(portfolioData.data || []);
    setUsers(profilesData.data || []);
    setUserRoles(rolesData.data || []);
    setSiteContent(contentData.data || []);
    setSiteSettings(settingsData.data || []);
    setSocialLinks(socialData.data || []);
    setActivityLogs(logsData.data || []);

    setStats({
      totalContacts: contactData.data?.length || 0,
      newContacts: contactData.data?.filter(c => c.status === 'new').length || 0,
      totalPortfolio: portfolioData.data?.length || 0,
      totalUsers: profilesData.data?.length || 0
    });
    
    setLoadingData(false);
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    const contact = contacts.find(c => c.id === id);
    const { error } = await supabase.from("contact_submissions").update({ status }).eq("id", id);
    if (!error) {
      await logActivity({
        actionType: "status_change",
        entityType: "contact",
        entityId: id,
        entityName: contact?.name,
        details: { new_status: status },
      });
      toast({ title: "Success", description: "Status updated" });
      loadData();
    }
  };

  const handleDeleteContact = async (id: string) => {
    const contact = contacts.find(c => c.id === id);
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
    if (!error) {
      await logActivity({
        actionType: "delete",
        entityType: "contact",
        entityId: id,
        entityName: contact?.name,
      });
      toast({ title: "Success", description: "Contact deleted" });
      loadData();
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    const user = users.find(u => u.id === userId);
    const oldRole = userRoles.find(r => r.user_id === userId)?.role || "user";
    await supabase.from("user_roles").delete().eq("user_id", userId);
    const { error } = await supabase.from("user_roles").insert([{ user_id: userId, role: newRole as any }]);
    if (!error) {
      await logActivity({
        actionType: "role_change",
        entityType: "user_role",
        entityId: userId,
        entityName: user?.email,
        details: { old_role: oldRole, new_role: newRole },
      });
      toast({ title: "Success", description: "Role updated" });
      loadData();
    }
  };

  const handleUpdateContent = async (id: string, newData: any) => {
    const content = siteContent.find(c => c.id === id);
    const { error } = await supabase.from("site_content").update({ content_data: newData, updated_at: new Date().toISOString() }).eq("id", id);
    if (!error) {
      await logActivity({
        actionType: "update",
        entityType: "site_content",
        entityId: id,
        entityName: `${content?.page_name} - ${content?.section_name}`,
      });
      toast({ title: "Success", description: "Content updated" });
      loadData();
    }
  };

  const handleUpdateSetting = async (id: string, newValue: any) => {
    const setting = siteSettings.find(s => s.id === id);
    const { error } = await supabase.from("site_settings").update({ setting_value: newValue, updated_at: new Date().toISOString() }).eq("id", id);
    if (!error) {
      await logActivity({
        actionType: "update",
        entityType: "site_setting",
        entityId: id,
        entityName: setting?.setting_key,
      });
      toast({ title: "Success", description: "Setting updated" });
      loadData();
    }
  };

  const handleAddSocialLink = async (link: any) => {
    const { error } = await supabase.from("social_links").insert([link]);
    if (!error) {
      await logActivity({
        actionType: "create",
        entityType: "social_link",
        entityName: link.platform,
      });
      toast({ title: "Success", description: "Social link added" });
      loadData();
    }
  };

  const handleUpdateSocialLink = async (id: string, updates: any) => {
    const socialLink = socialLinks.find(s => s.id === id);
    const { error } = await supabase.from("social_links").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id);
    if (!error) {
      await logActivity({
        actionType: "update",
        entityType: "social_link",
        entityId: id,
        entityName: socialLink?.platform,
      });
      toast({ title: "Success", description: "Social link updated" });
      loadData();
    }
  };

  const handleDeleteSocialLink = async (id: string) => {
    const socialLink = socialLinks.find(s => s.id === id);
    const { error } = await supabase.from("social_links").delete().eq("id", id);
    if (!error) {
      await logActivity({
        actionType: "delete",
        entityType: "social_link",
        entityId: id,
        entityName: socialLink?.platform,
      });
      toast({ title: "Success", description: "Social link deleted" });
      loadData();
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-info" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <AdminHeader 
        user={user} 
        onLogout={handleLogout} 
        onRefresh={loadData}
        sidebarCollapsed={sidebarCollapsed}
      />
      
      <main className={`pt-20 pb-8 px-6 transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
        <div className="max-w-7xl mx-auto">
          {activeTab === "overview" && (
            <AdminOverview
              stats={stats}
              userRoles={userRoles}
              contacts={contacts}
              portfolioItems={portfolioItems}
              onNavigate={setActiveTab}
            />
          )}
          {activeTab === "contacts" && (
            <AdminContacts
              contacts={contacts}
              onStatusUpdate={handleStatusUpdate}
              onDelete={handleDeleteContact}
            />
          )}
          {activeTab === "portfolio" && (
            <AdminPortfolio portfolioItems={portfolioItems} onRefresh={loadData} />
          )}
          {activeTab === "users" && (
            <AdminUsers users={users} userRoles={userRoles} onRoleUpdate={handleRoleUpdate} />
          )}
          {activeTab === "content" && (
            <AdminContent siteContent={siteContent} onUpdateContent={handleUpdateContent} />
          )}
          {activeTab === "settings" && (
            <AdminSettings siteSettings={siteSettings} onUpdateSetting={handleUpdateSetting} />
          )}
          {activeTab === "social" && (
            <AdminSocial
              socialLinks={socialLinks}
              onAdd={handleAddSocialLink}
              onUpdate={handleUpdateSocialLink}
              onDelete={handleDeleteSocialLink}
              onRefresh={loadData}
            />
          )}
          {activeTab === "activity" && (
            <AdminActivityLogs activityLogs={activityLogs} onRefresh={loadData} />
          )}
          {activeTab === "database" && <AdminDatabase />}
        </div>
      </main>
    </div>
  );
}
