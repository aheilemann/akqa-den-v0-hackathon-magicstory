"use client";

import { motion } from "framer-motion";
import { StoryCard } from "@/components/molecules/story-card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export type Story = {
  id: number;
  title: string;
  description: string;
  emoji?: string;
  imageUrl?: string;
};

export type StoryListProps = {
  stories: Story[];
};

export function StoryList({ stories }: StoryListProps) {
  const storiesContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.1,
      },
    },
  };

  if (!stories.length) {
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
    <motion.div variants={storiesContainer}>
      {/* TODO: Add pagination and infinite scroll to load more stories */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </motion.div>
  );
}
