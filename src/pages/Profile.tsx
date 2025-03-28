
import { useState } from 'react';
import { User, Package, Heart, Settings, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageTemplate from './PageTemplate';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { LogoutDialog } from '@/components/LogoutDialog';
import { ProfilePictureEditor } from '@/components/ProfilePictureEditor';

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const { toast } = useToast();
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setEditMode(false);
    toast({
      title: "Profile updated",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <PageTemplate title="My Profile">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[240px,1fr] gap-8">
          {/* Sidebar Navigation */}
          <aside className="space-y-4 md:border-r pr-6">
            <div className="flex flex-col space-y-1">
              <Button variant="ghost" className="justify-start" asChild>
                <Link to="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <Link to="/orders">
                  <Package className="mr-2 h-4 w-4" />
                  Orders
                </Link>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <Link to="/wishlist">
                  <Heart className="mr-2 h-4 w-4" />
                  Wishlist
                </Link>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <Link to="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
              <LogoutDialog />
            </div>
          </aside>

          {/* Main Content */}
          <main className="space-y-6">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList>
                <TabsTrigger value="profile">Profile Details</TabsTrigger>
                <TabsTrigger value="orders">Order History</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop"
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <ProfilePictureEditor currentImage="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">John Doe</h3>
                    <p className="text-gray-600">john.doe@example.com</p>
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                      <Input id="firstName" defaultValue="John" readOnly={!editMode} />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                      <Input id="lastName" defaultValue="Doe" readOnly={!editMode} />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email</label>
                      <Input id="email" type="email" defaultValue="john.doe@example.com" readOnly={!editMode} />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                      <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" readOnly={!editMode} />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    {editMode ? (
                      <>
                        <Button type="button" variant="outline" onClick={() => setEditMode(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Save Changes</Button>
                      </>
                    ) : (
                      <Button type="button" onClick={() => setEditMode(true)}>
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="orders">
                <div className="space-y-4">
                  {[1, 2, 3].map((order) => (
                    <div key={order} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold">Order #{order}234</h4>
                          <p className="text-sm text-gray-600">Placed on March {order}, 2024</p>
                          <div className="mt-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              order === 1 ? 'bg-blue-100 text-blue-800' :
                              order === 2 ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order === 1 ? 'In Transit' :
                               order === 2 ? 'Delivered' :
                               'Processing'}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                      <div className="flex items-center space-x-4">
                        <ShoppingBag className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">3 items</span>
                        <span className="text-sm font-medium">${(79.99 * order).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </PageTemplate>
  );
};

export default Profile;
