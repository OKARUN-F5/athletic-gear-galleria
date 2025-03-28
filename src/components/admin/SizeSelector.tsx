
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface SizeSelectorProps {
  selectedSizes: string[];
  onChange: (sizes: string[]) => void;
}

const availableSizes = [
  "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL",
  "6", "7", "8", "9", "10", "11", "12"
];

export function SizeSelector({ selectedSizes = [], onChange }: SizeSelectorProps) {
  const handleSizeToggle = (size: string) => {
    if (selectedSizes.includes(size)) {
      onChange(selectedSizes.filter(s => s !== size));
    } else {
      onChange([...selectedSizes, size]);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      {availableSizes.map((size) => (
        <div key={size} className="flex items-center space-x-2">
          <Checkbox 
            id={`size-${size}`} 
            checked={selectedSizes.includes(size)}
            onCheckedChange={() => handleSizeToggle(size)}
          />
          <Label htmlFor={`size-${size}`} className="text-sm font-normal">
            {size}
          </Label>
        </div>
      ))}
    </div>
  );
}
