import { SETTING_PROMPT, CHARACTER_PROMPT, THEME_PROMPT } from "@/lib/prompt";
import {
  storyCharacterOptions,
  storySettingOptions,
  storyThemeOptions,
} from "@/utils/story-options";

export const steps = [
  {
    title: "Choose Your Story Setting",
    description: "Where will your adventure take place?",
    prompt: SETTING_PROMPT,
    options: storySettingOptions,
    key: "setting",
  },
  {
    title: "Pick Your Main Character",
    description: "Who will lead this amazing journey?",
    prompt: CHARACTER_PROMPT,
    options: storyCharacterOptions,
    key: "character",
  },
  {
    title: "Select Your Story Theme",
    description: "What will your story teach us?",
    prompt: THEME_PROMPT,
    options: storyThemeOptions,
    key: "theme",
  },
];
