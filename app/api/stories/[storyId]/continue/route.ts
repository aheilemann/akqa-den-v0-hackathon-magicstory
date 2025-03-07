import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { openai } from "@ai-sdk/openai";
import { generateText, experimental_generateImage as generateImage } from "ai";

export const preferredRegion = "fra1"; // Frankfurt
export const runtime = "edge";

type StoryPage = {
  text: string;
  imagePrompt: string;
  imageUrl?: string | null;
};

type ContinuationData = {
  title: string;
  pages: StoryPage[];
  summary: string;
};

async function uploadStoryImage(
  supabase: any,
  imageData: { base64: string; uint8Array: Uint8Array },
  storyId: string,
  continuationId: string,
  index: number
) {
  try {
    // Convert base64 to blob
    const imageBlob = new Blob([imageData.uint8Array], { type: "image/png" });

    // Upload to Supabase storage in a continuation-specific folder
    const filePath = `${storyId}/continuations/${continuationId}/${index}.png`;
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

    return publicUrl;
  } catch (error) {
    console.error(`Error uploading image ${index}:`, error);
    return null;
  }
}

async function generateStoryImage(
  prompt: string
): Promise<{ base64: string; uint8Array: Uint8Array } | null> {
  try {
    if (process.env.DISABLE_IMAGE_GENERATION === "true") {
      return null;
    }

    const { image } = await generateImage({
      model: openai.image("dall-e-3"),
      prompt: `Create a children's book illustration: ${prompt}. Style: Warm, friendly, and appropriate for young children. The image should be colorful, engaging, and suitable for a children's story book.`,
      size: "1024x1024",
      providerOptions: {
        openai: { quality: "standard", style: "natural" },
      },
      n: 1,
    });

    return image;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
}

export async function POST(
  req: Request,
  context: { params: Promise<{ storyId: string }> }
) {
  try {
    const [{ type, customPrompt }, supabase, { storyId }] = await Promise.all([
      req.json(),
      createClient(),
      context.params,
    ]);

    // Get current user and verify their continuation limit
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Get user's subscription tier and current usage
    const today = new Date().toISOString().split("T")[0];
    const [{ count: continuationCount }, { data: subscriptionData }] =
      await Promise.all([
        supabase
          .from("story_continuations")
          .select("story_continuation_story_id, stories!inner(story_user_id)", {
            count: "exact",
            head: true,
          })
          .eq("stories.story_user_id", user.id)
          .gte("story_continuation_created_at", today),
        supabase
          .from("subscription_tiers")
          .select("subscription_tier_continuation_limit")
          .eq(
            "subscription_tier_id",
            user.user_metadata?.subscription_tier_id || "free"
          )
          .single(),
      ]);

    const continuationLimit =
      subscriptionData?.subscription_tier_continuation_limit;
    if (
      continuationLimit !== null &&
      (continuationCount || 0) >= continuationLimit
    ) {
      return new Response(
        JSON.stringify({
          error: "Daily continuation limit reached",
          limit: continuationLimit,
          used: continuationCount,
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Get the original story
    const { data: story, error: storyError } = await supabase
      .from("stories")
      .select("*, story_content")
      .eq("story_id", storyId)
      .single();

    if (storyError) throw storyError;

    // Create the continuation prompt based on the type
    let continuationPrompt = `You are tasked with creating a direct continuation of "${story.story_title}". This MUST feel like the next chapter of the exact same story, not a new story.

CRITICAL RULES:
1. The title MUST follow this format: "${story.story_title}: [Subtitle]" or use the same naming pattern as the original
2. The story MUST continue with the EXACT same:
   - Main character (${story.story_content.character || "the main character"})
   - Setting (${story.story_content.setting || "the established setting"})
   - Writing style and tone
3. NO introducing completely new settings or main characters
4. NO changing the established world rules
5. The continuation MUST start exactly where the original story ended

LAST PAGE OF ORIGINAL STORY:
"""
${story.story_content.pages[story.story_content.pages.length - 1].text}
"""

Your continuation MUST start from this exact moment, maintaining perfect flow as if reading from one page to the next.
`;

    switch (type) {
      case "theme":
        continuationPrompt += `Continue this story by expanding on its core themes and values.

Original Story:
"""
${story.story_content.summary}
"""

Key Requirements:
1. Title MUST be "${story.story_title}: [Subtitle]" or match the original pattern
2. First page MUST directly follow from the last page shown above
3. Setting MUST remain in ${story.story_content.setting || "the established setting"}
4. Reference the EXACT situation/action from the last page
5. Use the same magical/world elements already established

Transition Requirements:
- First sentence MUST feel like it immediately follows the last sentence of the original
- Maintain the exact same emotional tone from the last page
- Continue any unfinished actions or thoughts
- Keep the same narrative voice and pacing

Focus on:
- Making this feel like turning to the next page of the same book
- Continuing the immediate action/dialogue/situation
- Building on what JUST happened
- Keeping the exact same tone and style

Example of Good Continuation:
Last page: "Luna stepped closer to the glowing crystal, her heart racing with anticipation."
First page of continuation: "As her fingers touched the crystal's smooth surface, a warm light pulsed through her hand."

Example of Bad Continuation:
Last page: "Luna stepped closer to the glowing crystal, her heart racing with anticipation."
First page of continuation: "The next morning, Luna woke up thinking about her adventure." (Creates an artificial time gap)`;
        break;
      case "character":
        continuationPrompt += `Continue this story by focusing on the main character's ongoing journey.

Original Story:
"""
${story.story_content.summary}
"""

Key Requirements:
1. Title MUST be "${story.story_title}: [Subtitle]" or match the original pattern
2. Continue with ${story.story_content.character || "the main character"}'s IMMEDIATE next steps
3. Reference what they JUST learned or discovered
4. Keep them in ${story.story_content.setting || "the same setting"}

Focus on:
- Making this feel like the next scene of the same story
- Building on their recent discoveries
- Continuing their current relationships
- Maintaining exact same personality and voice`;
        break;
      case "new":
        continuationPrompt += `Create a new adventure that directly continues from the original story's ending.

Original Story Context:
- Title: "${story.story_title}"
- Main Character: ${story.story_content.character}
- Original Setting: ${story.story_content.setting}

Key Elements to Maintain:
1. Continue with the SAME main character(s)
2. Start from where the previous story ended
3. Reference specific events from the original story
4. Keep the same magical/world rules established

Focus on:
- Creating a direct continuation of the previous events
- Expanding the world while maintaining consistency
- Building upon the character's previous experiences
- Making clear references to the original adventure`;
        break;
      case "custom":
        continuationPrompt += `Continue this children's story following the provided direction while maintaining direct continuity.

Original Story Context:
- Title: "${story.story_title}"
- Current Story State: ${story.story_content.summary}
- Custom Direction: ${customPrompt}

Key Elements to Maintain:
1. Continue with the SAME main character(s)
2. Reference specific events from the original story
3. Build upon the established world and its rules
4. Maintain consistent character voices and relationships

Focus on:
- Incorporating the requested elements while maintaining story continuity
- Building directly upon previous events and discoveries
- Keeping the same tone and style
- Creating a natural progression that honors the original story`;
        break;
    }

    // Update the generation prompt
    const response = await generateText({
      model: openai("gpt-4"),
      prompt: `${continuationPrompt}

Create a DIRECT continuation that feels like the next page of the same book:

1. Title MUST be in format: "${story.story_title}: [Subtitle]" or match the original pattern
2. Pages must continue the IMMEDIATE next events, where:
   Page 1:
   - MUST feel like the very next page after: "${story.story_content.pages[story.story_content.pages.length - 1].text}"
   - NO time jumps or scene changes
   - Continue the exact action/emotion/moment
   - Use the same narrative voice and pacing
   
   Page 2:
   - Continue the flow established in page 1
   - Maintain consistent pacing and tone
   - Build upon the immediate situation

   Each page needs an image prompt that:
   - Shows the same character(s) in the same setting
   - Maintains visual continuity with the last scene
   - Builds on the established style

3. Summary must explain how this continues directly from the last moment of the original story

Format as JSON:
{
  "title": "string (MUST follow original title pattern)",
  "pages": [
    {
      "text": "string (direct continuation from last page shown above)",
      "imagePrompt": "string (same character/setting/style)"
    }
  ],
  "summary": "string (explain direct connection to final moment)"
}

REMEMBER: The first page should feel like simply turning to the next page in the same book - no jarring transitions or time jumps.`,
      temperature: 0.7,
      maxTokens: 2000,
    });

    const continuationData: ContinuationData = JSON.parse(response.text);

    // First, create the continuation record to get the ID
    const { data: continuation, error: continuationError } = await supabase
      .from("story_continuations")
      .insert({
        story_continuation_story_id: storyId,
        story_continuation_type: type,
        story_continuation_custom_prompt: customPrompt || null,
        story_continuation_content: {
          ...continuationData,
          pages: continuationData.pages.map((page) => ({
            ...page,
            imageUrl: null,
          })),
        },
      })
      .select()
      .single();

    if (continuationError) throw continuationError;

    // Generate and upload images
    const imagePromises = continuationData.pages.map(async (page, index) => {
      const imageData = await generateStoryImage(page.imagePrompt);
      if (!imageData) return null;
      return uploadStoryImage(
        supabase,
        imageData,
        storyId,
        continuation.story_continuation_id,
        index
      );
    });

    const imageUrls = await Promise.all(imagePromises);

    // Update the continuation with image URLs
    const updatedContent = {
      ...continuationData,
      pages: continuationData.pages.map((page, index) => ({
        ...page,
        imageUrl: imageUrls[index],
      })),
    };

    const { error: updateError } = await supabase
      .from("story_continuations")
      .update({
        story_continuation_content: updatedContent,
      })
      .eq("story_continuation_id", continuation.story_continuation_id);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({
        ...continuation,
        story_continuation_content: updatedContent,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error generating story continuation:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate story continuation" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
