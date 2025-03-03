import { type StoryConfig } from "@/lib/types";

export const createStoryPrompt = (settings: StoryConfig) => `
Create a children's story based on the following elements:

Setting: ${settings.setting.name}
${settings.setting.description}
Visual style: ${settings.setting.visualStyle}

Main Character: ${settings.character.name}
${settings.character.description}
Character traits: ${settings.character.traits.join(", ")}

Theme: ${settings.theme.name}
${settings.theme.description}

Please create a story with the following structure:
1. A title for the story
2. ONLY 2 pages of content, where each page should:
   - Have 2-3 sentences of story text appropriate for young children
   - Include a detailed image prompt that matches the setting's visual style
3. A target age range for the story

Format the response as JSON with this structure:
{
  "title": "string",
  "pages": [
    {
      "text": "string",
      "imagePrompt": "string"
    }
  ],
  "targetAge": "string",
  "summary": "string"
}

Make the story engaging, age-appropriate, and positive in tone.
`;
