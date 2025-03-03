"use client";

import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/actions";
import { CalendarDays, Mail, MapPin, Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { StoryList } from "@/components/organisms/story-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { ProfileEditor } from "./profile-editor";
import { SubscriptionTier } from "@/components/molecules/subscription-tier";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import type { Database } from "@/lib/database.types";

type UserProfileProps = {
  user: User;
};

// Mock subscription data - replace with real data later
const mockSubscription: Database["public"]["Tables"]["subscription_tiers"]["Row"] =
  {
    subscription_tier_id: "pro",
    subscription_tier_name: "Pro",
    subscription_tier_description: "Advanced features for power users",
    subscription_tier_price: 9.99,
    subscription_tier_story_limit: 50,
    subscription_tier_continuation_limit: 100,
    subscription_tier_features: ["Unlimited stories", "Priority support"],
    subscription_tier_created_at: null,
    subscription_tier_updated_at: null,
  };

// Mock usage data - replace with real data later
const mockUsage = {
  used: 15,
  total: mockSubscription.subscription_tier_story_limit || 50,
};

export function UserProfile({ user }: UserProfileProps) {
  const [currentUser, setCurrentUser] = useState<User>(user);
  const supabase = createClient();

  const fetchProfile = async () => {
    try {
      // Get the latest user data
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error);
        return;
      }

      if (data && data.user) {
        setCurrentUser(data.user);
        console.log(data.user);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const joinDate = new Date(currentUser.created_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
    }
  );

  // Get display name and avatar from user metadata
  const displayName = currentUser.user_metadata?.display_name || "";
  const avatarUrl =
    currentUser.user_metadata?.profile_img ||
    currentUser.user_metadata?.avatar_url;

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

  const mockStories = [
    {
      id: 1,
      title: "The Adventure Begins",
      description: "A journey through magical realms and ancient mysteries...",
      emoji: "🌟",
      imageUrl: "/assets/img/placeholders/book_placeholder.png",
    },
    {
      id: 2,
      title: "Lost in Time",
      description: "Exploring the depths of time and space...",
      emoji: "⏳",
      imageUrl: "/assets/img/placeholders/book_placeholder.png",
    },
    {
      id: 3,
      title: "The Last Guardian",
      description: "A tale of loyalty, courage, and destiny...",
      emoji: "🛡️",
      imageUrl: "/assets/img/placeholders/book_placeholder.png",
    },
  ];

  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 px-4 lg:px-0"
    >
      {/* Header Section */}
      <motion.div
        variants={item}
        className="flex flex-col md:flex-row gap-6 md:gap-8 items-center lg:items-start"
      >
        <div className="relative">
          <Avatar className="h-24 w-24 md:h-20 md:w-20">
            <AvatarImage
              src={avatarUrl}
              alt={displayName}
              className="object-cover object-center"
            />
            <AvatarFallback>
              {displayName?.charAt(0) || currentUser.email?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 space-y-3 md:space-y-2 items-center lg:items-start text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4 justify-between w-full">
            <motion.div variants={item} className="flex items-center gap-2">
              <h1 className="text-2xl font-medium tracking-tighter">
                {displayName || currentUser.email?.split("@")[0] || "User"}
              </h1>
              <ProfileEditor
                user={currentUser}
                displayName={displayName}
                avatarUrl={avatarUrl}
                onProfileUpdate={fetchProfile}
              />
            </motion.div>
            <motion.div variants={item}>
              <form action={signOutAction}>
                <Button type="submit" variant="outline" size="sm">
                  Sign out
                </Button>
              </form>
            </motion.div>
          </div>

          <motion.div
            variants={item}
            className="flex items-center flex-col md:flex-row gap-2 md:gap-6 text-sm text-muted-foreground"
          >
            {currentUser.email && (
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {currentUser.email}
              </div>
            )}

            {joinDate && (
              <div className="flex items-center gap-1">
                <CalendarDays className="w-4 h-4" />
                Joined {joinDate}
              </div>
            )}

            {currentUser.user_metadata?.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {currentUser.user_metadata.location}
              </div>
            )}
          </motion.div>

          {currentUser.user_metadata?.bio && (
            <motion.p variants={item} className="text-sm max-w-md">
              {currentUser.user_metadata.bio}
            </motion.p>
          )}
        </div>
      </motion.div>

      <motion.div variants={item}>
        <SubscriptionTier subscription={mockSubscription} usage={mockUsage} />
      </motion.div>

      <Separator />

      {/* TODO: Switch out mockstories for the stories from the DB */}
      <motion.div variants={item} className="flex flex-col gap-6 pt-8">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium tracking-tight">
            Your stories {"(" + mockStories?.length + ")"}
          </h3>
          <Link href="/create">
            <Button size="sm" variant="outline">
              Add new
            </Button>
          </Link>
        </div>
        <StoryList stories={mockStories} />
      </motion.div>
    </motion.section>
  );
}
