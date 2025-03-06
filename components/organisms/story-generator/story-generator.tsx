"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, ChevronRight, Save } from "lucide-react";
import { createStoryPrompt } from "@/lib/prompt/story";
import { type Story, type StoryConfig } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { saveStory } from "@/app/actions";
import { toast } from "sonner";
import { IMAGE_PROMPT } from "@/lib/prompt";
import { ImageData } from "@/types/create-story";

interface StoryGeneratorProps {
  settings: StoryConfig;
  onLimitReached?: (limit: number) => void;
}

const StoryGenerator = ({ settings, onLimitReached }: StoryGeneratorProps) => {
  const DISABLE_IMAGE_GENERATION =
    process.env.DISABLE_IMAGE_GENERATION === "true";

  const [error, setError] = useState<string | null>(null);
  const [story, setStory] = useState<Story | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [generatingImages, setGeneratingImages] = useState(false);
  const [generatingStory, setGeneratingStory] = useState(false);
  const [hasGeneratedStory, setHasGeneratedStory] = useState(false);
  const [imagesFetched, setImagesFetched] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchGeneratedIamges = useCallback(async () => {
    if (!story) return;
    let results;
    if (!DISABLE_IMAGE_GENERATION) {
      const imagePromises = story.pages.map(
        async (page: { imagePrompt?: string }, index: number) => {
          if (typeof page.imagePrompt === "undefined") {
            throw new Error("Image prompt is undefined.");
          }
          const response = await fetch("/api/generate-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: IMAGE_PROMPT(page.imagePrompt) }),
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
  }, []);

  const generateAllImages = useCallback(() => {
    if (!story) return;
    setGeneratingImages(true);

    try {
      if (settings.imageData && settings.imageData.length > 0) {
        let images = settings.imageData;

        setStory((prev: Story | null) => {
          if (!prev) return prev;
          const newPages = [...prev.pages];

          let index = 0;
          images.forEach(({ caption, file, preview }): void => {
            newPages[index] = {
              ...newPages[index],
              imageCaption: caption,
              imageFile: file,
              imagePreview: preview,
            };
            index += 1;
          });
          return { ...prev, pages: newPages };
        });

        return;
      } else {
        fetchGeneratedIamges();
      }
    } catch (error) {
      console.error("Error generating images:", error);
    } finally {
      setImagesFetched(true);
      setGeneratingImages(false);
    }
  }, [story]);

  const generateStory = useCallback(async () => {
    try {
      setGeneratingStory(true);
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
      setGeneratingStory(false);
      setHasGeneratedStory(true);
    }
  }, []);

  const handleSaveStory = async () => {
    if (!story) return;

    setIsSaving(true);
    try {
      const result = await saveStory(story, settings);
      if (result.success) {
        toast.success("Story saved successfully!");
      } else {
        if (result.error === "LIMIT_REACHED" && onLimitReached) {
          onLimitReached(result.limit);
          return;
        }
        throw result.error;
      }
    } catch (error) {
      console.error("Error saving story:", error);
      toast.error("Failed to save story. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (story && !generatingImages && !imagesFetched) {
      generateAllImages();
    }
  }, [imagesFetched, generateAllImages]);

  useEffect(() => {
    if (!generatingStory && !hasGeneratedStory) {
      generateStory();
    }
  }, [generateStory]);

  if (generatingStory) {
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
          <Button
            onClick={handleSaveStory}
            disabled={isSaving}
            className="mt-4"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Story
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image side */}
          <div className="relative aspect-square w-full">
            {story.pages[currentPage].imageUrl ? (
              <div>
                {DISABLE_IMAGE_GENERATION ? (
                  <p>{story.pages[currentPage].imageUrl}</p>
                ) : typeof settings.imageData !== "undefined" ? (
                  <Image
                    src={story.pages[currentPage].imageUrl}
                    alt={`Story illustration ${currentPage + 1}`}
                    fill
                    className="object-cover rounded-lg"
                    priority
                  />
                ) : (
                  <Image
                    src={
                      story.pages[currentPage].imagePreview ??
                      "/placeholder.svg"
                    }
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
