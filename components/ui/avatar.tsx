"use client";

import Image from "next/image";
import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { User } from "@supabase/supabase-js";

import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

interface UserAvatarProps {
  user: User | null;
  className?: string;
}

export function UserAvatar({ user, className }: UserAvatarProps) {
  const getFallbackInitial = () => {
    if (!user) return "";
    // Check for display_name first
    if (user.user_metadata?.display_name)
      return user.user_metadata.display_name[0].toUpperCase();
    if (user.user_metadata?.full_name)
      return user.user_metadata.full_name[0].toUpperCase();
    if (user.email) return user.email[0].toUpperCase();
    return "";
  };

  // Priority order:
  // 1. Custom uploaded profile_img (new field)
  // 2. avatar_url from metadata (for backward compatibility)
  // 3. picture from OAuth providers
  // 4. Google identity avatar
  let avatarUrl =
    user?.user_metadata?.profile_img ||
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    "";

  // If no avatar from metadata, check for Google identity
  if (!avatarUrl) {
    const googleIdentity = user?.identities?.find(
      (identity) => identity.provider === "google"
    );

    if (googleIdentity?.identity_data?.avatar_url) {
      avatarUrl = googleIdentity.identity_data.avatar_url;
      // If it's a Google avatar URL, modify the size parameter
      if (avatarUrl.includes("googleusercontent.com")) {
        avatarUrl = avatarUrl.replace("=s96-c", "=s400-c");
      }
    }
  }

  return (
    <Avatar className={className}>
      {avatarUrl && (
        <div className="relative aspect-square h-full w-full">
          <Image
            src={avatarUrl}
            alt={
              user?.user_metadata?.display_name ||
              user?.user_metadata?.full_name ||
              "User"
            }
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority
          />
        </div>
      )}
      <AvatarFallback className="bg-muted">
        {getFallbackInitial()}
      </AvatarFallback>
    </Avatar>
  );
}

export { Avatar, AvatarImage, AvatarFallback };
