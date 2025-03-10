"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Database } from "@/lib/database.types";
import { User } from "@supabase/supabase-js";
import { Story, StoryConfig } from "@/lib/types";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required"
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        subscription_tier_id: "f4307fbd-70b9-4265-95d3-600a2f1b339d", // Free tier ID
      },
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link."
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect("error", "/reset-password", "Passwords do not match");
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect("error", "/reset-password", "Password update failed");
  }

  encodedRedirect("success", "/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export type SubscriptionTier =
  Database["public"]["Tables"]["subscription_tiers"]["Row"];

export async function fetchTiers() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("subscription_tiers")
      .select("*")
      .order("subscription_tier_price");

    if (error) throw error;
    return data as SubscriptionTier[];
  } catch (error) {
    console.error("Error fetching tiers:", error);
    return [];
  }
}

export const handleGoogleSignIn = async () => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("Error signing in with Google:", error.message);
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect(data.url);
};

export type ProfileData = {
  user: User;
  subscription: Database["public"]["Tables"]["subscription_tiers"]["Row"];
  usage: {
    used: number;
    total: number;
    continuations: {
      used: number;
      total: number | null;
    };
  };
};

export async function fetchProfileData(
  id?: string
): Promise<ProfileData | null> {
  const supabase = await createClient();

  try {
    // Get user data - either by ID or current user
    let user;
    if (id) {
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();
      user = userData;
    } else {
      user = await getUser(); // Use our helper function
    }

    if (!user) {
      console.error("No user found");
      return null;
    }

    // Get subscription data
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from("subscription_tiers")
      .select("*")
      .eq(
        "subscription_tier_id",
        user.user_metadata?.subscription_tier_id || "free"
      )
      .single();

    if (subscriptionError) {
      console.error("Error fetching subscription data:", subscriptionError);
    }

    const today = new Date().toISOString().split("T")[0];

    // Get today's usage data
    const { data: usageData, error: usageError } = await supabase
      .from("user_daily_usage")
      .select("stories_generated")
      .eq("user_id", user.id)
      .eq("date", today)
      .single();

    if (usageError && usageError.code !== "PGRST116") {
      // Ignore "no rows returned" error
      console.error("Error fetching usage data:", usageError);
    }

    // Get continuation count
    const { count: continuationCount } = await supabase
      .from("story_continuations")
      .select("story_continuation_story_id, stories!inner(story_user_id)", {
        count: "exact",
        head: true,
      })
      .eq("stories.story_user_id", user.id)
      .gte("story_continuation_created_at", today);

    const storiesGenerated = usageData?.stories_generated || 0;
    const storyLimit = subscriptionData?.subscription_tier_story_limit;
    const continuationLimit =
      subscriptionData?.subscription_tier_continuation_limit;

    const profileData = {
      user,
      subscription: subscriptionData || {
        subscription_tier_id: "free",
        subscription_tier_name: "Free",
        subscription_tier_description: "Basic features for everyone",
        subscription_tier_price: 0,
        subscription_tier_story_limit: 1,
        subscription_tier_continuation_limit: 3,
        subscription_tier_features: ["Basic features"],
        subscription_tier_created_at: null,
        subscription_tier_updated_at: null,
      },
      usage: {
        used: storiesGenerated,
        total: storyLimit,
        continuations: {
          used: continuationCount || 0,
          total: continuationLimit,
        },
      },
    };

    return profileData;
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return null;
  }
}

export async function updateProfileDisplayName(displayName: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.updateUser({
      data: {
        display_name: displayName,
        updated_at: new Date().toISOString(),
      },
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error };
  }
}

