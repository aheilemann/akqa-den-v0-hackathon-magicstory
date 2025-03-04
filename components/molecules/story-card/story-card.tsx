"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useRef, MouseEvent } from "react";
import { Story } from "@/components/organisms/story-list/story-list";

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
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });
  };

  return (
    <Link href={`/story/${story.id}`}>
      <motion.div
        ref={cardRef}
        variants={storyItem}
        onMouseMove={handleMouseMove}
        className="relative aspect-[9/16] rounded-md overflow-hidden group"
      >
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
                backgroundImage: story.imageUrl
                  ? `url(${story.imageUrl})`
                  : undefined,
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

          {/* Emoji Badge - Updated background color for light mode */}
          <div className="absolute top-4 left-4">
            <div className="bg-black/80 dark:bg-background/80 backdrop-blur-sm p-2.5 rounded-full border border-white/20 transition-all duration-300 group-hover:scale-110">
              <span className="text-base text-white inline-block animate-none group-hover:animate-[wiggle_0.3s_ease-in-out]">
                {story.emoji || "✨"}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="absolute inset-x-0 bottom-0 h-[120px] p-5 flex flex-col transition-transform duration-300 group-hover:translate-y-[-4px]">
            <h4 className="font-medium text-2xl tracking-tight text-white">
              {story.title}
            </h4>
            <p className="text-sm text-white/70 line-clamp-2 mt-2">
              {story.description}
            </p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
