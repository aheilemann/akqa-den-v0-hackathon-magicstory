import { notFound } from "next/navigation";
import { StoryViewer } from "@/components/organisms/story-viewer/story-viewer";

import { getStoryById } from "@/app/actions";

export default async function StoryPage({ params }: { params: { id: string } }) {
  const story = await getStoryById(params.id);

  if (!story) {
    notFound();
  }

  return <StoryViewer story={story} />;
}