export async function uploadProfileAvatar(file: File) {
  const supabase = await createClient();

  // Get current user using the helper
  const user = await getAuthenticatedUser();

  try {
    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}.${fileExt}`;

    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Get the public URL
    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    if (!data) throw new Error("Could not get public URL");

    // Update user metadata with new avatar URL
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        profile_img: data.publicUrl,
        updated_at: new Date().toISOString(),
      },
    });

    if (updateError) throw updateError;

    return { success: true, url: data.publicUrl };
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return { success: false, error };
  }
}

async function uploadStoryImage(
  supabase: any,
  imageUrl: string,
  storyId: string,
  index: number
) {
  try {
    // Convert base64 to blob
    const imageBlob = await fetch(imageUrl).then((r) => r.blob());

    // Upload to Supabase storage - now using a single folder per story
    const filePath = `${storyId}/${index}.png`;
    const { error: uploadError } = await supabase.storage
      .from("stories")
      .upload(filePath, imageBlob, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("stories").getPublicUrl(filePath);

    return {
      path: filePath,
      url: publicUrl,
    };
  } catch (error) {
    console.error(`Error uploading image ${index}:`, error);
    return null;
  }
}

export async function saveStory(story: Story, settings: StoryConfig) {
  const supabase = await createClient();

  // Get current user using the helper that ensures user is authenticated
  const user = await getAuthenticatedUser();

  try {
    // Check if user has reached their daily limit
    const { data: profileData } = await supabase
      .from("user_daily_usage")
      .select("stories_generated")
      .eq("user_id", user.id)
      .eq("date", new Date().toISOString().split("T")[0])
      .single();

    const { data: subscriptionData } = await supabase
      .from("subscription_tiers")
      .select("subscription_tier_story_limit")
      .eq(
        "subscription_tier_id",
        user.user_metadata?.subscription_tier_id || "free"
      )
      .single();

    const storiesGenerated = profileData?.stories_generated || 0;
    const storyLimit = subscriptionData?.subscription_tier_story_limit;

    // If storyLimit is null, it means unlimited
    // If storyLimit is a number, check if we've reached it
    if (storyLimit !== null && storiesGenerated >= storyLimit) {
      return {
        success: false,
        error: "LIMIT_REACHED",
        limit: storyLimit,
      };
    }

    // 1. First create the story record to get the ID
    const { data: storyData, error: storyError } = await supabase
      .from("stories")
      .insert({
        story_user_id: user.id,
        story_title: story.title,
        story_inspiration: JSON.stringify(settings),
        story_status: (await getDefaultStoryStatus()).story_status_id,
        story_version: 1,
        story_is_current: true,
        // Initialize with empty content that we'll update after uploading images
        story_content: {
          title: story.title,
          summary: story.summary,
          targetAge: story.targetAge,
          pages: story.pages.map((page) => ({
            text: page.text,
            imagePrompt: page.imagePrompt,
            imageUrl: null,
          })),
        },
      })
      .select()
      .single();

    if (storyError) throw storyError;

    // 2. Upload images using the story ID
    const storyImages = await Promise.all(
      story.pages.map((page, index) =>
        page.imageUrl
          ? uploadStoryImage(supabase, page.imageUrl, storyData.story_id, index)
          : null
      )
    );

    // 3. Update the story with image URLs and paths
    const updatedContent = {
      title: story.title,
      summary: story.summary,
      targetAge: story.targetAge,
      pages: story.pages.map((page, index) => ({
        text: page.text,
        imagePrompt: page.imagePrompt,
        imageUrl: storyImages[index]?.url || null,
      })),
    };

    const { error: updateError } = await supabase
      .from("stories")
      .update({
        story_content: updatedContent,
      })
      .eq("story_id", storyData.story_id);

    if (updateError) throw updateError;

    // Increment usage after successful save
    const usageUpdated = await incrementStoryUsage(user.id);

    if (!usageUpdated) {
      console.error("Failed to increment usage for user:", user.id);
    }

    return { success: true, storyId: storyData.story_id };
  } catch (error) {
    console.error("Error saving story:", error);
    return { success: false, error };
  }
}

async function getDefaultStoryStatus() {
  const supabase = await createClient();

  // Get the 'draft' status ID
  const { data, error } = await supabase
    .from("story_statuses")
    .select("story_status_id")
    .eq("story_status_name", "draft")
    .single();

  if (error) throw error;
  return data;
}

export async function fetchStoriesByUserId(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .eq("story_user_id", userId);
  if (error) throw error;
  return data;
}

export async function getStoryById(id: string) {
  const supabase = await createClient();

  // Get story with all required fields
  const { data: story } = await supabase
    .from("stories")
    .select("*")
    .eq("story_id", id)
    .single();
  // Fetch story and continuations in parallel
  const [storyResult, continuationsResult] = await Promise.all([
    supabase.from("stories").select("*").eq("story_id", id).single(),
    supabase
      .from("story_continuations")
      .select("*")
      .eq("story_continuation_story_id", id)
      .order("story_continuation_created_at", { ascending: true }),
  ]);

  if (!story) {
    return null;
  }

  return {
    story_id: story.story_id,
    story_title: story.story_title,
    story_content: story.story_content,
    story_created_at: story.story_created_at,
    story_updated_at: story.story_updated_at,
    story_user_id: story.story_user_id,
    continuations: continuationsResult.data || [],
  };
}

export async function incrementStoryUsage(userId: string): Promise<boolean> {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  try {
    // Try to get existing record first
    const { data: existingRecord } = await supabase
      .from("user_daily_usage")
      .select("stories_generated")
      .eq("user_id", userId)
      .eq("date", today)
      .single();

    if (existingRecord) {
      // Update existing record
      const { error: updateError } = await supabase
        .from("user_daily_usage")
        .update({
          stories_generated: (existingRecord.stories_generated || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .eq("date", today);

      if (updateError) throw updateError;
    } else {
      // Create new record
      const { error: insertError } = await supabase
        .from("user_daily_usage")
        .insert({
          user_id: userId,
          stories_generated: 1,
          date: today,
        });

      if (insertError) throw insertError;
    }

    return true;
  } catch (error) {
    console.error("Error incrementing story usage:", error);
    return false;
  }
}

export async function getUser(
  throwOnError: boolean = false
): Promise<User | null> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      if (throwOnError) throw new Error("User not authenticated");
      return null;
    }

    if (!user && throwOnError) {
      throw new Error("User not authenticated");
    }

    return user;
  } catch (error) {
    console.error("Error in getUser:", error);
    if (throwOnError) throw error;
    return null;
  }
}

// Helper that returns non-null user for functions that require authentication
export async function getAuthenticatedUser(): Promise<User> {
  const user = await getUser(true);
  // If we get here, we know user is not null due to throwOnError
  return user as User;
}

export async function deleteStory(storyId: string) {
  const supabase = await createClient();

  // Get current user using the helper that ensures user is authenticated
  const user = await getAuthenticatedUser();

  try {
    // Delete the story record - the trigger will handle storage cleanup
    const { error } = await supabase
      .from("stories")
      .delete()
      .eq("story_id", storyId)
      .eq("story_user_id", user.id); // Ensure user can only delete their own stories

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error deleting story:", error);
    return { success: false, error };
  }
}

export async function updateUserSubscription(tierId: string) {
  const supabase = await createClient();

  // Get current user using the helper
  const _user = await getAuthenticatedUser();

  try {
    // Update user metadata with new subscription tier
    const { error } = await supabase.auth.updateUser({
      data: {
        subscription_tier_id: tierId,
      },
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error updating subscription:", error);
    return { success: false, error };
  }
}

export async function getStories(limit: number = 4) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .order("story_created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function incrementStoryContinuation(
  storyId: string,
  continuationType: string,
  customPrompt?: string
): Promise<boolean> {
  const supabase = await createClient();

  // Get current user using the helper
  const user = await getAuthenticatedUser();

  try {
    // Get the story to verify ownership
    const { data: storyData } = await supabase
      .from("stories")
      .select("story_user_id")
      .eq("story_id", storyId)
      .single();

    if (!storyData) throw new Error("Story not found");
    if (storyData.story_user_id !== user.id) throw new Error("Unauthorized");

    // Check if user has reached their daily continuation limit
    const today = new Date().toISOString().split("T")[0];
    const { count: continuationCount } = await supabase
      .from("story_continuations")
      .select("story_continuation_story_id, stories!inner(story_user_id)", {
        count: "exact",
        head: true,
      })
      .eq("stories.story_user_id", user.id)
      .gte("story_continuation_created_at", today);

    // Get user's subscription tier
    const { data: subscriptionData } = await supabase
      .from("subscription_tiers")
      .select("subscription_tier_continuation_limit")
      .eq(
        "subscription_tier_id",
        user.user_metadata?.subscription_tier_id || "free"
      )
      .single();

    const continuationLimit =
      subscriptionData?.subscription_tier_continuation_limit;
    const currentContinuations = continuationCount || 0;

    // If continuationLimit is null, it means unlimited
    // If continuationLimit is a number, check if we've reached it
    if (
      continuationLimit !== null &&
      currentContinuations >= continuationLimit
    ) {
      return false;
    }

    // Record the continuation
    const { error: continuationError } = await supabase
      .from("story_continuations")
      .insert({
        story_continuation_story_id: storyId,
        story_continuation_type: continuationType,
        story_continuation_custom_prompt: customPrompt,
        story_continuation_content: {}, // This will be updated later with the actual continuation content
      });

    if (continuationError) throw continuationError;

    return true;
  } catch (error) {
    console.error("Error recording story continuation:", error);
    return false;
  }
}
