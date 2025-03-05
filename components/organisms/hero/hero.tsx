"use client";

import { Button } from "@/components/ui/button";
import { SparklesText } from "@/components/ui/magicui/sparkles-text";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Wand2 } from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { adventureEmojis } from "./adventureEmojis";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { cn } from "@/lib/utils";
import { AnimatedBackground } from "./animated-background";

const placeholderTexts = [
  "A magical unicorn in a candy forest...",
  "A brave little robot learning to fly...",
  "A friendly dragon's first day at school...",
  "An adventurous cat discovering a secret garden...",
];

const Hero = () => {
  const [storyIdea, setStoryIdea] = useState("");
  const [currentPlaceholder, setCurrentPlaceholder] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentEmoji, setCurrentEmoji] = useState(adventureEmojis[0]);
  const lastPosition = useRef({ x: 0, y: 0 });
  const [showEmoji, setShowEmoji] = useState(false);
  const router = useRouter();

  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const typingInterval = setInterval(() => {
      if (charIndex < placeholderTexts[placeholderIndex].length) {
        setCurrentPlaceholder((prev) =>
          placeholderTexts[placeholderIndex].slice(0, charIndex + 1)
        );
        setCharIndex((prev) => prev + 1);
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setCurrentPlaceholder("");
          setCharIndex(0);
          setPlaceholderIndex((prev) => (prev + 1) % placeholderTexts.length);
        }, 2000);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [charIndex, placeholderIndex]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;

    const distance = Math.sqrt(
      Math.pow(x - lastPosition.current.x, 2) +
        Math.pow(y - lastPosition.current.y, 2)
    );

    if (distance > 100) {
      setCurrentEmoji(
        adventureEmojis[Math.floor(Math.random() * adventureEmojis.length)]
      );
      lastPosition.current = { x, y };
    }

    setMousePosition({ x, y });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (storyIdea.trim()) {
      localStorage.setItem("storyIdea", storyIdea.trim());
      router.push(`/create?idea=${encodeURIComponent(storyIdea.trim())}`);
    }
  };

  return (
    <section className="relative w-full h-[90vh] flex justify-center overflow-hidden pt-20">
      <AnimatedBackground />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none z-[1]" />
      <div
        ref={containerRef}
        className="flex items-center flex-col relative z-10 w-full max-w-5xl px-6 xl:px-0"
      >
        <motion.div
          className="flex flex-col gap-4 items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div
            className={cn(
              "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
            )}
          >
            <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400 text-sm">
              <span>✨ Empower your imagination</span>
            </AnimatedShinyText>
          </div>
          <motion.h1
            className="text-3xl font-semibold sm:text-6xl md:text-7xl mb-6 tracking-tighter leading-tight max-w-3xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Create and bring children's stories to
            <div className="inline-block mx-3 relative">
              <SparklesText
                text="life"
                className="text-3xl sm:text-6xl md:text-7xl font-extrabold relative"
                data-text="life"
              />
            </div>
            with AI
          </motion.h1>
        </motion.div>

        <motion.p
          className="text-base md:text-md text-muted-foreground max-w-xl text-center mb-8 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          We help you transform ideas into interactive <b>digital stories</b>.
          Easily create magical stories with professional narration, all with a
          few simple clicks. <b>Perfect</b> for parents, teachers, and
          storytellers.
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-2 w-full max-w-2xl relative mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Input
            value={storyIdea}
            onChange={(e) => setStoryIdea(e.target.value)}
            placeholder={currentPlaceholder}
            className="h-12 text-sm rounded-lg px-4 py-4 transition-shadow duration-500 ease-out shadow-[0_0_20px_rgba(0,0,0,0.05)] hover:shadow-[0_0_40px_rgba(0,0,0,0.15)] dark:shadow-[0_0_20px_rgba(255,255,255,0.05)] dark:hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]"
            maxLength={100}
            onMouseEnter={() => setShowEmoji(true)}
            onMouseLeave={() => setShowEmoji(false)}
            onMouseMove={handleMouseMove}
          />
          <AnimatePresence>
            {showEmoji && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  duration: 0.15,
                  ease: "easeOut",
                }}
                className="pointer-events-none fixed z-50 flex flex-col items-center"
                style={{
                  position: "fixed",
                  left: mousePosition.x,
                  top: mousePosition.y - 90,
                  transform: "translateX(-50%)",
                }}
              >
                <div className="relative">
                  <div className="absolute -bottom-1 left-1 w-2 h-2 bg-foreground/60 backdrop-blur-sm rounded-full" />
                  <div className="absolute -bottom-3 left-0 w-1.5 h-1.5 bg-foreground/60 backdrop-blur-sm rounded-full" />
                  <div className="w-12 h-12 bg-foreground/10 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                    <motion.span
                      key={currentEmoji}
                      initial={{ scale: 0.5, y: 10 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                        mass: 0.5,
                      }}
                      className="text-xl relative z-10"
                    >
                      {currentEmoji}
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <Button type="submit" size="lg" className="h-12 group">
            <Wand2 className="mr-1 h-5 w-5 group-hover:animate-shake" />
            Create story
          </Button>
        </motion.form>
      </div>
    </section>
  );
};

export { Hero };
