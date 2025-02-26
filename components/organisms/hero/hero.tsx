"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { SparkleModel } from "./sparkle-model";
import { useRef, useEffect, useState } from "react";
import { Preload } from "@react-three/drei";
import { Environment } from "@react-three/drei";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState(0);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      setMousePosition({ x, y });
    };

    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", updateViewport);

    updateViewport();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  // Get responsive positions based on screen size
  const getSparklePositions = () => {
    const isMobile = viewport.width < 768;
    const isTablet = viewport.width < 1024;

    const baseScale = isMobile ? 0.25 : isTablet ? 0.3 : 0.4;

    // Define positions and individual scales for each star
    const starsConfig = isMobile
      ? [
          { pos: [-1.2, 0.8, -2], scale: baseScale * 1.2 },
          { pos: [1.3, -0.7, -1], scale: baseScale * 0.7 },
          { pos: [0, 1.2, -1.5], scale: baseScale * 1.4 },
          { pos: [-0.8, -1.1, -1], scale: baseScale * 0.8 },
          { pos: [1.1, 1.1, -2], scale: baseScale },
          { pos: [-1.4, 0.3, -1.2], scale: baseScale * 0.9 },
          { pos: [0.7, -0.4, -1.8], scale: baseScale * 1.1 },
          { pos: [-0.5, 0.6, -1.3], scale: baseScale * 0.6 },
        ]
      : [
          { pos: [-2.5, 1.5, -2], scale: baseScale * 1.2 },
          { pos: [2.8, -1.3, -1], scale: baseScale * 0.7 },
          { pos: [0, 2.5, -3], scale: baseScale * 1.4 },
          { pos: [-2, -1.8, -2], scale: baseScale * 0.8 },
          { pos: [2.2, 1.8, -2.5], scale: baseScale },
          { pos: [-3, 0.7, -1.5], scale: baseScale * 0.9 },
          { pos: [1.5, -0.8, -2.2], scale: baseScale * 1.1 },
          { pos: [-1.2, 1.2, -1.8], scale: baseScale * 0.6 },
        ];

    return {
      starsConfig: starsConfig as {
        pos: [number, number, number];
        scale: number;
      }[],
    };
  };

  const { starsConfig } = getSparklePositions();

  return (
    <section
      ref={containerRef}
      id="hero-section"
      className="relative w-full h-[90vh] flex lg:items-center justify-center overflow-hidden bg-black"
    >
      {/* 3D Background */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, viewport.width < 768 ? 3 : 5], fov: 50 }}
        >
          {/* Environment and lighting */}
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1}
            castShadow
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          {starsConfig.map((config, index) => (
            <SparkleModel
              key={index}
              position={config.pos}
              rotationOffset={index * 2}
              mousePosition={mousePosition}
              scrollPosition={scrollPosition}
              scale={config.scale}
            />
          ))}

          <Preload all />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 text-white w-full max-w-5xl px-6 pt-24 lg:pt-0 xl:px-0">
        <div className="flex flex-col gap-4 items-start">
          <Badge className="w-fit">✨Powered by AI</Badge>
          <h1 className="text-3xl md:text-6xl mb-6 tracking-tighter max-w-xl">
            Create and bring children's stories to life with AI
          </h1>
        </div>

        <p className="text-base md:text-md text-gray-100 max-w-xl">
          Transform your ideas into interactive digital stories in minutes.
          Easily create immersive magical stories with custom characters and
          professional narration — all with a few simple clicks. Perfect for
          parents, teachers, and storytellers.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/create">Get started</Link>
        </Button>
      </div>
    </section>
  );
};

export { Hero };
