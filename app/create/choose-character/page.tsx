"use client";

import { StoryCharacterForm } from "@/components/organisms/story-character-form";

const ChooseCharacter = () => {
  return (
    <div className="container mx-auto px-4 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-4xl">The Character(s) of You Story</h1>

        <h4 className="text-xl text-gray-600">
          Choose your character(s) of your story
        </h4>
        <StoryCharacterForm />
      </div>
    </div>
  );
};

export default ChooseCharacter;
