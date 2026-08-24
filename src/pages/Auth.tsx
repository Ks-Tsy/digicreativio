import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if this is a password recovery redirect
  useEffect(() => {
    // Check hash params (older flow)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const hashType = hashParams.get('type');
    
    // Check query params (PKCE flow)
    const queryParams = new URLSearchParams(window.location.search);
    const queryType = queryParams.get('type');
    
    if (hashType === 'recovery' || queryType === 'recovery') {
      setShowUpdatePassword(true);
    }
  }, []);

  // Only redirect if user is logged in AND not in password update mode
  useEffect(() => {
    if (user && !showUpdatePassword) {
      navigate("/");
    }
  }, [user, navigate, showUpdatePassword]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Signed in successfully!",
      });
      navigate("/");
    }

    setIsLoading(false);
  };



  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully. You can now sign in.",
      });
      setShowUpdatePassword(false);
      setNewPassword("");
      setConfirmPassword("");
    }

    setIsLoading(false);
  };

  const renderContent = () => {
    if (showUpdatePassword) {
      return (
        <Card className="w-full max-w-md border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-3xl font-heading font-bold text-gradient-metallic">Set New Password</CardTitle>
            <CardDescription className="text-foreground/60">Enter your new password below</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <form onSubmit={handleUpdatePassword} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-foreground/80">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-black/50 border-white/10 focus-visible:ring-white/20 text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-foreground/80">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-black/50 border-white/10 focus-visible:ring-white/20 text-foreground"
                />
              </div>
              <Button type="submit" className="w-full bg-foreground text-background hover:bg-foreground/90 transition-all font-medium text-lg h-12" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      );
    }



    return (
      <Card className="w-full max-w-md border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
        <CardHeader className="relative z-10 pb-8">
          <CardTitle className="text-3xl font-heading font-bold text-gradient-metallic">Admin Sign In</CardTitle>
          <CardDescription className="text-foreground/60 text-base mt-2">Sign in to access the admin dashboard</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="signin-email" className="text-foreground/80 text-sm font-medium">Email</Label>
              <Input
                id="signin-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-black/50 border-white/10 focus-visible:ring-white/20 text-foreground h-12 px-4"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="signin-password" className="text-foreground/80 text-sm font-medium">Password</Label>
              <Input
                id="signin-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-black/50 border-white/10 focus-visible:ring-white/20 text-foreground h-12 px-4"
              />
            </div>
            <div className="pt-2">
              <Button type="submit" className="w-full bg-foreground text-background hover:bg-foreground/90 transition-all font-semibold text-base h-12 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 70%)` }} />
        <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-white/5 blur-[120px] rounded-full transform rotate-12" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-white/5 blur-[120px] rounded-full transform -rotate-12" />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        {/* Optional small logo top of the card could go here */}
        {renderContent()}
      </div>
    </div>
  );
}
