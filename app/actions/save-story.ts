"use server";

import { createClient } from "@/utils/supabase/server";
import { Story, StoryConfig } from "@/lib/types";

async function uploadStoryImage(supabase: any, imageUrl: string, storyId: string, index: number) {
  try {
    // Convert base64 to blob
    const imageBlob = await fetch(imageUrl).then((r) => r.blob());

    // Upload to Supabase storage - now using a single folder per story
    const filePath = `${storyId}/${index}.png`;
    const { error: uploadError } = await supabase.storage.from("stories").upload(filePath, imageBlob, {
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
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

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
    const storyImages = await Promise.all(story.pages.map((page, index) => (page.imageUrl ? uploadStoryImage(supabase, page.imageUrl, storyData.story_id, index) : null)));

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

    return { success: true, storyId: storyData.story_id };
  } catch (error) {
    console.error("Error saving story:", error);
    return { success: false, error };
  }
}

async function getDefaultStoryStatus() {
  const supabase = await createClient();

  // Get the 'draft' status ID
  const { data, error } = await supabase.from("story_statuses").select("story_status_id").eq("story_status_name", "draft").single();

  if (error) throw error;
  return data;
}
