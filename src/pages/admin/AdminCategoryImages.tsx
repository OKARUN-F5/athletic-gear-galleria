
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Plus, Trash2, Upload, Edit } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const BUCKET_NAME = 'category-images';

const AdminCategoryImages = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });
  const { toast } = useToast();

  const fetchCategoryImages = async () => {
    try {
      setLoading(true);
      
      // Get images from storage bucket
      const { data: storageData, error: storageError } = await supabase
        .storage
        .from(BUCKET_NAME)
        .list();

      if (storageError) throw storageError;

      // Get metadata from categories table
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*');

      if (categoriesError) {
        // If table doesn't exist yet, just use storage data
        const imageUrls = storageData.map(file => ({
          id: file.id,
          name: file.name,
          url: `${supabase.storage.from(BUCKET_NAME).getPublicUrl(file.name).data.publicUrl}`,
          title: file.name.split('.')[0].replace(/-/g, ' '),
          description: ''
        }));
        setImages(imageUrls);
      } else {
        // Merge data from storage and categories table
        const imageUrls = storageData.map(file => {
          const matchingCategory = categoriesData.find(c => c.name === file.name.split('.')[0].replace(/-/g, ' '));
          return {
            id: file.id,
            name: file.name,
            url: `${supabase.storage.from(BUCKET_NAME).getPublicUrl(file.name).data.publicUrl}`,
            title: matchingCategory?.name || file.name.split('.')[0].replace(/-/g, ' '),
            description: matchingCategory?.description || '',
            category_id: matchingCategory?.id
          };
        });
        setImages(imageUrls);
      }
    } catch (error) {
      console.error("Error fetching category images:", error);
      toast({
        title: "Error",
        description: "Failed to fetch category images",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryImages();
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
      const fileName = `category-${Date.now()}.${fileExt}`;
      
      const { error } = await supabase
        .storage
        .from(BUCKET_NAME)
        .upload(fileName, file);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
      
      // Open dialog to add metadata
      setCurrentImage({
        name: fileName,
        url: `${supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName).data.publicUrl}`
      });
      
      setFormData({
        name: fileName.split('.')[0].replace(/-/g, ' '),
        description: ''
      });
      
      setDialogOpen(true);
      fetchCategoryImages();
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

  const handleDeleteImage = async (name, categoryId) => {
    if (confirm("Are you sure you want to delete this image?")) {
      try {
        // If we have metadata in the categories table, delete it first
        if (categoryId) {
          const { error: metadataError } = await supabase
            .from('categories')
            .delete()
            .eq('id', categoryId);
            
          if (metadataError) throw metadataError;
        }
        
        // Then delete the image from storage
        const { error } = await supabase
          .storage
          .from(BUCKET_NAME)
          .remove([name]);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Image deleted successfully",
        });
        
        fetchCategoryImages();
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

  const handleEditImage = (image) => {
    setCurrentImage(image);
    setFormData({
      name: image.title || '',
      description: image.description || ''
    });
    setDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitMetadata = async (e) => {
    e.preventDefault();
    
    try {
      // Check if we have a categories table
      const { error: checkError } = await supabase
        .from('categories')
        .select('id')
        .limit(1);
      
      if (checkError) {
        // Categories table doesn't exist yet, create it
        await supabase.rpc('create_categories_table_if_not_exists');
      }
      
      if (currentImage.category_id) {
        // Update existing record
        const { error } = await supabase
          .from('categories')
          .update({
            name: formData.name,
            description: formData.description
          })
          .eq('id', currentImage.category_id);
          
        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('categories')
          .insert({
            name: formData.name,
            description: formData.description
          });
          
        if (error) throw error;
      }
      
      toast({
        title: "Success",
        description: "Category metadata saved successfully",
      });
      
      setDialogOpen(false);
      fetchCategoryImages();
    } catch (error) {
      console.error("Error saving metadata:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save metadata",
        variant: "destructive"
      });
    }
  };

  return (
    <AdminLayout title="Category Images">
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          Manage the category images that appear on the homepage. Images should be high-quality and have a similar aspect ratio for best results.
        </p>
        
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 transition">
            <Upload className="h-5 w-5" />
            <span>Upload Category Image</span>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle>{image.title || "Untitled Category"}</CardTitle>
                {image.description && (
                  <CardDescription>{image.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative aspect-[4/3] group">
                  <img
                    src={image.url}
                    alt={image.title || "Category image"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mr-2"
                      onClick={() => handleEditImage(image)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteImage(image.name, image.category_id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-4">
                <p className="text-sm text-gray-500 truncate">
                  {image.description || "No description provided"}
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">No category images uploaded yet</p>
          <label className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md cursor-pointer hover:bg-primary/90 transition">
            <Plus className="h-5 w-5" />
            <span>Upload Your First Category Image</span>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentImage?.category_id ? "Edit Category Details" : "Add Category Details"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmitMetadata}>
            <div className="grid gap-4 py-4">
              <div className="mb-4">
                <img 
                  src={currentImage?.url} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCategoryImages;
