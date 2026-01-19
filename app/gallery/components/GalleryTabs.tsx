"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import GalleryGrid from "./GalleryGrid";

interface GalleryItem {
  _id: string;
  title: string;
  image: any;
  date: string;
  videoUrl?: string;
}

interface Category {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  galleryItems?: GalleryItem[];
}

interface GalleryTabsProps {
  categories: Category[];
}

export default function GalleryTabs({ categories }: GalleryTabsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("category");

  // Priority order for specific categories
  const categoryPriority = ['Editorial', 'Performance', 'Teaching', 'Credits'];

  // Sort categories: priority categories first in specified order, then others alphabetically
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      const aIndex = categoryPriority.indexOf(a.title);
      const bIndex = categoryPriority.indexOf(b.title);
      
      // If both are in priority list, sort by priority order
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      // If only a is in priority list, a comes first
      if (aIndex !== -1) return -1;
      // If only b is in priority list, b comes first
      if (bIndex !== -1) return 1;
      // If neither is in priority list, sort alphabetically
      return a.title.localeCompare(b.title);
    });
  }, [categories]);

  // Get category slug from category object
  const getCategorySlug = (category: Category): string => {
    return category.slug?.current || category._id;
  };

  // Initialize active category from URL or default to first category
  const getInitialCategory = (): string => {
    if (categoryParam) {
      const category = sortedCategories.find(
        (cat) => getCategorySlug(cat) === categoryParam
      );
      if (category) return getCategorySlug(category);
    }
    return sortedCategories[0] ? getCategorySlug(sortedCategories[0]) : "";
  };

  const [activeCategorySlug, setActiveCategorySlug] = useState<string>(
    getInitialCategory()
  );

  // Update active category when URL changes (back/forward navigation)
  useEffect(() => {
    if (categoryParam) {
      const category = sortedCategories.find(
        (cat) => getCategorySlug(cat) === categoryParam
      );
      if (category) {
        setActiveCategorySlug(getCategorySlug(category));
      }
    } else if (sortedCategories.length > 0) {
      // If no category param, set to first category
      setActiveCategorySlug(getCategorySlug(sortedCategories[0]));
    }
  }, [categoryParam, sortedCategories]);

  const handleCategoryClick = (category: Category) => {
    const slug = getCategorySlug(category);
    setActiveCategorySlug(slug);
    // Update URL with query parameter using slug
    router.push(`/gallery?category=${slug}`, { scroll: false });
  };

  // Get gallery items for the active category
  const activeCategory = sortedCategories.find(
    (cat) => getCategorySlug(cat) === activeCategorySlug
  );
  const galleryItems = activeCategory?.galleryItems || [];

  return (
    <div className="w-full h-screen md:h-screen relative overflow-hidden flex flex-col md:block">
      {/* Photo Grid Container - Scrollable on Mobile */}
      <div className="flex-1 md:h-full overflow-y-auto md:overflow-x-auto md:overflow-y-hidden">
        {/* Gallery text - Mobile only, scrolls with content */}
        <div className="md:hidden px-6 pt-[40vh] pb-0">
          <h2 className="text-white text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            gallery
          </h2>
        </div>
        
        {/* Tabs - Mobile scrolls with content, Desktop fixed */}
        <div className="flex flex-wrap gap-2 md:gap-4 px-6 pr-12 pt-2 pb-8 md:pr-6 md:pt-6 md:absolute md:bottom-0 md:left-0 md:pb-6 md:pl-6 z-[100] bg-transparent">
          {sortedCategories.map((category) => {
            const categorySlug = getCategorySlug(category);
            return (
              <button
                key={category._id}
                onClick={() => handleCategoryClick(category)}
                className={`cursor-pointer px-0 py-1.5 md:px-4 md:py-2 text-sm md:text-lg font-medium transition-all ${
                  activeCategorySlug === categorySlug
                    ? "text-white underline"
                    : "text-white hover:underline"
                }`}
                style={{ fontFamily: 'var(--font-figtree), sans-serif' }}
              >
                {category.title}
              </button>
            );
          })}
        </div>

        {/* Photo Grid */}
        <GalleryGrid photos={galleryItems} />
      </div>
    </div>
  );
}

