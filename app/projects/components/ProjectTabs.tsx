"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProjectList from "./ProjectList";

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
    setActiveCategory(category);
    // Update URL with query parameter
    router.push(`/projects?category=${category}`, { scroll: false });
  };

  const filteredProjects = projects.filter((project) => {
    return project.category === activeCategory;
  });

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex gap-4 pb-4 mb-8 justify-center">
        {uniqueCategories.map((category) => {
          const displayName =
            categoryDisplayNames[category] || category || "All";
          return (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`cursor-pointer px-4 py-2 text-lg font-medium transition-colors ${
                activeCategory === category
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              style={{ fontFamily: 'var(--font-figtree), sans-serif' }}
            >
              {displayName}
            </button>
          );
        })}
      </div>

      {/* Project List */}
      <ProjectList projects={filteredProjects} />
    </div>
  );
}

