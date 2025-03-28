
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Loader2, ShieldAlert } from "lucide-react";
import { checkAdminStatus } from "@/utils/adminUtils";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsAuthenticated(false);
          setIsAdmin(false);
          setLoading(false);
          return;
        }
        
        setIsAuthenticated(true);
        
        // Check if user is admin
        const adminStatus = await checkAdminStatus(session.user.id);
        setIsAdmin(adminStatus);
        
        setLoading(false);
        
        if (!adminStatus) {
          console.log('User is not an admin, redirecting...');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAuthenticated(false);
        setIsAdmin(false);
        setLoading(false);
      }
    };

    checkAuth();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setIsAdmin(false);
      } else if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
        const adminStatus = await checkAdminStatus(session.user.id);
        setIsAdmin(adminStatus);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
        <p className="text-gray-600 mb-6">You need to sign in to access the admin area.</p>
        <Button onClick={() => navigate('/sign-in')}>Sign In</Button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">You don't have permission to access the admin area.</p>
        <Button onClick={() => navigate('/')}>Return to Home</Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 pt-16">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
        {children}
      </main>
    </div>
  );
};
