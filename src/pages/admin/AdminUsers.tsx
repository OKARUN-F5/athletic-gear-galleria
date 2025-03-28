
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Search, UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      let query = supabase.from("users").select("*");
      
      if (searchTerm) {
        query = query.ilike("full_name", `%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      setUsers(data || []);
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

  const toggleAdminStatus = async (userId, currentStatus) => {
    try {
      const { error } = await supabase
        .from("users")
        .update({ is_admin: !currentStatus })
        .eq("id", userId);
        
      if (error) throw error;
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_admin: !currentStatus } : user
      ));
      
      toast({
        title: "Success",
        description: `User is now ${!currentStatus ? 'an admin' : 'a regular user'}`,
      });
    } catch (error) {
      console.error("Error updating user admin status:", error);
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
                <th className="text-left py-3 px-4">Created On</th>
                <th className="text-center py-3 px-4">Admin Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{user.id.substring(0, 8)}...</td>
                  <td className="py-3 px-4">{user.full_name || 'No name'}</td>
                  <td className="py-3 px-4">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <Switch
                        checked={user.is_admin}
                        onCheckedChange={() => toggleAdminStatus(user.id, user.is_admin)}
                      />
                      <span className="ml-2 text-sm">
                        {user.is_admin ? 'Admin' : 'User'}
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
