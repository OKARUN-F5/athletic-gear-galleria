import { useState, useEffect } from 'react';
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
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, ImagePlus, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ColorPicker } from "@/components/admin/ColorPicker";
import { SizeSelector } from "@/components/admin/SizeSelector";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { InventoryManager } from "@/components/admin/InventoryManager";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  cat_id: string;
  brand: string;
  bestseller: boolean;
  color: string | null;
  images: string[];
}

interface InventoryItem {
  size: string;
  color: string;
  quantity: number;
}

interface NewProduct extends Omit<Product, 'id'> {
  sizes: string[];
  inventory: InventoryItem[];
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: "",
    description: "",
    price: "0",
    cat_id: "",
    brand: "",
    bestseller: false,
    color: "",
    images: [],
    sizes: [],
    inventory: []
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('name');
        
        if (error) {
          throw error;
        }
        
        const productsWithDefaults = data.map(product => ({
          ...product,
          brand: "",
          bestseller: false,
          color: ""
        }));
        
        setProducts(productsWithDefaults);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: 'Error',
          description: 'Failed to load products',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [toast]);

  const fetchCategories = async () => {
    try {
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
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddProduct = async () => {
    try {
      setSubmitting(true);
      
      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        cat_id: newProduct.cat_id,
        brand: newProduct.brand,
        bestseller: newProduct.bestseller,
        color: newProduct.color || null,
        images: newProduct.images
      };
      
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select();
        
      if (error) throw error;
      
      if (data && data[0] && newProduct.inventory.length > 0) {
        const inventoryData = newProduct.inventory.map(item => ({
          product_id: data[0].id,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          last_updated: new Date().toISOString()
        }));
        
        for (const item of inventoryData) {
          const { error: inventoryError } = await supabase
            .from('product_inventory')
            .insert(item);
            
          if (inventoryError) {
            console.error("Error adding inventory:", inventoryError);
          }
        }
      }
      
      toast({
        title: "Success",
        description: "Product added successfully",
      });
      
      const newProducts = data ? data.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description || '',
        price: p.price,
        cat_id: p.cat_id || '',
        brand: p.brand || '',
        bestseller: p.bestseller || false,
        color: p.color || null,
        images: p.images || []
      })) : [];
      
      setProducts([...products, ...newProducts]);
      setNewProduct({
        name: "",
        description: "",
        price: "0",
        cat_id: "",
        brand: "",
        bestseller: false,
        color: "",
        images: [],
        sizes: [],
        inventory: []
      });
      setOpen(false);
      
      fetchProducts();
      
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = async () => {
    try {
      setSubmitting(true);
      
      if (!editingProduct) return;
      
      const productData = {
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price,
        cat_id: editingProduct.cat_id,
        brand: editingProduct.brand,
        bestseller: editingProduct.bestseller,
        color: editingProduct.color,
        images: editingProduct.images
      };
      
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      
      setProducts(
        products.map((product) =>
          product.id === editingProduct.id ? editingProduct : product
        )
      );
      setEditingProduct(null);
      
      fetchProducts();
      
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setSubmitting(true);
      
      const { error: inventoryError } = await supabase
        .from("product_inventory")
        .delete()
        .eq("product_id", id);
      
      if (inventoryError) {
        console.error("Error deleting inventory:", inventoryError);
      }
      
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const updateInventory = async (productId: string, inventoryData: any) => {
    try {
      const { data: existingData, error: fetchError } = await supabase
        .from('product_inventory')
        .select('*')
        .eq('product_id', productId)
        .eq('size', inventoryData.size)
        .eq('color', inventoryData.color);
      
      if (fetchError) {
        throw fetchError;
      }
      
      if (existingData && existingData.length > 0) {
        const { error: updateError } = await supabase
          .from('product_inventory')
          .update({ quantity: inventoryData.quantity })
          .eq('id', existingData[0].id);
        
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('product_inventory')
          .insert({
            product_id: productId,
            size: inventoryData.size,
            color: inventoryData.color,
            quantity: inventoryData.quantity
          });
        
        if (insertError) throw insertError;
      }
      
      const { data: updatedProduct, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
      
      if (productError) throw productError;
      
      const productWithDefaults = {
        ...updatedProduct,
        brand: "",
        bestseller: false,
        color: ""
      };
      
      setProducts(prevProducts => 
        prevProducts.map(p => p.id === productId ? productWithDefaults : p)
      );
      
      return true;
    } catch (error) {
      console.error('Error updating inventory:', error);
      toast({
        title: 'Error',
        description: 'Failed to update inventory',
        variant: 'destructive'
      });
      return false;
    }
  };

  const fetchInventory = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('product_inventory')
        .select('*')
        .eq('product_id', productId);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast({
        title: 'Error',
        description: 'Failed to load inventory data',
        variant: 'destructive'
      });
      return [];
    }
  };

  return (
    <AdminLayout title="Products">
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Add Product</DialogTitle>
              <DialogDescription>
                Add a new product to the store. Fill out all details and inventory information.
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="basic" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="variants">Variants & Colors</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="py-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={newProduct.name}
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
                      value={newProduct.description}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                      Price
                    </Label>
                    <Input
                      type="text"
                      id="price"
                      name="price"
                      value={newProduct.price}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cat_id" className="text-right">
                      Category
                    </Label>
                    <Select
                      value={newProduct.cat_id}
                      onValueChange={(value) =>
                        setNewProduct((prev) => ({ ...prev, cat_id: value }))
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="brand" className="text-right">
                      Brand
                    </Label>
                    <Input
                      type="text"
                      id="brand"
                      name="brand"
                      value={newProduct.brand}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="bestseller" className="text-right">
                      Bestseller
                    </Label>
                    <div className="col-span-3">
                      <Switch
                        id="bestseller"
                        name="bestseller"
                        checked={newProduct.bestseller}
                        onCheckedChange={(checked) =>
                          setNewProduct((prev) => ({ ...prev, bestseller: checked }))
                        }
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right">Images</Label>
                    <div className="col-span-3">
                      <ImageUploader 
                        images={newProduct.images}
                        onChange={(images) => 
                          setNewProduct(prev => ({ ...prev, images }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="variants" className="py-4">
                <div className="grid gap-6">
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="color" className="text-right">
                      Primary Color
                    </Label>
                    <div className="col-span-3">
                      <ColorPicker 
                        value={newProduct.color || ''} 
                        onChange={(color) => 
                          setNewProduct(prev => ({ ...prev, color }))
                        }
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right">
                      Available Sizes
                    </Label>
                    <div className="col-span-3">
                      <SizeSelector 
                        selectedSizes={newProduct.sizes}
                        onChange={(sizes) => 
                          setNewProduct(prev => ({ ...prev, sizes }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="inventory" className="py-4">
                <InventoryManager 
                  inventory={newProduct.inventory}
                  selectedSizes={newProduct.sizes}
                  selectedColors={newProduct.color ? [newProduct.color] : []}
                  onChange={(inventory) => 
                    setNewProduct(prev => ({ ...prev, inventory }))
                  }
                />
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button type="button" onClick={handleAddProduct} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Add Product"
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
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Bestseller</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{product.description}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>
                    {categories.find(c => c.id === product.cat_id)?.name || product.cat_id}
                  </TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>{product.bestseller ? "Yes" : "No"}</TableCell>
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
                              defaultValue={product.name}
                              onChange={(e) =>
                                setEditingProduct((prev) => ({
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
                              defaultValue={product.description}
                              onChange={(e) =>
                                setEditingProduct((prev) => ({
                                  ...prev!,
                                  description: e.target.value,
                                }))
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">
                              Price
                            </Label>
                            <Input
                              type="text"
                              id="price"
                              defaultValue={product.price}
                              onChange={(e) =>
                                setEditingProduct((prev) => ({
                                  ...prev!,
                                  price: e.target.value,
                                }))
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="cat_id" className="text-right">
                              Category
                            </Label>
                            <Select
                              defaultValue={product.cat_id}
                              onValueChange={(value) =>
                                setEditingProduct((prev) => ({
                                  ...prev!,
                                  cat_id: value,
                                }))
                              }
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="brand" className="text-right">
                              Brand
                            </Label>
                            <Input
                              type="text"
                              id="brand"
                              defaultValue={product.brand}
                              onChange={(e) =>
                                setEditingProduct((prev) => ({
                                  ...prev!,
                                  brand: e.target.value,
                                }))
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="bestseller" className="text-right">
                              Bestseller
                            </Label>
                            <Switch
                              id="bestseller"
                              defaultChecked={product.bestseller}
                              onCheckedChange={(checked) =>
                                setEditingProduct((prev) => ({
                                  ...prev!,
                                  bestseller: checked,
                                }))
                              }
                              className="col-span-3"
                            />
                          </div>
                          <Button
                            type="button"
                            onClick={handleUpdateProduct}
                            disabled={submitting}
                          >
                            {submitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                              </>
                            ) : (
                              "Update Product"
                            )}
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
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

export default AdminProducts;
