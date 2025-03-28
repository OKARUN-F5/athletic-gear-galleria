
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, X, Image as ImageIcon, UploadCloud } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    
    try {
      const newImages = [...images];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Read the file as a data URL first (for preview)
        const reader = new FileReader();
        const dataUrl = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        
        newImages.push(dataUrl);
      }
      
      onChange(newImages);
      
      toast({
        title: "Images added",
        description: `${files.length} image(s) added to product`
      });
    } catch (error) {
      console.error("Error uploading images:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your images",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {images.map((image, index) => (
          <div key={index} className="relative group rounded-md overflow-hidden border border-gray-200 w-24 h-24">
            <img
              src={image}
              alt={`Product image ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        
        <div className="flex items-center justify-center border border-dashed rounded-md border-gray-300 w-24 h-24">
          <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            ) : (
              <>
                <UploadCloud className="h-6 w-6 text-gray-400" />
                <span className="mt-1 text-xs text-gray-500">Upload</span>
              </>
            )}
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </div>
      <div className="text-xs text-gray-500">
        Drag and drop images or click to upload. JPG, PNG or GIF up to 5MB.
      </div>
    </div>
  );
}
