import {
  SETTING_PROMPT,
  CHARACTER_PROMPT,
  THEME_PROMPT,
  TARGET_AGE_PROMPT,
} from "@/lib/prompt";
import {
  storyCharacterOptions,
  storySettingOptions,
  storyTargetAgeOptions,
  storyThemeOptions,
} from "@/utils/story-options";

export const steps = [
  {
    title: "Choose Your Target Age",
    description: "What should be your taget age for your story?",
    prompt: TARGET_AGE_PROMPT,
    options: storyTargetAgeOptions,
    key: "target_age",
  },
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
