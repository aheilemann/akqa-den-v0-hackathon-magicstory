"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Database } from "@/lib/database.types";
import { User } from "@supabase/supabase-js";

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
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
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
      "/protected/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export type SubscriptionTier =
  Database["public"]["Tables"]["subscription_tiers"]["Row"];

export async function fetchTiers() {
  try {
    const supabase = await createClient();

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
  };
  stories: Array<{
    id: number;
    title: string;
    description: string;
    emoji: string;
    imageUrl: string;
  }>;
};

export async function fetchProfileData(
  id?: string
): Promise<ProfileData | null> {
  try {
    const supabase = await createClient();

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
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      user = authUser;
    }

    if (!user) {
      return null;
    }

    // Get subscription data
    const { data: subscriptionData } = await supabase
      .from("subscription_tiers")
      .select("*")
      .eq(
        "subscription_tier_id",
        user.user_metadata?.subscription_tier_id || "free"
      )
      .single();

    // Get usage data - replace with actual query
    const usage = {
      used: 15, // Replace with actual query
      total: subscriptionData?.subscription_tier_story_limit || 50,
    };

    // Get user's stories - replace with actual query
    const { data: stories } = await supabase
      .from("stories")
      .select("*")
      .eq("user_id", user.id);

    // Transform stories to match the expected format
    const formattedStories =
      stories?.map((story) => ({
        id: story.id,
        title: story.title,
        description: story.description,
        emoji: story.emoji || "📖",
        imageUrl:
          story.image_url || "/assets/img/placeholders/book_placeholder.png",
      })) || [];

    return {
      user,
      subscription: subscriptionData || {
        subscription_tier_id: "free",
        subscription_tier_name: "Free",
        subscription_tier_description: "Basic features for everyone",
        subscription_tier_price: 0,
        subscription_tier_story_limit: 10,
        subscription_tier_continuation_limit: 20,
        subscription_tier_features: ["Basic features"],
        subscription_tier_created_at: null,
        subscription_tier_updated_at: null,
      },
      usage,
      stories: formattedStories,
    };
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return null;
  }
}

export async function updateProfileDisplayName(displayName: string) {
  try {
    const supabase = await createClient();

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
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No user found");

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
