import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, ImagePlus, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ImageUploader } from "@/components/admin/ImageUploader";

interface Category {
  id: string;
  name: string;
  description: string;
  images: string[];
}

const AdminCategoryImages = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    images: [],
  });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("categories").select("*");
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCategory = async () => {
    try {
      setSubmitting(true);
      const { data, error } = await supabase
        .from("categories")
        .insert([newCategory])
        .select();
      if (error) throw error;
      toast({
        title: "Success",
        description: "Category added successfully",
      });
      setCategories([...categories, ...data]);
      setNewCategory({
        name: "",
        description: "",
        images: [],
      });
      setOpen(false);
    } catch (error) {
      console.error("Error adding category:", error);
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
  };

  const handleUpdateCategory = async () => {
    try {
      setSubmitting(true);
      if (!editingCategory) return;
      const { error } = await supabase
        .from("categories")
        .update(editingCategory)
        .eq("id", editingCategory.id);
      if (error) throw error;
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
      setCategories(
        categories.map((category) =>
          category.id === editingCategory.id ? editingCategory : category
        )
      );
      setEditingCategory(null);
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setSubmitting(true);
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
      setCategories(categories.filter((category) => category.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout title="Category Images">
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
              <DialogDescription>
                Add a new category to the store.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={newCategory.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newCategory.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right">Images</Label>
                <div className="col-span-3">
                  <ImageUploader
                    images={newCategory.images}
                    onChange={(images) =>
                      setNewCategory((prev) => ({ ...prev, images }))
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleAddCategory} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Add Category"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell className="text-right">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Name
                            </Label>
                            <Input
                              type="text"
                              id="name"
                              defaultValue={category.name}
                              onChange={(e) =>
                                setEditingCategory((prev) => ({
                                  ...prev!,
                                  name: e.target.value,
                                }))
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                              Description
                            </Label>
                            <Textarea
                              id="description"
                              defaultValue={category.description}
                              onChange={(e) =>
                                setEditingCategory((prev) => ({
                                  ...prev!,
                                  description: e.target.value,
                                }))
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-start gap-4">
                            <Label className="text-right">Images</Label>
                            <div className="col-span-3">
                              <ImageUploader
                                images={editingCategory?.images || []}
                                onChange={(images) =>
                                  setEditingCategory((prev) => ({
                                    ...prev!,
                                    images: images,
                                  }))
                                }
                              />
                            </div>
                          </div>
                          <Button
                            type="button"
                            onClick={handleUpdateCategory}
                            disabled={submitting}
                          >
                            {submitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                              </>
                            ) : (
                              "Update Category"
                            )}
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        </>
                      ) : (
                        <Trash2 className="h-4 w-4 mr-2" />
                      )}
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCategoryImages;
