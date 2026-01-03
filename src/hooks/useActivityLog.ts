import { supabase } from "@/integrations/supabase/client";

type ActionType = 
  | "create" 
  | "update" 
  | "delete" 
  | "role_change" 
  | "status_change"
  | "reorder";

type EntityType = 
  | "portfolio_item" 
  | "contact" 
  | "user_role" 
  | "site_content" 
  | "social_link" 
  | "site_setting";

interface LogActivityParams {
  actionType: ActionType;
  entityType: EntityType;
  entityId?: string;
  entityName?: string;
  details?: Record<string, any>;
}

export function useActivityLog() {
  const logActivity = async ({
    actionType,
    entityType,
    entityId,
    entityName,
    details = {},
  }: LogActivityParams) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.warn("No user found for activity log");
        return;
      }

      const { error } = await supabase.from("activity_logs").insert({
        user_id: user.id,
        user_email: user.email,
        action_type: actionType,
        entity_type: entityType,
        entity_id: entityId,
        entity_name: entityName,
        details,
      });

      if (error) {
        console.error("Failed to log activity:", error);
      }
    } catch (err) {
      console.error("Activity logging error:", err);
    }
  };

  return { logActivity };
}
