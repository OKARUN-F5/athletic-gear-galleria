
import { supabase } from '@/integrations/supabase/client';

export const checkAdminStatus = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    return !!data?.is_admin;
  } catch (error) {
    console.error('Exception checking admin status:', error);
    return false;
  }
};

export const grantAdminPrivileges = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ is_admin: true })
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
    const { error } = await supabase
      .from('users')
      .update({ is_admin: false })
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
    // First get admin users from our users table
    const { data: adminUsers, error } = await supabase
      .from('users')
      .select('id, full_name')
      .eq('is_admin', true);
      
    if (error) {
      console.error('Error fetching admin users:', error);
      return [];
    }
    
    // For each admin user, get their email from auth.users
    // Note: This would typically be done with a join in a database, but Supabase doesn't allow
    // direct access to auth.users through the client, so we do it in multiple steps
    const adminsWithEmail = await Promise.all(
      adminUsers.map(async (user) => {
        // Note: This is a workaround - in production you'd typically use an edge function with service role
        const { data } = await supabase.auth.admin.getUserById(user.id);
        return {
          id: user.id,
          full_name: user.full_name || 'Unknown',
          email: data?.user?.email || 'No email'
        };
      })
    );
    
    return adminsWithEmail;
  } catch (error) {
    console.error('Exception listing admin users:', error);
    return [];
  }
};
