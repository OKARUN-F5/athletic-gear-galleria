
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useDefaultAdmin = () => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  
  // Create a default admin user if none exists
  const createDefaultAdminUser = async () => {
    try {
      if (isCreating) return; // Prevent multiple concurrent attempts
      setIsCreating(true);
      
      console.log('Checking if default admin exists...');
      
      // Check if any admin users exist in the database
      const { data: adminUsers, error: adminCheckError } = await supabase
        .from('users')
        .select('id')
        .eq('is_admin', true)
        .limit(1);
        
      if (adminCheckError) {
        console.error('Error checking for existing admins:', adminCheckError);
        setIsCreating(false);
        return;
      }
      
      // If we already have admin users, no need to create a default one
      if (adminUsers && adminUsers.length > 0) {
        console.log('Admin users already exist, skipping default admin creation');
        setIsCreating(false);
        return;
      }
      
      // Try to sign in with default admin credentials to check if it exists
      console.log('No admin users found, checking if default admin auth exists...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@example.com',
        password: 'Admin123!@#'
      });
      
      if (!error && data.user) {
        console.log('Default admin auth exists, checking if profile has admin role...');
        
        // Ensure the default admin has the admin role in users table
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('is_admin')
          .eq('id', data.user.id)
          .single();
          
        if (profileError || !profile) {
          console.log('Creating admin profile for existing admin auth...');
          
          // Create admin profile if it doesn't exist
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              full_name: 'Admin User',
              is_admin: true
            });
            
          if (insertError) {
            console.error('Error creating admin profile:', insertError);
          } else {
            console.log('Admin profile created successfully');
            toast({
              title: "Admin role granted",
              description: "The default admin user now has admin privileges",
            });
          }
        } else if (!profile.is_admin) {
          // Update existing profile to have admin role
          const { error: updateError } = await supabase
            .from('users')
            .update({ is_admin: true })
            .eq('id', data.user.id);
            
          if (updateError) {
            console.error('Error updating admin status:', updateError);
          } else {
            console.log('Updated user to admin role');
            toast({
              title: "Admin role granted",
              description: "The default admin user now has admin privileges",
            });
          }
        }
        
        // Sign out if we just signed in to check
        await supabase.auth.signOut();
        setIsCreating(false);
        return;
      }
      
      // No admin exists, create one
      console.log('Creating default admin user...');
      const email = 'admin@example.com';
      // Using a stronger password that meets Supabase requirements
      const password = 'Admin123!@#';
      
      // Create the user in auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: 'Admin User',
            is_admin: true
          }
        }
      });
      
      if (authError) {
        console.error('Error creating default admin auth:', authError);
        setIsCreating(false);
        return;
      }
      
      console.log('Default admin auth created successfully');
      
      // Create the user profile with admin rights
      if (authData.user) {
        const { error: profileError } = await supabase.from('users').insert({
          id: authData.user.id,
          full_name: 'Admin User',
          is_admin: true,
        });
        
        if (profileError) {
          console.error('Error creating default admin profile:', profileError);
          setIsCreating(false);
          return;
        }
        
        console.log('Default admin profile created successfully');
        
        toast({
          title: "Default admin created",
          description: "Email: admin@example.com, Password: Admin123!@#",
        });
      }
    } catch (error) {
      console.error('Error in creating default admin:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return { createDefaultAdminUser, isCreating };
};
