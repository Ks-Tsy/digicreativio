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
    totalUsers: 0,
  });

  // ============================================================
  // AUTH CHECK
  // ============================================================

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/auth");
    }
  }, [user, isAdmin, loading, navigate]);

  // ============================================================
  // LOAD ADMIN DATA
  // ============================================================

  useEffect(() => {
    if (user && isAdmin) {
      loadData();
    }
  }, [user, isAdmin]);

  const loadData = async () => {
    try {
      setLoadingData(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      // --------------------------------------------------------
      // ADMIN DEBUG
      // --------------------------------------------------------

      const {
        data: adminCheck,
        error: adminCheckError,
      } = await supabase.rpc("is_admin");

      console.log("=================================");
      console.log("ADMIN DATABASE DEBUG");
      console.log("=================================");
      console.log("DATABASE is_admin():", adminCheck);
      console.log("DATABASE is_admin ERROR:", adminCheckError);
      console.log("SESSION USER ID:", session?.user?.id);
      console.log("LOGIN USER ID:", user?.id);
      console.log("SESSION EMAIL:", session?.user?.email);
      console.log("LOGIN EMAIL:", user?.email);
      console.log("=================================");

      // --------------------------------------------------------
      // LOAD ALL DATA
      // --------------------------------------------------------

      const [
        contactData,
        portfolioData,
        profilesData,
        rolesData,
        contentData,
        settingsData,
        socialData,
        logsData,
        testimonialsData,
        blogData,
      ] = await Promise.all([
        supabase
          .from("contact_submissions")
          .select("*")
          .order("created_at", { ascending: false }),

        supabase
          .from("portfolio_items")
          .select("*")
          .order("display_order", { ascending: true }),

        supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false }),

        supabase
          .from("user_roles")
          .select("*"),

        supabase
          .from("site_content")
          .select("*")
          .order("page_name", { ascending: true }),

        supabase
          .from("site_settings")
          .select("*")
          .order("setting_type", { ascending: true }),

        supabase
          .from("social_links")
          .select("*")
          .order("display_order", { ascending: true }),

        supabase
          .from("activity_logs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100),

        supabase
          .from("testimonials")
          .select("*")
          .order("display_order", { ascending: true }),

        supabase
          .from("blog_posts")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);

      // --------------------------------------------------------
      // DATABASE DEBUG
      // --------------------------------------------------------

      console.log("=== ADMIN DATABASE RESULTS ===");

      console.log("Contacts:", contactData.data);
      console.log("Contacts Error:", contactData.error);

      console.log("Portfolio:", portfolioData.data);
      console.log("Portfolio Error:", portfolioData.error);

      console.log("Profiles:", profilesData.data);
      console.log("Profiles Error:", profilesData.error);

      console.log("User Roles:", rolesData.data);
      console.log("User Roles Error:", rolesData.error);

      console.log("Site Content:", contentData.data);
      console.log("Site Content Error:", contentData.error);

      console.log("Site Settings:", settingsData.data);
      console.log("Site Settings Error:", settingsData.error);

      console.log("Social Links:", socialData.data);
      console.log("Social Links Error:", socialData.error);

      console.log("Activity Logs:", logsData.data);
      console.log("Activity Logs Error:", logsData.error);

      console.log("Testimonials:", testimonialsData.data);
      console.log("Testimonials Error:", testimonialsData.error);

      console.log("Blog Posts:", blogData.data);
      console.log("Blog Posts Error:", blogData.error);

      console.log("Current User:", user);
      console.log("Is Admin:", isAdmin);

      console.log("=== END DATABASE DEBUG ===");

      // --------------------------------------------------------
      // MERGE DATABASE CONTENT WITH DEFAULT TEMPLATES
      // --------------------------------------------------------

      const dbSiteContent = contentData.data || [];
      const mergedSiteContent = [...dbSiteContent];

      Object.entries(PAGE_TEMPLATES).forEach(
        ([pageName, pageTemplate]) => {
          pageTemplate.sections.forEach((sectionTemplate) => {
            const exists = mergedSiteContent.some(
              (content) =>
                content.page_name === pageName &&
                content.section_name === sectionTemplate.name
            );

            if (!exists) {
              const defaultData: Record<string, string> = {};

              sectionTemplate.fields.forEach((field) => {
                defaultData[field.key] = field.value;
              });

              mergedSiteContent.push({
                id: `default-${pageName}-${sectionTemplate.name}`,
                page_name: pageName,
                section_name: sectionTemplate.name,
                content_type: "text",
                content_data: defaultData,
              });
            }
          });
        }
      );

      // --------------------------------------------------------
      // SET STATE
      // --------------------------------------------------------

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

      // --------------------------------------------------------
      // STATS
      // --------------------------------------------------------

      setStats({
        totalContacts: contactData.data?.length || 0,

        newContacts:
          contactData.data?.filter(
            (contact) => contact.status === "new"
          ).length || 0,

        totalPortfolio: portfolioData.data?.length || 0,

        totalUsers: profilesData.data?.length || 0,
      });
    } catch (error) {
      console.error("ADMIN LOAD ERROR:", error);

      toast({
        title: "Error",
        description: "Failed to load admin dashboard data.",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  // ============================================================
  // CONTACT STATUS UPDATE
  // ============================================================

  const handleStatusUpdate = async (
    id: string,
    status: string
  ) => {
    const contact = contacts.find(
      (contact) => contact.id === id
    );

    const { error } = await supabase
      .from("contact_submissions")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("CONTACT STATUS ERROR:", error);

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });

      return;
    }

    await logActivity({
      actionType: "status_change",
      entityType: "contact",
      entityId: id,
      entityName: contact?.name,
      details: {
        new_status: status,
      },
    });

    toast({
      title: "Success",
      description: "Status updated",
    });

    await loadData();
  };

  // ============================================================
  // DELETE CONTACT
  // ============================================================

  const handleDeleteContact = async (id: string) => {
    const contact = contacts.find(
      (contact) => contact.id === id
    );

    const { error } = await supabase
      .from("contact_submissions")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("DELETE CONTACT ERROR:", error);

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });

      return;
    }

    await logActivity({
      actionType: "delete",
      entityType: "contact",
      entityId: id,
      entityName: contact?.name,
    });

    toast({
      title: "Success",
      description: "Contact deleted",
    });

    await loadData();
  };

  // ============================================================
  // ROLE UPDATE
  // ============================================================

  const handleRoleUpdate = async (
    userId: string,
    newRole: string
  ) => {
    const targetUser = users.find(
      (user) => user.id === userId
    );

    const oldRole =
      userRoles.find(
        (role) => role.user_id === userId
      )?.role || "user";

    // Validate role
    if (!["user", "admin"].includes(newRole)) {
      toast({
        title: "Error",
        description: "Invalid role value",
        variant: "destructive",
      });

      return;
    }

    // Single admin protection
    if (newRole === "admin") {
      const existingAdmins = userRoles.filter(
        (role) =>
          role.role === "admin" &&
          role.user_id !== userId
      );

      if (existingAdmins.length > 0) {
        toast({
          title: "Error",
          description:
            "Only one admin user is allowed. Remove the existing admin role first.",
          variant: "destructive",
        });

        return;
      }
    }

    // Delete old role
    const { error: deleteError } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId);

    if (deleteError) {
      console.error(
        "DELETE OLD ROLE ERROR:",
        deleteError
      );

      toast({
        title: "Error",
        description: deleteError.message,
        variant: "destructive",
      });

      return;
    }

    // Insert new role
    const { error: insertError } = await supabase
      .from("user_roles")
      .insert([
        {
          user_id: userId,
          role: newRole as any,
        },
      ]);

    if (insertError) {
      console.error(
        "INSERT NEW ROLE ERROR:",
        insertError
      );

      toast({
        title: "Error",
        description: insertError.message,
        variant: "destructive",
      });

      return;
    }

    await logActivity({
      actionType: "role_change",
      entityType: "user_role",
      entityId: userId,
      entityName: targetUser?.email,
      details: {
        old_role: oldRole,
        new_role: newRole,
      },
    });

    toast({
      title: "Success",
      description: "Role updated",
    });

    await loadData();
  };

  // ============================================================
  // UPDATE SITE CONTENT
  // ============================================================

  const handleUpdateContent = async (
    id: string,
    newData: any
  ) => {
    const content = siteContent.find(
      (item) => item.id === id
    );

    if (!content) {
      toast({
        title: "Error",
        description: "Content section not found",
        variant: "destructive",
      });

      return;
    }

    console.log("=================================");
    console.log("CONTENT UPDATE START");
    console.log("=================================");
    console.log("Temporary/Existing ID:", content.id);
    console.log("Page:", content.page_name);
    console.log("Section:", content.section_name);
    console.log("New Data:", newData);

    // ----------------------------------------------------------
    // IMPORTANT:
    // If this is a temporary default row, generate a REAL UUID.
    // This prevents:
    // "null value in column id violates not-null constraint"
    // ----------------------------------------------------------

    const realId =
      typeof content.id === "string" &&
        content.id.startsWith("default-")
        ? crypto.randomUUID()
        : content.id;

    console.log("Database ID to use:", realId);

    // ----------------------------------------------------------
    // UPSERT
    // ----------------------------------------------------------

    const { data, error } = await supabase
      .from("site_content")
      .upsert(
        {
          id: realId,

          page_name: content.page_name,

          section_name: content.section_name,

          content_type:
            content.content_type || "text",

          content_data: newData,

          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "page_name,section_name",
        }
      )
      .select()
      .single();

    // ----------------------------------------------------------
    // ERROR
    // ----------------------------------------------------------

    if (error) {
      console.error(
        "================================="
      );

      console.error(
        "CONTENT UPDATE ERROR"
      );

      console.error(
        "================================="
      );

      console.error("Code:", error.code);
      console.error("Message:", error.message);
      console.error("Details:", error.details);
      console.error("Hint:", error.hint);

      toast({
        title: "Error",
        description:
          error.message ||
          "Failed to update content",
        variant: "destructive",
      });

      return;
    }

    // ----------------------------------------------------------
    // SUCCESS
    // ----------------------------------------------------------

    console.log(
      "================================="
    );
    console.log(
      "CONTENT UPDATED SUCCESSFULLY"
    );
    console.log(
      "================================="
    );

    console.log("Database Row:", data);

    // ----------------------------------------------------------
    // ACTIVITY LOG
    // ----------------------------------------------------------

    await logActivity({
      actionType: "update",
      entityType: "site_content",
      entityId: data.id,
      entityName:
        `${data.page_name} - ${data.section_name}`,
    });

    // ----------------------------------------------------------
    // SUCCESS TOAST
    // ----------------------------------------------------------

    toast({
      title: "Success",
      description:
        "Content updated successfully",
    });

    // ----------------------------------------------------------
    // UPDATE LOCAL STATE IMMEDIATELY
    // ----------------------------------------------------------

    setSiteContent((prev) =>
      prev.map((item) =>
        item.id === id
          ? data
          : item
      )
    );

    // ----------------------------------------------------------
    // REFRESH FROM DATABASE
    // ----------------------------------------------------------

    await loadData();
  };

  // ============================================================
  // UPDATE SITE SETTING
  // ============================================================

  const handleUpdateSetting = async (
    id: string,
    newValue: any
  ) => {
    const setting = siteSettings.find(
      (item) => item.id === id
    );

    const { error } = await supabase
      .from("site_settings")
      .update({
        setting_value: newValue,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error(
        "SETTING UPDATE ERROR:",
        error
      );

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });

      return;
    }

    await logActivity({
      actionType: "update",
      entityType: "site_setting",
      entityId: id,
      entityName: setting?.setting_key,
    });

    toast({
      title: "Success",
      description: "Setting updated",
    });

    await loadData();
  };

  // ============================================================
  // ADD SOCIAL LINK
  // ============================================================

  const handleAddSocialLink = async (
    link: any
  ) => {
    const { error } = await supabase
      .from("social_links")
      .insert([link]);

    if (error) {
      console.error(
        "ADD SOCIAL LINK ERROR:",
        error
      );

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });

      return;
    }

    await logActivity({
      actionType: "create",
      entityType: "social_link",
      entityName: link.platform,
    });

    toast({
      title: "Success",
      description: "Social link added",
    });

    await loadData();
  };

  // ============================================================
  // UPDATE SOCIAL LINK
  // ============================================================

  const handleUpdateSocialLink = async (
    id: string,
    updates: any
  ) => {
    const socialLink = socialLinks.find(
      (item) => item.id === id
    );

    const { error } = await supabase
      .from("social_links")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error(
        "UPDATE SOCIAL LINK ERROR:",
        error
      );

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });

      return;
    }

    await logActivity({
      actionType: "update",
      entityType: "social_link",
      entityId: id,
      entityName: socialLink?.platform,
    });

    toast({
      title: "Success",
      description: "Social link updated",
    });

    await loadData();
  };

  // ============================================================
  // DELETE SOCIAL LINK
  // ============================================================

  const handleDeleteSocialLink = async (
    id: string
  ) => {
    const socialLink = socialLinks.find(
      (item) => item.id === id
    );

    const { error } = await supabase
      .from("social_links")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "DELETE SOCIAL LINK ERROR:",
        error
      );

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });

      return;
    }

    await logActivity({
      actionType: "delete",
      entityType: "social_link",
      entityId: id,
      entityName: socialLink?.platform,
    });

    toast({
      title: "Success",
      description: "Social link deleted",
    });

    await loadData();
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  // ============================================================
  // LOADING SCREEN
  // ============================================================

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-info" />

          <p className="text-muted-foreground">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // ADMIN UI
  // ============================================================

  return (
    <div className="min-h-screen bg-background">

      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <AdminHeader
        user={user}
        onLogout={handleLogout}
        onRefresh={loadData}
        sidebarCollapsed={sidebarCollapsed}
        activeTab={activeTab}
      />

      <main
        className={`
          pt-20
          pb-8
          px-6
          transition-all
          duration-300
          ${sidebarCollapsed
            ? "ml-[72px]"
            : "ml-64"}
        `}
      >
        <div className="max-w-7xl mx-auto">

          {/* OVERVIEW */}

          {activeTab === "overview" && (
            <AdminOverview
              stats={stats}
              userRoles={userRoles}
              contacts={contacts}
              portfolioItems={portfolioItems}
              onNavigate={setActiveTab}
            />
          )}

          {/* CONTACTS */}

          {activeTab === "contacts" && (
            <AdminContacts
              contacts={contacts}
              onStatusUpdate={handleStatusUpdate}
              onDelete={handleDeleteContact}
            />
          )}

          {/* SPAM */}

          {activeTab === "spam" && (
            <AdminSpamLogs />
          )}

          {/* PORTFOLIO */}

          {activeTab === "portfolio" && (
            <AdminPortfolio
              portfolioItems={portfolioItems}
              onRefresh={loadData}
            />
          )}

          {/* USERS */}

          {activeTab === "users" && (
            <AdminUsers
              users={users}
              userRoles={userRoles}
              onRoleUpdate={handleRoleUpdate}
            />
          )}

          {/* CONTENT */}

          {activeTab === "content" && (
            <AdminContent
              siteContent={siteContent}
              onUpdateContent={handleUpdateContent}
              onExit={() => setActiveTab("overview")}
            />
          )}

          {/* SOCIAL LINKS */}

          {activeTab === "social" && (
            <AdminSocial
              socialLinks={socialLinks}
              onAdd={handleAddSocialLink}
              onUpdate={handleUpdateSocialLink}
              onDelete={handleDeleteSocialLink}
              onRefresh={loadData}
            />
          )}

          {/* ACTIVITY */}

          {activeTab === "activity" && (
            <AdminActivityLogs
              activityLogs={activityLogs}
              onRefresh={loadData}
            />
          )}

          {/* TESTIMONIALS */}

          {activeTab === "testimonials" && (
            <AdminTestimonials
              testimonials={testimonials}
              onRefresh={loadData}
            />
          )}

          {/* BLOG */}

          {activeTab === "blog" && (
            <AdminBlog
              blogPosts={blogPosts}
              onRefresh={loadData}
            />
          )}

          {/* DATABASE */}

          {activeTab === "database" && (
            <AdminDatabase />
          )}

          {/* SETTINGS */}

          {activeTab === "settings" && (
            <AdminSettings
              siteSettings={siteSettings}
              onUpdateSetting={handleUpdateSetting}
              onRefresh={loadData}
            />
          )}

        </div>
      </main>
    </div>
  );
}