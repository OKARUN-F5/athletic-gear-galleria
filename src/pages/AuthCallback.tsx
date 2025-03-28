
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const AuthCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          setError(sessionError.message);
          console.error('Error getting auth session:', sessionError);
          return;
        }
        
        if (session) {
          // Check if this is the first user
          const { count, error: countError } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });
            
          if (countError) {
            console.error('Error checking users:', countError);
          } else if (count === 0) {
            // Make the first user an admin
            const { error: updateError } = await supabase
              .from('users')
              .update({ is_admin: true })
              .eq('id', session.user.id);
              
            if (updateError) {
              console.error('Error making user admin:', updateError);
            } else {
              toast({
                title: "Admin access granted",
                description: "You have been assigned admin privileges",
              });
            }
          }
        }
        
        // Redirect back to the home page or a specific page after authentication
        setProcessing(false);
        navigate('/');
      } catch (err) {
        console.error('Error in auth callback:', err);
        setError('An unexpected error occurred during authentication');
        setProcessing(false);
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 p-4 rounded-md mb-4">
          <h3 className="text-lg font-medium text-red-800">Authentication Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
        <button 
          onClick={() => navigate('/sign-in')}
          className="text-blue-600 hover:underline"
        >
          Go back to sign in
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
      <h2 className="text-xl font-medium mb-2">Completing authentication...</h2>
      <p className="text-gray-500">{processing ? "Processing your login..." : "You'll be redirected shortly"}</p>
    </div>
  );
};

export default AuthCallback;
