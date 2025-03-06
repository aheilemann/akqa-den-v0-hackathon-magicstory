"use client";

import { ImageData } from "@/types/create-story";
import { createContext, useContext, useState, ReactNode } from "react";

// Define a more specific type for storyData
interface StoryData {
  idea?: string;
  // Add other fields as needed for the story creation process
}

interface CreateContextType {
  imageData: ImageData[] | null;
  setImageData: (data: ImageData[] | null) => void;
  storyData: StoryData | null;
  setStoryData: (data: StoryData | null) => void;
}

const CreateContext = createContext<CreateContextType | undefined>(undefined);

interface CreateProviderProps {
  children: ReactNode;
}

export const CreateProvider: React.FC<CreateProviderProps> = ({ children }) => {
  const [imageData, setImageData] = useState<ImageData[] | null>(null);
  const [storyData, setStoryData] = useState<StoryData | null>(null);

  const value: CreateContextType = {
    imageData,
    setImageData,
    storyData,
    setStoryData
  };

  return (
    <CreateContext.Provider value={value}>{children}</CreateContext.Provider>
  );
};

export const useCreateContext = () => {
  const context = useContext(CreateContext);
  if (!context) {
    throw new Error("useCreateContext must be used within a CreateProvider");
  }
  return context;
};
