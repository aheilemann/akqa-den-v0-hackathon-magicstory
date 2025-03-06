import { motion } from "framer-motion";
import { BookOpenIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MagicalLoaderProps {
  title?: string;
  subtitle?: string;
}

export function MagicalLoader({
  title = "Creating your magical story",
  subtitle = "Weaving enchantment into every word..."
}: MagicalLoaderProps) {
  const showText = title !== "" || subtitle !== "";

  return (
    <div className="relative flex items-center justify-center w-full h-full min-h-[300px] md:min-h-[400px]">
      {/* Floating magical elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Magic wand */}
        <motion.div
          className="absolute"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          style={{ left: "25%", top: "20%", width: 80, height: 80 }}
        >
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [-5, 5, -5] }}
            transition={{
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-full h-full flex items-center justify-center"
          >
            <Image
              src="/assets/img/3d-emojis/magic_wand_3d.png"
              alt="Magic Wand"
              width={80}
              height={80}
              className="w-full h-full object-contain"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Sparkles */}
        <motion.div
          className="absolute"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          style={{ left: "65%", top: "15%", width: 70, height: 70 }}
        >
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 8, 0] }}
            transition={{
              y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-full h-full flex items-center justify-center"
          >
            <Image
              src="/assets/img/3d-emojis/sparkles_3d.png"
              alt="Sparkles"
              width={70}
              height={70}
              className="w-full h-full object-contain"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Star */}
        <motion.div
          className="absolute"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          style={{ left: "75%", top: "60%", width: 90, height: 90 }}
        >
          <motion.div
            animate={{ y: [0, -12, 0], rotate: [-3, 3, -3] }}
            transition={{
              y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 5.5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-full h-full flex items-center justify-center"
          >
            <Image
              src="/assets/img/3d-emojis/star_3d.png"
              alt="Star"
              width={90}
              height={90}
              className="w-full h-full object-contain"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Unicorn */}
        <motion.div
          className="absolute"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          style={{ left: "15%", top: "65%", width: 100, height: 100 }}
        >
          <motion.div
            animate={{ y: [0, -18, 0], rotate: [2, -2, 2] }}
            transition={{
              y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-full h-full flex items-center justify-center"
          >
            <Image
              src="/assets/img/3d-emojis/unicorn_3d.png"
              alt="Unicorn"
              width={100}
              height={100}
              className="w-full h-full object-contain"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Dragon */}
        <motion.div
          className="absolute"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          style={{ left: "40%", top: "75%", width: 85, height: 85 }}
        >
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [-4, 4, -4] }}
            transition={{
              y: { duration: 4.8, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 5.8, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-full h-full flex items-center justify-center"
          >
            <Image
              src="/assets/img/3d-emojis/dragon_3d.png"
              alt="Dragon"
              width={85}
              height={85}
              className="w-full h-full object-contain"
              priority
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Central loading element */}
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "relative z-10 flex flex-col items-center gap-5 p-6 rounded-xl",
          showText
            ? "bg-background/80 backdrop-blur-sm shadow-lg"
            : "bg-transparent"
        )}
      >
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{
            rotate: { duration: 4, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="relative"
        >
          <Image
            src="/assets/img/3d-emojis/cyclone_3d.png"
            alt="Magic Cyclone"
            width={80}
            height={80}
            className="object-contain"
            priority
          />
        </motion.div>
        {showText && (
          <div className="text-center">
            <h3 className="text-xl font-medium mb-2">{title}</h3>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
