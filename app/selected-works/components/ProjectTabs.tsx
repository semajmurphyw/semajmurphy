"use client";

import { useState, useEffect, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import VerticalProjectSlider from "./VerticalProjectSlider";

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

interface ProjectTabsProps {
  projects: Project[];
}

// Category display names mapping
const categoryDisplayNames: Record<string, string> = {
  performance: "Performance",
  music: "Music",
  creative: "Creative",
  collaboration: "Collaboration",
};

export default function ProjectTabs({ projects }: ProjectTabsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const categoryParam = searchParams.get("category");

  // Get unique categories from projects
  const uniqueCategories = Array.from(
    new Set(projects.map((project) => project.category))
  ).filter(Boolean);

  // Initialize active category from URL or default to first category
  const getInitialCategory = (): string => {
    if (categoryParam && uniqueCategories.includes(categoryParam)) {
      return categoryParam;
    }
    return uniqueCategories[0] || "";
  };

  const [activeCategory, setActiveCategory] = useState<string>(
    getInitialCategory()
  );

  // Update active category when URL changes (back/forward navigation)
  useEffect(() => {
    if (categoryParam && uniqueCategories.includes(categoryParam)) {
      setActiveCategory(categoryParam);
    } else if (uniqueCategories.length > 0) {
      // If no category param, set to first category
      setActiveCategory(uniqueCategories[0]);
    }
  }, [categoryParam, uniqueCategories]);

  const handleCategoryClick = (category: string) => {
    // Update state immediately for instant UI feedback
    setActiveCategory(category);
    // Update URL in a transition to prevent blocking
    startTransition(() => {
      router.replace(`/selected-works?category=${category}`, { scroll: false });
    });
  };

  const filteredProjects = projects.filter((project) => {
    return project.category === activeCategory;
  });

  return (
    <div className="w-full relative">
      {/* Tabs */}
      <div className="absolute bottom-0 left-0 flex flex-wrap gap-4 pb-[20vh] md:pb-6 pl-6 z-30 bg-transparent">
        {uniqueCategories.map((category) => {
          const displayName =
            categoryDisplayNames[category] || category || "All";
          return (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`cursor-pointer px-4 py-2 text-lg font-medium transition-all ${
                activeCategory === category
                  ? "text-white underline"
                  : "text-white hover:underline"
              }`}
              style={{ fontFamily: 'var(--font-figtree), sans-serif' }}
            >
              {displayName}
            </button>
          );
        })}
      </div>

      {/* Vertical Project Slider */}
      <div className="h-screen transition-opacity duration-200" style={{ opacity: isPending ? 0.7 : 1 }}>
        <VerticalProjectSlider key={activeCategory} projects={filteredProjects} />
      </div>
    </div>
  );
}

