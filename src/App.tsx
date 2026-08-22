import { useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/AIChatbot";
import { Preloader } from "@/components/Preloader";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppLayout = () => {
  const [isPreloaded, setIsPreloaded] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname === "/admin" || location.pathname === "/admin-setup";
  
  return (
    <div className="flex flex-col min-h-screen">
      <Preloader onComplete={() => setIsPreloaded(true)} />
      {isPreloaded && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.8 }}
          className="flex flex-col min-h-screen w-full"
        >
          {!isAdminRoute && <Navbar />}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          {!isAdminRoute && <Footer />}
          {!isAdminRoute && <AIChatbot />}
        </motion.div>
      )}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppLayout />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
