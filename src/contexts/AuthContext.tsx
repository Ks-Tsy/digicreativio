import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // CHECK ADMIN ROLE
  // ==========================================
  const checkAdminRole = async (userId: string) => {
    try {
      console.log("Checking admin role for:", userId);

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      console.log("Admin role result:", data);
      console.log("Admin role error:", error);

      if (error) {
        console.error("Admin role check failed:", error);
        setIsAdmin(false);
        return false;
      }

      const admin = !!data;
      setIsAdmin(admin);

      return admin;
    } catch (error) {
      console.error("Admin role exception:", error);
      setIsAdmin(false);
      return false;
    }
  };

  // ==========================================
  // AUTH INITIALIZATION
  // ==========================================
  useEffect(() => {
    let mounted = true;

    // Listen for Supabase auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;

      console.log("AUTH EVENT:", _event);
      console.log("AUTH USER:", newSession?.user?.id);
      console.log("AUTH EMAIL:", newSession?.user?.email);

      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        // Don't immediately query while Supabase is changing auth state
        setTimeout(() => {
          checkAdminRole(newSession.user.id);
        }, 0);
      } else {
        setIsAdmin(false);
      }
    });

    // Get existing session
    const initializeAuth = async () => {
      try {
        const {
          data: { session: currentSession },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("GET SESSION ERROR:", error);
        }

        if (!mounted) return;

        console.log("INITIAL SESSION:", currentSession);
        console.log(
          "INITIAL USER:",
          currentSession?.user?.id
        );

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          await checkAdminRole(currentSession.user.id);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("AUTH INITIALIZATION ERROR:", error);
        setUser(null);
        setSession(null);
        setIsAdmin(false);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ==========================================
  // SIGN IN
  // ==========================================
  const signIn = async (
    email: string,
    password: string
  ) => {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      console.error("LOGIN ERROR:", error);
      return { error };
    }

    if (data.session && data.user) {
      setSession(data.session);
      setUser(data.user);

      await checkAdminRole(data.user.id);
    }

    return { error: null };
  };

  // ==========================================
  // SIGN UP
  // ==========================================
  const signUp = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      console.error("SIGN UP ERROR:", error);
    }

    return { error };
  };

  // ==========================================
  // SIGN OUT
  // ==========================================
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("SIGN OUT ERROR:", error);
    }

    setUser(null);
    setSession(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ==========================================
// USE AUTH
// ==========================================
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
}