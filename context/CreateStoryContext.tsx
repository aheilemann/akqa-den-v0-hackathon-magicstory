"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface CreateContextType {
  imageData: any | null; // Replace 'any' with a more specific type
  setImageData: (data: any | null) => void;
  storyData: any | null;
  setStoryData: (data: any | null) => void;
}

const CreateContext = createContext<CreateContextType | undefined>(undefined);

interface CreateProviderProps {
  children: ReactNode;
}

export const CreateProvider: React.FC<CreateProviderProps> = ({ children }) => {
  const [imageData, setImageData] = useState<any | null>(null);
  const [storyData, setStoryData] = useState<any | null>(null);

  const value: CreateContextType = {
    imageData,
    setImageData,
    storyData,
    setStoryData,
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
