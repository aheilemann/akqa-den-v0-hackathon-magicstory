"use client";

import { useState, useRef } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PencilIcon, UploadIcon } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

type ProfileEditorProps = {
  user: User;
  displayName: string;
  avatarUrl?: string;
  onProfileUpdate: () => void;
};

export function ProfileEditor({
  user,
  displayName: initialDisplayName,
  avatarUrl: initialAvatarUrl,
  onProfileUpdate,
}: ProfileEditorProps) {
  const [displayName, setDisplayName] = useState(initialDisplayName || "");
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      setIsUploading(true);
      const file = files[0];
      const fileExt = file.name.split(".").pop();

      // Simplify the path structure - just use the user ID as the filename
      const filePath = `${user.id}.${fileExt}`;

      // Upload the file to the "avatars" bucket in Supabase storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          upsert: true, // This will overwrite if the file already exists
        });

      if (uploadError) throw uploadError;

      // Get the public URL from the "avatars" bucket
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      if (data) {
        const publicUrl = data.publicUrl;
        setAvatarUrl(publicUrl);

        // Update the user's profile_img in their metadata immediately
        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            profile_img: publicUrl,
            updated_at: new Date().toISOString(),
          },
        });

        if (updateError) throw updateError;

        toast.success("Avatar updated", {
          description:
            "Your new profile picture has been uploaded successfully.",
          duration: 4000,
        });

        // Refresh the profile to show the new avatar everywhere
        onProfileUpdate();
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Upload failed", {
        description:
          "There was a problem uploading your profile picture. Please try again.",
        duration: 5000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setIsUpdating(true);

      // Update user data using the auth.updateUser method
      const { error: displayNameError } = await supabase.auth.updateUser({
        data: {
          display_name: displayName,
          updated_at: new Date().toISOString(),
        },
      });

      if (displayNameError) throw displayNameError;

      toast.success(`Hello, ${displayName || "there"}!`, {
        description: "Your profile has been updated successfully.",
        duration: 4000,
      });

      onProfileUpdate();
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Update failed", {
        description:
          "There was a problem updating your profile. Please try again.",
        duration: 5000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <PencilIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-6 md:p-8">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 pt-4">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-28 w-28 md:h-24 md:w-24">
                <AvatarImage
                  src={avatarUrl}
                  alt={displayName}
                  className="object-cover object-center"
                />
                <AvatarFallback>
                  {displayName?.charAt(0) || user.email?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="secondary"
                size="icon"
                className="absolute bottom-0 right-0 rounded-full h-10 w-10 md:h-8 md:w-8"
                onClick={triggerFileInput}
                disabled={isUploading}
              >
                <UploadIcon className="h-5 w-5 md:h-4 md:w-4" />
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                disabled={isUploading}
              />
            </div>
            {isUploading && (
              <p className="text-sm text-muted-foreground">Uploading...</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="displayName" className="text-sm font-medium">
              Display Name
            </label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name"
            />
          </div>

          <Button onClick={updateProfile} disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
