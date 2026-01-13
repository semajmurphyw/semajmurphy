"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import GalleryGrid from "./GalleryGrid";

interface Category {
  _id: string;
  title: string;
  slug?: {
    current: string;
  };
}

interface Photo {
  _id: string;
  title: string;
  image: any;
  date: string;
  category: Category | null;
}

interface GalleryTabsProps {
  photos: Photo[];
  categories: Category[];
}

export default function GalleryTabs({ photos, categories }: GalleryTabsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("category");

  // Get category slug from category object
  const getCategorySlug = (category: Category): string => {
    return category.slug?.current || category._id;
  };

  // Initialize active category from URL or default to first category
  const getInitialCategory = (): string => {
    if (categoryParam) {
      const category = categories.find(
        (cat) => getCategorySlug(cat) === categoryParam
      );
      if (category) return getCategorySlug(category);
    }
    return categories[0] ? getCategorySlug(categories[0]) : "";
  };

  const [activeCategorySlug, setActiveCategorySlug] = useState<string>(
    getInitialCategory()
  );

  // Update active category when URL changes (back/forward navigation)
  useEffect(() => {
    if (categoryParam) {
      const category = categories.find(
        (cat) => getCategorySlug(cat) === categoryParam
      );
      if (category) {
        setActiveCategorySlug(getCategorySlug(category));
      }
    } else if (categories.length > 0) {
      // If no category param, set to first category
      setActiveCategorySlug(getCategorySlug(categories[0]));
    }
  }, [categoryParam, categories]);

  const handleCategoryClick = (category: Category) => {
    const slug = getCategorySlug(category);
    setActiveCategorySlug(slug);
    // Update URL with query parameter using slug
    router.push(`/gallery?category=${slug}`, { scroll: false });
  };

  const filteredPhotos = photos.filter((photo) => {
    if (!photo.category) return false;
    const photoSlug = getCategorySlug(photo.category);
    return photoSlug === activeCategorySlug;
  });

  return (
    <div className="w-full h-screen relative overflow-hidden">
      {/* Tabs */}
      <div className="absolute bottom-0 left-0 flex gap-4 pb-6 pl-6 z-20 bg-transparent">
        {categories.map((category) => {
          const categorySlug = getCategorySlug(category);
          return (
            <button
              key={category._id}
              onClick={() => handleCategoryClick(category)}
              className={`cursor-pointer px-4 py-2 text-lg font-medium transition-all ${
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

      {/* Photo Grid - Horizontal Scroll */}
      <div className="h-full overflow-x-auto overflow-y-hidden">
        <GalleryGrid photos={filteredPhotos} />
      </div>
    </div>
  );
}

