"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  pauseOnHover?: boolean;
  reverse?: boolean;
  fade?: boolean;
}

export const Marquee = React.forwardRef<HTMLDivElement, MarqueeProps>(
  ({ children, className, pauseOnHover, reverse, fade, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full overflow-hidden [--duration:40s] [--gap:1rem]",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "flex w-max animate-marquee items-stretch gap-[--gap]",
            pauseOnHover && "hover:[animation-play-state:paused]",
            reverse && "animate-marquee-reverse",
            fade && "mask-linear-gradient"
          )}
        >
          {children}
          {children}
        </div>
      </div>
    );
  }
);

Marquee.displayName = "Marquee";
