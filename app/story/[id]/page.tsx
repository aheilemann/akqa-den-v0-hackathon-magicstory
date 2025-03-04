import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { StoryViewer } from "@/components/organisms/story-viewer/story-viewer";
import type { Story } from "@/components/organisms/story-list/story-list";

export const revalidate = 0;

async function getStory(id: string) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get story
  const { data: story } = await supabase.from("stories").select("*").eq("story_id", id).single();

  if (!story) {
    return null;
  }

  return {
    story: story as Story,
    isOwner: user?.id === story.story_user_id,
  };
}

export default async function StoryPage({ params }: { params: { id: string } }) {
  const data = await getStory(params.id);

  if (!data) {
    notFound();
  }

  return <StoryViewer story={data.story} isOwner={data.isOwner} />;
}
