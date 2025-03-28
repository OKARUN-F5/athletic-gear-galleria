
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const AdminHeroImages = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const fetchHeroImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .storage
        .from('hero-images')
        .list();

      if (error) throw error;

      const imageUrls = data.map(file => ({
        id: file.id,
        name: file.name,
        url: `${supabase.storage.from('hero-images').getPublicUrl(file.name).data.publicUrl}`
      }));

      setImages(imageUrls);
    } catch (error) {
      console.error("Error fetching hero images:", error);
      toast({
        title: "Error",
        description: "Failed to fetch hero images",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroImages();
  }, []);

  const handleFileChange = async (e) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      const fileType = file.type;
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(fileType)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPG, PNG, or WebP image",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }

      setUploading(true);
      
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `hero-${Date.now()}.${fileExt}`;
      
      const { error } = await supabase
        .storage
        .from('hero-images')
        .upload(fileName, file);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
      
      fetchHeroImages();
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      // Reset the file input
      e.target.value = '';
    }
  };

  const handleDeleteImage = async (name) => {
    if (confirm("Are you sure you want to delete this image?")) {
      try {
        const { error } = await supabase
          .storage
          .from('hero-images')
          .remove([name]);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Image deleted successfully",
        });
        
        fetchHeroImages();
      } catch (error) {
        console.error("Error deleting image:", error);
        toast({
          title: "Error",
          description: "Failed to delete image",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <AdminLayout title="Hero Slideshow Images">
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          Manage the slideshow images that appear on the homepage. Images should be high-quality and have a 16:9 aspect ratio for best results.
        </p>
        
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 transition">
            <Upload className="h-5 w-5" />
            <span>Upload Image</span>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
          </label>
          
          {uploading && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span>Uploading...</span>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : images.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <img
                src={image.url}
                alt="Hero image"
                className="w-full h-48 object-cover rounded-md"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteImage(image.name)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">No hero images uploaded yet</p>
          <label className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md cursor-pointer hover:bg-primary/90 transition">
            <Plus className="h-5 w-5" />
            <span>Upload Your First Image</span>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminHeroImages;
