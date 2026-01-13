"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { urlFor } from "@/sanity/lib/image";

interface Project {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  category: string;
  date: string;
  excerpt?: string;
  mainImage?: any;
}

interface VerticalProjectSliderProps {
  projects: Project[];
}

export default function VerticalProjectSlider({ projects }: VerticalProjectSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset active index when projects change
  useEffect(() => {
    setActiveIndex(0);
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [projects]);

  useEffect(() => {
    if (projects.length === 0) return;

    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const scrollTop = container.scrollTop;
      const itemHeight = container.clientHeight;
      const newIndex = Math.round(scrollTop / itemHeight);
      
      if (newIndex >= 0 && newIndex < projects.length) {
        setActiveIndex((prevIndex) => {
          if (prevIndex !== newIndex) {
            return newIndex;
          }
          return prevIndex;
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      // Set initial index
      handleScroll();
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [projects.length]);

  const scrollToIndex = (index: number) => {
    if (!containerRef.current) return;
    const itemHeight = containerRef.current.clientHeight;
    containerRef.current.scrollTo({
      top: index * itemHeight,
      behavior: "smooth",
    });
  };

  if (projects.length === 0) {
    return (
      <p className="text-center text-gray-400 py-12">
        No projects found in this category.
      </p>
    );
  }

  return (
    <div className="flex h-full relative">
      {/* Dot Indicators - Left Side */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className="transition-all duration-300 focus:outline-none group"
            aria-label={`Go to project ${index + 1}`}
          >
            <div
              className={`rounded-full transition-all duration-300 ${
                activeIndex === index
                  ? "bg-white w-3 h-3"
                  : "bg-gray-500 w-2 h-2 group-hover:bg-gray-300"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Images Container - Fade in/out based on active index */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {projects.map((project, index) => {
          const imageUrl = project.mainImage
            ? urlFor(project.mainImage).width(1200).url()
            : null;

          if (!imageUrl) return null;

          return (
            <motion.div
              key={project._id}
              className="absolute top-1/2 right-[15%]"
              style={{ transform: 'translateY(calc(-50% + 10vh))' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: activeIndex === index ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={imageUrl}
                alt={project.title}
                className="w-[30vw]"
                style={{ height: 'auto', maxHeight: '80vh', display: 'block', objectFit: 'contain' }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Slider Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        style={{
          scrollBehavior: "smooth",
        }}
      >
        {projects.map((project, index) => {
          return (
            <div
              key={project._id}
              className="h-full snap-start snap-always relative"
            >
              {/* Text Content - Built from center, moved 25vh lower and 25vw left, then slightly more left */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute top-1/2 left-[calc(50%-32vw)] z-20 max-w-4xl"
                style={{ transform: 'translateY(calc(-50% + 25vh))', textAlign: 'left' }}
              >
                <Link href={`/selected-works/${project.slug.current}`}>
                  <h2 className="text-white text-5xl md:text-6xl lg:text-7xl font-bold mb-6 hover:underline transition-all cursor-pointer leading-tight">
                    {project.title}
                  </h2>
                </Link>
                {project.excerpt && (
                  <p className="text-white text-lg leading-relaxed text-left">
                    {project.excerpt}
                  </p>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

