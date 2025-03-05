"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useRef, MouseEvent } from "react";
import { Story } from "@/components/organisms/story-list/story-list";
import { deleteStory } from "@/app/actions";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export type StoryCardProps = {
  story: Story;
};

const wiggleKeyframes = `
@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-7deg); }
  75% { transform: rotate(7deg); }
}
`;

const storyItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

export function StoryCard({ story }: StoryCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });
  };

  const handleDelete = async (e: MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      const result = await deleteStory(story.story_id);
      if (result.success) {
        toast.success("Story deleted successfully");
        router.refresh(); // Refresh the page to update the story list
      } else {
        throw result.error;
      }
    } catch (error) {
      console.error("Error deleting story:", error);
      toast.error("Failed to delete story. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  // Extract data from story content
  const content = story.story_content || {};
  const coverImage = content.pages?.[0]?.imageUrl;
  const title = story.story_title || content.title;

  return (
    <>
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Story</DialogTitle>
            <DialogDescription>Are you sure you want to delete "{title}"? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Link href={`/story/${story.story_id}`}>
        <motion.div ref={cardRef} variants={storyItem} onMouseMove={handleMouseMove} className="relative aspect-[9/16] rounded-md overflow-hidden group">
          {/* Gradient Border - Updated opacity and colors */}
          <div className="absolute inset-0 rounded-md p-[2px] bg-gradient-to-b from-white/30 to-white/10 dark:from-white/20 dark:to-white/[0.05]">
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40 dark:from-black/20 dark:to-black/80 rounded-md" />
          </div>

          {/* Card Content Container */}
          <div className="relative w-full h-full rounded-[5px] overflow-hidden bg-card">
            {/* Background Image with Gradient */}
            <div className="absolute inset-0">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundImage: coverImage ? `url(${coverImage})` : undefined,
                  backgroundColor: "hsl(var(--muted))",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/40" />

            {/* Spotlight Effect */}
            <div
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-soft-light"
              style={{
                background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.9), transparent 40%)`,
              }}
            />

            {/* Delete Button */}
            <Button onClick={handleDelete} disabled={isDeleting} size="icon" variant={"outline"} className="absolute rounded-full bg-white/70 top-4 right-4 z-10 h-9 w-9 backdrop-blur-sm">
              <Trash2Icon className="h-4 w-4" />
            </Button>

            {/* Emoji Badge */}
            <div className="absolute top-4 left-4">
              <div className="bg-black/80 dark:bg-background/80 backdrop-blur-sm p-2.5 rounded-full border border-white/20 transition-all duration-300 group-hover:scale-110">
                <span className="text-base text-white inline-block animate-none group-hover:animate-[wiggle_0.3s_ease-in-out]">{story.emoji || "✨"}</span>
              </div>
            </div>

            {/* Content */}
            <div className="absolute inset-x-0 bottom-0 p-5 transition-transform duration-300 group-hover:translate-y-[-4px]">
              <h4 className="font-medium text-2xl tracking-tight text-white">{title}</h4>
            </div>
          </div>
        </motion.div>
      </Link>
    </>
  );
}
