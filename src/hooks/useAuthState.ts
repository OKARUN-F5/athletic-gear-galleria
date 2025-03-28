
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
        // Check if user is admin by getting their role
        const { data: userProfile, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('Error fetching user profile:', error);
        } else if (userProfile) {
          // Get the role name
          const { data: roleData, error: roleError } = await supabase
            .from('roles')
            .select('name')
            .eq('id', userProfile.role)
            .single();
            
          if (roleError) {
            console.error('Error fetching role:', roleError);
          } else {
            setIsAdmin(roleData?.name === 'admin');
            console.log('User role:', roleData?.name);
          }
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
        // Check if the user exists in our users table
        const { data: existingUser, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();
          
        if (error) {
          console.error('Error checking existing user:', error);
          
          // Get the default user role id
          const { data: userRole, error: roleError } = await supabase
            .from('roles')
            .select('id')
            .eq('name', 'user')
            .single();
            
          if (roleError) {
            console.error('Error getting user role:', roleError);
            return;
          }
          
          // Create user profile if it doesn't exist
          const { error: insertError } = await supabase.from('users').insert({
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata.full_name || '',
            role: userRole.id
          });
          
          if (insertError) {
            console.error('Error creating user profile:', insertError);
          }
        } else if (existingUser) {
          // Get the role name
          const { data: roleData, error: roleError } = await supabase
            .from('roles')
            .select('name')
            .eq('id', existingUser.role)
            .single();
            
          if (roleError) {
            console.error('Error fetching role:', roleError);
          } else {
            setIsAdmin(roleData?.name === 'admin');
            console.log('User signed in with role:', roleData?.name);
          }
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, session, loading, isAdmin };
};
