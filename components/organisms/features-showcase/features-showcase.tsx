"use client";

import { Camera, Wand2, Image, Mic, Book } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { GlowingEffect } from "@/components/magicui/glowing-effect";

const features = [
  {
    title: "Capture & Create",
    description:
      "Take a picture of your favorite toy and watch as AI transforms it into a magical character in your very own personalized story. Perfect for bringing beloved playtime companions to life!",
    icon: Camera,
    area: "md:[grid-area:1/1/3/7] xl:[grid-area:1/1/3/5]",
  },
  {
    title: "Story Generation",
    description:
      "Transform simple ideas into rich, engaging narratives with our AI storytelling engine. Each story is uniquely crafted with age-appropriate content and educational values.",
    icon: Wand2,
    area: "md:[grid-area:1/7/2/13] xl:[grid-area:1/5/2/9]",
  },
  {
    title: "Visual Magic",
    description:
      "Every story comes to life with beautiful, AI-generated illustrations that perfectly match your narrative. Create stunning visuals that capture children's imagination.",
    icon: Image,
    area: "md:[grid-area:2/7/3/13] xl:[grid-area:2/5/3/9]",
  },
  {
    title: "Professional Narration",
    description:
      "Enhance your stories with high-quality AI narration that brings characters to life. Multiple voices and emotions make each story a captivating audio experience.",
    icon: Mic,
    area: "md:[grid-area:3/1/4/7] xl:[grid-area:1/9/2/13]",
  },
  {
    title: "Interactive Learning",
    description:
      "Stories adapt to include educational elements and moral lessons, making learning fun and engaging. Perfect for parents and educators looking to combine entertainment with education.",
    icon: Book,
    area: "md:[grid-area:3/7/4/13] xl:[grid-area:2/9/3/13]",
  },
];

type FeatureCardProps = {
  feature: (typeof features)[0];
};

const cardVariants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.03,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

const FeatureCard = ({ feature }: FeatureCardProps) => {
  const Icon = feature.icon;

  return (
    <motion.li
      className={cn(
        "min-h-[14rem] list-none group cursor-pointer",
        feature.area
      )}
      initial="initial"
      whileHover="hover"
      animate="initial"
      variants={cardVariants}
    >
      <div className="relative h-full rounded-xl border border-foreground/10 hover:border-foreground/40 transition-colors duration-500 ease-out hover:shadow-lg hover:shadow-foreground/10 hover:bg-gradient-to-b hover:from-foreground/10 hover:to-background/10">
        <GlowingEffect
          spread={20}
          glow={false}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-0.75 p-6">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-full border border-gray-600 p-4 transition-colors duration-300 ease-out group-hover:bg-foreground group-hover:border-background">
              <Icon className="h-4 w-4 text-black dark:text-neutral-400 transition-colors duration-300 ease-out group-hover:text-background group-hover:animate-shake" />
            </div>
            <div className="space-y-3">
              <h3 className="pt-0.5 text-xl font-medium md:text-2xl text-balance text-black dark:text-white">
                {feature.title}
              </h3>
              <p className="font-sans text-sm md:text-base text-muted-foreground">
                {feature.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.li>
  );
};

export const FeaturesShowcase = () => {
  return (
    <section className="relative w-full min-h-screen flex justify-center overflow-hidden pb-20">
      <div className="flex items-center flex-col relative z-10 w-full max-w-7xl px-6 2xl:px-0">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-semibold sm:text-4xl md:text-5xl mb-4 leading-tight">
            Magical Features
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto">
            Transform your storytelling experience with our innovative
            AI-powered features
          </p>
        </motion.div>

        <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2 w-full">
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} />
          ))}
        </ul>
      </div>
    </section>
  );
};
