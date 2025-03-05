"use client";

import { Button } from "@/components/ui/button";
import { signOutAction, fetchProfileData } from "@/app/actions";
import { CalendarDays, Mail, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { StoryList } from "@/components/organisms/story-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { ProfileEditor } from "./profile-editor";
import { SubscriptionTier } from "@/components/molecules/subscription-tier";
import Link from "next/link";
import type { ProfileData } from "@/app/actions";
import type { Story } from "@/components/organisms/story-list";
type UserProfileProps = {
  initialProfileData: ProfileData;
  isPersonalProfile?: boolean;
  stories: Story[];
};

export function UserProfile({ initialProfileData, isPersonalProfile = true, stories }: UserProfileProps) {
  const [profileData, setProfileData] = useState<ProfileData>(initialProfileData);

  const refreshProfile = async () => {
    const updatedProfile = await fetchProfileData();
    if (updatedProfile) {
      setProfileData(updatedProfile);
    }
  };

  const joinDate = new Date(profileData.user.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  // Get display name and avatar from user metadata
  const displayName = profileData.user.user_metadata?.display_name || "";
  const avatarUrl = profileData.user.user_metadata?.profile_img || profileData.user.user_metadata?.avatar_url;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.section variants={container} initial="hidden" animate="show" className="space-y-6 px-4 lg:px-0">
      {/* Header Section */}
      <motion.div variants={item} className="flex flex-col md:flex-row gap-6 md:gap-8 items-center lg:items-start">
        <div className="relative">
          <Avatar className="h-24 w-24 md:h-20 md:w-20">
            <AvatarImage src={avatarUrl} alt={displayName} className="object-cover object-center" />
            <AvatarFallback>{displayName?.charAt(0) || profileData.user.email?.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 space-y-3 md:space-y-2 items-center lg:items-start text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4 justify-between w-full">
            <motion.div variants={item} className="flex items-center gap-2">
              <h1 className="text-2xl font-medium tracking-tighter">{displayName || profileData.user.email?.split("@")[0] || "User"}</h1>
              {isPersonalProfile && <ProfileEditor profileData={profileData} onProfileUpdate={refreshProfile} />}
            </motion.div>
            {isPersonalProfile && (
              <motion.div variants={item}>
                <form action={signOutAction}>
                  <Button type="submit" variant="outline" size="sm">
                    Sign out
                  </Button>
                </form>
              </motion.div>
            )}
          </div>

          <motion.div variants={item} className="flex items-center flex-col md:flex-row gap-2 md:gap-6 text-sm text-muted-foreground">
            {isPersonalProfile && profileData.user.email && (
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {profileData.user.email}
              </div>
            )}

            {joinDate && (
              <div className="flex items-center gap-1">
                <CalendarDays className="w-4 h-4" />
                Joined {joinDate}
              </div>
            )}

            {profileData.user.user_metadata?.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {profileData.user.user_metadata.location}
              </div>
            )}
          </motion.div>

          {profileData.user.user_metadata?.bio && (
            <motion.p variants={item} className="text-sm max-w-md">
              {profileData.user.user_metadata.bio}
            </motion.p>
          )}
        </div>
      </motion.div>

      {isPersonalProfile && (
        <motion.div variants={item}>
          <SubscriptionTier subscription={profileData.subscription} usage={profileData.usage} />
        </motion.div>
      )}

      <Separator />

      <motion.div variants={item} className="flex flex-col gap-6 pt-8">
        <div className="flex items-center justify-between">
          {isPersonalProfile && (
            <Link href="/create">
              <Button size="sm" variant="outline">
                Add new
              </Button>
            </Link>
          )}
        </div>
        <StoryList stories={stories} />
      </motion.div>
    </motion.section>
  );
}
