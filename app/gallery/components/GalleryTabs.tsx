"use client";

import { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

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
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    categories[0]?._id || ""
  );

  const filteredPhotos = photos.filter(
    (photo) => photo.category?._id === activeCategoryId
  );

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-300 pb-4 mb-8">
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => setActiveCategoryId(category._id)}
            className={`px-4 py-2 text-lg font-medium uppercase transition-colors ${
              activeCategoryId === category._id
                ? "text-black border-b-2 border-black"
                : "text-gray-600 hover:text-black"
            }`}
          >
            {category.title}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      {filteredPhotos.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredPhotos.map((photo) => {
            const imageUrl = photo.image
              ? urlFor(photo.image).width(800).height(800).url()
              : null;
            return (
              <div key={photo._id} className="relative aspect-square w-full">
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={photo.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-600 py-12">
          No photos found in this category.
        </p>
      )}
    </div>
  );
}

