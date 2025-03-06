import { motion } from "framer-motion";
import { useRef, useMemo } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type FloatingEmoji = {
  id: number;
  imagePath: string;
  size: number;
  position: {
    x: number;
    y: number;
  };
  duration: number;
  opacity: number;
};

// Predefined positions for a scattered look
const positions = [
  { x: 5, y: 10 },
  { x: 25, y: 5 },
  { x: 60, y: 0 },
  { x: 75, y: 8 },
  { x: 90, y: 20 },
  { x: 10, y: 40 },
  { x: 30, y: 35 },
  { x: 60, y: 45 },
  { x: 85, y: 50 },
  { x: 15, y: 70 },
  { x: 40, y: 75 },
  { x: 70, y: 80 },
  { x: 90, y: 85 },
  { x: 50, y: 90 },
  { x: 20, y: 95 },
];

// Predefined sizes for variety
const sizes = [60, 80, 100, 120, 140, 160];

// Calculate distance from center and convert to opacity
const calculateOpacity = (x: number, y: number) => {
  // Center coordinates (50, 50)
  const distanceFromCenter = Math.sqrt(
    Math.pow(x - 50, 2) + Math.pow(y - 50, 2)
  );
  // Max possible distance is ~70.71 (distance from center to corner)
  // Convert distance to opacity: closer = more transparent, further = more opaque
  const opacity = (distanceFromCenter / 70.71) * 1; // Scale to max opacity of 1
  return Math.max(0.15, Math.min(0.5, opacity)); // Clamp between 0.15 and 0.5
};

const generateEmojis = () => {
  const emojiImages = [
    "/assets/img/3d-emojis/unicorn_3d.png",
    "/assets/img/3d-emojis/rainbow_3d.png",
    "/assets/img/3d-emojis/star_3d.png",
    "/assets/img/3d-emojis/magic_wand_3d.png",
    "/assets/img/3d-emojis/princess_3d_default.png",
    "/assets/img/3d-emojis/dragon_3d.png",
    "/assets/img/3d-emojis/rocket_3d.png",
    "/assets/img/3d-emojis/sparkles_3d.png",
    "/assets/img/3d-emojis/crown_3d.png",
    "/assets/img/3d-emojis/flying_saucer_3d.png",
    "/assets/img/3d-emojis/cyclone_3d.png",
    "/assets/img/3d-emojis/fire_3d.png",
    "/assets/img/3d-emojis/gem_stone_3d.png",
    "/assets/img/3d-emojis/party_popper_3d.png",
    "/assets/img/3d-emojis/alien_3d.png",
  ];

  return positions.map((pos, i) => ({
    id: i,
    imagePath: emojiImages[i % emojiImages.length],
    size: sizes[i % sizes.length],
    position: pos,
    duration: 4 + (i % 4),
    opacity: calculateOpacity(pos.x, pos.y),
  }));
};

export const AnimatedBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const emojis: FloatingEmoji[] = useMemo(() => generateEmojis(), []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {emojis.map((item: FloatingEmoji) => (
        <motion.div
          key={item.id}
          className={cn(
            "absolute",
            item.imagePath.includes("rocket") && "md:z-50"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.3,
            delay: 0.2 + item.id * 0.05,
          }}
          style={{
            left: `${item.position.x}%`,
            top: `${item.position.y}%`,
            width: item.size,
            height: item.size,
          }}
        >
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [-3, 4, -3],
            }}
            transition={{
              y: {
                duration: item.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: item.id * 0.2,
              },
              rotate: {
                duration: item.duration * 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: item.id * 0.2,
              },
            }}
            className="w-full h-full flex items-center justify-center"
            style={{ opacity: item.opacity }}
          >
            <Image
              src={item.imagePath}
              alt="Decorative 3D emoji"
              width={item.size}
              height={item.size}
              className="w-full h-full object-contain"
              sizes="(max-width: 768px) 60px,
                     (max-width: 1200px) 120px,
                     160px"
            />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};
