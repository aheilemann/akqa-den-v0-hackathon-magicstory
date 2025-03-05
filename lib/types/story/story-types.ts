export interface StoryPage {
  text: string;
  imagePrompt: string;
  imageUrl?: string;
}

export interface Story {
  title: string;
  pages: StoryPage[];
  summary: string;
  targetAge: string;
}

export interface StoryConfig {
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
