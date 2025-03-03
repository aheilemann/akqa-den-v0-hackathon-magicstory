"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { createStoryPrompt } from "@/lib/prompt/story";
import { type Story, type StoryConfig } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface StoryGeneratorProps {
  settings: StoryConfig;
}

const StoryGenerator = ({ settings }: StoryGeneratorProps) => {
  const USE_STATIC_STORY = process.env.NEXT_PUBLIC_USE_STATIC_STORY === "true";

  const [error, setError] = useState<string | null>(null);
  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [generatingImages, setGeneratingImages] = useState(false);
  const [imagesFetched, setImagesFetched] = useState(false);

  const generateAllImages = useCallback(async () => {
    if (!story) return;
    setGeneratingImages(true);

    try {
      let results;
      if (!USE_STATIC_STORY) {
        const imagePromises = story.pages.map(
          async (page: { imagePrompt: string }, index: number) => {
            const response = await fetch("/api/generate-image", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ prompt: page.imagePrompt }),
            });
            if (!response.ok)
              throw new Error(`Failed to generate image ${index + 1}`);
            const data = await response.json();
            return { index, imageUrl: `data:image/png;base64,${data.base64}` };
          },
        );

        results = await Promise.all(imagePromises);
      } else {
        results = [
          { index: 0, imageUrl: "Static - Test Image Text #1" },
          { index: 1, imageUrl: "Static - Test Image Text #2" },
        ];
      }

      setStory((prev: Story | null) => {
        if (!prev) return prev;
        const newPages = [...prev.pages];

        results.forEach(
          ({ index, imageUrl }: { index: number; imageUrl: string }): void => {
            newPages[index] = { ...newPages[index], imageUrl };
          },
        );
        return { ...prev, pages: newPages };
      });
    } catch (error) {
      console.error("Error generating images:", error);
    } finally {
      setImagesFetched(true);
      setGeneratingImages(false);
    }
  }, [story]);

  useEffect(() => {
    if (story && !generatingImages && !imagesFetched) {
      generateAllImages();
    }
  }, [imagesFetched, generateAllImages]);

  const generateStory = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const prompt = createStoryPrompt(settings);
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate story");
      }

      const storyData = await response.json();
      console.log("Frontend story data:", storyData);

      setStory(storyData);
    } catch (err) {
      setError("Failed to generate story. Please try again.");
      console.error("Error generating story:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">
            Creating your magical story...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-4xl mx-auto p-6">
        <div className="text-red-500 text-center mb-4">{error}</div>
        <Button onClick={generateStory} className="w-full">
          Try Again
        </Button>
      </Card>
    );
  }
  if (story) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">{story.title}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image side */}
          <div className="relative aspect-square w-full">
            {story.pages[currentPage].imageUrl ? (
              <div>
                {USE_STATIC_STORY ? (
                  <p>{story.pages[currentPage].imageUrl}</p>
                ) : (
                  <Image
                    src={story.pages[currentPage].imageUrl}
                    alt={`Story illustration ${currentPage + 1}`}
                    fill
                    className="object-cover rounded-lg"
                    priority
                  />
                )}
              </div>
            ) : (
              <div className="w-full h-full relative">
                <Skeleton className="absolute inset-0 rounded-lg" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Text side */}
          <div className="flex flex-col justify-center">
            <p className="text-lg leading-relaxed">
              {story.pages[currentPage].text}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous Page
          </Button>
          <p className="text-muted-foreground">
            Page {currentPage + 1} of {story.pages.length}
          </p>
          <Button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === story.pages.length - 1}
          >
            Next Page
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto p-6">
      <Button onClick={generateStory} className="w-full">
        Generate Story
      </Button>
    </Card>
  );
};

export { StoryGenerator, type StoryGeneratorProps };
