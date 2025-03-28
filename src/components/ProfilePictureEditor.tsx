
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export const ProfilePictureEditor = ({ currentImage }: { currentImage: string }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSave = () => {
    toast({
      title: "Profile picture updated",
      description: "Your profile picture has been updated successfully.",
    });
    // Add logic to save the image
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary" className="absolute -bottom-2 -right-2">
          <Camera className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
          <DialogDescription>
            Choose a new profile picture to upload. The image should be square and at least 200x200 pixels.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-center">
            <img
              src={previewUrl || currentImage}
              alt="Profile Preview"
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setPreviewUrl(null)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
