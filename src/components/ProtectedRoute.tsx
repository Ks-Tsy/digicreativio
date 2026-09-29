import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/auth", { replace: true });
      } else if (requireAdmin && !isAdmin) {
        navigate("/auth", { replace: true });
      }
    }
  }, [user, isAdmin, loading, navigate, requireAdmin]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0D14] text-slate-200">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-3" />
        <p className="text-xs text-slate-400">Verifying access...</p>
      </div>
    );
  }

  // Don't render children if not authorized - show redirecting screen
  if (!user || (requireAdmin && !isAdmin)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0D14] text-slate-200">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-3" />
        <p className="text-xs text-slate-400">Redirecting to login...</p>
      </div>
    );
  }

  return <>{children}</>;
}
