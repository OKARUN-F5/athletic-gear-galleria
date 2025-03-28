
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, MinusCircle, Trash2 } from "lucide-react";

interface InventoryItem {
  size: string;
  color: string;
  quantity: number;
}

interface InventoryManagerProps {
  inventory: InventoryItem[];
  onChange: (inventory: InventoryItem[]) => void;
  selectedSizes: string[];
  selectedColors: string[];
}

export function InventoryManager({ 
  inventory = [], 
  onChange,
  selectedSizes,
  selectedColors 
}: InventoryManagerProps) {
  
  const handleAddVariant = () => {
    // Default to first size and color if available
    const newItem: InventoryItem = {
      size: selectedSizes[0] || "",
      color: selectedColors[0] || "",
      quantity: 0
    };
    onChange([...inventory, newItem]);
  };

  const handleRemoveVariant = (index: number) => {
    const newInventory = [...inventory];
    newInventory.splice(index, 1);
    onChange(newInventory);
  };

  const handleInventoryChange = (index: number, field: keyof InventoryItem, value: string | number) => {
    const newInventory = [...inventory];
    newInventory[index] = {
      ...newInventory[index],
      [field]: field === 'quantity' ? (parseInt(value as string) || 0) : value
    };
    onChange(newInventory);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">Inventory Variants</h4>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={handleAddVariant}
          disabled={!selectedSizes.length || !selectedColors.length}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Variant
        </Button>
      </div>
      
      {inventory.length > 0 ? (
        <div className="space-y-3">
          {inventory.map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
              <div className="w-1/3">
                <Label htmlFor={`variant-size-${index}`} className="text-xs">Size</Label>
                <select
                  id={`variant-size-${index}`}
                  value={item.size}
                  onChange={(e) => handleInventoryChange(index, 'size', e.target.value)}
                  className="w-full mt-1 text-sm rounded-md border border-input bg-background px-3 py-1"
                >
                  {selectedSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              
              <div className="w-1/3">
                <Label htmlFor={`variant-color-${index}`} className="text-xs">Color</Label>
                <select
                  id={`variant-color-${index}`}
                  value={item.color}
                  onChange={(e) => handleInventoryChange(index, 'color', e.target.value)}
                  className="w-full mt-1 text-sm rounded-md border border-input bg-background px-3 py-1"
                >
                  {selectedColors.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end gap-2 w-1/3">
                <div className="flex-1">
                  <Label htmlFor={`variant-qty-${index}`} className="text-xs">Quantity</Label>
                  <div className="flex mt-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 rounded-r-none"
                      onClick={() => {
                        const newQty = Math.max(0, item.quantity - 1);
                        handleInventoryChange(index, 'quantity', newQty);
                      }}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    <Input
                      id={`variant-qty-${index}`}
                      type="number"
                      min="0"
                      value={item.quantity}
                      onChange={(e) => handleInventoryChange(index, 'quantity', e.target.value)}
                      className="h-8 rounded-none text-center border-x-0"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 rounded-l-none"
                      onClick={() => {
                        const newQty = item.quantity + 1;
                        handleInventoryChange(index, 'quantity', newQty);
                      }}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 mt-1"
                  onClick={() => handleRemoveVariant(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-sm text-muted-foreground border border-dashed rounded-md">
          No variants added yet. Add sizes and colors, then create inventory variants.
        </div>
      )}
    </div>
  );
}
