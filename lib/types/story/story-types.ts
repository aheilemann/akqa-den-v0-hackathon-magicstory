import { ImageData } from "@/types/create-story";

export interface StoryPage {
  text: string;
  imagePrompt?: string;
  imageUrl?: string;
  imageCaption?: string;
  imagePreview?: string;
  imageFile?: File;
}

export interface Story {
  title: string;
  pages: StoryPage[];
  summary: string;
  targetAge: string;
}

export interface StoryConfig {
  idea?: string;
  imageData?: ImageData[];
  target_age: {
    name: string;
    description: string;
    emoji: string;
  };
  setting: {
    name: string;
    description: string;
    emoji: string;
    visualStyle: string;
  };
  character: {
    name: string;
    description: string;
    emoji: string;
    traits: string[];
  };
  theme: {
    name: string;
    description: string;
    emoji: string;
    example: string;
  };
}
