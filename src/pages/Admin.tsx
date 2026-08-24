import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
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
import { AdminTestimonials } from "@/components/admin/AdminTestimonials";
import { AdminBlog } from "@/components/admin/AdminBlog";
import { AdminSpamLogs } from "@/components/admin/AdminSpamLogs";
import { PAGE_TEMPLATES } from "@/utils/defaultContent";

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
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
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

    const [contactData, portfolioData, profilesData, rolesData, contentData, settingsData, socialData, logsData, testimonialsData, blogData] = await Promise.all([
      supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("portfolio_items").select("*").order("display_order", { ascending: true }),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("*"),
      supabase.from("site_content").select("*").order("page_name", { ascending: true }),
      supabase.from("site_settings").select("*").order("setting_type", { ascending: true }),
      supabase.from("social_links").select("*").order("display_order", { ascending: true }),
      supabase.from("activity_logs").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("testimonials").select("*").order("display_order", { ascending: true }),
      supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
    ]);

    console.log("=== ADMIN DATABASE DEBUG ===");
    console.log("Contacts:", contactData.data);
    console.log("Contacts Error:", contactData.error);
    console.log("Portfolio:", portfolioData.data);
    console.log("Portfolio Error:", portfolioData.error);
    console.log("Profiles:", profilesData.data);
    console.log("Profiles Error:", profilesData.error);
    console.log("User Roles:", rolesData.data);
    console.log("User Roles Error:", rolesData.error);
    console.log("Current User:", user);
    console.log("Is Admin:", isAdmin);
    console.log("=== END DEBUG ===");

    const dbSiteContent = contentData.data || [];
    const mergedSiteContent = [...dbSiteContent];

    Object.entries(PAGE_TEMPLATES).forEach(([pageName, pageTemplate]) => {
      pageTemplate.sections.forEach(sectionTemplate => {
        const exists = mergedSiteContent.some(c => c.page_name === pageName && c.section_name === sectionTemplate.name);
        if (!exists) {
          const defaultData: Record<string, string> = {};
          sectionTemplate.fields.forEach(f => {
            defaultData[f.key] = f.value;
          });

          const finalData = defaultData;

          mergedSiteContent.push({
            id: `default-${pageName}-${sectionTemplate.name}`,
            page_name: pageName,
            section_name: sectionTemplate.name,
            content_type: "text",
            content_data: finalData
          });
        }
      });
    });

    setContacts(contactData.data || []);
    setPortfolioItems(portfolioData.data || []);
    setUsers(profilesData.data || []);
    setUserRoles(rolesData.data || []);
    setSiteContent(mergedSiteContent);
    setSiteSettings(settingsData.data || []);
    setSocialLinks(socialData.data || []);
    setActivityLogs(logsData.data || []);
    setTestimonials(testimonialsData.data || []);
    setBlogPosts(blogData.data || []);

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
    const targetUser = users.find(u => u.id === userId);
    const oldRole = userRoles.find(r => r.user_id === userId)?.role || "user";

    // Validate role value
    if (!["user", "admin"].includes(newRole)) {
      toast({ title: "Error", description: "Invalid role value", variant: "destructive" });
      return;
    }

    // Enforce single admin constraint - check if trying to add a second admin
    if (newRole === "admin") {
      const existingAdmins = userRoles.filter(r => r.role === "admin" && r.user_id !== userId);
      if (existingAdmins.length > 0) {
        toast({
          title: "Error",
          description: "Only one admin user is allowed. Remove the existing admin role first.",
          variant: "destructive",
        });
        return;
      }
    }

    await supabase.from("user_roles").delete().eq("user_id", userId);
    const { error } = await supabase.from("user_roles").insert([{ user_id: userId, role: newRole as any }]);
    if (!error) {
      await logActivity({
        actionType: "role_change",
        entityType: "user_role",
        entityId: userId,
        entityName: targetUser?.email,
        details: { old_role: oldRole, new_role: newRole },
      });
      toast({ title: "Success", description: "Role updated" });
      loadData();
    } else {
      toast({ title: "Error", description: "Failed to update role", variant: "destructive" });
    }
  };

  const handleUpdateContent = async (id: string, newData: any) => {
    const content = siteContent.find(c => c.id === id);
    if (!content) return;
    const { error } = await supabase.from("site_content").update({ content_data: newData, updated_at: new Date().toISOString() }).eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to update content", variant: "destructive" });
      return;
    }

    await logActivity({
      actionType: "update",
      entityType: "site_content",
      entityId: id,
      entityName: `${content?.page_name} - ${content?.section_name}`,
    });
    toast({ title: "Success", description: "Content updated" });

    // Update local state immediately
    setSiteContent(prev => prev.map(c => c.id === id ? { ...c, content_data: newData } : c));
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
        activeTab={activeTab}
      />

      <main className={`pt-20 pb-8 px-6 transition-all duration-300 ${sidebarCollapsed ? "ml-[72px]" : "ml-64"}`}>
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
          {activeTab === "spam" && <AdminSpamLogs />}
          {activeTab === "portfolio" && (
            <AdminPortfolio portfolioItems={portfolioItems} onRefresh={loadData} />
          )}
          {activeTab === "users" && (
            <AdminUsers users={users} userRoles={userRoles} onRoleUpdate={handleRoleUpdate} />
          )}
          {activeTab === "content" && (
            <AdminContent siteContent={siteContent} onUpdateContent={handleUpdateContent} />
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
          {activeTab === "testimonials" && (
            <AdminTestimonials testimonials={testimonials} onRefresh={loadData} />
          )}
          {activeTab === "blog" && (
            <AdminBlog blogPosts={blogPosts} onRefresh={loadData} />
          )}
          {activeTab === "database" && <AdminDatabase />}
          {activeTab === "settings" && (
            <AdminSettings siteSettings={siteSettings} onUpdateSetting={handleUpdateSetting} onRefresh={loadData} />
          )}
        </div>
      </main>
    </div>
  );
}
