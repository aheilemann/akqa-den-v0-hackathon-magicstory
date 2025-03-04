"use client";

import { useState, useRef } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { updateProfileDisplayName, uploadProfileAvatar } from "@/app/actions";
import type { ProfileData } from "@/app/actions";

type ProfileEditorProps = {
  profileData: ProfileData;
  onProfileUpdate: () => Promise<void>;
};

export function ProfileEditor({
  profileData,
  onProfileUpdate,
}: ProfileEditorProps) {
  const user = profileData.user;
  const displayName = user.user_metadata?.display_name || "";
  const avatarUrl =
    user.user_metadata?.profile_img || user.user_metadata?.avatar_url;

  const [newDisplayName, setNewDisplayName] = useState(displayName);
  const [newAvatarUrl, setNewAvatarUrl] = useState(avatarUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      setIsUploading(true);
      const file = files[0];

      const result = await uploadProfileAvatar(file);

      if (!result.success) {
        throw new Error("Failed to upload avatar");
      }

      setNewAvatarUrl(result.url);
      toast.success("Avatar updated", {
        description: "Your new profile picture has been uploaded successfully.",
        duration: 4000,
      });

      // Refresh the profile to show the new avatar everywhere
      await onProfileUpdate();
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

      const result = await updateProfileDisplayName(newDisplayName);

      if (!result.success) {
        throw new Error("Failed to update profile");
      }

      toast.success(`Hello, ${newDisplayName || "there"}!`, {
        description: "Your profile has been updated successfully.",
        duration: 4000,
      });

      await onProfileUpdate();
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
                  src={newAvatarUrl}
                  alt={newDisplayName}
                  className="object-cover object-center"
                />
                <AvatarFallback>
                  {newDisplayName?.charAt(0) || user.email?.charAt(0)}
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
              value={newDisplayName}
              onChange={(e) => setNewDisplayName(e.target.value)}
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
