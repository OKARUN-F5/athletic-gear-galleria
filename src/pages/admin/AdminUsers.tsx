
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Role {
  id: string;
  name: string;
}

interface User {
  id: string;
  full_name: string | null;
  email: string;
  role: string;
  created_at: string | null;
  roleName?: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*');
        
      if (error) throw error;
      setRoles(data || []);
      
      return data;
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast({
        title: "Error",
        description: "Failed to fetch roles",
        variant: "destructive"
      });
      return [];
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch roles first
      const rolesData = await fetchRoles();
      
      let query = supabase.from("users").select("*");
      
      if (searchTerm) {
        query = query.or(`email.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Map role IDs to role names
      const usersWithRoleNames = (data || []).map(user => {
        const userRole = rolesData.find(role => role.id === user.role);
        return {
          ...user,
          roleName: userRole?.name || 'Unknown'
        };
      });
      
      setUsers(usersWithRoleNames);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  const toggleAdminStatus = async (userId: string, currentRoleName: string) => {
    try {
      // Find the admin and user role IDs
      const adminRole = roles.find(role => role.name === 'admin');
      const userRole = roles.find(role => role.name === 'user');
      
      if (!adminRole || !userRole) {
        toast({
          title: "Error",
          description: "Could not find required roles",
          variant: "destructive"
        });
        return;
      }
      
      // Determine the new role
      const newRoleId = currentRoleName === 'admin' ? userRole.id : adminRole.id;
      
      const { error } = await supabase
        .from("users")
        .update({ role: newRoleId })
        .eq("id", userId);
        
      if (error) throw error;
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? 
          { ...user, role: newRoleId, roleName: newRoleId === adminRole.id ? 'admin' : 'user' } : 
          user
      ));
      
      toast({
        title: "Success",
        description: `User is now ${newRoleId === adminRole.id ? 'an admin' : 'a regular user'}`,
      });
    } catch (error) {
      console.error("Error updating user role:", error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive"
      });
    }
  };

  return (
    <AdminLayout title="User Management">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">User ID</th>
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Created On</th>
                <th className="text-center py-3 px-4">Admin Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{user.id.substring(0, 8)}...</td>
                  <td className="py-3 px-4">{user.full_name || 'No name'}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{new Date(user.created_at || '').toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <Switch
                        checked={user.roleName === 'admin'}
                        onCheckedChange={() => toggleAdminStatus(user.id, user.roleName || '')}
                      />
                      <span className="ml-2 text-sm">
                        {user.roleName === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No users found</p>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
