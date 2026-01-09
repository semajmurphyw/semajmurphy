"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { motion } from "framer-motion";

interface Project {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  category: string;
  date: string;
  releaseInfo: any;
  credits: any;
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

      {/* Slider Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        style={{
          scrollBehavior: "smooth",
        }}
      >
        {projects.map((project, index) => (
          <div
            key={project._id}
            className="h-full snap-start snap-always flex items-center px-6 md:px-12 lg:px-24"
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-4xl mx-auto"
            >
              <Link href={`/selected-works/${project.slug.current}`}>
                <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-6 hover:underline transition-all cursor-pointer">
                  {project.title}
                </h2>
              </Link>
              {project.credits && (
                <div className="text-white text-lg leading-relaxed [&_p]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-2 [&_strong]:font-bold [&_em]:italic [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_li]:mb-2">
                  <PortableText value={project.credits} />
                </div>
              )}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

