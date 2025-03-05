import { type StoryConfig } from "@/lib/types";
export interface CreateStoryFlowData {
  theme: string;
  subtheme: string;
  character: string;
  type: string;
}

export interface CreateStoryStorageData {
  data: string | string[];
}

export const setStoryDataItem = (
  key: keyof CreateStoryFlowData,
  value: string | string[],
) => {
  if (typeof window !== "undefined") {
    if (typeof value === "string") {
      localStorage.setItem(key, value);
      return;
    }
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const getStoryDataItem = (
  key: keyof CreateStoryFlowData,
): string | string[] => {
  if (typeof window !== "undefined") {
    const item = localStorage.getItem(key) || "";

    try {
      const parsedItem = JSON.parse(item);

      if (parsedItem) {
        return parsedItem;
      }
    } catch (e) {
      console.log(e);

      return item.toString();
    }
  }
  return "";
};

export const getAllStoryDataAsStoryConfig = (): StoryConfig | null => {
  const theme = getStoryDataItem("theme") as string;
  const character = getStoryDataItem("character") as string;
  const subThemes = getStoryDataItem("subtheme") as string[];
  const type = getStoryDataItem("type") as string;

  if (!theme || !character || !subThemes || !type) {
    console.error("No type, theme, sub-themes or character defined.");
    return null;
  }

  const storyConfig: StoryConfig = {
    target_age: {
      name: "TODO",
      description: "TODO",
      emoji: "",
    },
    theme: {
      name: theme,
      description: `"${subThemes.join(",")}"`,
      emoji: "",
      example: "",
    },
    character: {
      name: "Generate name which fits the character description",
      description: `${character}`,
      emoji: "",
      traits: ["Generate traits which fits the character description"],
    },
    setting: {
      name: "Generate name that fits the theme and character of the story",
      description:
        "Generate description that fits the theme and character of the story",
      emoji: "",
      visualStyle: `${type}`,
    },
  };

  return storyConfig;
};

export const removeStoryDataItem = (key: keyof CreateStoryFlowData) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};

export const removeStoryDataItems = (
  keys: Array<keyof CreateStoryFlowData>,
) => {
  if (typeof window !== "undefined") {
    for (let index = 0; index < keys.length; index++) {
      localStorage.removeItem(keys[index]);
    }
  }
};

export const clearAllStoryFlowData = () => {
  if (typeof window !== "undefined") {
    removeStoryDataItems(["theme", "subtheme", "character", "type"]);
  }
};
