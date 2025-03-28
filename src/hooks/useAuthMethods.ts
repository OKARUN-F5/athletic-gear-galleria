
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useAuthMethods = () => {
  const { toast } = useToast();

  const signIn = async (provider: 'google') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error signing in:', error);
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in with:', email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Sign in error:', error);
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error: error.message };
      }
      
      console.log('Sign in successful:', data);
      toast({
        title: "Signed in successfully",
        description: "Welcome back!",
      });
      return { success: true };
    } catch (error) {
      console.error('Error signing in:', error);
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    try {
      const { error: authError, data } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      
      if (authError) {
        toast({
          title: "Sign up failed",
          description: authError.message,
          variant: "destructive",
        });
        return { success: false, error: authError.message };
      }
      
      // Get the user role
      const { data: userRole, error: roleError } = await supabase
        .from('roles')
        .select('id')
        .eq('name', 'user')
        .single();
        
      if (roleError) {
        console.error('Error getting user role:', roleError);
        toast({
          title: "Sign up failed",
          description: "Could not assign user role",
          variant: "destructive",
        });
        return { success: false, error: "Could not assign user role" };
      }
      
      // Create user in our database
      if (data.user) {
        const { error: userError } = await supabase.from('users').insert({
          id: data.user.id,
          email: email,
          full_name: fullName,
          role: userRole.id
        });
        
        if (userError) {
          console.error('Error creating user profile:', userError);
          toast({
            title: "Sign up failed",
            description: "User account created but failed to create profile",
            variant: "destructive",
          });
          return { success: false, error: "Failed to create user profile" };
        }
      }
      
      toast({
        title: "Signed up successfully",
        description: "Please check your email to confirm your account",
      });
      return { success: true };
    } catch (error) {
      console.error('Error signing up:', error);
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Sign out failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return {
    signIn,
    signInWithEmail,
    signUpWithEmail,
    signOut
  };
};
