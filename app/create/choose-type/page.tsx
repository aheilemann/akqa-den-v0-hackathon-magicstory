"use client";
import { StoryTypeForm } from "@/components/organisms/story-type-form";

const ChooseTypePage = () => {
  return (
    <div className="container mx-auto px-4 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-4xl">The Themes of Your Story</h1>

        <h4 className="text-xl text-gray-600">
          Choose the main- and sub themes of your story
        </h4>
        <StoryTypeForm />
      </div>
    </div>
  );
};

export default ChooseTypePage;
