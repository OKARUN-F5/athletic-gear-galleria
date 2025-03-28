// First, import the Category type we defined
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Trash2, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import ImageUploader from '@/components/admin/ImageUploader';

// Define the extended Category type that includes images
interface CategoryWithImages extends Category {
  images: string[];
}

// Define form validation schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }),
  description: z.string().optional(),
});

const AdminCategoryImages = () => {
  // Use the CategoryWithImages type for state
  const [categories, setCategories] = useState<CategoryWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();

  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: ''
    },
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');
        
        if (error) {
          throw error;
        }
        
        // Convert database results to CategoryWithImages[]
        const categoriesWithImages: CategoryWithImages[] = data.map(category => ({
          ...category,
          images: [] // Default empty images array
        }));
        
        setCategories(categoriesWithImages);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: 'Error',
          description: 'Failed to load categories',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, [toast]);

  // Create category
  const createCategory = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([values])
        .select();
      
      if (error) {
        throw error;
      }
      
      // Add the new category to the state with an empty images array
      const newCategory: CategoryWithImages = {
        id: data[0].id,
        name: values.name,
        description: values.description || null,
        created_at: new Date().toISOString(),
        images: []
      };
      
      setCategories([...categories, newCategory]);
      
      toast({
        title: 'Success',
        description: 'Category created successfully',
      });
      
      form.reset();
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: 'Error',
        description: 'Failed to create category',
        variant: 'destructive'
      });
    }
  };

  // Delete category
  const deleteCategory = async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);
      
      if (error) {
        throw error;
      }
      
      // Remove the deleted category from the state
      setCategories(categories.filter(category => category.id !== categoryId));
      
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete category',
        variant: 'destructive'
      });
    }
  };

  // Update images for a category
  const updateImages = async (categoryId: string, images: string[]) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ images: images })
        .eq('id', categoryId);
      
      if (error) {
        throw error;
      }
      
      // Update the category in the state with the new images
      setCategories(categories.map(category =>
        category.id === categoryId ? { ...category, images: images } : category
      ));
      
      toast({
        title: 'Success',
        description: 'Images updated successfully',
      });
    } catch (error) {
      console.error('Error updating images:', error);
      toast({
        title: 'Error',
        description: 'Failed to update images',
        variant: 'destructive'
      });
    }
  };

  // Handle image uploads
  const handleImageUpload = (images: string[]) => {
    setUploadedImages(images);
  };

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    
    // Find the selected category and set the uploaded images
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      setUploadedImages(category.images || []);
    } else {
      setUploadedImages([]);
    }
  };

  // Handle image save
  const handleImageSave = async () => {
    if (selectedCategory) {
      await updateImages(selectedCategory, uploadedImages);
    } else {
      toast({
        title: 'Warning',
        description: 'Please select a category first',
        variant: 'warning'
      });
    }
  };

  return (
    <div className="container max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin: Category Images</h1>

      <Tabs defaultValue="manage" className="space-y-4">
        <TabsList>
          <TabsTrigger value="manage">Manage Categories</TabsTrigger>
          <TabsTrigger value="upload">Upload Images</TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Category</CardTitle>
              <CardDescription>Add a new category to the store</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(createCategory)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Category Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Category Description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Create Category</Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Separator />

          <Card>
            <CardHeader>
              <CardTitle>Existing Categories</CardTitle>
              <CardDescription>Manage existing categories</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading categories...
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <div key={category.id} className="border rounded-md p-4">
                      <h3 className="text-lg font-semibold">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.description || 'No description'}</p>
                      <div className="flex justify-end mt-4">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteCategory(category.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Image Upload</CardTitle>
              <CardDescription>Upload images for categories</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-md font-semibold mb-2">Select Category</h3>
                  <select
                    className="w-full p-2 border rounded-md"
                    onChange={(e) => handleCategorySelect(e.target.value)}
                    value={selectedCategory || ''}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <h3 className="text-md font-semibold mb-2">Uploaded Images</h3>
                  <div className="border rounded-md p-4">
                    {uploadedImages.length === 0 ? (
                      <p className="text-sm text-gray-500">No images uploaded yet</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {uploadedImages.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image}
                              alt={`Uploaded Image ${index}`}
                              className="w-24 h-24 object-cover rounded-md"
                            />
                            <button
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                              onClick={() => {
                                const newImages = [...uploadedImages];
                                newImages.splice(index, 1);
                                setUploadedImages(newImages);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <ImageUploader onUpload={handleImageUpload} />
            </CardContent>
            <CardFooter>
              <Button onClick={handleImageSave}>Save Images</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminCategoryImages;
