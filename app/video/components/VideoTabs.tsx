"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import VideoGrid from "./VideoGrid";

interface Video {
  _id: string;
  title: string;
  youtubeLink: string;
  date: string;
  category: string;
}

interface VideoTabsProps {
  videos: Video[];
}

// Category display names mapping
const categoryDisplayNames: Record<string, string> = {
  "live-performances": "Live Performances",
  "media-features": "Media Features",
};

export default function VideoTabs({ videos }: VideoTabsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("category");

  // Get unique categories from videos
  const uniqueCategories = Array.from(
    new Set(videos.map((video) => video.category))
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
    router.push(`/video?category=${category}`, { scroll: false });
  };

  const filteredVideos = videos.filter((video) => {
    return video.category === activeCategory;
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

      {/* Video Grid */}
      <VideoGrid videos={filteredVideos} />
    </div>
  );
}

