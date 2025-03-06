"use client";

import { motion, useInView } from "framer-motion";
import { StoryCard } from "@/components/molecules/story-card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export type Story = {
  story_id: string;
  story_title: string;
  story_content: {
    title: string;
    summary: string;
    pages: Array<{
      text: string;
      imagePrompt: string;
      imageUrl: string;
    }>;
  };
  story_created_at: string;
  story_updated_at: string;
  story_user_id: string;
  emoji?: string;
};

export type StoryListProps = {
  stories: Story[];
  hideHeadline?: boolean;
  rowCount?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
  showButtons?: boolean;
};

export function StoryList({
  stories,
  hideHeadline = false,
  rowCount = {
    sm: 2,
    md: 3,
    lg: 3,
  },
  showButtons = true,
}: StoryListProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const getGridClasses = () => {
    const baseClasses = "grid gap-4";
    const smCols = `sm:grid-cols-${rowCount.sm}`;
    const mdCols = `md:grid-cols-${rowCount.md}`;
    const lgCols = `lg:grid-cols-${rowCount.lg}`;
    return `${baseClasses} ${smCols} ${mdCols} ${lgCols}`;
  };

  const storiesContainer = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.25,
        delayChildren: 0.1,
      },
    },
  };

  const storyItem = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (!stories || stories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">✨</span>
        </div>
        <h3 className="text-lg font-medium mb-2">No stories yet</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Create your first AI story and share it with the world
        </p>
        <Link href="/create">
          <Button>
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Story
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      variants={storiesContainer}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      className="w-full"
    >
      {!hideHeadline && (
        <h3 className="text-lg font-medium tracking-tight mb-4">
          Stories {"(" + stories.length + ")"}
        </h3>
      )}
      <div className={getGridClasses()}>
        {stories.map((story) => (
          <motion.div key={story.story_id} variants={storyItem}>
            <StoryCard story={story} showButtons={showButtons} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
