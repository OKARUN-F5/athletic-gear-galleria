
import { supabase } from '@/integrations/supabase/client';

export const checkAdminStatus = async (userId: string): Promise<boolean> => {
  try {
    // First get the user's role
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();
      
    if (userError) {
      console.error('Error checking user role:', userError);
      return false;
    }
    
    // Then check if the role is 'admin'
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('name')
      .eq('id', userData.role)
      .single();
      
    if (roleError) {
      console.error('Error checking role name:', roleError);
      return false;
    }
    
    return roleData.name === 'admin';
  } catch (error) {
    console.error('Exception checking admin status:', error);
    return false;
  }
};

export const grantAdminPrivileges = async (userId: string): Promise<boolean> => {
  try {
    // Get the admin role ID
    const { data: adminRole, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'admin')
      .single();
      
    if (roleError) {
      console.error('Error finding admin role:', roleError);
      return false;
    }
    
    // Update the user's role to admin
    const { error } = await supabase
      .from('users')
      .update({ role: adminRole.id })
      .eq('id', userId);
      
    if (error) {
      console.error('Error granting admin privileges:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception granting admin privileges:', error);
    return false;
  }
};

export const revokeAdminPrivileges = async (userId: string): Promise<boolean> => {
  try {
    // Get the user role ID
    const { data: userRole, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'user')
      .single();
      
    if (roleError) {
      console.error('Error finding user role:', roleError);
      return false;
    }
    
    // Update the user's role to regular user
    const { error } = await supabase
      .from('users')
      .update({ role: userRole.id })
      .eq('id', userId);
      
    if (error) {
      console.error('Error revoking admin privileges:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception revoking admin privileges:', error);
    return false;
  }
};

export const listAdminUsers = async (): Promise<Array<{id: string, full_name: string, email: string}>> => {
  try {
    // First get the admin role ID
    const { data: adminRole, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'admin')
      .single();
      
    if (roleError) {
      console.error('Error finding admin role:', roleError);
      return [];
    }
    
    // Get all users with the admin role
    const { data: adminUsers, error } = await supabase
      .from('users')
      .select('id, full_name, email')
      .eq('role', adminRole.id);
      
    if (error) {
      console.error('Error fetching admin users:', error);
      return [];
    }
    
    return adminUsers || [];
  } catch (error) {
    console.error('Exception listing admin users:', error);
    return [];
  }
};
