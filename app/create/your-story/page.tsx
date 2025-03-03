import { StoryGenerator } from "@/components/organisms/story-generator";
import { getAllStoryDataAsStoryConfig } from "@/utils/storage/story-creation-storage";

const YourStoryPage = () => {
  const localStoryConfig = getAllStoryDataAsStoryConfig();

  return (
    <div>
      <h1>Generating your story...</h1>

      {localStoryConfig && (
        <div>
          {/* <p>{`"${localStoryConfig}"`}</p> */}
          <StoryGenerator settings={localStoryConfig} />
        </div>
      )}
    </div>
  );
};

export default YourStoryPage;
