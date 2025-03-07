import { type StoryConfig } from "@/lib/types";

export const createStoryPrompt = (settings: StoryConfig) => `
Create a children's story based on the following elements:

Setting: ${settings.setting.name}
${settings.setting.description}
Visual style: ${settings.setting.visualStyle}

Main Character: ${settings.character.name}
${settings.character.description}
Character traits: ${settings.character.traits.join(", ")}

IMPORTANT: The user has uploaded images for this story. These are their captions, which should be CENTRAL elements in your story:  ${
  typeof settings.imageData !== "undefined" &&
  settings.imageData?.map((image) => image.caption ?? image.caption).join(", ")
}


IMPORTANT: If the user has provided an idea for the story, use it as a starting point for the story: ${settings.idea}

Theme: ${settings.theme.name}
${settings.theme.description}

Target Age: ${settings.target_age.name}: ${settings.target_age.description}

Please create a story with the following structure:
1. A title for the story
2. ONLY 6 pages of content, where each page should:
   - Have 2-3 sentences of story text appropriate for the target age ${settings.target_age.description}
   - Include a detailed image prompt that matches the setting's visual style
3. A target age for the story should be ${settings.target_age.description}
4. The ending of the story should ALWAYS be open-ended.

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
