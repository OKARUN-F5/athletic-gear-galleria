
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useDefaultAdmin } from './useDefaultAdmin';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { createDefaultAdminUser } = useDefaultAdmin();

  useEffect(() => {
    const getSession = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Check if user is admin
        const { data: userProfile, error } = await supabase
          .from('users')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('Error fetching user profile:', error);
        } else {
          setIsAdmin(!!userProfile?.is_admin);
          console.log('User admin status:', !!userProfile?.is_admin);
        }
      }
      
      // Create default admin if needed
      await createDefaultAdminUser();
      
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`Auth state changed: ${event}`);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (event === 'SIGNED_IN' && session) {
        const { data: existingUser, error } = await supabase
          .from('users')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
          
        if (error) {
          console.error('Error checking existing user:', error);
          
          // Create user profile if it doesn't exist
          const { error: insertError } = await supabase.from('users').insert({
            id: session.user.id,
            full_name: session.user.user_metadata.full_name || '',
            is_admin: false,
          });
          
          if (insertError) {
            console.error('Error creating user profile:', insertError);
          }
        } else if (existingUser) {
          setIsAdmin(!!existingUser.is_admin);
          console.log('User signed in with admin status:', !!existingUser.is_admin);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, session, loading, isAdmin };
};
