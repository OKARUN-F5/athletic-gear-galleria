
import { useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const AdminSettings = () => {
  const [storeName, setStoreName] = useState("Plug Store");
  const [storeEmail, setStoreEmail] = useState("contact@plugstore.com");
  const [storePhone, setStorePhone] = useState("+1 (555) 123-4567");
  const [storeAddress, setStoreAddress] = useState("123 Main St, New York, NY 10001");
  const { toast } = useToast();

  const handleSaveGeneralSettings = (e) => {
    e.preventDefault();
    // In a real app, this would save to a database
    toast({
      title: "Settings Saved",
      description: "Store settings have been updated successfully."
    });
  };

  return (
    <AdminLayout title="Settings">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="api">API & Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-medium mb-4">Store Information</h3>
            <form onSubmit={handleSaveGeneralSettings} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Email Address</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={storeEmail}
                    onChange={(e) => setStoreEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storePhone">Phone Number</Label>
                  <Input
                    id="storePhone"
                    value={storePhone}
                    onChange={(e) => setStorePhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeAddress">Address</Label>
                  <Input
                    id="storeAddress"
                    value={storeAddress}
                    onChange={(e) => setStoreAddress(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </div>
          
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-medium mb-4">Site Appearance</h3>
            <p className="text-gray-500 mb-4">
              Configure the appearance of your storefront.
            </p>
            <div className="flex justify-end">
              <Button variant="outline">Customize Theme</Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
            <p className="text-gray-500 mb-4">
              Configure when and how you receive email notifications.
            </p>
            <div className="flex justify-end">
              <Button>Configure Notifications</Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="api" className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-medium mb-4">API Access</h3>
            <p className="text-gray-500 mb-4">
              Manage API keys and permissions for your store.
            </p>
            <div className="flex justify-end">
              <Button>Generate API Key</Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-medium mb-4">Integrations</h3>
            <p className="text-gray-500 mb-4">
              Connect your store to third-party services and platforms.
            </p>
            <div className="flex justify-end">
              <Button variant="outline">Manage Integrations</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminSettings;
