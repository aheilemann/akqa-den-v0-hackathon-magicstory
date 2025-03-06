import { notFound } from "next/navigation";
import { StoryViewer } from "@/components/organisms/story-viewer/story-viewer";
import { getStoryById } from "@/app/actions";

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const story = await getStoryById(id);

  if (!story) {
    notFound();
  }

  return <StoryViewer story={story} />;
}
