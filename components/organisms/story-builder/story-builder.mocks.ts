import { SETTING_PROMPT, CHARACTER_PROMPT, THEME_PROMPT } from "@/lib/prompts";

export const steps = [
  {
    title: "Choose Your Story Setting",
    description: "Where will your adventure take place?",
    prompt: SETTING_PROMPT,
    key: "setting",
  },
  {
    title: "Pick Your Main Character",
    description: "Who will lead this amazing journey?",
    prompt: CHARACTER_PROMPT,
    key: "character",
  },
  {
    title: "Select Your Story Theme",
    description: "What will your story teach us?",
    prompt: THEME_PROMPT,
    key: "theme",
  },
];
