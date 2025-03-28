
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const predefinedColors = [
  "#ffffff", "#000000", "#f44336", "#e91e63", "#9c27b0", 
  "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4",
  "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", 
  "#ffc107", "#ff9800", "#ff5722", "#795548", "#9e9e9e",
  "#607d8b"
];

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-start text-left font-normal flex items-center gap-2"
        >
          <div 
            className="h-4 w-4 rounded-full border"
            style={{ backgroundColor: value || "#ffffff" }}
          />
          {value || "Select color"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid grid-cols-7 gap-2">
          {predefinedColors.map((color) => (
            <button
              key={color}
              className={cn(
                "h-6 w-6 rounded-md border border-gray-200",
                value === color && "ring-2 ring-offset-2 ring-black"
              )}
              style={{ backgroundColor: color }}
              onClick={() => {
                onChange(color);
                setOpen(false);
              }}
            />
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2">
          <input
            type="color"
            value={value || "#ffffff"}
            onChange={(e) => onChange(e.target.value)}
            className="h-8 w-8 cursor-pointer"
          />
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#000000"
            className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
