"use client";
import { StoryGenerator } from "@/components/organisms/story-generator";
import { type StoryConfig } from "@/lib/types";
import { getAllStoryDataAsStoryConfig } from "@/utils/storage/story-creation-storage";
import { useEffect, useState } from "react";

const YourStoryPage = () => {
  const [storySettings, setStorySettings] = useState<StoryConfig | null>(null);
  useEffect(() => {
    const localStoryConfig = getAllStoryDataAsStoryConfig();

    if (localStoryConfig) {
      setStorySettings(localStoryConfig);
    }
  }, []);

  return (
    <div>
      <h1>Generating your story...</h1>

      {storySettings && (
        <div>
          <p>{JSON.stringify(storySettings)}</p>
          <StoryGenerator settings={storySettings} />
        </div>
      )}
    </div>
  );
};

export default YourStoryPage;
